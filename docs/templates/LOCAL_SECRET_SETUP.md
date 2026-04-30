# Local Secret Setup

Use this template only with placeholders in shippable docs. Do not commit real credentials.

Coworx can read approved local secrets at runtime from ignored private files under `.coworx-private/secrets/` or from environment variables. When the user explicitly delegates credential persistence, Coworx may create or update those ignored private files or a keychain/password-manager/vault reference. Secret values must never appear in prompts, logs, traces, screenshots, docs, config templates, reports, memory, or generated artifacts.

Check the shipped Coworx credential-memory capability with:

```bash
node scripts/coworx_local_secret_store.mjs status
```

This reports only capability and path metadata. It does not print secret values.

## Example Private File

Create an ignored local file such as:

```txt
.coworx-private/secrets/example_app.local.env
```

Placeholder content only:

```bash
COWORX_EXAMPLE_USERNAME="replace_me"
COWORX_EXAMPLE_PASSWORD="replace_me"
COWORX_EXAMPLE_MFA_ANSWERS_JSON='["replace_me_if_applicable"]'
```

Or create a placeholder with the helper:

```bash
node scripts/coworx_local_secret_store.mjs template --name example-app --username-env COWORX_EXAMPLE_USERNAME --password-env COWORX_EXAMPLE_PASSWORD --extra-env COWORX_EXAMPLE_MFA_ANSWERS_JSON
```

To securely save a password through hidden local input:

```bash
node scripts/coworx_local_secret_store.mjs capture --name example-app --target example.com --account-label example-account
```

The command stores values under `.coworx-private/secrets/`, creates a non-secret credential reference packet, and prints only paths and key names.

If a secret was already pasted into chat with explicit user approval for a clear target, use chat only as temporary intake. Stage secure chat intake transfer, hidden capture, or another approved local transfer path, then recommend ending the chat and starting a new one in the same project. Remember only the non-secret credential packet/reference.

To persist values from an already-private local environment without printing values:

```bash
node scripts/coworx_local_secret_store.mjs from-env --name example-app --username-env COWORX_EXAMPLE_USERNAME --password-env COWORX_EXAMPLE_PASSWORD --extra-env COWORX_EXAMPLE_MFA_ANSWERS_JSON
```

## Rules

- Keep the file under `.coworx-private/secrets/`.
- Do not copy values into chat.
- Do not pass secret values as command-line arguments.
- Use hidden local capture, environment variables, keychain, password manager, or vault handles for real values.
- Scripts should read variables locally at runtime.
- Disable or redact screenshots, videos, and traces while secrets are visible.
- Store MFA answer values only when the user explicitly delegates that local runtime handoff for the approved workflow, and keep them only in ignored private secret storage or environment variables.
- Do not store TOTP seeds, backup codes, recovery codes, or security answers in local secret files.
- Stage unexpected MFA prompts. Use user-present MFA or an approved connector-managed MFA flow when local runtime MFA handoff is not explicitly delegated.
- Store browser profiles and session state only in ignored private paths.
- Disable raw traces, videos, and screenshots during secret entry. If accidental raw artifacts are created, keep them in ignored private paths only until they are redacted or deleted; never use raw secret-visible artifacts as evidence.
