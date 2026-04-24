# Playwright Policy

Use Browser Use for Codex in-app/current/local/file-backed/public browser targets. Use Playwright for repeatable structured checks, browser QA, selector discovery, and approved isolated browser profiles.

## Use For

- public demo sites;
- localhost route testing;
- screenshots and traces;
- browser QA;
- selector discovery;
- reproducible web workflows;
- approved dashboards or account workflows when an isolated profile or connector-safe flow exists.

## Parallelism

Playwright lanes are parallel by default. Lock only shared write or commit targets.

Use separate output paths for screenshots, traces, logs, and private artifacts.

## Credential Rules

Do not use Playwright to enter credentials, bypass 2FA, export cookies, copy profile data, or expose tokens. For credentialed work, prefer official API/app connectors, MCP/plugin integrations, approved isolated profiles, or Computer Use with a real approved browser/profile when GUI operation is necessary.

## Stop Conditions

Stop on:

- credential or 2FA prompts;
- payment;
- account security;
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
