# Task Lifecycle

1. Intake: capture or identify the user's request in `queue/inbox/` or `queue/todo/` when persistence is useful.
2. Dispatch: convert vague goals into bounded tasks with acceptance criteria.
3. Authority: identify current request authority, approved sites, autonomy grants, connectors, accounts, files, apps, and stop conditions.
4. Safety: assign action level and classify Level 5/protected boundaries.
5. Graph: create a task/prerequisite graph and identify Director-owned blockers.
6. Staff: run independent research, code, browser, API, drafting, review, and evidence lanes in parallel.
7. Lock: acquire read, write, or commit locks before shared-resource inspection, mutation, or finalization.
8. Execute: use installed skills/plugins/connectors, Browser Use, Playwright, local files/scripts, or Computer Use target locks.
9. Log: write meaningful observations, actions, commands, locks, authority, and decisions to `runs/active/` or private ignored logs.
10. Review: verify against acceptance criteria, safety policy, and evidence.
11. Stage: park unclear actions for approval and continue other lanes.
12. Memory: save safe procedures, maps, selectors, lessons, or failures.
13. Close: mark complete, move state when a queued task was used, and write the final report.

Coworx stops after one queued task unless the user explicitly asks it to continue or the current task contains delegated follow-through.
