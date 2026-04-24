#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "AGENTS.md",
  "COWORX.md",
  "README.md",
  ".codex/config.toml",
  ".gitignore",
  "docs/director_use.md",
  "docs/parallelism_and_locks.md",
  "docs/safety_policy.md",
  "docs/operator_protocol.md",
  "docs/task_lifecycle.md",
  "docs/subagent_protocol.md",
  "docs/playwright_policy.md",
  "docs/computer_use_policy.md",
  "docs/memory_policy.md",
  "docs/architecture.md",
  "docs/plugin_skill_router.md",
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
  "config/README.md",
  "config/TEMPLATE_APPROVED_SITE.json",
  "config/TEMPLATE_AUTONOMY_GRANT.json",
  "config/TEMPLATE_BROWSER_LANE.json",
  "config/TEMPLATE_ACTION_LEVELS.json",
  "operator/action_requests/TEMPLATE_ACTION_REQUEST.md",
  "operator/action_results/TEMPLATE_ACTION_RESULT.md",
  "operator/approvals/TEMPLATE_EXTERNAL_ACTION_APPROVAL.md",
  "operator/approvals/TEMPLATE_USER_RESPONSIBILITY_ACK.md",
  "operator/lane_status/TEMPLATE_OPERATOR_LEASE.md",
  "operator/lane_status/TEMPLATE_BROWSER_LANE_LEASE.md",
  "outputs/reports/TEMPLATE_ACTION_LEDGER.md",
  "runs/active/TEMPLATE_RUN_LOG.md",
  "outputs/reports/TEMPLATE_FINAL_REPORT.md",
  "evals/smoke_tests/browser_demo.md",
  "evals/smoke_tests/computer_use_safe_app_test.md",
  "evals/regression_tests/privacy_and_approval_gates.md",
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

const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
for (const pattern of [".coworx-private/", "memory/private/", "outputs/private/", ".playwright-cli/"]) {
  if (!gitignore.includes(pattern)) failures.push(`.gitignore missing ${pattern}`);
}

const requiredConcepts = [
  ["AGENTS.md", "Parallelism Rule"],
  ["AGENTS.md", "Computer Use Restriction Rule"],
  ["AGENTS.md", "delegated authority"],
  ["docs/director_use.md", "accountable Director"],
  ["docs/parallelism_and_locks.md", "Lock resources, not agents"],
  ["docs/safety_policy.md", "Level 3"],
  ["docs/safety_policy.md", "Level 4"],
  ["docs/operator_protocol.md", "resource locks"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Authority Source"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Required Resource Locks"],
  ["operator/lane_status/TEMPLATE_BROWSER_LANE_LEASE.md", "parallel by default"],
  ["operator/lane_status/TEMPLATE_OPERATOR_LEASE.md", "Target-Level Locks"],
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
];

const scanRoots = [
  "AGENTS.md",
  "README.md",
  "COWORX.md",
  ".codex/config.toml",
  ".agents",
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

if (failures.length > 0) {
  console.error("Coworx readiness check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Coworx readiness check passed.");
