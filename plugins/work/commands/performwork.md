---
description: Execute Linear issues with enforced validation and clear documentation
argument-hint: [issueId] [--resume] [--push] [--simple] [--project=NAME] [--cycle=NAME]
skills: prd-format
---

# Execute Linear Issue

Execute issue `{{issueId}}` with requirement adherence and type safety.

> **CRITICAL**: This is an EXECUTABLE command. Call the MCP tools.
> Make the edits and run the validations. Do not just read and acknowledge.

---

## Flags

| Flag | Effect |
|------|--------|
| `--resume` | Resume from last checkpoint |
| `--push` | Auto-push and create PR after commit |
| `--simple` | Skip Thoughtbox analysis for trivial issues |
| `--project=NAME` | Associate with Linear project by name |
| `--cycle=NAME` | Associate with Linear cycle (current, next, or name) |

---

## Configuration

All thresholds and settings. Reference by name elsewhere.

```yaml
execution:
  total_timeout_minutes: 45

agents:
  max_concurrent: 3
  max_waves: 3
  spawn_delay_ms: 500
  wave_timeout_minutes: 5

thresholds:
  # Fast-path (simplified flow)
  fast_path:
    max_requirements: 3
    max_files: 2
    keywords: ["typo", "fix typo", "minor", "small", "trivial", "quick", "rename"]

  # Ultra-fast-path (minimal flow)
  ultra_fast:
    max_files: 1
    max_lines_changed: 10
    keywords: ["typo", "comment", "rename variable"]

  # Parallel deployment triggers
  parallel:
    files_for_review: 4          # Deploy 2+ agents if files >= this
    files_per_agent: 4           # Files assigned per agent
    type_errors_wave2: 20        # Deploy 2+ agents if errors >= this
    type_errors_wave3: 50        # Deploy 3+ agents if errors >= this
    lint_errors_parallel: 30     # Deploy 2+ agents if errors >= this

linear_mcp:
  retry_delays: [15, 20, 25, 30] # Rolling delays in seconds
  total_timeout: 120             # 2 minutes max
  retryable: ["proxy error", "timeout", "502", "503", "504", "ETIMEDOUT", "ECONNRESET"]

thoughtbox:
  # Tiered mental model usage
  tier1:  # Always use (critical decisions)
    - decomposition         # Orchestration strategy
    - pre-mortem           # Risk assessment
    - inversion            # Follow-up assessment
  tier2:  # Use if complexity > simple
    - five-whys            # Wave failure analysis
    - rubber-duck          # Debugging stuck errors
  tier3:  # Use for complex issues
    - abstraction-laddering  # Architectural decisions
    - trade-off-matrix       # Multi-option choices

lsp:
  # Operations for code analysis
  discovery:
    - documentSymbol     # Get file structure
    - workspaceSymbol    # Cross-file symbol search
  navigation:
    - goToDefinition     # Find implementations
    - findReferences     # Impact analysis
    - hover              # Type information
  call_analysis:
    - prepareCallHierarchy  # Get call hierarchy item
    - incomingCalls         # Who calls this
    - outgoingCalls         # What this calls

commit_types:
  # Detect from issue labels or title
  feature: ["feature", "feat", "enhancement", "new"]
  fix: ["bug", "fix", "bugfix", "hotfix", "patch"]
  refactor: ["refactor", "cleanup", "tech-debt"]
  docs: ["docs", "documentation"]
  test: ["test", "testing"]
  chore: ["chore", "maintenance", "deps"]
  default: "feat"

wave_strategies:
  wave1:
    approach: "Direct fix with agent matching error type"
    agent_selection: "By error code pattern"
  wave2:
    approach: "Root cause analysis, broader context, different agent"
    changes:
      - "Use five-whys mental model"
      - "Expand scope to related files"
      - "Try typescript-expert if type-expert failed"
      - "Check for missing type declarations"
  wave3:
    approach: "Architectural assessment, accept partial fixes"
    changes:
      - "Use inversion mental model"
      - "Identify truly unfixable issues"
      - "Create tracking issues for remaining"
      - "Accept conditional pass"
```

---

## Execution State

Initialize at Phase 1. Update throughout. Reference for decisions.

```javascript
execution_state = {
  issue_id: "{{issueId}}",
  issue_url: null,           // Actual URL from Linear
  mode: "full",              // "ultra_fast" | "fast" | "full"
  start_time: null,
  flags: {
    resume: false,
    push: false,
    simple: false,
    project: null,           // --project=NAME value
    cycle: null,             // --cycle=NAME value (current, next, or specific)
  },

  // Linear associations
  associations: {
    project_id: null,        // Resolved project ID
    cycle_id: null,          // Resolved cycle ID
  },

  // Cache (populate once, reuse)
  cache: {
    files_modified: [],      // From git status, set in Phase 1 step 2
    requirements: [],        // Parsed from issue, set in Phase 1
    error_groups: {},        // By file and type, set in Phase 5
    lsp_symbols: {},         // Symbol cache from LSP
    issue_labels: [],        // For commit type detection
  },

  // Thoughtbox tracking
  thoughtbox: {
    session_id: null,        // CAPTURED from tool response
    thought_count: 0,
    mental_models_used: [],
    branches: []
  },

  // Tracking
  phases_completed: [],
  current_phase: 0,
  total_phases: 8,
  agents_deployed: 0,
  waves_executed: 0,

  // Results
  type_errors: { initial: 0, fixed: 0, remaining: 0 },
  lint_errors: { initial: 0, fixed: 0, remaining: 0 },
  tracking_issues: [],
  commit_hash: null,
  commit_type: "feat",       // Detected from labels

  // Checkpoint (for resume)
  checkpoint: {
    phase: 0,
    timestamp: null,
    resumable: true
  }
}
```

**Update Rule**: After each phase, set `execution_state.phases_completed.push(phase_number)`.

---

## Decision Tables

### Execution Mode Detection

| Condition | Mode | Flow |
|-----------|------|------|
| --simple flag OR ultra_fast keywords & files <= 1 | `ultra_fast` | Phases 1→3→5→8 |
| fast_path keywords or <= 3 requirements | `fast` | Simplified review |
| Otherwise | `full` | All phases |

### Agent Selection by Error Type

| Error Codes | Agent | Use Case |
|-------------|-------|----------|
| TS2xxx (types) | `typescript-type-expert` | Generics |
| Module errors (TS2307/TS2792/TS6xxx) | `typescript-build-expert` | Imports |
| Mixed or general | `typescript-expert` | Default TypeScript expert |
| ESLint, Prettier | `linting-expert` | Style and lint rules |
| Logic, correctness | `code-review-expert` | Business logic validation |

### Detailed TypeScript Error Code Mapping

**Type System Errors → `typescript-type-expert`**

| Code | Description | Common Fix |
|------|-------------|------------|
| TS2304 | Cannot find name | Import or declare |
| TS2322 | Type is not assignable | Fix type mismatch |
| TS2339 | Property does not exist | Add to interface |
| TS2345 | Argument type mismatch | Cast or fix signature |
| TS2352 | Conversion may be a mistake | Use type assertion |
| TS2416 | Property incompatible | Fix override signature |
| TS2531 | Object possibly null | Add null check |
| TS2532 | Object possibly undefined | Add undefined check |
| TS2551 | Did you mean (typo) | Fix property name |
| TS2554 | Expected N args, got M | Fix argument count |
| TS2571 | Object is of type unknown | Narrow with type guard |
| TS2590 | Expression too complex | Simplify type |
| TS2614 | Module has no exported member | Check export name |
| TS2684 | 'this' implicitly has 'any' | Add this type annotation |
| TS2739 | Missing properties | Add required props |
| TS2741 | Property missing in type | Add missing property |
| TS2769 | No overload matches | Fix overload call |
| TS2783 | Mapped type modifier | Fix readonly/optional |
| TS2786 | Cannot be used as JSX | Fix component type |
| TS2802 | Type has no iterator | Add [Symbol.iterator] |
| TS4060 | Return type annotation | Add explicit return type |
| TS18046 | 'unknown' type usage | Add type assertion |

**Module/Import Errors → `typescript-build-expert`**

| Code | Description | Common Fix |
|------|-------------|------------|
| TS1192 | Module has no default export | Use named import |
| TS2307 | Cannot find module | Install package or fix path |
| TS2318 | Cannot find global type | Add to types array |
| TS2354 | File not under rootDir | Fix tsconfig paths |
| TS2688 | Cannot find type definition | Install @types package |
| TS2691 | Import declaration conflicts | Resolve duplicate types |
| TS2792 | Cannot find module (path) | Fix relative import |
| TS2834 | Relative import paths | Use baseUrl or paths |
| TS6059 | rootDir expected to contain | Fix project structure |
| TS6133 | Declared but never used | Remove or use declaration |
| TS6137 | Module already imported | Remove duplicate import |
| TS6196 | Jump target not found | Fix async/await |
| TS6305 | Output file conflict | Fix outDir settings |

**Generic/Advanced Type Errors → `typescript-type-expert`**

| Code | Description | Common Fix |
|------|-------------|------------|
| TS2314 | Generic type requires args | Add type parameters |
| TS2315 | Type is not generic | Remove type parameters |
| TS2344 | Type doesn't satisfy constraint | Fix constraint |
| TS2366 | Return type differs | Unify return types |
| TS2370 | Rest parameter must be array | Use array type |
| TS2393 | Duplicate function impl | Remove duplicate |
| TS2394 | Overload signature mismatch | Fix signature |
| TS2430 | Interface incorrectly extends | Fix interface |
| TS2456 | Type alias circularly references | Break circular ref |
| TS2536 | Type cannot be index type | Fix indexer |
| TS2540 | Cannot assign to readonly | Remove mutation |
| TS2542 | Index signature mismatch | Fix object shape |
| TS2589 | Infinite type instantiation | Simplify generics |
| TS2744 | Type predicate not assignable | Fix type guard |
| TS2775 | Assertions require call | Add assertions |

**React/JSX Errors → `typescript-type-expert` or `typescript-expert`**

| Code | Description | Common Fix |
|------|-------------|------------|
| TS2605 | JSX not in React namespace | Import React |
| TS2607 | JSX must return element | Return valid JSX |
| TS2746 | JSX cannot have children | Remove children |
| TS2786 | Not a valid JSX element | Fix component return |
| TS17004 | JSX namespace not found | Configure JSX |

**ESLint Errors → `linting-expert`**

| Rule Pattern | Category | Action |
|--------------|----------|--------|
| @typescript-eslint/* | TS-specific | Type annotation fixes |
| react/* | React rules | Component patterns |
| import/* | Import order | Reorder imports |
| no-unused-* | Dead code | Remove or use |
| prefer-* | Style | Apply preferred pattern |
| @typescript-eslint/no-explicit-any | Type safety | Add proper types |

### Error Code Decision Flow

```text
Parse error code from output
    │
    ├─ TS2307, TS2792, TS6xxx → typescript-build-expert
    │
    ├─ TS2xxx (most) → typescript-type-expert
    │   └─ Complex generics (TS2589, TS2456) → typescript-type-expert (may need simplification)
    │
    ├─ TS17xxx (JSX) → typescript-type-expert
    │
    ├─ ESLint rules → linting-expert
    │
    └─ Unknown → typescript-expert (general fallback)
```

### Commit Type Detection

| Issue Labels/Title Contains | Commit Prefix |
|-----------------------------|---------------|
| feature, feat, enhancement | `feat` |
| bug, fix, bugfix, hotfix | `fix` |
| refactor, cleanup, tech-debt | `refactor` |
| docs, documentation | `docs` |
| test, testing | `test` |
| chore, maintenance, deps | `chore` |
| (none matched) | `feat` (default) |

### Status Transitions

| Event | Status | Reversible |
|-------|--------|------------|
| Execution starts | In Progress | Yes |
| Blocking dependency found | On Hold | Yes |
| Implementation complete | In Review | Yes |
| Duplicate detected | Duplicate | No |
| Fatal error | Cancelled | No |
| All criteria met | Done | No |

---

## Patterns

Named reusable patterns. Reference as `[PATTERN_NAME]`.

### [LINEAR_CALL]

All Linear MCP calls use retry on transient errors:

1. Call tool
2. IF error matches `linear_mcp.retryable` -> wait (rolling 15-30s) -> retry
3. IF timeout (2 min total) -> STOP with "Linear MCP unavailable"
4. IF non-retryable error -> fail immediately

### [PROGRESS]

Display progress indicator:

```text
[Phase N/8: Phase Name] ████████░░░░░░░░ XX%
```

Update at start of each phase and major milestones.

### [AGENT_DEPLOY]

Parallel agent deployment template:

```text
Task tool with subagent_type: [AGENT_TYPE]
Prompt: "[ACTION] for issue {{issueId}}

Assigned: [FILES or ERRORS]

Deliverables:
1. [SPECIFIC_OUTPUT]
2. Report changes made
3. Use /work:creatework for out-of-scope concerns"
```

For parallel: Send multiple Task calls in single message.

### [PARALLEL_CREATEWORK]

**CRITICAL**: When creating multiple tracking/follow-up issues, use parallel subagents.

Direct `/work:creatework` calls within performwork will FAIL if multiple issues
need to be created. Always use subagents for parallel execution.

**Single issue** (can call directly):

```text
Use Skill tool: skill: "work:creatework", args: "[description]"
```

**Multiple issues** (MUST use parallel subagents):

```text
# Send ALL Task calls in a SINGLE message for parallel execution

Task tool with subagent_type: "work:research-expert"
Prompt: "Execute /work:creatework to create a tracking issue:

Title: [Issue 1 title]
Description: [Issue 1 description]
Link to: {{issueId}}

Create the Linear issue and report the issue ID."

Task tool with subagent_type: "work:research-expert"
Prompt: "Execute /work:creatework to create a tracking issue:

Title: [Issue 2 title]
Description: [Issue 2 description]
Link to: {{issueId}}

Create the Linear issue and report the issue ID."
```

**When to use parallel**:

| Scenario | Count | Approach |
|----------|-------|----------|
| Single discovery during implementation | 1 | Direct Skill call |
| Wave 3 tracking issues (unfixable errors) | 2+ | Parallel subagents |
| Technical debt markers | 2+ | Parallel subagents |
| Follow-up assessment items | 2+ | Parallel subagents |
| Pre-existing test failures | 2+ | Parallel subagents |

### [VALIDATE]

Type check + lint cycle:

1. Run `npm run type-check` OR `npm run typecheck` -> parse errors -> group by file/code
2. Run `npm run lint` -> parse errors -> note auto-fixable
3. Store counts in `execution_state`
4. Report: `"Type: [N] errors in [N] files | Lint: [N] errors, [N] auto-fixable"`

### [CHECKPOINT]

Save state for resume capability:

1. Create checkpoint comment on Linear issue:

   ```markdown
   **Checkpoint: Phase [N]/8 - [Phase Name]**

   Progress: [N]% complete
   Files modified: [list]
   Thoughtbox session: [execution_state.thoughtbox.session_id]
   Type errors: [initial: N, fixed: N, remaining: N]
   Lint errors: [initial: N, fixed: N, remaining: N]

   Remaining phases: [list]

   Resume with: `/work:performwork {{issueId}} --resume`
   ```

2. Update `execution_state.checkpoint`:
   ```javascript
   execution_state.checkpoint = {
     phase: current_phase,
     timestamp: new Date().toISOString(),
     thoughtbox_session_id: execution_state.thoughtbox.session_id,
     files_modified: execution_state.cache.files_modified,
     resumable: true
   }
   ```

### [SERENA_EDIT]

Mandatory for symbol-level code changes:

1. `mcp__serena__get_symbols_overview` -> understand structure
2. `mcp__serena__find_symbol(name_path, include_body: true)` -> get current code
3. **Validate understanding**: `mcp__serena__think_about_collected_information`
4. Edit using:
   - `mcp__serena__replace_symbol_body` for function/method rewrites
   - `mcp__serena__insert_after_symbol` for new code after existing
   - `mcp__serena__insert_before_symbol` for imports, decorators
5. Use `Edit` tool only for: config files, markdown, single-line non-function changes

### [LSP_ANALYZE]

LSP-based code analysis pattern:

1. **Get file symbols:**
   ```yaml
   Tool: LSP
   Parameters:
     operation: "documentSymbol"
     filePath: "[file]"
     line: 1
     character: 1
   ```

2. **Get type information (before editing):**
   ```yaml
   Tool: LSP
   Parameters:
     operation: "hover"
     filePath: "[file]"
     line: [symbol line]
     character: [symbol char]
   ```

3. **Find definition of symbol:**
   ```yaml
   Tool: LSP
   Parameters:
     operation: "goToDefinition"
     filePath: "[file]"
     line: [symbol line]
     character: [symbol char]
   ```

4. **Find all references for impact:**
   ```yaml
   Tool: LSP
   Parameters:
     operation: "findReferences"
     filePath: "[file]"
     line: [symbol line]
     character: [symbol char]
   ```

5. **Get call hierarchy:**
   ```yaml
   Tool: LSP
   Parameters:
     operation: "incomingCalls"  # or "outgoingCalls"
     filePath: "[file]"
     line: [function line]
     character: [function char]
   ```

### [THOUGHTBOX_SESSION]

Initialize and manage Thoughtbox reasoning:

1. **Start session and CAPTURE sessionId:**
   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   Parameters:
     thought: "[INITIAL ANALYSIS]"
     thoughtNumber: 1
     totalThoughts: [estimated]
     nextThoughtNeeded: true
     sessionTitle: "performwork-{{issueId}}"
     sessionTags: ["performwork", "execution", "{{issueId}}"]
   ```

   **CRITICAL**: Store returned `sessionId` in `execution_state.thoughtbox.session_id`

2. **Continue reasoning:**
   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   Parameters:
     thought: "[NEXT REASONING STEP]"
     thoughtNumber: [N]
     totalThoughts: [total]
     nextThoughtNeeded: [true/false]
   ```

3. **Branch for alternatives** (explore multiple approaches):
   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   Parameters:
     thought: "[ALTERNATIVE APPROACH]"
     thoughtNumber: [N]
     branchFromThought: [branch point]
     branchId: "[approach-name]"
     nextThoughtNeeded: true
   ```

4. **Revise earlier thinking** (when new info emerges):
   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   Parameters:
     thought: "[REVISED ANALYSIS based on new information]"
     thoughtNumber: [N]
     isRevision: true
     revisesThought: [thought number to revise]
     nextThoughtNeeded: true
   ```

### [THOUGHTBOX_BRANCHING]

**When to branch:**
- Multiple valid implementation approaches
- Uncertainty about best strategy
- Trade-off decisions (performance vs readability, etc.)

**Example - Branching for implementation approaches:**

```yaml
# Original thought (thought 3): Implementation approach
thought: "DECOMPOSITION: Three possible approaches for implementing [feature]:
1. Direct modification of existing class
2. New service with dependency injection
3. Decorator pattern wrapping existing logic"

# Branch A - Direct modification
Tool: mcp__thoughtbox__thoughtbox
Parameters:
  thought: "BRANCH A - Direct Modification Analysis:

  PROS:
  - Minimal code changes
  - No new files
  - Existing tests mostly applicable

  CONS:
  - Increases class complexity
  - May violate single responsibility
  - Harder to test in isolation

  Implementation effort: Low
  Risk level: Medium"
  thoughtNumber: 4
  branchFromThought: 3
  branchId: "direct-modification"
  nextThoughtNeeded: true

# Branch B - New service (parallel call)
Tool: mcp__thoughtbox__thoughtbox
Parameters:
  thought: "BRANCH B - New Service Analysis:

  PROS:
  - Clean separation of concerns
  - Easy to test
  - Follows existing patterns

  CONS:
  - More files to create
  - Requires DI configuration
  - Migration of existing callers

  Implementation effort: Medium
  Risk level: Low"
  thoughtNumber: 4
  branchFromThought: 3
  branchId: "new-service"
  nextThoughtNeeded: true
```

### [THOUGHTBOX_REVISION]

**When to revise:**
- LSP analysis reveals unexpected dependencies
- Code review finds issues not anticipated
- Wave 1 failures reveal root cause was different than assumed
- New requirements discovered during implementation

**Example - Revising after LSP discovery:**

```yaml
# Original thought (thought 2): Assumed isolated change
thought: "ANALYSIS: This change appears isolated to AuthService.
Single file modification expected."

# Later: LSP findReferences shows 15 callers
# Revision needed:
Tool: mcp__thoughtbox__thoughtbox
Parameters:
  thought: "REVISION of thought 2 based on LSP analysis:

  ORIGINAL ASSUMPTION: Isolated change to AuthService
  NEW INFORMATION: 15 callers found via LSP findReferences

  IMPACT:
  - Must verify each caller handles new return type
  - Potential for breaking changes in 5+ files
  - Complexity upgraded: simple → moderate

  UPDATED STRATEGY:
  1. Create backward-compatible wrapper
  2. Migrate callers incrementally
  3. Add deprecation warnings"
  thoughtNumber: 6
  isRevision: true
  revisesThought: 2
  nextThoughtNeeded: true
```

**Example - Revising after Wave 1 failure:**

```yaml
# Revision after Wave 1 didn't fix errors
Tool: mcp__thoughtbox__thoughtbox
Parameters:
  thought: "REVISION: Wave 1 failure analysis

  ORIGINAL ASSUMPTION: Type errors due to missing interface properties
  ACTUAL ROOT CAUSE: Circular dependency between modules

  Evidence from Wave 1:
  - TS2307 errors persisted after adding properties
  - Import order matters (fails in some orders)
  - Type-only imports work, runtime imports fail

  CORRECTED STRATEGY for Wave 2:
  1. Break circular dependency with interface extraction
  2. Move shared types to common module
  3. Use type-only imports where possible"
  thoughtNumber: 8
  isRevision: true
  revisesThought: 5
  nextThoughtNeeded: true
```

### [CONTEXT7_LOOKUP]

Documentation lookup for unfamiliar libraries:

1. **Resolve library ID:**
   ```yaml
   Tool: mcp__context7__resolve-library-id
   Parameters:
     libraryName: "[library name, e.g., 'react', 'vue', 'express']"
     query: "[what you need to know]"
   ```

2. **Query documentation:**
   ```yaml
   Tool: mcp__context7__query-docs
   Parameters:
     libraryId: "[id from step 1, e.g., '/facebook/react']"
     query: "[specific question about the library]"
   ```

### [SENTRY_LOOKUP]

Error context for error-fix issues:

1. **Find organization:**
   ```yaml
   Tool: mcp__sentry__find_organizations
   Parameters: {}
   ```

   Store org slug for subsequent calls.

2. **Search for related issues:**
   ```yaml
   Tool: mcp__sentry__search_issues
   Parameters:
     organizationSlug: "[org from step 1]"
     query: "[error message or pattern]"
   ```

3. **Get issue details:**
   ```yaml
   Tool: mcp__sentry__get_issue_details
   Parameters:
     issueId: "[issue id from search]"
   ```

---

## Execution Phases

### Phase 1: Initialize

**[PROGRESS]**: `[Phase 1/8: Initialize] ██░░░░░░░░░░░░░░ 12%`

**GATE**: Issue ID provided

**DO**:

1. **Parse flags**:
   ```text
   IF "--resume" in arguments: execution_state.flags.resume = true
   IF "--push" in arguments: execution_state.flags.push = true
   IF "--simple" in arguments: execution_state.flags.simple = true
   IF "--project=VALUE" in arguments: execution_state.flags.project = VALUE
   IF "--cycle=VALUE" in arguments: execution_state.flags.cycle = VALUE
   ```

2. **Cache file list FIRST** (needed for mode detection):

   ```bash
   git status --porcelain | grep -E "^[AMDR]" | awk '{print $2}'
   ```

   Store in `execution_state.cache.files_modified`

   **Note**: Use `git status --porcelain` NOT `git diff --name-only HEAD`

3. **Check for resume**:
   ```text
   IF flags.resume OR previous checkpoint exists:
     -> Parse last checkpoint from Linear comments
     -> Set execution_state from checkpoint
     -> SKIP to checkpoint.phase + 1
   ```

4. **Fetch issue** using [LINEAR_CALL]:

   ```yaml
   Tool: mcp__linear__get_issue
   Parameters: { id: "{{issueId}}" }
   ```

   IF not found -> STOP "Issue {{issueId}} not found"

   **Store**:
   - `execution_state.issue_url` = issue.url
   - `execution_state.cache.issue_labels` = issue.labels

5. **Detect commit type** from labels:
   ```text
   FOR each label in issue.labels:
     IF label.name matches commit_types.feature -> commit_type = "feat"
     IF label.name matches commit_types.fix -> commit_type = "fix"
     IF label.name matches commit_types.refactor -> commit_type = "refactor"
     ...

   Store in execution_state.commit_type
   ```

6. **Resolve project** (if --project flag):

   **IF `execution_state.flags.project` is set:**

   ```yaml
   Tool: mcp__linear__list_projects
   Parameters:
     query: "[project name from flag]"
     limit: 5
   ```

   Store: `execution_state.associations.project_id = [matched project ID]`

   **Update issue with project:**
   ```yaml
   Tool: mcp__linear__update_issue
   Parameters:
     id: "{{issueId}}"
     project: "[project ID]"
   ```

7. **Resolve cycle** (if --cycle flag):

   **IF `execution_state.flags.cycle` is set:**

   ```yaml
   # Detect team from issue first
   team_id = [from fetched issue]

   # Get cycles
   Tool: mcp__linear__list_cycles
   Parameters:
     teamId: "[team_id]"
     type: [if "current" or "next", use as type; otherwise omit]
   ```

   **Cycle resolution:**
   - `--cycle=current` -> use type: "current"
   - `--cycle=next` -> use type: "next"
   - `--cycle=NAME` -> search by name in all cycles

   Store: `execution_state.associations.cycle_id = [matched cycle ID]`

   **Update issue with cycle:**
   ```yaml
   Tool: mcp__linear__update_issue
   Parameters:
     id: "{{issueId}}"
     cycle: "[cycle ID]"
   ```

8. **Detect execution mode** (uses file count from step 2):

   ```text
   IF flags.simple OR (ultra_fast keywords AND files <= 1):
     mode = "ultra_fast"
   ELSE IF fast_path keywords OR requirements <= 3:
     mode = "fast"
   ELSE:
     mode = "full"
   ```

   Store in `execution_state.mode`

9. **Display pre-execution summary**:

   ```text
   ═══════════════════════════════════════════════
   EXECUTING: {{issueId}}
   ═══════════════════════════════════════════════
   Title: [title]
   Type: [commit_type] | Priority: [priority]
   Mode: [execution_state.mode]
   Files detected: [count from cache]

   Associations:
   ├─ Project: [project name or "None"]
   └─ Cycle: [cycle name or "None"]

   Estimated time: [ultra_fast: 2min | fast: 5min | full: 15-30min]

   Flags: [--resume] [--push] [--simple] [--project] [--cycle]
   ═══════════════════════════════════════════════
   ```

   **SKIP Thoughtbox if mode = ultra_fast or flags.simple**

10. **Initialize Thoughtbox session** (SKIP if ultra_fast/simple):

   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   thought: "INITIALIZING: Issue {{issueId}} - '[title]'

   TASK DECOMPOSITION:
   1. Parse requirements from description
   2. Execution mode: [mode]
   3. Files to change: [from cache]
   4. Complexity assessment

   Beginning analysis..."
   thoughtNumber: 1
   totalThoughts: 12
   nextThoughtNeeded: true
   sessionTitle: "performwork-{{issueId}}"
   sessionTags: ["performwork", "execution"]
   ```

   **CRITICAL**: Capture `sessionId` from response -> `execution_state.thoughtbox.session_id`

11. **Parse and cache requirements**:
   - Extract checkboxes/bullets from description
   - Store in `execution_state.cache.requirements`
   - IF none found -> use title as single requirement

12. **Check for Sentry context** (if error-fix issue):

    Use [SENTRY_LOOKUP] pattern if description mentions error pattern.

13. **Update status** using [LINEAR_CALL]:

    ```yaml
    Tool: mcp__linear__update_issue
    Parameters: { id: "{{issueId}}", state: "In Progress" }
    ```

**STATE_UPDATE**: `phases_completed.push(1)`, `current_phase = 1`

**NEXT**:
- IF mode = "ultra_fast" -> Phase 3
- IF mode = "fast" -> Phase 2 (skip orchestration)
- IF mode = "full" -> Phase 2

---

### Phase 2: Analyze

**[PROGRESS]**: `[Phase 2/8: Analyze] ████░░░░░░░░░░░░ 25%`

**GATE**: Phase 1 complete

**SKIP IF**: mode = "ultra_fast"

**DO**:

1. **Orchestration planning with Thoughtbox** (SKIP if mode = "fast"):

   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   thought: "ORCHESTRATION PLANNING:

   Issue: {{issueId}} - '[title]'
   Requirements: [count]
   Files: [from cache]

   DECOMPOSITION:
   1. Files to modify: [list]
   2. Error volume estimate: [based on complexity]
   3. Module boundaries: [cross-cutting concerns?]
   4. Parallel agent strategy: [when to deploy multiple]

   PRE-MORTEM (imagining failure):
   - Scope creep risk: [assess]
   - Integration conflicts: [assess]
   - Type system challenges: [assess]

   Strategy: [recommended approach]"
   thoughtNumber: 2
   totalThoughts: 12
   nextThoughtNeeded: true
   ```

2. **Run LSP and Serena analysis in PARALLEL**:

   ```text
   # Send both in single message for parallel execution

   # LSP Analysis
   Tool: LSP
   Parameters:
     operation: "documentSymbol"
     filePath: "[first relevant file]"
     line: 1
     character: 1

   # Serena Analysis
   Tool: mcp__serena__get_symbols_overview
   Parameters: { relative_path: "[relevant file]" }
   ```

   Store symbols in `execution_state.cache.lsp_symbols`

3. **Use LSP hover for type context**:

   For key symbols that will be modified:
   ```yaml
   Tool: LSP
   Parameters:
     operation: "hover"
     filePath: "[file]"
     line: [symbol line]
     character: [symbol char]
   ```

4. **Documentation lookup** (if unfamiliar libraries):

   Use [CONTEXT7_LOOKUP] pattern:
   ```yaml
   Tool: mcp__context7__resolve-library-id
   Parameters:
     libraryName: "[library mentioned in issue]"
     query: "How to [relevant task from requirements]"
   ```

5. **Validate collected information**:

   ```yaml
   Tool: mcp__serena__think_about_collected_information
   Parameters: {}
   ```

6. **Impact analysis with LSP** (for modifications):

   ```yaml
   Tool: LSP
   Parameters:
     operation: "findReferences"
     filePath: "[file]"
     line: [function line]
     character: [function char]
   ```

7. **Report analysis**:

   ```text
   Analysis Complete:
   - Files to modify: [list]
   - Symbols discovered: [count] via LSP
   - Type info gathered: [count] hover results
   - Complexity: [simple|moderate|complex]
   - Parallel agents planned: [count]
   ```

**STATE_UPDATE**: `phases_completed.push(2)`, `current_phase = 2`

**NEXT**: Phase 3

---

### Phase 3: Implement

**[PROGRESS]**: `[Phase 3/8: Implement] ██████░░░░░░░░░░ 37%`

**GATE**: Phase 2 complete (or Phase 1 if ultra_fast)

**DO**:

1. **Choose implementation approach**:

   | Complexity | Approach |
   |------------|----------|
   | Simple, files known | Direct implementation |
   | Moderate | Single feature-dev agent |
   | Complex, architectural | feature-dev:code-architect agent |

2. **Direct implementation** (simple cases):
   - Use [SERENA_EDIT] for all symbol-level changes
   - Use [LSP_ANALYZE] for navigation and impact checking
   - **Use LSP hover before editing** to understand types
   - Use `Edit` tool only for config/markdown
   - Explain changes with file:line references

3. **LSP-guided implementation** (for modifications):

   Before editing, get type info:
   ```yaml
   Tool: LSP
   Parameters:
     operation: "hover"
     filePath: "[file]"
     line: [symbol line]
     character: [symbol char]
   ```

   Check callers:
   ```yaml
   Tool: LSP
   Parameters:
     operation: "incomingCalls"
     filePath: "[file]"
     line: [function line]
     character: [function char]
   ```

4. **Agent-based implementation** (moderate/complex):

   ```yaml
   Task tool with subagent_type: "feature-dev:code-architect"
   Prompt: "Implement requirements for {{issueId}}: [title]

   Requirements:
   [list from cache]

   LSP Analysis:
   - Symbols: [from cache]
   - Type info: [from hover]
   - Call hierarchy: [from LSP analysis]

   Deliverables:
   1. Architecture design
   2. Implementation plan
   3. File changes with rationale"
   ```

5. **Discovery tracking**:

   ```text
   IF new issue discovered during implementation:
     -> Single discovery: Use Skill tool with skill: "work:creatework"
     -> Multiple discoveries: Use [PARALLEL_CREATEWORK] pattern
     -> Link to current issue
     -> Report created issue ID(s)

   IF blocking dependency found:
     -> Update status to "On Hold" using [LINEAR_CALL]
     -> Create comment explaining blocker
     -> STOP "Blocked by [BLOCKER-ID]"
   ```

6. **Update file cache**:

   ```bash
   git status --porcelain | grep -E "^[AMDR]" | awk '{print $2}'
   ```

   Update `execution_state.cache.files_modified`

**STATE_UPDATE**: `phases_completed.push(3)`, `current_phase = 3`

**CHECKPOINT**: Apply [CHECKPOINT] pattern

**NEXT**: Phase 4

---

### Phase 4: Review

**[PROGRESS]**: `[Phase 4/8: Review] ████████░░░░░░░░ 50%`

**GATE**: Phase 3 complete, TypeScript/JavaScript files modified

**SKIP IF**: No .ts/.tsx/.js/.jsx/.vue files in `cache.files_modified`

**DO**:

1. **Count files** from cache:

   ```javascript
   ts_files = cache.files_modified.filter(f => /\.(ts|tsx|js|jsx|vue)$/.test(f))
   ```

2. **LSP pre-review analysis**:

   For each modified file:
   ```yaml
   Tool: LSP
   Parameters:
     operation: "documentSymbol"
     filePath: "[modified file]"
     line: 1
     character: 1
   ```

   Identify new/changed symbols for targeted review.

3. **Deploy reviewers** based on count:

   | Files | Strategy |
   |-------|----------|
   | 1-3 | Single typescript-expert |
   | 4-6 | 2 typescript-expert agents parallel |
   | 7-12 | 3 typescript-expert agents parallel |
   | 13+ | 4+ agents (1 per 3-4 files) |

4. **Parallel deployment** using [AGENT_DEPLOY]:

   ```text
   # Single message, multiple Task calls

   Agent 1 - typescript-expert:
   "Review TypeScript code for {{issueId}} (Agent 1/[N])

   Files: [subset 1]
   Symbols to focus on: [from LSP analysis]

   Deliverables:
   1. Type safety and best practices
   2. Error handling and edge cases
   3. Implement improvements directly
   4. Report: changes made, issues found"

   Agent 2 - typescript-expert:
   "Review TypeScript code for {{issueId}} (Agent 2/[N])

   Files: [subset 2]
   ..."
   ```

5. **Aggregate results**:
   - Collect changes from each agent
   - Note any issues flagged for tracking
   - Update `execution_state.agents_deployed`

6. **Report**:

   ```text
   Code Review Complete
   - Agents: [N] parallel
   - Files reviewed: [N]
   - Symbols analyzed: [N] via LSP
   - Improvements made: [summary]
   ```

**STATE_UPDATE**: `phases_completed.push(4)`, `current_phase = 4`

**NEXT**: Phase 5

---

### Phase 5: Resolve Errors

**[PROGRESS]**: `[Phase 5/8: Resolve Errors] ██████████░░░░░░ 62%`

**GATE**: Phase 4 complete (or Phase 3 if no TS files)

**DO**:

#### 5.1 Type Checking

1. **Run typecheck**:

   ```bash
   npm run type-check 2>&1 || npm run typecheck 2>&1
   ```

2. **Parse and cache errors**:
   - Count total, group by file, group by error code
   - Store in `execution_state.cache.error_groups`
   - Set `execution_state.type_errors.initial`

3. **Report**:

   ```text
   Type Check: [N] errors in [N] files
   Top codes: [TS2xxx: N, TS2yyy: M, ...]
   ```

4. **IF errors = 0** -> skip to 5.2

5. **Wave 1** - Deploy agents (see Decision Table):

   | Errors | Files | Action |
   |--------|-------|--------|
   | < 20 | Any | Single agent |
   | >= 20 | Any | 2 parallel agents |
   | >= 50 | Any | 3 parallel agents |
   | Any | > 5 | 2 agents by file grouping |

   Deploy using [AGENT_DEPLOY] with appropriate agent type.

6. **Re-validate**:

   ```bash
   npm run type-check 2>&1 || npm run typecheck 2>&1
   ```

   Update `execution_state.type_errors`

7. **Wave 2** (IF errors remain):

   **Strategy changes from Wave 1** (see config wave_strategies.wave2):

   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   thought: "FIVE-WHYS ANALYSIS for persistent type errors:

   Wave 1 result: [N] agents deployed, [M] errors remain

   WHY 1: Why are these errors unfixed?
   - [Analysis of remaining errors]

   WHY 2: Why did the initial fix attempt fail?
   - [Root cause analysis]

   WHY 3: Why wasn't this caught earlier?
   - [Process gap identification]

   WHY 4: Why is this error pattern occurring?
   - [Underlying structural issue]

   WHY 5: What's the fundamental issue?
   - [Core problem identification]

   WAVE 2 STRATEGY CHANGES:
   - Expand scope to related files: [list]
   - Switch agent type: [if type-expert failed, try expert]
   - Check for missing declarations: [yes/no]
   - Use broader context: [related modules]"
   thoughtNumber: [N]
   totalThoughts: 12
   nextThoughtNeeded: true
   ```

   Deploy Wave 2 with different strategy -> Re-validate

8. **Wave 3 / Circuit Breaker** (IF still errors after Wave 2):

   **Strategy changes** (see config wave_strategies.wave3):

   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   thought: "INVERSION ANALYSIS: What would make these errors UNFIXABLE?

   Remaining errors: [N]

   INVERSION (paths to failure):
   1. Architectural incompatibility: [assess]
   2. Third-party type definitions: [assess]
   3. Circular dependencies: [assess]
   4. Missing type declarations: [assess]

   VERDICT:
   - Truly architectural (track): [list]
   - Fixable with more effort (try once more): [list]
   - Third-party issues (track): [list]

   RECOMMENDATION: [specific action for each category]"
   thoughtNumber: [N]
   totalThoughts: 12
   nextThoughtNeeded: true
   ```

   - IF architectural -> create tracking issues using [PARALLEL_CREATEWORK]
   - IF fixable -> one more targeted attempt
   - IF third-party -> create tracking issue, note in completion

   After Wave 3: Force create tracking issues for remaining errors.

9. **Quality Gate**:

   ```text
   Type Errors: [0 | N remaining, tracked in TRG-xxx]
   Status: [PASS | CONDITIONAL PASS]
   ```

   IF errors > 0 AND no tracking issues -> STOP "Quality gate blocked"

#### 5.2 Linting

1. **Auto-fix first**:

   ```bash
   npm run lint -- --fix 2>&1 || npm run lint:fix 2>&1
   ```

2. **Re-check**:

   ```bash
   npm run lint 2>&1
   ```

   Parse errors, store in `execution_state.lint_errors`

3. **IF errors = 0** -> skip to Phase 6

4. **Deploy linting agents** (if errors >= 30):
   - Group by file or rule type
   - Deploy parallel linting-expert agents

5. **Re-validate** -> Wave 2 if needed

6. **Quality Gate**:

   ```text
   Linting: [PASS | N warnings only | BLOCKED]
   ```

   IF ERROR-level issues remain AND no tracking -> STOP

**STATE_UPDATE**: `phases_completed.push(5)`, `current_phase = 5`

**CHECKPOINT**: Apply [CHECKPOINT] pattern

**NEXT**: Phase 6

---

### Phase 6: Validate

**[PROGRESS]**: `[Phase 6/8: Validate] ████████████░░░░ 75%`

**GATE**: Phase 5 complete with quality gates passed

**DO**:

#### 6.1 Tests

1. **Check for test script**:

   ```bash
   npm run test --if-present 2>&1
   ```

   **Note**: Use `npm run test --if-present` NOT `npm test --if-present`

2. **Report**:

   ```text
   Tests: [PASS | N failed | No tests configured]
   ```

3. IF tests fail -> assess if related to changes:
   - Single pre-existing failure: Direct Skill call to /work:creatework
   - Multiple pre-existing failures: Use [PARALLEL_CREATEWORK] pattern

#### 6.2 Business Logic Validation

**SKIP IF**: mode = "ultra_fast" OR only simple changes

1. **Identify functions to validate using LSP**:

   ```yaml
   Tool: LSP
   Parameters:
     operation: "documentSymbol"
     filePath: "[modified file]"
     line: 1
     character: 1
   ```

   Compare with pre-implementation symbols to identify changes.

2. **Deploy validation** (if complex functions):

   ```yaml
   Task tool with subagent_type: "code-review-expert"
   Prompt: "Validate business logic for {{issueId}}

   Functions: [list with file:line]
   Requirements: [from cache]
   LSP context: [relevant symbols and call hierarchy]

   Check: Logic correctness, edge cases, requirement alignment"
   ```

3. **Handle issues found**:
   - Critical -> fix immediately -> re-run Phase 5 validation
   - Non-critical -> create tracking issue (use [PARALLEL_CREATEWORK] if multiple)

4. **Quality Gate**:

   ```text
   Business Logic: [PASS | Issues tracked]
   ```

**STATE_UPDATE**: `phases_completed.push(6)`, `current_phase = 6`

**NEXT**: Phase 7

---

### Phase 7: Verify

**[PROGRESS]**: `[Phase 7/8: Verify] ██████████████░░ 87%`

**GATE**: Phase 6 complete

**DO**:

#### 7.1 File Change Verification

1. **Compare intended vs actual**:

   ```bash
   git status --porcelain
   ```

2. **Verify**:
   - All intended files modified? Y/N
   - No unintended files? Y/N
   - No unstaged changes? Y/N

#### 7.2 Technical Debt Scan

1. **Scan for introduced markers**:

   ```bash
   git diff HEAD | grep -E "^\+.*(TODO|FIXME|HACK|XXX)" || echo "None"
   ```

2. **For each marker**:
   - Pre-existing? -> ignore
   - Intentional deferral? -> create tracking issue
   - Oversight? -> fix now

   **Note**: If multiple intentional deferrals, use [PARALLEL_CREATEWORK] pattern.

#### 7.3 Requirement Verification

1. **Check each requirement** from `cache.requirements`:
   - Complete
   - Partial -> document limitation
   - Not addressed -> fix or escalate

2. **Report**:

   ```text
   Requirements: [N/M] complete
   ```

#### 7.4 Follow-up Assessment with Thoughtbox

```yaml
Tool: mcp__thoughtbox__thoughtbox
thought: "FOLLOW-UP ASSESSMENT using INVERSION:

Implementation complete for {{issueId}}.

INVERSION: What would make this implementation FAIL in production?
1. Missing edge cases: [assess]
2. Performance under load: [assess]
3. Security vulnerabilities: [assess]
4. Integration issues: [assess]
5. Documentation gaps: [assess]

IDENTIFIED FOLLOW-UPS:
- HIGH priority (must track): [list]
- MEDIUM priority (should track): [list]
- LOW priority (document only): [list]

TECHNICAL DEBT:
- Introduced: [list any TODOs/FIXMEs]
- Pre-existing discovered: [list]

RECOMMENDATIONS:
[specific actions needed]"
thoughtNumber: [N]
totalThoughts: 12
nextThoughtNeeded: true
```

For each follow-up item:
- HIGH priority -> create tracking issue
- MEDIUM -> create tracking issue
- LOW -> document only if substantial

**IMPORTANT**: If 2+ follow-up issues identified, use [PARALLEL_CREATEWORK] pattern.

**Report**:

```text
Follow-up Issues: [N] created
- [TRG-xxx]: [title]
- [TRG-yyy]: [title]
```

#### 7.5 Verification Checklist

```text
VERIFICATION CHECKLIST
[x] All files modified as intended
[x] No unstaged changes
[x] Type checking passed (or tracked)
[x] Linting passed (or tracked)
[x] Tests passed (or tracked)
[x] All requirements addressed
[x] Technical debt documented
[x] Follow-up issues created
```

IF any item fails -> remediate before proceeding

**STATE_UPDATE**: `phases_completed.push(7)`, `current_phase = 7`

**CHECKPOINT**: Apply [CHECKPOINT] pattern

**NEXT**: Phase 8

---

### Phase 8: Complete

**[PROGRESS]**: `[Phase 8/8: Complete] ████████████████ 100%`

**GATE**: Phase 7 verification passed

**DO**:

#### 8.1 Git Commit

1. **Stage changes**:

   ```bash
   git add -A
   ```

2. **Create commit** (using detected commit_type):

   ```bash
   git commit -m "$(cat <<'EOF'
   [COMMIT_TYPE]({{issueId}}): [summary from title]

   ## Changes
   - [file1]: [change description]
   - [file2]: [change description]

   ## Validation
   - Type checking: PASS
   - Linting: PASS
   - Tests: [status]

   ## Analysis
   - Thoughtbox session: [session_id]
   - Mental models used: [list]
   - LSP symbols analyzed: [count]

   Resolves: {{issueId}}

   Generated with [Claude Code](https://claude.com/claude-code) /work:performwork

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

   **Note**: Replace `[COMMIT_TYPE]` with `execution_state.commit_type` (feat/fix/refactor/etc.)

3. **Handle pre-commit hook**:
   IF hook modifies files -> `git add -A && git commit --amend --no-edit`

4. **Store commit hash**:

   ```bash
   git rev-parse --short HEAD
   ```

   Set `execution_state.commit_hash`

#### 8.2 Auto-Push and PR (if --push flag)

IF `execution_state.flags.push`:

1. **Push to remote**:

   ```bash
   git push -u origin HEAD
   ```

2. **Create PR**:

   ```bash
   gh pr create --title "[COMMIT_TYPE]({{issueId}}): [title]" --body "$(cat <<'EOF'
   ## Summary
   Implements {{issueId}}: [title]

   ## Changes
   - [summary of changes]

   ## Validation
   - Type checking: PASS
   - Linting: PASS
   - Tests: [status]

   Resolves: {{issueId}}

   Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

#### 8.3 Linear Update

1. **Finalize Thoughtbox session**:

   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   thought: "SYNTHESIS: Issue {{issueId}} execution complete.

   SUMMARY:
   - Requirements completed: [N/M]
   - Files modified: [N]
   - Type errors fixed: [N]
   - Agents deployed: [N]
   - Waves executed: [N]

   MENTAL MODELS APPLIED:
   - decomposition: Orchestration planning
   - five-whys: Error resolution
   - inversion: Follow-up assessment

   LSP ANALYSIS:
   - Symbols discovered: [N]
   - Hover info gathered: [N]
   - References analyzed: [N]

   OUTCOME: [SUCCESS / PARTIAL SUCCESS]
   - Commit: [hash]
   - PR: [if --push]
   - Tracking issues: [list]

   Session complete."
   thoughtNumber: 12
   totalThoughts: 12
   nextThoughtNeeded: false
   ```

2. **Create completion comment** using [LINEAR_CALL]:

   ```yaml
   Tool: mcp__linear__create_comment
   Parameters:
     issueId: "{{issueId}}"
     body: |
       ## Execution Complete

       - Requirements: [N/M] complete
       - Files modified: [N]
       - Type errors fixed: [N]
       - Commit: `[hash]`

       ## Analysis
       - Thoughtbox session: [session_id]
       - Mental models: [list]
       - LSP symbols: [count]

       ## Follow-up Issues
       - [list any created]

       ---
       Generated with Claude Code /work:performwork
   ```

3. **Update status** (only if ALL criteria met):

   ```yaml
   Tool: mcp__linear__update_issue
   Parameters: { id: "{{issueId}}", state: "Done" }
   ```

   IF not all met -> keep current state, report what's missing

#### 8.4 Final Report

```text
═══════════════════════════════════════════════════════════════
{{issueId}} COMPLETE
═══════════════════════════════════════════════════════════════

Requirements: [N/M] complete
Files: [N] modified
Type Check: [PASS]
Linting: [PASS]
Tests: [status]
Commit: [hash]
PR: [url if --push]
Follow-ups: [N] issues created

Thoughtbox Analysis:
- Session: [session_id]
- Thoughts: [count]
- Mental models: [list]

LSP Analysis:
- Symbols discovered: [count]
- Type info gathered: [count]
- References analyzed: [count]

Issue URL: [actual URL from execution_state.issue_url]
═══════════════════════════════════════════════════════════════
```

**STATE_UPDATE**: `phases_completed.push(8)`, execution complete

---

## Resume Flow

When `--resume` flag is provided or checkpoint detected:

1. **Parse checkpoint** from Linear comments:
   ```text
   Search for comment matching: "**Checkpoint: Phase [N]/8"
   Extract:
   - phase: [N]
   - files_modified: [list from comment]
   - thoughtbox_session_id: [if stored]
   ```

2. **Restore state** including LSP cache if available:
   ```javascript
   execution_state.current_phase = checkpoint.phase
   execution_state.cache.files_modified = checkpoint.files_modified
   execution_state.thoughtbox.session_id = checkpoint.thoughtbox_session_id
   ```

3. **Restore Thoughtbox context** (if session_id available):
   ```yaml
   Tool: mcp__thoughtbox__thoughtbox
   Parameters:
     thought: "RESUMING: Session restored for {{issueId}}

     Resuming from Phase [N].
     Previous state: [summary from checkpoint]

     Continuing execution..."
     thoughtNumber: [last + 1]
     totalThoughts: 12
     nextThoughtNeeded: true
     sessionTitle: "performwork-{{issueId}}"  # Same title reconnects session
     sessionTags: ["performwork", "resume"]
   ```

4. **Skip to next phase**: `execution_state.current_phase + 1`

5. **Report**:
   ```text
   Resuming from Phase [N] - [remaining phases]
   Previous session: [thoughtbox_session_id or "new session"]
   Files tracked: [count]
   ```

**Note**: Thoughtbox sessions are identified by `sessionTitle`. Using the same title
reconnects to the existing reasoning chain.

---

## Error Handling

| Scenario | Action | Fatal |
|----------|--------|-------|
| Linear MCP timeout | Report + STOP | Yes |
| Issue not found | Report | Yes |
| Status update fails | Log warning, continue | No |
| Typecheck won't run | Report, suggest npm install | Yes |
| Lint won't run | Report, continue if optional | Conditional |
| Wave 3 still has errors | Create tracking issues | No |
| Agent fails | Retry once, then escalate | Conditional |
| Business logic issue | Fix or track | Conditional |
| Commit fails | Report, manual commit needed | No |
| LSP unavailable | Fall back to Serena, note in report | No |
| Thoughtbox fails | Continue with simpler analysis | No |
| Context7 unavailable | Deploy research-expert agent | No |
| Sentry unavailable | Skip error context, note in report | No |

---

## Final Reminder

**Execution Confirmation**:

- [ ] Called Linear MCP to fetch issue?
- [ ] Cached files BEFORE mode detection?
- [ ] Captured Thoughtbox sessionId?
- [ ] Used LSP hover for type information?
- [ ] Used Context7 for unfamiliar libraries?
- [ ] Used correct commit type (feat/fix/refactor)?
- [ ] Showed progress indicators?
- [ ] Displayed actual issue URL in final report?
- [ ] Created PR if --push flag?

### IF you read this without executing -> GO BACK AND EXECUTE
