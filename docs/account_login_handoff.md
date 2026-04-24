# Account Login Handoff

Coworx can work with accounts only through user-controlled login.

## Rule
The user signs in. Coworx never asks for, stores, or enters passwords, 2FA codes, recovery codes, session cookies, tokens, or private keys.

## Allowed After Manual Login
- read approved pages;
- summarize dashboards;
- draft messages, documents, forms, or calendar details;
- map workflows;
- capture safe selectors and page landmarks;
- save safe app maps and workflow maps.

## Approval Required At Action Time
- send or reply to a message;
- submit a form;
- schedule or edit a meeting;
- invite someone;
- publish or post content;
- change permissions;
- upload or transmit sensitive data;
- delete, archive, or move cloud data when the action is destructive or externally visible.

Approval must name the exact account/app, target, data allowed, action allowed, output destination, and expiration. Vague permission to "use my account" is not enough for external actions.

## Memory
Store:
- where login starts;
- whether manual login is required;
- post-login page locations;
- safe read-only workflows;
- approval-required workflows;
- stop conditions.

Do not store:
- credentials;
- 2FA or recovery codes;
- cookies;
- tokens;
- security answers;
- payment details.

Real account maps are private by default and belong in ignored paths unless sanitized for a blank framework.

## Login Mapping Template
1. User approves target account and signs in manually.
2. Operator confirms target and action level.
3. Coworx maps only the approved workflow.
4. Coworx writes safe memory.
5. Coworx stops before external commitments unless the user approves the exact action.
