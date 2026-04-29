#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

const root = process.cwd();
const privateRoot = resolve(root, ".coworx-private");
const reviewDir = resolve(privateRoot, "operator", "credential_entry_reviews");
const clipboardSessionDir = resolve(privateRoot, "operator", "credential_clipboard_sessions");

function parseArgs(argv) {
  let command = "enter";
  let start = 2;
  if (argv[2] && !argv[2].startsWith("--")) {
    command = argv[2];
    start = 3;
  }
  const options = {};
  for (let index = start; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      options[key] = "true";
      continue;
    }
    options[key] = next;
    index += 1;
  }
  return { command, options };
}

function parseEnvFile(path) {
  const values = new Map();
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue.trim();
    try {
      value = JSON.parse(value);
    } catch {
      value = value.replace(/^["']|["']$/g, "");
    }
    values.set(key, String(value));
  }
  return values;
}

function assertPrivatePath(file) {
  const absolute = isAbsolute(file) ? file : resolve(root, file);
  if (absolute !== privateRoot && !absolute.startsWith(`${privateRoot}/`)) {
    throw new Error("Secret files must be under .coworx-private/.");
  }
  if (!existsSync(absolute)) {
    throw new Error(`Secret file not found: ${absolute}`);
  }
  return absolute;
}

function assertPrivateOutputPath(file, fallbackDir) {
  const absolute = file
    ? isAbsolute(file) ? file : resolve(root, file)
    : fallbackDir;
  if (absolute !== privateRoot && !absolute.startsWith(`${privateRoot}/`)) {
    throw new Error("Credential entry review/session files must stay under .coworx-private/.");
  }
  mkdirSync(dirname(absolute), { recursive: true });
  return absolute;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function activeLeasePath() {
  return resolve(process.cwd(), ".coworx-private", "computer-use", "active.lock", "lease.json");
}

function assertActiveComputerUseLease(options, requirements = {}) {
  if (options["dry-run"] === "true") return { checked: false, reason: "dry_run" };
  const leaseId = options["lease-id"] || "";
  if (!leaseId) throw new Error("Non-dry-run secret entry requires --lease-id from the Computer Use queue.");
  const path = activeLeasePath();
  if (!existsSync(path)) throw new Error("No active Computer Use queue lease is present.");
  const lease = readJson(path);
  if (lease.lease_id !== leaseId) throw new Error("Active Computer Use lease id does not match --lease-id.");
  if (new Date(lease.expires_at).getTime() <= Date.now()) throw new Error("Active Computer Use lease is expired.");
  if (options.owner && lease.owner !== options.owner) throw new Error("Active Computer Use lease owner does not match --owner.");
  const locks = Array.isArray(lease.locks) ? lease.locks : [];
  if (!locks.includes("desktop_resource:active_window_focus")) {
    throw new Error("Active Computer Use lease must include desktop_resource:active_window_focus.");
  }
  if (requirements.clipboard && !locks.includes("desktop_resource:clipboard")) {
    throw new Error("Reviewed clipboard credential entry requires a Computer Use lease with desktop_resource:clipboard.");
  }
  return {
    checked: true,
    lease_id: lease.lease_id,
    owner: lease.owner,
    task: lease.task,
    locks,
    locks_checked: true,
  };
}

function chromeUrl() {
  return execFileSync("/bin/zsh", [
    "-lc",
    "/usr/bin/osascript -e 'tell application \"Google Chrome\" to get URL of active tab of front window'",
  ], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function hostMatches(urlText, allowedHosts) {
  let parsed;
  try {
    parsed = new URL(urlText);
  } catch {
    return false;
  }
  return allowedHosts.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
}

function typeWithSystemEvents(value) {
  // Feed the AppleScript through stdin so the secret is not present in the shell command line.
  // Some secure browser fields ignore synthetic character keystrokes. Clipboard paste is
  // still local only, and the clipboard is cleared immediately after the paste command.
  const script = `set the clipboard to ${JSON.stringify(value)}
delay 0.1
tell application "System Events"
keystroke "v" using command down
end tell
delay 0.1
set the clipboard to ""
`;
  execFileSync("osascript", [], {
    input: script,
    encoding: "utf8",
    stdio: ["pipe", "ignore", "pipe"],
  });
}

function setClipboard(value) {
  execFileSync("/usr/bin/pbcopy", [], {
    input: value,
    encoding: "utf8",
    stdio: ["pipe", "ignore", "pipe"],
  });
}

function clearClipboard() {
  execFileSync("/usr/bin/pbcopy", [], {
    input: "",
    encoding: "utf8",
    stdio: ["pipe", "ignore", "pipe"],
  });
}

function assertSafeLabel(value, name) {
  const text = String(value || "");
  if (!text) throw new Error(`Missing ${name}.`);
  const digitCount = (text.match(/\d/g) || []).length;
  const unsafePatterns = [
    /https?:\/\//i,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\b(?:token|secret|password|cookie|api[_ -]?key|webhook)\b\s*[:=]/i,
    /\b[A-Za-z0-9_-]{32,}\b/,
  ];
  if (digitCount >= 10 || unsafePatterns.some((pattern) => pattern.test(text))) {
    throw new Error(`${name} must be a non-sensitive label, not a secret or private identifier.`);
  }
  return text;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "credential-entry";
}

function loadSecretInputs(options) {
  const file = assertPrivatePath(options.file || "");
  const key = options.key || "";
  if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) throw new Error("Missing or invalid --key.");

  const values = parseEnvFile(file);
  if (!values.has(key)) throw new Error(`Secret key not found: ${key}`);

  const allowedHosts = String(options["allowed-host"] || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (options["dry-run"] !== "true" && allowedHosts.length === 0) {
    throw new Error("Non-dry-run secret entry requires --allowed-host.");
  }

  return { file, key, values, allowedHosts };
}

function assertReviewedEntry(options, inputs) {
  if (options["dry-run"] === "true") return { reviewed: false, reason: "dry_run" };
  if (options["review-packet"]) {
    const reviewPath = assertPrivatePath(options["review-packet"]);
    const packet = readJson(reviewPath);
    if (packet.status !== "reviewed_ready_for_entry") {
      throw new Error("Credential entry review packet is not ready for entry.");
    }
    if (packet.file !== inputs.file || packet.key !== inputs.key) {
      throw new Error("Credential entry review packet does not match --file and --key.");
    }
    const packetHosts = Array.isArray(packet.allowed_hosts) ? packet.allowed_hosts : [];
    for (const host of inputs.allowedHosts) {
      if (!packetHosts.includes(host)) throw new Error("Credential entry review packet does not match --allowed-host.");
    }
    return { reviewed: true, review_path: reviewPath, target_label: packet.target_label, account_label: packet.account_label };
  }

  if (options["entry-reviewed"] !== "true") {
    throw new Error("Non-dry-run secret entry requires --entry-reviewed true or --review-packet after target/account/field review.");
  }
  return {
    reviewed: true,
    target_label: assertSafeLabel(options["target-label"], "--target-label"),
    account_label: assertSafeLabel(options["account-label"], "--account-label"),
    field_label: assertSafeLabel(options["field-label"] || inputs.key, "--field-label"),
  };
}

function verifyAllowedHost(allowedHosts, options) {
  if (allowedHosts.length === 0) return null;
  const activeUrl = chromeUrl();
  if (!hostMatches(activeUrl, allowedHosts)) {
    throw new Error("Active Chrome tab is not on an allowed host for the requested credential key.");
  }
  return activeUrl;
}

function writeReviewPacket(options) {
  const inputs = loadSecretInputs({ ...options, "dry-run": "true" });
  const targetLabel = assertSafeLabel(options["target-label"], "--target-label");
  const accountLabel = assertSafeLabel(options["account-label"], "--account-label");
  const fieldLabel = assertSafeLabel(options["field-label"] || inputs.key, "--field-label");
  mkdirSync(reviewDir, { recursive: true });
  chmodSync(reviewDir, 0o700);
  const reviewPath = assertPrivateOutputPath(
    options["review-output"],
    join(reviewDir, `${Date.now()}-${slugify(targetLabel)}-${slugify(fieldLabel)}.json`)
  );
  writeFileSync(reviewPath, `${JSON.stringify({
    schema_version: 1,
    status: "reviewed_ready_for_entry",
    created_at: new Date().toISOString(),
    target_label: targetLabel,
    account_label: accountLabel,
    field_label: fieldLabel,
    file: inputs.file,
    key: inputs.key,
    allowed_hosts: inputs.allowedHosts,
    allowed_entry_modes: [
      "system-events-paste",
      "clipboard-for-computer-use-paste"
    ],
    review_rule: "Operator must verify the live target, account/workflow, field focus, active lease, and no secret-visible evidence before entry.",
    evidence_rule: "Evidence may cite this packet path, labels, file path, key name, allowed hosts, lease id, and entry mode only. Never include the value.",
    values_printed: false,
    values_embedded: false
  }, null, 2)}\n`, { mode: 0o600 });
  chmodSync(reviewPath, 0o600);
  console.log(JSON.stringify({
    ok: true,
    review_path: reviewPath,
    target_label: targetLabel,
    account_label: accountLabel,
    field_label: fieldLabel,
    key: inputs.key,
    allowed_hosts: inputs.allowedHosts,
    values_printed: false
  }, null, 2));
}

function writeClipboardSession(options, inputs, leaseCheck) {
  mkdirSync(clipboardSessionDir, { recursive: true });
  chmodSync(clipboardSessionDir, 0o700);
  const sessionPath = assertPrivateOutputPath(
    options["clipboard-session-output"],
    join(clipboardSessionDir, `${Date.now()}-${slugify(inputs.key)}.json`)
  );
  writeFileSync(sessionPath, `${JSON.stringify({
    schema_version: 1,
    status: "secret_on_clipboard_waiting_for_computer_use_paste",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 60_000).toISOString(),
    file: inputs.file,
    key: inputs.key,
    allowed_hosts: inputs.allowedHosts,
    lease_id: leaseCheck.lease_id || null,
    owner: leaseCheck.owner || null,
    clear_command: `node scripts/coworx_type_secret_to_front_app.mjs clear-clipboard --clipboard-session ${sessionPath}`,
    operator_next_step: "Use Computer Use to paste into the already reviewed focused field, then immediately run the clear command.",
    values_printed: false,
    values_embedded: false
  }, null, 2)}\n`, { mode: 0o600 });
  chmodSync(sessionPath, 0o600);
  return sessionPath;
}

function enterSecret(options) {
  if (options.help === "true") {
    console.log(`Usage:
  node scripts/coworx_type_secret_to_front_app.mjs review --file .coworx-private/secrets/app.local.env --key ENV_KEY --allowed-host portal.example.com --target-label APP --account-label ACCOUNT --field-label password
  node scripts/coworx_type_secret_to_front_app.mjs enter --file .coworx-private/secrets/app.local.env --key ENV_KEY --allowed-host portal.example.com --lease-id LEASE_ID --entry-reviewed true --target-label APP --account-label ACCOUNT --field-label password
  node scripts/coworx_type_secret_to_front_app.mjs enter --entry-mode clipboard-for-computer-use-paste --file .coworx-private/secrets/app.local.env --key ENV_KEY --allowed-host portal.example.com --lease-id LEASE_ID --review-packet REVIEW_PACKET
  node scripts/coworx_type_secret_to_front_app.mjs clear-clipboard --clipboard-session SESSION_PACKET
  node scripts/coworx_type_secret_to_front_app.mjs --file .coworx-private/secrets/app.local.env --key ENV_KEY --dry-run

This prints only key and domain metadata. It never prints secret values.`);
    return;
  }

  const inputs = loadSecretInputs(options);
  const entryMode = options["entry-mode"] || "system-events-paste";
  if (!["system-events-paste", "clipboard-for-computer-use-paste"].includes(entryMode)) {
    throw new Error("--entry-mode must be system-events-paste or clipboard-for-computer-use-paste.");
  }
  const needsClipboard = entryMode === "clipboard-for-computer-use-paste";
  const leaseCheck = assertActiveComputerUseLease(options, { clipboard: needsClipboard });
  const review = assertReviewedEntry(options, inputs);

  let activeUrl = null;
  if (inputs.allowedHosts.length > 0) {
    activeUrl = verifyAllowedHost(inputs.allowedHosts, options);
  }

  let clipboardSessionPath = null;
  if (options["dry-run"] !== "true") {
    if (entryMode === "system-events-paste") {
      typeWithSystemEvents(inputs.values.get(inputs.key));
    } else {
      clipboardSessionPath = writeClipboardSession(options, inputs, leaseCheck);
      setClipboard(inputs.values.get(inputs.key));
    }
  }

  console.log(JSON.stringify({
    ok: true,
    file: inputs.file,
    key: inputs.key,
    allowed_hosts: inputs.allowedHosts,
    checked_chrome_url: Boolean(activeUrl),
    entry_reviewed: review.reviewed,
    review_path: review.review_path || null,
    entry_mode: entryMode,
    clipboard_session_path: clipboardSessionPath,
    requires_computer_use_paste: entryMode === "clipboard-for-computer-use-paste" && options["dry-run"] !== "true",
    active_lease_checked: leaseCheck.checked,
    lease_id: leaseCheck.lease_id || null,
    typed: entryMode === "system-events-paste" && options["dry-run"] !== "true",
    clipboard_set: entryMode === "clipboard-for-computer-use-paste" && options["dry-run"] !== "true",
    values_printed: false,
  }, null, 2));
}

function clearClipboardCommand(options) {
  if (!options["clipboard-session"]) {
    throw new Error("clear-clipboard requires --clipboard-session so cleanup is tied to a reviewed session packet.");
  }
  const sessionPath = assertPrivatePath(options["clipboard-session"]);
  clearClipboard();
  if (existsSync(sessionPath)) {
    const packet = readJson(sessionPath);
    writeFileSync(sessionPath, `${JSON.stringify({
      ...packet,
      status: "clipboard_cleared",
      cleared_at: new Date().toISOString(),
      values_printed: false,
      values_embedded: false
    }, null, 2)}\n`, { mode: 0o600 });
    chmodSync(sessionPath, 0o600);
  }
  console.log(JSON.stringify({
    ok: true,
    clipboard_cleared: true,
    clipboard_session: sessionPath,
    values_printed: false
  }, null, 2));
}

function demoTest() {
  mkdirSync(privateRoot, { recursive: true });
  const tempDir = mkdtempSync(join(privateRoot, "tmp-credential-entry-"));
  try {
    const file = join(tempDir, "demo.local.env");
    writeFileSync(file, "COWORX_DEMO_PASSWORD=\"demo-password\"\n", { mode: 0o600 });
    const inputs = loadSecretInputs({ file, key: "COWORX_DEMO_PASSWORD", "allowed-host": "portal.example.test", "dry-run": "true" });
    if (!inputs.allowedHosts.includes("portal.example.test")) throw new Error("demo allowed host was not parsed");
    writeReviewPacket({
      file,
      key: "COWORX_DEMO_PASSWORD",
      "allowed-host": "portal.example.test",
      "target-label": "demo portal",
      "account-label": "demo account",
      "field-label": "password",
      "review-output": join(tempDir, "review.json")
    });
    let rejected = false;
    try {
      assertReviewedEntry({ "dry-run": "false" }, inputs);
    } catch (error) {
      rejected = error.message.includes("entry-reviewed");
    }
    if (!rejected) throw new Error("demo unreviewed non-dry-run entry was not rejected");
    rejected = false;
    try {
      assertActiveComputerUseLease({ "dry-run": "false", "lease-id": "missing" }, { clipboard: true });
    } catch (error) {
      rejected = error.message.includes("No active Computer Use") || error.message.includes("lease");
    }
    if (!rejected) throw new Error("demo missing clipboard lease was not rejected");
    console.log("Coworx secret entry helper demo test passed.");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function main() {
  const { command, options } = parseArgs(process.argv);
  if (command === "review") writeReviewPacket(options);
  else if (command === "enter") enterSecret(options);
  else if (command === "clear-clipboard") clearClipboardCommand(options);
  else if (command === "demo-test") demoTest();
  else throw new Error(`Unknown command: ${command}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
