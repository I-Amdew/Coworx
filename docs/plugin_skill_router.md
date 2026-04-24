# Plugin And Skill Router

Coworx uses installed Codex skills, plugins, MCP tools, and app connectors as its capability layer.

## Routing Algorithm
1. Read the task and classify the action level.
2. Identify the work type: browser, native app, file, document, spreadsheet, presentation, design, GitHub, media, automation, research, coding, review, or mixed.
3. Prefer an installed skill or plugin built for that work type.
4. If browser work is needed, prefer Browser Use for in-app browser targets and Playwright for repeatable structured automation.
5. If desktop work is needed, use Computer Use through the Operator lane.
6. If multiple independent subtasks exist, assign subagents for planning, research, review, memory, and bounded implementation.
7. Record tool choice, action level, approvals, and evidence in the run log.

## Installed Capability Examples
- Browser Use: in-app browser automation.
- Computer Use: Mac app control.
- GitHub: repositories, issues, pull requests, CI.
- Figma: design context and Figma file operations.
- Documents: DOCX creation and editing.
- Spreadsheets: XLSX/CSV analysis and generation.
- Presentations: PPTX slide decks.
- Playwright: structured browser automation and screenshots.
- PDF, image, speech, transcription, and media skills when installed.

## Non-Coding Routing Table
| Work type | Primary route | Fallback | Approval notes |
|---|---|---|---|
| Meeting audio/video | Transcribe skill | Local notes parsing | Draft summaries are Level 1; sending follow-ups is Level 4. |
| DOCX/report | Documents plugin | `doc` skill | Local file creation is Level 2. |
| Slides | Presentations plugin | local outline draft | Local deck creation is Level 2. |
| Spreadsheet | Spreadsheets plugin | CSV/local script | Local workbook creation is Level 2. |
| PDF | PDF skill | local extraction/render tools | Keep sensitive PDFs in private memory/output paths. |
| Browser task | Browser Use for in-app/current/local targets | Playwright for repeatable structured automation | Signed-in pages default to read-only/draft-only. |
| Native app task | Computer Use | Screenshot skill for read-only evidence | One Operator only; stop at permission/sensitive prompts. |
| GitHub | GitHub plugin skills | `gh-*` standalone skills | Comments, PRs, merges, and settings follow action levels. |
| Figma/design | Figma plugin and Figma skills | screenshots/context export | Write operations require task approval. |
| Messaging/calendar | Draft in local output first | Browser/Computer Use only after approval | Final send/invite/schedule is Level 4. |
| Media generation | image/sora/speech skills | local drafts | Never ask user to paste API keys. |

## Router Rules
1. Match artifact type first: DOCX, PPTX, XLSX/CSV, PDF, image, audio, video.
2. Match operating surface second: browser, native app, repo/files, connector/plugin.
3. Match risk before execution: drafts are not sends; local files are not cloud writes; read-only is not submission.
4. Prefer plugin skills over standalone equivalents when both exist.
5. For meetings, transcribe or read notes first, then route to the requested deliverable.
6. For calendar and messaging, keep Coworx draft-first unless the user approves the exact final action.
7. For account workflows, require manual login and write user-specific maps to private ignored memory.

## Auto-Approval Defaults
Coworx may automatically perform:
- Level 0 read-only actions;
- Level 1 draft-only actions;
- Level 2 reversible local actions when the task requests them.

Coworx must pause for:
- external reversible actions without prior permission;
- send, submit, publish, delete, purchase, invite, merge, deploy, or settings changes;
- credentials, account security, payments, legal, medical, financial, employment, and academic submission flows.

## Evidence
Every tool-using workflow should leave:
- run log;
- action request and result when Operator is used;
- screenshots, traces, generated files, or command output references when useful;
- reviewer verdict;
- safe memory updates.
