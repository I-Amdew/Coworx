# Operator Protocol

The Operator is the only lane allowed to control Playwright, browser sessions, or Computer Use.

## Required Input
Use `operator/action_requests/TEMPLATE_ACTION_REQUEST.md`.

An action request must include:
- goal;
- tool mode;
- target;
- action level;
- preconditions;
- allowed actions;
- stop conditions;
- required output.
- privacy class and output path;
- allowed data capture;
- screenshot and trace policy;
- exact approval evidence when needed.

## Execution Rules
1. Confirm the action request is complete.
2. Confirm approvals are present for the action level.
3. Use Playwright first for browser tasks.
4. Use Computer Use only when required.
5. Log each meaningful action.
6. Stop at any boundary condition.
7. Write an action result.

## Stop Conditions
Stop on login, 2FA, credential prompts, permission prompts, wrong target, security/account/payment areas, external commitments, destructive actions, or any sensitive action not explicitly approved.
