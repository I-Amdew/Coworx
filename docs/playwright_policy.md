# Playwright Policy

Use Browser Use for Codex in-app/current/local/file-backed/public browser targets. Use Playwright for repeatable structured checks, browser QA, selector discovery, and approved isolated browser profiles. Use Playwright Interactive when the workflow needs a persistent browser session, repeated live interaction, stable handles, or long authenticated browser work where Browser Use would repeatedly prompt or lose useful state.

## Use For

- public demo sites;
- localhost route testing;
- screenshots and traces;
- browser QA;
- selector discovery;
- reproducible web workflows;
- approved dashboards or account workflows when an isolated profile or connector-safe flow exists.
- persistent signed-in browser workflows through Playwright Interactive when approved profile and credential boundaries are clear.

## Parallelism

Playwright lanes are parallel by default. Lock only shared write or commit targets.

Use separate output paths for screenshots, traces, logs, and private artifacts.

## Credential Rules

For credentialed browser work, prefer official connectors/API first when available. Prefer Playwright with an isolated approved browser profile, local environment variables, or ignored private secret files when technically available.

For long signed-in work, prefer Playwright Interactive with an approved persistent profile over Browser Use when it reduces repeated permissions and preserves state. If Playwright cannot access the real browser profile or a native prompt/file picker is needed, escalate to Computer Use with the browser profile, file picker, active window, and account workflow locks.

Playwright may use approved local credential handoff for the approved target, but it must not put secret values in command-line arguments, traces, videos, screenshots, logs, prompts, reports, or storage committed to the repo. Prefer environment variables or ignored local files read inside the script. Disable or redact traces, videos, and screenshots during secret entry. Store browser state only in ignored private paths. Do not commit storage state. Do not export cookies.

Use resource locks for account workflows. Verify the target domain before login. Stop if the page redirects to an unexpected domain or security flow.

## Stop Conditions

Stop on:

- credential or MFA prompts not covered by approved local handoff;
- payment;
- account security;
- account recovery;
- password change;
- unexpected domain redirect;
- identity verification;
- destructive actions outside authority;
- academic submission flows;
- wrong target;
- external commitments outside delegated authority or explicit approval.

## Logging

Every Playwright workflow should produce:

- action request;
- action result;
- page/location inspected;
- useful selectors or refs;
- screenshots or traces when useful;
- resource locks used;
- memory update proposal.
