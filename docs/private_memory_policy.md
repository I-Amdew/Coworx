# Private Memory Policy

Coworx has two memory classes.

## Shippable Memory
Shippable memory is safe to commit:
- templates;
- generic examples;
- public demo maps;
- no-login local smoke tests;
- general safety rules;
- generic playbooks.

## Private Local Memory
Private local memory is not for commits:
- real account maps;
- user-specific workflows;
- screenshots from user apps;
- meeting notes;
- message drafts;
- calendar details;
- logs from real tasks;
- local app maps containing private context.

Private by default applies to any task involving:
- signed-in accounts;
- real user data;
- meetings, transcripts, messages, or calendars;
- private dashboards or business metrics;
- screenshots or traces from real apps;
- cloud documents, cloud drafts, or uploads;
- user-specific workflows or account maps.

Private memory belongs in:
- `.coworx-private/`;
- `memory/private/`;
- files ending in `.private.md`;
- `outputs/private/`;
- private screenshot/trace folders.

These paths are ignored by `.gitignore`.

## Sanitizing For Submission
Before committing or publishing Coworx:
1. Remove private logs and screenshots.
2. Replace user-specific app maps with templates.
3. Verify no credentials or tokens are present.
4. Verify no private names, emails, meeting details, or account data are present.
5. Run the review checklist.

## Sanitization Checklist
- No private names, emails, phone numbers, account IDs, or precise personal details.
- No message bodies, meeting contents, calendar details, or dashboard values from real accounts.
- No screenshots, traces, copied page text, filenames, or selectors that reveal private account structure unless sanitized.
- No credentials, tokens, cookies, 2FA codes, recovery codes, private keys, or payment data.
- No hidden private artifacts in `runs/`, `outputs/`, `operator/`, or `memory/`.
