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

For non-trivial work, fill the wave. A ready lane should be either running, Director-owned, intentionally deferred, waiting on a specific lock, or blocked by safety or authority. Do not let safe independent work sit idle behind unrelated recon, tests, browser checks, drafting, review, or evidence collection.

This is model-agnostic. If the active model is fast but serial, or if any model has previously under-delegated in this workspace, the Director must make the first wave explicit before solo execution: list ready lanes, staff independent lanes, and record the reason for any lane left unstaffed.

Good parallel waves include:

- recon over the codebase while test discovery runs;
- browser inspection while an API connector lane gathers IDs;
- drafting a document while a verifier checks source evidence;
- one implementation owner per disjoint file set while a reviewer maps risk;
- Computer Use on one locked GUI target while non-GUI lanes continue elsewhere.
- one Computer Use lane downloading a signed-in export while local agents prepare parsers, followed by many local shard readers after the artifact is saved.

## Download Once, Fan Out Locally

For large signed-in site work, the fastest safe route is often:

1. assign one Operator lane to the site or app;
2. acquire the real browser, account workflow, file picker, and active focus locks needed for extraction;
3. download, export, print to PDF, save HTML, copy approved page data, or otherwise capture the source artifact;
4. save private user/account data under `.coworx-private/` or another ignored private path;
5. release the Computer Use or browser locks as soon as the artifact is verified;
6. split, index, or convert the artifact locally;
7. spawn many read-only local agents over disjoint shards;
8. fan results back to the Director for synthesis, verification, and any later staged external action.

Use this pattern for course calendars, LMS assignment lists, downloaded chapter PDFs, dashboards, reports, spreadsheets, cloud-doc exports, message archives, transcript files, and research source bundles.

Do not keep one GUI/browser lane slowly reading a site page by page when the data can be safely exported once and processed locally. The GUI lane should be short and lock-heavy. The local processing wave should be broad and lock-light.

Respect privacy and permissions:

- do not download or export data outside the user's grant;
- store signed-in account exports in ignored private paths by default;
- do not send downloaded private data to subagents that do not need it;
- shard by file, page range, row range, course, thread, or source;
- give each local agent a read-only shard and a narrow return envelope;
- keep secrets, cookies, tokens, raw auth headers, and credential artifacts out of exports, logs, prompts, traces, screenshots, and reports.

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

The lock target should be as narrow as the real collision risk. Prefer object locks such as `github_pr:45`, `calendar_event:weekly_sync`, `gdoc:proposal`, or `file:docs/director_use.md` over broad locks such as `all_browser_work` or `all_docs`.

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

## Cross-Thread Air Traffic

Multiple Codex threads may run Coworx against the same project. Keep each thread's directive ledger, waits, and private outputs separate, but coordinate shared objects with specific locks. Do not merge unrelated thread state just because both are in standby.

Use the Computer Use lease queue for the real desktop, and use object-specific locks for cloud docs, drafts, calendar events, task-board cards, files, deployments, and external forms. If a thread is waiting for a resource, it should record a wait item and release locks until the next check is due.

## Computer Use Lease Queue

When more than one Coworx or Codex instance may be active, Computer Use must be coordinated through the local file-backed lease queue before any tool call that moves the mouse, types, changes app focus, opens a file picker, or operates a real browser profile.

Queue state lives under ignored private runtime storage:

```text
.coworx-private/computer-use/
  active.lock/lease.json
  requests/*.json
  history/*.json
  events.ndjson
  status.md
```

Use `scripts/coworx_computer_use_queue.mjs`:

```bash
node scripts/coworx_computer_use_queue.mjs request \
  --task "Read approved portal export" \
  --owner "codex-resume-polish" \
  --locks "computer_app:Chrome,browser_profile:Chrome:approved,account_workflow:approved-portal,desktop_resource:active_window_focus" \
  --duration-minutes 10

node scripts/coworx_computer_use_queue.mjs acquire --request-id REQUEST_ID
node scripts/coworx_computer_use_queue.mjs renew --lease-id LEASE_ID --duration-minutes 10
node scripts/coworx_computer_use_queue.mjs release --lease-id LEASE_ID
node scripts/coworx_computer_use_queue.mjs status
```

Use `reserve` with `--start` or `--start-in-minutes` when a future timeslot is better than waiting:

```bash
node scripts/coworx_computer_use_queue.mjs reserve \
  --task "Upload final PDF through a file picker" \
  --owner "codex-upload-lane" \
  --start-in-minutes 15 \
  --duration-minutes 5 \
  --locks "computer_app:Chrome,desktop_resource:file_picker,desktop_resource:active_window_focus"
```

Rules:

- No Computer Use call should start without an active lease held by the current lane.
- The queue is global for the desktop by default because active focus, keyboard, mouse, and clipboard collide even when the logical targets differ.
- Target locks are still recorded so the Director can understand what the lane intends to touch.
- Leases expire automatically if not renewed. Stale active leases may be cleaned up by `cleanup-stale`.
- Release the lease before local processing, parsing, drafting, testing, review, or any other work that does not require the GUI.
- Prefer download once, release the lease, and fan out locally. The GUI lease should be short and extraction-focused.
