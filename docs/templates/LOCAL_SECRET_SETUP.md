# Local Secret Setup

Use this template only with placeholders in shippable docs. Do not commit real credentials.

Coworx can read approved local secrets at runtime from ignored private files under `.coworx-private/secrets/` or from environment variables. When the user explicitly delegates credential persistence, Coworx may create or update those ignored private files or a keychain/password-manager/vault reference. Secret values must never appear in prompts, logs, traces, screenshots, docs, config templates, reports, memory, or generated artifacts.

## Example Private File

Create an ignored local file such as:

```txt
.coworx-private/secrets/example_app.local.env
```

Placeholder content only:

```bash
COWORX_EXAMPLE_USERNAME="replace_me"
COWORX_EXAMPLE_PASSWORD="replace_me"
```

Or create a placeholder with the helper:

```bash
node scripts/coworx_local_secret_store.mjs template --name example-app --username-env COWORX_EXAMPLE_USERNAME --password-env COWORX_EXAMPLE_PASSWORD
```

To persist values from an already-private local environment without printing values:

```bash
node scripts/coworx_local_secret_store.mjs from-env --name example-app --username-env COWORX_EXAMPLE_USERNAME --password-env COWORX_EXAMPLE_PASSWORD
```

## Rules

- Keep the file under `.coworx-private/secrets/`.
- Do not copy values into chat.
- Do not pass secret values as command-line arguments.
- Scripts should read variables locally at runtime.
- Disable or redact screenshots, videos, and traces while secrets are visible.
- Do not store MFA answers, TOTP seeds, backup codes, recovery codes, or security answers in local secret files.
- Use user-present MFA or an approved connector-managed MFA flow.
- Store browser profiles and session state only in ignored private paths.
- Disable raw traces, videos, and screenshots during secret entry. If accidental raw artifacts are created, keep them in ignored private paths only until they are redacted or deleted; never use raw secret-visible artifacts as evidence.
