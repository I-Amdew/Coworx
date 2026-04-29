# Standby Mode Smoke Test

## Goal

Validate Standby Mode without real accounts, credentials, browser sessions, screenshots, webhooks, phone numbers, tokens, or private traces.

## Command

```bash
node scripts/coworx_standby.mjs demo-test
node scripts/coworx_ready_check.mjs
```

## Pass Criteria

- Demo task completes using fake local state only.
- Standby state includes active task, started time, last cycle, next cycle, interval, max runtime, status, cycle count, last meaningful update, user input flag, and stop/pause state.
- Duplicate active loops are rejected by the helper with an atomic active lock.
- Duplicate cycle execution is rejected with a per-cycle lock.
- Cycles do not run before `next_cycle` unless forced for tests or manual recovery.
- Quiet cycles do not emit notification spam while verbose mode is off.
- CLI task, reason, note, and notification method values reject URL, email, phone, token, cookie, password, and secret-looking input.
- Meaningful start, milestone, output-ready, completion, stop, blocker, approval, login/manual-action, and max-runtime events are reserved as notification-worthy.
- Meaningful events are written to the local outbound adapter file when configured.
- Outbox packets include Dispatch-style conversation metadata so a notifier lane can deliver them in one continuous thread.
- Inbound local reply packets can apply `approve` / `deny`, pause, resume, stop, or store a new task privately for Director review.
- Inbound `task` or `new_task` packets are stored under the private standby task queue, not inside the consumable inbox directory.
- Vague inbound task packets are stored privately and queue a clarification instead of being marked completed.
- Standby keeps checking inbound sources while the active task continues.
- Configured GUI-only dispatch channels such as Messages/iMessage immediately queue a Computer Use request with app and active-focus locks.
- A GUI channel is not reported as checked unless private queue/lease, app-state/action, approved-channel verification, and release or wait evidence exist.
- Remote replies cannot expand authority beyond the active directive.
- Permission prompts are classified as remote-grantable approval, local-only manual action, or hard block.
- Runtime files stay under ignored private paths or temporary directories.
- No real webhook, token, phone number, account detail, screenshot, trace, session file, cookie, credential, or personal-account output is committed.
- No app/site-specific task hardcoding is required for the demo.
- Public demo outbox fixtures are allowed only for fake local state. Real dispatch outbox, inbox, channel config, and queued tasks must stay under `.coworx-private/standby/` or another ignored private path.
- Temporary waits record condition, interval, expiration, private state path, and cleanup status; any Codex Automation created for a one-time wait is deleted, disabled, or marked retired after completion, expiration, stop, or block.
