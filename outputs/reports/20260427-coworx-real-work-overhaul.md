# Coworx Real Work Overhaul Report

## Completed

- Reworked Coworx routing so connectors/MCP, Playwright Interactive, and Computer Use are first-class execution paths for real work instead of reasons to return instructions.
- Added standby inbox/outbox adapter behavior to `scripts/coworx_standby.mjs`.
- Added fail-closed standby remote approval gating.
- Added credential resolver and packet helper that validates local secret sources without printing values.
- Added account-free regression tests for plan-only failures, upload/file-picker staging, standby behavior, and credential routing.
- Added a real task drill that creates a brief, staged upload packet, standby outbox entry, verification record, and final report.
- Added current internet research on Codex, Computer Use, MCP/connectors, automations, Playwright Interactive routing, and Claude Cowork parity.
- Exercised a real signed-in LMS workflow through Computer Use and converted the sanitized lessons into rundown protocols and regression coverage.
- Exercised a real signed-in academic LMS assignment workflow and added a boundary rule so Coworx performs safe mechanics but stops before graded authorship or final submission.
- Exercised the Chrome-specific credentialed autonomy route and added an action gate so approved reversible account actions can proceed while final commitments and protected actions stage.

## Key Outputs

- `docs/codex_coworx_capability_research.md`
- `scripts/coworx_standby.mjs`
- `scripts/coworx_credential_resolver.mjs`
- `scripts/coworx_autonomous_action_gate.mjs`
- `scripts/coworx_account_free_regression_tests.mjs`
- `scripts/coworx_real_task_drill.mjs`
- `evals/regression_tests/account_free_real_work_regressions.json`
- `outputs/reports/20260427-real-task-drill/final-report.md`
- `outputs/reports/20260427-real-account-drill-sanitized.md`
- `outputs/reports/20260427-apush-boundary-test-sanitized.md`
- `outputs/reports/20260427-credentialed-autonomy-drill-sanitized.md`
- `operator/action_results/20260427-computer-use-calculator-smoke.md`

## Verification

- `node scripts/coworx_credential_resolver.mjs demo-test`: passed
- `node scripts/coworx_autonomous_action_gate.mjs demo-test`: passed
- `node scripts/coworx_real_task_drill.mjs run --output outputs/reports/20260427-real-task-drill`: passed
- `node scripts/coworx_standby.mjs demo-test`: passed
- `node scripts/coworx_account_free_regression_tests.mjs`: passed
- `node scripts/coworx_ready_check.mjs`: passed
- Computer Use Calculator smoke: passed
- Computer Use signed-in LMS drill: passed read-only access and multi-surface discovery
- Computer Use academic LMS boundary drill: passed safe-mechanics discovery and protected-action stop
- Chrome Schoology credentialed autonomy drill: passed reversible-action proceed gate and protected-submit stage gate
- Reviewer re-check of standby approval blocker: cleared

## Residual Limits

- The credential resolver is a safe packet and validation layer, not a full password-manager executor.
- Real iMessage/Discord/SMS adapters still require private configuration and Computer Use or connector implementation.
- Codex Computer Use cannot approve macOS privacy/security prompts or bypass app/account controls.
- The signed-in LMS drill proved read-only access and workflow discovery, not protected academic submission or complete bell-schedule authority.
- The academic LMS drill intentionally did not write or submit graded answers.

## Sources

- OpenAI Codex Computer Use: https://developers.openai.com/codex/app/computer-use
- OpenAI Codex Automations: https://developers.openai.com/codex/app/automations
- OpenAI Codex Local Environments: https://developers.openai.com/codex/app/local-environments
- OpenAI MCP and Connectors: https://developers.openai.com/api/docs/guides/tools-connectors-mcp
- OpenAI API Computer Use: https://developers.openai.com/api/docs/guides/tools-computer-use
- Claude Cowork Dispatch: https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork
- Claude Cowork Computer Use: https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork
- Claude Cowork Scheduled Tasks: https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork
