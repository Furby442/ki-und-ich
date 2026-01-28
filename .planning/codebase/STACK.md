# Technology Stack

**Analysis Date:** 2026-01-28

## Languages

**Primary:**
- JavaScript (Node.js 16.7.0+) - Entry point, installation, hooks, build scripts
- Markdown (.md) - Commands, agents, workflows, templates, documentation

**Secondary:**
- YAML - GitHub Actions configuration (`.github/workflows/`)
- JSON - Package manifests, configuration files

## Runtime

**Environment:**
- Node.js 16.7.0 or higher (see `package.json` engines field)
- Bash/Shell (for execution hooks and integration)
- Cross-platform: Mac, Windows, Linux

**Package Manager:**
- npm (Node Package Manager)
- Lockfile: `package-lock.json` (present, v3 format)

## Frameworks

**Core:**
- Claude Code - Primary runtime for GSD system (development environment)
- OpenCode - Alternative open-source runtime support

**Build/Dev:**
- esbuild 0.24.0+ - JavaScript bundling and minification for hooks

## Key Dependencies

**Runtime:**
- No production dependencies (dependencies: {})

**Build Only:**
- esbuild ^0.24.0 - Used to bundle hooks for distribution via `npm run build:hooks`

## Configuration

**Environment:**
- Claude Code config: `~/.claude/` (global) or `./.claude/` (local project)
- OpenCode config: `~/.config/opencode/` (follows XDG Base Directory spec)
- Supports environment variable overrides:
  - `CLAUDE_CONFIG_DIR` - Override Claude config location
  - `OPENCODE_CONFIG_DIR` - Override OpenCode config location
  - `XDG_CONFIG_HOME` - XDG base directory (OpenCode only)

**Build:**
- `scripts/build-hooks.js` - Node.js script to copy hooks to `hooks/dist/`
- No complex build pipeline; primarily file copying
- npm script: `npm run build:hooks` runs prepublishOnly

**Project Config:**
- `.planning/config.json` - Per-project GSD settings (mode, depth, workflow, parallelization, gates)
- Model profiles: `quality`, `balanced` (default), `budget` - Controls Claude model assignment per agent

## Platform Requirements

**Development:**
- Node.js 16.7.0+
- npm package manager
- Git for version control
- Bash or compatible shell (for hooks)
- Claude Code IDE or OpenCode compatible environment

**Production:**
- Deployed as npm package: `get-shit-done-cc` on npmjs.org
- Installation via: `npx get-shit-done-cc` (with optional flags for runtime and location)
- No server/database requirements; runs locally in Claude Code/OpenCode

## Installation Methods

**Interactive:**
```bash
npx get-shit-done-cc
```
Prompts for runtime selection (Claude, OpenCode, or both) and installation location (global or local).

**Non-interactive (CI/Docker):**
```bash
npx get-shit-done-cc --claude --global   # Claude global
npx get-shit-done-cc --opencode --local  # OpenCode local
npx get-shit-done-cc --both --global     # Both runtimes
```

**Development Install:**
```bash
git clone https://github.com/glittercowboy/get-shit-done.git
cd get-shit-done
node bin/install.js --claude --local
```

## Key Files

**Entry Point:**
- `bin/install.js` - Executable installer, handles platform detection and directory setup

**Hooks (Distributed):**
- `hooks/gsd-check-update.js` - Background version check against npm registry
- `hooks/gsd-statusline.js` - Status display (likely for IDE statusline)
- Both compiled to `hooks/dist/` by esbuild during `prepublishOnly`

**Package Info:**
- `package.json` - Project manifest (v1.9.13, MIT license)
- `package-lock.json` - Lockfile for reproducible installs

---

*Stack analysis: 2026-01-28*
