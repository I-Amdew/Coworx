# Credential Handoff Protocol

Coworx may use secrets locally, and may persist them only in explicitly delegated ignored private secret storage or approved keychain/password-manager/vault mechanisms. Coworx must not know secrets in shippable memory, safe memory, chat memory, logs, prompts, screenshots, traces, reports, or committed files.

This local-only credential handoff protocol applies to any approved app, website, browser workflow, desktop workflow, connector, API, or account system. It permits credentialed login when the target, account label, credential source, authority, and resource locks are approved. It forbids exposing, storing, logging, screenshotting, tracing, exporting, or committing secret values.

## Core Rule

Coworx may use approved credentials locally to log into an approved target app/site/account workflow. Coworx must not put real credential values into prompts, repo files, docs, config templates, logs, traces, screenshots, reports, generated artifacts, safe memory, chat memory, or subagent messages.

Use placeholders in shippable material. Use ignored private files, environment variables, password managers, keychains, approved sessions, connectors, or vault handles for real local handoff.

Chat is not a credential source. Coworx must not ask for passwords or MFA answers in chat, and must not type chat-pasted credentials into a login form. If a secret is pasted into chat, pause the credential lane and route to secure local capture, approved local transfer, connector/session auth, or user-present manual secure entry.

## Supported Handoff Cases

### A. Already Signed-In Session

Coworx can continue normally inside delegated authority when the approved target is already signed in.

Examples:

- existing approved browser profile;
- existing approved desktop app session;
- existing approved connector session;
- existing approved API session.

Record only the non-secret session label, account label, target, authority source, locks, and stop conditions.

### B. Password Manager, Browser Autofill, Or OS Keychain

Coworx may trigger an approved autofill, password-manager, or keychain flow when it is scoped to the approved target.

Coworx must not reveal, copy, log, screenshot, export, or store the secret. If the secure prompt requires the user to approve, unlock, or complete MFA, Coworx waits for the user-controlled step or approved connector-managed flow and continues after the session is active.

When Computer Use is available, approved autofill and keychain prompts are normal execution routes for real account work. Coworx should verify the target app/domain, disable or avoid secret-visible evidence, acquire the app/profile/account lock, trigger the local autofill or keychain flow, and continue after the session is active. It should not stop with instructions merely because the route uses a real browser profile or password manager.

Autofill, password-manager unlock, OS keychain, and MFA-manager behavior is not reliable enough to be the only unattended plan. If one approved attempt fails, stalls, or requires an unsupported local approval, Coworx should stop retrying that same route, record a private capability lesson, release GUI locks when safe, and use the next approved handoff route: existing session, connector/OAuth/API session, local-only secret source, local skill reference, vault/keychain/password-manager label handled by a local executor, or user-present manual secure entry.

### C. Local-Only Secret File Or Environment Variable

Coworx may use credentials from an ignored local file under `.coworx-private/secrets/` or from environment variables. When the user explicitly delegates credential persistence for a clear app/site/account label, Coworx may also create or update that ignored local secret file using `scripts/coworx_local_secret_store.mjs`, an approved keychain/password-manager/vault route, or another approved local-only mechanism.

If the user says to save a password, the preferred local-file route is `scripts/coworx_local_secret_store.mjs capture`. It prompts for values locally with hidden terminal input, writes a `.local.env` file under `.coworx-private/secrets/`, and creates a non-secret credential reference packet. The secret value must not be put in chat, prompts, reports, logs, screenshots, traces, or committed files.

If the user already pasted a secret into chat, Coworx must not use that chat value directly for login. It should stage secure capture or approved local transfer, then remember only the non-secret credential reference packet. Afterward, Coworx should recommend ending the current chat and starting a new one in the same Coworx project because the active context may still contain the pasted secret even though durable storage is now local-only.

Rules:

- the secret file must never be committed;
- values must never be printed;
- values must never be copied into safe memory, chat memory, prompts, reports, or subagent messages;
- values must never appear in logs, traces, screenshots, reports, docs, prompts, or generated artifacts;
- command examples may reference variable names but not values;
- scripts must read secrets locally at runtime;
- secret values must not be passed through command-line arguments;
- raw screenshots, videos, and traces during secret entry must be disabled. If accidental raw artifacts are produced, keep them in ignored private paths only until they are redacted or deleted; never use raw secret-visible artifacts as evidence.
- MFA answer values may be used only through explicitly delegated local runtime handoff for the approved workflow, and must stay in ignored private secret storage or environment variables. TOTP seeds, backup codes, recovery codes, and security answers must not be stored in local secret files or environment variables.

Runtime use of local secret files requires a credential source resolver. The resolver may read only the named approved private file or environment variables for the approved target, and it must pass secret values directly to the local login/autofill executor without printing them, placing them in command-line arguments, sending them to subagents, or writing them to logs, events, status files, reports, screenshots, traces, or prompts. Evidence may name the resolver, target, account label, env variable names, or private file path, but never the values.

Credentialed login through Computer Use must use the resolver or another approved local executor when secret fields need typing. Computer Use may navigate, focus fields, and verify UI state, but it must not type secret values sourced from chat.

### D. Approved Local Credential Source Reference

Sometimes the user's existing setup already has a private local credential source, such as a local skill file, password-manager handle, keychain item, vault handle, or connector-managed auth record. Coworx may save a private credential packet that references that source without copying the secret into Coworx.

Rules:

- the reference must be local, user approved, and scoped to the target account workflow;
- the packet may contain the source label or local source path, but not the secret values;
- the source must be read only by the local executor at runtime;
- the executor must verify the approved domain or app before using the credential source;
- if the source file itself contains secrets, do not copy its contents into route memory, shippable docs, logs, prompts, reports, screenshots, traces, or subagent messages;
- if the source is missing, stale, or on the wrong domain, stop and stage for the user instead of guessing.

Use this pattern for migration from another local agent's credentialed workflow into Coworx: preserve the route, locks, domain checks, and stop conditions, then create a private source-reference packet.

### E. User-Present Manual Secure Entry

If no safe local handoff exists, Coworx pauses and asks the user to complete login manually in the approved app/browser. Coworx then continues after the user confirms the session is signed in.

Manual secure entry is a checkpoint, not a final answer. Once the user completes the local step or an existing session is active, Coworx should continue the delegated workflow until the directive completes, is staged, or hits a real stop condition.

### F. Unsupported Or Unsafe Credential Handling

Coworx must pause or block:

- credential export;
- cookie export;
- token export;
- password changes;
- account recovery;
- recovery code handling;
- unexpected MFA prompts outside approved local runtime handoff;
- stored TOTP seeds, backup codes, recovery codes, or security answers;
- security setting changes;
- payment credential changes;
- identity verification flows;
- suspicious or unexpected login pages;
- wrong-domain or wrong-app login pages.

## Required Checks Before Local Credential Entry

1. Confirm the approved site/app.
2. Confirm the approved account label.
3. Confirm the approved credential source.
4. Confirm the login page target and domain/app identity.
5. Disable or avoid secret-visible screenshots, videos, and traces.
6. Acquire the account workflow lock.
7. Enter credentials locally from the approved source, never from chat memory.
8. Clear the clipboard if used.
9. Resume evidence collection only after secrets are no longer visible.

Use this deterministic fallback order for approved account workflows: existing signed-in session, connector/OAuth/API session, approved autofill/password-manager/keychain route, approved local-only secret source or local skill reference, user-present manual secure entry, then a staged blocker naming the exact missing setup. Do not ask the user to paste secrets into chat and do not send secret values to subagents.

For unattended or standby work, these checks must be in the Operator action request before the cycle begins. A later remote `approve` reply may authorize only the pending non-protected action already recorded in the directive ledger; it may not authorize a new credential source, a new domain, credential export, recovery flow, security setting, payment prompt, or identity verification.

## Evidence Rules

Allowed evidence:

- target URL or app name after login;
- account label, not account secret;
- non-secret session/profile/connector/vault handle label;
- lock name;
- action result;
- redacted screenshot after secrets are no longer visible;
- command names and variable names, not values.

Forbidden evidence:

- username values when private;
- passwords;
- MFA answers;
- recovery codes;
- cookies;
- tokens;
- private keys;
- raw auth headers;
- QR codes;
- screenshots of filled secret fields;
- traces/videos showing secret entry.

## Protected Final Actions

Credentialed login does not authorize protected final actions by itself.

Coworx may draft, fill, organize, prepare, attach approved files, save drafts, reach a final review page, and produce a ready-for-user-review report.

Coworx must stage protected final actions unless a specific grant safely covers them, and some remain manual. Protected final actions include purchases, payments, contracts, legal filings, medical actions, financial transfers, account security changes, password changes, identity verification, high-impact employment actions, academic evaluation submissions, destructive deletion, production deployment without a deployment grant, and public publishing without a publishing grant.
