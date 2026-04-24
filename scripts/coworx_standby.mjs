#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();
const defaultStateDir = join(root, ".coworx-private", "standby");
const defaultStatePath = join(defaultStateDir, "state.json");
const defaultConfigPath = join(defaultStateDir, "config.json");
const defaultStatusPath = join(defaultStateDir, "status.md");
const defaultEventsPath = join(defaultStateDir, "events.ndjson");
const version = 1;
const allowedNotificationMethods = new Set([
  "local_status_file",
  "local_status_file_only",
  "desktop_notification",
  "discord_private_channel_or_webhook",
  "discord_webhook",
  "imessage",
  "messages_or_imessage_if_available",
  "sms_email",
  "sms_or_email_if_later_configured",
]);

const meaningfulEvents = new Set([
  "standby_started",
  "standby_stopped",
  "standby_paused",
  "standby_resumed",
  "task_completed",
  "milestone_reached",
  "blocker",
  "approval_needed",
  "login_needed",
  "outputs_ready",
  "max_runtime_reached",
  "config_initialized",
]);

function nowIso() {
  return new Date().toISOString();
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function usage(exitCode = 0) {
  const text = `Coworx Standby Mode

Commands:
  init [--method local_status_file|desktop_notification|discord_webhook|imessage|sms_email]
  start --task "..." [--interval-minutes 5] [--max-hours 6] [--verbose]
  run --task "..." [--interval-minutes 5] [--max-hours 6] [--verbose]
  cycle [--demo]
  status
  pause
  resume
  stop [--reason "..."]
  set-interval --minutes 5
  set-max-runtime --hours 6
  verbose on|off
  approve [--note "..."]
  deny [--note "..."]
  demo-test

Runtime state defaults to .coworx-private/standby/ and must remain uncommitted.`;
  console.log(text);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }
    const name = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      flags[name] = true;
      continue;
    }
    flags[name] = next;
    index += 1;
  }
  return { positional, flags };
}

function statePaths(flags = {}) {
  const statePath = flags["state-path"]
    ? isAbsolute(flags["state-path"]) ? flags["state-path"] : join(root, flags["state-path"])
    : defaultStatePath;
  const stateDir = dirname(statePath);
  return {
    stateDir,
    statePath,
    configPath: flags["config-path"] ? isAbsolute(flags["config-path"]) ? flags["config-path"] : join(root, flags["config-path"]) : join(stateDir, "config.json"),
    statusPath: flags["status-path"] ? isAbsolute(flags["status-path"]) ? flags["status-path"] : join(root, flags["status-path"]) : join(stateDir, "status.md"),
    eventsPath: flags["events-path"] ? isAbsolute(flags["events-path"]) ? flags["events-path"] : join(root, flags["events-path"]) : join(stateDir, "events.ndjson"),
    lockDir: join(stateDir, "active.lock"),
    lockMetaPath: join(stateDir, "active.lock", "metadata.json"),
    cycleLockDir: join(stateDir, "cycle.lock"),
    cycleLockMetaPath: join(stateDir, "cycle.lock", "metadata.json"),
  };
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function defaultConfig() {
  return {
    version,
    configured: false,
    notification_method: "local_status_file",
    quiet_by_default: true,
    verbose: false,
    private_values: {
      webhook_url: "store real webhook URLs only in this ignored private config file",
      phone_number: "store real phone numbers only in this ignored private config file",
      email_address: "store real email addresses only in this ignored private config file",
    },
    setup_choices: [
      "discord_private_channel_or_webhook",
      "desktop_notification",
      "messages_or_imessage_if_available",
      "sms_or_email_if_later_configured",
      "local_status_file_only",
    ],
  };
}

function ensureConfig(paths) {
  ensureDir(paths.stateDir);
  const existing = readJson(paths.configPath);
  if (existing) return existing;
  const config = defaultConfig();
  writeJson(paths.configPath, config);
  appendEvent(paths, { type: "config_initialized", message: "Standby notification config initialized with local status file only." }, true);
  return config;
}

function appendEvent(paths, event, force = false, state = null) {
  const quiet = state?.quiet_by_default !== false;
  const verbose = state?.verbose === true;
  if (!force && quiet && !verbose && !meaningfulEvents.has(event.type)) return;
  ensureDir(paths.stateDir);
  appendFileSync(paths.eventsPath, `${JSON.stringify({ at: nowIso(), ...event })}\n`);
}

function renderStatus(state, config) {
  return `# Coworx Standby Status

- Active: ${state.active ? "yes" : "no"}
- Stop/Pause State: ${state.stop_pause_state}
- Current Status: ${state.current_status}
- Active Task: ${state.active_task || "none"}
- Started Time: ${state.started_time || "none"}
- Last Cycle: ${state.last_cycle || "none"}
- Next Cycle: ${state.next_cycle || "none"}
- Interval Minutes: ${state.interval_minutes}
- Max Runtime Hours: ${state.max_runtime_hours}
- Cycle Count: ${state.cycle_count}
- Last Meaningful Update: ${state.last_meaningful_update || "none"}
- User Input Needed: ${state.user_input_needed ? "yes" : "no"}
- Notification Method: ${config.notification_method}
- Notification Configured: ${config.configured ? "yes" : "no"}
- Notification Setup Needed: ${state.notification_setup_needed ? "yes" : "no"}

Runtime files under .coworx-private/standby/ are private local state and should not be committed.
`;
}

function saveState(paths, state, config) {
  ensureDir(paths.stateDir);
  writeJson(paths.statePath, state);
  writeFileSync(paths.statusPath, renderStatus(state, config));
}

function loadState(paths) {
  return readJson(paths.statePath);
}

function nextCycleFrom(intervalMinutes, from = new Date()) {
  return new Date(from.getTime() + Number(intervalMinutes) * 60 * 1000).toISOString();
}

function assertPositiveNumber(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${name} must be a positive number.`);
  }
  return number;
}

function assertSafeLabel(value, name) {
  if (value === undefined || value === null || value === true) return;
  const text = String(value);
  const digitCount = (text.match(/\d/g) || []).length;
  const unsafePatterns = [
    /https?:\/\//i,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\b(?:token|secret|password|cookie|api[_ -]?key|webhook)\b\s*[:=]/i,
    /\b[A-Za-z0-9_-]{32,}\b/,
  ];
  if (digitCount >= 10 || unsafePatterns.some((pattern) => pattern.test(text))) {
    throw new Error(`${name} must be a non-sensitive label. Put private details in ignored local task files, not CLI args or status text.`);
  }
}

function isDuplicateLoop(state) {
  return state?.active === true && ["running", "paused", "needs_input"].includes(state.stop_pause_state);
}

function acquireActiveLock(paths) {
  ensureDir(paths.stateDir);
  try {
    mkdirSync(paths.lockDir);
    writeJson(paths.lockMetaPath, { pid: process.pid, created_at: nowIso(), note: "prevents duplicate standby loops" });
    return;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const state = loadState(paths);
    if (isDuplicateLoop(state)) {
      throw new Error("A standby loop is already active or paused. Use status, pause, resume, or stop instead of starting a duplicate loop.");
    }
    rmSync(paths.lockDir, { recursive: true, force: true });
    mkdirSync(paths.lockDir);
    writeJson(paths.lockMetaPath, { pid: process.pid, created_at: nowIso(), note: "recovered inactive stale standby lock" });
  }
}

function releaseActiveLock(paths) {
  rmSync(paths.lockDir, { recursive: true, force: true });
}

function acquireCycleLock(paths) {
  ensureDir(paths.stateDir);
  try {
    mkdirSync(paths.cycleLockDir);
    writeJson(paths.cycleLockMetaPath, { pid: process.pid, created_at: nowIso(), note: "prevents duplicate standby cycle execution" });
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error("A standby cycle is already running. Wait for it to finish before starting another cycle.");
    }
    throw error;
  }
}

function releaseCycleLock(paths) {
  rmSync(paths.cycleLockDir, { recursive: true, force: true });
}

function notify(paths, state, config, type, message) {
  const meaningful = meaningfulEvents.has(type);
  if (meaningful) {
    state.last_meaningful_update = nowIso();
  }
  appendEvent(paths, { type, message }, meaningful, state);
  saveState(paths, state, config);
}

function startStandby(flags) {
  const paths = statePaths(flags);
  const config = ensureConfig(paths);
  const existing = loadState(paths);
  if (isDuplicateLoop(existing)) {
    throw new Error("A standby loop is already active or paused. Use status, pause, resume, or stop instead of starting a duplicate loop.");
  }
  const task = flags.task;
  if (!task || task === true) throw new Error('start requires --task "..."');
  assertSafeLabel(task, "--task");
  const intervalMinutes = assertPositiveNumber(flags["interval-minutes"] || 5, "--interval-minutes");
  const maxRuntimeHours = assertPositiveNumber(flags["max-hours"] || 6, "--max-hours");
  acquireActiveLock(paths);
  const raceState = loadState(paths);
  if (isDuplicateLoop(raceState)) {
    releaseActiveLock(paths);
    throw new Error("A standby loop is already active or paused. Use status, pause, resume, or stop instead of starting a duplicate loop.");
  }
  const started = nowIso();
  const state = {
    version,
    active: true,
    active_task: task,
    task_id: flags["task-id"] || `standby-${started.replace(/[:.]/g, "")}`,
    started_time: started,
    last_cycle: null,
    next_cycle: nextCycleFrom(intervalMinutes, new Date(started)),
    interval_minutes: intervalMinutes,
    max_runtime_hours: maxRuntimeHours,
    current_status: "running",
    notification_setup_needed: config.configured !== true,
    cycle_count: 0,
    last_meaningful_update: null,
    user_input_needed: false,
    stop_pause_state: "running",
    verbose: flags.verbose === true || config.verbose === true,
    quiet_by_default: config.quiet_by_default !== false,
    current_checkpoint: "standby loop started; waiting for first bounded cycle",
    pending_approval: null,
    approval_decision: null,
    safety: {
      protected_final_actions_require_approval: true,
      disallowed_private_artifacts: [
        "credentials",
        "webhook URLs",
        "phone numbers",
        "account details",
        "personal screenshots",
        "browser session files",
        "cookies",
        "tokens",
        "traces",
      ],
    },
    demo_task: flags.demo ? demoTask() : null,
  };
  if (state.notification_setup_needed) {
    state.current_status = "running; notification setup needed";
  }
  notify(paths, state, config, "standby_started", `Standby Mode started for task: ${task}`);
  console.log(renderStatus(state, config));
}

function demoTask() {
  return {
    name: "fake demo task",
    steps: [
      { id: "demo-1", status: "pending", description: "load demo checkpoint" },
      { id: "demo-2", status: "pending", description: "perform bounded fake work unit" },
      { id: "demo-3", status: "pending", description: "mark fake output ready" },
    ],
  };
}

function maxRuntimeReached(state) {
  const started = new Date(state.started_time).getTime();
  return Date.now() >= started + Number(state.max_runtime_hours) * 60 * 60 * 1000;
}

function runCycle(flags) {
  const paths = statePaths(flags);
  const config = ensureConfig(paths);
  acquireCycleLock(paths);
  try {
    const state = loadState(paths);
    if (!state) throw new Error("No standby state exists. Start standby first.");
    if (!state.active) {
      saveState(paths, state, config);
      console.log("Standby is not active.");
      return;
    }
    if (state.stop_pause_state === "paused") {
      saveState(paths, state, config);
      console.log("Standby is paused.");
      return;
    }
    if (state.user_input_needed || state.stop_pause_state === "needs_input") {
      saveState(paths, state, config);
      console.log("Standby is waiting for user input.");
      return;
    }
    if (maxRuntimeReached(state)) {
      state.active = false;
      state.stop_pause_state = "max_runtime";
      state.current_status = "max runtime reached";
      state.next_cycle = null;
      notify(paths, state, config, "max_runtime_reached", "Standby Mode stopped because max runtime was reached.");
      releaseActiveLock(paths);
      console.log(renderStatus(state, config));
      return;
    }
    if (!flags.force && state.next_cycle && Date.now() < new Date(state.next_cycle).getTime()) {
      saveState(paths, state, config);
      console.log(`Next standby cycle is due at ${state.next_cycle}. Use --force only for tests or manual recovery.`);
      return;
    }
    const cycleTime = nowIso();
    state.last_cycle = cycleTime;
    state.cycle_count += 1;
    state.next_cycle = nextCycleFrom(state.interval_minutes, new Date(cycleTime));

    if (flags.demo || state.demo_task) {
      state.demo_task = state.demo_task || demoTask();
      const step = state.demo_task.steps.find((candidate) => candidate.status === "pending");
      if (step) {
        step.status = "completed";
        step.completed_at = cycleTime;
        state.current_checkpoint = `${step.id}: ${step.description}`;
        state.current_status = "running";
        notify(paths, state, config, step.id === "demo-3" ? "outputs_ready" : "milestone_reached", `Demo standby cycle completed ${step.id}.`);
      }
      const remaining = state.demo_task.steps.some((candidate) => candidate.status === "pending");
      if (!remaining) {
        state.active = false;
        state.stop_pause_state = "completed";
        state.current_status = "completed";
        state.next_cycle = null;
        notify(paths, state, config, "task_completed", "Demo standby task completed without external account access.");
        releaseActiveLock(paths);
      }
    } else {
      state.current_checkpoint = `cycle ${state.cycle_count}: saved checkpoint for Director-owned bounded work`;
      state.current_status = "running";
      appendEvent(paths, { type: "quiet_cycle", message: state.current_checkpoint }, false, state);
      saveState(paths, state, config);
    }
    console.log(renderStatus(state, config));
  } finally {
    releaseCycleLock(paths);
  }
}

async function runLoop(flags) {
  const paths = statePaths(flags);
  let state = loadState(paths);
  if (isDuplicateLoop(state)) {
    throw new Error("A standby loop is already active or paused. Use status, pause, resume, or stop instead of starting a duplicate loop.");
  }
  startStandby(flags);
  while (true) {
    state = loadState(paths);
    if (!state?.active) return;
    if (["paused", "needs_input", "completed", "stopped", "max_runtime"].includes(state.stop_pause_state)) return;
    const waitUntil = state.next_cycle ? new Date(state.next_cycle).getTime() : Date.now();
    const waitMs = Math.max(0, waitUntil - Date.now());
    if (waitMs > 0) await sleep(Math.min(waitMs, 2_147_483_647));
    runCycle(flags);
  }
}

function readStatus(flags) {
  const paths = statePaths(flags);
  const config = ensureConfig(paths);
  const state = loadState(paths) || inactiveState(config);
  saveState(paths, state, config);
  console.log(renderStatus(state, config));
}

function inactiveState(config) {
  return {
    version,
    active: false,
    active_task: null,
    task_id: null,
    started_time: null,
    last_cycle: null,
    next_cycle: null,
    interval_minutes: 5,
    max_runtime_hours: 6,
    current_status: "not started",
    notification_setup_needed: config.configured !== true,
    cycle_count: 0,
    last_meaningful_update: null,
    user_input_needed: false,
    stop_pause_state: "stopped",
    verbose: config.verbose === true,
    quiet_by_default: config.quiet_by_default !== false,
    current_checkpoint: null,
    pending_approval: null,
    approval_decision: null,
  };
}

function mutateState(flags, mutator) {
  const paths = statePaths(flags);
  const config = ensureConfig(paths);
  const state = loadState(paths) || inactiveState(config);
  mutator(state, config, paths);
  saveState(paths, state, config);
  console.log(renderStatus(state, config));
}

function initConfig(flags) {
  const paths = statePaths(flags);
  const config = ensureConfig(paths);
  if (flags.method) {
    assertSafeLabel(flags.method, "--method");
    if (!allowedNotificationMethods.has(flags.method)) {
      throw new Error(`--method must be one of: ${Array.from(allowedNotificationMethods).sort().join(", ")}`);
    }
    config.notification_method = flags.method;
    config.configured = true;
  }
  if (flags.verbose !== undefined) config.verbose = flags.verbose === true;
  writeJson(paths.configPath, config);
  appendEvent(paths, { type: "config_initialized", message: `Standby notifications configured for ${config.notification_method}.` }, true);
  const state = loadState(paths) || inactiveState(config);
  saveState(paths, state, config);
  console.log(`Standby notification method: ${config.notification_method}`);
}

function demoTest() {
  const tempDir = mkdtempSync(join(tmpdir(), "coworx-standby-demo-"));
  const statePath = join(tempDir, "state.json");
  const flags = { "state-path": statePath, "interval-minutes": "60", "max-hours": "1", task: "demo standby task", demo: true };
  const expectThrows = (label, fn) => {
    let threw = false;
    try {
      fn();
    } catch {
      threw = true;
    }
    if (!threw) throw new Error(`${label} did not reject unsafe input`);
  };
  try {
    expectThrows("unsafe task label", () => startStandby({ "state-path": join(tempDir, "unsafe-task", "state.json"), task: "https://example.com/private", "interval-minutes": "5", "max-hours": "1" }));
    expectThrows("unsafe notification method", () => initConfig({ "state-path": join(tempDir, "unsafe-method", "state.json"), method: "https://example.com/hook" }));
    expectThrows("unsafe note label", () => assertSafeLabel("token=abc123", "--note"));
    expectThrows("unsafe reason label", () => assertSafeLabel("555-555-5555", "--reason"));
    startStandby(flags);
    let duplicateRejected = false;
    try {
      startStandby(flags);
    } catch (error) {
      duplicateRejected = error.message.includes("already active or paused");
    }
    if (!duplicateRejected) throw new Error("duplicate active loop was not rejected");
    mkdirSync(join(tempDir, "cycle.lock"));
    expectThrows("duplicate cycle lock", () => runCycle({ "state-path": statePath, demo: true, force: true }));
    rmSync(join(tempDir, "cycle.lock"), { recursive: true, force: true });
    runCycle({ "state-path": statePath, demo: true });
    let state = readJson(statePath);
    if (state.cycle_count !== 0) {
      throw new Error("non-forced cycle ran before next_cycle");
    }
    runCycle({ "state-path": statePath, demo: true, force: true });
    runCycle({ "state-path": statePath, demo: true, force: true });
    runCycle({ "state-path": statePath, demo: true, force: true });
    state = readJson(statePath);
    const events = readFileSync(join(tempDir, "events.ndjson"), "utf8");
    if (state.active !== false || state.stop_pause_state !== "completed") {
      throw new Error("demo task did not complete");
    }
    if (!events.includes("standby_started") || !events.includes("task_completed")) {
      throw new Error("meaningful events were not recorded");
    }
    if (events.includes("quiet_cycle")) {
      throw new Error("quiet cycle spam was recorded while verbose mode was off");
    }
    console.log("Standby demo test passed.");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const command = positional[0];

  if (!command || command === "help" || command === "--help") usage(0);
  if (command === "init") initConfig(flags);
  else if (command === "start") startStandby(flags);
  else if (command === "run") await runLoop(flags);
  else if (command === "cycle") runCycle(flags);
  else if (command === "status") readStatus(flags);
  else if (command === "pause") {
    mutateState(flags, (state, config, paths) => {
      if (state.active) {
        state.stop_pause_state = "paused";
        state.current_status = "paused";
        notify(paths, state, config, "standby_paused", "Standby Mode paused.");
      }
    });
  } else if (command === "resume") {
    mutateState(flags, (state, config, paths) => {
      if (state.active && state.stop_pause_state === "paused") {
        state.stop_pause_state = "running";
        state.current_status = "running";
        state.next_cycle = nextCycleFrom(state.interval_minutes);
        notify(paths, state, config, "standby_resumed", "Standby Mode resumed.");
      }
    });
  } else if (command === "stop") {
    mutateState(flags, (state, config, paths) => {
      assertSafeLabel(flags.reason, "--reason");
      state.active = false;
      state.stop_pause_state = "stopped";
      state.current_status = flags.reason || "stopped by user";
      state.next_cycle = null;
      notify(paths, state, config, "standby_stopped", `Standby Mode stopped: ${state.current_status}`);
      releaseActiveLock(paths);
    });
  } else if (command === "set-interval") {
    mutateState(flags, (state) => {
      state.interval_minutes = assertPositiveNumber(flags.minutes, "--minutes");
      if (state.active && state.stop_pause_state === "running") state.next_cycle = nextCycleFrom(state.interval_minutes);
    });
  } else if (command === "set-max-runtime") {
    mutateState(flags, (state) => {
      state.max_runtime_hours = assertPositiveNumber(flags.hours, "--hours");
    });
  } else if (command === "verbose") {
    mutateState(flags, (state, config) => {
      const value = positional[1];
      if (!["on", "off"].includes(value)) throw new Error("verbose requires on or off");
      state.verbose = value === "on";
      config.verbose = state.verbose;
      writeJson(statePaths(flags).configPath, config);
    });
  } else if (command === "approve" || command === "deny") {
    mutateState(flags, (state) => {
      assertSafeLabel(flags.note, "--note");
      state.approval_decision = { decision: command, note: flags.note || null, at: nowIso() };
      state.user_input_needed = false;
      if (state.stop_pause_state === "needs_input") state.stop_pause_state = "running";
      state.current_status = `${command} recorded`;
      state.next_cycle = state.active ? nextCycleFrom(state.interval_minutes) : null;
    });
  } else if (command === "demo-test") demoTest();
  else usage(1);
}

try {
  await main();
} catch (error) {
  console.error(`Standby error: ${error.message}`);
  process.exit(1);
}
