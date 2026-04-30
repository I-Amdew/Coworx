# Local Credential Persistence

Coworx should preserve autonomy when the user explicitly wants credentials saved for repeated approved workflows. The safe durable route is local-only credential persistence, not chat memory, shippable memory, logs, screenshots, traces, or committed files. Chat may be used only as temporary intake when the user explicitly chooses that path and the task immediately transitions to a fresh chat after local persistence.

## Coworx Credential Memory

Coworx ships with local credential memory for explicitly delegated workflows. That means `scripts/coworx_local_secret_store.mjs`, ignored private secret files, approved keychain/password-manager/vault references, and non-secret credential reference packets. It is not model memory, public project memory, or Chrome's password manager.

When a user asks whether Coworx has a built-in password memory system, answer from the local capability, not from guesswork:

```bash
node scripts/coworx_local_secret_store.mjs status
```

The correct short answer is: Coworx has local credential memory and reference packets for approved workflows; it is not an encrypted cloud password manager unless the route is an OS keychain, password-manager, or vault reference. If the user asks to use Coworx memory, do not save to Chrome instead unless the user explicitly chooses Chrome.

## Rule

When the user explicitly delegates credential persistence for a specific app/site/account label, Coworx may create or update an ignored local secret file under `.coworx-private/secrets/` or store a non-secret reference to a system keychain/password-manager/vault item.

This is allowed only when:

- the target app/site/account label is clear;
- the user explicitly wants the credential saved for future local use;
- the file stays under `.coworx-private/secrets/` or another ignored private secret path;
- file permissions are restricted where the OS supports it;
- secret values are never printed, logged, screenshot, traced, committed, placed in safe memory, or sent to subagents;
- MFA answer values are stored only when explicitly delegated for local runtime handoff on the approved workflow;
- TOTP seeds, backup codes, recovery codes, security answers, cookies, session exports, and payment credentials are not stored this way.

## Preferred Mechanism

Use `scripts/coworx_local_secret_store.mjs` when a local secret file is the right route.

When the user says to save a password, prefer interactive local capture. This prompts on the local machine with hidden input, writes an ignored private secret file, and writes a non-secret credential reference packet for future routing:

```bash
node scripts/coworx_local_secret_store.mjs capture --name example-app --target example.com --account-label example-account
```

The capture command prints only the private file path, reference packet path, and stored key names. It never prints the username, password, or optional secret values. If no TTY is available, use `from-env`, a password manager, OS keychain, or a vault handle instead.

The safest automated path is `from-env`: the user or local environment provides secret values as environment variables, and the script writes them to an ignored `.local.env` file without printing values.

Example:

```bash
node scripts/coworx_local_secret_store.mjs from-env --name example-app --username-env COWORX_EXAMPLE_USERNAME --password-env COWORX_EXAMPLE_PASSWORD
```

This command prints only the output path and key names, never values.

For setup without real values, create a placeholder file:

```bash
node scripts/coworx_local_secret_store.mjs template --name example-app --username-env COWORX_EXAMPLE_USERNAME --password-env COWORX_EXAMPLE_PASSWORD --extra-env COWORX_EXAMPLE_MFA_ANSWERS_JSON
```

## Chat Handling

Coworx should prefer not to ask the user to paste credentials into chat. If the user asks Coworx to save a password, Coworx should prefer interactive local capture, keychain, password manager, vault, or environment-variable flow; if the user explicitly chooses chat intake, use it only for immediate secure transfer. The durable memory is the reference packet, not the secret value.

If the user has already pasted a secret into chat, Coworx should avoid repeating it and should route the value into secure local intake: approved chat-intake transfer, hidden local capture, a local secret file, password manager, keychain, vault handle, connector auth, local skill reference, or environment-variable handoff.

If the user already volunteered a login secret in chat and explicitly authorizes Coworx to save or use it for a clear target, Coworx may perform a one-time secure intake transfer. Prefer `scripts/coworx_local_secret_store.mjs from-stdin --chat-intake true`, `capture`, `from-env`, keychain, password manager, vault, connector auth, or local skill reference. The secret must not appear in responses, logs, commits, reports, screenshots, traces, generated artifacts, or subagent prompts. After intake, produce a non-secret credential reference and continuation prompt, then recommend that the user end this chat and start a new one in the same Coworx project so the active model context no longer contains the pasted secret.

The autonomy goal is that, after the local secret store or keychain reference exists, future approved tasks can proceed through login without asking again, subject to normal target checks, locks, MFA limits, and action-level policy.

Do not mark a credentialed workflow as remembered merely because a model saw a password or MFA value in chat. Remembered credential state requires a non-secret credential packet/reference under `.coworx-private/operator/credential_packets/`, an ignored secret file path, an environment variable name, a keychain/password-manager/vault label, connector auth, or a local skill reference.

## Repeated Workflow Upgrade Prompt

When a workflow repeatedly blocks on the same approved login or manual credential step, Coworx may ask once whether the user wants to configure a local-only credential source for that specific app/site/account label. The prompt should name the workflow, the safe source options, and the stop conditions. It should not ask the user to paste credentials into chat.

If an approved password-manager, browser autofill, keychain, or MFA-manager route fails or stalls once for the same workflow, treat that as enough evidence to offer the upgrade instead of repeatedly trying the same flaky route. The offer should prefer hidden local capture, environment variables, connector auth, keychain/password-manager/vault labels, or an approved local skill reference. Store only the non-secret route reference in memory.

If the user declines, record a private failure or lesson only if useful and do not nag on every run. If the user accepts, use hidden local capture, keychain, password manager, vault, connector auth, browser autofill, or environment variables, then remember only the non-secret reference.

## Remembered Reference

After capture, Coworx remembers only:

- target app or domain;
- account label;
- credential source type;
- ignored private file path, keychain item label, password-manager item label, vault handle, or local skill reference;
- stored key names;
- stop conditions.

Coworx must not remember actual usernames, passwords, MFA values, cookies, tokens, recovery codes, or security answers in safe memory, prompts, reports, screenshots, traces, commits, or chat.

## Runtime Use

Persisting a credential is only useful if Coworx can route it safely during later work. For approved account workflows, Coworx should use a credential source resolver that:

- verifies the active directive, target app/site, account label, and allowed credential source;
- reads values only from the approved ignored private file, environment variables, keychain/password-manager item, browser autofill, OAuth connector, API connector, or vault handle;
- gives secret values only to the local login/autofill executor;
- never sends secret values to subagents or external prompts;
- never prints, logs, screenshots, traces, commits, stores in memory, or reports secret values;
- records only non-secret evidence such as source type, env variable names, private file path, keychain/password-manager item label, vault handle, target, and lock name.

If Computer Use is the executor, it should use the approved app/browser profile, turn off or avoid secret-visible evidence, enter or trigger the credential locally, clear clipboard if used, and resume evidence only after the secret fields are gone.

Computer Use must not type credentials directly from chat text. It should type only non-secret literals through Computer Use itself. Secret fields must be filled by an approved local executor such as `scripts/coworx_type_secret_to_front_app.mjs`, browser/password-manager autofill, keychain/vault flow, connector auth, or user-present manual secure entry.

## Evidence

Allowed evidence:

- secret file path;
- environment variable names;
- keychain/password-manager/vault item label;
- account label;
- target app/site;
- confirmation that values were not printed.

Forbidden evidence:

- actual usernames when private;
- passwords;
- MFA answers;
- recovery codes;
- cookies;
- tokens;
- secret screenshots, traces, videos, or logs.
