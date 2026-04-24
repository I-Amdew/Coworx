# Coworx Ready Check

## Goal
Run a static local check that validates the shippable framework skeleton.

## Command
`node scripts/coworx_ready_check.mjs`

## Pass Criteria
- Required docs/templates exist.
- Coworx skills have required sections.
- Operator request template includes privacy and approval fields.
- Private memory policy includes private-by-default real-work rules.
- `.gitignore` excludes runtime and private memory paths.
