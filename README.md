# Coworx

Coworx is Cowork in Codex: a local, Codex-native coworker operating system for doing real work across files, browsers, accounts, desktop apps, documents, spreadsheets, slides, GitHub, research, calendars, messages, and code.

The delivery standard is concrete output: Coworx should create or edit files, operate approved web/app workflows, prepare drafts, update reversible records, send or submit when specifically delegated, and stage protected final actions for review. Advice is not completion when the user asked Coworx to do the work.

Coworx is not a skill the user downloads and deploys. It is a project workspace Codex opens and uses as its operating base. The folder stores policies, task queues, run logs, outputs, reusable maps, private workflow memory, selectors, account references, and evidence so Coworx gets faster and more personal over time.

The framework teaches Codex App how to operate like an accountable Director:

- keep `AGENTS.md` as the canonical operating contract;
- use the project folder as the persistent operating base;
- check maps and private workflow memory before rediscovering known paths;
- learn which plugins, skills, connectors, browser profiles, local scripts, and apps are available in each user's setup;
- build a task graph before doing broad work;
- maintain a directive ledger for multi-stage goals;
- enter Standby Mode for lightweight dispatch loops during the current active session;
- run independent work in parallel by default;
- use subagents when they improve delivery, coverage, diagnosis, review, or verification;
- use resource locks instead of serializing whole tool classes;
- use Browser Use, Playwright, API connectors, plugins, and subagents freely when targets do not collide;
- restrict Computer Use by app, window, browser profile, account workflow, clipboard, file picker, simulator, and active focus;
- execute non-high-risk Level 3/4 actions when delegated authority or explicit approval covers them;
- stage unclear actions and block Level 5/protected actions;
- keep evidence, logs, outputs, and safe memory.
- save safe workflow maps and output locations for future speed.
- save safe capability lessons so future routing fits the user's setup.
- close only after every directive is completed, staged, blocked, skipped, or explicitly waiting.

## What This Project Is

This repository is the blank Coworx project framework. It should be safe for other users to copy or adapt as a starting workspace. The personalized value comes from the local maps, private memory, logs, outputs, and workflow references accumulated inside a user's own Coworx project.

It includes:

- `AGENTS.md`: canonical mission, authority, action levels, parallelism, browser, Computer Use, memory, and reporting rules.
- `COWORX.md`: short operating manual for running Coworx in Codex App.
- `docs/director_use.md`: main-thread Director model and active subagent management.
- `docs/directive_follow_through.md`: directive ledger, delivery close criteria, and subagent use for multi-stage goals.
- `docs/standby_mode.md`: standby/dispatch loop behavior, local state, notifications, controls, and limits.
- `docs/project_workspace_model.md`: project-backed workspace model, local customization loop, outputs, hand-off, and memory boundaries.
- `docs/real_result_delivery_protocol.md`: evidence-backed completion standard for real local-app and web work.
- `docs/capability_discovery.md`: per-user capability maps for plugins, skills, connectors, profiles, apps, scripts, and fallbacks.
- `docs/parallelism_and_locks.md`: parallel-by-default execution and lock semantics.
- `docs/`: focused policy shards for safety, routing, account work, browser work, Computer Use, calendar work, external actions, and real-work workflows.
- `.agents/skills/`: local role prompt files for Coworx workflows, not a user-installed product.
- `config/`: approved-site, autonomy-grant, credential-handoff, browser-lane, action-level, and standby templates.
- `queue/`: task queue.
- `memory/`: templates, generic maps, and safe playbooks.
- `operator/`: action requests, lane leases, results, approvals, screenshots, traces, recordings, and evidence templates.
- `evals/`: smoke and regression tests.
- `scripts/coworx_ready_check.mjs`: static readiness check.

## What Coworx Can Do

Coworx can:

- summarize meetings and transcripts;
- make reports, documents, slides, and spreadsheets;
- draft and send routine messages when delegated;
- create and update calendar events when delegated;
- map websites, dashboards, and desktop apps;
- organize approved local files;
- operate approved local apps and web workflows to completion when authority allows;
- keep checking a task in Standby Mode while the current Coworx session remains available;
- inspect browser pages and apps using Browser Use, Playwright, APIs, connectors, or Computer Use;
- create GitHub issues, PR comments, and task-board updates when delegated;
- use GitHub, Figma, PDF, image, speech, transcription, document, spreadsheet, presentation, browser, and automation skills when installed.

## Parallelism

Coworx runs Browser/API/code/subagent work in parallel by default.

Locks apply to resources, not whole agent classes:

- read locks allow many inspectors;
- write locks allow one editor for a target;
- commit locks control final sends, submits, invites, publishes, merges, deploys, purchases, deletes, and settings changes.

Computer Use is restricted by target because it may share the real screen, mouse, keyboard, clipboard, windows, menus, dialogs, active app focus, browser profile, and app-local state.

## Follow-Through

Coworx tracks multi-stage requests in a directive ledger. A run is not complete because one step finished; it is complete when every explicit or implied directive has evidence, is staged for approval, is blocked with a reason, is skipped with rationale, or is explicitly waiting.

Subagents are used when they materially improve delivery: independent research, disjoint implementation, browser/API operation, diagnosis, review, verification, and evidence collection. The Director keeps critical-path decisions and integration local, inspects returned evidence, and updates the directive ledger before closing.

## Standby Mode

Standby Mode keeps a current task moving in a lightweight dispatch loop while the active Codex session and computer remain available. Trigger phrases include `standby mode`, `dispatch mode`, `keep checking`, `check every 5 minutes`, `run this in standby`, and `continue in the background while this chat/session is active`.

The default interval is 5 minutes and the default max runtime is 6 hours. Runtime state is private under `.coworx-private/standby/`; committed files include only sanitized docs, config templates, and fake demo tests. Quiet cycles do not notify the user unless verbose mode is enabled.

Run the local fake-account test with:

```bash
node scripts/coworx_standby.mjs demo-test
```

## Project Memory

Coworx learns through local project files. It may store course routes, dashboard maps, file locations, preferred output folders, selector maps, account labels, browser profile names, connector names, vault handles, and stop conditions. It uses those references to complete future tasks faster.

Coworx also learns each user's capability setup. It can remember which Codex plugins, skills, connectors, MCP tools, browser profiles, local scripts, desktop apps, and fallback routes are available and useful, without assuming every user has the same setup.

Coworx stores login routes and account references, not raw secrets. Passwords, 2FA codes, cookies, tokens, session files, private keys, and payment data must never be stored in project memory.

Outputs are created in `outputs/` or private ignored paths first. When delegated, Coworx may move or copy approved outputs to Downloads, a project folder, a cloud document, or another approved destination, and it records that hand-off as evidence.

## Account Work

Coworx can work with signed-in accounts, but it does not learn or store login secrets.

Credential-safe paths include:

- user-controlled manual login;
- approved existing sessions;
- dedicated Coworx browser profiles;
- password-manager or OS keychain prompts controlled by the user;
- OAuth/app connectors;
- API tokens stored outside the repo;
- encrypted vault handles.

Coworx may remember safe workflow maps, selectors, page locations, non-secret account labels, credential references, and stop conditions. It must not store passwords, 2FA codes, recovery codes, cookies, tokens, private keys, payment data, browser profile files, or account-security secrets.

## Action Levels

- Level 0: read-only.
- Level 1: draft and prepare.
- Level 2: reversible local action.
- Level 3: credentialed reversible external action, allowed inside delegated authority.
- Level 4: delegated external commitment, allowed only when the exact action class and target are delegated or explicitly approved.
- Level 5: high-risk or protected action, stage or block.

Level 5 includes payments, purchases, contracts, legal filings, medical decisions, financial transfers, account security changes, password changes, credential exports, deleting important records, identity verification, academic submission, sensitive personal data transmission to new recipients, irreversible production changes, and anything likely to harm the user if guessed wrong.

## Private Testing

Real workflow testing is private by default.

Store private account maps, screenshots, traces, logs, outputs, and user-specific memory in ignored paths such as:

- `.coworx-private/`
- `memory/private/`
- `runs/private/`
- `outputs/private/`
- `operator/screenshots/private/`
- `operator/traces/private/`

Commit only the blank framework, templates, generic examples, and sanitized lessons.

## First Checks

Run:

```bash
node scripts/coworx_ready_check.mjs
```

Useful smoke tasks:

- `queue/todo/001_map-coworx-itself.md`
- `evals/smoke_tests/browser_demo.md`
- `evals/smoke_tests/computer_use_safe_app_test.md`

## Real Actions

Coworx can take real non-high-risk external actions after delegated authority or explicit approval. Use `docs/external_action_protocol.md` and `operator/action_requests/TEMPLATE_ACTION_REQUEST.md`.

Default pattern:

1. Understand authority and target.
2. Draft or prepare when needed.
3. Acquire the right lock.
4. Execute only inside authority.
5. Save evidence and action result.
6. Report what happened and what remains staged or blocked.
