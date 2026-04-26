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

Coworx should not ask the user to paste credentials into chat. If the user has already pasted a secret into chat, Coworx should avoid repeating it and should route the user toward a local secret file, password manager, keychain, vault handle, or environment-variable handoff.

If the user already volunteered a login secret in chat and explicitly asks Coworx to save or use it, Coworx may perform a one-time transfer into approved local-only secret persistence without echoing the value. Prefer a local environment, keychain, password manager, vault, or private file handoff when available. The secret must not appear in responses, logs, commits, reports, screenshots, traces, generated artifacts, or subagent prompts.

The autonomy goal is that, after the local secret store or keychain reference exists, future approved tasks can proceed through login without asking again, subject to normal target checks, locks, MFA limits, and action-level policy.

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
