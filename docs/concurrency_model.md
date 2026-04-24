# Concurrency Model

Coworx separates thinking work, browser work, and desktop work.

## Parallel Thinking
Subagents may run planning, research, review, drafting, file generation, and verification in parallel when their scopes do not overlap.

## Parallel Browser Lanes
Browser work can run in parallel when each lane has:
- a separate browser tab or session;
- a browser lane lease;
- a distinct target app/site/workflow;
- its own private output path;
- explicit stop conditions;
- no shared final-action boundary.

Use Browser Use for in-app browser targets and Playwright for repeatable structured checks. Browser lanes are appropriate for:
- researching public pages;
- inspecting separate dashboards;
- drafting in separate browser apps;
- checking independent web workflows;
- reading multiple approved sources.

Do not let two browser agents control the same tab, same form, same account workflow, or same final send/submit boundary.

## Single Desktop Lane
Computer Use is single-lane by default. It controls the actual desktop, which means one screen, one mouse, one keyboard, one clipboard, one active window, and one focused app.

Only one Desktop Operator may use Computer Use at a time unless the current Codex runtime explicitly provides isolated independent desktop sessions.

Use Computer Use for:
- native Mac apps;
- GUI-only workflows;
- apps without plugins or browser APIs;
- visual checks;
- multi-app desktop flows.

## Coordinator Responsibilities
The Coordinator must:
- assign non-overlapping browser lanes;
- keep Computer Use serialized;
- pause all lanes at external action boundaries;
- collect results before final reporting;
- route private real-account artifacts to ignored private paths.

## Practical Pattern
Run many browser/research/drafting lanes in parallel, then queue one desktop operation when a task needs the actual computer.
