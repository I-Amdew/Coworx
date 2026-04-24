# Coworx Operating Manual

## What Coworx Is

Coworx is a local Codex App project for running real work as a coordinated team. It is not a downloaded skill. The main thread acts as Director, keeps a directive ledger for multi-stage goals, reads and writes the project's maps/logs/outputs/memory, uses Codex capabilities when useful, runs independent lanes in parallel, locks shared resources, and reports completed, staged, blocked, and residual work.

## How To Run Coworx In Codex App

1. Open this folder in Codex App.
2. Start requests with `Use Coworx.`
3. Let Coworx consult this project's memory, maps, playbooks, queues, and previous outputs before asking for context.
4. Let Coworx consult the capability map for this user's plugins, skills, connectors, browser profiles, scripts, apps, and fallbacks.
5. For broad work, let the main thread build a task graph and staff lanes.
6. Track explicit and implied directives until each is completed, staged, blocked, skipped, or explicitly waiting.
7. Use subagents when parallel research, implementation, diagnosis, review, verification, or evidence collection improves delivery.
8. Use installed skills/plugins/connectors as capabilities when they fit the task.
9. Use Browser Use for in-app/current/local/public targets and Playwright for repeatable structured browser work.
10. Use Computer Use only for GUI/native/real-profile workflows and only with target-level locks.
11. Review the run log and final report before treating the task as complete.

## Creating A Task

Create a Markdown file in `queue/todo/` using `queue/todo/TEMPLATE_TASK.md` when the task should persist.

Minimum fields:

- goal;
- requester;
- action level;
- authority source;
- acceptance criteria;
- directive ledger;
- allowed tools;
- resource locks;
- stop conditions.

## Running A Task

The Director reads the task, checks project memory, confirms scope, classifies risk, creates a directive ledger and graph, staffs useful lanes, records logs/evidence, integrates subagent returns, reviews the result, updates safe memory, and writes the final report.

Coworx does not stop merely because work touches a browser or account. It stops when authority, target, safety, credentials, or resource locks require it.

Coworx also does not stop merely because the first subtask is finished. It stops when every directive required by the user's goal has been delivered, staged, blocked, skipped, or explicitly marked waiting.

## Using Subagents

Use subagents for independent research, code changes in disjoint files/worktrees, review, verification, browser/API lane planning, blocker diagnosis, evidence collection, and memory proposals.

Subagents can operate browser/API/connector lanes when assigned a lease and resource lock. Desktop Computer Use requires a target-level lock and should be serialized whenever isolation is unclear.

Every subagent should advance a named directive, own a clear scope, return evidence, and be integrated by the Director before the directive is considered complete.

## Using Project Memory

Coworx gets faster by storing safe local knowledge:

- where files, courses, dashboards, apps, and outputs live;
- how to navigate approved workflows;
- which account label, browser profile, connector, login route, or vault handle applies;
- which plugins, skills, MCP tools, scripts, apps, and fallbacks are available in this user's setup;
- selectors, reports, filters, export paths, and naming conventions;
- what to stage, what to do automatically, and what to block.

Private user-specific maps belong in ignored private paths. Coworx may store login routes and account labels, but not passwords, 2FA codes, cookies, tokens, recovery codes, session files, private keys, or payment data.

## Using Installed Capabilities

Coworx may use what Codex already has installed:

- Browser Use or Playwright for web tasks;
- Computer Use for native apps, real browser profiles, and GUI-only tasks;
- Documents, Spreadsheets, and Presentations for office artifacts;
- GitHub for issues, PRs, comments, and CI;
- Figma for design context;
- image, speech, transcription, PDF, and media skills for media tasks;
- automation tools for reminders and monitors when installed.

Plugins, skills, connectors, and tools inherit action levels, delegated authority, resource locks, stop conditions, and evidence rules. They are capability layers Coworx routes to, not the Coworx product itself.

When a capability is missing, fails, or works especially well, Coworx should save a safe capability lesson so future tasks route better.

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
3. Update templates, local role prompt files, memory/playbook examples, and evals to match.
4. Run `node scripts/coworx_ready_check.mjs`.
5. Store real private workflow artifacts only in ignored private paths.
