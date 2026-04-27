#!/usr/bin/env node
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();
const privateRoot = join(root, ".coworx-private");
const defaultSecretsDir = join(privateRoot, "secrets");
const packetDir = join(privateRoot, "operator", "credential_packets");

function parseArgs(argv) {
  const command = argv[2];
  const options = {};
  for (let index = 3; index < argv.length; index += 1) {
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

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function assertSafeLabel(value, name) {
  const text = String(value || "");
  if (!text) throw new Error(`Missing ${name}`);
  const digitCount = (text.match(/\d/g) || []).length;
  const unsafePatterns = [
    /https?:\/\//i,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\b(?:token|secret|password|cookie|api[_ -]?key|webhook)\b\s*[:=]/i,
    /\b[A-Za-z0-9_-]{32,}\b/
  ];
  if (digitCount >= 10 || unsafePatterns.some((pattern) => pattern.test(text))) {
    throw new Error(`${name} must be a non-sensitive label or env key name, not a secret value.`);
  }
  return text;
}

function resolvePrivatePath(value, fallbackDir = defaultSecretsDir) {
  if (!value) throw new Error("Missing --file or --name");
  const path = value.endsWith(".local.env")
    ? value
    : join(fallbackDir, `${slugify(value)}.local.env`);
  const absolute = isAbsolute(path) ? path : resolve(root, path);
  if (!absolute.startsWith(privateRoot) && !absolute.startsWith(tmpdir())) {
    throw new Error("Credential files must be under .coworx-private/ or a temporary test directory.");
  }
  return absolute;
}

function resolveSourceReference(value) {
  if (!value) return null;
  const text = String(value);
  if (/^(keychain|vault|op|password-manager|skill-ref):\/\//i.test(text)) return text;

  const absolute = isAbsolute(text) ? text : resolve(root, text);
  const allowedPrefixes = [
    privateRoot,
    join(process.env.HOME || "", ".codex"),
    join(process.env.HOME || "", ".claude"),
    join(process.env.HOME || "", "Library", "Application Support", "Claude")
  ].filter(Boolean);

  if (!allowedPrefixes.some((prefix) => absolute.startsWith(prefix))) {
    throw new Error("Credential source references must be approved local private paths or vault/keychain handles.");
  }

  return absolute;
}

function parseEnvFile(path) {
  if (!existsSync(path)) throw new Error(`Credential source not found: ${path}`);
  const keys = [];
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
    if (match) keys.push(match[1]);
  }
  return keys;
}

function inspect(options) {
  const path = resolvePrivatePath(options.file || options.name);
  const required = String(options["required-keys"] || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  for (const key of required) assertSafeLabel(key, "--required-keys");

  const keys = parseEnvFile(path);
  const missing = required.filter((key) => !keys.includes(key));
  if (missing.length > 0) {
    throw new Error(`Credential source is missing required keys: ${missing.join(", ")}`);
  }
  console.log(JSON.stringify({
    ok: true,
    path,
    stored_keys: keys,
    required_keys_present: required,
    values_printed: false
  }, null, 2));
}

function packet(options) {
  const target = assertSafeLabel(options.target, "--target");
  const accountLabel = assertSafeLabel(options["account-label"], "--account-label");
  const sourceType = assertSafeLabel(options["source-type"] || "private_file", "--source-type");
  const path = options.file || options.name ? resolvePrivatePath(options.file || options.name) : null;
  const sourceRef = resolveSourceReference(options["source-ref"]);
  const storedKeys = path ? parseEnvFile(path) : [];
  if (!path && !sourceRef) {
    throw new Error("Credential packet requires --name/--file for private_file sources or --source-ref for approved local references.");
  }
  mkdirSync(packetDir, { recursive: true });
  chmodSync(packetDir, 0o700);
  const packetPath = join(packetDir, `${Date.now()}-${slugify(target)}.json`);
  writeFileSync(packetPath, `${JSON.stringify({
    schema_version: 1,
    created_at: new Date().toISOString(),
    target,
    account_label: accountLabel,
    source_type: sourceType,
    source_path: path,
    source_reference: sourceRef,
    stored_keys: storedKeys,
    values_printed: false,
    values_embedded: false,
    executor_rule: "Read secret values only inside the approved local executor. Do not print, log, screenshot, trace, prompt, report, or send values to subagents.",
    evidence_rule: "Evidence may cite this packet path, target, account label, source type, source path, and key names only."
  }, null, 2)}\n`, { mode: 0o600 });
  chmodSync(packetPath, 0o600);
  console.log(JSON.stringify({
    ok: true,
    packet_path: packetPath,
    target,
    account_label: accountLabel,
    source_type: sourceType,
    source_reference: sourceRef,
    stored_keys: storedKeys,
    values_printed: false
  }, null, 2));
}

function demoTest() {
  const tempDir = mkdtempSync(join(tmpdir(), "coworx-credential-resolver-"));
  try {
    const file = join(tempDir, "demo.local.env");
    writeFileSync(file, "COWORX_DEMO_USERNAME=\"demo-user\"\nCOWORX_DEMO_PASSWORD=\"demo-password\"\n", { mode: 0o600 });
    const keys = parseEnvFile(file);
    if (!keys.includes("COWORX_DEMO_USERNAME") || !keys.includes("COWORX_DEMO_PASSWORD")) {
      throw new Error("demo env file keys were not parsed");
    }
    console.log("Coworx credential resolver demo test passed.");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

const { command, options } = parseArgs(process.argv);

try {
  if (command === "inspect") inspect(options);
  else if (command === "packet") packet(options);
  else if (command === "demo-test") demoTest();
  else {
    console.error(`Usage:
  node ${basename(process.argv[1])} inspect --name APP_OR_FILE [--required-keys ENV_A,ENV_B]
  node ${basename(process.argv[1])} packet --target APP --account-label LABEL --source-type private_file --name APP_OR_FILE
  node ${basename(process.argv[1])} packet --target APP --account-label LABEL --source-type local_skill_ref --source-ref PATH_OR_HANDLE
  node ${basename(process.argv[1])} demo-test`);
    process.exit(2);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
