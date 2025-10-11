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

   - Thought: "During implementation of {{issueId}}, I discovered: '[discovery description]'. I need to determine: 1) Is this within scope of current issue or separate? 2) Is it blocking current work? 3) What priority should it have? 4) Should I fix it now or create a tracking issue?"
   - thoughtNumber: 1
   - totalThoughts: 5
   - nextThoughtNeeded: true

3. **If separate issue needed:**
   - Use the `/work:creatework` slash command to create it
   - Provide clear description of the discovered issue
   - Link it to the current issue in your summary

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

**Step 2: Invoke appropriate TypeScript agent**

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

### Validation Results
- Type check: [✅ Pass / ❌ [N] errors remaining]
- Tests: [✅ Pass / ⚠️ Not run / ❌ [N] failures]

### Discoveries
- [Discovery 1 - Issue ID if created]
- [Discovery 2 - Issue ID if created]

### Technical Notes
[Any important implementation details, decisions made, or caveats]
```

### 4.2 Update Linear Issue

1. **Add comment to Linear issue with summary:**
   - Use Linear MCP tool to create comment
   - Include the completion summary

2. **Update issue state (ONLY if all requirements met):**

   **Criteria to mark as "Done":**
   - ✅ All requirements completed
   - ✅ Type check passing OR tracking issues created for remaining errors
   - ✅ Tests passing (if tests exist)
   - ✅ No blocking discoveries

   **If criteria met:**
   - Update issue state to "Done"
   - Report: "✅ Issue {{issueId}} marked as Done"

   **If criteria NOT met:**
   - Keep current state or move to "In Progress"
   - Report: "⚠️ Issue remains open due to: [reasons]"

---

## Phase 5: Final Report to User

Display comprehensive report:

```
═══════════════════════════════════════════════════════════
✅ Issue {{issueId}} Execution Complete
═══════════════════════════════════════════════════════════

📋 Requirements: [N/M completed]
🔧 Files Modified: [N]
✅ Type Check: [status]
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

### If typecheck fails to run:
- Report: "⚠️ Could not run type checking. Tried: [commands]"
- Suggest: "Please verify npm packages are installed and typecheck script exists"
- Continue with other validation if possible

### If implementation fails:
- Document what was attempted
- Create detailed error report
- Add comment to Linear issue with failure details
- Do NOT mark issue as Done

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
- Type checking: MANDATORY (cannot skip)
- Test running: Recommended but optional if tests don't exist
- Auto-fix: Enabled for trivial errors (unused imports, variables)
- Discovery tracking: Automatic via /creatework command

---

## Notes

- **MANDATORY type checking:** Type errors must be addressed before marking Done
- **Truthful documentation:** Never claim something works if it doesn't
- **Discovery tracking:** Always create separate issues for out-of-scope work
- **Use /creatework:** For ALL issue creation to ensure deduplication
- **Sequential-thinking integration:** Used at 8+ decision points for quality

---

**Remember:** This is an executable prompt. Actually perform the tool calls mentioned. Actually run type checking. Actually create Linear issues when needed. Do not just describe what should happen - make it happen.
