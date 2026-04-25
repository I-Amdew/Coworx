#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();

const requiredFiles = [
  "AGENTS.md",
  "COWORX.md",
  "README.md",
  ".codex/config.toml",
  ".gitignore",
  "docs/director_use.md",
  "docs/directive_follow_through.md",
  "docs/prompt_injection_and_directive_state.md",
  "docs/parallelism_and_locks.md",
  "docs/safety_policy.md",
  "docs/operator_protocol.md",
  "docs/credential_handoff_protocol.md",
  "docs/local_credential_persistence.md",
  "docs/standby_mode.md",
  "docs/capability_discovery.md",
  "docs/task_lifecycle.md",
  "docs/subagent_protocol.md",
  "docs/playwright_policy.md",
  "docs/computer_use_policy.md",
  "docs/memory_policy.md",
  "docs/architecture.md",
  "docs/plugin_skill_router.md",
  "docs/project_workspace_model.md",
  "docs/non_coding_workflows.md",
  "docs/private_memory_policy.md",
  "docs/account_login_handoff.md",
  "docs/real_work_task_model.md",
  "docs/concurrency_model.md",
  "docs/private_real_work_testing.md",
  "docs/session_backed_account_operations.md",
  "docs/external_action_protocol.md",
  "docs/cowork_parity_research.md",
  "docs/claude_conversation_import_protocol.md",
  "docs/calendar_policy.md",
  "docs/final_action_reporting.md",
  "docs/templates/LOCAL_SECRET_SETUP.md",
  "config/README.md",
  "config/TEMPLATE_APPROVED_SITE.json",
  "config/TEMPLATE_AUTONOMY_GRANT.json",
  "config/TEMPLATE_BROWSER_LANE.json",
  "config/TEMPLATE_ACTION_LEVELS.json",
  "config/TEMPLATE_CREDENTIAL_HANDOFF.json",
  "config/TEMPLATE_STANDBY_MODE.json",
  "operator/action_requests/TEMPLATE_ACTION_REQUEST.md",
  "operator/action_results/TEMPLATE_ACTION_RESULT.md",
  "operator/approvals/TEMPLATE_EXTERNAL_ACTION_APPROVAL.md",
  "operator/approvals/TEMPLATE_USER_RESPONSIBILITY_ACK.md",
  "operator/lane_status/TEMPLATE_OPERATOR_LEASE.md",
  "operator/lane_status/TEMPLATE_BROWSER_LANE_LEASE.md",
  "outputs/reports/TEMPLATE_ACTION_LEDGER.md",
  "runs/active/TEMPLATE_RUN_LOG.md",
  "outputs/reports/TEMPLATE_FINAL_REPORT.md",
  "memory/capabilities/TEMPLATE_CAPABILITY_MAP.md",
  "queue/todo/TEMPLATE_CREDENTIAL_WORKFLOW_TEST.md",
  "evals/smoke_tests/browser_demo.md",
  "evals/smoke_tests/computer_use_safe_app_test.md",
  "evals/smoke_tests/credential_handoff_policy.md",
  "evals/smoke_tests/directive_guard_policy.md",
  "evals/smoke_tests/standby_mode.md",
  "evals/regression_tests/privacy_and_approval_gates.md",
  "scripts/coworx_directive_guard.mjs",
  "scripts/coworx_local_secret_store.mjs",
  "scripts/coworx_standby.mjs",
];

const skillDirs = [
  "coworx-dispatcher",
  "coworx-coordinator",
  "coworx-task-runner",
  "coworx-operator",
  "coworx-playwright-browser",
  "coworx-computer-use",
  "coworx-memory-writer",
  "coworx-reviewer",
  "coworx-app-mapper",
  "coworx-safety-reviewer",
  "coworx-capability-router",
  "coworx-account-workflow-mapper",
  "coworx-real-work-runner",
];

const requiredSkillSections = [
  "## Description",
  "## Role",
  "## When To Use",
  "## Input Format",
  "## Output Format",
  "## Rules",
  "## Failure Or Blocked Behavior",
];

const requiredTemplateTerms = [
  "Privacy Classification",
  "Output Path",
  "Account Or App Identity",
  "Data Allowed To Read Or Capture",
  "Screenshot Or Trace Policy",
  "External Transmission Boundary",
  "Active Directive File",
  "Privileged Workflow Information",
  "Persist credentials for future approved use",
  "Expires",
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) failures.push(`Missing required file: ${file}`);
}

for (const dir of skillDirs) {
  const file = join(root, ".agents", "skills", dir, "SKILL.md");
  if (!existsSync(file)) {
    failures.push(`Missing skill: ${dir}`);
    continue;
  }
  const body = readFileSync(file, "utf8");
  for (const section of requiredSkillSections) {
    if (!body.includes(section)) failures.push(`Skill ${dir} missing ${section}`);
  }
}

const actionRequest = readFileSync(join(root, "operator/action_requests/TEMPLATE_ACTION_REQUEST.md"), "utf8");
for (const term of requiredTemplateTerms) {
  if (!actionRequest.includes(term)) failures.push(`Action request template missing ${term}`);
}

const privatePolicy = readFileSync(join(root, "docs/private_memory_policy.md"), "utf8");
for (const term of ["signed-in accounts", "meetings", "screenshots", "Sanitization Checklist"]) {
  if (!privatePolicy.includes(term)) failures.push(`Private memory policy missing ${term}`);
}

for (const file of [
  "config/TEMPLATE_APPROVED_SITE.json",
  "config/TEMPLATE_AUTONOMY_GRANT.json",
  "config/TEMPLATE_BROWSER_LANE.json",
  "config/TEMPLATE_ACTION_LEVELS.json",
  "config/TEMPLATE_CREDENTIAL_HANDOFF.json",
  "config/TEMPLATE_STANDBY_MODE.json",
]) {
  try {
    JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (error) {
    failures.push(`Invalid JSON in ${file}: ${error.message}`);
  }
}

const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
for (const pattern of [
  ".coworx-private/",
  ".coworx-private/secrets/",
  ".coworx-private/browser-profiles/",
  ".coworx-private/session-state/",
  ".coworx-private/directives/",
  ".coworx-private/standby/",
  ".coworx-private/traces/",
  ".coworx-private/screenshots/raw/",
  "memory/private/",
  "outputs/private/",
  ".playwright-cli/",
  "*.secret",
  "*.secrets",
  "*.local.env",
]) {
  if (!gitignore.includes(pattern)) failures.push(`.gitignore missing ${pattern}`);
}

const requiredConcepts = [
  ["AGENTS.md", "Parallelism Rule"],
  ["AGENTS.md", "Directive Follow-Through"],
  ["AGENTS.md", "file-backed directive ledger"],
  ["AGENTS.md", "Subagent Delivery Rule"],
  ["AGENTS.md", "project-backed workspace"],
  ["AGENTS.md", "available capabilities"],
  ["AGENTS.md", "Computer Use Restriction Rule"],
  ["AGENTS.md", "delegated authority"],
  ["docs/director_use.md", "accountable Director"],
  ["docs/directive_follow_through.md", "Directive Ledger"],
  ["docs/directive_follow_through.md", "file-backed"],
  ["docs/directive_follow_through.md", "Subagent Use For Delivery"],
  ["docs/prompt_injection_and_directive_state.md", "File-Backed Directive Ledger"],
  ["docs/prompt_injection_and_directive_state.md", "Prompt Injection Checks"],
  ["docs/prompt_injection_and_directive_state.md", "Privileged Workflow Information"],
  ["docs/prompt_injection_and_directive_state.md", "UI Change And Reuse Gate"],
  ["docs/capability_discovery.md", "Capability Discovery"],
  ["docs/capability_discovery.md", "Capability Map"],
  ["docs/project_workspace_model.md", "Project Workspace Model"],
  ["docs/project_workspace_model.md", "Local Customization Loop"],
  ["docs/parallelism_and_locks.md", "Lock resources, not agents"],
  ["docs/safety_policy.md", "Level 3"],
  ["docs/safety_policy.md", "Level 4"],
  ["docs/safety_policy.md", "Privileged Workflow Information"],
  ["docs/operator_protocol.md", "resource locks"],
  ["docs/credential_handoff_protocol.md", "local-only credential handoff"],
  ["docs/credential_handoff_protocol.md", "Coworx may use secrets locally"],
  ["docs/credential_handoff_protocol.md", "explicitly delegated ignored private secret storage"],
  ["docs/credential_handoff_protocol.md", "Unsupported Or Unsafe Credential Handling"],
  ["docs/credential_handoff_protocol.md", "Protected Final Actions"],
  ["docs/local_credential_persistence.md", "Local Credential Persistence"],
  ["docs/local_credential_persistence.md", "explicitly delegates credential persistence"],
  ["docs/local_credential_persistence.md", "scripts/coworx_local_secret_store.mjs"],
  ["docs/account_login_handoff.md", "local-only credential handoff"],
  ["docs/account_login_handoff.md", "ignored local secret file"],
  ["docs/safety_policy.md", "Coworx may use secrets locally"],
  ["docs/safety_policy.md", "explicitly asks Coworx to save credentials"],
  ["docs/safety_policy.md", "Credential exposure"],
  ["docs/computer_use_policy.md", "Before Credential Entry"],
  ["docs/playwright_policy.md", "local credential handoff"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", ".coworx-private/secrets/"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", "Do not commit real credentials"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "COWORX_EXAMPLE_USERNAME"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "mfa_policy"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "do_not_store_totp_seeds_backup_codes_recovery_codes_security_answers_or_mfa_answers"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "disable_or_redact_during_secret_entry"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", "Do not store MFA answers"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", "coworx_local_secret_store.mjs"],
  ["scripts/coworx_local_secret_store.mjs", "Coworx local secret store demo test passed"],
  ["docs/credential_handoff_protocol.md", "MFA answers, TOTP seeds, backup codes, recovery codes, and security answers must not be stored"],
  ["queue/todo/TEMPLATE_CREDENTIAL_WORKFLOW_TEST.md", "Credential Workflow Test Task"],
  ["evals/smoke_tests/credential_handoff_policy.md", "approved local env credential handoff"],
  ["docs/standby_mode.md", "Default interval is 5 minutes"],
  ["docs/standby_mode.md", ".coworx-private/standby/"],
  ["docs/standby_mode.md", "Quiet mode is the default"],
  ["docs/standby_mode.md", "Codex cannot remotely start a new chat later"],
  ["config/TEMPLATE_STANDBY_MODE.json", "default_interval_minutes"],
  ["config/TEMPLATE_STANDBY_MODE.json", "prevent_duplicate_loops"],
  ["config/TEMPLATE_STANDBY_MODE.json", "local_status_file"],
  ["evals/smoke_tests/standby_mode.md", "Demo task completes"],
  ["scripts/coworx_standby.mjs", "A standby loop is already active or paused"],
  ["scripts/coworx_standby.mjs", "A standby cycle is already running"],
  ["scripts/coworx_standby.mjs", "run --task"],
  ["scripts/coworx_standby.mjs", "Standby demo test passed"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Authority Source"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Active Directive File"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Credential Handoff"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Privileged Workflow Information"],
  ["operator/action_results/TEMPLATE_ACTION_RESULT.md", "Active Directive File Check"],
  ["operator/action_results/TEMPLATE_ACTION_RESULT.md", "Prompt Injection Handling"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Required Resource Locks"],
  ["operator/lane_status/TEMPLATE_BROWSER_LANE_LEASE.md", "parallel by default"],
  ["operator/lane_status/TEMPLATE_OPERATOR_LEASE.md", "Target-Level Locks"],
  ["runs/active/TEMPLATE_RUN_LOG.md", "Directive Ledger"],
  ["runs/active/TEMPLATE_RUN_LOG.md", "Prompt Injection Checks"],
  ["runs/active/TEMPLATE_RUN_LOG.md", "Output Hand-Offs"],
  ["runs/active/TEMPLATE_RUN_LOG.md", "Capability Lessons"],
  ["outputs/reports/TEMPLATE_FINAL_REPORT.md", "Directive Ledger"],
  ["outputs/reports/TEMPLATE_FINAL_REPORT.md", "Active Directive File"],
  ["outputs/reports/TEMPLATE_ACTION_LEDGER.md", "Active Directive File Checks"],
  ["outputs/reports/TEMPLATE_ACTION_LEDGER.md", "Privileged Workflow Information Used"],
  ["outputs/reports/TEMPLATE_FINAL_REPORT.md", "Output Hand-Offs"],
  ["outputs/reports/TEMPLATE_FINAL_REPORT.md", "Capability Lessons"],
  ["memory/capabilities/TEMPLATE_CAPABILITY_MAP.md", "Capability Map"],
  ["scripts/coworx_directive_guard.mjs", "Directive guard demo test passed"],
];

for (const [file, concept] of requiredConcepts) {
  const body = readFileSync(join(root, file), "utf8");
  if (!body.includes(concept)) failures.push(`${file} missing concept: ${concept}`);
}

const stalePatterns = [
  /one-Operator rule/i,
  /single Operator lane/i,
  /one serialized Computer Use desktop lane/i,
  /parallel browser lanes plus one desktop lane/i,
  /one desktop lane/i,
  /The Operator is the only lane allowed to control Playwright, browser sessions, or Computer Use/i,
  /Final send, submit, publish, invite, schedule, delete, permission, settings, and deployment actions require action-time approval/i,
  /External commitments still require approval/i,
  /deletion and external commitments require explicit approval/i,
  /require explicit approval before deletion or external commitments/i,
  /approval (?:is )?given at action time/i,
  /explicit approval at action time/i,
  /approval at action time/i,
  /must not enter passwords/i,
  /always stop if login appears/i,
  /credentials are always blocked/i,
  /manual login only/i,
  /never type credentials/i,
  /never enter credentials/i,
  /No credentials should be entered/i,
  /User signed in manually/i,
  /credential entry by Coworx/i,
  /Treat credentials[^.\n]*Level 5/i,
  /If login is required, ask the user to sign in manually/i,
  /Stop on credentials/i,
  /Do not use Playwright to enter credentials/i,
  /COWORX_EXAMPLE_MFA_ANSWERS/i,
  /mfa_answers_env/i,
];

const scanRoots = [
  "AGENTS.md",
  "README.md",
  "COWORX.md",
  ".codex/config.toml",
  ".agents",
  ".gitignore",
  "config",
  "docs",
  "memory",
  "queue",
  "operator",
  "outputs/reports",
  "runs/active",
  "evals",
];

const textFilePattern = /\.(md|txt|toml|json|yaml|yml)$/i;
function collectTextFiles(path, collected = []) {
  const absolute = join(root, path);
  if (!existsSync(absolute)) return collected;
  const stat = statSync(absolute);
  if (stat.isFile()) {
    if (textFilePattern.test(path)) collected.push(path);
    return collected;
  }
  if (!stat.isDirectory()) return collected;
  for (const entry of readdirSync(absolute)) {
    if (entry === "private" || entry === ".git") continue;
    collectTextFiles(join(path, entry), collected);
  }
  return collected;
}

const semanticFiles = scanRoots.flatMap((path) => collectTextFiles(path));
for (const file of semanticFiles) {
  const body = readFileSync(join(root, file), "utf8");
  for (const pattern of stalePatterns) {
    if (pattern.test(body)) failures.push(`${file} contains stale policy wording: ${pattern}`);
  }
}

try {
  execFileSync(process.execPath, [join(root, "scripts/coworx_directive_guard.mjs"), "demo-test"], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
  });
} catch (error) {
  failures.push(`Directive guard demo test failed: ${error.stderr || error.stdout || error.message}`);
}

try {
  execFileSync(process.execPath, [join(root, "scripts/coworx_local_secret_store.mjs"), "demo-test"], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
  });
} catch (error) {
  failures.push(`Local secret store demo test failed: ${error.stderr || error.stdout || error.message}`);
}

try {
  execFileSync(process.execPath, [join(root, "scripts/coworx_standby.mjs"), "demo-test"], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
  });
} catch (error) {
  failures.push(`Standby demo test failed: ${error.stderr || error.stdout || error.message}`);
}

if (failures.length > 0) {
  console.error("Coworx readiness check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Coworx readiness check passed.");
