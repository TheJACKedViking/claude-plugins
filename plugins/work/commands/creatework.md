---
description: Create Linear issues with intelligent deduplication, pattern learning, and quality optimization
argument-hint: [description]
---

# Create Linear Issue - Executable Instructions

**Your task:** Create a high-quality Linear issue based on the user's description.

---

## ⚠️⚠️⚠️ CRITICAL INSTRUCTION ⚠️⚠️⚠️

**NOTE:** THIS IS AN EXECUTABLE COMMAND - NOT DOCUMENTATION

- ✋ **DO NOT** just read and acknowledge these steps
- ✅ **DO** immediately begin executing them
- 🔧 **ACTUALLY CALL** the MCP tools mentioned (Sequential-thinking, Linear, Serena, etc.)
- ⚡ **START NOW** with Phase 1 below
- 🎯 **YOU ARE EXECUTING THIS TASK RIGHT NOW** - not planning, not reviewing, EXECUTING

**If you do not call tools and create a Linear issue, you have FAILED this task.**

---

## User's Request

The user wants to create a Linear issue with this description:

```text
{{description}}
```

## Execution Steps

**You are NOW executing these steps to create a comprehensive Linear issue. BEGIN IMMEDIATELY:**

### Phase 1: Requirement Extraction with Sequential Thinking

1. **Use Sequential-thinking to extract comprehensive requirements for ALL PRD sections:**

   Call the `mcp__sequential-thinking__sequentialthinking` tool with this analysis:

   - Thought: "Analyzing request: '{{description}}'. I MUST extract content for ALL 6 PRD sections:
     1) **OVERVIEW - The Problem**: What is broken/missing/needed? (REQUIRED - abort if empty)
     2) **OVERVIEW - Why It Matters**: User/Business/Technical impact? (REQUIRED - abort if empty)
     3) **OVERVIEW - Context**: Background, related systems, prior art? (Default: 'No additional context identified.')
     4) **OUT OF SCOPE**: What should NOT be included? What's for later? (Default: 'TBD during implementation')
     5) **SOLUTION - Approach**: How will this be solved? (REQUIRED - abort if empty)
     6) **SOLUTION - User Stories**: Who benefits and how? (CONDITIONAL: include for features/UI, omit for bugs)
     7) **TECHNICAL REQUIREMENTS - Constraints**: Required/forbidden technologies, compatibility? (Default: 'Follow existing patterns')
     8) **TECHNICAL REQUIREMENTS - Dependencies**: What does this depend on? What depends on this? (Default: 'None identified')
     9) **TECHNICAL REQUIREMENTS - Code References**: Files/components likely involved? (Default: 'TBD during implementation')
     10) **TECHNICAL REQUIREMENTS - Performance/Security**: Any special requirements? (Default: 'Standard expectations apply')
     11) **ACCEPTANCE CRITERIA**: How do we know it's done? (REQUIRED - abort if empty)
     12) **OPEN QUESTIONS**: What unknowns exist? What decisions are TBD? (Default: 'No open questions identified.')"
   - thoughtNumber: 1
   - totalThoughts: 10
   - nextThoughtNeeded: true

2. **Parse the Sequential-thinking output** to extract content for EACH PRD section:

   **REQUIRED sections (cannot proceed without content):**
   - Overview > The Problem
   - Overview > Why It Matters
   - Solution > Approach
   - Acceptance Criteria (at least 1 criterion)

   **DEFAULTABLE sections (use defaults if not determined):**
   - Overview > Context → Default: "No additional context identified."
   - Out of Scope → Default: "TBD - to be refined during implementation"
   - Technical Requirements > Constraints → Default: "Follow existing codebase patterns and conventions"
   - Technical Requirements > Dependencies → Default: "None identified"
   - Technical Requirements > Code References → Default: "TBD during implementation"
   - Technical Requirements > Performance/Security → Default: "Standard expectations apply"
   - Open Questions → Default: "No open questions identified at this time."

   **CONDITIONAL sections:**
   - User Stories → Include for features/UI work; omit for bug fixes

   Also extract:
   - Edge cases to handle
   - Complexity assessment (simple/moderate/complex)

3. **Display the extracted requirements with section coverage** to the user:

   ```text
   🧠 Requirement Analysis Results:
   - Explicit requirements: [count]
   - Implicit requirements: [count]
   - Edge cases: [count]
   - Complexity: [simple/moderate/complex]

   📋 PRD Section Coverage:
   - Overview (Problem/Why/Context): ✅ Extracted
   - Out of Scope: [✅ Extracted | ⚠️ Using default]
   - Solution (Approach/Stories): ✅ Extracted
   - Technical Requirements: [✅ [N] constraints | ⚠️ Using defaults]
   - Acceptance Criteria: ✅ [N] criteria
   - Open Questions: [✅ [N] questions | ⚠️ None identified]
   ```

### Phase 1.5: Domain Research & Codebase Analysis (Conditional)

**Use research-expert and Serena MCP when needed for comprehensive requirement gathering.**

#### When to Use Research-Expert

Use the research-expert agent if the description mentions:

- Unfamiliar technologies, libraries, or frameworks
- External APIs or services
- Domain-specific patterns or best practices
- Complex technical concepts requiring investigation
- Industry standards or compliance requirements

#### Research-Expert Invocation

1. **Determine research scope from Sequential-thinking analysis:**
   - What technologies/APIs/concepts need investigation?
   - What level of research depth? (Quick verification vs deep dive)

2. **Launch research-expert agent using Task tool:**

   ```text
   Agent: research-expert
   Task: "Research [specific technology/API/pattern] for implementing: [requirement description]

   Context: Creating Linear issue for '{{description}}'

   Please provide:
   1. Key concepts and how they work
   2. Best practices and common patterns
   3. Potential pitfalls to avoid
   4. Integration considerations
   5. Example implementations if available

   Research mode: FOCUSED INVESTIGATION MODE"
   ```

3. **Integrate research findings into requirements:**
   - Add discovered best practices to technical specifications
   - Include pitfalls as edge cases
   - Update complexity assessment if needed
   - Add research insights to issue description

#### When to Use Serena MCP

Use Serena MCP if the description mentions:

- Modifying existing code or features
- Building on existing patterns
- Working with specific files or components
- Understanding current implementation

#### Serena MCP Codebase Analysis

1. **Use Serena MCP to understand existing code:**

   ```text
   Tool: mcp__serena__find_symbol
   Parameters:
     name_path: "ComponentName"  # from description
     substring_matching: true
     relative_path: "src/"
   ```

2. **Get code structure overview:**

   ```text
   Tool: mcp__serena__get_symbols_overview
   Parameters:
     relative_path: "path/to/relevant/file.ts"
   ```

3. **Search for existing patterns:**

   ```text
   Tool: mcp__serena__search_for_pattern
   Parameters:
     substring_pattern: "similar pattern"
     restrict_search_to_code_files: true
   ```

4. **Integrate codebase findings:**
   - Add "Files likely to modify" to technical specifications
   - Note existing patterns to follow
   - Identify dependencies on current code
   - Update requirements based on current implementation

#### Output from Phase 1.5

After research/analysis (if performed), you should have:

- Enhanced requirements with research insights
- Understanding of existing codebase patterns
- More accurate complexity assessment
- Technical specifications grounded in reality
- Files and components that will be affected

### Phase 2: Duplicate Detection with Sequential Thinking

1. **Search for potential duplicates** using available Linear MCP tools:
   - Search Linear for issues with similar titles/descriptions
   - Look for issues with similar keywords
   - Check recent issues in the same team

2. **If potential duplicates found (similarity > 70%):**

   a. Use Sequential-thinking to analyze duplicates:

   - Thought: "Analyzing [N] potential duplicate(s). New request: '{{description}}'. Most similar existing: '[existing issue title]'. I need to determine: 1) Are these truly duplicates or just similar?, 2) What are the key differences?, 3) Would creating a new issue add value or create clutter?, 4) Should we enhance existing issue instead?, 5) Is the context different enough to warrant separate tracking?"
   - thoughtNumber: 1
   - totalThoughts: 6
   - nextThoughtNeeded: true

   b. Parse the duplicate decision:
   - Is this a real duplicate? (YES/NO)
   - Confidence level (%)
   - Reasoning
   - Recommendation (create new vs enhance existing)

   c. **If high-confidence duplicate (>80%):**
   - Inform user about the existing issue
   - Suggest enhancing the existing issue instead
   - **STOP - do not create a new issue**

   d. **If medium confidence (60-80%):**
   - Note the similarity but continue with creation
   - Add a reference to the similar issue in the description

3. **If no duplicates or low confidence (<60%):**
   - Proceed to issue creation

### Phase 3: Issue Structure Optimization with Sequential Thinking

1. **Use Sequential-thinking to optimize issue structure:**

   - Thought: "Creating Linear issue for: '{{description}}'. I have [N] functional requirements, [N] technical specs, [N] edge cases. I need to determine: 1) Best way to structure the description for AI consumption, 2) Optimal title format, 3) Priority level based on impact and urgency, 4) Most relevant labels, 5) Whether to include all suggestions or filter some out, 6) How to organize requirements for clarity."
   - thoughtNumber: 1
   - totalThoughts: 8
   - nextThoughtNeeded: true

2. **Parse the structure decision:**
   - Recommended title format
   - Priority level (0-4)
   - Structure approach
   - Labels to include

### Phase 3.5: PRD Section Validation (MANDATORY)

**Before proceeding to issue creation, validate ALL required PRD sections have content.**

This validation is NON-NEGOTIABLE. Issue creation MUST NOT proceed without passing this gate.

#### Section Requirements Table

| Section | Requirement | Default if Empty | Abort if Missing? |
|---------|-------------|------------------|-------------------|
| Overview > The Problem | REQUIRED | Cannot be empty | ⛔ YES - ABORT |
| Overview > Why It Matters | REQUIRED | Cannot be empty | ⛔ YES - ABORT |
| Overview > Context | REQUIRED | "No additional context identified." | No |
| **Out of Scope** | REQUIRED | See defaults below | No |
| Solution > Approach | REQUIRED | Cannot be empty | ⛔ YES - ABORT |
| Solution > User Stories | CONDITIONAL | Include for features; omit for bugs | No |
| Solution > Key Implementation Notes | OPTIONAL | Omit if none | No |
| **Technical Requirements** | REQUIRED | See defaults below | No |
| Acceptance Criteria | REQUIRED | Cannot be empty (min 1 criterion) | ⛔ YES - ABORT |
| **Open Questions** | REQUIRED | "No open questions identified at this time." | No |
| AI Metadata | REQUIRED | Auto-generated | No |

#### Default Content for Empty Sections

**Out of Scope** (if nothing specific identified):

```markdown
## Out of Scope

The following are explicitly NOT part of this issue:
- TBD - to be refined during implementation
- Future enhancements beyond core requirements
```

**Technical Requirements** (if no specific constraints identified):

```markdown
## Technical Requirements

### Constraints
- **Must follow**: Existing codebase patterns and conventions
- **Must preserve**: Backward compatibility with existing functionality

### Dependencies
- **Related**: None identified

### Code References
- Files to modify: TBD during implementation
- Components affected: TBD during implementation

### Performance/Security
- Standard performance expectations apply
- Follow existing security patterns
```

**Open Questions** (if none identified):

```markdown
## Open Questions

No open questions identified at this time.

If questions arise during implementation, they should be:
1. Added to this issue as comments
2. Discussed with stakeholders before proceeding
```

#### Validation Steps

1. **Review extracted content from Phase 1:**
   - For each PRD section, check if content was extracted
   - Apply defaults for any DEFAULTABLE section that is empty

2. **Build section content map:**

   ```text
   PRD_SECTIONS = {
     "overview_problem": [extracted or ABORT],
     "overview_why": [extracted or ABORT],
     "overview_context": [extracted or default],
     "out_of_scope": [extracted or default],
     "solution_approach": [extracted or ABORT],
     "solution_stories": [extracted or omit],
     "solution_notes": [extracted or omit],
     "tech_constraints": [extracted or default],
     "tech_dependencies": [extracted or default],
     "tech_code_refs": [extracted or default],
     "tech_perf_security": [extracted or default],
     "acceptance_criteria": [extracted or ABORT],
     "open_questions": [extracted or default]
   }
   ```

3. **Validate completeness:**
   - If ANY section marked "ABORT" is empty → **STOP and inform user**
   - All other sections must have either extracted content OR applied defaults

4. **Display validation result:**

   ```text
   📋 PRD Section Validation:
   ┌─────────────────────────┬──────────┬────────────────┐
   │ Section                 │ Status   │ Source         │
   ├─────────────────────────┼──────────┼────────────────┤
   │ Overview > Problem      │ ✅ PASS  │ Extracted      │
   │ Overview > Why          │ ✅ PASS  │ Extracted      │
   │ Overview > Context      │ ✅ PASS  │ [Extracted/Default] │
   │ Out of Scope            │ ✅ PASS  │ [Extracted/Default] │
   │ Solution > Approach     │ ✅ PASS  │ Extracted      │
   │ Technical Requirements  │ ✅ PASS  │ [Extracted/Default] │
   │ Acceptance Criteria     │ ✅ PASS  │ Extracted      │
   │ Open Questions          │ ✅ PASS  │ [Extracted/Default] │
   └─────────────────────────┴──────────┴────────────────┘

   ✅ PRD VALIDATION PASSED - Proceeding to issue creation
   ```

5. **If validation fails:**

   ```text
   ❌ PRD VALIDATION FAILED

   Missing required sections:
   - [Section name]: [Why it's required]

   Cannot create issue without:
   - Clear problem statement
   - Impact assessment
   - Solution approach
   - At least one acceptance criterion

   Please provide more details about: [missing info]
   ```

   **STOP - DO NOT PROCEED TO PHASE 4**

### Phase 4: Create the Linear Issue

1. **Generate an optimized title:**
   - Keep it concise (max 80 characters)
   - Use action-based language ("Implement X", "Fix Y", "Add Z")
   - Include key context

2. **Build comprehensive description using PRD format**:

   **Reference**: See `PRD_TEMPLATE.md` in the work plugin for complete guidelines.

   **PRD Structure** (adapt based on issue type - feature/bug/discovery/error-fix):

```markdown
## Overview

### The Problem
[1-2 sentences describing the issue, bug, or opportunity from user's description]

### Why It Matters
- **User Impact**: [How this affects users]
- **Business Impact**: [Why this is important]
- **Technical Impact**: [System/codebase implications]

### Context
[Background, links to discussions, related issues if known]

## Out of Scope

The following are explicitly NOT part of this issue:
- [Item 1 that might seem related but isn't included]
- [Item 2 that will be handled separately]
- [Future considerations noted during analysis]

## Solution

### Approach
[High-level description of how this will be solved - from Sequential-thinking analysis]

### User Stories
- **US-1**: As a [role], I want [action] so I can [outcome]
- **US-2**: As a [role], I want [action] so I can [outcome]

### Key Implementation Notes
- [Technical note 1 from requirements extraction]
- [Technical note 2 from research/codebase analysis]
- Files/components: `[file paths if known from Serena MCP]`
- Patterns to follow: [from existing codebase if discovered]

## Technical Requirements

### Constraints
- **Must use**: [Required technology/library/pattern]
- **Cannot use**: [Forbidden approaches if any]
- **Must preserve**: [Existing behavior/backward compatibility requirements]

### Dependencies
- **Requires**: [Other issues, external dependencies]
- **Related**: [Similar issues if found during duplicate check]

### Code References
- Files to modify: `[file paths from Serena MCP analysis]`
- Components affected: `[component names]`
- APIs/services: `[endpoints/services from research-expert]`

### Performance/Security
- [Performance requirements if applicable]
- [Security considerations from analysis]

## Acceptance Criteria

### Functional Requirements
- [ ] [Explicit requirement 1 from Phase 1]
- [ ] [Explicit requirement 2 from Phase 1]
- [ ] [Explicit requirement N]

### AI-Suggested Requirements
- [ ] 🤖 [Implicit requirement 1] (confidence: [X]%)
- [ ] 🤖 [Implicit requirement 2] (confidence: [X]%)

### Technical Validation
- [ ] All type checks passing (`npm run typecheck`)
- [ ] All linting passing (`npm run lint`)
- [ ] All tests passing (if applicable)
- [ ] Code reviewed by typescript-expert (if TS/JS changes)

### Edge Cases
- [ ] [Edge case 1 handled]
- [ ] [Edge case 2 handled]

## Open Questions

- **Q1**: [Question needing investigation]
  - Status: To investigate
  - Decision: TBD

- **Q2**: [Technical tradeoff to consider]
  - Option A: [Pro/con]
  - Option B: [Pro/con]
  - Decision: TBD

---

## AI Metadata

```json
{
  "complexity": "[simple/moderate/complex]",
  "estimatedHours": [X],
  "requirementCount": [N],
  "createdBy": "Claude Code /creatework",
  "createdAt": "[ISO timestamp]",
  "sequentialThinkingUsed": true,
  "duplicatesChecked": [N],
  "researchPerformed": [true/false],
  "codebaseAnalyzed": [true/false],
  "prdVersion": "1.0"
}
```

1. **PRE-CREATION VALIDATION CHECKLIST (MANDATORY)**

   **Before calling Linear MCP, verify the description includes ALL required sections:**

   PRE-CREATION CHECKLIST:

- [ ] `## Overview` with `### The Problem` (NOT empty)
- [ ] `## Overview` with `### Why It Matters` (NOT empty)
- [ ] `## Overview` with `### Context` (can be default)
- [ ] `## Out of Scope` with at least one bullet point
- [ ] `## Solution` with `### Approach` (NOT empty)
- [ ] `## Technical Requirements` with at least `### Constraints`
- [ ] `## Acceptance Criteria` with at least one `- [ ]` checkbox
- [ ] `## Open Questions` (can be "None identified" but MUST exist)
- [ ] `## AI Metadata` JSON block

**If ANY section is missing, add the default placeholder content from Phase 3.5 BEFORE proceeding.**

- Missing `## Out of Scope` → Add default: "TBD - to be refined during implementation"
- Missing `## Technical Requirements` → Add default block from Phase 3.5
- Missing `## Open Questions` → Add: "No open questions identified at this time."

1. **Call the Linear MCP tool to create the issue:**
   - Use whatever Linear MCP tools are available
   - Common tool names might be: `mcp__linear__create_issue`, `mcp__linear__createIssue`, or similar
   - If you encounter errors about tool names, try variations and report the error to the user

2. **Set appropriate metadata:**
   - Team: "The Reiss Group" (or user's configured team)
   - Priority: [from Sequential-thinking decision]
   - Labels: [from Sequential-thinking decision]
   - State: "Backlog" or "Todo"

### Phase 5: Report Results

1. **Display success message:**

```text
✅ Linear Issue Created: [ISSUE-ID]

📊 Creation Metrics:

- Requirements: [N] core + [N] suggested
- Validation criteria: [N]
- Edge cases: [N]
- Complexity: [simple/moderate/complex]
- Duplicates checked: [N] similar found, [N]% risk

🔗 Issue URL: [URL]

```

1. **POST-CREATION PRD COMPLIANCE CHECK (MANDATORY)**

   After receiving the Linear issue ID, report compliance status:

```text
✅ PRD COMPLIANCE REPORT:
┌─────────────────────────────┬──────────┬─────────────────┐
│ Section                     │ Present? │ Source          │
├─────────────────────────────┼──────────┼─────────────────┤
│ Overview > The Problem      │ [✅/❌]  │ Extracted       │
│ Overview > Why It Matters   │ [✅/❌]  │ Extracted       │
│ Overview > Context          │ [✅/❌]  │ [Ext./Default]  │
│ Out of Scope                │ [✅/❌]  │ [Ext./Default]  │
│ Solution > Approach         │ [✅/❌]  │ Extracted       │
│ Technical Requirements      │ [✅/❌]  │ [Ext./Default]  │
│ Acceptance Criteria         │ [✅/❌]  │ Extracted       │
│ Open Questions              │ [✅/❌]  │ [Ext./Default]  │
│ AI Metadata                 │ [✅/❌]  │ Auto-generated  │
└─────────────────────────────┴──────────┴─────────────────┘

COMPLIANCE SCORE: [9/9] sections present = 100%
TARGET: 100% (all 9 sections required)

```

**If compliance score < 100%:**

- This indicates a BUG in the creatework command
- Log which sections were missing
- The issue was still created but may need manual editing

1. **If creation failed:**
   - Explain the error clearly
   - Suggest fixes (e.g., "Linear MCP server may be disconnected")
   - Show what data was prepared for creation

## Error Handling

- **If Linear MCP tools are not available:**
  - Inform user: "❌ Linear MCP server is not connected. Please ensure the Linear MCP server is configured and running."
  - List the requirements that were extracted
  - Suggest the user manually create the issue or reconnect the MCP server

- **If tool calls fail:**
  - Report the specific error
  - Show the prepared issue data
  - Suggest troubleshooting steps

## Notes

- Always use Sequential-thinking for the 3 main decision points (requirements, duplicates, structure)
- Be honest about what you can and cannot determine
- If unsure about complexity, default to "moderate"
- If unable to create the issue due to MCP errors, provide all extracted information so the user can create it manually

## Template Support

If the user specifies `--template=[type]`, use the following templates:

- **bug-fix**: Include "Reproduce bug", "Identify root cause", "Add regression test"
- **feature**: Include "Define requirements", "Design API/UI", "Add comprehensive tests", "Document usage"
- **refactor**: Include "Preserve existing behavior", "Improve code quality", "Update tests if needed"
- **performance**: Include "Set measurable goals", "Add performance benchmarks", "Document improvements"

If `--list-templates` is specified, show available templates and exit without creating an issue.

## Bulk Mode Support

If the user specifies `--bulk` with multiple descriptions, handle each one separately following the same process, but optimize by:

1. Running requirement extraction in parallel
2. Checking for duplicates within the batch
3. Detecting dependencies between new issues
4. Creating them in optimal order

---

## ⚠️ FINAL REMINDER ⚠️

**This was an EXECUTABLE command, not documentation.**

Did you:

- ✅ Actually call Sequential-thinking 3 times (requirements, duplicates, structure)?
- ✅ Actually search Linear for duplicate issues?
- ✅ Actually call the Linear MCP tool to CREATE the issue?
- ✅ Actually receive a Linear issue ID back (like TRG-123)?
- ✅ Actually display the success message with metrics?

**If you just read this and said "Yes I'll do that" - YOU FAILED. GO BACK AND ACTUALLY EXECUTE.**

**If you did not receive a Linear issue ID, you did NOT create an issue - you FAILED this task.**
