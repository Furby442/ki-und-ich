# Architecture

**Analysis Date:** 2026-01-28

## Pattern Overview

**Overall:** Meta-prompting orchestration system with subagent delegation

**Key Characteristics:**
- Command-driven entry points (slash commands like `/gsd:plan-phase`)
- Thin orchestrator layer delegating complex work to specialized agents
- Markdown-based workflow definitions (executable specifications)
- Context engineering for managing Claude's token window
- State-based project progression through phases and plans
- Wave-based parallel execution of independent plans

## Layers

**Command Layer:**
- Purpose: Parse user input and dispatch to workflows
- Location: `commands/gsd/*.md`
- Contains: YAML frontmatter (name, description, argument hints) + process steps
- Depends on: Workflows in `get-shit-done/workflows/`
- Used by: Claude Code slash command system

**Orchestrator Layer:**
- Purpose: Coordinate multi-step operations, validate state, spawn agents
- Location: `get-shit-done/workflows/*.md`
- Contains: Decision logic, phase progression, dependency validation, agent spawning
- Depends on: Project state (STATE.md), reference docs, templates
- Used by: Commands dispatch here; returns results to user

**Agent Layer:**
- Purpose: Execute focused tasks with fresh context windows
- Location: `agents/gsd-*.md`
- Contains: Role definition, tools, step-by-step execution logic
- Depends on: Workflows, templates, codebase (for mapping/planning)
- Used by: Orchestrator spawns agents via Task tool

**Context/Reference Layer:**
- Purpose: Provide reference implementations, patterns, and guidelines
- Location: `get-shit-done/references/*.md` and `get-shit-done/templates/*.md`
- Contains: Planning methodology, test patterns, UI brand, continuation format
- Depends on: Nothing (leaf nodes)
- Used by: Agents and orchestrator load these for guidance

**Project State Layer:**
- Purpose: Persistent project context across sessions
- Location: `.planning/` directory (user's project)
- Contains: PROJECT.md, ROADMAP.md, STATE.md, phase plans, verification reports
- Depends on: Nothing (sourced from commands)
- Used by: All agents and orchestrator read state to maintain continuity

## Data Flow

**Project Creation Flow:**
1. User runs `/gsd:new-project`
2. Orchestrator spawns `gsd-project-researcher` to understand scope
3. Agent creates `.planning/` structure with PROJECT.md, ROADMAP.md, STATE.md
4. System ready for phase-based development

**Phase Planning Flow:**
1. User runs `/gsd:plan-phase [phase-number]`
2. Orchestrator loads STATE.md to confirm project initialized
3. If no research exists, spawn `gsd-phase-researcher` to investigate domain
4. Spawn `gsd-planner` with research to create detailed PLAN.md files
5. Spawn `gsd-plan-checker` to verify plans meet project goals
6. Iterate on plans until verification passes
7. Update STATE.md with completed plans

**Phase Execution Flow:**
1. User runs `/gsd:execute-phase [phase-number]`
2. Orchestrator discovers all PLAN.md files in phase directory
3. Analyze dependencies; group plans into execution waves
4. For each wave, spawn `gsd-executor` agents in parallel
5. Each executor reads full execute-plan workflow, performs all tasks
6. Executor creates SUMMARY.md documenting what was built
7. Orchestrator waits for wave completion, handles next wave
8. After all waves complete, spawn `gsd-verifier` to check outcomes
9. Update STATE.md to mark phase complete

**Verification Flow:**
1. After execution, user runs `/gsd:verify-work [phase-number]`
2. Orchestrator spawns `gsd-verifier` with phase plans and SUMMARY docs
3. Verifier checks observable behaviors from PLAN.md must_haves
4. Create VERIFICATION.md documenting what passed/failed
5. If gaps detected, orchestrator can trigger `/gsd:plan-phase --gaps`

**State Management:**
- **STATE.md:** Current position (phase, plan), accumulated decisions, blockers
- **PROJECT.md:** What product does, core value, requirements, constraints
- **ROADMAP.md:** Phases and their goals
- **Phase directories:** `.planning/phases/{NN}-{name}/`
  - `{phase}-{plan}-PLAN.md`: Executable specification for one plan
  - `{phase}-{plan}-SUMMARY.md`: Proof of execution (created after success)
  - `{phase}-{plan}-RESEARCH.md`: Research backing this plan (optional)
  - `{phase}-VERIFICATION.md`: Verification results for entire phase

## Key Abstractions

**Command:**
- Purpose: User-facing entry point exposing workflow capabilities
- Examples: `/gsd:plan-phase`, `/gsd:execute-phase`, `/gsd:new-project`
- Pattern: YAML frontmatter + orchestration steps in `commands/gsd/*.md`

**Workflow:**
- Purpose: Reusable orchestration pattern (can be invoked by multiple commands)
- Examples: `map-codebase`, `execute-phase`, `verify-phase`
- Pattern: XML step elements with decision logic and agent spawning in `get-shit-done/workflows/*.md`

**Agent:**
- Purpose: Focused Claude instance doing specialized work (research, planning, execution, verification)
- Examples: `gsd-planner`, `gsd-executor`, `gsd-verifier`
- Pattern: Role definition + tool access + step-by-step execution in `agents/gsd-*.md`

**Plan:**
- Purpose: Specification for one piece of work within a phase
- Pattern: `{phase}-{plan}-PLAN.md` with objective, execution context, and task list
- Contents: Frontmatter (wave, dependencies, files_modified), objective, context, tasks with verify/done criteria

**Task:**
- Purpose: Atomic unit of work within a plan
- Pattern: XML `<task>` element with name, files, action, verify, done
- Types: `auto` (Claude executes), `checkpoint:decision`, `checkpoint:human-verify`

## Entry Points

**CLI Entry Point:**
- Location: `bin/install.js`
- Triggers: `npx get-shit-done-cc` (installation)
- Responsibilities: Configure runtime (Claude Code or OpenCode), install to global or local `.claude/`

**Slash Command Entry Points:**
- Location: `commands/gsd/*.md` (26 commands total)
- Triggers: `/gsd:` in Claude Code interface
- Responsibilities: Parse arguments, validate environment, dispatch to workflows

**Hook Entry Points:**
- Location: `hooks/*.js` (statusline, update-check)
- Triggers: Claude Code lifecycle events
- Responsibilities: Display context usage, show current task, notify of updates

**Workflow Entry Points:**
- Location: `get-shit-done/workflows/*.md` (12 workflows)
- Triggers: Command dispatches or orchestrator spawns
- Responsibilities: Coordinate multi-step operations, manage state transitions

**Agent Entry Points:**
- Location: `agents/gsd-*.md` (11 agents)
- Triggers: Orchestrator spawns via Task tool with model profile
- Responsibilities: Execute focused tasks using provided context

## Error Handling

**Strategy:** Fail loudly with actionable messages, no silent failures

**Patterns:**
- Bash: Check existence before operations (`ls .planning/ 2>/dev/null` with error handling)
- Commands: Validate phase, research files, plan files exist before proceeding
- State checks: Always read STATE.md first; error if `.planning/` missing
- Agent context: Pass full execution context; agents fail if missing required files
- Checkpoints: User must provide explicit resume signal (e.g., "approved") before continuing

## Cross-Cutting Concerns

**Logging:** No formal logging framework; agents output progress text. Statusline hook shows current task.

**Validation:**
- Phases must exist in roadmap before planning
- Plans must exist and be syntactically valid before execution
- Phase completion verified via observable behaviors in must_haves
- User interaction via checkpoint tasks (decision gates, visual verification)

**Authentication:**
- No explicit auth; relies on Claude Code's session context
- Model profiles read from `.planning/config.json` for agent spawning
- Environment: Node.js runtime for install script and hooks

**Context Management:**
- Orchestrator stays lean by offloading work to subagents
- Agents load fresh context from workflows + templates + project state
- STATE.md updated after each major operation to resume after context window fills
- Phase structure allows parallel execution of independent plans

---

*Architecture analysis: 2026-01-28*
