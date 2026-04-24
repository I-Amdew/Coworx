# Plugin And Skill Router

Coworx is the project-backed workspace. Installed Codex skills, plugins, MCP tools, app connectors, Browser Use, Playwright, Computer Use, local scripts, apps, and CLIs are capability layers it may call to complete work.

## Routing Algorithm

1. Read the task and classify action level.
2. Check Coworx project memory for known maps, routes, output preferences, account labels, selectors, and stop conditions.
3. Check the capability map for user-available plugins, skills, connectors, MCP tools, browser profiles, scripts, apps, and known fallbacks.
4. Identify authority source, target resources, privacy class, and locks.
5. Identify work type: browser, native app, file, document, spreadsheet, presentation, design, GitHub, media, automation, research, coding, review, or mixed.
6. Prefer the most direct available connector, plugin, MCP tool, skill, script, or profile when it helps complete the directive with evidence.
7. Use Browser Use for Codex in-app/current/local/file-backed/public targets.
8. Use Playwright for repeatable structured browser checks and approved isolated profiles.
9. Use APIs/connectors for credentialed account work when available.
10. Use Computer Use for native apps, real browser profiles, system dialogs, visual checks, simulators, and GUI-only tasks.
11. Staff independent lanes in parallel.
12. Record tool choice, action level, authority, locks, evidence, outputs, capability result, and any memory updates in the run log.

## Installed Capability Examples

- Browser Use: in-app/current/local/public browser automation.
- Playwright: repeatable browser automation, QA, screenshots, and traces.
- Computer Use: native Mac apps, real browser profiles, GUI-only flows.
- GitHub: repositories, issues, pull requests, CI.
- Figma: design context and Figma file operations.
- Documents: DOCX creation and editing.
- Spreadsheets: XLSX/CSV analysis and generation.
- Presentations: PPTX slide decks.
- PDF, image, speech, transcription, video, and media skills when installed.

## Non-Coding Routing Table

| Work type | Primary route | Fallback | Authority notes |
|---|---|---|---|
| Meeting audio/video | Transcribe skill | Local notes parsing | Drafts are Level 1; sends are Level 4 when delegated. |
| DOCX/report | Documents plugin | `doc` skill | Local file creation is Level 2. |
| Slides | Presentations plugin | local outline draft | Local deck creation is Level 2. |
| Spreadsheet | Spreadsheets plugin | CSV/local script | Local workbook creation is Level 2. |
| PDF | PDF skill | local extraction/render tools | Keep sensitive PDFs in private paths. |
| Browser task | Browser Use for in-app/current/local/public targets | Playwright for repeatable automation | Credentialed work prefers connectors or approved isolated profiles. |
| Native app task | Computer Use | Screenshot skill for read-only evidence | Use target-level locks. |
| GitHub | GitHub plugin skills | `gh-*` standalone skills | Comments, PRs, merges, and settings follow action levels. |
| Figma/design | Figma plugin and Figma skills | screenshots/context export | Write operations require task authority. |
| Messaging/calendar | Connector/API/browser lane | Computer Use for real profiles | Sends/invites/schedules are Level 4 when delegated or explicitly approved. |
| Media generation | image/sora/speech skills | local drafts | Never ask user to paste API keys. |

## Router Rules

1. Match artifact type first.
2. Match operating surface second.
3. Match risk before execution.
4. Use project maps and memory before rediscovering a known route.
5. Use capability maps before assuming a fixed toolset.
6. Prefer plugin skills over standalone equivalents when both exist and local evidence says they work for this setup.
7. Prefer a learned fallback when the primary capability is missing, unreliable, or out of scope for this user's setup.
8. For account workflows, use credential-safe access and write user-specific maps to ignored private memory.
9. For calendar and messaging, stage when authority, target, recipients, or content are unclear.
10. Do not use plugins or skills to bypass action levels, locks, or credential rules.

## Auto-Execution Defaults

Coworx may automatically perform:

- Level 0 read-only actions;
- Level 1 draft/prep actions;
- Level 2 reversible local actions when requested;
- Level 3 reversible external actions inside delegated authority;
- Level 4 non-high-risk external commitments when the exact action class and target are delegated or explicitly approved.

Coworx must stage or block:

- Level 5/protected actions;
- unclear authority;
- uncertain targets;
- credentials, account security, payments, legal, medical, financial, employment, identity, academic submission, and irreversible production flows.

## Evidence

Every tool-using workflow should leave:

- run log;
- action request/result when external tools or GUI state are used;
- screenshots, traces, generated files, command output, links, or IDs when useful;
- locks and authority source;
- reviewer verdict;
- output hand-off records when files are moved or copied outside `outputs/`;
- capability used, fallback used, and lesson learned;
- safe memory updates or proposals.
