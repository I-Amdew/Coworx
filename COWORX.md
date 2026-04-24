# Coworx Operating Manual

## What Coworx Is

Coworx is a local Codex App project for running real work as a coordinated team. The main thread acts as Director, uses the installed Codex ecosystem, runs independent lanes in parallel, locks shared resources, and reports completed, staged, blocked, and residual work.

## How To Run Coworx In Codex App

1. Open this folder in Codex App.
2. Start requests with `Use Coworx.`
3. For broad work, let the main thread build a task graph and staff lanes.
4. Use installed skills/plugins/connectors first.
5. Use Browser Use for in-app/current/local/public targets and Playwright for repeatable structured browser work.
6. Use Computer Use only for GUI/native/real-profile workflows and only with target-level locks.
7. Review the run log and final report before treating the task as complete.

## Creating A Task

Create a Markdown file in `queue/todo/` using `queue/todo/TEMPLATE_TASK.md` when the task should persist.

Minimum fields:

- goal;
- requester;
- action level;
- authority source;
- acceptance criteria;
- allowed tools;
- resource locks;
- stop conditions.

## Running A Task

The Director reads the task, confirms scope, classifies risk, creates a graph, staffs useful lanes, records logs/evidence, reviews the result, updates safe memory, and writes the final report.

Coworx does not stop merely because work touches a browser or account. It stops when authority, target, safety, credentials, or resource locks require it.

## Using Subagents

Use subagents for independent research, code changes in disjoint files/worktrees, review, verification, browser/API lane planning, evidence collection, and memory proposals.

Subagents can operate browser/API/connector lanes when assigned a lease and resource lock. Desktop Computer Use requires a target-level lock and should be serialized whenever isolation is unclear.

## Using Installed Plugins And Skills

Coworx uses what Codex already has installed:

- Browser Use or Playwright for web tasks;
- Computer Use for native apps, real browser profiles, and GUI-only tasks;
- Documents, Spreadsheets, and Presentations for office artifacts;
- GitHub for issues, PRs, comments, and CI;
- Figma for design context;
- image, speech, transcription, PDF, and media skills for media tasks;
- automation tools for reminders and monitors when installed.

Plugins and skills inherit action levels, delegated authority, resource locks, stop conditions, and evidence rules.

## Requesting Tool Operation

Browser, API, connector, and Computer Use work starts with an action request in `operator/action_requests/` when operating external resources or GUI state.

The lane records:

- authority source;
- action level;
- allowed target;
- resource locks;
- privacy class;
- data allowed;
- stop conditions;
- required evidence.

Browser/API/Playwright lanes may run in parallel when locks do not conflict. Computer Use is restricted by app/window/profile/account/focus resources.

## Memory Updates

Memory updates are procedure-focused. Store app maps, workflow maps, selectors, safe account notes, lessons, failures, decisions, and safety guidance. Never store credentials or private tokens.

When memory is uncertain or user-specific, write private/proposed memory rather than shippable memory.

## Real Actions

Coworx may execute non-high-risk Level 3/4 actions when the current request, approved-site registry, autonomy grant, connector, or explicit approval delegates the exact class of action and target.

Stage or block:

- unclear authority;
- unclear targets or recipients;
- sensitive or high-impact content;
- Level 5/protected actions;
- credentials, payments, account security, legal, medical, financial, identity, academic submission, and irreversible production actions.

## Expanding Coworx

Add capability in small, testable slices:

1. Update `AGENTS.md` only when the root contract changes.
2. Add focused docs for detailed protocols.
3. Update templates, skills, and evals to match.
4. Run `node scripts/coworx_ready_check.mjs`.
5. Store real private workflow artifacts only in ignored private paths.
