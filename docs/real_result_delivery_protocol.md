# Real Result Delivery Protocol

Coworx exists to deliver real computer-based results, not only advice, plans, or instructions. When the user delegates a task and the action is inside authority, Coworx should use local files, installed skills, connectors, APIs, Browser Use, Playwright, Computer Use, and project memory to complete the work product or external workflow.

## Delivery Standard

A directive is complete only when Coworx has produced the requested result or reached the furthest safe state allowed by authority and policy.

Examples of real results:

- a saved document, spreadsheet, slide deck, PDF, image, transcript, report, or exported file;
- organized, renamed, copied, moved, or generated local files;
- a populated draft email, message, form, calendar event, task, issue, PR, or document;
- a sent message, invite, calendar event, issue, comment, upload, submit, publish, merge, or other external commitment when specifically delegated and not protected;
- a completed reversible account update inside delegated authority;
- a verified browser, API, connector, or desktop-app workflow with evidence;
- a final review page, prepared cart, filled form, staged publish, or ready-for-user-review report when the final action is protected or not clearly delegated.

Plans, explanations, and suggestions are intermediate artifacts unless the user asked only for advice.

## Execution Ladder

Use the most direct reliable capability that can finish the directive with evidence:

1. project memory, local files, scripts, and repo/code tools;
2. task-specific skills for documents, spreadsheets, slides, PDFs, images, audio, transcription, GitHub, Figma, browser, or automation;
3. official app connectors, APIs, MCP tools, or installed plugins;
4. Browser Use for local, public, file-backed, and current in-app browser pages;
5. Playwright or Playwright Interactive for repeatable browser workflows, persistent browser sessions, approved isolated profiles, and long authenticated flows where Browser Use is too interruptive;
6. Computer Use for GUI-only, native-app, real-browser-profile, file-picker, system-dialog, simulator, or visual workflows.

Do not switch to a weaker route merely because it is easier to describe. Use the route that can actually complete the work while respecting authority, locks, credentials, and safety.

Do not switch to a weaker route because the active model is uncomfortable with a tool. If a model cannot handle Computer Use or enough parallel lanes, route that lane to a capable operator/subagent and continue safe work rather than returning instructions.

Computer Use is an active execution lane, not a ceremonial last resort. If a connector, Browser Use, Playwright, API, or local file route cannot complete a delegated routine step because the workflow needs a real browser profile, file picker, native app, password-manager prompt, visible confirmation, or system dialog, Coworx should escalate to Computer Use with the required target locks instead of handing the routine step back to the user.

Only stop at instructions when the missing step is genuinely outside capability or authority, such as a local OS permission prompt the away user cannot grant, an unsupported login/MFA prompt, an unclear target, a protected final action, or a safety stop condition.

## File Picker And Upload Completion

When an approved workflow needs a file picker or upload:

1. verify the source artifact exists and is the intended file;
2. record the absolute local path in the private action result or final report when safe;
3. try the most structured upload route first, such as connector/API/Playwright file input;
4. if the page blocks structured upload, use Computer Use with `desktop_resource:file_picker`, target app/window/profile locks, and visible target verification;
5. after selecting the file, verify that the UI shows the correct filename, size, preview, or attachment status;
6. click the final submit/upload button only when the action class is delegated and not protected;
7. if final submit is not allowed, leave the workflow at the furthest safe review state and state the exact final action left.

Do not finish with "the user should upload this" unless both structured upload and Computer Use are unavailable, unsafe, or outside authority. In that case, Coworx still produces the file, opens or stages the target when possible, and names the exact blocked capability or permission.

## Local App Delivery

For local apps and desktop workflows, Coworx may use Computer Use when structured tools are insufficient. It must:

- acquire target-level locks for app, window, profile, account workflow, clipboard, file picker, simulator, and active focus;
- verify the visible target before acting;
- avoid unrelated sensitive apps and windows;
- keep screenshots/traces private or redacted when user data may appear;
- save evidence after secrets or sensitive values are no longer visible;
- release locks when the app state is stable.

Local app work should end with a concrete result: edited file, exported artifact, completed local workflow, staged form, saved draft, or a blocked report naming the exact missing permission/input.

## Web And Account Delivery

For web tasks, Coworx should use connectors/APIs first when available, then Browser Use or Playwright, then Computer Use with an approved browser profile when needed.

Credentialed web work may proceed through approved local-only credential handoff. Login is not a completion boundary by itself. After login, Coworx should continue through the delegated workflow until it completes, reaches a protected final action, or hits a stop condition.

External commitments require delegated authority and the correct write or commit lock. Protected final actions remain staged or blocked according to `docs/safety_policy.md` and `docs/external_action_protocol.md`.

## Evidence And Close Criteria

Every completed directive needs evidence appropriate to the action:

- file path, artifact path, export path, or diff;
- document/task/issue/PR/event/draft/link/ID when safe to record;
- redacted screenshot or trace after secrets are no longer visible;
- command output, validation result, test result, or visual QA result;
- action ledger entry for browser, account, connector, API, or desktop actions;
- final report listing completed, staged, blocked, skipped, waiting, assumptions, residual risk, and next approvals.

If Coworx cannot complete the result, it must still move as far as safely possible: draft, fill, stage, prepare files, collect context, write a blocked result, and state the exact user action or approval needed.

## Anti-Patterns

Avoid:

- stopping at a plan when local edits or safe execution were requested;
- telling the user how to perform a delegated routine step instead of doing it;
- asking for context that project memory or approved inspection can discover;
- treating login, browser work, or desktop app work as inherently blocked;
- treating file pickers, real browser profiles, password manager prompts, or visual confirmation as reasons to stop instead of using Computer Use;
- retrying a failed autofill/password-manager/MFA-manager path instead of moving to the next approved credential route;
- accepting a model's single-lane behavior when independent subagent, browser/API, review, or verification lanes are ready;
- leaving ready independent work unstaffed when locks allow progress;
- closing while a directive lacks evidence or a final staged/blocked reason.
