#!/usr/bin/env node
import { chmodSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const secretsDir = join(root, ".coworx-private", "secrets");

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

function writeSecretFile(name, entries, options = {}) {
  mkdirSync(secretsDir, { recursive: true });
  chmodSync(secretsDir, 0o700);

  const slug = assertSafeName(name);
  const path = join(secretsDir, `${slug}.local.env`);
  if (existsSync(path) && options.force !== "true") {
    throw new Error(`Secret file already exists: ${path}. Pass --force true to replace it.`);
  }

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
  console.log(JSON.stringify({
    ok: true,
    path,
    stored_keys: entries.map(([key]) => key),
    values_printed: false
  }, null, 2));
}

function template(options) {
  const name = assertSafeName(options.name);
  const usernameEnv = options["username-env"] || "COWORX_USERNAME";
  const passwordEnv = options["password-env"] || "COWORX_PASSWORD";
  const path = writeSecretFile(name, [
    [usernameEnv, "REPLACE_LOCALLY_WITH_USERNAME"],
    [passwordEnv, "REPLACE_LOCALLY_WITH_PASSWORD"]
  ], options);
  console.log(JSON.stringify({
    ok: true,
    path,
    template_only: true,
    replace_values_locally: true
  }, null, 2));
}

function demoTest() {
  const path = writeSecretFile("demo-local-secret-store", [
    ["COWORX_DEMO_USERNAME", "demo-user"],
    ["COWORX_DEMO_PASSWORD", "demo-password"]
  ], { force: "true" });
  rmSync(path, { force: true });
  console.log("Coworx local secret store demo test passed.");
}

const { command, options } = parseArgs(process.argv);

try {
  if (command === "from-env") fromEnv(options);
  else if (command === "template") template(options);
  else if (command === "demo-test") demoTest();
  else {
    console.error(`Usage:
  node ${basename(process.argv[1])} from-env --name APP --username-env USER_ENV --password-env PASSWORD_ENV [--extra-env ENV_A,ENV_B] [--force true]
  node ${basename(process.argv[1])} template --name APP [--username-env USER_ENV] [--password-env PASSWORD_ENV] [--force true]
  node ${basename(process.argv[1])} demo-test`);
    process.exit(2);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
