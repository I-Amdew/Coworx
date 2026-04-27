#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

function parseArgs(argv) {
  const options = {};
  for (let index = 2; index < argv.length; index += 1) {
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
  return options;
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
  const root = process.cwd();
  const privateRoot = resolve(root, ".coworx-private");
  const absolute = isAbsolute(file) ? file : resolve(root, file);
  if (absolute !== privateRoot && !absolute.startsWith(`${privateRoot}/`)) {
    throw new Error("Secret files must be under .coworx-private/.");
  }
  if (!existsSync(absolute)) {
    throw new Error(`Secret file not found: ${absolute}`);
  }
  return absolute;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function activeLeasePath() {
  return resolve(process.cwd(), ".coworx-private", "computer-use", "active.lock", "lease.json");
}

function assertActiveComputerUseLease(options) {
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
  return {
    checked: true,
    lease_id: lease.lease_id,
    owner: lease.owner,
    locks_checked: true,
  };
}

function chromeUrl() {
  return execFileSync("osascript", [
    "-e",
    'tell application "Google Chrome"',
    "-e",
    "get URL of active tab of front window",
    "-e",
    "end tell",
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

function main() {
  const options = parseArgs(process.argv);
  if (options.help === "true") {
    console.log(`Usage:
  node scripts/coworx_type_secret_to_front_app.mjs --file .coworx-private/secrets/app.local.env --key ENV_KEY --allowed-host portal.example.com --lease-id LEASE_ID
  node scripts/coworx_type_secret_to_front_app.mjs --file .coworx-private/secrets/app.local.env --key ENV_KEY --dry-run

This prints only key and domain metadata. It never prints secret values.`);
    return;
  }

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

  const leaseCheck = assertActiveComputerUseLease(options);

  let activeUrl = null;
  if (allowedHosts.length > 0) {
    activeUrl = chromeUrl();
    if (!hostMatches(activeUrl, allowedHosts)) {
      throw new Error(`Active Chrome tab is not on an allowed host for ${key}.`);
    }
  }

  if (options["dry-run"] !== "true") {
    typeWithSystemEvents(values.get(key));
  }

  console.log(JSON.stringify({
    ok: true,
    file,
    key,
    allowed_hosts: allowedHosts,
    checked_chrome_url: Boolean(activeUrl),
    active_lease_checked: leaseCheck.checked,
    lease_id: leaseCheck.lease_id || null,
    typed: options["dry-run"] !== "true",
    values_printed: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
