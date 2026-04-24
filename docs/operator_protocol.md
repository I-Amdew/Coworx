# Operator Protocol

Coworx operates external tools through leased lanes and resource locks.

There is no global browser Operator bottleneck. Browser Use, Playwright, API, and connector lanes may run in parallel when they have separate targets or compatible read locks. Computer Use requires target-level desktop locks.

## Action Request

Use `operator/action_requests/TEMPLATE_ACTION_REQUEST.md` when a lane will operate a browser, account, connector, app, GUI, or external system.

An action request must include:

- goal;
- tool mode;
- target;
- privacy classification;
- account/app identity;
- data allowed to read or capture;
- external transmission boundary;
- action level;
- authority source;
- approval record when needed;
- required resource locks;
- allowed actions;
- stop conditions;
- required output and evidence.

## Lane Types

### Browser/API/Connector Lane

Use for Browser Use, Playwright, API connectors, and app integrations.

Browser/API/connector lanes may run in parallel by default. Acquire locks only for shared write or commit targets.

### Computer Use Lane

Use only for native apps, real browser profiles, visual GUI tasks, simulators, system dialogs, file pickers, or workflows that cannot be handled structurally.

Computer Use lanes require target-level locks for app/window/profile/account workflow and any clipboard, file picker, simulator, or active-focus dependency.

## Execution Rules

1. Confirm the action request is complete.
2. Confirm the active target and account/app identity.
3. Confirm delegated authority or explicit approval for non-high-risk Level 3/4 actions.
4. Confirm Level 5/protected actions are staged or blocked.
5. Acquire required locks.
6. Execute only allowed actions.
7. Stop at any boundary condition.
8. Save evidence.
9. Write an action result.
10. Release locks promptly.

## Stop Conditions

Stop on:

- login, credential, 2FA, recovery, token, cookie, or secret prompts outside approved secure flows;
- wrong target, wrong account, or changed destination;
- permission prompt not covered by authority;
- payment, account security, identity, legal, medical, financial, academic submission, or protected action;
- external commitment outside delegated authority or explicit approval;
- destructive action outside delegated authority or explicit approval;
- uncertain recipients, dates, files, destinations, or data.
