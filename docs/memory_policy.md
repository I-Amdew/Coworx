# Memory Policy

Coworx memory is local project context for repeatable work, not private secrets. It makes the workspace custom by remembering safe routes, maps, selectors, output preferences, and workflow decisions.

## Allowed
- app and page maps;
- course, dashboard, document, folder, and workflow maps;
- workflow steps;
- selectors and element notes;
- lessons learned;
- failure patterns;
- safety decisions;
- approval requirements;
- project conventions;
- output folders and hand-off preferences;
- account labels, login URLs, browser profile names, connector names, password-manager item names, OAuth connector names, and vault handles;
- capability maps for available plugins, skills, connectors, MCP tools, scripts, apps, browser profiles, and learned fallbacks.

## Forbidden
- passwords;
- 2FA codes;
- recovery codes;
- API keys;
- private tokens;
- cookies;
- credit cards;
- private keys;
- private account-security details.

## Account Memory
Account files may describe where a user must manually sign in, which workflows are read-only, and which actions require approval. They must not include credentials.

Account memory may identify "which login route to use" or "which account label applies." It must not include the secret that authenticates the account.

## Capability Memory
Capability files may describe which tools are available in the user's setup, when they are useful, what evidence they produce, and what fallback to use. They must not include secret configuration values, tokens, cookies, profile files, or hidden authentication material.

## School And Academic Work
Coworx can help organize tasks, explain concepts, create study plans, and draft user-reviewed notes. Coworx must not impersonate the user, complete graded work as the user, or submit academic work.
