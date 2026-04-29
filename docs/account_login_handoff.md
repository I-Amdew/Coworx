# Account Login Handoff

Coworx can work with accounts through credential-safe, user-approved paths and local-only credential handoff.

## Rule

Coworx may use secrets locally, and may persist them only in explicitly delegated ignored private secret storage or approved keychain/password-manager/vault mechanisms. Coworx must not know secrets in shippable memory, safe memory, logs, prompts, screenshots, traces, reports, or committed files. If the user chooses chat credential intake, the current chat is temporary contaminated context and must be replaced after secure local intake.

Coworx prefers not to ask for secrets in chat, but may offer explicit chat credential intake when the user wants that route for a clear target and agrees to restart in a fresh chat after local persistence. Coworx never logs, screenshots, traces, exports, commits, or shares passwords, MFA answers, recovery codes, session cookies, OAuth tokens, API keys, private keys, credit cards, or security answers.

Chat may be used only as an explicit temporary credential intake source. If the user has pasted a secret into chat and authorizes use or persistence for a clear target, Coworx should pause the credential lane, route the value through secure local intake, and remember only a non-secret credential reference. If no secure local path is available, ask the user to complete login manually in the approved app/browser and continue after confirmation.

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

The secret value must never enter logs, repo files, durable memory, screenshots, traces, reports, generated artifacts, or subagent prompts. If it enters chat through explicit intake, move it to local-only persistence and restart from a fresh chat.

When explicitly delegated, Coworx may create or update an ignored private secret file with `scripts/coworx_local_secret_store.mjs` or store a non-secret reference to a keychain/password-manager/vault item. Coworx may enter approved credentials into the approved login form when the credential source is local-only and the target domain/app, account label, authority source, and account workflow lock are confirmed. If no safe local handoff exists, Coworx asks the user to complete login manually and then continues after confirmation.

The login route is remembered only after Coworx writes or verifies a non-secret credential packet/reference, keychain/password-manager/vault label, connector auth, local skill reference, ignored secret file path, or environment variable name. Seeing a credential in chat is only intake state, not remembered state.

If repeated approved work keeps stopping on the same manual login, Coworx may offer to set up local-only credential persistence for that specific workflow. If the user already pasted a secret and explicitly asks to save it, use secure chat intake transfer without echoing the value, then recommend ending this chat and starting a new one in the same project.

Password-manager autofill, OS keychain prompts, and MFA-manager prompts are allowed only as credential-safe routes; they are not guaranteed to work unattended. If one approved attempt fails, stalls, or requires unsupported local approval, Coworx should stop retrying the same route, record a private capability lesson, and continue through the next safe path: existing session, connector/OAuth/API session, approved ignored local secret file, approved environment variables, vault/keychain/password-manager label handled by a local executor, local skill reference, or user-present manual login. Login mechanics are not the deliverable; once access is established, Coworx continues the delegated task.

For local secret files, the robust fallback after a failed System Events paste is reviewed operator paste. Coworx verifies the live target, account/workflow, and field, creates a review packet, uses the local helper to place only the selected secret value on the clipboard, has Computer Use paste into the focused reviewed field, then immediately clears the clipboard. This is still local credential handoff: the model sees packet paths and key names, not values.

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

Unexpected MFA prompts are staged unless the directive names an approved user-present, connector-managed, or local runtime MFA handoff. Do not loop on an MFA-manager failure. TOTP seeds, backup codes, recovery codes, and security answers must never be persisted or copied into evidence.

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
