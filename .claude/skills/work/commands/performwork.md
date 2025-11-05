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

## 🚀 MAXIMUM PARALLELIZATION MODE

**THIS COMMAND OPERATES IN AGGRESSIVE MULTI-AGENT ORCHESTRATION MODE BY DEFAULT**

### Core Philosophy

**Zero Errors, Maximum Speed, Full Completion**

1. **Deploy Multiple Agents Simultaneously**: ALL phases use parallel agent deployment when possible
2. **Cascading Subagents**: Each orchestrator agent spawns its own typescript-expert subagents for granular work
3. **Zero-Error Enforcement**: Validation errors trigger iterative waves of agents until 0 errors achieved
4. **Full Completion Mandate**: Creating tracking issues is a LAST RESORT - deploy more agents first
5. **No Business Logic Issues**: All functions validated for correctness, not just type safety

### Parallelization Thresholds (AUTOMATIC)

| Metric | Threshold | Action |
|--------|-----------|--------|
| Modified files | >6 files | Deploy 2+ typescript-expert agents (1 per 3-5 files) |
| Type errors | >20 errors | Deploy 2+ type-resolution agents in parallel |
| Type errors | >50 errors | Deploy 3+ type-resolution agents in parallel |
| Type errors | >5 files | Deploy 2+ agents by file grouping |
| Linting errors | >30 errors | Deploy 2+ linting-expert agents in parallel |
| Distinct modules | >3 modules | Deploy 1 agent per module in parallel |

### Iterative Wave Strategy

**Wave 1**: Deploy initial parallel agents based on thresholds
**Re-validate**: Run typecheck/lint again
**Wave 2** (if errors remain): Use Sequential-thinking to analyze failure → Deploy additional agents with different strategy
**Re-validate**: Run typecheck/lint again
**Wave 3** (if errors still remain): Use Sequential-thinking to determine if truly architectural → Only then create tracking issues

### Agent Hierarchy

```
Main Execution (performwork)
    ↓
Phase Orchestrator Agents (parallel, per phase/error-type/module)
    ↓
TypeScript-Expert Subagents (parallel, per file/component)
```

Each orchestrator agent is instructed to spawn multiple typescript-expert subagents for the files/modules it manages.

### Quality Gates (NON-NEGOTIABLE)

- **Gate 1**: Post-implementation → Zero TypeScript errors OR Wave 2 deployment
- **Gate 2**: Post-Wave-2 → Zero TypeScript errors OR Wave 3 deployment
- **Gate 3**: Post-linting → Zero linting errors OR Wave 2 deployment
- **Gate 4**: Business logic validation → Zero logic issues OR remediation

**Progression blocked until each gate passes.**

---

## Error Handling Framework

**Philosophy: Deploy Agents Until Zero Errors - Creating Tracking Issues is LAST RESORT**

| Scenario | Action | Fatal? | Next |
|----------|--------|--------|------|
| Linear MCP unavailable | Report + suggest manual update | Yes | STOP |
| Issue not found | Report with issue ID | Yes | STOP |
| Status update fails | Log warning | No | CONTINUE |
| Typecheck fails to run | Report + suggest npm install | Yes | DO NOT mark Done |
| Linting fails to run | Report + suggest install tools | Conditional | DO NOT mark Done if configured |
| **Type errors found** | **Deploy Wave 1 parallel agents** | **No** | **Fix → Re-validate → Wave 2 if needed → Wave 3 if still errors** |
| **Linting errors found** | **Auto-fix → Deploy parallel agents if remain** | **No** | **Fix → Re-validate → Wave 2 if needed** |
| **Business logic issues** | **Deploy validation agents → Fix issues** | **Varies** | **Fix critical → Track non-critical** |
| **Wave 1 agents fail** | **Sequential-thinking analysis → Wave 2** | **No** | **Deploy Wave 2 with different strategy** |
| **Wave 2 agents fail** | **Sequential-thinking analysis → Wave 3** | **No** | **Assess architectural → Create tracking issues ONLY if confirmed** |
| **Quality gate blocked** | **Deploy additional agents or create tracking issues** | **Varies** | **DO NOT proceed until gate passes** |
| Agent fails | Assess with Sequential-Thinking | Varies | Retry or different agent |
| Implementation fails | Apply Sequential-Thinking for severity | Varies | Fix or Cancel |

**Key Changes from Default Behavior:**
1. **Type/Linting Errors**: Deploy up to 3 waves of agents before creating tracking issues
2. **Parallel by Default**: Use parallel agents whenever thresholds are met
3. **Zero-Error Enforcement**: Quality gates BLOCK progression until errors = 0 OR tracking issues created
4. **Business Logic**: New mandatory validation phase for correctness
5. **Tracking Issues**: Only created after 2-3 agent waves OR Sequential-thinking confirms architectural

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

## Phase 0.5: Multi-Agent Orchestration Strategy

**[MANDATORY - AUTOMATIC PLANNING FOR MAXIMUM PARALLELIZATION]**

### Purpose
Plan parallel agent deployment across ALL phases to maximize speed and ensure zero-error completion.

### Step 1: Analyze Issue Complexity

Use Sequential-thinking to assess:

```
mcp__sequential-thinking__sequentialthinking:
  thought: "Issue {{issueId}}: '[title]'. Requirements: [list]. I need to determine: 1) Expected number of files to modify (estimate), 2) Likely error volume (small <10, medium 10-50, large >50), 3) Module boundaries (frontend/backend/shared/etc), 4) Optimal parallel agent strategy per phase, 5) Cascading subagent needs, 6) Risk of architectural issues requiring separate work."
  thoughtNumber: 1
  totalThoughts: 6
  nextThoughtNeeded: true
```

### Step 2: Plan Parallel Deployment

Based on Sequential-thinking output, determine:

**Phase 2.3 (Code Review) Strategy:**
- Files to modify: [N] → Deploy [N÷4] typescript-expert agents (rounded up, 1 per 3-5 files)
- Modules identified: [list] → Group files by module, 1 agent per module
- Deploy agents: [✅ Parallel / ⚠️ Sequential if <4 files]

**Phase 3.5 (Type Error Resolution) Strategy:**
- Expected errors: [estimate]
- If >20 errors: Deploy 2+ agents in Wave 1
- If >50 errors: Deploy 3+ agents in Wave 1
- If errors span >3 modules: Deploy 1 agent per module
- Error category distribution: [type-system/module-resolution/mixed]
- Agent selection: [typescript-type-expert / typescript-build-expert / typescript-expert / multiple in parallel]

**Phase 3.7 (Linting) Strategy:**
- Expected linting errors: [estimate]
- If >30 errors: Deploy 2+ linting-expert agents in parallel
- Auto-fix first: ✅ Yes (always attempt auto-fix before agents)

**Phase 3.9 (Business Logic) Strategy:**
- Critical functions to validate: [list]
- Deploy code-review-expert: ✅ Yes (if >3 complex functions modified)

### Step 3: Declare Orchestration Plan

Display orchestration plan to user:

```
🎯 Multi-Agent Orchestration Plan

📊 Complexity Assessment:
- Files to modify: ~[N]
- Expected type errors: ~[N]
- Expected lint errors: ~[N]
- Modules: [list]
- Complexity: [Simple / Moderate / Complex / Very Complex]

🤖 Parallel Agent Deployment Strategy:

Phase 2.3 (Code Review):
→ Deploy [N] typescript-expert agents in parallel
→ Grouping: [by file / by module]

Phase 3.5 (Type Errors):
→ Wave 1: Deploy [N] agents in parallel
→ Error threshold: [N] errors → automatic Wave 2 if not 0
→ Agents: [list agent types]

Phase 3.7 (Linting):
→ Auto-fix attempt first
→ If errors remain: Deploy [N] linting-expert agents

Phase 3.9 (Business Logic):
→ Deploy [N] code-review-expert agents
→ Focus: [specific functions/modules]

🎯 Quality Gates:
- Gate 1: Zero type errors (iterative waves)
- Gate 2: Zero linting errors (iterative waves)
- Gate 3: Zero business logic issues
- Gate 4: All requirements met

⚡ Expected timeline:
- Wave 1 agents: [N] running in parallel
- Estimated completion: [faster than sequential]
```

### Step 4: Proceed to Phase 1

With orchestration plan established, proceed to Phase 1.

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

## Phase 2.3: Parallel TypeScript/JavaScript Code Review (MANDATORY)

**[MANDATORY IF ANY .ts/.tsx/.js/.jsx/.mjs/.cjs/.vue files modified - NO EXCEPTIONS]**

**[AUTOMATIC PARALLEL DEPLOYMENT BASED ON PHASE 0.5 STRATEGY]**

### Step 1: Identify Modified Files

List changed TypeScript/JavaScript files:
```bash
git diff --name-only | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|vue)$'
```

Count files: [N]

### Step 2: Determine Parallelization Strategy

Based on Phase 0.5 orchestration plan + actual file count:

| File Count | Strategy |
|------------|----------|
| 1-3 files | Single typescript-expert agent (sequential) |
| 4-6 files | 2 typescript-expert agents in parallel |
| 7-12 files | 3 typescript-expert agents in parallel |
| 13+ files | 4+ typescript-expert agents in parallel (1 per 3-4 files) |

**Module-Based Grouping** (preferred if >3 modules):
- Identify modules: frontend/, backend/, shared/, etc.
- Deploy 1 typescript-expert agent per module in parallel
- Each agent handles all files in its module

### Step 3: Deploy Parallel Typescript-Expert Agents

**[IF 1-3 files]** → Single agent (skip to Step 3A)

**[IF 4+ files OR multiple modules]** → Parallel agents:

**Example Multi-Agent Deployment** (adapt based on actual file grouping):

```
# Launch multiple agents in parallel (single message, multiple Task calls)

Agent 1 - typescript-expert:
Task: "Review and refine TypeScript/JavaScript code for [Module A / Files 1-4].

Context: Issue {{issueId}} - Parallel code review (Agent 1 of [N])

Files assigned:
- [file 1]
- [file 2]
- [file 3]

**IMPORTANT**: For complex modules, spawn your own typescript-expert SUBAGENTS:
- If module has >3 files, launch 1 subagent per file
- Each subagent focuses on deep review of single file
- Coordinate subagent findings into cohesive report

Deliverables:
1. Review for type safety, best practices, code quality
2. Refine/rewrite to meet excellence standards
3. Ensure error handling and edge cases
4. Optimize performance where applicable
5. Add/improve JSDoc for complex logic
6. Verify proper TypeScript features usage
7. Check for anti-patterns
8. Implement improvements directly
9. Create tracking issues via /work:creatework for architectural concerns
10. Report: changes made, subagents used, architectural concerns"

Agent 2 - typescript-expert:
Task: "Review and refine TypeScript/JavaScript code for [Module B / Files 5-8].

Context: Issue {{issueId}} - Parallel code review (Agent 2 of [N])

Files assigned:
- [file 5]
- [file 6]
- [file 7]

**IMPORTANT**: For complex modules, spawn your own typescript-expert SUBAGENTS:
- If module has >3 files, launch 1 subagent per file
- Each subagent focuses on deep review of single file
- Coordinate subagent findings into cohesive report

Deliverables:
[Same as Agent 1]"

# Continue for Agent 3, Agent 4, etc. as needed
```

### Step 3A: Single Agent Deployment (IF 1-3 files)

```
Task: "Review and refine all TypeScript/JavaScript code for issue {{issueId}}.

Modified files:
[List all .ts/.tsx/.js/.jsx files]

Deliverables:
[Same as parallel deployment]"
```

### Step 4: Aggregate Results

Wait for all agents to complete → Review reports from each agent:
- Changes made per agent/module
- Subagents spawned (if any)
- Architectural concerns identified

Display:
```
✅ Parallel TypeScript Code Review Complete

📊 Review Metrics:
- Agents deployed: [N] in parallel
- Subagents spawned: [N] (by orchestrator agents)
- Files reviewed: [N]
- Modules: [list]
- Changes implemented: [summary]

🔍 Findings:
- Type safety improvements: [count]
- Best practice enforcement: [count]
- Performance optimizations: [count]
- Architectural concerns: [count]
```

### Step 5: Handle Architectural Concerns

[IF architectural concerns identified] → For each concern:
- Use Sequential-thinking to confirm it's truly out-of-scope
- Use `/work:creatework` to create tracking issue
- Report tracking issue IDs

**Output:**
- ✅ All TS/JS code reviewed and refined (parallel execution)
- ✅ Type safety and best practices enforced across all modules
- ✅ Cascading subagents used for complex modules
- ✅ Tracking issues created for architectural concerns

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

## Phase 3.5: Type Error Resolution with Iterative Waves (MANDATORY)

**[MANDATORY IF type errors exist - ZERO-ERROR ENFORCEMENT]**

**[AUTOMATIC PARALLEL DEPLOYMENT + ITERATIVE WAVES UNTIL 0 ERRORS]**

### Step 1: Analyze Error Distribution

**Categorize errors:**
- Count total errors: [N]
- Count by error code: [list top 5 codes]
- Count by file: [list files with errors]
- Count by module: [frontend/backend/shared/etc]
- Identify error types: [type-system / module-resolution / mixed]

**Agent selection mapping:**

| Error Pattern | Primary Agent | When to Use |
|--------------|---------------|-------------|
| TS2344, TS2536, TS2589, TS2xxx | typescript-type-expert | Type system, generics, recursion, complex types |
| TS2307, TS2792, TS6xxx | typescript-build-expert | Module resolution, imports, config issues |
| Mixed or general | typescript-expert | General TypeScript issues |

### Step 2: Wave 1 - Mandatory Parallel Agent Deployment

**PARALLELIZATION THRESHOLDS (AUTOMATIC):**

| Error Count | Files Affected | Modules | Action |
|-------------|----------------|---------|--------|
| >20 errors | Any | Any | Deploy 2+ agents in parallel |
| >50 errors | Any | Any | Deploy 3+ agents in parallel |
| Any | >5 files | Any | Deploy 2+ agents by file grouping |
| Any | Any | >2 modules | Deploy 1 agent per module |

**Deployment Strategy:**

**Option A: Error-Type-Based Parallel Deployment** (if distinct error categories):

```
# Launch multiple TypeScript agents in parallel (single message, multiple Task calls)

Agent 1 - typescript-type-expert:
Task: "Analyze and fix TYPE SYSTEM errors:

Context: Issue {{issueId}} - Wave 1 parallel type error resolution (Agent 1 of [N])

Error category: Type system errors (TS2xxx)
Errors assigned:
[Paste type-system errors with file:line]

**IMPORTANT**: Spawn your own typescript-expert SUBAGENTS:
- If errors span >3 files, launch 1 subagent per file
- Each subagent fixes errors in its assigned file
- Coordinate fixes to ensure consistency

Deliverables:
1. Categorize your assigned errors
2. Provide specific fixes for each error
3. Implement fixes directly (use Edit/Write tools)
4. Verify fixes don't break other code
5. Report: errors fixed, subagents used, any complex cases
6. DO NOT create tracking issues yet - we'll try Wave 2 if needed"

Agent 2 - typescript-build-expert:
Task: "Analyze and fix MODULE RESOLUTION errors:

Context: Issue {{issueId}} - Wave 1 parallel type error resolution (Agent 2 of [N])

Error category: Module resolution errors (TS2307, TS2792, TS6xxx)
Errors assigned:
[Paste module errors with file:line]

**IMPORTANT**: Spawn your own typescript-expert SUBAGENTS:
- If errors span >3 files, launch 1 subagent per file
- Each subagent fixes errors in its assigned file
- Coordinate fixes to ensure consistency

Deliverables:
[Same as Agent 1]"

# Continue for Agent 3, 4, etc. based on error distribution
```

**Option B: File-Based Parallel Deployment** (if errors concentrated by file):

```
# Launch multiple typescript-expert agents in parallel, grouped by files

Agent 1 - typescript-expert:
Task: "Fix TypeScript errors in [files 1-3]:

Context: Issue {{issueId}} - Wave 1 parallel resolution (Agent 1 of [N])

Files assigned:
- [file 1]: [N] errors
- [file 2]: [N] errors
- [file 3]: [N] errors

Errors:
[Paste errors for these files]

Deliverables:
[Same as Option A]"

Agent 2 - typescript-expert:
Task: "Fix TypeScript errors in [files 4-6]:
[Same structure as Agent 1]"
```

**Option C: Module-Based Parallel Deployment** (if errors span multiple modules):

```
Agent 1 - typescript-expert:
Task: "Fix TypeScript errors in FRONTEND module:

Context: Issue {{issueId}} - Wave 1 parallel resolution (Agent 1 of [N])

Module: frontend/
Errors: [N] errors in [N] files

[Paste errors for frontend module]

Deliverables:
[Same as Option A]"

Agent 2 - typescript-expert:
Task: "Fix TypeScript errors in BACKEND module:
[Same structure]"
```

### Step 3: Quality Gate 1 - Re-Validate After Wave 1

Run typecheck again:
```bash
npm run typecheck
```

Count remaining errors: [N]

**Report Wave 1 results:**
```
📊 Wave 1 Type Error Resolution:
- Initial errors: [N]
- Agents deployed: [N] in parallel
- Subagents spawned: [N]
- Errors fixed: [N]
- Remaining errors: [N]
```

### Step 4: Wave 2 - Iterative Deployment (IF errors remain)

**[TRIGGER: IF remaining errors > 0 after Wave 1]**

**Use Sequential-thinking to analyze failure:**

```
mcp__sequential-thinking__sequentialthinking:
  thought: "Wave 1 results: [N] agents deployed, [N] errors remain. I need to determine: 1) Why did Wave 1 fail to fix all errors? (too complex? wrong agent type? related issues?), 2) What's a different strategy? (different agent types? more granular file-based approach? architectural refactoring?), 3) Can Wave 2 fix remaining errors or are they truly architectural? 4) How many agents for Wave 2?"
  thoughtNumber: 1
  totalThoughts: 6
  nextThoughtNeeded: true
```

**Based on Sequential-thinking analysis:**

- **If errors are fixable**: Deploy Wave 2 with adjusted strategy (different agents, more granular, focus on specific files)
- **If errors require minor refactoring**: Deploy refactoring-expert in Wave 2
- **If truly architectural**: Proceed to Wave 3 analysis

**Wave 2 Deployment:**

Apply similar parallel deployment as Wave 1, but with strategy adjusted based on Sequential-thinking:
- More granular file grouping (1 agent per file if needed)
- Different agent types if Wave 1 used wrong type
- Focused on specific remaining error patterns

### Step 5: Quality Gate 2 - Re-Validate After Wave 2

Run typecheck again → Count remaining errors: [N]

**Report Wave 2 results:**
```
📊 Wave 2 Type Error Resolution:
- Errors after Wave 1: [N]
- Wave 2 agents deployed: [N]
- Errors fixed in Wave 2: [N]
- Total errors fixed: [N]
- Remaining errors: [N]
```

### Step 6: Wave 3 - Final Analysis (IF errors STILL remain)

**[TRIGGER: IF remaining errors > 0 after Wave 2]**

**Use Sequential-thinking for architectural assessment:**

```
mcp__sequential-thinking__sequentialthinking:
  thought: "After 2 waves, [N] errors remain. I need to determine: 1) Are these truly architectural issues requiring major refactoring? 2) Are they caused by incorrect requirements? 3) Can we attempt ONE MORE targeted fix? 4) Should we create tracking issues? 5) What's the scope of architectural work needed?"
  thoughtNumber: 1
  totalThoughts: 6
  nextThoughtNeeded: true
```

**Based on Sequential-thinking:**

**Option A: One More Targeted Attempt**
- If errors are highly localized (1-2 files)
- If Sequential-thinking suggests they're fixable
- Deploy single highly-focused agent for remaining errors

**Option B: Create Tracking Issues**
- ONLY if Sequential-thinking confirms truly architectural
- ONLY if errors would require major refactoring out of current scope
- Use `/work:creatework` for each architectural concern
- Group related errors into single tracking issue

### Step 7: Final Quality Gate

**MANDATORY CHECKPOINT:**

```
🚦 Type Error Quality Gate:

Current errors: [N]

Status: [✅ PASS: 0 errors / ❌ BLOCKED: [N] errors remain]

Actions taken:
- Wave 1: [N] agents, [N] errors fixed
- Wave 2: [N] agents, [N] errors fixed (if executed)
- Wave 3: [analysis/tracking issues created] (if executed)

Tracking issues created: [list IDs or "None"]
```

**IF errors > 0 AND no tracking issues created:**
- **STOP**: Do NOT proceed to next phase
- Report: "❌ Quality Gate BLOCKED: [N] type errors remain and no tracking issues created"
- Require user intervention

**IF errors = 0 OR tracking issues created for remaining errors:**
- ✅ PASS: Proceed to Phase 3.7

### Final Output

```
📊 Type Error Resolution Complete:
- Total waves executed: [1/2/3]
- Total agents deployed: [N]
- Total subagents spawned: [N]
- Initial errors: [N]
- Final errors: [N]
- Errors fixed: [N]
- Tracking issues: [list IDs]
- Result: [✅ Zero errors achieved / ⚠️ Architectural issues tracked]
```

---

## Phase 3.7: Linting Error Resolution with Parallel Agents (MANDATORY)

**[MANDATORY IF linting errors exist from Phase 3.3 - ZERO-ERROR ENFORCEMENT]**

**[AUTO-FIX FIRST, THEN PARALLEL AGENTS IF NEEDED]**

### Step 1: Auto-Fix Attempt

**Always attempt auto-fix first:**
```bash
npm run lint -- --fix
# OR
npx eslint . --fix && npx prettier --write .
```

Re-run linting → Count remaining errors: [N]

**If all fixed:** Report: "✅ All [N] linting errors fixed via auto-fix" → Skip to Phase 3.9

**If errors remain:** Continue to Step 2

### Step 2: Categorize Remaining Errors

**Analyze error distribution:**
- Total errors: [N]
- Errors by file: [list files with counts]
- Errors by rule: [list top 5 rules]
- Errors by severity: [N] errors, [N] warnings
- Errors by type: [style / best-practice / security]

### Step 3: Parallel Linting-Expert Deployment

**PARALLELIZATION THRESHOLDS:**

| Error Count | Files Affected | Action |
|-------------|----------------|--------|
| >30 errors | Any | Deploy 2+ linting-expert agents in parallel |
| >60 errors | Any | Deploy 3+ linting-expert agents in parallel |
| Any | >6 files | Deploy 2+ agents by file grouping |

**Deployment Strategy:**

**[IF <30 errors]** → Single linting-expert agent

**[IF ≥30 errors OR >6 files]** → Parallel agents:

```
# Launch multiple linting-expert agents in parallel

Agent 1 - linting-expert:
Task: "Fix linting errors in [files 1-3] / [Module A]:

Context: Issue {{issueId}} - Parallel linting resolution (Agent 1 of [N])

Files assigned:
- [file 1]: [N] errors
- [file 2]: [N] errors

Errors:
[Paste errors for assigned files]

Deliverables:
1. Categorize by type (style/best-practice/security)
2. Implement fixes for ALL errors in assigned files
3. Explain non-obvious fixes
4. DO NOT modify linting config without consulting main execution
5. Re-run linting after fixes
6. Report: errors fixed, any complex cases"

Agent 2 - linting-expert:
Task: "Fix linting errors in [files 4-6] / [Module B]:
[Same structure as Agent 1]"

# Continue for Agent 3, 4, etc. as needed
```

### Step 4: Quality Gate - Re-Validate

Run linting again:
```bash
npm run lint
```

Count remaining errors: [N]

**Report results:**
```
📊 Linting Resolution:
- Initial errors: [N]
- Auto-fixed: [N]
- Agents deployed: [N]
- Agent-fixed: [N]
- Remaining: [N]
```

### Step 5: Wave 2 (IF errors remain)

**[TRIGGER: IF remaining errors > 0]**

Use Sequential-thinking to analyze:
```
mcp__sequential-thinking__sequentialthinking:
  thought: "After auto-fix and agent fixes, [N] linting errors remain. I need to determine: 1) Why weren't they fixed? (complex rules? config issues? code style conflicts?), 2) Are they legitimate errors or overly strict rules? 3) Should we deploy more targeted agents? 4) Should we adjust linting config? 5) Are any truly unfixable?"
  thoughtNumber: 1
  totalThoughts: 5
  nextThoughtNeeded: true
```

**Based on Sequential-thinking:**
- **If errors are fixable**: Deploy Wave 2 with more granular file-based approach
- **If config too strict**: Review and adjust specific rules (document justification)
- **If truly unfixable**: Create tracking issue via `/work:creatework`

### Step 6: Final Quality Gate

**MANDATORY CHECKPOINT:**

```
🚦 Linting Quality Gate:

Current errors: [N]

Status: [✅ PASS: 0 errors / ⚠️ CONDITIONAL PASS: [N] warnings only / ❌ BLOCKED: [N] errors remain]

Actions taken:
- Auto-fix: [N] errors fixed
- Agent fixes: [N] errors fixed
- Config adjustments: [list if any]
- Tracking issues: [list IDs or "None"]
```

**IF ERROR-level issues remain AND no tracking issues:**
- **STOP**: Do NOT proceed
- Report: "❌ Quality Gate BLOCKED: [N] linting ERRORS remain"

**IF only WARNINGS remain OR tracking issues created:**
- ✅ PASS: Proceed to Phase 3.9

---

## Phase 3.9: Business Logic Validation (MANDATORY)

**[MANDATORY IF complex functions modified - LOGIC CORRECTNESS CHECK]**

**[ENSURES NO BUSINESS LOGIC BUGS INTRODUCED]**

### Purpose

Validate that all modified/created functions:
1. Implement correct business logic (not just type-safe)
2. Handle edge cases properly
3. Don't introduce bugs or break existing functionality
4. Follow intended requirements from issue

### Step 1: Identify Functions to Validate

List all new/modified functions from implementation:
```bash
git diff --name-only | xargs -I {} git diff {} | grep -E "^(\\+|-)\\s*(function|const.*=.*=>|async.*function)"
```

Count: [N] functions modified/created

**Complexity assessment:**
- Simple functions (<10 lines, straightforward logic): [N]
- Moderate functions (10-30 lines, some complexity): [N]
- Complex functions (>30 lines, complex logic/algorithms): [N]

### Step 2: Determine Validation Strategy

| Complexity | Function Count | Strategy |
|------------|----------------|----------|
| Mostly simple | <5 functions | Manual review (skip agent) |
| Mixed | 5-10 functions | Single code-review-expert agent |
| Complex or many | >10 functions OR >3 complex | Deploy 2+ code-review-expert agents in parallel |

### Step 3: Deploy Business Logic Validation Agents

**[IF simple functions only]** → Skip to Phase 4 (manual review sufficient)

**[IF 5-10 functions OR some complex]** → Single agent:

```
Task: "Validate business logic correctness for issue {{issueId}}.

Context: Implementation complete, need to verify logic correctness

Functions to validate:
[List function signatures with file:line]

Requirements from issue:
[Copy relevant requirements]

Deliverables:
1. Review each function for logic correctness
2. Verify edge case handling
3. Check against requirements
4. Identify any logic bugs or incorrect implementations
5. Verify no regressions in existing functionality
6. Report: functions validated, issues found, confidence level"
```

**[IF >10 functions OR >3 complex OR multiple modules]** → Parallel agents:

```
# Launch multiple code-review-expert agents in parallel

Agent 1 - code-review-expert:
Task: "Validate business logic in [Module A / Files 1-3]:

Context: Issue {{issueId}} - Parallel logic validation (Agent 1 of [N])

Functions assigned:
- [function 1] in [file]:[line]
- [function 2] in [file]:[line]

Requirements:
[Relevant requirements]

Deliverables:
[Same as single agent]"

Agent 2 - code-review-expert:
Task: "Validate business logic in [Module B / Files 4-6]:
[Same structure]"
```

### Step 4: Review Validation Results

Aggregate findings from agents:
- Functions validated: [N]
- Logic issues found: [N]
- Edge case issues: [N]
- Requirement mismatches: [N]

**Report:**
```
📊 Business Logic Validation:
- Agents deployed: [N]
- Functions validated: [N]
- Issues found: [N]
- Severity: [Critical/Major/Minor]
```

### Step 5: Remediate Logic Issues

**[IF issues found]:**

For each issue:
1. **Use Sequential-thinking to assess severity:**
   ```
   mcp__sequential-thinking__sequentialthinking:
     thought: "Logic issue found: [description]. I need to determine: 1) Severity (critical/major/minor)? 2) Can be fixed quickly in current scope? 3) Requires rethinking approach? 4) Fix now or create tracking issue?"
     thoughtNumber: 1
     totalThoughts: 4
     nextThoughtNeeded: true
   ```

2. **If fixable immediately**: Implement fix → Re-validate
3. **If requires redesign**: Create tracking issue via `/work:creatework` → Document in completion summary

### Step 6: Final Quality Gate

```
🚦 Business Logic Quality Gate:

Functions validated: [N]
Issues found: [N]
Issues fixed: [N]
Issues tracked: [list IDs]

Status: [✅ PASS: All logic correct / ⚠️ CONDITIONAL: Issues tracked / ❌ BLOCKED: Critical issues unfixed]
```

**IF critical issues remain AND not tracked:**
- **STOP**: Do NOT mark issue as Done
- Report: "❌ Critical business logic issues must be fixed"

**IF all issues fixed OR tracked:**
- ✅ PASS: Proceed to Phase 4

---

## Phase 4: Documentation and Linear Update

### 4.1: Prepare Completion Summary (PRD Format)

**Reference**: See `PRD_TEMPLATE.md` in the work plugin for complete guidelines.

Create truthful PRD-formatted summary with this structure:

```markdown
## Execution Summary

Issue {{issueId}} has been executed. This document provides a comprehensive PRD-formatted summary of the work completed.

## Overview

### The Problem
[Restate the original problem from issue description]

### What Was Delivered
[1-2 sentences summarizing the solution implemented]

### Context
- Original issue: {{issueId}}
- Executed by: Claude Code /performwork
- Completion date: [ISO timestamp]

## Out of Scope

Items explicitly NOT addressed in this execution:
- [Item 1 deferred or determined out of scope]
- [Item 2 tracked in separate issue: [ISSUE-ID]]

## Solution Implemented

### Approach
[Brief description of implementation approach taken]

### Changes Made
**Modified Files**:
- `[file path 1]` - [what changed]
- `[file path 2]` - [what changed]

**Added Files**:
- `[file path]` - [purpose]

**Deleted Files**:
- `[file path]` - [reason]

### Key Implementation Details
- [Technical decision 1 and rationale]
- [Technical decision 2 and rationale]
- [Pattern/architecture followed]

## Technical Requirements Met

### Code Quality
- typescript-expert review: [✅ Complete / ⚠️ N/A]
- Changes recommended: [list if any]
- Improvements implemented: [list]

### Constraints Satisfied
- [Constraint 1 from original issue]: ✅ Met
- [Constraint 2]: ✅ Met

### Dependencies
- [Dependency 1]: ✅ Resolved / ⏸️ Blocked by [ISSUE-ID]
- [Dependency 2]: ✅ Resolved

## Acceptance Criteria

### Original Requirements
- [✅/❌] [Requirement 1 from issue]
- [✅/❌] [Requirement 2 from issue]
- [✅/❌] [Requirement N]

### Technical Validation
- [✅/❌] All type checks passing (`npm run typecheck`)
  - Result: [Pass / N errors remaining, tracked in [ISSUE-ID]]
- [✅/❌] All linting passing (`npm run lint`)
  - Result: [Pass / N errors remaining, tracked in [ISSUE-ID]]
- [✅/❌] All tests passing
  - Result: [Pass / N failures / Not run]
- [✅/❌] Code reviewed by typescript-expert (if TS/JS changes)
  - Result: [Complete / N/A]

### Edge Cases
- [✅/❌] [Edge case 1 handled]
- [✅/❌] [Edge case 2 handled]

## Discoveries & Tracked Issues

Issues created during execution via /creatework:

1. **[ISSUE-ID]**: [Title]
   - Type: [Bug fix / Feature / Discovery / Error-fix]
   - Reason: [Why separate issue was needed]
   - Priority: [priority level]

2. **[ISSUE-ID]**: [Title]
   - Type: [Bug fix / Feature / Discovery / Error-fix]
   - Reason: [Why separate issue was needed]
   - Priority: [priority level]

Total discoveries: [N] issues created for out-of-scope concerns

## Open Questions (Resolved)

- **Q1**: [Question from original issue]
  - Status: Resolved
  - Decision: [Decision made and rationale]

- **Q2**: [Technical tradeoff considered]
  - Status: Resolved
  - Decision: [Option chosen and why]

---

## AI Metadata

```json
{
  "issueId": "{{issueId}}",
  "executedBy": "Claude Code /performwork",
  "completedAt": "[ISO timestamp]",
  "requirementsCompleted": [N],
  "requirementsTotal": [N],
  "filesModified": [N],
  "filesAdded": [N],
  "filesDeleted": [N],
  "typescriptExpertUsed": [true/false],
  "typeCheckPassing": [true/false],
  "lintingPassing": [true/false],
  "testsPassing": [true/false],
  "discoveriesTracked": [N],
  "sequentialThinkingUsed": true,
  "prdVersion": "1.0"
}
```
```

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