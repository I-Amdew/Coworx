# Plugin And Skill Router

Coworx is the project-backed workspace. Installed Codex skills, plugins, MCP tools, app connectors, Browser Use, Playwright, Computer Use, local scripts, apps, and CLIs are capability layers it may call to complete work.

## Routing Algorithm

1. Read the task and classify action level.
2. Check Coworx project memory for known maps, routes, output preferences, account labels, selectors, and stop conditions.
3. Check the capability map for user-available plugins, skills, connectors, MCP tools, browser profiles, scripts, apps, and known fallbacks.
4. Identify authority source, target resources, privacy class, and locks.
5. Identify work type: browser, native app, file, document, spreadsheet, presentation, design, GitHub, media, automation, research, coding, review, or mixed.
6. Run the model execution routing checkpoint for non-trivial work: identify first-wave lanes, delegate independent lanes, and note any model limitation that needs a stronger operator or reviewer.
7. Prefer the most direct available connector, plugin, MCP tool, skill, script, or profile when it helps complete the directive with evidence.
8. Use Browser Use for Codex in-app/current/local/file-backed/public targets and quick unauthenticated checks.
9. Use Playwright or Playwright Interactive for repeatable structured browser checks, persistent browser work, approved isolated profiles, and long authenticated workflows where Browser Use would repeatedly ask for permission or lose state.
10. Use APIs/connectors for credentialed account work when available.
11. Use Computer Use for native apps, real browser profiles, file pickers, system dialogs, password-manager prompts, approved messaging apps, visual checks, simulators, and GUI-only tasks.
12. Staff independent lanes in parallel.
13. Record tool choice, model-routing decision, action level, authority, locks, evidence, outputs, capability result, and any memory updates in the run log.

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
| Browser task | Browser Use for in-app/current/local/public targets | Playwright or Playwright Interactive for repeatable or persistent automation | Credentialed work prefers connectors, approved isolated profiles, or Computer Use with a real profile. |
| Long signed-in browser workflow | Connector/API if available | Playwright Interactive with approved persistent profile, then Computer Use for real profile GUI | Avoid Browser Use when it repeatedly prompts or cannot preserve the needed session. |
| Signed-in GUI or flaky model route | Computer Use operator lane with explicit locks | Delegate to capable operator/reviewer model and keep non-GUI lanes running | Do not let any model substitute instructions for real-profile, file-picker, or visible desktop work. |
| Native app or GUI-only task | Computer Use | Screenshot skill for read-only evidence | Use target-level locks. |
| File picker or visual upload | Structured file input or connector/API | Computer Use | Verify selected filename and stage final submit when protected. |
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
11. Do not turn a solvable GUI step into user instructions. Escalate to Computer Use when it is the capability that can complete the delegated work safely.
12. Do not turn a model limitation into a user blocker. If the active model under-delegates, cannot find Computer Use, or mishandles a lane, delegate that lane to a capable subagent/operator or stage the exact model/tool limitation while continuing independent work.

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
