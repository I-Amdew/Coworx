# Temporary Waits And Automations

Coworx should not stop just because a safe task is waiting for an external result, a render, a download, an upload, a build, a queue, or a human approval window. It should create an explicit wait item, check at a reasonable interval, and retire the wait when done.

## Wait Model

Every wait needs:

- directive id;
- condition being checked;
- next check time;
- interval;
- max runtime or expiration;
- owner/thread id if available;
- target resource lock if any;
- private state path;
- stop conditions;
- cleanup action.

Use ignored private runtime state for real-user waits:

```text
.coworx-private/standby/waits/
.coworx-private/automations/
.coworx-private/directives/
```

## Routing

Use the smallest reliable mechanism:

1. If the current Codex session is alive and the wait is part of the active task, use Standby Mode.
2. If the wait should survive normal intervals or recur, use Codex Automations when available and authorized.
3. If a connector/API can monitor the resource safely, use it with the exact resource lock.
4. If only a GUI can check, schedule one short Computer Use lease per check and release it immediately.

Do not keep a browser, GUI, or account lock held while waiting. Save the checkpoint, release the lock, and reacquire only when a check is due.

## Check Intervals

Choose intervals based on expected readiness and cost:

- one minute for a short imminent result, after an initial delay when useful;
- five minutes for normal standby polling;
- longer intervals for low-priority or slow external systems.

Avoid noisy polling. If a resource has a rate limit, queue, or cooldown, respect it.

## Automation Lifecycle

For temporary automations, Coworx must:

1. name the wait condition and directive id;
2. create the automation only inside delegated authority;
3. store non-secret automation metadata in ignored private state;
4. check at the configured cadence;
5. complete the downstream task when the condition is met;
6. delete, disable, or mark the automation retired after completion, expiration, or user stop;
7. log the cleanup evidence.

Recurring daily/weekly user workflows are separate. They need an explicit recurring automation grant and should not be created from a one-time "check when ready" instruction.

## Thread Separation

When multiple Codex threads are active, each thread keeps its own directive ledger and wait items. Shared resources are coordinated through resource locks and the Computer Use lease queue, not by merging unrelated thread state.

If a wait from one thread would affect another thread's target, the Director should stage the conflict, acquire the specific shared-resource lock, or leave the second thread queued. Do not let a wait automation mutate a resource owned by another active directive unless the ledgers are reconciled.

## Completion Criteria

A wait is complete only when the condition is met, expired, stopped, blocked, or transferred to a clear user approval queue. A final report should include the wait id/path, checks performed, result, cleanup status, and any remaining staged action.
