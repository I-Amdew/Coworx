# Coworx Ready Check

## Goal
Run a static local check that validates the shippable framework skeleton.

## Command
`node scripts/coworx_ready_check.mjs`

## Pass Criteria
- Required docs/templates exist.
- Coworx skills have required sections.
- Operator request template includes privacy and approval fields.
- Operator and browser lane templates distinguish delegated Level 3/4 authority from Level 5/protected stops.
- Browser Use/Playwright lanes are parallel by default with resource locks; Computer Use uses target-level locks.
- Private memory policy includes private-by-default real-work rules.
- `.gitignore` excludes runtime and private memory paths.
