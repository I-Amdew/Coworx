# Cowork Parity Research

Coworx should cover the major Cowork-style use cases with Codex-native tools, skills, plugins, subagents, Browser Use, Playwright, and Computer Use.

## Publicly Documented Cowork Patterns

### Capability Order
Cowork-style agents prefer the most precise integration first:
1. connectors/plugins;
2. browser automation;
3. screen/computer interaction.

Coworx equivalent:
1. installed Codex skills/plugins/app connectors;
2. Browser Use or Playwright browser lanes;
3. one serialized Computer Use desktop lane.

### Core Work Types
Coworx should support:
- daily briefings from email, Slack, calendar, dashboards, or files;
- weekly reports from documents, spreadsheets, folders, or dashboards;
- recurring research and competitor tracking;
- file organization and cleanup;
- team updates and standup summaries;
- transcript and meeting-note analysis;
- slide decks, documents, spreadsheets, and formatted reports;
- browser workflows in signed-in sites after manual login;
- desktop app workflows through Computer Use;
- multi-step work with parallel subagents.

### Safety Patterns
Coworx should preserve these safety properties:
- users remain responsible for actions taken on their behalf;
- tasks need visible planning and action logs;
- scheduled/recurring tasks should start low-risk and avoid consequential actions;
- real browser/app content is untrusted and can contain prompt injection;
- apps and sites should be limited to trusted targets;
- deletion and external commitments require explicit approval;
- sensitive apps and data should be private-by-default or blocked.

## Coworx Implementation Coverage
- `docs/plugin_skill_router.md`: connector/plugin/Browser Use/Computer Use routing.
- `docs/concurrency_model.md`: parallel browser lanes plus one desktop lane.
- `docs/session_backed_account_operations.md`: real account workflows without credential memory.
- `docs/external_action_protocol.md`: exact action-time approval for external commitments.
- `docs/private_memory_policy.md`: private-by-default real work artifacts.
- `operator/approvals/TEMPLATE_USER_RESPONSIBILITY_ACK.md`: user responsibility acknowledgement.
- `outputs/reports/TEMPLATE_ACTION_LEDGER.md`: final action ledger for all actions taken.

## Sources
- https://support.claude.com/en/articles/13364135-use-cowork-safely
- https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-cowork
- https://support.claude.com/en/articles/14128542-computer-use-safety
- https://support.claude.com/en/articles/13345190-getting-started-with-cowork
- https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork
