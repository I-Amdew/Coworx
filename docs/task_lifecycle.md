# Task Lifecycle

1. Intake: capture or identify the user's request in `queue/inbox/` or `queue/todo/` when persistence is useful.
2. Dispatch: convert vague goals into a directive ledger and bounded tasks with acceptance criteria.
3. Memory: check Coworx project memory for known maps, routes, selectors, account labels, output locations, and stop conditions.
4. Authority: identify current request authority, approved sites, autonomy grants, connectors, accounts, files, apps, and stop conditions.
5. Safety: assign action level and classify Level 5/protected boundaries.
6. Graph: create a task/prerequisite graph from the directive ledger and identify Director-owned blockers.
7. Staff: run independent research, code, browser, API, drafting, review, verification, diagnosis, and evidence lanes in parallel when they improve delivery.
8. Lock: acquire read, write, or commit locks before shared-resource inspection, mutation, or finalization.
9. Execute: use installed skills/plugins/connectors, Browser Use, Playwright, local files/scripts, or Computer Use target locks.
10. Log: write meaningful observations, actions, commands, locks, authority, decisions, outputs, and hand-offs to `runs/active/` or private ignored logs.
11. Integrate: inspect subagent and lane returns, update the directive ledger, and promote downstream work required by the original request.
12. Review: verify against directive acceptance criteria, safety policy, and evidence.
13. Stage: park unclear actions for approval and continue other lanes.
14. Learn: save safe procedures, maps, selectors, output locations, lessons, or failures.
15. Close: mark complete only after every directive is completed, staged, blocked, skipped, or explicitly waiting; then move state when a queued task was used and write the final report.

Coworx stops after one queued task unless the user explicitly asks it to continue or the current task contains delegated follow-through.

When the user asks for Standby Mode, convert the active task into a resumable dispatch loop instead of a one-shot run. Save private standby state after each bounded cycle, preserve the directive ledger between cycles, prevent duplicate loops, and stop when the task completes, the user stops or pauses it, max runtime is reached, or user input is required.
