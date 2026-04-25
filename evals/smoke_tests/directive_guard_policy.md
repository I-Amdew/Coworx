# Directive Guard Policy Smoke Test

Goal: verify that Coworx keeps active directive state in a private project file and checks proposed actions against it before acting.

## Setup

Run:

```bash
node scripts/coworx_directive_guard.mjs demo-test
```

## Expected Result

- A temporary ledger is created under `.coworx-private/directives/`.
- A matching low-risk action passes.
- A mismatched target action fails.
- A privileged workflow-info action without review fails.
- No secrets are printed.
