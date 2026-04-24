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

## Demo Test

Run the fake task test without a real account:

```bash
node scripts/coworx_standby.mjs demo-test
```

The demo test uses temporary local state, completes three bounded fake cycles, verifies duplicate-free state progression, and confirms quiet cycles do not create notification spam.

## Known Limits

Codex cannot remotely start a new chat later. Standby Mode approximates dispatch while the current Coworx project, computer, and Codex session remain available.

Timers and local status files are best-effort. If the session ends, the saved state is still available for status, resume, or cleanup in a later active session, but Coworx cannot act while no active execution context exists.
