---
description: Execute Linear issues with zero-error enforcement, mandatory validation, and truthful documentation
argument-hint: [issueId] [--resume]
---

# Execute Linear Issue

Execute issue `{{issueId}}` with requirement adherence, type safety, and verified completion.

> **CRITICAL**: This is an EXECUTABLE command. Call the MCP tools. Make the edits. Run the validations. Do not just read and acknowledge.

---

## §1 Configuration

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

sequential_thinking:
  # TIER 1: Always use (critical decisions)
  tier1: ["orchestration_strategy", "follow_up_assessment", "escape_hatch"]
  # TIER 2: Use if complexity > simple
  tier2: ["wave_failure_analysis", "business_logic_assessment"]
  # TIER 3: Skip for fast-path
  tier3: ["requirement_analysis", "code_review_strategy"]
```

---

## §2 Execution State

Initialize at Phase 1. Update throughout. Reference for decisions.

```javascript
execution_state = {
  issue_id: "{{issueId}}",
  mode: "full",              // "ultra_fast" | "fast" | "full"
  start_time: null,

  // Cache (populate once, reuse)
  cache: {
    files_modified: [],      // From git diff, set in Phase 1
    requirements: [],        // Parsed from issue, set in Phase 1
    error_groups: {},        // By file and type, set in Phase 5
  },

  // Tracking
  phases_completed: [],
  agents_deployed: 0,
  waves_executed: 0,

  // Results
  type_errors: { initial: 0, fixed: 0, remaining: 0 },
  lint_errors: { initial: 0, fixed: 0, remaining: 0 },
  tracking_issues: [],
  commit_hash: null,

  // Checkpoint (for resume)
  checkpoint: {
    phase: 0,
    timestamp: null,
    resumable: true
  }
}
```

**Update Rule**: After each phase, set `execution_state.phases_completed.push(phase_number)` and `execution_state.checkpoint.phase = phase_number`.

---

## §3 Decision Tables

### 3.1 Execution Mode Detection

| Condition | Mode | Flow |
|-----------|------|------|
| Title matches ultra_fast.keywords AND expected files ≤ 1 | `ultra_fast` | Phases 1→3→5→8 |
| Title matches fast_path.keywords OR requirements ≤ 3 | `fast` | Skip orchestration, simplified review |
| Otherwise | `full` | All phases |

### 3.2 Agent Selection by Error Type

| Error Codes | Agent | Use Case |
|-------------|-------|----------|
| TS2344, TS2536, TS2589, TS2xxx (type system) | `typescript-type-expert` | Generics, recursion, complex types |
| TS2307, TS2792, TS6xxx (module) | `typescript-build-expert` | Imports, resolution, config |
| Mixed or general | `typescript-expert` | Default for TypeScript issues |
| ESLint, Prettier | `linting-expert` | Style and lint rules |
| Logic, correctness | `code-review-expert` | Business logic validation |

### 3.3 Error Escalation Path

```
Wave 1 fails → Wave 2 (different strategy) → Wave 3 (architectural assessment)
                                                        ↓
                                               Create tracking issues
                                                        ↓
                                               Quality Gate: CONDITIONAL PASS
```

### 3.4 Status Transitions

| Event | Status | Reversible |
|-------|--------|------------|
| Execution starts | In Progress | Yes |
| Blocking dependency found | On Hold | Yes |
| Implementation complete | In Review | Yes |
| Duplicate detected | Duplicate | No |
| Fatal error | Cancelled | No |
| All criteria met | Done | No |

---

## §4 Patterns

Named reusable patterns. Reference as `[PATTERN_NAME]`.

### [LINEAR_CALL]

All Linear MCP calls use retry on transient errors:
1. Call tool
2. IF error matches `linear_mcp.retryable` → wait (rolling 15-30s) → retry
3. IF timeout (2 min total) → STOP with "Linear MCP unavailable"
4. IF non-retryable error → fail immediately

### [AGENT_DEPLOY]

Parallel agent deployment template:
```
Task tool with subagent_type: [AGENT_TYPE]
Prompt: "[ACTION] for issue {{issueId}}

Assigned: [FILES or ERRORS]

Deliverables:
1. [SPECIFIC_OUTPUT]
2. Report changes made
3. Use /work:creatework for out-of-scope concerns"
```

For parallel: Send multiple Task calls in single message.

### [VALIDATE]

Type check + lint cycle:
1. Run `npm run typecheck` → parse errors → group by file/code
2. Run `npm run lint` → parse errors → note auto-fixable
3. Store counts in `execution_state`
4. Report: `"Type: [N] errors in [N] files | Lint: [N] errors, [N] auto-fixable"`

### [CHECKPOINT]

Save state for resume capability:
1. Create checkpoint comment on Linear issue:
   ```markdown
   🔄 **Checkpoint: Phase [N]**
   ```json
   {
     "phase": [N],
     "timestamp": "[ISO]",
     "state": { "phases_completed": [...], "files_modified": [...] }
   }
   ```
   ```
2. Update `execution_state.checkpoint`

### [SERENA_EDIT]

Mandatory for symbol-level code changes:
1. `mcp__serena__get_symbols_overview` → understand structure
2. `mcp__serena__find_symbol(name_path, include_body: true)` → get current code
3. Edit using:
   - `mcp__serena__replace_symbol_body` for function/method rewrites
   - `mcp__serena__insert_after_symbol` for new code after existing
   - `mcp__serena__insert_before_symbol` for imports, decorators
4. Use `Edit` tool only for: config files, markdown, single-line non-function changes

---

## §5 Execution Phases

### Phase 1: Initialize

**GATE**: Issue ID provided

**DO**:

1. **Check for resume**:
   ```
   IF "--resume" flag OR previous checkpoint exists:
     → Parse last checkpoint from Linear comments
     → Set execution_state from checkpoint
     → SKIP to checkpoint.phase + 1
   ```

2. **Fetch issue** using [LINEAR_CALL]:
   ```
   Tool: mcp__linear__get_issue
   Parameters: { id: "{{issueId}}" }
   ```
   IF not found → STOP "Issue {{issueId}} not found"

3. **Display issue**:
   ```
   📋 {{issueId}}: [title]
   Status: [state] | Priority: [priority]
   ```

4. **Parse and cache requirements**:
   - Extract checkboxes/bullets from description
   - Store in `execution_state.cache.requirements`
   - IF none found → use title as single requirement

5. **Detect execution mode** (see Decision Table 3.1):
   ```
   IF ultra_fast criteria met → mode = "ultra_fast"
   ELSE IF fast_path criteria met → mode = "fast"
   ELSE → mode = "full"
   ```
   Report: `"⚡ Mode: [mode]"`

6. **Cache file list** (run once, reuse everywhere):
   ```bash
   git diff --name-only HEAD
   ```
   Store in `execution_state.cache.files_modified`

7. **Check for Sentry context** (if error-fix issue):
   ```
   IF description mentions error pattern OR Sentry ID:
     Tool: mcp__sentry__search_issues
     Parameters: { organizationSlug: "...", naturalLanguageQuery: "[error pattern]" }
     → Extract stack traces, affected files
     → Add to context for implementation
   ```

8. **Update status** using [LINEAR_CALL]:
   ```
   Tool: mcp__linear__update_issue
   Parameters: { id: "{{issueId}}", state: "In Progress" }
   ```

**STATE_UPDATE**: `phases_completed.push(1)`, `checkpoint.phase = 1`

**NEXT**:
- IF mode = "ultra_fast" → Phase 3
- IF mode = "fast" → Phase 2 (skip orchestration)
- IF mode = "full" → Phase 2

---

### Phase 2: Analyze

**GATE**: Phase 1 complete

**DO**:

1. **Orchestration planning** (SKIP if mode ≠ "full"):

   Use Sequential-thinking [TIER 1]:
   ```
   Tool: mcp__sequential-thinking__sequentialthinking
   Parameters:
     thought: "Issue {{issueId}}: '[title]'. Requirements: [count].
               Determine: 1) Files to modify, 2) Error volume estimate,
               3) Module boundaries, 4) Parallel agent strategy, 5) Risk assessment"
     thoughtNumber: 1
     totalThoughts: 5
     nextThoughtNeeded: true
   ```

   Store orchestration plan for later phases.

2. **Documentation lookup** (if unfamiliar libraries):
   ```
   IF description mentions unfamiliar library/API:
     Tool: mcp__context7__resolve-library-id
     Parameters: { libraryName: "[library]" }

     IF found:
       Tool: mcp__context7__get-library-docs
       Parameters: { context7CompatibleLibraryID: "[id]", topic: "[relevant]" }
     ELSE:
       → Deploy research-expert agent
   ```

3. **Code discovery** using Serena:
   ```
   Tool: mcp__serena__get_symbols_overview
   Parameters: { relative_path: "[relevant file]" }

   Tool: mcp__serena__find_symbol
   Parameters: { name_path: "[component]", include_body: false, depth: 1 }

   IF modifying existing code:
     Tool: mcp__serena__find_referencing_symbols
     Parameters: { name_path: "[symbol]", relative_path: "[file]" }
   ```

4. **Report analysis**:
   ```
   🧠 Analysis:
   - Files to modify: [list]
   - Complexity: [simple|moderate|complex]
   - Parallel agents planned: [count]
   ```

**STATE_UPDATE**: `phases_completed.push(2)`, store analysis results

**NEXT**: Phase 3

---

### Phase 3: Implement

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
   - Use `Edit` tool only for config/markdown
   - Explain changes with file:line references

3. **Agent-based implementation** (moderate/complex):
   ```
   Task tool with subagent_type: "feature-dev:code-architect"
   Prompt: "Implement requirements for {{issueId}}: [title]

   Requirements:
   [list from cache]

   Deliverables:
   1. Architecture design
   2. Implementation plan
   3. File changes with rationale"
   ```

4. **Discovery tracking**:
   ```
   IF new issue discovered during implementation:
     → Use /work:creatework with clear description
     → Link to current issue
     → Report created issue ID

   IF blocking dependency found:
     → Update status to "On Hold" using [LINEAR_CALL]
     → Create comment explaining blocker
     → STOP "Blocked by [BLOCKER-ID]"
   ```

5. **Update file cache**:
   ```bash
   git diff --name-only HEAD
   ```
   Update `execution_state.cache.files_modified`

**STATE_UPDATE**: `phases_completed.push(3)`, record files modified

**CHECKPOINT**: Apply [CHECKPOINT] pattern

**NEXT**: Phase 4

---

### Phase 4: Review

**GATE**: Phase 3 complete, TypeScript/JavaScript files modified

**SKIP IF**: No .ts/.tsx/.js/.jsx/.vue files in `cache.files_modified`

**DO**:

1. **Count files** from cache:
   ```
   ts_files = cache.files_modified.filter(f => /\.(ts|tsx|js|jsx|vue)$/.test(f))
   ```

2. **Deploy reviewers** based on count:

   | Files | Strategy |
   |-------|----------|
   | 1-3 | Single typescript-expert |
   | 4-6 | 2 typescript-expert agents parallel |
   | 7-12 | 3 typescript-expert agents parallel |
   | 13+ | 4+ agents (1 per 3-4 files) |

3. **Parallel deployment** using [AGENT_DEPLOY]:
   ```
   # Single message, multiple Task calls

   Agent 1 - typescript-expert:
   "Review TypeScript code for {{issueId}} (Agent 1/[N])

   Files: [subset 1]

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

4. **Aggregate results**:
   - Collect changes from each agent
   - Note any issues flagged for tracking
   - Update `execution_state.agents_deployed`

5. **Report**:
   ```
   ✅ Code Review Complete
   - Agents: [N] parallel
   - Files reviewed: [N]
   - Improvements made: [summary]
   ```

**STATE_UPDATE**: `phases_completed.push(4)`, record review findings

**NEXT**: Phase 5

---

### Phase 5: Resolve Errors

**GATE**: Phase 4 complete (or Phase 3 if no TS files)

**DO**:

#### 5.1 Type Checking

1. **Run typecheck**:
   ```bash
   npm run typecheck
   ```

2. **Parse and cache errors**:
   - Count total, group by file, group by error code
   - Store in `execution_state.cache.error_groups`
   - Set `execution_state.type_errors.initial`

3. **Report**:
   ```
   🔍 Type Check: [N] errors in [N] files
   Top codes: [TS2xxx: N, TS2yyy: M, ...]
   ```

4. **IF errors = 0** → skip to 5.2

5. **Wave 1 - Deploy agents** (see Decision Table 3.2):

   | Errors | Files | Action |
   |--------|-------|--------|
   | < 20 | Any | Single agent |
   | ≥ 20 | Any | 2 parallel agents |
   | ≥ 50 | Any | 3 parallel agents |
   | Any | > 5 | 2 agents by file grouping |

   Deploy using [AGENT_DEPLOY] with appropriate agent type.

6. **Re-validate**:
   ```bash
   npm run typecheck
   ```
   Update `execution_state.type_errors`

7. **Wave 2** (IF errors remain):

   Use Sequential-thinking [TIER 2]:
   ```
   thought: "Wave 1: [N] agents, [M] errors remain.
             Analyze: 1) Why unfixed? 2) Different strategy? 3) Fixable or architectural?"
   ```

   Deploy Wave 2 with adjusted strategy → Re-validate

8. **Wave 3 / Circuit Breaker** (IF still errors after Wave 2):

   Use Sequential-thinking to assess if truly architectural:
   - IF architectural → create tracking issues via /work:creatework
   - IF fixable → one more targeted attempt

   After Wave 3: Force create tracking issues for remaining errors.

9. **Quality Gate**:
   ```
   🚦 Type Errors: [0 | N remaining, tracked in TRG-xxx]
   Status: [PASS | CONDITIONAL PASS]
   ```

   IF errors > 0 AND no tracking issues → STOP "Quality gate blocked"

#### 5.2 Linting

1. **Auto-fix first**:
   ```bash
   npm run lint -- --fix
   ```

2. **Re-check**:
   ```bash
   npm run lint
   ```
   Parse errors, store in `execution_state.lint_errors`

3. **IF errors = 0** → skip to Phase 6

4. **Deploy linting agents** (if errors ≥ 30):
   - Group by file or rule type
   - Deploy parallel linting-expert agents

5. **Re-validate** → Wave 2 if needed

6. **Quality Gate**:
   ```
   🚦 Linting: [PASS | N warnings only | BLOCKED]
   ```

   IF ERROR-level issues remain AND no tracking → STOP

**STATE_UPDATE**: `phases_completed.push(5)`, update error counts

**CHECKPOINT**: Apply [CHECKPOINT] pattern

**NEXT**: Phase 6

---

### Phase 6: Validate

**GATE**: Phase 5 complete with quality gates passed

**DO**:

#### 6.1 Tests

1. **Check for test script**:
   ```bash
   npm run test --if-present
   ```

2. **Report**:
   ```
   🧪 Tests: [PASS | N failed | No tests configured]
   ```

3. IF tests fail → assess if related to changes → create tracking issue if pre-existing

#### 6.2 Business Logic Validation

**SKIP IF**: mode = "ultra_fast" OR only simple changes

1. **Identify functions to validate**:
   ```bash
   git diff HEAD | grep -E "^\+.*(function|=>|async)"
   ```

2. **Deploy validation** (if complex functions):
   ```
   Task tool with subagent_type: "code-review-expert"
   Prompt: "Validate business logic for {{issueId}}

   Functions: [list with file:line]
   Requirements: [from cache]

   Check: Logic correctness, edge cases, requirement alignment"
   ```

3. **Handle issues found**:
   - Critical → fix immediately → re-run Phase 5 validation
   - Non-critical → create tracking issue

4. **Quality Gate**:
   ```
   🚦 Business Logic: [PASS | Issues tracked]
   ```

**STATE_UPDATE**: `phases_completed.push(6)`

**NEXT**: Phase 7

---

### Phase 7: Verify

**GATE**: Phase 6 complete

**DO**:

#### 7.1 File Change Verification

1. **Compare intended vs actual**:
   ```bash
   git status --porcelain
   git diff --name-only HEAD
   ```

2. **Verify**:
   - All intended files modified? ✓/✗
   - No unintended files? ✓/✗
   - No unstaged changes? ✓/✗

#### 7.2 Technical Debt Scan

1. **Scan for introduced markers**:
   ```bash
   git diff HEAD | grep -E "^\+.*(TODO|FIXME|HACK|XXX)" || echo "None"
   ```

2. **For each marker**:
   - Pre-existing? → ignore
   - Intentional deferral? → create tracking issue
   - Oversight? → fix now

#### 7.3 Requirement Verification

1. **Check each requirement** from `cache.requirements`:
   - ✅ Complete
   - ⚠️ Partial → document limitation
   - ❌ Not addressed → fix or escalate

2. **Report**:
   ```
   📋 Requirements: [N/M] complete
   ```

#### 7.4 Follow-up Assessment

Use Sequential-thinking [TIER 1]:
```
thought: "Implementation complete. Assess:
          1) Any deferred work? 2) Discovered issues?
          3) Technical debt? 4) Missing tests? 5) Documentation needs?"
```

For each follow-up item:
- HIGH priority → create tracking issue via /work:creatework
- MEDIUM → create issue
- LOW → document only if substantial

**Report**:
```
🔗 Follow-up Issues: [N] created
- [TRG-xxx]: [title]
- [TRG-yyy]: [title]
```

#### 7.5 Verification Checklist

```
✅ VERIFICATION CHECKLIST
[ ] All files modified as intended
[ ] No unstaged changes
[ ] Type checking passed (or tracked)
[ ] Linting passed (or tracked)
[ ] Tests passed (or tracked)
[ ] All requirements addressed
[ ] Technical debt documented
[ ] Follow-up issues created
```

IF any item fails → remediate before proceeding

**STATE_UPDATE**: `phases_completed.push(7)`

**CHECKPOINT**: Apply [CHECKPOINT] pattern

**NEXT**: Phase 8

---

### Phase 8: Complete

**GATE**: Phase 7 verification passed

**DO**:

#### 8.1 Git Commit

1. **Stage changes**:
   ```bash
   git add -A
   ```

2. **Create commit**:
   ```bash
   git commit -m "$(cat <<'EOF'
   feat({{issueId}}): [summary from title]

   ## Changes
   - [file1]: [change description]
   - [file2]: [change description]

   ## Validation
   - Type checking: ✅
   - Linting: ✅
   - Tests: [status]

   Resolves: {{issueId}}

   🤖 Generated with [Claude Code](https://claude.com/claude-code) /work:performwork

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

3. **Handle pre-commit hook**:
   IF hook modifies files → `git add -A && git commit --amend --no-edit`

4. **Store commit hash**:
   ```bash
   git rev-parse --short HEAD
   ```
   Set `execution_state.commit_hash`

#### 8.2 Linear Update

1. **Create completion comment** using [LINEAR_CALL]:
   ```
   Tool: mcp__linear__create_comment
   Parameters:
     issueId: "{{issueId}}"
     body: "[PRD-formatted summary - reference PRD_TEMPLATE.md]

            ## Execution Summary
            - Requirements: [N/M] complete
            - Files modified: [N]
            - Type errors fixed: [N]
            - Commit: [hash]

            ## Follow-up Issues
            - [list any created]

            ## AI Metadata
            ```json
            { 'completedAt': '[ISO]', 'mode': '[mode]' }
            ```"
   ```

2. **Verify completion criteria**:
   - ✅ All requirements complete
   - ✅ Type checking passed
   - ✅ Linting passed
   - ✅ Phase 7 verification passed
   - ✅ Changes committed

3. **Update status** (only if ALL criteria met):
   ```
   Tool: mcp__linear__update_issue
   Parameters: { id: "{{issueId}}", state: "Done" }
   ```

   IF not all met → keep current state, report what's missing

#### 8.3 Final Report

```
═══════════════════════════════════════════════════
✅ {{issueId}} Complete
═══════════════════════════════════════════════════

📋 Requirements: [N/M]
🔧 Files: [N] modified
✅ Type Check: [status]
🎨 Linting: [status]
🧪 Tests: [status]
📦 Commit: [hash]
🔗 Follow-ups: [N] issues created

🔗 [issue URL]
═══════════════════════════════════════════════════
```

**STATE_UPDATE**: `phases_completed.push(8)`, execution complete

---

## §6 Resume Flow

When `--resume` flag is provided or checkpoint detected:

1. **Parse checkpoint** from Linear comments:
   ```
   Search for most recent "🔄 **Checkpoint:" comment
   Extract JSON state block
   ```

2. **Validate checkpoint**:
   - Checkpoint exists?
   - Issue still In Progress?
   - No conflicting changes?

3. **Restore state**:
   ```javascript
   execution_state = merge(default_state, checkpoint.state)
   ```

4. **Skip to next phase**:
   ```
   GOTO Phase (checkpoint.phase + 1)
   ```

5. **Report**:
   ```
   📍 Resuming from Phase [N] checkpoint
   Previously completed: [list phases]
   ```

---

## §7 Multi-Issue Support

IF multiple issue IDs provided (comma-separated):

1. **Parse IDs**: Split by comma, trim whitespace

2. **Analyze dependencies**:
   Use Sequential-thinking to determine:
   - Independent issues (can parallel)
   - Dependent issues (must sequence)

3. **Execute**:
   - Independent: Consider parallel execution
   - Dependent: Execute in dependency order

4. **Report**:
   ```
   📊 Multi-Issue Summary:
   - Total: [N]
   - Completed: [N]
   - Failed: [N]
   ```

---

## §8 Error Handling

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

---

## §9 Final Reminder

**Execution Confirmation**:

- [ ] Called Linear MCP to fetch issue?
- [ ] Detected execution mode (ultra_fast/fast/full)?
- [ ] Used Serena for code discovery and editing?
- [ ] Ran `npm run typecheck` and parsed results?
- [ ] Ran `npm run lint` and parsed results?
- [ ] Deployed TypeScript agents for review?
- [ ] Applied [CHECKPOINT] at major phases?
- [ ] Created commit with detailed message?
- [ ] Updated Linear issue to Done?
- [ ] Created follow-up issues for deferred work?

**IF you read this without executing → GO BACK AND EXECUTE**

The user should NEVER need to ask about follow-up work or commit changes - Phases 7 and 8 handle this automatically.
