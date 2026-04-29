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
import { dirname, isAbsolute, join } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();
const version = 1;
const defaultStateDir = join(root, ".coworx-private", "computer-use");
const priorityRank = new Map([
  ["urgent", 10],
  ["high", 25],
  ["normal", 50],
  ["low", 75],
]);

function nowIso() {
  return new Date().toISOString();
}

function nowMs() {
  return Date.now();
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

function usage(exitCode = 0) {
  console.log(`Coworx Computer Use Queue

Commands:
  request --task "..." --owner "..." --locks "computer_app:Chrome,desktop_resource:active_window_focus" [--duration-minutes 15]
  reserve --task "..." --owner "..." --start "2026-04-27T15:30:00-05:00" --duration-minutes 10 --locks "..."
  acquire --request-id ID [--owner "..."] [--wait-seconds 0]
  acquire --task "..." --owner "..." --locks "..." [--duration-minutes 15]
  renew --lease-id ID --duration-minutes 15
  release --lease-id ID [--note "..."]
  status
  cleanup-stale
  demo-test

Runtime state defaults to .coworx-private/computer-use/ and must stay ignored.`);
  process.exit(exitCode);
}

function paths(flags = {}) {
  const stateDir = flags["state-dir"]
    ? isAbsolute(flags["state-dir"]) ? flags["state-dir"] : join(root, flags["state-dir"])
    : defaultStateDir;
  return {
    stateDir,
    requestsDir: join(stateDir, "requests"),
    historyDir: join(stateDir, "history"),
    activeLockDir: join(stateDir, "active.lock"),
    activeLeasePath: join(stateDir, "active.lock", "lease.json"),
    eventsPath: join(stateDir, "events.ndjson"),
    statusPath: join(stateDir, "status.md"),
  };
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function ensureState(p) {
  ensureDir(p.stateDir);
  ensureDir(p.requestsDir);
  ensureDir(p.historyDir);
}

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function appendEvent(p, event) {
  ensureDir(p.stateDir);
  appendFileSync(p.eventsPath, `${JSON.stringify({ at: nowIso(), ...event })}\n`);
}

function splitCsv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function exclusiveTargets(locks) {
  const prefixes = [
    "computer_app:",
    "browser_profile:",
    "browser_window:",
    "account_workflow:",
    "simulator:",
  ];
  return locks.filter((lock) => prefixes.some((prefix) => lock.startsWith(prefix)));
}

function validateComputerUseLocks(locks) {
  if (exclusiveTargets(locks).length === 0) {
    throw new Error("Computer Use requests need an app/window/profile/account/simulator target lock.");
  }
  if (!locks.includes("desktop_resource:active_window_focus")) {
    throw new Error("Computer Use requests need desktop_resource:active_window_focus.");
  }
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
    throw new Error(`${name} must be a non-sensitive label. Put private details in ignored local request files, not CLI args or status text.`);
  }
}

function parseStart(flags) {
  if (flags.start) {
    const parsed = new Date(flags.start);
    if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid --start: ${flags.start}`);
    return parsed.toISOString();
  }
  if (flags["start-in-minutes"]) {
    const minutes = Number(flags["start-in-minutes"]);
    if (!Number.isFinite(minutes) || minutes < 0) throw new Error("Invalid --start-in-minutes.");
    return new Date(nowMs() + minutes * 60_000).toISOString();
  }
  return nowIso();
}

function durationMinutes(flags, fallback = 15) {
  const minutes = Number(flags["duration-minutes"] || fallback);
  if (!Number.isFinite(minutes) || minutes <= 0) throw new Error("Invalid --duration-minutes.");
  return minutes;
}

function makeId(prefix) {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${suffix}`;
}

function requestPath(p, requestId) {
  return join(p.requestsDir, `${requestId}.json`);
}

function listRequests(p) {
  ensureState(p);
  return readdirSync(p.requestsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readJson(join(p.requestsDir, name)))
    .filter(Boolean)
    .sort(compareRequests);
}

function rank(request) {
  return priorityRank.get(request.priority || "normal") ?? priorityRank.get("normal");
}

function compareRequests(a, b) {
  const aDue = new Date(a.not_before || a.created_at).getTime();
  const bDue = new Date(b.not_before || b.created_at).getTime();
  if (aDue !== bDue) return aDue - bDue;
  const priority = rank(a) - rank(b);
  if (priority !== 0) return priority;
  return String(a.created_at).localeCompare(String(b.created_at));
}

function duePendingRequests(p) {
  const now = nowMs();
  return listRequests(p).filter((request) => {
    if (!["pending", "reserved"].includes(request.status)) return false;
    return new Date(request.not_before).getTime() <= now;
  });
}

function nextQueuedRequest(p) {
  return listRequests(p).find((request) => ["pending", "reserved"].includes(request.status)) || null;
}

function activeLease(p) {
  return readJson(p.activeLeasePath);
}

function leaseIsExpired(lease) {
  return lease && new Date(lease.expires_at).getTime() <= nowMs();
}

function archiveLease(p, lease, reason) {
  if (!lease) return;
  const archived = {
    ...lease,
    archived_at: nowIso(),
    archive_reason: reason,
  };
  writeJson(join(p.historyDir, `${lease.lease_id}.json`), archived);
}

function cleanupStale(p) {
  const lease = activeLease(p);
  if (!lease || !leaseIsExpired(lease)) return false;
  archiveLease(p, lease, "expired");
  rmSync(p.activeLockDir, { recursive: true, force: true });
  if (lease.request_id) {
    const path = requestPath(p, lease.request_id);
    const request = readJson(path);
    if (request?.status === "active") {
      writeJson(path, {
        ...request,
        status: "expired",
        updated_at: nowIso(),
        expired_at: nowIso(),
      });
    }
  }
  appendEvent(p, { type: "lease_expired", lease_id: lease.lease_id, owner: lease.owner });
  return true;
}

function createRequest(p, flags, status = "pending") {
  ensureState(p);
  const task = String(flags.task || "").trim();
  const owner = String(flags.owner || process.env.USER || "unknown").trim();
  if (!task) throw new Error("Missing --task.");
  if (!owner) throw new Error("Missing --owner.");
  assertSafeLabel(task, "--task");
  assertSafeLabel(owner, "--owner");
  assertSafeLabel(flags.target, "--target");
  assertSafeLabel(flags.note, "--note");
  const locks = splitCsv(flags.locks || "desktop_resource:active_window_focus");
  validateComputerUseLocks(locks);
  const targets = exclusiveTargets(locks);
  const request = {
    schema_version: version,
    request_id: makeId("cuq"),
    status,
    created_at: nowIso(),
    updated_at: nowIso(),
    owner,
    task,
    locks,
    exclusive_targets: targets,
    target_exclusivity_rule: "one Computer Use agent per app/window/profile/account target at a time; if isolation is unclear, use the global desktop lease",
    usage_claim_requires_lease_evidence: true,
    allowed_target: flags.target || null,
    action_level: flags["action-level"] || null,
    priority: flags.priority || "normal",
    not_before: parseStart(flags),
    duration_minutes: durationMinutes(flags),
    private: true,
    note: flags.note || null,
  };
  writeJson(requestPath(p, request.request_id), request);
  appendEvent(p, { type: "request_created", request_id: request.request_id, owner, task });
  return request;
}

function requestById(p, requestId) {
  const request = readJson(requestPath(p, requestId));
  if (!request) throw new Error(`Request not found: ${requestId}`);
  return request;
}

function writeStatus(p) {
  const lease = activeLease(p);
  const requests = listRequests(p);
  const queued = requests.filter((request) => ["pending", "reserved"].includes(request.status));
  const next = queued[0] || null;
  const lines = [
    "# Computer Use Queue Status",
    "",
    `Updated: ${nowIso()}`,
    "",
    "## Active Lease",
    lease
      ? `- ${lease.lease_id} by ${lease.owner}, expires ${lease.expires_at}, task: ${lease.task}`
      : "- none",
    "",
    "## Next Queue Item",
    next
      ? `- ${next.request_id} by ${next.owner}, eligible ${next.not_before}, task: ${next.task}`
      : "- none",
    "",
    "## Queued Requests",
    ...queued.map((request) => `- ${request.request_id} | ${request.status} | ${request.owner} | ${request.not_before} | ${request.task}`),
    "",
  ];
  writeFileSync(p.statusPath, `${lines.join("\n")}\n`);
  return { active: lease, next, queued };
}

function status(p) {
  cleanupStale(p);
  const snapshot = writeStatus(p);
  console.log(JSON.stringify(snapshot, null, 2));
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function acquire(p, flags) {
  ensureState(p);
  const waitSeconds = Number(flags["wait-seconds"] || 0);
  if (!Number.isFinite(waitSeconds) || waitSeconds < 0) throw new Error("Invalid --wait-seconds.");
  const deadline = nowMs() + waitSeconds * 1000;
  let request = null;
  if (flags["request-id"]) request = requestById(p, flags["request-id"]);
  else if (flags.task) request = createRequest(p, flags, "pending");

  while (true) {
    cleanupStale(p);
    const active = activeLease(p);
    if (active) {
      if (nowMs() >= deadline) {
        console.log(JSON.stringify({ acquired: false, reason: "active_lease", active }, null, 2));
        process.exitCode = 2;
        return null;
      }
      await sleep(1000);
      continue;
    }

    const due = duePendingRequests(p);
    if (!request) request = due[0] || null;
    if (!request) {
      const next = nextQueuedRequest(p);
      if (nowMs() >= deadline) {
        console.log(JSON.stringify({ acquired: false, reason: "no_due_request", next }, null, 2));
        process.exitCode = 2;
        return null;
      }
      await sleep(1000);
      continue;
    }

    request = requestById(p, request.request_id);
    if (!["pending", "reserved"].includes(request.status)) {
      throw new Error(`Request ${request.request_id} is ${request.status}, not pending.`);
    }
    const eligibleAt = new Date(request.not_before).getTime();
    if (eligibleAt > nowMs()) {
      if (nowMs() >= deadline) {
        console.log(JSON.stringify({ acquired: false, reason: "request_not_due", request }, null, 2));
        process.exitCode = 2;
        return null;
      }
      await sleep(Math.min(1000, Math.max(50, eligibleAt - nowMs())));
      continue;
    }

    const head = duePendingRequests(p)[0] || null;
    if (head && head.request_id !== request.request_id && flags.force !== true) {
      console.log(JSON.stringify({ acquired: false, reason: "queue_ahead", ahead: head, requested: request }, null, 2));
      process.exitCode = 2;
      return null;
    }

    try {
      mkdirSync(p.activeLockDir);
    } catch {
      if (nowMs() >= deadline) {
        console.log(JSON.stringify({ acquired: false, reason: "active_lock_race" }, null, 2));
        process.exitCode = 2;
        return null;
      }
      await sleep(1000);
      continue;
    }

    const leaseId = makeId("cul");
    const lease = {
      schema_version: version,
      lease_id: leaseId,
      request_id: request.request_id,
      owner: flags.owner || request.owner,
      task: request.task,
      locks: request.locks,
      exclusive_targets: request.exclusive_targets,
      target_exclusivity_rule: request.target_exclusivity_rule,
      usage_claim_requires_lease_evidence: true,
      allowed_target: request.allowed_target,
      action_level: request.action_level,
      acquired_at: nowIso(),
      expires_at: new Date(nowMs() + request.duration_minutes * 60_000).toISOString(),
      duration_minutes: request.duration_minutes,
      release_command: `node scripts/coworx_computer_use_queue.mjs release --lease-id ${leaseId}`,
      private: true,
    };
    writeJson(p.activeLeasePath, lease);
    writeJson(requestPath(p, request.request_id), {
      ...request,
      status: "active",
      lease_id: lease.lease_id,
      updated_at: nowIso(),
      acquired_at: lease.acquired_at,
      expires_at: lease.expires_at,
    });
    appendEvent(p, { type: "lease_acquired", lease_id: lease.lease_id, request_id: request.request_id, owner: lease.owner });
    writeStatus(p);
    console.log(JSON.stringify({ acquired: true, lease }, null, 2));
    return lease;
  }
}

function renew(p, flags) {
  cleanupStale(p);
  const lease = activeLease(p);
  if (!lease) throw new Error("No active lease.");
  if (flags["lease-id"] && flags["lease-id"] !== lease.lease_id) throw new Error("Lease id does not match active lease.");
  if (flags.owner && flags.owner !== lease.owner) throw new Error("Lease owner does not match --owner.");
  const minutes = durationMinutes(flags, lease.duration_minutes || 15);
  const renewed = {
    ...lease,
    renewed_at: nowIso(),
    expires_at: new Date(nowMs() + minutes * 60_000).toISOString(),
    duration_minutes: minutes,
  };
  writeJson(p.activeLeasePath, renewed);
  appendEvent(p, { type: "lease_renewed", lease_id: renewed.lease_id, expires_at: renewed.expires_at });
  writeStatus(p);
  console.log(JSON.stringify({ renewed: true, lease: renewed }, null, 2));
}

function release(p, flags) {
  const lease = activeLease(p);
  if (!lease) {
    console.log(JSON.stringify({ released: false, reason: "no_active_lease" }, null, 2));
    return;
  }
  if (flags["lease-id"] && flags["lease-id"] !== lease.lease_id && flags.force !== true) {
    throw new Error("Lease id does not match active lease.");
  }
  if (flags.owner && flags.owner !== lease.owner && flags.force !== true) {
    throw new Error("Lease owner does not match --owner.");
  }
  const releasedAt = nowIso();
  archiveLease(p, { ...lease, released_at: releasedAt, release_note: flags.note || null }, "released");
  rmSync(p.activeLockDir, { recursive: true, force: true });
  if (lease.request_id) {
    const path = requestPath(p, lease.request_id);
    const request = readJson(path);
    if (request) {
      writeJson(path, {
        ...request,
        status: "released",
        updated_at: releasedAt,
        released_at: releasedAt,
      });
    }
  }
  appendEvent(p, { type: "lease_released", lease_id: lease.lease_id, owner: lease.owner });
  writeStatus(p);
  console.log(JSON.stringify({ released: true, lease_id: lease.lease_id }, null, 2));
}

async function demoTest() {
  const demoDir = mkdtempSync(join(tmpdir(), "coworx-computer-use-queue-"));
  const p = paths({ "state-dir": demoDir });
  let missingTargetRejected = false;
  try {
    createRequest(p, {
      task: "demo missing app lock",
      owner: "demo-agent",
      locks: "desktop_resource:active_window_focus",
      "duration-minutes": "1",
    });
  } catch (error) {
    missingTargetRejected = error.message.includes("target lock");
  }
  if (!missingTargetRejected) throw new Error("Demo request without target lock was not rejected.");
  const request = createRequest(p, {
    task: "demo Computer Use task",
    owner: "demo-agent",
    locks: "computer_app:Chrome,desktop_resource:active_window_focus",
    "duration-minutes": "1",
  });
  if (!request.exclusive_targets.includes("computer_app:Chrome") || request.usage_claim_requires_lease_evidence !== true) {
    throw new Error("Demo request did not record app exclusivity and usage-claim evidence requirements.");
  }
  const lease = await acquire(p, { "request-id": request.request_id, "wait-seconds": "0" });
  if (!lease) throw new Error("Demo acquire failed.");
  renew(p, { "lease-id": lease.lease_id, "duration-minutes": "2" });
  release(p, { "lease-id": lease.lease_id, note: "demo complete" });
  const after = activeLease(p);
  if (after) throw new Error("Demo release left an active lease.");
  rmSync(demoDir, { recursive: true, force: true });
  console.log("Coworx Computer Use queue demo test passed.");
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const command = positional[0];
  if (!command || flags.help === true || command === "help") usage(0);
  const p = paths(flags);

  if (command === "request") {
    const request = createRequest(p, flags, "pending");
    writeStatus(p);
    console.log(JSON.stringify({ request }, null, 2));
    return;
  }
  if (command === "reserve") {
    const request = createRequest(p, flags, "reserved");
    writeStatus(p);
    console.log(JSON.stringify({ request }, null, 2));
    return;
  }
  if (command === "acquire") {
    await acquire(p, flags);
    return;
  }
  if (command === "renew") {
    renew(p, flags);
    return;
  }
  if (command === "release") {
    release(p, flags);
    return;
  }
  if (command === "status") {
    status(p);
    return;
  }
  if (command === "cleanup-stale") {
    ensureState(p);
    const cleaned = cleanupStale(p);
    writeStatus(p);
    console.log(JSON.stringify({ cleaned }, null, 2));
    return;
  }
  if (command === "demo-test") {
    await demoTest();
    return;
  }
  usage(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
