# Concurrency Model

Coworx uses the lock model in [parallelism_and_locks.md](parallelism_and_locks.md).

## Summary

- Browser/API/code/subagents are parallel by default.
- Shared resources are locked only at the object being changed.
- Computer Use is restricted by app, window, profile, account workflow, clipboard, file picker, simulator, and active focus.

## Coordinator Responsibilities

The Coordinator or Director must:

- identify independent lanes early;
- build a full wave where every ready independent lane is running, Director-owned, intentionally deferred, waiting on a lock, or blocked by safety or authority;
- assign browser and Playwright lanes with separate targets, sessions, outputs, and stop conditions;
- use read, write, or commit locks before shared-resource mutation;
- keep Computer Use target locks specific;
- avoid broad global locks such as `all_browser_work` unless there is a concrete collision risk;
- continue independent lanes while one lane waits for approval or a locked target;
- steer returned agents into follow-ups, same-lane verification, sibling tasks, or closure with rationale instead of treating them as one-shot helpers;
- collect evidence before final reporting;
- route private real-account artifacts to ignored private paths.

## Practical Pattern

Run research, drafting, browser checks, API calls, file reads, tests, and review in parallel. Use locks only when a lane will mutate or commit the same target. Use Computer Use only for GUI work that cannot be handled structurally. The practical goal is elapsed-time speed with explicit collision control: keep the critical path local, fan out everything independent, and fan results back into Director-owned integration and verification.
