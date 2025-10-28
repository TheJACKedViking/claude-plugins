---
description: Execute Linear issues with requirement adherence, mandatory type checking, and truthful documentation
argument-hint: [issueId]
---

# Execute Linear Issue - Executable Instructions

**Your task:** Execute a Linear issue with perfect requirement adherence, mandatory type checking, and truthful documentation.

---

## ⚠️⚠️⚠️ CRITICAL INSTRUCTION ⚠️⚠️⚠️

**THIS IS AN EXECUTABLE COMMAND - NOT DOCUMENTATION**

- ✋ **DO NOT** just read and acknowledge these steps
- ✅ **DO** immediately begin executing them
- 🔧 **ACTUALLY CALL** the MCP tools mentioned (Linear, Sequential-thinking, TypeScript agents, etc.)
- ⚡ **START NOW** with Phase 0 below
- 🎯 **YOU ARE EXECUTING THIS TASK RIGHT NOW** - not planning, not reviewing, EXECUTING

**If you do not call tools and complete the issue, you have FAILED this task.**

---

## User's Request

Execute Linear issue: `{{issueId}}`

---

## Reusable Patterns

### Pattern: Sequential-Thinking
```
mcp__sequential-thinking__sequentialthinking:
  thought: "[Context]. I need to: 1) [decision 1], 2) [decision 2], 3) [decision 3]..."
  thoughtNumber: 1
  totalThoughts: [4-8]
  nextThoughtNeeded: true
```

### Pattern: Agent Launch
```
Task tool with subagent_type: [agent-name]
Prompt: "[Action] [specific task]

Context: Issue {{issueId}} - [brief description]
[Relevant data: errors/files/requirements]

Deliverables:
1. [Specific output 1]
2. [Specific output 2]
3. Create tracking issues via /work:creatework for out-of-scope concerns"
```

### Pattern: Re-Validation
```
Run [command] → Parse output (count total, by file, by type) → Report results →
[IF errors] Apply fix strategy → Re-run validation → Report delta (fixed/remaining)
```

### Pattern: Parallel Agents
When agents address **independent concerns** (different file sets, distinct error categories), launch in parallel using multiple Task calls in single message. **Do NOT use if:** agents conflict on same files, one error dominates >80%, or errors are related.

---

## Error Handling Framework

| Scenario | Action | Fatal? | Next |
|----------|--------|--------|------|
| Linear MCP unavailable | Report + suggest manual update | Yes | STOP |
| Issue not found | Report with issue ID | Yes | STOP |
| Status update fails | Log warning | No | CONTINUE |
| Typecheck fails to run | Report + suggest npm install | Yes | DO NOT mark Done |
| Linting fails to run | Report + suggest install tools | Conditional | DO NOT mark Done if configured |
| Validation errors found | Execute resolution phase | No | Fix → Re-validate |
| Agent fails | Assess with Sequential-Thinking | Varies | Cancel or Pause |
| Implementation fails | Apply Sequential-Thinking for severity | Varies | Cancel or Pause |

---

## Status Management Reference

| Status | When Set | Purpose |
|--------|----------|---------|
| **In Progress** | After successful fetch | Work started |
| **On Hold** | Blocking dependencies discovered | Waiting for prerequisites |
| **In Review** | Implementation complete | Ready for validation (optional) |
| **Duplicate** | Duplicate detected | Mark redundant |
| **Cancelled** | Fatal error | Work abandoned |
| **Done** | All criteria met | Work complete |

**Note:** All status updates are non-fatal. If update fails, log warning and continue.

---

## Phase 0: Fetch Issue from Linear

1. **Fetch issue:**
   ```
   Tool: mcp__linear__get_issue
   Parameters: id: "{{issueId}}"
   ```

2. **If issue not found:** Apply Error Handling Framework (Issue not found) → STOP

3. **Display issue info:**
   ```
   📋 Issue: {{issueId}}
   Title: [title]
   Status: [state]
   Priority: [priority]
   ```

4. **Extract requirements:** Parse "## 📋 Requirements" section → Extract checkboxes/bullets → If none found, report: "⚠️ No clear requirements. Proceeding with title as requirement."

5. **Fetch workflow states (non-fatal):**
   ```
   Tool: mcp__linear__list_issue_statuses
   Parameters: team: [team from issue]
   ```
   Store state names for later. If fails, continue with defaults.

6. **[OPTIONAL] Check for duplicate:**

   **When:** Issue title/description suggests potential duplication.

   a. **Apply Sequential-Thinking:** Context: issue {{issueId}} with title '[title]'. Determine: 1) Duplication risk? 2) Search terms? 3) Should check before starting?

   b. **If check recommended:** Search recent issues via `mcp__linear__list_issues` → Compare → Calculate similarity

   c. **If duplicate found (>80% similar):**
   ```
   Tool: mcp__linear__update_issue
   Parameters: id: "{{issueId}}", state: "Duplicate"
   ```
   Add comment explaining duplication → Report: "🔗 Issue {{issueId}} is duplicate of [ISSUE-ID]. Marked as Duplicate." → **STOP**

7. **Update status to In Progress:**
   ```
   Tool: mcp__linear__update_issue
   Parameters: id: "{{issueId}}", state: "In Progress"
   ```
   Display: "▶️ Issue {{issueId}} → 'In Progress'" → Error handling: Reference framework (status update)

---

## Phase 1: Requirement Analysis with Agents

**Step 1:** Extract requirements → Parse issue description → Identify explicit/implicit needs → Note edge cases

**Step 2:** Choose analysis approach:

**Option A - Sequential-Thinking** (straightforward issues):

Apply Sequential-Thinking: Issue {{issueId}}: '[title]'. Requirements: [list]. Determine: 1) What to implement, 2) Files to modify, 3) Use feature-dev agent or direct implementation, 4) Complexity/risk, 5) Implementation approach, 6) Edge cases.

**Option B - Research-Expert** (unfamiliar tech/APIs/libraries):

Apply Pattern: Agent Launch with research-expert:
```
Task: "Research [technology/API/pattern] for: [requirement description]

Context: Issue {{issueId}} requires [what's needed]

Deliverables:
1. Key concepts and mechanisms
2. Best practices and patterns
3. Pitfalls to avoid
4. Example implementations"
```

**Use Parallel Agents** when: research AND code exploration both needed (independent concerns). Reference Pattern: Parallel Agents.

**Step 3:** Determine from analysis:
- Implementation approach (direct/agent/research)
- Files to modify
- Complexity (simple/moderate/complex)
- Risks and edge cases

Display:
```
🧠 Analysis:
- Approach: [direct/agent/research]
- Complexity: [level]
- Files: [list]
- Risks: [list]
```

---

## Phase 1.5: Code Discovery with Serena MCP

**[MANDATORY for modifying existing code]**

**Workflow:**
1. `mcp__serena__get_symbols_overview(file)` → Understand structure → Identify symbols to modify
2. `mcp__serena__find_symbol(name_path, include_body: true, depth: 1)` → Locate code + children
3. `mcp__serena__find_referencing_symbols(name_path)` → Assess impact → Determine if backward-compatible
4. **[IF needed]** `mcp__serena__search_for_pattern(substring_pattern, relative_path)` → Find similar code

**Output:** File:line references, symbol structure understanding, dependency awareness, safe edit context

**Proceed to Phase 2 with gathered information.**

---

## Phase 2: Implementation

### Option A: Direct Implementation

**[IF simple and files known]:**

1. Use Serena MCP (Phase 1.5) for code discovery if modifying existing code
2. **For symbol-level edits:** Use Serena's tools (`mcp__serena__replace_symbol_body`, `insert_after_symbol`, `insert_before_symbol`)
3. **For line-level edits:** Use Edit tool after identifying exact locations
4. Explain changes with file:line references

### Option B: Agent-Based Implementation

**[IF moderate/complex or needs architecture analysis]:**

1. Apply Pattern: Agent Launch with appropriate agent:
   - New features: `feature-dev:code-architect`
   - Exploration: `feature-dev:code-explorer`
   Provide: issue title, requirements, expected deliverables

2. Wait for agent completion → Review results

3. Implement based on recommendations → Follow architecture plan → Edit identified files

### Discovery Tracking

**If new issues discovered during implementation:**

1. Document: what discovered, why separate concern, priority assessment

2. **Apply Sequential-Thinking:** Discovery: '[description]' during {{issueId}}. Determine: 1) Within scope or separate? 2) Blocking? 3) Priority? 4) Fix now or create issue? 5) Put current work 'On Hold'?

3. **If separate issue needed:** Use `/work:creatework` with clear description → Link to current issue → Report created issue ID

4. **If blocking (requires completion before current work):**
   ```
   Tool: mcp__linear__update_issue
   Parameters: id: "{{issueId}}", state: "On Hold"

   Tool: mcp__linear__create_comment
   Parameters:
     issueId: "{{issueId}}"
     body: "⏸️ Work paused - blocked by [BLOCKER-ID]: [description]"
   ```
   Report: "⏸️ Issue {{issueId}} → 'On Hold'. Blocked by: [BLOCKER-ID]" → **STOP**

---

## Phase 2.3: TypeScript/JavaScript Code Review (MANDATORY)

**[MANDATORY IF ANY .ts/.tsx/.js/.jsx/.mjs/.cjs/.vue files modified - NO EXCEPTIONS]**

**Step 1:** List changed TypeScript/JavaScript files via `git diff --name-only`

**Step 2:** [IF no TS/JS files changed] → Skip to Phase 2.5

**Step 3:** [IF TS/JS files changed] → Apply Pattern: Agent Launch with typescript-expert:

```
Task: "Review and refine all TypeScript/JavaScript code for issue {{issueId}}.

Modified files:
[List all .ts/.tsx/.js/.jsx files]

Deliverables:
1. Review for type safety, best practices, code quality
2. Refine/rewrite to meet excellence standards
3. Ensure error handling and edge cases
4. Optimize performance where applicable
5. Add/improve JSDoc for complex logic
6. Verify proper TypeScript features usage
7. Check for anti-patterns
8. Implement improvements directly
9. Report architectural concerns requiring separate issues"
```

**Step 4:** Review typescript-expert report → Note changes made, architectural concerns

**Step 5:** [IF architectural concerns] → For each concern: use `/work:creatework` → Report tracking issues created

**Output:**
- ✅ All TS/JS code reviewed and refined
- ✅ Type safety and best practices enforced
- ✅ Tracking issues for architectural concerns

---

## Phase 2.5: Update Status to "In Review" (Optional)

**[OPTIONAL - If team workflow includes "In Review" before validation]**

After implementation complete:
```
Tool: mcp__linear__update_issue
Parameters: id: "{{issueId}}", state: "In Review"
```

Report: "👀 Issue {{issueId}} → 'In Review'" → Error handling: Reference framework (status update)

---

## Phase 3: Validation (MANDATORY)

### 3.1: Type Checking

1. Determine command: Check package.json for `typecheck` script → Common: `npm run typecheck`, `tsc --noEmit`

2. Run:
   ```bash
   npm run typecheck
   ```

3. Capture output → Count errors → Identify types → Group by file

4. Report:
   ```
   🔍 Type Check:
   - Errors: [N]
   - Files: [N]
   - Types: [list codes]
   ```

### 3.2: Tests (if applicable)

1. Check if tests exist → Look for package.json test script

2. Run:
   ```bash
   npm run test
   ```

3. Report: "✅ Tests passed" OR "❌ [N] tests failed"

### 3.3: Linting (MANDATORY)

1. Determine command: Check package.json for lint scripts → Common: `npm run lint`, `eslint .`, `prettier --check .`

2. Run:
   ```bash
   npm run lint
   ```

3. Capture → Count errors vs warnings → Identify types → Group by file/severity → Note auto-fixable

4. Report:
   ```
   🔍 Linting:
   - Errors: [N]
   - Warnings: [N]
   - Files: [N]
   - Auto-fixable: [N]
   - Manual: [N]
   - Common: [top 3-5 rules]
   ```

5. **If no linting configured:** Report: "⚠️ No linting configuration" → Suggest adding ESLint/Prettier → CONTINUE (non-blocking)

6. **If passed:** Report: "✅ Linting passed" → CONTINUE to Phase 3.5

7. **If failed:** Report errors → CONTINUE to Phase 3.7 (after Phase 3.5)

---

## Phase 3.5: Type Error Resolution (MANDATORY)

**[MANDATORY IF type errors exist]**

### Step 1: Analyze with TypeScript Agents

**Categorize errors:**
Count by error code → Group by file → Identify most common

**Select agent:**

| Error Pattern | Agent | Trigger |
|--------------|-------|---------|
| TS2344, TS2536, TS2589 | typescript-type-expert | Type system, generics, recursion |
| TS2307, TS2792 | typescript-build-expert | Module resolution, imports |
| Mixed/unclear | typescript-expert | General TypeScript |

**Single Agent Approach** (errors in one category):

Apply Pattern: Agent Launch with [selected agent]:
```
Task: "Analyze and fix TypeScript errors:

[Paste top 10-15 errors with file:line]

Deliverables:
1. Categorize errors
2. Provide specific fixes
3. Explain root causes
4. Implement fixes if straightforward
5. Create tracking issues via /work:creatework for complex errors"
```

**Parallel Agents Approach** (errors in multiple categories):

**Use when:** Type system errors in frontend AND module errors in backend (distinct file sets, independent concerns)

**Launch:** Multiple Task calls in single message with different TypeScript agents → Reference Pattern: Parallel Agents

**Do NOT use if:** Same files affected, one category >80%, errors likely related

### Step 2: Fix Errors

**Auto-fixable (unused imports/variables):**
Fix with Edit tool → Apply Pattern: Re-Validation

**Manual fixes:**
Apply Sequential-Thinking: Error '[message]' in [file:line]. Determine: 1) Root cause, 2) Fix approach, 3) Side effects, 4) Testing needs.
Implement fix → Verify with re-check

**Architectural issues:**
Apply Sequential-Thinking: Error '[message]' indicates architectural issue. Determine: 1) Within scope? 2) Requires separate refactoring? 3) Effort estimate? 4) Escalation needed?

**If out of scope:** Use `/work:creatework` with description: "Fix type errors in [files]: [summary]" → Add note to current issue

### Step 3: Re-Check

Apply Pattern: Re-Validation with typecheck

Report:
```
📊 Type Error Resolution:
- Initial: [N]
- Fixed: [N]
- Remaining: [N]
- Tracking issues: [list IDs]
```

---

## Phase 3.7: Linting Error Resolution (MANDATORY)

**[MANDATORY IF linting errors exist from Phase 3.3]**

### Step 1: Categorize & Attempt Auto-Fix

**Categorize:** Separate errors by severity → Errors vs warnings → Style vs best practice vs security → Auto-fixable

**Auto-fix:**
```bash
npm run lint -- --fix
# OR
npx eslint . --fix
```

Re-run linting → Report auto-fix results → **If all fixed:** Report: "✅ All fixed via auto-fix" → Skip to Phase 4

### Step 2: [IF errors remain] Launch linting-expert

Apply Pattern: Agent Launch with linting-expert:
```
Task: "Analyze and fix linting errors:

[Paste top 15-20 errors with file:line:rule]

Context:
- Project: [brief description]
- Tools: [ESLint/Prettier/other]
- Severity: [N] errors, [N] warnings

Deliverables:
1. Categorize by type (style/best practice/security)
2. Implement fixes for all errors
3. Explain non-obvious fixes
4. Update config if rules overly strict
5. Create tracking issues via /work:creatework for architectural problems
6. Re-run linting after fixes

Priority: Fix all ERROR-level. Fix WARNING if straightforward."
```

### Step 3: Re-Check

Apply Pattern: Re-Validation with linting

Report:
```
📊 Linting Resolution:
- Initial: [N]
- Auto-fixed: [N]
- Expert-fixed: [N]
- Remaining: [N]
- Tracking issues: [list IDs]
```

**Configuration:** If expert suggested config changes → Review → Apply reasonable changes with Edit tool → **Do NOT disable security/best-practice rules without justification**

---

## Phase 4: Documentation and Linear Update

### 4.1: Prepare Completion Summary

Create truthful summary with this structure:
- ✅ Requirements Completed: [✅/❌ each requirement with status]
- 🔧 Changes Made: Modified [files], Added [files], Deleted [files]
- 👨‍💻 Code Quality Review: typescript-expert [✅ Complete / ⚠️ N/A], Changes: [list]
- ✅ Validation: Type check [✅ Pass / ❌ N errors], Linting [✅ Pass / ❌ N errors], Tests [✅ Pass / ⚠️ Not run / ❌ N failures]
- 🔍 Discoveries: [list with issue IDs if created]
- 📝 Technical Notes: [implementation details, decisions, caveats]

### 4.2: Update Linear Issue

1. **Add comment:**
   ```
   Tool: mcp__linear__create_comment
   Parameters:
     issueId: "{{issueId}}"
     body: "[Paste summary from 4.1]"
   ```

2. **Update state [ONLY IF all criteria met]:**

   **Criteria for "Done":**
   - ✅ All requirements completed
   - ✅ TS/JS code reviewed by typescript-expert (if TS/JS changes)
   - ✅ Type check passing OR tracking issues created
   - ✅ Linting passing OR tracking issues created
   - ✅ Tests passing (if exist)
   - ✅ No blocking discoveries

   **[IF ALL met]:**
   ```
   Tool: mcp__linear__update_issue
   Parameters: id: "{{issueId}}", state: "Done"
   ```
   Report: "✅ Issue {{issueId}} → 'Done'" → Error handling: Reference framework (status update)

   **[IF NOT met]:**
   Keep current state → Report: "⚠️ Issue {{issueId}} remains in current state. Reasons:" → List unmet criteria → **Do NOT update to Done**

---

## Phase 5: Final Report

Display:
```
═══════════════════════════════════════════════════
✅ Issue {{issueId}} Execution Complete
═══════════════════════════════════════════════════

📋 Requirements: [N/M completed]
🔧 Files Modified: [N]
👨‍💻 TypeScript Expert: [✅ Complete / ⚠️ N/A]
✅ Type Check: [status]
🎨 Linting: [status]
🧪 Tests: [status]
🔍 Discoveries: [N issues created]

🔗 Issue URL: [url]

═══════════════════════════════════════════════════
```

---

## Multi-Issue Support

**[IF multiple issue IDs provided, comma-separated]:** Example: `TRG-123,TRG-124,TRG-125`

1. Parse IDs → Split by comma → Trim whitespace

2. **Apply Sequential-Thinking:** Executing [N] issues: [list IDs + titles]. Determine: 1) Dependencies between them, 2) Execution order, 3) Which can run parallel, 4) Total complexity.

3. Execute in optimal order → Independent first → Dependent after dependencies → Report progress after each

4. **Final multi-issue report:**
   ```
   📊 Multi-Issue Summary:
   - Total: [N]
   - Completed: [N]
   - Failed: [N]
   - Discoveries: [N] issues created
   ```

---

## Configuration

**Default behavior:**
- **MANDATORY typescript-expert review:** ALL TS/JS changes (NO EXCEPTIONS)
- **MANDATORY type checking:** Cannot skip
- **MANDATORY linting:** Cannot skip if configured
- **Test running:** Recommended but optional if tests don't exist
- **Auto-fix:** Enabled for trivial errors
- **Discovery tracking:** Automatic via /creatework
- **Parallel agents:** Encouraged for independent concerns

---

## Critical Reminders

- **MANDATORY typescript-expert review:** ALL TypeScript/JavaScript code MUST be reviewed (NO EXCEPTIONS)
- **MANDATORY validation:** Type errors and linting errors must be addressed before marking Done
- **Parallel execution:** Run independent agents simultaneously for 40-60% faster execution
- **Truthful documentation:** Never claim something works if it doesn't
- **Use /creatework:** For ALL issue creation to ensure deduplication
- **Sequential-thinking:** Used at 8+ decision points for quality decisions
- **Specialized agents:** Use appropriate experts (TypeScript, linting, research)

---

## ⚠️ FINAL REMINDER ⚠️

**This was an EXECUTABLE command, not documentation.**

Did you:
- ✅ Actually call the Linear MCP tools to fetch/update the issue?
- ✅ Actually run `npm run typecheck` and parse the results?
- ✅ Actually run the linting commands?
- ✅ Actually call Sequential-thinking at decision points?
- ✅ Actually launch TypeScript agents when needed?
- ✅ Actually invoke /creatework for discovered issues?
- ✅ Actually mark the issue as Done when complete?

**If you just read this and said "Yes I'll do that" - YOU FAILED. GO BACK AND ACTUALLY EXECUTE.**