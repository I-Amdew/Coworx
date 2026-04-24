# Account Login Handoff

Coworx can work with accounts only through credential-safe, user-approved paths.

## Rule

Coworx never asks for, stores, logs, screenshots, exports, or shares passwords, 2FA codes, recovery codes, session cookies, OAuth tokens, API keys, private keys, credit cards, or security answers.

## Allowed Credential-Safe Paths

- user-controlled manual login;
- existing approved signed-in browser session;
- dedicated Coworx browser profile;
- password-manager autofill controlled by the user or secure local prompt;
- OS keychain prompt;
- OAuth/app connector;
- API connector or token stored outside the repo;
- encrypted vault handle.

The secret value must never enter chat, logs, repo files, memory, screenshots, or subagent prompts.

## Allowed After Login Or Connector Authorization

- read approved pages;
- summarize dashboards;
- draft messages, documents, forms, or calendar details;
- create reversible external drafts or objects when delegated;
- execute non-high-risk Level 3/4 actions when delegated or explicitly approved;
- map workflows;
- capture safe selectors and landmarks;
- save safe app maps and workflow maps.

## Stage Or Block

Stage when:

- target account/app is unclear;
- authority does not cover the external action;
- recipients, destination, files, or data are uncertain;
- data sensitivity is unclear.

Block or require the user to act manually on credentials, account security, recovery, payment, identity verification, academic submission, and other Level 5/protected actions.

## Memory

Store:

- where login starts;
- approved account label;
- credential-safe method type;
- password manager item name or vault handle, not the secret;
- OAuth connector name;
- post-login page locations;
- safe workflows;
- approval-required workflows;
- stop conditions.

Do not store raw credentials, cookies, tokens, browser profile files, session files, security answers, payment details, or private account data in shippable memory.

Real account maps are private by default and belong in ignored paths unless sanitized for the blank framework.
