# Session-Backed Account Operations

Coworx can work in real accounts by using sessions, profiles, connectors, local-only credential handoff, or credential handles the user controls.

## Principle

Coworx learns workflows, not secrets.

It may learn:

- which app or site is used for a workflow;
- which approved account label applies;
- where important pages live;
- which selectors, tabs, views, and buttons matter;
- exact private layout and form structure when stored in ignored private memory;
- what the user's normal process is;
- which data belongs in private memory;
- where delegated authority and stop boundaries are;
- what worked and failed.

It must not learn, store, print, screenshot, trace, export, or commit passwords, MFA answers, recovery codes, cookies, OAuth tokens, API keys, password-manager secrets, security answers, private keys, or payment credentials.

## Credential Handoff Cases

- Already signed-in session: continue inside delegated authority.
- Password manager, browser autofill, or OS keychain: trigger the approved local flow without exposing the secret.
- Local ignored secret file or environment variable: read only at runtime, never print values, never pass values as command-line arguments, and keep files under ignored private paths.
- User-present manual secure entry: pause for the user to complete login, then continue after confirmation.
- Unsupported credential handling: pause or block credential export, cookie export, token export, password changes, account recovery, security settings, payment credential changes, identity verification, wrong-domain login, and suspicious login pages.

## Real Account Flow

1. User or saved policy approves the target account, site, and task.
2. Coworx uses a credential-safe access path or approved local-only credential handoff.
3. Coworx confirms it is on the intended target.
4. Coworx creates browser/API/connector or Computer Use lane leases as needed.
5. Coworx performs approved read-only, draft, reversible external, or delegated external actions.
6. Coworx writes private logs, screenshots, traces, and maps when user-specific data is involved.
7. Coworx writes only sanitized improvements to shippable framework files.

## Real Action Flow

Coworx can take real non-high-risk Level 3/4 actions when delegated authority or explicit approval covers the exact action class and target.

Examples:

- send a routine message requested by the user;
- reply to an email with user-provided facts;
- schedule a calendar event requested by the user;
- invite attendees named by the user or clearly derived from an approved source;
- submit an internal form with user-provided data;
- publish an internal project update;
- upload approved files to an approved workspace;
- update non-sensitive task-board or CRM fields.

Stage or block if the action is Level 5/protected, authority is unclear, or the target/data differs from the authority packet.

## Learning Loop

After each approved workflow:

1. Save private workflow observations.
2. Extract generic reusable steps.
3. Remove private names, values, links, screenshots, and account identifiers.
4. Update shippable templates or playbooks only with sanitized lessons.
5. Add a regression or smoke test when possible.

## UI Change Review

When a real account workflow appears to have changed, Coworx may compare the current UI with private workflow maps and update the private map after verifying the target. Normal label, layout, selector, tab, or field changes may be handled inside delegated authority.

Before entering privileged workflow information into an external site, app, support chat, prompt, search field, or third-party tool, Coworx must confirm the active directive file authorizes that use, minimize the details, and stage for approval if the information would leave the approved account or local project boundary.
