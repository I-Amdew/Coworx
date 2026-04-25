# Account Login Handoff

Coworx can work with accounts through credential-safe, user-approved paths and local-only credential handoff.

## Rule

Coworx may use secrets locally, and may persist them only in explicitly delegated ignored private secret storage or approved keychain/password-manager/vault mechanisms. Coworx must not know secrets in shippable memory, safe memory, chat memory, logs, prompts, screenshots, traces, reports, or committed files.

Coworx never asks for secrets in chat and never logs, screenshots, traces, exports, commits, or shares passwords, MFA answers, recovery codes, session cookies, OAuth tokens, API keys, private keys, credit cards, or security answers.

## Allowed Credential-Safe Paths

- user-controlled manual login;
- existing approved signed-in browser session;
- dedicated Coworx browser profile;
- password-manager autofill controlled by the user or secure local prompt;
- OS keychain prompt;
- approved ignored local secret file under `.coworx-private/secrets/`;
- approved environment variables;
- OAuth/app connector;
- API connector or token stored outside the repo;
- encrypted vault handle.

The secret value must never enter chat, logs, repo files, memory, screenshots, traces, reports, generated artifacts, or subagent prompts.

When explicitly delegated, Coworx may create or update an ignored private secret file with `scripts/coworx_local_secret_store.mjs` or store a non-secret reference to a keychain/password-manager/vault item. Coworx may enter approved credentials into the approved login form when the credential source is local-only and the target domain/app, account label, authority source, and account workflow lock are confirmed. If no safe local handoff exists, Coworx asks the user to complete login manually and then continues after confirmation.

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

Block or require the user to act manually on credential export, cookie export, token export, password changes, account recovery, recovery code handling, security setting changes, payment credential changes, identity verification, suspicious login pages, wrong-domain login pages, academic submission, and other Level 5/protected actions.

## Memory

Store:

- where login starts;
- approved account label;
- credential-safe method type;
- password manager item name or vault handle, not the secret;
- OAuth connector name;
- local environment variable names, not values;
- ignored secret file path, not contents;
- post-login page locations;
- safe workflows;
- approval-required workflows;
- stop conditions.

Do not store raw credentials, cookies, tokens, browser profile files, session files, security answers, payment details, or private account data in shippable memory. Raw login credentials belong only in explicitly delegated ignored private secret stores or approved keychain/password-manager/vault mechanisms.

Real account maps are private by default and belong in ignored paths unless sanitized for the blank framework.
