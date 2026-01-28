# Codebase Structure

**Analysis Date:** 2026-01-28

## Directory Layout

```
get-shit-done-main/
├── bin/                      # Installation and setup
│   └── install.js            # NPM entry point; installs to ~/.claude/
├── commands/
│   └── gsd/                  # Slash commands (26 files)
│       ├── plan-phase.md
│       ├── execute-phase.md
│       ├── new-project.md
│       └── [22 more commands]
├── get-shit-done/            # Core system
│   ├── templates/            # Output format templates
│   │   ├── phase-prompt.md   # PLAN.md format
│   │   ├── project.md        # PROJECT.md format
│   │   ├── state.md          # STATE.md format
│   │   ├── roadmap.md        # ROADMAP.md format
│   │   └── [15 more templates]
│   ├── references/           # Reference implementations
│   │   ├── checkpoints.md    # Checkpoint patterns
│   │   ├── tdd.md            # TDD approach
│   │   ├── verification-patterns.md
│   │   └── [6 more references]
│   └── workflows/            # Orchestrator workflows
│       ├── execute-phase.md  # Main execution orchestrator
│       ├── discover-issues.md
│       ├── verify-phase.md
│       └── [9 more workflows]
├── agents/                   # Agent implementations
│   ├── gsd-planner.md        # Plan creation (41KB)
│   ├── gsd-executor.md       # Plan execution (21KB)
│   ├── gsd-verifier.md       # Verification (21KB)
│   ├── gsd-debugger.md       # Issue diagnosis (35KB)
│   └── [7 more agents]
├── hooks/                    # Claude Code hooks
│   ├── gsd-statusline.js     # Context window display
│   └── gsd-check-update.js   # Update notification
├── scripts/
│   └── build-hooks.js        # Compile hooks to dist/
├── assets/
│   └── terminal.svg          # README image
├── .github/                  # GitHub templates
├── package.json              # Node.js metadata
└── README.md, GSD-STYLE.md, CHANGELOG.md, etc.
```

## Directory Purposes

**bin/:**
- Purpose: Installation entry point
- Contains: Single install.js script (44KB)
- Key files: `bin/install.js` (handles runtime selection, global/local install)

**commands/gsd/:**
- Purpose: User-facing command definitions
- Contains: 26 markdown files defining slash commands
- Key files:
  - `plan-phase.md`: Create execution plans
  - `execute-phase.md`: Run plans
  - `new-project.md`: Initialize project
  - `map-codebase.md`: Analyze codebase structure
  - `verify-work.md`: Check execution results
  - `debug.md`: Diagnose issues

**get-shit-done/templates/:**
- Purpose: Output format specifications
- Contains: 18 markdown templates for generated files
- Key files:
  - `phase-prompt.md`: PLAN.md structure (task definitions, must_haves)
  - `project.md`: PROJECT.md structure (requirements, constraints, decisions)
  - `state.md`: STATE.md structure (position, accumulated decisions)
  - `roadmap.md`: ROADMAP.md structure (phases and goals)
  - `summary.md`: SUMMARY.md structure (execution proof)
  - `verification-report.md`: Verification result format
  - `continue-here.md`: Session continuation format

**get-shit-done/references/:**
- Purpose: Implementation guidance and patterns
- Contains: 9 markdown reference documents
- Key files:
  - `checkpoints.md`: Checkpoint task patterns (decision gates, human verification)
  - `verification-patterns.md`: How to verify work was done
  - `tdd.md`: Test-driven development approach
  - `continuation-format.md`: Resume after context window fills
  - `git-integration.md`: Git commit patterns
  - `questioning.md`: How to ask clarifying questions

**get-shit-done/workflows/:**
- Purpose: Reusable orchestration patterns
- Contains: 12 markdown workflow definitions
- Key files:
  - `execute-phase.md`: Main execution orchestrator (coordinating parallel plans)
  - `execute-plan.md`: Single plan execution (task-by-task)
  - `verify-phase.md`: Verification workflow
  - `map-codebase.md`: Codebase analysis
  - `discover-issues.md`: Diagnosing problems
  - `complete-milestone.md`: Milestone completion

**agents/:**
- Purpose: Specialized Claude instances for focused work
- Contains: 11 markdown agent definitions (280KB total)
- Key files:
  - `gsd-planner.md`: Creates detailed PLAN.md files from research (41KB)
  - `gsd-executor.md`: Executes all tasks in a plan (21KB)
  - `gsd-verifier.md`: Checks execution against must_haves (21KB)
  - `gsd-debugger.md`: Diagnosing and fixing issues (35KB)
  - `gsd-phase-researcher.md`: Domain research before planning (21KB)
  - `gsd-codebase-mapper.md`: Analyzes codebase structure

**hooks/:**
- Purpose: Claude Code integration (statusline, notifications)
- Contains: 2 Node.js scripts
- Key files:
  - `gsd-statusline.js`: Shows model, current task, context usage (2KB)
  - `gsd-check-update.js`: Checks for GSD updates (2KB)

**scripts/:**
- Purpose: Build and maintenance
- Contains: `build-hooks.js` (compiles hooks to hooks/dist/)

## Key File Locations

**Entry Points:**
- `bin/install.js`: Installation script (user runs `npx get-shit-done-cc`)
- `commands/gsd/*.md`: Slash commands (user runs `/gsd:command-name`)
- `hooks/gsd-*.js`: Claude Code hooks (automatic invocation)

**Configuration:**
- `package.json`: NPM metadata, version, build scripts
- `get-shit-done/templates/config.json`: Planning settings template

**Core Logic:**
- `get-shit-done/workflows/*.md`: Orchestration patterns
- `agents/gsd-*.md`: Specialized agent implementations
- `get-shit-done/references/*.md`: Reference implementations

**Testing/Quality:**
- `GSD-STYLE.md`: Style guide and conventions

## Naming Conventions

**Files:**
- Commands: kebab-case (`plan-phase.md`, `execute-phase.md`)
- Agents: prefix with `gsd-`, then kebab-case (`gsd-planner.md`, `gsd-executor.md`)
- Templates: descriptive names, no prefix (`phase-prompt.md`, `project.md`)
- Workflows: kebab-case matching command names (`map-codebase.md`, `verify-phase.md`)
- Output files (created in user's `.planning/`): UPPERCASE (`PROJECT.md`, `STATE.md`, `PLAN.md`)

**Directories:**
- System: lowercase (`commands/`, `agents/`, `get-shit-done/`)
- Subdirectories: descriptive lowercase (`templates/`, `references/`, `workflows/`)
- User project: `.planning/phases/{NN}-{name}/` (zero-padded phase, snake_case name)

## Where to Add New Code

**New Command:**
1. Create `commands/gsd/{command-name}.md`
2. Include YAML frontmatter: `name`, `description`, `argument-hint`, `allowed-tools`
3. Define `<objective>`, `<execution_context>`, `<context>`, `<process>`, `<success_criteria>`
4. Delegate complex work to workflows (commands should be thin)

**New Workflow:**
1. Create `get-shit-done/workflows/{workflow-name}.md`
2. Start with `<purpose>` and `<when_to_use>`
3. Use `<process>` and `<step>` elements for execution logic
4. Include decision points where agents will be spawned
5. Reference templates and references as needed

**New Agent:**
1. Create `agents/gsd-{agent-name}.md`
2. Include YAML frontmatter: `name`, `description`, `tools`, `color`
3. Define `<role>`, `<philosophy>`, `<process>` with numbered steps
4. Agents receive full context via references in workflow
5. Always include `<success_criteria>` checklist

**New Template:**
1. Create `get-shit-done/templates/{output-name}.md`
2. Start with descriptive header: `# [Name] Template`
3. Include `<template>` XML block with actual format
4. Add `<guidelines>` section explaining each part
5. Add examples for clarity

**New Reference:**
1. Create `get-shit-done/references/{topic-name}.md`
2. Use semantic XML container matching filename
3. Include code examples showing patterns
4. Add decision criteria for when to use this approach

## Special Directories

**User Project Structure (created by `/gsd:new-project`):**
```
.planning/
├── PROJECT.md                  # What product does, requirements, constraints
├── ROADMAP.md                  # Phases and goals
├── STATE.md                    # Current position, accumulated decisions
├── config.json                 # Planning settings (model profile, commit behavior)
├── codebase/                   # Generated by /gsd:map-codebase
│   ├── ARCHITECTURE.md
│   ├── STRUCTURE.md
│   ├── CONVENTIONS.md
│   ├── TESTING.md
│   ├── STACK.md
│   ├── INTEGRATIONS.md
│   └── CONCERNS.md
└── phases/                     # Execution artifacts
    ├── 01-requirements/
    │   ├── 01-01-PLAN.md       # First plan in phase 1
    │   ├── 01-01-SUMMARY.md    # Proof of execution
    │   ├── 01-02-PLAN.md
    │   ├── 01-02-SUMMARY.md
    │   ├── 01-RESEARCH.md      # Optional: domain research
    │   └── 01-VERIFICATION.md  # Verification results
    ├── 02-architecture/
    │   └── [similar structure]
    └── 03-implementation/
        └── [similar structure]
```

**Generated:** No
**Committed:** User decides via `.planning/config.json` or `.gitignore`

## File Reading Order (for understanding)

1. **Start here:** `README.md` (what it is)
2. **Philosophy:** `GSD-STYLE.md` (design principles)
3. **Pattern:** Read a command like `commands/gsd/plan-phase.md`
4. **Execution:** Read corresponding workflow `get-shit-done/workflows/execute-phase.md`
5. **Agent:** Read one agent like `agents/gsd-planner.md`
6. **Reference:** Browse `get-shit-done/references/*.md` for patterns
7. **Templates:** Check `get-shit-done/templates/*.md` for output formats

## Cross-File Dependencies

**Commands depend on:**
- Workflows (orchestration logic)
- Templates (output format guidance)
- References (pattern examples)

**Workflows depend on:**
- Templates (for output formats)
- References (for patterns and guidelines)
- Agent definitions (to know what to spawn)

**Agents depend on:**
- Workflows (when agent is spawned from workflow)
- Templates (for output formats)
- References (for patterns and best practices)
- Target codebase (agents analyze/modify user's code)

**No circular dependencies:** System is strictly hierarchical with commands at top, agents at bottom.

---

*Structure analysis: 2026-01-28*
