# Concurrency Model

Coworx uses the lock model in [parallelism_and_locks.md](parallelism_and_locks.md).

## Summary

- Browser/API/code/subagents are parallel by default.
- Shared resources are locked only at the object being changed.
- Computer Use is restricted by app, window, profile, account workflow, clipboard, file picker, simulator, and active focus.

## Coordinator Responsibilities

The Coordinator or Director must:

- identify independent lanes early;
- assign browser and Playwright lanes with separate targets, sessions, outputs, and stop conditions;
- use read, write, or commit locks before shared-resource mutation;
- keep Computer Use target locks specific;
- avoid broad global locks such as `all_browser_work` unless there is a concrete collision risk;
- continue independent lanes while one lane waits for approval or a locked target;
- collect evidence before final reporting;
- route private real-account artifacts to ignored private paths.

## Practical Pattern

Run research, drafting, browser checks, API calls, file reads, tests, and review in parallel. Use locks only when a lane will mutate or commit the same target. Use Computer Use only for GUI work that cannot be handled structurally.
