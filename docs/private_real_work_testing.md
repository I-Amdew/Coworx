# Private Real Work Testing

Coworx improves by doing real tasks, but real tests must be isolated from the shippable framework.

## Rule

Real workflow testing belongs in ignored private paths and, when useful, on a testing branch.

Before testing real accounts or apps, record the user's approved scope, authority source, privacy class, and stop conditions.

## Branch

Use a temporary development branch when testing framework changes:

```bash
git switch -c codex-coworx-real-work-testing
```

Do not merge private artifacts. Merge only sanitized framework improvements.

## Credential-Safe Access

Coworx must not retrieve login information from skills, files, browser storage, password managers, old logs, or any other source.

Use approved credential-safe access: user-controlled login, approved session, dedicated browser profile, connector, OAuth, keychain/password-manager prompt, API credential stored outside the repo, or vault handle.

## Allowed Private Tests

- Summarize a signed-in dashboard.
- Draft or send a routine message when delegated.
- Draft, create, or invite to a calendar event when delegated.
- Create a local report from user-approved account data.
- Map a workflow for future use.
- Move or organize local files when approved.
- Create slides, documents, or spreadsheets from approved source material.

## Authority Required

Non-high-risk Level 3/4 actions require delegated authority or explicit approval.

Stage or block:

- unclear authority;
- unclear target/account/recipient/data;
- Level 5/protected actions;
- sending sensitive personal data to new recipients;
- payment, purchase, account security, legal, medical, financial, identity, academic submission, or irreversible production actions.

## Private Storage

Use:

- `.coworx-private/`
- `runs/private/`
- `outputs/private/`
- `memory/private/`
- `operator/screenshots/private/`
- `operator/traces/private/`

Do not store private test artifacts in shippable paths.

## Sanitization Before Ship

Before committing framework improvements:

1. Review `git status --short`.
2. Confirm no ignored private files are being forced into git.
3. Search for names, emails, account IDs, message bodies, meeting details, dashboard values, screenshots, traces, cookies, tokens, and credentials.
4. Convert useful lessons into generic templates or playbooks.
5. Commit only sanitized framework files.
