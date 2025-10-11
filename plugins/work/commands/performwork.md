---
description: Execute Linear issues with requirement adherence, mandatory type checking, and truthful documentation
argument-hint: [issueId]
---

# Execute Linear Issue - Executable Instructions

**Your task:** Execute a Linear issue with perfect requirement adherence, mandatory type checking, and truthful documentation.

## User's Request

Execute Linear issue: `{{issueId}}`

## Instructions

Follow these phases to execute the issue correctly:

---

## Status Management Guide

**Available Linear Workflow States:**

This command automatically manages issue status transitions throughout execution:

| Status | When Set | Purpose |
|--------|----------|---------|
| **In Progress** | Phase 0.5 - After successful issue fetch | Signals work has started |
| **On Hold** | Phase 2 - When blocking dependencies discovered | Indicates waiting for prerequisites |
| **In Review** | Phase 2.5 - After implementation completes | Optional: Ready for validation |
| **Duplicate** | Phase 0.2 - If duplicate issue detected | Marks redundant issues |
| **Cancelled** | Error handling - Fatal errors or user cancellation | Work abandoned |
| **Done** | Phase 4.2 - All requirements met and validated | Work complete |

**Status Update Behavior:**
- All status updates are **non-fatal** - if update fails, work continues with warning
- Status names are fetched from team configuration for accuracy
- User is notified of each status change
- Failed updates are logged but don't block execution

---

## Phase 0: Fetch Issue from Linear

1. **Fetch the issue using Linear MCP tools:**
   - Call the appropriate Linear MCP tool (e.g., `mcp__linear__get_issue` or similar)
   - Issue ID: `{{issueId}}`

2. **If the issue doesn't exist:**
   - Report error to user: "❌ Issue {{issueId}} not found. Please verify the issue ID."
   - STOP execution

3. **Display issue information:**
   ```
   📋 Issue: {{issueId}}
   Title: [issue.title]
   Status: [issue.state]
   Priority: [issue.priority]
   ```

4. **Extract requirements from issue description:**
   - Look for "## 📋 Requirements" section
   - Extract all checkboxes and bullet points
   - If no requirements found, report: "⚠️ No clear requirements found in issue description. Proceeding with title as requirement."

5. **Fetch available workflow states (for accurate status updates):**
   ```
   Tool: mcp__linear__list_issue_statuses
   Parameters:
     team: [team ID or team name from issue]
   ```
   - Store available state names for later use
   - Note exact capitalization (e.g., "In Progress" vs "In-Progress")
   - **If fetch fails:** Continue with default state names (non-fatal)

6. **Check for duplicate issue (optional but recommended):**

   **When to check:** If issue title/description suggests potential duplication.

   a. **Use Sequential-thinking to analyze duplication risk:**
      - Thought: "Analyzing issue {{issueId}}: '[title]'. Description: '[summary]'. I need to determine: 1) Does this seem like it might duplicate recent work? 2) What search terms would find similar issues? 3) Should I check for duplicates before starting work?"
      - thoughtNumber: 1
      - totalThoughts: 4
      - nextThoughtNeeded: true

   b. **If Sequential-thinking suggests checking:**
      - Search recent issues using `mcp__linear__list_issues` with relevant query
      - Compare titles, descriptions, requirements
      - Calculate similarity score

   c. **If duplicate found (>80% similar):**
      ```
      Tool: mcp__linear__update_issue
      Parameters:
        id: "{{issueId}}"
        state: "Duplicate"
      ```
      - Add comment explaining which issue this duplicates
      - Report: "🔗 Issue {{issueId}} is a duplicate of [ISSUE-ID]. Marked as Duplicate."
      - **STOP execution**

7. **Update issue status to In Progress:**
   ```
   Tool: mcp__linear__update_issue
   Parameters:
     id: "{{issueId}}"
     state: "In Progress"  # Use exact state name from step 5
   ```
   - Display: "▶️ Issue {{issueId}} status updated to 'In Progress'"
   - **Error handling:** If update fails, display warning but continue execution (non-blocking)

---

## Phase 1: Requirement Analysis with Agents

**Step 1: Initial requirement understanding**

1. **Extract requirements from issue:**
   - Parse issue description for requirements
   - Identify explicit and implicit needs
   - Note any edge cases mentioned

**Step 2: Deep analysis with Sequential-thinking or Research Expert**

**Option A: Use Sequential-thinking for straightforward issues:**

1. Call `mcp__sequential-thinking__sequentialthinking`:

   - Thought: "Analyzing Linear issue {{issueId}}: '[title]'. Requirements: [list requirements]. I need to: 1) Understand what needs to be implemented, 2) Identify which files need modification, 3) Determine if this needs a feature-dev agent or direct implementation, 4) Assess complexity and risk, 5) Plan the implementation approach, 6) Identify potential edge cases."
   - thoughtNumber: 1
   - totalThoughts: 8
   - nextThoughtNeeded: true

**Option B: Use research-expert agent for issues needing context research:**

**When to use research-expert:**
- Issue mentions unfamiliar libraries/frameworks
- Requires understanding of external APIs
- Needs investigation of best practices
- Involves technologies you're unsure about

```
Launch Research Expert agent using Task tool:

Agent: research-expert
Task: "Research [specific technology/API/pattern] for implementing: [requirement description]

Context: Working on issue {{issueId}} which requires [what's needed]

Please provide:
1. Key concepts and how they work
2. Best practices and common patterns
3. Potential pitfalls to avoid
4. Example implementations if available

Research mode: FOCUSED INVESTIGATION MODE"
```

**Step 3: Parse analysis results**

2. **Determine from analysis:**
   - Implementation approach (direct edit vs agent-based)
   - Files that need modification
   - Complexity level (simple/moderate/complex)
   - Potential risks or edge cases
   - External resources or documentation needed

3. **Display analysis results:**
   ```
   🧠 Analysis Results:
   - Approach: [direct/agent-based/needs research]
   - Complexity: [level]
   - Files to modify: [list]
   - Risks: [list]
   - Research needed: [yes/no]
   ```

### Parallel Agent Execution for Efficiency

**When to run agents in parallel:**
- Research-expert AND code exploration are both needed (independent concerns)
- Research-expert for unfamiliar technology AND Sequential-thinking for implementation strategy
- Multiple research tasks on different technologies/APIs

**How to launch agents in parallel:**
```
Launch multiple agents in parallel by using multiple Task tool calls in a single message:

Task 1: research-expert agent
Prompt: "Research [technology A] for implementing [feature X]..."

Task 2: research-expert agent
Prompt: "Research [technology B] for implementing [feature Y]..."
```

**Benefits:**
- Reduces total execution time by 40-60%
- Gathers information faster for complex issues
- Enables better-informed implementation decisions

**When NOT to use parallel execution:**
- Agents need sequential coordination (one depends on the other's output)
- Single agent can handle all concerns
- Risk of duplicate or conflicting work

---

## Phase 1.5: Code Discovery with Serena MCP (MANDATORY for Code Changes)

**Use Serena MCP tools for intelligent code navigation instead of brute-force file reading.**

### When to Use Serena MCP

Use Serena MCP when:
- Modifying existing code (not creating new files)
- Understanding code structure and architecture
- Finding specific symbols (classes, functions, methods)
- Understanding dependencies and references
- Locating patterns in the codebase

### Serena MCP Workflow

**Step 1: Get High-Level Overview**

1. **Use `mcp__serena__get_symbols_overview` for files you need to modify:**
   ```
   Tool: mcp__serena__get_symbols_overview
   Parameters:
     relative_path: "path/to/file.ts"
   ```

2. **Analyze the symbol structure:**
   - Identify top-level classes, functions, interfaces
   - Understand file organization
   - Determine which symbols need modification

**Step 2: Find Specific Symbols**

1. **Use `mcp__serena__find_symbol` to locate code to modify:**
   ```
   Tool: mcp__serena__find_symbol
   Parameters:
     name_path: "ClassName/methodName"  # or just "ClassName" for classes
     relative_path: "path/to/file.ts"   # optional: restricts search
     include_body: true                  # get the actual code
     depth: 1                            # include children (methods, properties)
   ```

2. **Review the symbol information:**
   - Symbol location (file and line numbers)
   - Symbol body (if include_body: true)
   - Child symbols (if depth > 0)

**Step 3: Understand Dependencies (if needed)**

1. **Use `mcp__serena__find_referencing_symbols` to understand impact:**
   ```
   Tool: mcp__serena__find_referencing_symbols
   Parameters:
     name_path: "ClassName/methodName"
     relative_path: "path/to/file.ts"
   ```

2. **Analyze references:**
   - Which files/symbols use this code?
   - Will changes break other code?
   - Do references need updates?

**Step 4: Search for Patterns (if needed)**

1. **Use `mcp__serena__search_for_pattern` for finding similar code:**
   ```
   Tool: mcp__serena__search_for_pattern
   Parameters:
     substring_pattern: "pattern to find"
     relative_path: "src/"              # search within directory
     restrict_search_to_code_files: true
     context_lines_before: 2
     context_lines_after: 2
   ```

### Serena MCP Best Practices

**DO:**
- ✅ Use `get_symbols_overview` BEFORE reading entire files
- ✅ Use `find_symbol` to locate specific code to modify
- ✅ Use `find_referencing_symbols` to understand impact
- ✅ Use symbol-based tools for targeted edits

**DON'T:**
- ❌ Read entire files without first checking symbols
- ❌ Use Grep/Read when Serena can find symbols directly
- ❌ Skip dependency analysis for public APIs
- ❌ Ignore symbol structure when making edits

### Output from Serena MCP

After using Serena MCP, you should have:
1. Clear understanding of code structure
2. Exact locations of code to modify (file:line)
3. Knowledge of dependencies and references
4. Context for safe edits

### Proceed to Implementation

Once code discovery is complete using Serena MCP, proceed to Phase 2: Implementation with the gathered information.

---

## Phase 2: Implementation

### Option A: Simple/Direct Implementation

**If complexity is simple and files are known:**

1. **Use Serena MCP for code discovery** (Phase 1.5) if modifying existing code
2. **For symbol-level edits**, use Serena's editing tools:
   - `mcp__serena__replace_symbol_body` to replace entire symbols
   - `mcp__serena__insert_after_symbol` to add code after a symbol
   - `mcp__serena__insert_before_symbol` to add code before a symbol
3. **For line-level edits**, use the Edit tool after identifying exact locations
4. **Explain changes** to the user as you make them with file:line references

### Option B: Agent-Based Implementation

**If complexity is moderate/complex or requires architecture analysis:**

1. **Launch appropriate agent using Task tool:**
   - For new features: Use `feature-dev:code-architect` agent
   - For exploration: Use `feature-dev:code-explorer` agent
   - Provide the agent with: issue title, requirements, and expected deliverables

2. **Wait for agent completion** and review results

3. **Implement based on agent recommendations:**
   - Follow the architecture plan provided
   - Make edits to the files identified
   - Create new files only if absolutely necessary

### Discovery Tracking

**If you discover new issues during implementation:**

1. **Document the discovery:**
   - Note what was discovered
   - Why it's a separate concern
   - Priority/urgency assessment

2. **Use Sequential-thinking to decide if it should be a separate issue:**

   - Thought: "During implementation of {{issueId}}, I discovered: '[discovery description]'. I need to determine: 1) Is this within scope of current issue or separate? 2) Is it blocking current work? 3) What priority should it have? 4) Should I fix it now or create a tracking issue? 5) Should the current issue be put 'On Hold' while waiting for this?"
   - thoughtNumber: 1
   - totalThoughts: 6
   - nextThoughtNeeded: true

3. **If separate issue needed:**
   - Use the `/work:creatework` slash command to create it
   - Provide clear description of the discovered issue
   - Link it to the current issue in your summary

4. **If discovery is blocking (requires completion before current work can proceed):**

   a. **Update current issue status to "On Hold":**
      ```
      Tool: mcp__linear__update_issue
      Parameters:
        id: "{{issueId}}"
        state: "On Hold"
      ```

   b. **Add comment to current issue:**
      ```
      Tool: mcp__linear__create_comment
      Parameters:
        issueId: "{{issueId}}"
        body: "⏸️ Work paused - blocked by [BLOCKER-ISSUE-ID]: [description of blocker]"
      ```

   c. **Report to user:**
      - "⏸️ Issue {{issueId}} status updated to 'On Hold'"
      - "Blocked by: [BLOCKER-ISSUE-ID]"
      - "Will resume when blocker is resolved"

   d. **STOP execution:**
      - Do not proceed with implementation
      - Wait for blocker to be resolved

---

## Phase 2.3: TypeScript/JavaScript Code Review by Expert (MANDATORY)

**IMPORTANT: ALL TypeScript/JavaScript code changes MUST be reviewed and refined by typescript-expert. NO EXCEPTIONS.**

**Purpose:** Ensure all TypeScript/JavaScript code meets best practices, type safety, performance, and code quality standards before validation.

### When This Phase Applies

Run this phase if ANY of the following file types were modified:
- `.ts` (TypeScript)
- `.tsx` (TypeScript React)
- `.js` (JavaScript)
- `.jsx` (JavaScript React)
- `.mjs` / `.cjs` (ES Modules / CommonJS)
- `.vue` (if contains TypeScript/JavaScript)

### Step 1: Identify Changed Files

1. **List all TypeScript/JavaScript files modified in Phase 2:**
   ```bash
   git diff --name-only
   ```

2. **If NO TypeScript/JavaScript files changed:**
   - Skip to Phase 2.5 (Update Status to "In Review")

3. **If TypeScript/JavaScript files changed:**
   - Continue to Step 2

### Step 2: Launch typescript-expert for Code Review

**Use the typescript-expert agent to review and refine ALL changes:**

```
Launch TypeScript Expert agent using Task tool:

Agent: typescript-expert
Task: "Review and refine all TypeScript/JavaScript code changes for issue {{issueId}}.

Modified files:
[List all .ts/.tsx/.js/.jsx files changed]

Requirements:
1. Review each file for type safety, best practices, and code quality
2. Refine or rewrite code to meet TypeScript/JavaScript excellence standards
3. Ensure proper error handling and edge case coverage
4. Optimize performance where applicable
5. Add/improve JSDoc comments for complex logic
6. Verify proper use of TypeScript features (generics, utility types, etc.)
7. Check for common anti-patterns and code smells

Please implement all improvements directly. Report any architectural concerns that require separate issues."
```

### Step 3: Wait for typescript-expert Completion

- Agent will review all changed files
- Agent will implement refinements and improvements
- Agent will report findings and changes made

### Step 4: Review typescript-expert Report

**typescript-expert should provide:**
1. **Summary of changes made:**
   - Type safety improvements
   - Best practice refinements
   - Performance optimizations
   - Code quality enhancements

2. **Architectural concerns (if any):**
   - Issues requiring separate work
   - Technical debt identified
   - Recommendations for future improvements

3. **Files modified by typescript-expert:**
   - List of files refined
   - Summary of changes per file

### Step 5: Create Tracking Issues for Architectural Concerns

**If typescript-expert identified architectural issues:**

1. **For each architectural concern:**
   - Use `/work:creatework` to create a tracking issue
   - Description: Clear explanation of the concern and recommended solution
   - Link to current issue {{issueId}}

2. **Report tracking issues created:**
   ```
   📋 Architectural Concerns:
   - [ISSUE-ID]: [concern description]
   - [ISSUE-ID]: [concern description]
   ```

### Output from This Phase

After typescript-expert review, you should have:
- ✅ All TypeScript/JavaScript code reviewed and refined by expert
- ✅ Type safety and best practices enforced
- ✅ Code quality improvements implemented
- ✅ Tracking issues created for architectural concerns
- ✅ Clear report of changes made

**Proceed to Phase 2.5 after typescript-expert review is complete.**

---

## Phase 2.5: Update Status to "In Review" (Optional)

**Purpose:** Signal that implementation is complete and ready for validation.

**When to use:** If your team workflow includes an "In Review" state before validation.

1. **After completing implementation (Phase 2):**

   - All code changes implemented
   - No known blocking issues
   - Ready for type checking and testing

2. **Update issue status:**
   ```
   Tool: mcp__linear__update_issue
   Parameters:
     id: "{{issueId}}"
     state: "In Review"  # Use exact state name from Phase 0 step 5
   ```

3. **If update succeeds:**
   - Report: "👀 Issue {{issueId}} status updated to 'In Review'"

4. **If update fails:**
   - Log warning: "⚠️ Could not update issue status to 'In Review': [error]"
   - Continue execution anyway (non-fatal)

5. **Proceed to Phase 3: Validation**

---

## Phase 3: Validation (MANDATORY)

### 3.1 Run Type Checking

1. **Determine the typecheck command:**
   - Check package.json for `typecheck` script
   - Common commands: `npm run typecheck`, `tsc --noEmit`, `vue-tsc --noEmit`

2. **Run type checking using Bash tool:**
   ```bash
   npm run typecheck
   # OR
   npx tsc --noEmit
   ```

3. **Capture the output:**
   - Count total errors
   - Identify error types
   - Group by file

4. **Display results:**
   ```
   🔍 Type Check Results:
   - Total errors: [N]
   - Files with errors: [N]
   - Error types: [list common error codes]
   ```

### 3.2 Run Tests (if applicable)

1. **Check if tests exist:**
   - Look for package.json test script
   - Check for test files

2. **Run tests:**
   ```bash
   npm run test
   ```

3. **Report results:**
   ```
   ✅ All tests passed
   OR
   ❌ [N] tests failed
   ```

### 3.3 Run Linting (MANDATORY)

**Purpose:** Ensure code quality, style consistency, and adherence to coding standards.

1. **Determine the linting command:**
   - Check package.json for lint-related scripts
   - Common commands: `npm run lint`, `eslint .`, `prettier --check .`
   - Try multiple commands if needed:
     ```bash
     npm run lint
     # OR
     npx eslint .
     # OR
     npx prettier --check .
     ```

2. **Run linting using Bash tool:**
   ```bash
   npm run lint
   # OR combination:
   npm run lint && npm run format:check
   ```

3. **Capture the output:**
   - Count total errors vs warnings
   - Identify error types (style violations, best practices, security issues)
   - Group by file and severity
   - Note auto-fixable vs manual-fix required

4. **Display results:**
   ```
   🔍 Linting Results:
   - Total errors: [N]
   - Total warnings: [N]
   - Files with issues: [N]
   - Auto-fixable: [N]
   - Manual fixes needed: [N]
   - Common violations: [list top 3-5 rule violations]
   ```

5. **If no linting tools configured:**
   - Report: "⚠️ No linting configuration found (no eslint, prettier, or lint scripts)"
   - Suggest: "Consider adding ESLint and Prettier for code quality"
   - **Continue to Phase 3.5** (non-blocking if linting not configured)

6. **If linting passes (0 errors, warnings OK):**
   - Report: "✅ Linting passed"
   - **Continue to Phase 3.5**

7. **If linting fails (errors found):**
   - Report errors with counts
   - **Continue to Phase 3.7 for error resolution** (after Phase 3.5)

---

## Phase 3.5: Type Error Resolution (MANDATORY)

**If type errors exist, they MUST be addressed before marking issue as complete.**

### 3.5.1 Analyze Type Errors with TypeScript Agents

**Step 1: Categorize error types**

1. **Identify primary error patterns:**
   - Count errors by error code (TS2xxx, TS7xxx, etc.)
   - Group by file
   - Identify most common error types

2. **Determine which TypeScript agent to use:**

   **Use typescript-type-expert if:**
   - Complex generic constraints (TS2344, TS2536)
   - Type instantiation depth errors (TS2589)
   - Advanced conditional type issues
   - Template literal type problems
   - Recursive type errors
   - Majority of errors are TS2xxx codes

   **Use typescript-build-expert if:**
   - Module resolution failures (TS2307, TS2792)
   - Cannot find name/module errors
   - TSConfig compilation issues
   - Path mapping problems
   - ES module/CommonJS interop issues

   **Use typescript-expert (general) if:**
   - Mix of error types
   - Standard type mismatches
   - General TypeScript issues
   - Unsure which specialist to use

**Step 2: Invoke appropriate TypeScript agent(s)**

### Option A: Single Agent (Errors in one category)

1. **For type system errors (use typescript-type-expert):**

   ```
   Launch TypeScript Type Expert agent using Task tool:

   Agent: typescript-type-expert
   Task: "Analyze and fix these TypeScript type errors:

   [Paste top 10-15 errors with file names and line numbers]

   Please:
   1. Categorize the errors
   2. Provide specific fixes for each error
   3. Explain the root cause
   4. Implement the fixes if straightforward
   5. Create tracking issues for complex errors using /work:creatework"
   ```

2. **For build/module errors (use typescript-build-expert):**

   ```
   Launch TypeScript Build Expert agent using Task tool:

   Agent: typescript-build-expert
   Task: "Analyze and fix these TypeScript build/module errors:

   [Paste errors]

   Please:
   1. Check tsconfig.json configuration
   2. Verify module resolution settings
   3. Fix path mappings if needed
   4. Resolve module import issues
   5. Provide specific fixes"
   ```

3. **For general issues (use typescript-expert):**

   ```
   Launch TypeScript Expert agent using Task tool:

   Agent: typescript-expert
   Task: "Analyze and fix these TypeScript errors:

   [Paste errors]

   Please provide fixes and implement them where possible."
   ```

### Option B: Multiple Agents in Parallel (Errors in multiple categories)

**When to use parallel execution:**
- Type system errors in frontend files AND module resolution errors in backend files
- Distinct error categories affecting independent file sets
- Different error types that don't conflict (e.g., TS2xxx in src/ and TS2307 in tests/)

**How to launch agents in parallel:**

```
Launch multiple TypeScript agents in parallel by using multiple Task tool calls in a single message:

Task 1: typescript-type-expert
Prompt: "Fix type system errors in frontend files:
[List type errors from src/components/, src/views/, etc.]"

Task 2: typescript-build-expert
Prompt: "Fix module resolution errors in backend files:
[List module errors from api/, server/, etc.]"
```

**Benefits of parallel execution:**
- Reduces resolution time by 50-70%
- Allows specialists to work on their domain simultaneously
- Faster issue completion

**When NOT to use parallel execution:**
- Errors span the same files (agents would conflict)
- One error category dominates (>80% of errors)
- Errors are likely related (fixing one might fix others)

**Step 3: Wait for agent completion**

- Agent will analyze errors
- Agent will implement fixes
- Agent will re-run typecheck
- Agent will report results

**Step 4: Parse agent results:**
   - Auto-fixed errors count
   - Manual fixes needed
   - Architectural issues requiring separate work

### 3.5.2 Fix Type Errors

**For auto-fixable errors (unused imports, variables):**

1. Use Edit tool to fix them directly
2. Re-run typecheck to verify fixes
3. Report: "✅ Fixed [N] auto-fixable errors"

**For manual fixes:**

1. Use Sequential-thinking for complex fixes:

   - Thought: "Error '[error message]' in [file:line]. I need to determine: 1) Root cause, 2) Best fix approach, 3) Side effects of fix, 4) Whether it needs testing."
   - thoughtNumber: 1
   - totalThoughts: 4
   - nextThoughtNeeded: true

2. Implement the fix using Edit tool
3. Re-run typecheck to verify

**For architectural issues:**

1. Use Sequential-thinking to assess:

   - Thought: "Error '[error message]' indicates architectural issue. I need to: 1) Assess if this is within scope of current issue, 2) Determine if it requires separate refactoring, 3) Estimate effort to fix properly, 4) Decide if escalation to new issue is needed."
   - thoughtNumber: 1
   - totalThoughts: 5
   - nextThoughtNeeded: true

2. **If out of scope:**
   - Create a new issue via `/work:creatework` command
   - Description: "Fix type errors in [files]: [error summary]"
   - Add note to current issue about the dependency

### 3.5.3 Re-check After Fixes

1. **Run typecheck again:**
   ```bash
   npm run typecheck
   ```

2. **If errors remain:**
   - Document which errors were fixed
   - Document which errors remain and why
   - Create tracking issues for remaining errors using `/work:creatework`

3. **Report final status:**
   ```
   📊 Type Error Resolution:
   - Initial errors: [N]
   - Fixed: [N]
   - Remaining: [N]
   - Tracking issues created: [list issue IDs]
   ```

---

## Phase 3.7: Linting Error Resolution (MANDATORY)

**If linting errors exist from Phase 3.3, they MUST be addressed before marking issue as complete.**

### 3.7.1 Analyze Linting Errors with linting-expert

**Step 1: Categorize linting errors**

1. **Separate errors by severity and type:**
   - **Errors** (must fix): Rule violations that block code quality
   - **Warnings** (should fix): Suggestions that improve code
   - **Style issues**: Formatting, naming conventions
   - **Best practice issues**: Code patterns, complexity
   - **Security issues**: Potential vulnerabilities
   - **Auto-fixable**: Can be fixed with `--fix` flag

2. **Count and prioritize:**
   - Total errors vs warnings
   - Most common rule violations
   - Files with most issues
   - Security-critical vs style-only

**Step 2: Attempt auto-fix first**

1. **Try auto-fix if available:**
   ```bash
   npm run lint -- --fix
   # OR
   npx eslint . --fix
   # OR
   npx prettier --write .
   ```

2. **Re-run linting after auto-fix:**
   ```bash
   npm run lint
   ```

3. **Report auto-fix results:**
   ```
   🔧 Auto-Fix Results:
   - Errors before: [N]
   - Errors after: [N]
   - Fixed automatically: [N]
   - Remaining manual fixes: [N]
   ```

4. **If all errors fixed:**
   - Report: "✅ All linting errors resolved via auto-fix"
   - Skip to Phase 4 (Documentation)

5. **If errors remain:**
   - Continue to Step 3

**Step 3: Launch linting-expert for manual fixes**

```
Launch Linting Expert agent using Task tool:

Agent: linting-expert
Task: "Analyze and fix these linting errors:

[Paste top 15-20 linting errors with file names, line numbers, and rule names]

Context:
- Project: [brief description]
- Linting tools: [ESLint/Prettier/other]
- Severity breakdown: [N] errors, [N] warnings

Please:
1. Categorize errors by type (style, best practice, security)
2. Implement fixes for all errors
3. Explain the reasoning for non-obvious fixes
4. Update linting configuration if rules are overly strict
5. Create tracking issues for architectural problems using /work:creatework
6. Re-run linting after fixes

Priority: Fix all ERROR-level issues. Fix WARNING-level if straightforward."
```

**Step 4: Wait for linting-expert completion**

- Agent will analyze errors
- Agent will implement fixes
- Agent will adjust configuration if needed
- Agent will re-run linting
- Agent will report results

**Step 5: Parse linting-expert results**

Expected from linting-expert:
1. **Fixes implemented:**
   - Style fixes applied
   - Best practice improvements
   - Security issues resolved
   - Configuration adjustments

2. **Remaining issues (if any):**
   - Issues requiring architectural changes
   - Rule configuration conflicts
   - Complex refactoring needed

3. **Files modified:**
   - Code files fixed
   - Config files updated (.eslintrc, .prettierrc, etc.)

### 3.7.2 Re-check After Fixes

1. **Run linting again:**
   ```bash
   npm run lint
   ```

2. **If errors remain:**
   - Document which errors were fixed
   - Document which errors remain and why
   - Create tracking issues for remaining errors using `/work:creatework`

3. **Report final linting status:**
   ```
   📊 Linting Error Resolution:
   - Initial errors: [N]
   - Fixed by auto-fix: [N]
   - Fixed by linting-expert: [N]
   - Remaining: [N]
   - Tracking issues created: [list issue IDs]
   ```

### 3.7.3 Configuration Improvements

**If linting-expert suggested configuration changes:**

1. **Review suggested changes:**
   - Rule adjustments (.eslintrc, .prettierrc)
   - New plugins or parsers
   - Ignore patterns

2. **Apply reasonable changes:**
   - Use Edit tool to update config files
   - Document why changes were made

3. **Do NOT disable rules without justification:**
   - Never disable security rules
   - Never disable best practice rules without team approval
   - Style rules can be adjusted for project preferences

---

## Phase 4: Documentation and Linear Update

### 4.1 Prepare Completion Summary

**Create a truthful summary of what was accomplished:**

```markdown
## ✅ Implementation Complete

### Requirements Completed
- [✅/❌] Requirement 1: [status and notes]
- [✅/❌] Requirement 2: [status and notes]
...

### Changes Made
- Modified: [list files]
- Added: [list files if any]
- Deleted: [list files if any]

### Code Quality Review
- TypeScript/JavaScript review by typescript-expert: [✅ Complete / ⚠️ Skipped (no TS/JS changes)]
- Changes by expert: [list improvements made]

### Validation Results
- Type check: [✅ Pass / ❌ [N] errors remaining]
- Linting: [✅ Pass / ❌ [N] errors remaining]
- Tests: [✅ Pass / ⚠️ Not run / ❌ [N] failures]

### Discoveries
- [Discovery 1 - Issue ID if created]
- [Discovery 2 - Issue ID if created]

### Technical Notes
[Any important implementation details, decisions made, or caveats]
```

### 4.2 Update Linear Issue

1. **Add comment to Linear issue with summary:**
   ```
   Tool: mcp__linear__create_comment
   Parameters:
     issueId: "{{issueId}}"
     body: "[Paste the completion summary from Phase 4.1]"
   ```

2. **Update issue state (ONLY if all requirements met):**

   **Criteria to mark as "Done":**
   - ✅ All requirements completed
   - ✅ TypeScript/JavaScript code reviewed by typescript-expert (if TS/JS changes made)
   - ✅ Type check passing OR tracking issues created for remaining errors
   - ✅ Linting passing OR tracking issues created for remaining errors
   - ✅ Tests passing (if tests exist)
   - ✅ No blocking discoveries

   **If ALL criteria met:**

   a. **Update issue status to "Done":**
      ```
      Tool: mcp__linear__update_issue
      Parameters:
        id: "{{issueId}}"
        state: "Done"  # Use exact state name from Phase 0 step 5
      ```

   b. **If update succeeds:**
      - Report: "✅ Issue {{issueId}} marked as 'Done'"
      - Display completion metrics

   c. **If update fails:**
      - Log warning: "⚠️ Could not update issue status to 'Done': [error]"
      - Report: "⚠️ Please manually update issue status to Done"
      - Continue anyway (non-fatal)

   **If criteria NOT met:**
   - **Keep current state** (should be "In Progress" or "In Review")
   - Report: "⚠️ Issue {{issueId}} remains in current state due to:"
     - List which criteria were not met
     - Explain what needs to be resolved
   - **Do NOT update status to Done**

---

## Phase 5: Final Report to User

Display comprehensive report:

```
═══════════════════════════════════════════════════════════
✅ Issue {{issueId}} Execution Complete
═══════════════════════════════════════════════════════════

📋 Requirements: [N/M completed]
🔧 Files Modified: [N]
👨‍💻 TypeScript Expert Review: [✅ Complete / ⚠️ N/A]
✅ Type Check: [status]
🎨 Linting: [status]
🧪 Tests: [status]
🔍 Discoveries: [N issues created]

🔗 Issue URL: [url]

═══════════════════════════════════════════════════════════
```

---

## Error Handling

### If Linear MCP is unavailable:
- Report: "❌ Linear MCP server is not connected. Cannot fetch or update issue."
- Display what work was attempted
- Suggest manual Linear update
- **Do NOT attempt status updates** (will fail anyway)

### If typecheck fails to run:
- Report: "⚠️ Could not run type checking. Tried: [commands]"
- Suggest: "Please verify npm packages are installed and typecheck script exists"
- Continue with other validation if possible
- **Do NOT mark as Done** (type checking is mandatory)

### If linting fails to run:
- Report: "⚠️ Could not run linting. Tried: [commands]"
- Suggest: "Please verify linting tools are installed (ESLint, Prettier) and lint script exists"
- Continue with other validation if possible
- **Do NOT mark as Done IF linting is configured** (linting is mandatory when configured)

### If implementation fails (non-recoverable errors):

1. **Document the failure:**
   - What was attempted
   - What went wrong
   - Stack traces or error messages
   - Files that were partially modified

2. **Use Sequential-thinking to assess severity:**

   - Thought: "Implementation of {{issueId}} failed with: '[error description]'. I need to determine: 1) Is this recoverable? 2) Should work be cancelled or just paused? 3) What information does the team need? 4) What cleanup is needed?"
   - thoughtNumber: 1
   - totalThoughts: 4
   - nextThoughtNeeded: true

3. **If work should be cancelled (unrecoverable):**

   a. **Update issue status to "Cancelled":**
      ```
      Tool: mcp__linear__update_issue
      Parameters:
        id: "{{issueId}}"
        state: "Cancelled"
      ```

   b. **Add detailed comment with failure details:**
      ```
      Tool: mcp__linear__create_comment
      Parameters:
        issueId: "{{issueId}}"
        body: "❌ Implementation cancelled due to: [error description]

        ## What was attempted:
        - [list attempts]

        ## Error encountered:
        ```
        [error details]
        ```

        ## Files modified:
        - [list files - may need cleanup]

        ## Recommendation:
        [what should be done to resolve]"
      ```

   c. **Report to user:**
      - "❌ Issue {{issueId}} marked as 'Cancelled'"
      - "Reason: [error description]"
      - "Details added to Linear issue"

4. **If work should be paused (recoverable with user intervention):**
   - Leave status as "In Progress"
   - Add comment with error details
   - Request user guidance

---

## Multi-Issue Support

**If multiple issue IDs provided (comma-separated):**

Example: `/work:performwork TRG-123,TRG-124,TRG-125`

1. **Parse issue IDs:**
   - Split by comma
   - Trim whitespace

2. **Use Sequential-thinking to analyze dependencies:**

   - Thought: "Executing [N] issues: [list IDs and titles]. I need to: 1) Identify dependencies between them, 2) Determine execution order, 3) Identify which can run in parallel, 4) Assess total complexity."
   - thoughtNumber: 1
   - totalThoughts: 6
   - nextThoughtNeeded: true

3. **Execute in optimal order:**
   - Execute independent issues first
   - Execute dependent issues after their dependencies
   - Report progress after each issue

4. **Final multi-issue report:**
   ```
   📊 Multi-Issue Execution Summary:
   - Total issues: [N]
   - Completed: [N]
   - Failed: [N]
   - Discoveries: [N] new issues created
   ```

---

## Configuration

**Default behavior:**
- TypeScript/JavaScript code review by typescript-expert: MANDATORY for all TS/JS changes (NO EXCEPTIONS)
- Type checking: MANDATORY (cannot skip)
- Linting: MANDATORY (cannot skip if linting configured)
- Test running: Recommended but optional if tests don't exist
- Auto-fix: Enabled for trivial errors (unused imports, variables, linting auto-fixable)
- Discovery tracking: Automatic via /creatework command
- Parallel agent execution: Encouraged for independent concerns (research, TypeScript errors in different file sets)

---

## Notes

- **MANDATORY typescript-expert review:** ALL TypeScript/JavaScript code MUST be reviewed and refined by typescript-expert (NO EXCEPTIONS)
- **MANDATORY type checking:** Type errors must be addressed before marking Done
- **MANDATORY linting:** Linting errors must be addressed before marking Done (when linting configured)
- **Parallel agent execution:** Run independent agents simultaneously for 40-60% faster execution
- **Truthful documentation:** Never claim something works if it doesn't
- **Discovery tracking:** Always create separate issues for out-of-scope work
- **Use /creatework:** For ALL issue creation to ensure deduplication
- **Sequential-thinking integration:** Used at 8+ decision points for quality
- **Specialized agents:** TypeScript agents (type-expert, build-expert, expert), linting-expert, research-expert

---

**Remember:** This is an executable prompt. Actually perform the tool calls mentioned. Actually run type checking. Actually create Linear issues when needed. Do not just describe what should happen - make it happen.
