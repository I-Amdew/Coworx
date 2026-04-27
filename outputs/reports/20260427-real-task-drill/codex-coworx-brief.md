# Codex Coworx Drill Brief

## Result

Coworx created this brief from local source notes, staged an upload handoff, wrote a standby notification, and verified the output paths.

## Key Decisions

1. Use connectors and MCP tools first when they can finish the task.
2. Use Playwright Interactive for persistent signed-in browser workflows.
3. Use Computer Use for real GUI surfaces like file pickers, native apps, password-manager prompts, and visual confirmation.
4. Keep Standby active through local inbox and outbox adapters.

## Evidence

- Source notes: outputs/reports/20260427-real-task-drill/source-notes.md
- Brief artifact: outputs/reports/20260427-real-task-drill/codex-coworx-brief.md
- Upload stage packet: outputs/reports/20260427-real-task-drill/upload-stage.json
- Standby outbox: outputs/reports/20260427-real-task-drill/standby-outbox.ndjson

## Source Summary

- Codex Coworx should produce artifacts, not only instructions.
- Computer Use should handle real GUI surfaces when structured tools cannot finish.
- Playwright Interactive is preferred for persistent signed-in browser work.
- Standby needs an outbox, an inbox, and clear permission classes.
