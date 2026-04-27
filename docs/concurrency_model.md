# Concurrency Model

Coworx uses the lock model in [parallelism_and_locks.md](parallelism_and_locks.md).

## Summary

- Browser/API/code/subagents are parallel by default.
- Shared resources are locked only at the object being changed.
- Computer Use is coordinated through the file-backed lease queue when more than one Coworx or Codex instance may be active, then restricted by app, window, profile, account workflow, clipboard, file picker, simulator, and active focus.

## Coordinator Responsibilities

The Coordinator or Director must:

- identify independent lanes early;
- build a full wave where every ready independent lane is running, Director-owned, intentionally deferred, waiting on a lock, or blocked by safety or authority;
- assign browser and Playwright lanes with separate targets, sessions, outputs, and stop conditions;
- use read, write, or commit locks before shared-resource mutation;
- require `scripts/coworx_computer_use_queue.mjs` request/acquire/release before real desktop control when another instance may be active;
- keep Computer Use target locks specific;
- avoid broad global locks such as `all_browser_work` unless there is a concrete collision risk;
- continue independent lanes while one lane waits for approval or a locked target;
- steer returned agents into follow-ups, same-lane verification, sibling tasks, or closure with rationale instead of treating them as one-shot helpers;
- collect evidence before final reporting;
- route private real-account artifacts to ignored private paths.

## Practical Pattern

Run research, drafting, browser checks, API calls, file reads, tests, and review in parallel. Use locks only when a lane will mutate or commit the same target. Use Computer Use only for GUI work that cannot be handled structurally. The practical goal is elapsed-time speed with explicit collision control: keep the critical path local, fan out everything independent, and fan results back into Director-owned integration and verification.

When the GUI is needed, file a Computer Use queue request, acquire the active lease, do the shortest useful GUI unit, then release it. Waiting agents should work on non-GUI tasks instead of competing for focus.

## Download Once, Fan Out Locally

When source data lives behind a signed-in site or GUI, do not make one Operator read everything online if export or download is available. Use one locked Computer Use, browser, connector, or API lane to obtain the artifact, verify the file, then release the lock and split the local data into shards.

After download, local processing is parallel by default. Assign independent agents to page ranges, row ranges, sections, source files, courses, threads, or folders. Each agent should return structured findings and evidence from its shard only. The Director integrates the shard results and decides whether another GUI/account action is needed.

This pattern keeps the scarce resource, the signed-in GUI/account lane, on the critical extraction path only. It turns slow online reading into fast local file processing.
