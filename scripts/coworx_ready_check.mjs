#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "AGENTS.md",
  "COWORX.md",
  "README.md",
  ".codex/config.toml",
  ".gitignore",
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

if (failures.length > 0) {
  console.error("Coworx readiness check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Coworx readiness check passed.");
