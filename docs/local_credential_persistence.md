# Local Credential Persistence

Coworx should preserve autonomy when the user explicitly wants credentials saved for repeated approved workflows. The safe route is local-only credential persistence, not chat memory, shippable memory, logs, screenshots, traces, or committed files.

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

Coworx should not ask the user to paste credentials into chat. If the user asks Coworx to save a password, Coworx should launch or instruct the interactive local capture, keychain, password manager, vault, or environment-variable flow. The durable memory is the reference packet, not the secret value.

If the user has already pasted a secret into chat, Coworx should avoid repeating it and should route the user toward a local secret file, password manager, keychain, vault handle, or environment-variable handoff.

If the user already volunteered a login secret in chat and explicitly asks Coworx to save or use it, Coworx may perform a one-time transfer into approved local-only secret persistence without echoing the value. Prefer a local environment, keychain, password manager, vault, or private file handoff when available. The secret must not appear in responses, logs, commits, reports, screenshots, traces, generated artifacts, or subagent prompts.

The autonomy goal is that, after the local secret store or keychain reference exists, future approved tasks can proceed through login without asking again, subject to normal target checks, locks, MFA limits, and action-level policy.

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
