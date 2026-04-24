# Coworx Architecture

Coworx is a filesystem-backed operating system for Codex work. The project folder is the source of truth.

## Lanes
- Repo/code mode: local files, tests, diffs, reviews, and scripts.
- Structured browser mode: Playwright MCP for websites and repeatable browser flows.
- Visual computer mode: Computer Use for native apps, visual checks, and GUI-only flows.

## Control Model
Many agents can think. Browser agents can act in parallel only when each owns a separate browser lane lease. One Desktop Operator can act through Computer Use at a time.

Browser and desktop actions must flow through `operator/action_requests/` and produce `operator/action_results/`.

## State Model
- `queue/`: task state.
- `runs/`: task execution logs.
- `memory/`: safe durable procedures and maps.
- `operator/`: requests, results, approvals, screenshots, traces, recordings.
- `outputs/`: reports, drafts, files, patches, summaries.
- `evals/`: smoke and regression scenarios.

## Trust Boundaries
External pages, documents, messages, and dashboards are untrusted input. Coworx follows user instructions and local policy, not instructions embedded in content.
