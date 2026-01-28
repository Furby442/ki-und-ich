# External Integrations

**Analysis Date:** 2026-01-28

## APIs & External Services

**NPM Registry:**
- Service: npm (Node Package Manager)
- What it's used for: Package distribution and version checks
- SDK/Client: Native Node.js `child_process.execSync` via shell
- Usage location: `hooks/gsd-check-update.js` - Runs `npm view get-shit-done-cc version` to check for updates
- Auth: Public (no authentication required)
- Called: Once per Claude Code/OpenCode session (background process)

**GitHub:**
- Service: GitHub (git hosting)
- What it's used for: Source code repository and issue tracking
- SDK/Client: Git CLI (git command line)
- Repository: https://github.com/glittercowboy/get-shit-done
- Auth: Optional (public repository, SSH/HTTPS with credentials for push)
- Usage location: Entire GSD system - Git is foundational to workflow
  - `get-shit-done/references/git-integration.md` - Defines commit strategy
  - Workflows use git commands for: commits, tags, history analysis, reset operations
- Integration: GSD commits code per task with structured messages (feat/fix/test/refactor/perf/chore)

## Data Storage

**Databases:**
- None used - GSD is stateless orchestration system

**File Storage:**
- Local filesystem only
- State persisted to:
  - `.planning/` directory - Project roadmap, phases, plans, state, requirements
  - `.claude/get-shit-done/` directory - Global configuration and versioning
  - `.opencode/get-shit-done/` directory - OpenCode equivalent
  - Git repository - Code and commit history

**Caching:**
- Local filesystem: `~/.claude/cache/` or `~/.opencode/cache/`
- Cache files:
  - `gsd-update-check.json` - Version check result (TTL managed by application logic)
  - Checked in `hooks/gsd-check-update.js`

## Authentication & Identity

**Auth Provider:**
- Custom (None for API access)
- Users authenticate via Claude Code or OpenCode IDE
- Git operations use system git credentials (SSH keys or stored credentials)

**API Keys/Credentials:**
- No external API keys required for GSD core functionality
- Claude Code/OpenCode provide API access to Claude models (handled by IDE)

## Monitoring & Observability

**Error Tracking:**
- None integrated

**Logs:**
- Console output (stdout/stderr)
- Approach: Direct logging via `console.log()` and `console.error()` in Node.js scripts
- Status display via statusline hook: `hooks/gsd-statusline.js`

## CI/CD & Deployment

**Hosting:**
- npm Package Registry (npmjs.org)
- GitHub releases (via git tags)
- Public distribution via: `npx get-shit-done-cc`

**CI Pipeline:**
- GitHub Actions (`.github/` directory present)
- Runs: esbuild on `prepublishOnly` hook (before npm publish)
- Verifies hooks build successfully before distribution

**Distribution:**
- npm package: `get-shit-done-cc`
- Version: Read from `VERSION` file in `.claude/get-shit-done/` or `.opencode/get-shit-done/`
- Update check mechanism: Background npm registry query in `gsd-check-update.js`

## Environment Configuration

**Required env vars:**
- None hardcoded as required
- Optional env vars for config directory override:
  - `CLAUDE_CONFIG_DIR` - Custom Claude config location
  - `OPENCODE_CONFIG_DIR` - Custom OpenCode config location
  - `XDG_CONFIG_HOME` - XDG Base Directory (OpenCode)

**Secrets location:**
- Git credentials: System git config (usually `~/.ssh/` for SSH keys or `~/.git-credentials`)
- No .env files used or distributed
- Project state persists only in `.planning/` (version controlled)

**Config files:**
- `.planning/config.json` - Per-project workflow settings
  - `model_profile`: `quality`, `balanced`, or `budget` (determines Claude model per agent)
  - `gates`: Safety confirmations for project setup and transitions
  - `parallelization`: Plan-level parallel agent execution settings
  - `workflow`: Research, plan-check, and verifier toggles
  - `planning.commit_docs`: Whether to commit .planning/ files to git

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- Git operations only (commits, tags, resets)
- Triggered by: GSD commands and agent executions
- Payloads: Code changes and planning documents

## IDE Integration

**Claude Code:**
- Primary runtime
- Commands registered as custom slash commands (`/gsd:*`)
- Global or project-local installation via `~/.claude/` or `./.claude/`
- Hooks integrated via Claude Code's hook system:
  - `SessionStart` hook - Runs `gsd-check-update.js` for background version check
  - Statusline hook - Displays project status via `gsd-statusline.js`

**OpenCode:**
- Alternative open-source runtime
- Same command structure and hook integration
- Config location: `~/.config/opencode/` (XDG compliant)

## Integration with Claude Models

**Model Access:**
- Via Claude Code/OpenCode IDE (credentials managed by IDE)
- GSD agents spawn subagents using Task tool (IDE feature)
- Model selection via profiles:
  - `claude-opus-4-5` - Planning, architecture decisions
  - `claude-sonnet-4` - Execution, verification
  - `claude-haiku-4.5` - Research, pattern extraction

**Agents as External Services:**
- Each agent is a .md file spawned by orchestrator commands
- Agents: codebase-mapper, planner, executor, debugger, verifier, researcher, etc.
- Communication: Via Task tool, state files (PLAN.md, SUMMARY.md, STATE.md)

---

*Integration audit: 2026-01-28*
