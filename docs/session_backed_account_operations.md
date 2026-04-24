# Session-Backed Account Operations

Coworx can work in real browsers and real accounts by using sessions the user controls.

## Principle
Coworx learns workflows, not credentials.

It may learn:
- which app or site is used for a workflow;
- where important pages live;
- which selectors, tabs, views, and buttons matter;
- what the user's normal process is;
- which data belongs in private memory;
- where the approval boundaries are;
- what worked and what failed.

It must not learn or store:
- passwords;
- 2FA codes;
- recovery codes;
- session cookies;
- OAuth tokens;
- API keys;
- password-manager entries;
- security questions;
- private keys;
- payment credentials.

## Real Browser Flow
1. User approves the target account, site, and task.
2. User signs in manually in the approved browser or app.
3. Coworx confirms it is on the intended target.
4. Coworx creates an Operator lease.
5. Coworx performs the approved read-only, draft-only, or action-approved workflow.
6. Coworx writes private logs, screenshots, traces, and maps.
7. Coworx writes only sanitized improvements to shippable framework files.

## Real Action Flow
Coworx can take real actions when the user approves the exact action at action time.

Examples requiring action-time approval:
- send a message;
- reply to an email;
- schedule a calendar event;
- invite attendees;
- submit a form;
- publish a post;
- upload a file;
- move, archive, or delete cloud data;
- change permissions;
- deploy, merge, or change settings.

The approval must include:
- target app/account;
- exact action;
- data to transmit or modify;
- recipient, calendar, folder, or destination;
- expiration or one-time scope;
- prohibited actions.

## Learning Loop
After each approved workflow:
1. Save private workflow observations.
2. Extract generic reusable steps.
3. Remove private names, values, links, screenshots, and account identifiers.
4. Update shippable templates or playbooks only with sanitized lessons.
5. Add a regression or smoke test when possible.

## Why This Gets Smarter
Coworx improves from:
- better app maps;
- known stop conditions;
- stable selectors;
- successful drafts and output formats;
- reusable task decomposition;
- safer approval patterns;
- remembered user preferences stored privately.

This gives the same practical effect as a coworker learning how the user works, without turning credentials into project memory.
