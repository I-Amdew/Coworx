#!/usr/bin/env node
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const secretsDir = join(root, ".coworx-private", "secrets");
const referenceDir = join(root, ".coworx-private", "operator", "credential_packets");

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

function envQuote(value) {
  return JSON.stringify(String(value));
}

function assertSafeName(name) {
  const slug = slugify(name);
  if (!slug) throw new Error("Missing --name");
  return slug;
}

function assertEnvKey(key) {
  const text = String(key || "");
  if (!/^[A-Z_][A-Z0-9_]*$/.test(text)) {
    throw new Error(`Invalid env key: ${text || "(empty)"}`);
  }
  return text;
}

function defaultKey(prefix, suffix) {
  return `COWORX_${slugify(prefix).replace(/-/g, "_").toUpperCase()}_${suffix}`;
}

function writeCredentialReference(name, secretPath, entries, options = {}) {
  mkdirSync(referenceDir, { recursive: true });
  chmodSync(referenceDir, 0o700);
  const slug = assertSafeName(name);
  const target = options.target || slug;
  const accountLabel = options["account-label"] || slug;
  const referencePath = join(referenceDir, `${Date.now()}-${slug}.json`);
  writeFileSync(referencePath, `${JSON.stringify({
    schema_version: 1,
    created_at: new Date().toISOString(),
    target,
    account_label: accountLabel,
    source_type: "private_file",
    intake_mode: options["intake-mode"] || "local_secure_capture",
    source_path: secretPath,
    stored_keys: entries.map(([key]) => key),
    values_printed: false,
    values_embedded: false,
    executor_rule: "Read values only inside an approved local executor after verifying the target app/domain and account label.",
    evidence_rule: "Evidence may cite this packet path, source path, source type, target, account label, and key names only. Never include values.",
    stop_conditions: [
      "wrong_domain_or_app",
      "account_recovery",
      "password_change",
      "security_settings",
      "payment_settings",
      "identity_verification",
      "credential_cookie_or_token_export",
      "unexpected_mfa_outside_approved_handoff"
    ]
  }, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  chmodSync(referencePath, 0o600);
  return referencePath;
}

function continuationPrompt(options, referencePath) {
  const target = options.target || assertSafeName(options.name);
  const accountLabel = options["account-label"] || assertSafeName(options.name);
  const goal = options["continuation-goal"] || `continue the approved ${target} workflow`;
  return [
    "Use Coworx.",
    goal,
    `Use the saved credential reference at ${referencePath} for ${target} (${accountLabel}).`,
    "Do not ask for credentials again, do not expose secret values, and use the approved local executor or credential resolver before Computer Use secret entry.",
    "Continue from the active directive ledger or recreate the directive if needed, then complete the workflow with evidence."
  ].join(" ");
}

function writeSecretFile(name, entries, options = {}) {
  mkdirSync(secretsDir, { recursive: true });
  chmodSync(secretsDir, 0o700);

  const slug = assertSafeName(name);
  const path = join(secretsDir, `${slug}.local.env`);
  if (existsSync(path) && options.force !== "true") {
    throw new Error(`Secret file already exists: ${path}. Pass --force true to replace it.`);
  }

  for (const [key] of entries) assertEnvKey(key);

  const lines = [
    "# Coworx local secret file. Ignored by git.",
    "# Do not paste these values into chat, logs, screenshots, traces, or committed files.",
    ...entries.map(([key, value]) => `${key}=${envQuote(value)}`),
    ""
  ];
  writeFileSync(path, lines.join("\n"), { encoding: "utf8", mode: 0o600 });
  chmodSync(path, 0o600);
  return path;
}

function printResult(result) {
  console.log(JSON.stringify({
    ...result,
    values_printed: false
  }, null, 2));
}

function fromEnv(options) {
  const usernameEnv = options["username-env"];
  const passwordEnv = options["password-env"];
  if (!usernameEnv || !passwordEnv) throw new Error("from-env requires --username-env and --password-env");

  const entries = [];
  for (const envName of [usernameEnv, passwordEnv]) {
    const value = process.env[envName];
    if (!value) throw new Error(`Environment variable is unset or empty: ${envName}`);
    entries.push([envName, value]);
  }

  if (options["extra-env"]) {
    for (const envName of options["extra-env"].split(",").map((item) => item.trim()).filter(Boolean)) {
      const value = process.env[envName];
      if (!value) throw new Error(`Environment variable is unset or empty: ${envName}`);
      entries.push([envName, value]);
    }
  }

  const path = writeSecretFile(options.name, entries, options);
  const referencePath = writeCredentialReference(options.name, path, entries, options);
  printResult({
    ok: true,
    path,
    reference_path: referencePath,
    stored_keys: entries.map(([key]) => key),
    continuation_prompt: continuationPrompt(options, referencePath),
  });
}

function fromStdin(options) {
  if (options["chat-intake"] !== "true") {
    throw new Error("from-stdin is only for explicitly approved chat intake transfer. Pass --chat-intake true.");
  }
  const usernameKey = assertEnvKey(options["username-env"] || defaultKey(options.name, "USERNAME"));
  const passwordKey = assertEnvKey(options["password-env"] || defaultKey(options.name, "PASSWORD"));
  const raw = readFileSync(0, "utf8");
  if (!raw.trim()) throw new Error("from-stdin requires a JSON payload on stdin.");
  const payload = JSON.parse(raw);
  const entries = [];

  if (!payload.username || !payload.password) {
    throw new Error("from-stdin JSON requires username and password fields.");
  }
  entries.push([usernameKey, payload.username]);
  entries.push([passwordKey, payload.password]);

  if (payload.extras && typeof payload.extras === "object" && !Array.isArray(payload.extras)) {
    for (const [key, value] of Object.entries(payload.extras)) {
      entries.push([assertEnvKey(key), value]);
    }
  }

  const path = writeSecretFile(options.name, entries, { ...options, "intake-mode": "approved_chat_intake_transfer" });
  const referencePath = writeCredentialReference(options.name, path, entries, { ...options, "intake-mode": "approved_chat_intake_transfer" });
  printResult({
    ok: true,
    path,
    reference_path: referencePath,
    stored_keys: entries.map(([key]) => key),
    intake_mode: "approved_chat_intake_transfer",
    values_read_from_stdin: true,
    values_printed: false,
    continuation_required: true,
    continuation_prompt: continuationPrompt(options, referencePath),
  });
}

function template(options) {
  const name = assertSafeName(options.name);
  const usernameEnv = assertEnvKey(options["username-env"] || defaultKey(name, "USERNAME"));
  const passwordEnv = assertEnvKey(options["password-env"] || defaultKey(name, "PASSWORD"));
  const entries = [
    [usernameEnv, "REPLACE_LOCALLY_WITH_USERNAME"],
    [passwordEnv, "REPLACE_LOCALLY_WITH_PASSWORD"]
  ];
  if (options["extra-env"]) {
    for (const envName of options["extra-env"].split(",").map((item) => item.trim()).filter(Boolean)) {
      entries.push([assertEnvKey(envName), "REPLACE_LOCALLY_IF_APPLICABLE"]);
    }
  }
  const path = writeSecretFile(name, entries, options);
  printResult({
    ok: true,
    path,
    template_only: true,
    replace_values_locally: true,
    stored_keys: entries.map(([key]) => key),
  });
}

function requireTty() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("interactive capture requires a TTY. Use from-env or template when running non-interactively.");
  }
}

function promptHidden(prompt) {
  requireTty();
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;
    let value = "";
    const cleanup = () => {
      stdin.off("data", onData);
      if (stdin.setRawMode) stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
    };
    const finish = () => {
      cleanup();
      process.stdout.write("\n");
      resolve(value);
    };
    const onData = (chunk) => {
      const text = String(chunk);
      for (const char of text) {
        if (char === "\u0003") {
          cleanup();
          process.stdout.write("\n");
          reject(new Error("Secret capture cancelled."));
          return;
        }
        if (char === "\r" || char === "\n") {
          finish();
          return;
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        value += char;
      }
    };
    process.stdout.write(prompt);
    stdin.setEncoding("utf8");
    if (stdin.setRawMode) stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function capture(options) {
  const name = assertSafeName(options.name);
  const usernameKey = assertEnvKey(options["username-env"] || defaultKey(name, "USERNAME"));
  const passwordKey = assertEnvKey(options["password-env"] || defaultKey(name, "PASSWORD"));
  const entries = [];

  const username = await promptHidden(`Enter username for ${name} (${usernameKey}, input hidden): `);
  if (!username) throw new Error("Username cannot be empty.");
  entries.push([usernameKey, username]);

  const password = await promptHidden(`Enter password for ${name} (${passwordKey}, input hidden): `);
  if (!password) throw new Error("Password cannot be empty.");
  const confirmPassword = await promptHidden(`Re-enter password for ${name}: `);
  if (password !== confirmPassword) throw new Error("Password entries did not match. Nothing was saved.");
  entries.push([passwordKey, password]);

  if (options["extra-env"]) {
    for (const envName of options["extra-env"].split(",").map((item) => item.trim()).filter(Boolean)) {
      const key = assertEnvKey(envName);
      const value = await promptHidden(`Enter optional secret for ${name} (${key}, leave blank to skip): `);
      if (value) entries.push([key, value]);
    }
  }

  const path = writeSecretFile(name, entries, options);
  const referencePath = writeCredentialReference(name, path, entries, options);
  printResult({
    ok: true,
    path,
    reference_path: referencePath,
    stored_keys: entries.map(([key]) => key),
    capture_method: "interactive_hidden_tty",
  });
}

function demoTest() {
  const path = writeSecretFile("demo-local-secret-store", [
    ["COWORX_DEMO_USERNAME", "demo-user"],
    ["COWORX_DEMO_PASSWORD", "demo-password"]
  ], { force: "true" });
  const referencePath = writeCredentialReference("demo-local-secret-store", path, [
    ["COWORX_DEMO_USERNAME", "demo-user"],
    ["COWORX_DEMO_PASSWORD", "demo-password"]
  ], { target: "demo.example", "account-label": "demo-account" });
  const prompt = continuationPrompt({
    name: "demo-local-secret-store",
    target: "demo.example",
    "account-label": "demo-account",
    "continuation-goal": "finish the demo workflow"
  }, referencePath);
  if (!prompt.includes(referencePath) || !prompt.includes("Use Coworx.")) {
    throw new Error("continuation prompt was not generated");
  }
  rmSync(path, { force: true });
  rmSync(referencePath, { force: true });
  console.log("Coworx local secret store demo test passed.");
}

const { command, options } = parseArgs(process.argv);

try {
  if (command === "from-env") fromEnv(options);
  else if (command === "from-stdin") fromStdin(options);
  else if (command === "capture") await capture(options);
  else if (command === "template") template(options);
  else if (command === "demo-test") demoTest();
  else {
    console.error(`Usage:
  node ${basename(process.argv[1])} from-env --name APP --username-env USER_ENV --password-env PASSWORD_ENV [--extra-env ENV_A,ENV_B] [--force true]
  node ${basename(process.argv[1])} from-stdin --name APP --target DOMAIN_OR_APP --account-label LABEL --chat-intake true [--continuation-goal GOAL] < secure-intake.json
  node ${basename(process.argv[1])} capture --name APP [--target DOMAIN_OR_APP] [--account-label LABEL] [--username-env USER_ENV] [--password-env PASSWORD_ENV] [--extra-env ENV_A,ENV_B] [--force true]
  node ${basename(process.argv[1])} template --name APP [--username-env USER_ENV] [--password-env PASSWORD_ENV] [--extra-env ENV_A,ENV_B] [--force true]
  node ${basename(process.argv[1])} demo-test`);
    process.exit(2);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
