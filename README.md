# Coworx

Coworx is a Codex-native coworker framework. It teaches Codex App how to coordinate real work on your computer using the plugins, skills, MCP tools, browser controls, local files, and desktop apps you already have enabled.

The goal is Claude Cowork-style operation, adapted for Codex:
- route work through installed Codex skills and plugins;
- split complex requests across subagents;
- use Browser Use or Playwright for web workflows;
- use Computer Use for native Mac apps and visual GUI tasks;
- create documents, slides, spreadsheets, summaries, reports, drafts, and app maps;
- write logs and memory so workflows improve over time;
- run multiple approved browser lanes in parallel;
- keep one Computer Use desktop lane for the shared screen, mouse, keyboard, clipboard, and app focus;
- keep private account/workflow memory out of the shippable framework.

## What This Project Is
This repository is the blank framework. It should be safe for other users to download and adapt.

It includes:
- `AGENTS.md`: operating rules, roles, action levels, and safety boundaries.
- `COWORX.md`: how to run Coworx inside Codex App.
- `.agents/skills/`: Coworx skills that teach Codex the workflow.
- `docs/`: architecture, routing, account handoff, real-work task model, safety, and private memory policy.
- `docs/concurrency_model.md`: how Coworx runs parallel browser lanes while serializing Computer Use.
- `queue/`: task queue.
- `memory/`: templates, generic maps, and safe playbooks.
- `operator/`: action requests, results, approvals, screenshots, traces, recordings, and Operator lease templates.
- `evals/`: smoke and regression tests.
- `scripts/coworx_ready_check.mjs`: static readiness check.

## What Coworx Can Do
Coworx can run both coding and non-coding work:
- summarize meetings and transcripts;
- make reports, documents, slides, and spreadsheets;
- draft messages, calendar events, and follow-ups;
- map websites, dashboards, and desktop apps;
- organize local files when approved;
- inspect browser pages and apps using Browser Use, Playwright, or Computer Use;
- use GitHub, Figma, PDF, image, speech, transcription, document, spreadsheet, and presentation skills when installed.

## Account Work
Coworx can work with signed-in accounts, but it does not learn or store login secrets.

Correct login flow:
1. You approve the exact target account or app.
2. You sign in manually.
3. Coworx confirms the target and action level.
4. Coworx performs read-only or draft-only work by default.
5. Coworx stops before sending, submitting, inviting, scheduling, deleting, purchasing, changing settings, or transmitting sensitive data unless you approve the exact final action at action time.

Coworx may remember safe workflow maps, selectors, page locations, and stop conditions. It must not store passwords, 2FA codes, recovery codes, cookies, tokens, private keys, payment data, or account-security details.

This is session-backed account operation: the user controls login, while Coworx learns private workflow maps and sanitized reusable playbooks.

## Private Testing
Real workflow testing is how Coworx improves, but real test artifacts must stay private.

Shipping note: this framework does not include private account memories or private test logs. I did not log into Schoology or any real account, and I did not automate academic assignment completion/submission.

Private-by-default tasks include:
- signed-in account workflows;
- user-specific app maps;
- meeting notes, transcripts, messages, and calendar details;
- screenshots or traces from real apps;
- private dashboard values;
- real task logs and outputs.

Store those in ignored paths such as:
- `.coworx-private/`
- `memory/private/`
- `runs/private/`
- `outputs/private/`
- `operator/screenshots/private/`
- `operator/traces/private/`

The shippable framework should contain only templates, generic examples, local no-login fixtures, and sanitized playbooks.

## Safety Model
Coworx uses action levels:
- Level 0: read-only.
- Level 1: draft-only.
- Level 2: reversible local action.
- Level 3: external reversible action, approval required.
- Level 4: external commitment, action-time approval required.
- Level 5: sensitive or high-risk, pause and ask.

Credentials, 2FA, session cookies, tokens, recovery codes, account recovery, payment execution, account security settings, and academic submission are hard stops. Coworx should not automate them.

Before real account/app testing, Coworx records user responsibility acknowledgement with `operator/approvals/TEMPLATE_USER_RESPONSIBILITY_ACK.md`. Every real workflow ends with an action ledger so the user knows what Coworx did.

## First Checks
Run the static readiness check:

```bash
node scripts/coworx_ready_check.mjs
```

Run the first local smoke task:
1. Use `queue/todo/001_map-coworx-itself.md`.
2. Write a run log and final report.
3. Update only safe project/process memory.

Safe action-lane smoke tests already exist:
- Browser/Playwright local fixture: `evals/smoke_tests/browser_demo.md`
- Computer Use Calculator test: `evals/smoke_tests/computer_use_safe_app_test.md`

## Iteration Workflow
Use a testing branch for real workflow development:

```bash
git switch -c codex-coworx-real-work-testing
```

Then:
1. Test real workflows only after manual login and exact approval.
2. Store all real artifacts in ignored private paths.
3. Improve templates, docs, playbooks, and skills from what worked.
4. Sanitize anything that might be useful to ship.
5. Commit only the blank framework, templates, generic examples, and sanitized lessons.

Do not commit private memories, account maps, screenshots, task logs, meeting content, message drafts, calendar details, or credentials.

## Real Actions
Coworx can take real external actions after exact action-time approval. Use `docs/external_action_protocol.md` and `operator/approvals/TEMPLATE_EXTERNAL_ACTION_APPROVAL.md`.

Default pattern:
1. Draft locally or privately.
2. Review.
3. Ask for exact approval.
4. Operator performs only that action.
5. Private result is logged.
6. Sanitized lessons are folded back into the framework.
