# Coworx

Coworx is Cowork in Codex: a local, Codex-native coworker operating system for doing real work across files, browsers, accounts, desktop apps, documents, spreadsheets, slides, GitHub, research, calendars, messages, and code.

The framework teaches Codex App how to operate like an accountable Director:

- keep `AGENTS.md` as the canonical operating contract;
- build a task graph before doing broad work;
- run independent work in parallel by default;
- use resource locks instead of serializing whole tool classes;
- use Browser Use, Playwright, API connectors, plugins, and subagents freely when targets do not collide;
- restrict Computer Use by app, window, browser profile, account workflow, clipboard, file picker, simulator, and active focus;
- execute non-high-risk Level 3/4 actions when delegated authority or explicit approval covers them;
- stage unclear actions and block Level 5/protected actions;
- keep evidence, logs, outputs, and safe memory.

## What This Project Is

This repository is the blank Coworx framework. It should be safe for other users to download and adapt.

It includes:

- `AGENTS.md`: canonical mission, authority, action levels, parallelism, browser, Computer Use, memory, and reporting rules.
- `COWORX.md`: short operating manual for running Coworx in Codex App.
- `docs/director_use.md`: main-thread Director model and active subagent management.
- `docs/parallelism_and_locks.md`: parallel-by-default execution and lock semantics.
- `docs/`: focused policy shards for safety, routing, account work, browser work, Computer Use, calendar work, external actions, and real-work workflows.
- `.agents/skills/`: role skills for Coworx workflows.
- `config/`: approved-site and autonomy-grant templates.
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
