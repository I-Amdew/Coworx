#!/usr/bin/env node
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();
const version = 1;
const defaultStateDir = join(root, ".coworx-private", "task-orchestration");
const priorityRank = new Map([
  ["urgent", 10],
  ["high", 25],
  ["normal", 50],
  ["low", 75],
]);
const terminalStatuses = new Set(["completed", "staged", "blocked", "skipped", "cancelled"]);
const runnableStatuses = new Set(["pending", "ready", "running", "waiting"]);

function nowIso() {
  return new Date().toISOString();
}

function parseArgs(argv) {
  const command = argv[2];
  const flags = {};
  for (let index = 3; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const name = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      flags[name] = true;
      continue;
    }
    flags[name] = next;
    index += 1;
  }
  return { command, flags };
}

function paths(flags = {}) {
  const stateDir = flags["state-dir"]
    ? isAbsolute(flags["state-dir"]) ? flags["state-dir"] : resolve(root, flags["state-dir"])
    : defaultStateDir;
  return {
    stateDir,
    tasksDir: join(stateDir, "tasks"),
    eventsPath: join(stateDir, "events.ndjson"),
    statusPath: join(stateDir, "status.md"),
    computerUseLeasePath: stateDir === defaultStateDir
      ? join(root, ".coworx-private", "computer-use", "active.lock", "lease.json")
      : join(stateDir, "computer-use", "active.lock", "lease.json"),
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
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}

function appendEvent(p, event) {
  ensureDir(p.stateDir);
  appendFileSync(p.eventsPath, `${JSON.stringify({ at: nowIso(), ...event })}\n`);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function assertSafeLabel(value, name) {
  const text = String(value || "");
  if (!text) throw new Error(`Missing ${name}.`);
  const digitCount = (text.match(/\d/g) || []).length;
  const unsafePatterns = [
    /https?:\/\//i,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\b(?:token|secret|password|cookie|api[_ -]?key|webhook|phone)\b\s*[:=]/i,
    /\b[A-Za-z0-9_-]{32,}\b/,
  ];
  if (digitCount >= 10 || unsafePatterns.some((pattern) => pattern.test(text))) {
    throw new Error(`${name} must be a non-sensitive label. Put private details in the directive file, not the task registry.`);
  }
  return text;
}

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function taskPath(p, taskId) {
  return join(p.tasksDir, `${slugify(taskId)}.json`);
}

function readTask(p, taskId) {
  return readJson(taskPath(p, taskId));
}

function listTasks(p) {
  ensureDir(p.tasksDir);
  return readdirSync(p.tasksDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readJson(join(p.tasksDir, name)))
    .filter(Boolean)
    .sort((a, b) => rank(a.priority) - rank(b.priority) || String(a.created_at).localeCompare(String(b.created_at)));
}

function rank(priority) {
  return priorityRank.get(priority || "normal") ?? priorityRank.get("normal");
}

function register(flags) {
  const p = paths(flags);
  ensureDir(p.tasksDir);
  const taskId = assertSafeLabel(flags["task-id"] || flags.id, "--task-id");
  const existing = readTask(p, taskId) || {};
  const priority = flags.priority || existing.priority || "normal";
  if (!priorityRank.has(priority)) throw new Error("--priority must be urgent, high, normal, or low.");
  const task = {
    schema_version: version,
    task_id: taskId,
    title: assertSafeLabel(flags.title || existing.title || taskId, "--title"),
    owner: assertSafeLabel(flags.owner || existing.owner || "codex-director", "--owner"),
    status: flags.status || existing.status || "pending",
    priority,
    depends_on: parseCsv(flags["depends-on"] ?? existing.depends_on?.join(",") ?? ""),
    blocks: parseCsv(flags.blocks ?? existing.blocks?.join(",") ?? ""),
    locks: parseCsv(flags.locks ?? existing.locks?.join(",") ?? ""),
    directive_path: flags["directive-path"] || existing.directive_path || null,
    waiting_for: flags["waiting-for"] || existing.waiting_for || null,
    evidence_path: flags["evidence-path"] || existing.evidence_path || null,
    created_at: existing.created_at || nowIso(),
    updated_at: nowIso(),
    private: true,
    registry_rule: "This task registry stores labels, status, prerequisites, priority, and locks only. Private task content belongs in ignored directive/output files.",
  };
  writeJson(taskPath(p, taskId), task);
  appendEvent(p, { type: existing.task_id ? "task_updated" : "task_registered", task_id: taskId, status: task.status, priority: task.priority });
  writeStatus(p);
  console.log(JSON.stringify({ ok: true, task }, null, 2));
}

function update(flags) {
  const p = paths(flags);
  const taskId = assertSafeLabel(flags["task-id"] || flags.id, "--task-id");
  const task = readTask(p, taskId);
  if (!task) throw new Error(`Task not found: ${taskId}`);
  const updated = {
    ...task,
    status: flags.status || task.status,
    priority: flags.priority || task.priority,
    waiting_for: flags["waiting-for"] !== undefined ? flags["waiting-for"] : task.waiting_for,
    evidence_path: flags["evidence-path"] !== undefined ? flags["evidence-path"] : task.evidence_path,
    updated_at: nowIso(),
  };
  if (!priorityRank.has(updated.priority)) throw new Error("--priority must be urgent, high, normal, or low.");
  writeJson(taskPath(p, taskId), updated);
  appendEvent(p, { type: "task_updated", task_id: taskId, status: updated.status, priority: updated.priority });
  writeStatus(p);
  console.log(JSON.stringify({ ok: true, task: updated }, null, 2));
}

function activeComputerUseLease(p) {
  const lease = readJson(p.computerUseLeasePath);
  if (!lease) return null;
  if (new Date(lease.expires_at).getTime() <= Date.now()) return { ...lease, expired: true };
  return { ...lease, expired: false };
}

function locksConflict(a = [], b = []) {
  const set = new Set(a);
  return b.some((lock) => set.has(lock));
}

function analyzeTasks(p) {
  const tasks = listTasks(p);
  const byId = new Map(tasks.map((task) => [task.task_id, task]));
  const activeLease = activeComputerUseLease(p);
  const running = tasks.filter((task) => task.status === "running");
  const rows = tasks.map((task) => {
    const missingPrerequisites = (task.depends_on || []).filter((id) => {
      const dependency = byId.get(id);
      return !dependency || !terminalStatuses.has(dependency.status);
    });
    const lockConflicts = running
      .filter((other) => other.task_id !== task.task_id && locksConflict(task.locks, other.locks))
      .map((other) => other.task_id);
    const computerUseConflict = activeLease && !activeLease.expired && locksConflict(task.locks, activeLease.locks || [])
      ? activeLease.lease_id
      : null;
    const runnable = runnableStatuses.has(task.status)
      && missingPrerequisites.length === 0
      && lockConflicts.length === 0
      && !computerUseConflict;
    return {
      task_id: task.task_id,
      title: task.title,
      owner: task.owner,
      status: task.status,
      priority: task.priority,
      rank: rank(task.priority),
      locks: task.locks,
      depends_on: task.depends_on,
      missing_prerequisites: missingPrerequisites,
      lock_conflicts: lockConflicts,
      computer_use_conflict: computerUseConflict,
      runnable,
      recommended_state: task.status === "running"
        ? "running"
        : runnable ? "ready"
          : terminalStatuses.has(task.status) ? task.status
            : "waiting",
    };
  });
  const ready = rows
    .filter((row) => row.runnable && row.status !== "running")
    .sort((a, b) => a.rank - b.rank || a.task_id.localeCompare(b.task_id));
  const waiting = rows.filter((row) => row.recommended_state === "waiting");
  return {
    generated_at: nowIso(),
    active_computer_use_lease: activeLease ? {
      lease_id: activeLease.lease_id,
      owner: activeLease.owner,
      task: activeLease.task,
      locks: activeLease.locks,
      expires_at: activeLease.expires_at,
      expired: activeLease.expired,
    } : null,
    tasks: rows,
    ready,
    waiting,
    highest_priority_ready: ready[0] || null,
  };
}

function writeStatus(p) {
  const snapshot = analyzeTasks(p);
  ensureDir(p.stateDir);
  const lines = [
    "# Coworx Task Orchestration Status",
    "",
    `Updated: ${snapshot.generated_at}`,
    "",
    "## Active Computer Use Lease",
    snapshot.active_computer_use_lease
      ? `- ${snapshot.active_computer_use_lease.lease_id} | ${snapshot.active_computer_use_lease.owner} | ${snapshot.active_computer_use_lease.task}`
      : "- none",
    "",
    "## Highest Priority Ready Task",
    snapshot.highest_priority_ready
      ? `- ${snapshot.highest_priority_ready.task_id} | ${snapshot.highest_priority_ready.priority} | ${snapshot.highest_priority_ready.title}`
      : "- none",
    "",
    "## Tasks",
    ...snapshot.tasks.map((task) => `- ${task.task_id} | ${task.status} -> ${task.recommended_state} | ${task.priority} | deps waiting: ${task.missing_prerequisites.join(",") || "none"} | lock conflicts: ${task.lock_conflicts.join(",") || task.computer_use_conflict || "none"}`),
    "",
  ];
  writeFileSync(p.statusPath, `${lines.join("\n")}\n`);
  return snapshot;
}

function status(flags) {
  const p = paths(flags);
  const snapshot = writeStatus(p);
  console.log(JSON.stringify(snapshot, null, 2));
}

function prune(flags) {
  const p = paths(flags);
  const keepTerminal = flags["keep-terminal"] === "true";
  const tasks = listTasks(p);
  const removed = [];
  for (const task of tasks) {
    if (keepTerminal || !terminalStatuses.has(task.status)) continue;
    rmSync(taskPath(p, task.task_id), { force: true });
    removed.push(task.task_id);
  }
  appendEvent(p, { type: "pruned", removed });
  writeStatus(p);
  console.log(JSON.stringify({ ok: true, removed }, null, 2));
}

function demoTest() {
  const demoDir = mkdtempSync(join(tmpdir(), "coworx-orchestrator-"));
  try {
    register({ "state-dir": demoDir, "task-id": "task-a", title: "mail lane", owner: "demo", status: "running", priority: "high", locks: "computer_app:Mail" });
    register({ "state-dir": demoDir, "task-id": "task-b", title: "send after mail", owner: "demo", status: "pending", priority: "normal", "depends-on": "task-a", locks: "computer_app:Mail" });
    register({ "state-dir": demoDir, "task-id": "task-c", title: "local review", owner: "demo", status: "pending", priority: "urgent", locks: "file:outputs/demo.md" });
    let snapshot = writeStatus(paths({ "state-dir": demoDir }));
    const taskB = snapshot.tasks.find((task) => task.task_id === "task-b");
    const taskC = snapshot.tasks.find((task) => task.task_id === "task-c");
    if (taskB.recommended_state !== "waiting" || !taskB.missing_prerequisites.includes("task-a")) {
      throw new Error("demo prerequisite did not hold dependent task");
    }
    if (snapshot.highest_priority_ready?.task_id !== "task-c" || taskC.recommended_state !== "ready") {
      throw new Error("demo priority did not select urgent ready task");
    }
    update({ "state-dir": demoDir, "task-id": "task-a", status: "completed", "evidence-path": ".coworx-private/demo/evidence.json" });
    snapshot = writeStatus(paths({ "state-dir": demoDir }));
    const updatedB = snapshot.tasks.find((task) => task.task_id === "task-b");
    if (updatedB.recommended_state !== "ready") {
      throw new Error("demo dependent task did not become ready after prerequisite completed");
    }
    console.log("Coworx task orchestrator demo test passed.");
  } finally {
    rmSync(demoDir, { recursive: true, force: true });
  }
}

const { command, flags } = parseArgs(process.argv);

try {
  if (command === "register") register(flags);
  else if (command === "update") update(flags);
  else if (command === "status" || command === "plan") status(flags);
  else if (command === "prune") prune(flags);
  else if (command === "demo-test") demoTest();
  else {
    console.error(`Usage:
  node ${basename(process.argv[1])} register --task-id ID --title LABEL --owner OWNER [--status pending|running|waiting|completed|blocked] [--priority urgent|high|normal|low] [--depends-on A,B] [--locks LOCKS]
  node ${basename(process.argv[1])} update --task-id ID --status STATUS [--priority urgent|high|normal|low] [--evidence-path PATH]
  node ${basename(process.argv[1])} status
  node ${basename(process.argv[1])} prune
  node ${basename(process.argv[1])} demo-test`);
    process.exit(2);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
