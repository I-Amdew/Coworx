# Coworx Operating Manual

## What Coworx Is
Coworx is a local Codex App project for running work as a coordinated team. It uses queues, memory, subagent roles, skills, run logs, safety review, a single Operator lane, Playwright-first browser automation, and Computer Use fallback.

## How To Run Coworx In Codex App
1. Open this folder in Codex App.
2. Start requests with `Use Coworx.`
3. Put task files in `queue/todo/` or ask Codex to dispatch a request into a task.
4. Keep browser and Computer Use actions behind the Operator protocol.
5. Review the run log and final report before treating the task as complete.

## Creating A Task
Create a Markdown file in `queue/todo/` using `queue/todo/TEMPLATE_TASK.md`.

Minimum fields:
- goal;
- requester;
- action level;
- acceptance criteria;
- allowed tools;
- stop conditions.

## Running A Task
The Coordinator reads the task, confirms scope, classifies risk, and creates a run log in `runs/active/`. The task is executed once. Coworx stops after the task unless the user asks for another task.

## Using Subagents
Use subagents for independent research, review, verification, memory writing, and bounded implementation. The Coordinator keeps ownership of architecture, integration, and final response.

Subagents must return concise evidence. They should not control browser or desktop sessions.

Exception: explicitly assigned Browser Operators may control separate leased browser tabs or sessions in parallel. Desktop Computer Use remains single-lane because there is only one shared screen, mouse, keyboard, clipboard, and active app focus.

## Using Installed Plugins And Skills
Coworx is meant to use what Codex already has installed. For each task, the Coordinator should check relevant skills and plugins, choose the narrowest one that fits, and record the choice in the run log.

Examples:
- Browser Use or Playwright for web tasks.
- Computer Use for Mac apps.
- Documents, Spreadsheets, or Presentations for office work.
- GitHub for issues, PRs, comments, and CI.
- Figma for design context.
- Image, speech, transcription, and PDF skills for media tasks.

Plugins and skills do not bypass safety. They inherit the task's action level, approvals, stop conditions, and one-Operator rule.

## Requesting Operator Action
Browser or Computer Use work starts with an action request in `operator/action_requests/`. The Operator checks action level, preconditions, allowed target, stop conditions, and required output.

If the request is safe and approved, the Operator executes it and writes a result in `operator/action_results/`.

## Memory Updates
Memory updates are procedure-focused. Store app maps, workflow maps, selectors, safe account notes, lessons, failures, decisions, and safety guidance. Never store credentials or private tokens.

When memory is uncertain, write a proposed memory update in the final report instead of saving it.

## Testing Real Work
Use `docs/private_real_work_testing.md` and `queue/todo/TEMPLATE_REAL_ACCOUNT_TEST.md` for real signed-in workflows.

Real tests are private by default. The user signs in manually. Coworx may map workflows and create drafts or local outputs inside ignored private paths. It must stop before external commitments unless the exact action is approved at action time.

Do not retrieve login information from Claude skills, password stores, browser storage, old logs, or any other source.

## Real Actions
Use `docs/external_action_protocol.md` for sends, schedules, uploads, moves, deletes, submissions, invitations, settings, and other external commitments.

Coworx drafts first, then pauses. The Operator can perform the final action only when an approval packet names the exact app/account, action, data, destination, and expiration.

## Expanding Coworx
Add one capability at a time:
1. Internal task runner.
2. Public Playwright demo.
3. Computer Use readiness checklist.
4. Read-only real app mapping with approval.
5. Low-risk draft-only workflows.
6. Regression tests for recurring workflows.

Keep every expansion tied to action levels, logs, review, and safe memory.
