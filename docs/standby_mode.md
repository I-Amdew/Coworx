# Standby Mode

Standby Mode is a core Coworx dispatch loop for the current active Codex session and Coworx project. It is not a separate product branch and it does not remotely start a brand-new chat later.

Use Standby Mode when the user says things like `standby mode`, `dispatch mode`, `keep checking`, `check every 5 minutes`, `keep working and text me if you need me`, `run this in standby`, or `continue in the background while this chat/session is active`.

## Behavior

Default interval is 5 minutes. Default max runtime is 6 hours.

Each cycle:

1. loads the existing standby state;
2. verifies no duplicate standby loop is already running;
3. continues from the last checkpoint;
4. performs one bounded unit of useful work;
5. saves state, evidence, and the next checkpoint;
6. waits until the next cycle unless the task is done, paused, stopped, blocked, or waiting for user input.

Standby Mode should not restart planning every cycle. The Director keeps the directive ledger and task graph, and the standby loop advances the next ready bounded unit.

## Local State

Private runtime state belongs under `.coworx-private/standby/`:

- `config.json`: local notification setup and private endpoint placeholders;
- `state.json`: active task, times, interval, max runtime, status, cycle count, checkpoint, and pause/stop/input flags;
- `status.md`: human-readable local status;
- `events.ndjson`: meaningful standby events.
- `outbox.ndjson`: meaningful user-facing messages waiting for an approved notifier lane.
- `inbox.ndjson` and `inbox/`: normalized replies or new task packets from approved inbound lanes.
- `tasks/`: private queued tasks received while standby is already working and waiting for Director review.

The shippable template is `config/TEMPLATE_STANDBY_MODE.json`. Do not commit real webhook URLs, phone numbers, account details, screenshots, session files, cookies, tokens, traces, private local state, or outputs from real personal-account tests.

## Starting

Use natural language in the Codex session or the local helper:

```bash
node scripts/coworx_standby.mjs start --task "watch the queued report task" --interval-minutes 5 --max-hours 6
node scripts/coworx_standby.mjs run --task "watch the queued report task" --interval-minutes 5 --max-hours 6
```

`start` records active standby state and prevents duplicate loops with an atomic active lock. `run` starts standby and keeps the current process alive so it can wait until each scheduled cycle is due. `cycle` performs a single due cycle under a per-cycle lock; `--force` is only for tests or manual recovery.

If Standby Mode has not been configured before, ask the user how they want meaningful updates:

- Discord/private channel/webhook;
- desktop notification;
- Messages/iMessage if available;
- SMS/email if later configured;
- local status file only.

Start with `local_status_file` when no safer configured notifier exists. More notification methods can be added later without changing the standby state model.

## Notifications

Quiet mode is the default. Do not notify every 5 minutes unless verbose mode is enabled.

Notify only when something meaningful happens:

- Standby Mode starts or stops;
- the task completes;
- an important milestone is reached;
- a blocker or error appears;
- user permission is needed;
- login, MFA, or manual action is needed;
- output files are ready;
- max runtime is reached.

Standby notifications are adapter based. The always-on base adapters write `.coworx-private/standby/status.md`, `.coworx-private/standby/events.ndjson`, and `.coworx-private/standby/outbox.ndjson`. A browser, connector, API, or Computer Use lane can then deliver outbox messages through an approved channel such as Discord, Messages/iMessage, desktop notification, SMS/email, or another private channel.

Inbound replies are adapter based too. Approved inbox lanes write normalized packets to `.coworx-private/standby/inbox.ndjson` or `.coworx-private/standby/inbox/*.json`. Each cycle polls those private inboxes before doing more work. Supported reply commands are:

- `approve`;
- `deny`;
- `pause`;
- `resume`;
- `stop`;
- `task` or `new_task`.

Inbound replies never expand authority by themselves. `approve` and `deny` apply only to the pending action already recorded in the active directive ledger. `task` or `new_task` is stored privately for Director review before it becomes a directive.

For user-away workflows, configure at least one outbound notifier and one inbound reply source before relying on Standby Mode. If the notifier is Messages/iMessage or another GUI-only app, use a Computer Use action request with locks for the app, active window, account workflow, clipboard if used, and active focus. If a channel fails, standby falls back to the local status/outbox files and records the blocker.

Permission prompts are classified before interrupting the user:

- remote-grantable action approval: ordinary Level 1 to 4 non-protected actions already covered by the active directive;
- local-only manual action needed: macOS privacy prompts, Codex tool approvals, password-manager unlock, or MFA outside approved handoff;
- hard block: account security, password changes, payment, identity verification, credential export, cookie/token export, and Level 5/protected actions.

Computer Use can help check and send through an approved messaging app, but it cannot bypass local OS permissions, account security checks, or MFA that has not been covered by an approved local handoff.

## Dispatch Conversation Style

Standby should feel like one continuous Dispatch thread, not a batch job that disappears or a bot that nags every cycle.

Conversation shape:

1. acknowledge quickly with what Coworx understood and what it is starting;
2. say the task is kicked off and list the concrete work items when useful;
3. keep working silently through routine cycles;
4. send milestone updates only when there is a real status change, output, blocker, login/manual-action need, or final result;
5. answer inbound follow-up questions from the approved channel using the current standby state;
6. keep checking for additional inbound tasks while the active task continues;
7. store new inbound tasks privately for Director review instead of losing them or letting them silently expand authority;
8. send a done message with the output path, what was checked, what is staged, and what still needs the user.

Good standby messages are short and concrete:

- `Got it. I am checking the four core classes now and will list only what is due today.`
- `Task kicked off. I am checking Schoology, the calendar, and submitted status, then I will report back here.`
- `Heads up. The file picker needs a local permission, so I staged the upload and saved the file path.`
- `Done. The report is saved in Downloads and the Schoology page is staged at the review point.`

Do not send filler messages for every polling interval. Do not ask for permission repeatedly. Classify the blocker once, stage what can be staged, and keep doing any safe independent work.

For "check in from anywhere" behavior, configure an outbound notifier and an inbound source. The base implementation writes outbox and inbox files. A Computer Use notifier lane can deliver outbox messages through Messages/iMessage, Discord, desktop notification, or another approved channel, then check that same channel for replies and write normalized packets back to the standby inbox.

Incoming `task` or `new_task` packets are not treated as immediate authority. They are written to `.coworx-private/standby/tasks/` and surfaced to the Director while the current task continues. The Director can then merge, queue, reject, or start the new directive under the normal authority and lock rules.

## Controls

Support simple commands and natural language:

- `stop standby`;
- `pause standby`;
- `resume standby`;
- `standby status`;
- `set interval to X minutes`;
- `end after X hours`;
- `verbose on`;
- `verbose off`;
- `approve`;
- `deny`.

Helper equivalents:

```bash
node scripts/coworx_standby.mjs status
node scripts/coworx_standby.mjs pause
node scripts/coworx_standby.mjs resume
node scripts/coworx_standby.mjs stop --reason "user stopped standby"
node scripts/coworx_standby.mjs set-interval --minutes 10
node scripts/coworx_standby.mjs set-max-runtime --hours 2
node scripts/coworx_standby.mjs verbose on
```

CLI labels such as `--task`, `--reason`, and `--note` must be non-sensitive. Put account details, URLs, webhook endpoints, phone numbers, and private task content in ignored local files, not command arguments or status text.

## Safety

Standby Mode uses the existing Coworx safety, authority, credential handoff, browser, app, Computer Use, and resource-lock rules.

It may continue ordinary delegated work through approved signed-in sessions and approved local credential handoff. It must pause or stage before protected final actions, including sending messages, submitting forms, purchases, important deletion, account or security setting changes, publishing, deploying, or sharing private information.

Computer Use remains target-locked by app, window, browser profile, account workflow, clipboard, file picker, simulator, and active focus. Standby Mode must not run two loops or lanes that mutate the same resource.

Standby Mode should use Computer Use aggressively for GUI-only continuation when authority covers the workflow and locks are available: checking the approved messaging thread, reading an approved app inbox, opening a real browser profile, using a file picker, confirming an upload, or triggering a password-manager autofill. It must stop or stage only when the permission, credential, target, or protected-action boundary requires it.

## Demo Test

Run the fake task test without a real account:

```bash
node scripts/coworx_standby.mjs demo-test
```

The demo test uses temporary local state, completes three bounded fake cycles, verifies duplicate-free state progression, and confirms quiet cycles do not create notification spam.

The demo also verifies local outbound notifications and inbound approval packets without real accounts or secrets.

## Known Limits

Codex cannot remotely start a new chat later. Standby Mode approximates dispatch while the current Coworx project, computer, and Codex session remain available.

Timers and local status files are best-effort. If the session ends, the saved state is still available for status, resume, or cleanup in a later active session, but Coworx cannot act while no active execution context exists.
