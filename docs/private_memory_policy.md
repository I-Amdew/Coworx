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
- user-specific capability inventories, plugin availability, connector names, browser profile labels, local app maps, scripts, and fallback lessons;
- course, dashboard, app, document, folder, and output-location maps tied to the user;
- exact user-specific site layouts, selectors, form structures, menu paths, and workflow maps;
- active directive ledgers under `.coworx-private/directives/`;
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

Private local memory may be highly customized. It can record where the user's stuff lives, how to reach approved workflows, which account label or browser profile to use, which plugins or connectors are available, what outputs normally go where, and what prior work established. It still must not contain raw secrets.

Ignored private secret storage is separate from private memory. Raw credential values may exist only in explicitly delegated local secret stores such as `.coworx-private/secrets/*.local.env`, OS keychain, password manager, or encrypted vault handles. Private memory may reference those stores by path or label but must not copy their values.

Private memory belongs in:
- `.coworx-private/`;
- `.coworx-private/directives/`;
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
