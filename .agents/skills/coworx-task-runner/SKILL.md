# coworx-task-runner

## Description
Executes one queued Coworx task and stops.

## Role
Task Runner.

## When To Use
Use when the Coordinator has selected a single task from `queue/todo/`.

## Input Format
- task file path;
- action level;
- acceptance criteria;
- approved tools.

## Output Format
- status;
- files changed;
- evidence;
- review result;
- final report path.

## Rules
- Run exactly one task.
- Keep actions inside the approved scope.
- Maintain the run log as work proceeds.
- Do not use browser or Computer Use unless an approved Operator request exists.

## Failure Or Blocked Behavior
Stop, log the blocker, and write a partial final report.
