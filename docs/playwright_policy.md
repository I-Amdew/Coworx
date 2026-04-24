# Playwright Policy

Playwright is the preferred browser-control mode for Coworx because it provides structured page state and repeatable interactions.

## Use For
- public demo sites;
- dashboards with user approval;
- forms in draft-only mode;
- browser QA;
- selector discovery;
- reproducible web workflows.

## Do Not Use For
- credential entry;
- 2FA;
- payments;
- account security changes;
- destructive actions;
- academic submission flows;
- actions outside the requested target.

## Logging
Every Playwright workflow should produce:
- action request;
- action result;
- page/location inspected;
- useful selectors or refs;
- screenshots or traces when useful;
- memory update proposal.
