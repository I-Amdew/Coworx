# Calculator App Map

## Purpose
Harmless local app for validating Computer Use readiness.

## Access
Local macOS Calculator. No account required.

## Common Areas
- Keypad: number and operation buttons.
- Result display: standard input/result scroll areas.

## Safe Actions
- Clear current value.
- Enter simple arithmetic.
- Observe result.

## Approval-Required Actions
None for simple local arithmetic. Any attempt to use another app or system setting requires a new action request.

## Stop Conditions
- Wrong app is active.
- Permission prompt appears.
- Account, credential, payment, security, or private-data prompt appears.
- Task asks for non-Calculator action.

## Learned Workflows
- Readiness check:
  1. Get Calculator app state.
  2. Click clear.
  3. Enter `2 + 3 =`.
  4. Confirm result is `5`.
