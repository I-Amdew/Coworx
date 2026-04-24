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
- Runtime files stay under ignored private paths or temporary directories.
- No real webhook, token, phone number, account detail, screenshot, trace, session file, cookie, credential, or personal-account output is committed.
- No app/site-specific task hardcoding is required for the demo.
