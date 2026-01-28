# Codebase Concerns

**Analysis Date:** 2026-01-28

## Tech Debt

**Removed Codebase Intelligence System:**
- Issue: Large overengineered system was removed in v1.9.2, replaced with simpler codebase-mapper approach
- Files: Historical reference in `CHANGELOG.md` (line 85-92)
- Impact: No current impact; legacy commands `/gsd:analyze-codebase` and `/gsd:query-intel` removed, 21MB sql.js dependency eliminated
- Fix approach: No action needed; decision was to simplify and remove unnecessary complexity

**Large Complex Files (Potential Maintainability Issues):**
- **execute-plan.md** (1844 lines): Orchestration workflow with extensive checkpoint, failure handling, and state management logic
- **gsd-planner.md** (1386 lines): Complex planning agent with context loading, assumption handling, and task decomposition
- **gsd-debugger.md** (1203 lines): Debug agent with multiple checkpoint types and resolution strategies
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\get-shit-done\workflows\execute-plan.md`, `C:\Users\Furby\Documents\claude-code\get-shit-done-main\agents\gsd-planner.md`, `C:\Users\Furby\Documents\claude-code\get-shit-done-main\agents\gsd-debugger.md`
- Impact: Harder to review, understand, and modify these critical workflows; difficult to extract reusable patterns
- Fix approach: Consider extracting common patterns into shared reference docs; break large workflows into smaller section-based documents; add table of contents for navigation

**install.js Size and Complexity:**
- Issue: 1292 lines covering installation, uninstallation, settings management, path handling, and runtime conversion
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js`
- Impact: Hard to test comprehensively; edge cases in path handling and settings migration may be missed
- Fix approach: Consider extracting helper modules for (1) path resolution, (2) settings management, (3) frontmatter conversion; add integration tests for Windows/WSL2 scenarios

**Path Handling Complexity:**
- Issue: Multiple code paths handle tilde expansion, Windows paths, config directory resolution with different logic branches
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js` (lines 47-89, 183-200)
- Impact: Inconsistent behavior across platforms; WSL2 specific workarounds increase complexity
- Fix approach: Centralize path normalization; create platform-agnostic utility functions; expand comprehensive test matrix for Windows, macOS, Linux, WSL2

**Statusline Silent Failure Pattern:**
- Issue: `gsd-statusline.js` catches all errors silently to avoid breaking the status line (line 81-83)
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\hooks\gsd-statusline.js`
- Impact: Bugs in statusline parsing go unnoticed; makes debugging production issues harder
- Fix approach: Log errors to a debug file instead of silencing; add optional verbose mode flag; consider collecting error metrics

## Known Bugs

**Update Check Process Spawning:**
- Symptoms: Background spawn process for npm version check may accumulate processes in long-running sessions
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\hooks\gsd-check-update.js` (line 25-59)
- Trigger: Every session start (SessionStart hook); spawns detached background process via `spawn()` with `unref()`
- Current behavior: Process detaches correctly but no process cleanup verification or timeout
- Workaround: Process naturally exits after npm check; no user-visible impact in typical usage
- Fix approach: Add timeout to npm view command (currently 10000ms, good); verify process actually terminates; consider adding periodic cleanup of stale cache files

**Orphaned Files Cleanup May Miss Edge Cases:**
- Symptoms: Some old hook names cleaned up manually, but pattern-based cleanup might miss newer orphaned files
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js` (lines 476-489, 494-534)
- Trigger: During installation when upgrading from older versions
- Current behavior: Hardcoded list of orphaned files to remove; list must be manually maintained
- Workaround: None; users must manually remove files if new orphaned patterns emerge
- Fix approach: Create automated registry of removed files in CHANGELOG.md; parse changelog during install to dynamically build cleanup list

**Plan File Detection May Fail on Paths with Spaces:**
- Symptoms: Workflow grep patterns may not handle plan filenames with spaces correctly
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\get-shit-done\workflows\*.md` (multiple bash commands)
- Trigger: When PHASE_DIR or plan path contains spaces
- Current behavior: Bash commands use `ls -1 "$PHASE_DIR"/*-PLAN.md` which is safe, but string concatenation in some contexts may break
- Workaround: Avoid spaces in phase directory names
- Fix approach: Quote all bash variables consistently; use find with -print0 and xargs -0 for robust whitespace handling

## Security Considerations

**Path Traversal in Settings File Operations:**
- Risk: `readSettings()` and `writeSettings()` functions don't validate paths; could read/write arbitrary JSON files if path is user-controlled
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js` (lines 205-221)
- Current mitigation: Paths are hardcoded from function parameters; no user input directly affects target paths
- Recommendations: Add path validation to ensure file operations stay within intended directories; document that settingsPath must be pre-validated

**Subprocess Invocation with Template Strings:**
- Risk: `spawn()` call in gsd-check-update.js uses template literals with file paths that could be malicious if SOURCE is compromised
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\hooks\gsd-check-update.js` (lines 25-56)
- Current mitigation: File paths are from internal constants (cacheFile, projectVersionFile, globalVersionFile); no user input; execSync call is on npm registry only (safe)
- Recommendations: Document this pattern; ensure no future changes introduce unsanitized user input to spawn calls

**OpenCode JSON Parsing Without Validation:**
- Risk: `JSON.parse()` on opencode.json without schema validation; corrupted file could cause unexpected behavior
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js` (lines 687, 749)
- Current mitigation: Try-catch blocks around JSON parsing; warns user on invalid JSON; starts fresh
- Recommendations: Add schema validation library (e.g., Zod); document JSON structure formally

**Frontmatter Parsing Regex Not Validated:**
- Risk: YAML frontmatter parsing uses line-by-line string operations without full YAML parser; edge cases could cause unexpected behavior
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js` (lines 274-372)
- Current mitigation: Simple regex patterns; string manipulation; worst case: preserves original content if parsing fails
- Recommendations: Use proper YAML parser (js-yaml) instead of line-by-line parsing; add test cases for edge cases (quotes, escape chars, multiline strings)

## Performance Bottlenecks

**Statusline File System Checks Every Session:**
- Problem: `gsd-statusline.js` reads multiple files synchronously (statSync in a loop, readFileSync on todos)
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\hooks\gsd-statusline.js` (lines 45-72)
- Cause: Checks ~/.claude/todos directory, reads newest file, parses JSON for every status line render
- Impact: Adds latency to status line rendering; could be slow on slow disks or remote filesystems
- Improvement path: Cache todo list per-session; use mtime only once; consider async status line or debounced updates

**Install.js Directory Scanning on Every File Copy:**
- Problem: `copyWithPathReplacement()` recursively reads all entries and stats files
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js` (lines 439-471)
- Cause: Deep recursive traversal with no early termination; rebuilds entire tree for each runtime (Claude + OpenCode = 2x traversals)
- Impact: Slow on large file trees; noticeable on slow I/O
- Improvement path: Combine Claude and OpenCode copies into single pass; consider streaming large files

**Update Check Spawns Background Process Every Session:**
- Problem: `gsd-check-update.js` spawns a new Node process and runs npm view (network call)
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\hooks\gsd-check-update.js`
- Cause: No caching; runs on every session start
- Impact: Network latency on every Claude Code session; slow on poor connections
- Improvement path: Cache result for 24+ hours (current cache name exists but verify TTL); add opt-out via settings; consider check-on-demand only

## Fragile Areas

**Workflow State Parsing from Config.json:**
- Files: Multiple workflows (`C:\Users\Furby\Documents\claude-code\get-shit-done-main\get-shit-done\workflows\`)
- Why fragile: Uses grep with regex to extract JSON values instead of proper JSON parsing
- Examples: `cat .planning/config.json 2>/dev/null | grep -o '"commit_docs"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false'`
- Risk: Breaks if JSON formatting changes (extra spaces, newlines, comments); fragile to field reordering
- Safe modification: Use `jq` for JSON parsing (`jq -r '.model_profile // "balanced"' .planning/config.json`)
- Test coverage: No visible test files for config parsing; add unit tests for edge cases

**Phase Directory Lookup by Pattern:**
- Files: Execute phase, discuss phase, and other workflows
- Why fragile: Uses `ls -d .planning/phases/${PADDED_PHASE}-* .planning/phases/${PHASE}-* 2>/dev/null | head -1` pattern matching
- Risk: If multiple phases match pattern (e.g., `01-*` matches both `01-setup` and `01a-setup`), takes first (wrong one); silently fails if none match
- Safe modification: Use explicit phase identification from STATE.md or PHASE_CONFIG; verify exactly one match before proceeding
- Test coverage: No tests for multiple matching phases; add validation to reject ambiguous phase references

**Markdown Link Parsing in Commands:**
- Files: Agents that parse markdown links from documentation (e.g., research-phase looking for external references)
- Why fragile: Simple regex for `[text](url)` doesn't handle escaped brackets, nested brackets, or markdown edge cases
- Risk: Misses valid links or extracts malformed URLs
- Safe modification: Use markdown parser library instead of regex
- Test coverage: Manual testing only; add markdown-specific test fixtures

**Checkpoint Resolution Logic with Multiple Types:**
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\agents\gsd-debugger.md` (lines 1-80)
- Why fragile: Multiple checkpoint types (context, dependency, decision, ambiguity, user-input) each with different resolution logic
- Risk: Confusing checkpoint state machine; easy to miss a case when adding new types
- Safe modification: Extend checkpoint.md reference with decision tree; add validation to enforce checkpoint-to-resolution mapping
- Test coverage: Verify each checkpoint type resolves correctly with gsd-verifier

**Orphaned File Hardcoded List:**
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js` (lines 477-480, 495-501)
- Why fragile: Manual list of orphaned files; new versions must update this list manually
- Risk: If team forgets to add new orphaned files, users get orphaned files after upgrades
- Safe modification: Add deprecation notes to CHANGELOG; extract orphaned files list from changelog automatically
- Test coverage: Add regression test for each version upgrade path

## Scaling Limits

**Statusline Todo File Scanning:**
- Current capacity: Session files stored in ~/.claude/todos, scanned on every render
- Limit: If user has many sessions, directory scan becomes O(n) per render; with hundreds of sessions, noticeable latency
- Scaling path: Implement session-scoped todo cache; use single todo file per session with defined location; add cleanup for old sessions

**Execute-Plan Orchestration Task Limit:**
- Current capacity: Plans executed sequentially or in dependency-ordered waves; each plan spawns subagent
- Limit: No explicit limit, but each plan spawn costs context; 50+ plans in single phase could exhaust context
- Scaling path: Implement explicit wave limit (e.g., max 5 parallel subagents); add plan batching; split large phases into milestones

**Config File Parsing in Workflows:**
- Current capacity: Grep-based config parsing works until config.json exceeds bash string limits or has complex nesting
- Limit: If config.json becomes complex (nested objects, large arrays), grep patterns fail silently
- Scaling path: Migrate to jq-based parsing; formalize config schema; add config validation on startup

## Dependencies at Risk

**No Runtime Dependencies in package.json:**
- Risk: Project has zero dependencies (line 37: `"dependencies": {}`), which is good; but implies all functionality is self-contained
- Impact: If any external tool (jq, git, npm) becomes unavailable, GSD breaks without warning
- Migration plan: Document external tool requirements clearly in README; add startup validation that checks for required tools

**esbuild DevDependency for Hook Building:**
- Risk: Used only for building hooks (line 39); if build is skipped, old compiled hooks are deployed
- Impact: Features added to source hooks won't work until rebuild
- Recommendations: Add pre-publish check that verifies hooks were rebuilt; document hook build step in CONTRIBUTING.md clearly

**npm registry dependency for update check:**
- Risk: `gsd-check-update.js` calls `npm view get-shit-done-cc version` (line 45)
- Impact: If npm registry is down, update check times out; if GSD is removed from npm, check will fail
- Mitigation: 10-second timeout is in place; silent failure if check fails
- Recommendations: Add mirror/fallback registry; implement local version fallback

## Missing Critical Features

**No Configuration Validation:**
- Problem: Users can create invalid config.json; no schema enforcement
- Blocks: Users may unknowingly configure broken state; errors appear late during execution
- Solution: Add config schema validation; create `config validate` subcommand; validate on startup

**No Automated Rollback on Installation Failure:**
- Problem: If install fails mid-way, may leave system in broken state
- Blocks: Users unable to recover without manual cleanup
- Solution: Implement atomic installation (backup before, restore on failure); add rollback subcommand

**No Migration Path for Settings Upgrades:**
- Problem: If hook format or settings structure changes, old settings.json may be incompatible
- Blocks: Users must manually fix settings after major version upgrades
- Solution: Add settings migration functions; document each version's settings format

## Test Coverage Gaps

**No Unit Tests for Core Installer:**
- What's not tested: Path resolution logic, settings parsing, frontmatter conversion, orphaned file cleanup
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js`
- Risk: Windows path bugs, WSL2 edge cases, and settings corruption can go undetected
- Priority: High
- Recommendation: Add Jest test suite for install.js functions; test Windows, macOS, Linux, and WSL2 paths

**No Integration Tests for Workflows:**
- What's not tested: Full workflow execution (discovery → planning → execute → verify); interaction between phases
- Files: All in `C:\Users\Furby\Documents\claude-code\get-shit-done-main\get-shit-done\workflows\`
- Risk: Breaking changes to orchestration logic only caught after user runs full workflow
- Priority: Medium
- Recommendation: Create test projects with mock phases; verify checkpoint resolution; verify state transitions

**No End-to-End Tests for Subagent Spawning:**
- What's not tested: Subagent startup, context passing, SUMMARY.md generation, commit hooks
- Files: Agent definitions in `C:\Users\Furby\Documents\claude-code\get-shit-done-main\agents\`
- Risk: Subagent context issues (missing files, malformed prompts) only found during real usage
- Priority: Medium
- Recommendation: Add fixtures for PLAN.md, CONTEXT.md, STATE.md; verify subagent behavior deterministically

**No Tests for Config/State Parsing:**
- What's not tested: Parsing .planning/config.json, STATE.md, PHASE_CONFIG; edge cases with missing files, malformed JSON
- Files: Workflows that parse these files
- Risk: Invalid config/state causes workflows to fail silently or make wrong assumptions
- Priority: Medium
- Recommendation: Add test fixtures with intentionally malformed/missing files; verify graceful degradation

**No Tests for Path Handling Across Platforms:**
- What's not tested: Tilde expansion, Windows backslash paths, network paths, symlinks, relative vs absolute
- Files: `C:\Users\Furby\Documents\claude-code\get-shit-done-main\bin\install.js`
- Risk: WSL2 and Windows users may encounter path bugs not visible on macOS/Linux
- Priority: High
- Recommendation: Add Docker containers for Windows + WSL2; test installation on each platform

---

*Concerns audit: 2026-01-28*
