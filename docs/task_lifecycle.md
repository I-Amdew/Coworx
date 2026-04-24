# Task Lifecycle

1. Intake: capture the user's request in `queue/inbox/` or `queue/todo/`.
2. Dispatch: convert vague goals into a bounded task.
3. Safety review: assign action level, approvals, and stop conditions.
4. Plan: define acceptance criteria, tools, and subagent roles.
5. Execute: do the smallest useful unit of work.
6. Log: write observations and decisions to `runs/active/`.
7. Review: verify against acceptance criteria.
8. Memory: save safe procedures, maps, lessons, or failures.
9. Close: mark complete, move to `queue/done/`, or explain why blocked.

Coworx stops after one queued task unless the user explicitly asks it to continue.
