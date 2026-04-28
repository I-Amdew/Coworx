#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();

const requiredFiles = [
  "AGENTS.md",
  "COWORX.md",
  "README.md",
  "LICENSE",
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
  "docs/dispatch_channel_protocol.md",
  "docs/temporary_waits_and_automations.md",
  "docs/standby_mode.md",
  "docs/capability_discovery.md",
  "docs/model_execution_routing.md",
  "docs/task_lifecycle.md",
  "docs/subagent_protocol.md",
  "docs/playwright_policy.md",
  "docs/computer_use_policy.md",
  "docs/memory_policy.md",
  "docs/architecture.md",
  "docs/plugin_skill_router.md",
  "docs/project_workspace_model.md",
  "docs/non_coding_workflows.md",
  "docs/real_result_delivery_protocol.md",
  "docs/private_memory_policy.md",
  "docs/codex_coworx_capability_research.md",
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
  "operator/lane_status/TEMPLATE_COMPUTER_USE_QUEUE_REQUEST.md",
  "outputs/reports/TEMPLATE_ACTION_LEDGER.md",
  "runs/active/TEMPLATE_RUN_LOG.md",
  "outputs/reports/TEMPLATE_FINAL_REPORT.md",
  "memory/capabilities/TEMPLATE_CAPABILITY_MAP.md",
  "queue/todo/TEMPLATE_CREDENTIAL_WORKFLOW_TEST.md",
  "evals/smoke_tests/browser_demo.md",
  "evals/smoke_tests/computer_use_safe_app_test.md",
  "evals/smoke_tests/credential_handoff_policy.md",
  "evals/smoke_tests/real_result_delivery.md",
  "evals/smoke_tests/directive_guard_policy.md",
  "evals/smoke_tests/standby_mode.md",
  "evals/regression_tests/privacy_and_approval_gates.md",
  "evals/regression_tests/account_free_real_work_regressions.json",
  "scripts/coworx_directive_guard.mjs",
  "scripts/coworx_local_secret_store.mjs",
  "scripts/coworx_credential_resolver.mjs",
  "scripts/coworx_type_secret_to_front_app.mjs",
  "scripts/coworx_autonomous_action_gate.mjs",
  "scripts/coworx_account_free_regression_tests.mjs",
  "scripts/coworx_real_task_drill.mjs",
  "scripts/coworx_standby.mjs",
  "scripts/coworx_computer_use_queue.mjs",
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
  "Autonomous Credentialed Action Gate",
  "Extraction And Local Fanout",
  "Expires",
  "Model Execution Routing",
  "First-wave staffing plan",
  "Delegation decision",
  "Chat credential intake",
  "Credential packet/reference created or verified",
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
  ["AGENTS.md", "Real Result Delivery Standard"],
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
  ["docs/model_execution_routing.md", "Model Execution Routing"],
  ["docs/model_execution_routing.md", "Computer Use With Any Model"],
  ["docs/model_execution_routing.md", "Subagent Delegation With Any Model"],
  ["docs/model_execution_routing.md", "Credential And Autofill Reality"],
  ["docs/project_workspace_model.md", "Project Workspace Model"],
  ["docs/project_workspace_model.md", "Local Customization Loop"],
  ["docs/real_result_delivery_protocol.md", "Real Result Delivery Protocol"],
  ["docs/real_result_delivery_protocol.md", "A directive is complete only when Coworx has produced the requested result"],
  ["docs/real_result_delivery_protocol.md", "Plans, explanations, and suggestions are intermediate artifacts unless the user asked only for advice"],
  ["docs/real_result_delivery_protocol.md", "Playwright or Playwright Interactive"],
  ["docs/real_result_delivery_protocol.md", "File Picker And Upload Completion"],
  ["docs/codex_coworx_capability_research.md", "Computer Use Must Be A First-Class Coworx Lane"],
  ["docs/codex_coworx_capability_research.md", "Browser Use Should Not Be The Default For Long Signed-In Workflows"],
  ["docs/codex_coworx_capability_research.md", "https://developers.openai.com/codex/app/computer-use"],
  ["docs/non_coding_workflows.md", "The default is execution"],
  ["docs/real_work_task_model.md", "The target is a delivered outcome"],
  ["evals/smoke_tests/real_result_delivery.md", "Coworx does not stop at instructions when safe execution was requested"],
  [".agents/skills/coworx-real-work-runner/SKILL.md", "Do the work when safe authority exists"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "concrete result produced or furthest safe staged state reached"],
  ["docs/parallelism_and_locks.md", "Lock resources, not agents"],
  ["README.md", "open source Cowork-style workspace"],
  ["README.md", "Apache License 2.0"],
  ["LICENSE", "Apache License"],
  ["LICENSE", "Version 2.0, January 2004"],
  ["docs/parallelism_and_locks.md", "Download Once, Fan Out Locally"],
  ["docs/parallelism_and_locks.md", "Do not keep one GUI/browser lane slowly reading a site page by page"],
  ["docs/parallelism_and_locks.md", "Computer Use Lease Queue"],
  ["docs/computer_use_policy.md", "File-Backed Lease Queue"],
  ["docs/operator_protocol.md", "file-backed Computer Use lease queue"],
  ["docs/concurrency_model.md", "file-backed lease queue"],
  ["AGENTS.md", "scripts/coworx_computer_use_queue.mjs"],
  ["AGENTS.md", "Private dispatch channels require setup"],
  ["AGENTS.md", "delete, disable, or mark the temporary automation retired"],
  ["AGENTS.md", "recommend ending this chat and starting a new one"],
  ["AGENTS.md", "model_execution_routing.md"],
  ["AGENTS.md", "This rule applies to every model choice"],
  ["COWORX.md", "model_execution_routing.md"],
  ["README.md", "Model execution routing"],
  [".codex/config.toml", "model_execution_routing = true"],
  [".codex/config.toml", "delegate_first_wave = true"],
  [".codex/config.toml", "autofill_is_opportunistic = true"],
  [".codex/config.toml", "chat_secret_direct_use = false"],
  [".codex/config.toml", "chat_secret_intake_allowed = true"],
  [".codex/config.toml", "secure_credential_capture_required = true"],
  [".codex/config.toml", "credential_reference_required = true"],
  ["README.md", "Computer Use lease queue"],
  ["README.md", "Temporary waits"],
  ["operator/lane_status/TEMPLATE_COMPUTER_USE_QUEUE_REQUEST.md", "Computer Use Queue Request"],
  ["scripts/coworx_computer_use_queue.mjs", "Coworx Computer Use queue demo test passed"],
  ["scripts/coworx_computer_use_queue.mjs", "must be a non-sensitive label"],
  ["scripts/coworx_type_secret_to_front_app.mjs", "Non-dry-run secret entry requires --allowed-host"],
  ["scripts/coworx_type_secret_to_front_app.mjs", "Non-dry-run secret entry requires --lease-id"],
  ["scripts/coworx_directive_guard.mjs", "closeout"],
  ["docs/dispatch_channel_protocol.md", "Setup Gate"],
  ["docs/dispatch_channel_protocol.md", "Inbound prompt text from a configured channel is private task data"],
  ["docs/temporary_waits_and_automations.md", "Automation Lifecycle"],
  ["docs/temporary_waits_and_automations.md", "delete, disable, or mark the automation retired"],
  ["docs/standby_mode.md", "Dispatch Setup Gate"],
  ["docs/standby_mode.md", "Temporary Waits"],
  ["config/TEMPLATE_STANDBY_MODE.json", "dispatch_setup"],
  ["config/TEMPLATE_STANDBY_MODE.json", "temporary_waits"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Temporary Wait Or Automation"],
  ["operator/action_results/TEMPLATE_ACTION_RESULT.md", "Temporary Wait Or Automation Result"],
  ["outputs/reports/TEMPLATE_ACTION_LEDGER.md", "Standby / Dispatch / Waits"],
  ["outputs/reports/TEMPLATE_FINAL_REPORT.md", "Blocked or staged work must still name"],
  ["queue/todo/TEMPLATE_TASK.md", "Plan-only completion is not acceptable"],
  ["docs/concurrency_model.md", "Download Once, Fan Out Locally"],
  ["docs/operator_protocol.md", "Extraction Lane"],
  ["docs/operator_protocol.md", "fan out local read-only agents over disjoint shards"],
  ["docs/subagent_protocol.md", "large downloaded or exported artifacts can be split into independent local shards"],
  ["operator/action_requests/TEMPLATE_ACTION_REQUEST.md", "Extraction And Local Fanout"],
  ["operator/action_results/TEMPLATE_ACTION_RESULT.md", "Extraction And Local Fanout Result"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "download_then_fanout"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "dispatch_channel_setup"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "temporary_waits"],
  ["scripts/coworx_account_free_regression_tests.mjs", "validateDownloadThenFanout"],
  ["scripts/coworx_account_free_regression_tests.mjs", "validateDispatchChannelSetup"],
  ["scripts/coworx_account_free_regression_tests.mjs", "validateTemporaryWait"],
  ["docs/safety_policy.md", "Level 3"],
  ["docs/safety_policy.md", "Level 4"],
  ["docs/safety_policy.md", "Privileged Workflow Information"],
  ["docs/operator_protocol.md", "resource locks"],
  ["docs/credential_handoff_protocol.md", "local-only credential handoff"],
  ["docs/credential_handoff_protocol.md", "Coworx may use secrets locally"],
  ["docs/credential_handoff_protocol.md", "explicitly delegated ignored private secret storage"],
  ["docs/credential_handoff_protocol.md", "Unsupported Or Unsafe Credential Handling"],
  ["docs/credential_handoff_protocol.md", "Protected Final Actions"],
  ["docs/credential_handoff_protocol.md", "Approved Local Credential Source Reference"],
  ["docs/credential_handoff_protocol.md", "local skill file"],
  ["docs/local_credential_persistence.md", "Local Credential Persistence"],
  ["docs/local_credential_persistence.md", "explicitly delegates credential persistence"],
  ["docs/local_credential_persistence.md", "scripts/coworx_local_secret_store.mjs"],
  ["docs/local_credential_persistence.md", "interactive local capture"],
  ["docs/local_credential_persistence.md", "The durable memory is the reference packet"],
  ["docs/local_credential_persistence.md", "credential source resolver"],
  ["docs/local_credential_persistence.md", "end this chat and start a new one"],
  ["docs/local_credential_persistence.md", "Repeated Workflow Upgrade Prompt"],
  ["docs/credential_handoff_protocol.md", "coworx_local_secret_store.mjs capture"],
  ["docs/credential_handoff_protocol.md", "recommend ending the current chat"],
  ["docs/private_real_work_testing.md", "local personal branch"],
  ["docs/private_memory_policy.md", "local personal branch"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", "hidden local input"],
  ["scripts/coworx_credential_resolver.mjs", "Coworx credential resolver demo test passed"],
  ["scripts/coworx_credential_resolver.mjs", "--source-ref"],
  ["scripts/coworx_local_secret_store.mjs", "capture --name APP"],
  ["scripts/coworx_local_secret_store.mjs", "interactive_hidden_tty"],
  ["scripts/coworx_autonomous_action_gate.mjs", "Coworx autonomous action gate demo test passed"],
  ["scripts/coworx_real_task_drill.mjs", "Coworx real task drill demo test passed"],
  ["docs/account_login_handoff.md", "local-only credential handoff"],
  ["docs/account_login_handoff.md", "ignored local secret file"],
  ["docs/safety_policy.md", "Coworx may use secrets locally"],
  ["docs/safety_policy.md", "explicitly asks Coworx to save credentials"],
  ["docs/safety_policy.md", "Credential exposure"],
  ["docs/computer_use_policy.md", "Before Credential Entry"],
  ["docs/computer_use_policy.md", "Model-Agnostic Operator Rule"],
  ["docs/computer_use_policy.md", "opportunistic routes"],
  ["docs/computer_use_policy.md", "Password Manager And Autofill"],
  ["docs/computer_use_policy.md", "File Pickers And Uploads"],
  ["docs/playwright_policy.md", "local credential handoff"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", ".coworx-private/secrets/"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", "Do not commit real credentials"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "COWORX_EXAMPLE_USERNAME"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "interactive_hidden_tty_or_env_keychain_password_manager_vault"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "mfa_answers_env"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "mfa_policy"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "do_not_store_totp_seeds_backup_codes_recovery_codes_or_security_answers"],
  ["config/TEMPLATE_CREDENTIAL_HANDOFF.json", "disable_or_redact_during_secret_entry"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", "COWORX_EXAMPLE_MFA_ANSWERS_JSON"],
  ["docs/templates/LOCAL_SECRET_SETUP.md", "coworx_local_secret_store.mjs"],
  ["scripts/coworx_local_secret_store.mjs", "Coworx local secret store demo test passed"],
  ["docs/credential_handoff_protocol.md", "MFA answer values may be used only through explicitly delegated local runtime handoff"],
  ["docs/credential_handoff_protocol.md", "Autofill, password-manager unlock"],
  ["docs/credential_handoff_protocol.md", "temporary credential intake source"],
  ["docs/local_credential_persistence.md", "fails or stalls once"],
  ["docs/local_credential_persistence.md", "from-stdin --chat-intake true"],
  ["docs/computer_use_policy.md", "must not type credentials directly from chat memory"],
  ["docs/account_login_handoff.md", "Password-manager autofill"],
  ["docs/account_login_handoff.md", "temporary credential intake source"],
  ["docs/model_execution_routing.md", "raw chat as the runtime credential source"],
  ["docs/credential_handoff_protocol.md", "TOTP seeds, backup codes, recovery codes, and security answers must not be stored"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "model_execution_routing"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "credential_autofill_fallback"],
  ["scripts/coworx_account_free_regression_tests.mjs", "validateModelExecutionRouting"],
  ["scripts/coworx_account_free_regression_tests.mjs", "validateCredentialAutofillFallback"],
  ["scripts/coworx_account_free_regression_tests.mjs", "used_chat_secret_directly"],
  ["scripts/coworx_local_secret_store.mjs", "from-stdin"],
  ["scripts/coworx_local_secret_store.mjs", "continuation_prompt"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "approved_chat_intake_transfer_creates_reference_and_prompt"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "chat_pasted_credentials_used_directly_is_rejected"],
  ["queue/todo/TEMPLATE_CREDENTIAL_WORKFLOW_TEST.md", "Credential Workflow Test Task"],
  ["evals/smoke_tests/credential_handoff_policy.md", "approved local env credential handoff"],
  ["docs/session_backed_account_operations.md", "Read-Only Rundown Flow"],
  ["docs/private_real_work_testing.md", "Real Drill Acceptance"],
  ["docs/non_coding_workflows.md", "For a homework or LMS task that crosses the academic boundary"],
  ["docs/external_action_protocol.md", "When the user asks for an academic workflow that includes both safe mechanics and protected authorship/submission"],
  ["docs/external_action_protocol.md", "Autonomous Credentialed Action Gate"],
  ["docs/external_action_protocol.md", "scripts/coworx_autonomous_action_gate.mjs"],
  ["operator/action_requests/TEMPLATE_SIGNED_IN_READ_ONLY_REQUEST.md", "Rundown Surface Checklist"],
  ["memory/accounts/TEMPLATE_SESSION_BACKED_ACCOUNT_MAP.md", "date-source quirks"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "signed_in_readonly_synthesis"],
  ["evals/regression_tests/account_free_real_work_regressions.json", "academic_lms_boundary"],
  ["docs/standby_mode.md", "Default interval is 5 minutes"],
  ["docs/standby_mode.md", ".coworx-private/standby/"],
  ["docs/standby_mode.md", "Quiet mode is the default"],
  ["docs/standby_mode.md", "Dispatch Conversation Style"],
  ["docs/standby_mode.md", ".coworx-private/standby/tasks/"],
  ["docs/standby_mode.md", "Codex cannot remotely start a new chat later"],
  ["config/TEMPLATE_STANDBY_MODE.json", "default_interval_minutes"],
  ["config/TEMPLATE_STANDBY_MODE.json", "prevent_duplicate_loops"],
  ["config/TEMPLATE_STANDBY_MODE.json", "local_status_file"],
  ["config/TEMPLATE_STANDBY_MODE.json", "local_outbox_file"],
  ["config/TEMPLATE_STANDBY_MODE.json", "inbound_task_sources"],
  ["config/TEMPLATE_STANDBY_MODE.json", "dispatch_thread"],
  ["config/TEMPLATE_STANDBY_MODE.json", "task_queue_dir"],
  ["evals/smoke_tests/standby_mode.md", "Demo task completes"],
  ["evals/smoke_tests/standby_mode.md", "Dispatch-style conversation metadata"],
  ["evals/smoke_tests/standby_mode.md", "private standby task queue"],
  ["scripts/coworx_standby.mjs", "A standby loop is already active or paused"],
  ["scripts/coworx_standby.mjs", "A standby cycle is already running"],
  ["scripts/coworx_standby.mjs", "run --task"],
  ["scripts/coworx_standby.mjs", "local_outbox_file"],
  ["scripts/coworx_standby.mjs", "dispatch_thread"],
  ["scripts/coworx_standby.mjs", "taskQueueDir"],
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
];

const staleCredentialPhrases = [
  "must not enter passwords",
  "always stop if login appears",
  "credentials are always blocked",
  "manual login only",
  "never type credentials",
  "never enter credentials",
  "no credentials should be entered",
  "user signed in manually",
  "credential entry by coworx",
  "if login is required, ask the user to sign in manually",
  "stop on credentials",
  "do not use playwright to enter credentials",
];

const staleCredentialLinePatterns = [
  /treat credentials[^.\n]*level 5/i,
];

const credentialExposureContext = /\b(expos|stor|log|screenshot|trace|export|leak|print|commit|copy|capture|share|reveal|prompt|chat|repo|memory|evidence|artifact|cookie|token|recovery|security|payment|wrong-domain|wrong domain|wrong-app|wrong app|outside approved|unsupported|unsafe|without approved|not covered by approved)\b/i;
const blanketCredentialRegex = /\b(credentials?|passwords?|login|mfa)\b/i;

function isAllowedCredentialBlockingContext(line) {
  const lower = line.toLowerCase();
  return credentialExposureContext.test(line)
    || lower.includes("wrong target")
    || lower.includes("suspicious")
    || lower.includes("account recovery")
    || lower.includes("password change");
}

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
  body.split(/\r?\n/).forEach((line, index) => {
    if (!blanketCredentialRegex.test(line)) return;
    const normalized = line.toLowerCase();
    for (const phrase of staleCredentialPhrases) {
      if (!normalized.includes(phrase)) continue;
      if (!isAllowedCredentialBlockingContext(line)) {
        failures.push(`${file}:${index + 1} contains blanket credential-blocking wording: ${phrase}`);
      }
    }
    for (const pattern of staleCredentialLinePatterns) {
      if (!pattern.test(line)) continue;
      if (!isAllowedCredentialBlockingContext(line)) {
        failures.push(`${file}:${index + 1} contains blanket credential-blocking wording: ${pattern}`);
      }
    }
  });
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
  execFileSync(process.execPath, [join(root, "scripts/coworx_credential_resolver.mjs"), "demo-test"], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
  });
} catch (error) {
  failures.push(`Credential resolver demo test failed: ${error.stderr || error.stdout || error.message}`);
}

try {
  execFileSync(process.execPath, [join(root, "scripts/coworx_autonomous_action_gate.mjs"), "demo-test"], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
  });
} catch (error) {
  failures.push(`Autonomous action gate demo test failed: ${error.stderr || error.stdout || error.message}`);
}

try {
  execFileSync(process.execPath, [join(root, "scripts/coworx_real_task_drill.mjs"), "demo-test"], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
  });
} catch (error) {
  failures.push(`Real task drill demo test failed: ${error.stderr || error.stdout || error.message}`);
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

try {
  execFileSync(process.execPath, [join(root, "scripts/coworx_account_free_regression_tests.mjs")], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
  });
} catch (error) {
  failures.push(`Account-free regression tests failed: ${error.stderr || error.stdout || error.message}`);
}

if (failures.length > 0) {
  console.error("Coworx readiness check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Coworx readiness check passed.");
