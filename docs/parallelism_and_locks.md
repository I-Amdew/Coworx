# Parallelism And Locks

Coworx runs work in parallel by default.

The rule is:

```text
Run agents in parallel.
Lock resources, not agents.
Restrict Computer Use when app/window/focus state can collide.
```

## Parallel By Default

Parallelize:

- subagents;
- research;
- code work in separate worktrees or disjoint files;
- Browser Use lanes;
- Playwright lanes;
- API connectors;
- file readers;
- reviewers;
- document drafters;
- evidence collectors;
- test runners;
- task classifiers.

Do not serialize browser/API/code/research work merely because another lane is active.

## Restricted By Target

Acquire a lock before mutating:

- the same local file;
- the same cloud document;
- the same spreadsheet range;
- the same calendar event;
- the same email draft;
- the same form submission;
- the same GitHub issue or PR;
- the same deployment target;
- the same task-board card;
- the same account settings page;
- the same checkout/cart;
- the same GUI app/window/profile/account workflow.

## Lock Types

### Read Lock

Many lanes may hold read locks on the same target.

Use for:

- inspecting the same document;
- reading the same issue;
- comparing the same dashboard;
- reviewing the same file.

### Write Lock

Only one lane may hold a write lock for a target.

Use for:

- editing a file;
- updating a document;
- filling a form;
- editing a calendar event;
- modifying a task-board card.

### Commit Lock

Only the Director or explicitly authorized lane may hold a commit lock.

Use for:

- sending;
- submitting;
- inviting;
- publishing;
- merging;
- deploying;
- purchasing;
- deleting;
- changing settings.

Commit locks also require delegated authority or explicit approval, and Level 5/protected actions still stage or block.

## Browser Use And Playwright

Browser lanes are parallel by default.

Allowed in parallel:

- multiple lanes reading the same document;
- multiple lanes researching different sources;
- one lane testing localhost while another captures screenshots;
- one lane drafting Email A while another drafts Email B;
- one lane creating Meeting A while another creates unrelated Meeting B;
- one lane updating a Notion task while another creates a GitHub issue.

Requires a write or commit lock:

- two lanes editing the same Google Doc;
- two lanes editing the same spreadsheet range;
- two lanes editing the same calendar event;
- two lanes editing the same email draft;
- two lanes filling the same form;
- two lanes updating the same GitHub issue or PR;
- two lanes changing the same settings page;
- two lanes using the same checkout/cart;
- two lanes deploying or changing the same environment.

The Codex in-app Browser plugin is best for unauthenticated local, file-backed, current in-app, and public pages. It does not provide normal signed-in browser profile behavior, browser extensions, existing user tabs, or general authentication flows.

For credentialed web work, prefer:

1. official app/API connector;
2. MCP/plugin integration;
3. Playwright with an approved isolated profile if available;
4. Computer Use controlling a real approved browser/profile.

## Computer Use

Computer Use is restricted because it may share:

- screen;
- mouse;
- keyboard;
- clipboard;
- menus;
- dialogs;
- active app focus;
- browser profile state;
- app-local state;
- visible GUI context.

Do not run two Computer Use tasks against the same app, browser profile, browser window, signed-in account workflow, form, calendar event, email draft, file picker, simulator/device, clipboard-dependent workflow, settings page, checkout, or payment flow.

Computer Use may run in parallel only when targets are clearly isolated. If isolation is unclear, serialize it.

Examples of Computer Use locks:

- `computer_app:Slack`
- `computer_app:Messages`
- `browser_profile:Chrome:CoworxCalendar`
- `browser_window:Chrome:CalendarProfile:event_edit`
- `account_workflow:GoogleCalendar:personal`
- `simulator:iPhone_17_Pro`
- `desktop_resource:clipboard`
- `desktop_resource:file_picker`
- `desktop_resource:active_window_focus`

Release locks as soon as the action is complete, evidence is saved, GUI state is stable, and the lane no longer needs that resource.

