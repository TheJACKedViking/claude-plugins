---
description: Create Linear issues with intelligent deduplication, issue type detection, and PRD optimization
argument-hint: [description] [--dry-run] [--simple] [--force] [--template=TYPE] [--project=NAME]
skills: prd-format
---

# Create Linear Issue - Executable Instructions

**Your task:** Create a high-quality Linear issue based on the user's description.

---

## CRITICAL INSTRUCTION

**NOTE:** THIS IS AN EXECUTABLE COMMAND - NOT DOCUMENTATION

- **DO NOT** just read and acknowledge these steps
- **DO** immediately begin executing them
- **ACTUALLY CALL** the MCP tools mentioned (Thoughtbox, LSP, Linear, Serena, Context7, etc.)
- **START NOW** with Phase 0 below
- **YOU ARE EXECUTING THIS TASK RIGHT NOW** - not planning, not reviewing, EXECUTING

**If you do not call tools and create a Linear issue, you have FAILED this task.**

---

## User's Request

The user wants to create a Linear issue with this description:

```text
{{description}}
```

## Configuration

```yaml
skills:
  prd-format:  # Loaded via frontmatter - provides PRD template and validation rules
    location: skills/prd-format/SKILL.md
    purpose: PRD formatting, section requirements, defaults, validation

flags:
  --dry-run: Preview what would be created without creating
  --simple: Skip Thoughtbox analysis for simple issues (direct creation)
  --force: Override duplicate detection and create anyway
  --template: Use specific template (bug-fix, feature, refactor, performance, discovery)
  --project: Associate with Linear project by name or ID

thresholds:
  duplicate_high: 80    # Above this = high-confidence duplicate (stop unless --force)
  duplicate_medium: 50  # 50-80 = medium confidence (warn + continue)
  duplicate_low: 50     # Below this = proceed without warning

issue_types:
  # Auto-detected from description keywords or --template flag
  bug-fix:
    keywords: ["bug", "fix", "broken", "error", "crash", "fails", "not working"]
    mental_models: ["five-whys", "rubber-duck"]
    prd_focus: "The Bug + Root Cause"
    labels: ["bug"]
  feature:
    keywords: ["add", "implement", "create", "new", "feature", "support"]
    mental_models: ["decomposition", "assumption-surfacing", "pre-mortem"]
    prd_focus: "Full PRD with user stories"
    labels: ["feature"]
  refactor:
    keywords: ["refactor", "cleanup", "improve", "optimize", "restructure"]
    mental_models: ["trade-off-matrix", "abstraction-laddering"]
    prd_focus: "Preserve behavior + improve quality"
    labels: ["refactor"]
  performance:
    keywords: ["slow", "performance", "speed", "optimize", "latency", "memory"]
    mental_models: ["fermi-estimation", "constraint-relaxation"]
    prd_focus: "Measurable benchmarks"
    labels: ["performance"]
  discovery:
    keywords: ["investigate", "research", "explore", "understand", "spike"]
    mental_models: ["decomposition", "assumption-surfacing"]
    prd_focus: "Open Questions emphasis"
    labels: ["discovery", "spike"]

label_detection:
  # Auto-suggest labels from description content
  area_patterns:
    frontend: ["UI", "component", "button", "form", "page", "view", "React", "Vue"]
    backend: ["API", "endpoint", "server", "database", "query", "service"]
    infra: ["deploy", "CI", "CD", "Docker", "Kubernetes", "config"]
    docs: ["documentation", "README", "docs", "comment"]
    testing: ["test", "spec", "coverage", "e2e", "unit"]

thoughtbox:
  # Tiered mental model usage
  tier1:  # Always use (critical decisions)
    - decomposition         # Break down requirements
    - assumption-surfacing  # Extract implicit requirements
  tier2:  # Use if complexity > simple
    - steelmanning          # Duplicate analysis
    - trade-off-matrix      # Structure optimization
  tier3:  # Use for complex issues
    - pre-mortem            # Risk assessment
    - five-whys             # Root cause for bugs

  # Branching for alternative approaches
  branching:
    when: "Multiple valid approaches exist"
    example: "branchFromThought: 2, branchId: 'approach-a'"

  # Revision for updating earlier thinking
  revision:
    when: "New information invalidates earlier analysis"
    example: "isRevision: true, revisesThought: 3"

lsp:
  # Operations for code analysis
  discovery:
    - documentSymbol     # Get file structure
    - workspaceSymbol    # Cross-file symbol search
  navigation:
    - goToDefinition     # Find implementations
    - findReferences     # Impact analysis
  type_info:
    - hover              # Get type information and documentation
  call_analysis:
    - incomingCalls      # Who calls this
    - outgoingCalls      # What this calls
```

> **Note**: The `prd-format` skill is auto-loaded and provides the complete PRD template,
> section requirements, default content, and validation rules. Refer to it for detailed
> formatting guidance.

---

## Execution State

Initialize at Phase 0. Update throughout. Reference for decisions.

```javascript
execution_state = {
  description: "{{description}}",
  team: null,              // Detected from Linear
  project: null,           // From --project flag or null

  flags: {
    dry_run: false,
    simple_mode: false,
    force: false,          // Override duplicate detection
    template: null,        // bug-fix, feature, refactor, performance, discovery
  },

  // Issue type detection
  issue_type: {
    detected: null,        // Auto-detected or from --template
    keywords_matched: [],  // Which keywords triggered detection
    mental_models: [],     // Models to use for this type
    prd_focus: null,       // Special PRD section emphasis
  },

  // Label detection
  labels: {
    type: [],              // From issue_type (bug, feature, etc.)
    area: [],              // From label_detection patterns
    custom: [],            // User-specified
  },

  // Thoughtbox tracking
  thoughtbox: {
    session_id: null,      // CAPTURED from tool response
    thought_count: 0,
    mental_models_used: [],
    branches: [],          // Alternative approach branches
    revisions: [],         // Revised thoughts
  },

  // Analysis results
  analysis: {
    requirements: {
      explicit: [],
      implicit: [],
      edge_cases: [],
    },
    complexity: null,      // simple, moderate, complex
    duplicates: {
      found: [],
      highest_confidence: 0,
      recommendation: null,
    },
    lsp_performed: false,
    context7_used: false,
  },

  // Final issue
  issue: {
    id: null,
    identifier: null,      // e.g., "TRG-123"
    url: null,
    title: null,
    priority: 3,           // Default: Normal
  },

  timestamps: {
    started: null,
    completed: null,
  }
}
```

---

## Named Patterns

### [PROGRESS]

Display progress indicator for long-running operations:

```text
[PROGRESS] [Phase N/5] [Phase Name] - [Current Action]
  ├─ [Step 1 status]
  ├─ [Step 2 status]
  └─ [Current step...]
```

### [CONTEXT7_LOOKUP]

When encountering unfamiliar libraries or APIs:

```yaml
# Step 1: Resolve library ID
Tool: mcp__context7__resolve-library-id
Parameters:
  libraryName: "[library name]"
  query: "[what you need to know]"

# Step 2: Query documentation
Tool: mcp__context7__query-docs
Parameters:
  libraryId: "[resolved ID from step 1]"
  query: "[specific question]"
```

### [LINEAR_CALL]

Linear API calls with retry wrapper:

```yaml
Tool: mcp__linear__[operation]
Parameters: [operation-specific]
# Retry: 2 attempts with 15s delay
# Timeout: 30s per attempt
```

---

## Execution Flow

```text
Phase 0: Initialize
    ↓
Phase 1: Extract Requirements (Thoughtbox + LSP)  ──┐
    ↓                                               │ PARALLEL
Phase 2: Check Duplicates (Linear search)        ──┘
    ↓
Phase 3: Optimize Structure (Thoughtbox)
    ↓
Phase 4: Create Issue (Linear MCP)
    ↓
Phase 5: Report Results
```

---

## Phase 0: Initialize

**[PROGRESS] [Phase 0/5] Initialize - Starting issue creation**

### 0.1 Parse All Flags

```yaml
dry_run: [true if --dry-run present]
simple_mode: [true if --simple present]
force: [true if --force present]
template: [value if --template=VALUE present, null otherwise]
project: [value if --project=VALUE present, null otherwise]
```

Store in `execution_state.flags`

### 0.2 Detect Team

**DO NOT hardcode team name.** Detect from Linear:

```yaml
Tool: mcp__linear__list_teams
Parameters:
  limit: 5
```

Store: `execution_state.team = [first team or user's default]`

### 0.3 Detect Issue Type

**Priority order:**
1. `--template` flag value (explicit)
2. Auto-detect from description keywords

```text
FOR each issue_type in config.issue_types:
  FOR each keyword in issue_type.keywords:
    IF keyword IN description (case-insensitive):
      execution_state.issue_type.keywords_matched.push(keyword)

IF keywords_matched.length > 0:
  execution_state.issue_type.detected = [type with most matches]
  execution_state.issue_type.mental_models = issue_types[detected].mental_models
  execution_state.issue_type.prd_focus = issue_types[detected].prd_focus
  execution_state.labels.type = issue_types[detected].labels
ELSE:
  execution_state.issue_type.detected = "feature"  # Default
```

### 0.4 Detect Area Labels

```text
FOR each area, patterns in config.label_detection.area_patterns:
  FOR each pattern in patterns:
    IF pattern IN description (case-insensitive):
      execution_state.labels.area.push(area)
      BREAK  # One match per area is enough
```

### 0.5 Resolve Project (if --project flag)

**IF `--project` flag is present:**

```yaml
Tool: mcp__linear__list_projects
Parameters:
  query: "[project name from flag]"
  limit: 5
```

Store: `execution_state.project = [matched project ID]`

IF no match found: warn user but continue

### 0.6 Display Initialization Summary

```text
═══════════════════════════════════════════════════════════
CREATEWORK INITIALIZATION
═══════════════════════════════════════════════════════════

Description: {{description}}
Team: [detected team name]
Project: [project name or "None"]

Detected:
├─ Issue Type: [type] (keywords: [matched keywords])
├─ Type Labels: [type labels]
├─ Area Labels: [area labels]
└─ Mental Models: [models for this type]

Flags:
├─ dry_run: [yes/no]
├─ simple_mode: [yes/no]
├─ force: [yes/no]
└─ template: [value or "auto-detect"]
═══════════════════════════════════════════════════════════
```

### 0.7 Handle Simple Mode

**IF `--simple` flag is present:**

```text
[PROGRESS] [Phase 0/5] Initialize - Simple mode enabled

Simple mode: Skipping Thoughtbox analysis
Direct creation with minimal processing...
```

**SKIP to Phase 4** with default values:
- Title: First 80 chars of description
- Priority: 3 (Normal)
- Complexity: simple
- Use PRD defaults for all sections
- Labels: From issue_type + area detection

---

## Phase 1: Requirement Extraction

**[PROGRESS] [Phase 1/5] Requirements - Extracting with Thoughtbox**

### 1.1 Initialize Thoughtbox Session

Call `mcp__thoughtbox__thoughtbox`:

```yaml
thought: "TASK: Extract comprehensive requirements from: '{{description}}'

DECOMPOSITION FRAMEWORK:
1) OVERVIEW - The Problem: What is broken/missing/needed?
2) OVERVIEW - Why It Matters: User/Business/Technical impact?
3) OVERVIEW - Context: Background, related systems?
4) OUT OF SCOPE: What should NOT be included?
5) SOLUTION - Approach: How will this be solved?
6) SOLUTION - User Stories: Who benefits and how?
7) TECHNICAL REQUIREMENTS - Constraints: Required/forbidden tech?
8) TECHNICAL REQUIREMENTS - Dependencies: What depends on what?
9) TECHNICAL REQUIREMENTS - Code References: Files involved?
10) ACCEPTANCE CRITERIA: How do we know it's done?
11) OPEN QUESTIONS: What unknowns exist?

Beginning systematic extraction..."
thoughtNumber: 1
totalThoughts: 6
nextThoughtNeeded: true
sessionTitle: "creatework-{{description}}"
sessionTags: ["creatework", "requirements", "linear"]
```

**CRITICAL: Capture sessionId from response:**
```yaml
execution_state.thoughtbox.session_id = [response.sessionId]
```

### 1.2 Apply Assumption-Surfacing

```yaml
thought: "Applying ASSUMPTION-SURFACING mental model:

EXPLICIT from description:
- [List what user directly stated]

IMPLICIT (hidden assumptions):
- [What did user assume we'd know?]
- [What edge cases weren't mentioned?]
- [What constraints are implied by context?]

Extracting requirements for each PRD section..."
thoughtNumber: 2
totalThoughts: 6
nextThoughtNeeded: true
```

### 1.3 Assess Complexity

```yaml
thought: "COMPLEXITY ASSESSMENT:

Factors:
- File count: [estimated]
- Cross-cutting concerns: [yes/no]
- External dependencies: [yes/no]
- Ambiguity level: [low/medium/high]

Complexity: [simple/moderate/complex]

SECTION COVERAGE CHECK:
- Overview (Problem/Why/Context): [status]
- Out of Scope: [status]
- Solution (Approach/Stories): [status]
- Technical Requirements: [status]
- Acceptance Criteria: [count] criteria
- Open Questions: [count] questions"
thoughtNumber: 3
totalThoughts: 6
nextThoughtNeeded: true
```

### 1.4 Display Extraction Results

```text
[PROGRESS] [Phase 1/5] Requirements - Extraction complete

Requirement Analysis Results:
├─ Explicit requirements: [count]
├─ Implicit requirements: [count]
├─ Edge cases: [count]
└─ Complexity: [simple/moderate/complex]

PRD Section Coverage:
├─ Overview (Problem/Why/Context): Extracted
├─ Out of Scope: [Extracted | Using default]
├─ Solution (Approach/Stories): Extracted
├─ Technical Requirements: [[N] constraints | Using defaults]
├─ Acceptance Criteria: [N] criteria
└─ Open Questions: [[N] questions | None identified]
```

---

## Phase 2: Code Analysis + Duplicate Detection (PARALLEL)

**[PROGRESS] [Phase 2/5] Analysis - Running code analysis and duplicate check in parallel**

**Execute these operations IN PARALLEL using multiple tool calls:**

### 2.1 Code Analysis (if description mentions existing code)

#### LSP Code Discovery

**Get file structure:**

```yaml
Tool: LSP
Parameters:
  operation: "documentSymbol"
  filePath: "[relevant file path]"
  line: 1
  character: 1
```

**Get type information with hover:**

```yaml
Tool: LSP
Parameters:
  operation: "hover"
  filePath: "[file]"
  line: [line of symbol]
  character: [character]
```

**Find all references for impact analysis:**

```yaml
Tool: LSP
Parameters:
  operation: "findReferences"
  filePath: "[file]"
  line: [line]
  character: [char]
```

**Analyze call hierarchy:**

```yaml
Tool: LSP
Parameters:
  operation: "incomingCalls"
  filePath: "[file]"
  line: [line]
  character: [char]
```

#### Serena MCP for Symbol Analysis

```yaml
Tool: mcp__serena__get_symbols_overview
Parameters:
  relative_path: "path/to/relevant/file.ts"
```

**After gathering information, consolidate understanding:**

```yaml
Tool: mcp__serena__think_about_collected_information
```

#### Context7 for Unfamiliar Technologies

**IF description mentions unfamiliar libraries/APIs:**

Use [CONTEXT7_LOOKUP] pattern:

```yaml
# Step 1: Resolve library
Tool: mcp__context7__resolve-library-id
Parameters:
  libraryName: "[library name from description]"
  query: "best practices for [what we need to implement]"

# Step 2: Get specific docs
Tool: mcp__context7__query-docs
Parameters:
  libraryId: "[resolved ID]"
  query: "[specific implementation question]"
```

### 2.2 Duplicate Detection (PARALLEL with 2.1)

**Search for potential duplicates:**

```yaml
Tool: mcp__linear__list_issues
Parameters:
  query: "[key terms from description]"
  team: [execution_state.team]
  limit: 20
```

**For bug-fix issues: Also check Sentry for existing error reports:**

```yaml
# Only if execution_state.issue_type.detected == "bug-fix"
Tool: mcp__claude_ai_Sentry__search_issues
Parameters:
  organizationSlug: "enflame-media-llc"
  naturalLanguageQuery: "[error message or pattern from description]"
  regionUrl: "https://us.sentry.io"
```

If Sentry issues found, include their URLs and frequency data in the Linear issue description under Technical Requirements > Context. This helps developers see error impact before starting work.

**If potential duplicates found, analyze with Thoughtbox:**

```yaml
Tool: mcp__thoughtbox__thoughtbox
thought: "STEELMANNING ANALYSIS for duplicate detection:

New request: '{{description}}'
Most similar existing: '[existing issue title]'

STRONGEST CASE FOR DUPLICATE:
- Shared goals: [list]
- Overlapping acceptance criteria: [list]
- Same affected components: [yes/no]

STRONGEST CASE FOR DISTINCT:
- Different context: [explain]
- Non-overlapping requirements: [list]
- Different acceptance criteria: [list]

VERDICT:
- Is this a real duplicate? [YES/NO]
- Confidence: [%]
- Recommendation: [create new | enhance existing]"
thoughtNumber: 4
totalThoughts: 6
nextThoughtNeeded: true
```

#### Duplicate Decision Matrix

| Confidence | Threshold | Action |
|------------|-----------|--------|
| ≥80% | `duplicate_high` | **STOP** - inform user of existing issue |
| 60-80% | `duplicate_medium` | **WARN** - continue with reference |
| <60% | `duplicate_low` | **PROCEED** - no duplicate concern |

**If high-confidence duplicate:**

```text
⚠️ HIGH-CONFIDENCE DUPLICATE DETECTED

Existing issue: [ISSUE-ID] - [Title]
Confidence: [X]%

The existing issue appears to cover:
- [overlapping requirement 1]
- [overlapping requirement 2]

Recommendation: Enhance [ISSUE-ID] instead of creating a new issue.

To proceed anyway, run with --force flag.
```

**IF `--force` flag is NOT set:** STOP - do not create issue

**IF `--force` flag IS set:**

```text
⚠️ FORCE MODE: Proceeding despite duplicate detection

Creating new issue with reference to potential duplicate...
```

Continue to Phase 3, but add to description:

```markdown
> **Note**: This issue may overlap with [ISSUE-ID]. Review for potential consolidation.
```

---

## Phase 3: Structure Optimization

**[PROGRESS] [Phase 3/5] Structure - Optimizing issue structure**

### 3.1 Apply Trade-Off Matrix

```yaml
Tool: mcp__thoughtbox__thoughtbox
thought: "TRADE-OFF MATRIX for issue structure:

Issue: '{{description}}'
Requirements count: [N]
Edge cases: [N]

OPTIMIZATION DIMENSIONS:
| Factor          | Option A (Detailed) | Option B (Concise) |
|-----------------|---------------------|-------------------|
| AI parseability | High                | Medium            |
| Human readability| Medium             | High              |
| Maintenance     | Higher effort       | Lower effort      |

TITLE OPTIONS:
1. Action-based: 'Implement [X]' / 'Fix [Y]' / 'Add [Z]'
2. Problem-based: '[Problem] in [Component]'

PRIORITY ASSESSMENT:
- User impact: [1-5]
- Business impact: [1-5]
- Technical debt: [1-5]
- Recommended priority: [0-4 scale]

LABELS:
- Type: [feature/bug/enhancement/refactor]
- Area: [from codebase analysis]"
thoughtNumber: 5
totalThoughts: 6
nextThoughtNeeded: true
```

### 3.2 Pre-Mortem for Complex Issues

**IF complexity = complex:**

```yaml
Tool: mcp__thoughtbox__thoughtbox
thought: "PRE-MORTEM: Imagining this issue has FAILED.

FAILURE SCENARIOS:
1. Scope creep: [what could expand?]
2. Technical blockers: [what dependencies might break?]
3. Missing requirements: [what wasn't captured?]
4. Integration issues: [what could conflict?]

PREVENTIVE MEASURES:
- Add to Out of Scope: [items]
- Add to Acceptance Criteria: [items]
- Add to Open Questions: [items]"
thoughtNumber: 6
totalThoughts: 6
nextThoughtNeeded: false
```

### 3.3 Validate PRD Sections

**Section Requirements Table:**

| Section | Requirement | Default if Empty | Abort? |
|---------|-------------|------------------|--------|
| Overview > The Problem | REQUIRED | Cannot be empty | YES |
| Overview > Why It Matters | REQUIRED | Cannot be empty | YES |
| Overview > Context | REQUIRED | "No additional context identified." | No |
| Out of Scope | REQUIRED | "TBD - to be refined during implementation" | No |
| Solution > Approach | REQUIRED | Cannot be empty | YES |
| Solution > User Stories | CONDITIONAL | Features only | No |
| Technical Requirements | REQUIRED | Use defaults | No |
| Acceptance Criteria | REQUIRED | Min 1 criterion | YES |
| Open Questions | REQUIRED | "No open questions identified." | No |
| AI Metadata | REQUIRED | Auto-generated | No |

**Validation output:**

```text
PRD Section Validation:
├─ Overview > Problem      [PASS] Extracted
├─ Overview > Why          [PASS] Extracted
├─ Overview > Context      [PASS] [Ext./Default]
├─ Out of Scope            [PASS] [Ext./Default]
├─ Solution > Approach     [PASS] Extracted
├─ Technical Requirements  [PASS] [Ext./Default]
├─ Acceptance Criteria     [PASS] [N] criteria
└─ Open Questions          [PASS] [Ext./Default]

PRD VALIDATION: PASSED ✓
```

**If validation fails:**

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

**STOP - do not proceed**

---

## Phase 4: Create Linear Issue

**[PROGRESS] [Phase 4/5] Create - Building and creating issue**

### 4.1 Handle Dry-Run Mode

**IF `--dry-run` flag is present:**

```text
═══════════════════════════════════════════════════════════
DRY RUN - Issue would be created with:
═══════════════════════════════════════════════════════════

Title: [optimized title]
Team: [team name]
Priority: [0-4] ([label])
Labels: [list]
Complexity: [simple/moderate/complex]

Description Preview (first 500 chars):
───────────────────────────────────────────────────────────
[truncated description]
───────────────────────────────────────────────────────────

PRD Sections:
├─ Overview: [char count] chars
├─ Out of Scope: [item count] items
├─ Solution: [char count] chars
├─ Technical Requirements: [constraint count] constraints
├─ Acceptance Criteria: [criterion count] criteria
└─ Open Questions: [question count] questions

To create this issue, run without --dry-run flag.
═══════════════════════════════════════════════════════════
```

**STOP - do not create issue**

### 4.2 Pre-Creation Summary

**Display before creating:**

```text
═══════════════════════════════════════════════════════════
PRE-CREATION SUMMARY
═══════════════════════════════════════════════════════════

Title: [optimized title]
Team: [team name]
Priority: [0-4] ([Urgent/High/Normal/Low])
Complexity: [simple/moderate/complex]

Requirements Summary:
├─ Core requirements: [N]
├─ Edge cases: [N]
├─ Acceptance criteria: [N]
└─ Open questions: [N]

Analysis Performed:
├─ Thoughtbox session: [session_id]
├─ LSP analysis: [yes/no]
├─ Duplicate check: [N] similar found ([X]% max similarity)
└─ Context7 lookup: [yes/no]

Creating issue...
═══════════════════════════════════════════════════════════
```

### 4.3 Build PRD Description

**Reference `prd-format` skill for template structure.**

**AI Metadata block (always include):**

```json
{
  "complexity": "[simple/moderate/complex]",
  "requirementCount": [N],
  "createdBy": "Claude Code /creatework",
  "createdAt": "[ISO timestamp]",
  "thoughtboxSession": "[execution_state.thoughtbox.session_id]",
  "lspAnalysisPerformed": [true/false],
  "context7Used": [true/false],
  "prdVersion": "3.0"
}
```

### 4.4 Verify Labels Exist

**Before creating issue, verify labels exist in Linear:**

```yaml
Tool: mcp__linear__list_issue_labels
Parameters:
  team: "[execution_state.team]"
  limit: 100
```

**Filter to existing labels only:**
```javascript
available_labels = [labels returned from Linear]
all_labels = [
  ...execution_state.labels.type,    # From issue type (bug, feature, etc.)
  ...execution_state.labels.area,    # From area detection (frontend, backend, etc.)
  ...execution_state.labels.custom,  # From Thoughtbox recommendations
]
// Only use labels that exist
valid_labels = all_labels.filter(label =>
  available_labels.some(al => al.name.toLowerCase() === label.toLowerCase())
)

// Warn about missing labels
missing = all_labels.filter(l => !valid_labels.includes(l))
if (missing.length > 0):
  console.warn("Labels not found in Linear:", missing)
```

### 4.5 Create Issue

```yaml
Tool: mcp__linear__create_issue
Parameters:
  title: "[optimized title]"
  description: "[full PRD markdown]"
  team: "[execution_state.team]"           # Team name or ID (Linear accepts both)
  project: "[execution_state.project]"     # Project ID (if set via --project flag)
  priority: [0-4 from Thoughtbox decision]
  labels: [valid_labels array]             # Only verified labels
  state: "Backlog"
```

**Note**: Linear's `create_issue` accepts team name or ID. The project parameter
requires the project ID (resolved in Phase 0.5).

**Store the response:**
```yaml
execution_state.issue:
  id: [response.id]
  identifier: [response.identifier]  # e.g., "TRG-123"
  url: [response.url]  # Actual Linear URL
  title: [response.title]
```

---

## Phase 5: Report Results

**[PROGRESS] [Phase 5/5] Complete - Reporting results**

### 5.1 Display Success Message

```text
═══════════════════════════════════════════════════════════
✓ LINEAR ISSUE CREATED SUCCESSFULLY
═══════════════════════════════════════════════════════════

Issue: [IDENTIFIER] - [Title]
URL: [execution_state.issue.url]

Creation Metrics:
├─ Requirements: [N] core + [N] edge cases
├─ Acceptance criteria: [N]
├─ Complexity: [simple/moderate/complex]
└─ Duplicates checked: [N] similar found

Analysis Summary:
├─ Thoughtbox session: [session_id]
├─ Mental models used: [list]
├─ LSP analysis: [yes/no]
└─ Context7 lookups: [N]

PRD Compliance: [9/9] sections (100%)
═══════════════════════════════════════════════════════════
```

### 5.2 PRD Compliance Report

```text
PRD COMPLIANCE REPORT:
| Section                     | Present | Source          |
|-----------------------------|---------|-----------------|
| Overview > The Problem      | ✓       | Extracted       |
| Overview > Why It Matters   | ✓       | Extracted       |
| Overview > Context          | ✓       | [Ext./Default]  |
| Out of Scope                | ✓       | [Ext./Default]  |
| Solution > Approach         | ✓       | Extracted       |
| Technical Requirements      | ✓       | [Ext./Default]  |
| Acceptance Criteria         | ✓       | Extracted       |
| Open Questions              | ✓       | [Ext./Default]  |
| AI Metadata                 | ✓       | Auto-generated  |

COMPLIANCE SCORE: 9/9 sections = 100% ✓
```

### 5.3 Handle Failure

**If creation failed:**

```text
═══════════════════════════════════════════════════════════
❌ ISSUE CREATION FAILED
═══════════════════════════════════════════════════════════

Error: [error message]

Troubleshooting:
├─ Linear MCP connected: [yes/no]
├─ Team detected: [team name or "NONE"]
└─ Description length: [chars] chars

Prepared Data:
├─ Title: [prepared title]
├─ Priority: [prepared priority]
└─ Requirements: [N] extracted

Suggestions:
- Check Linear MCP server connection
- Verify team exists and is accessible
- Try running with --dry-run to preview
═══════════════════════════════════════════════════════════
```

---

## Error Handling

### Linear MCP Unavailable

```text
❌ Linear MCP server is not connected.

Please ensure the Linear MCP server is configured in your
Claude Code settings.

Extracted requirements have been saved. You can:
1. Reconnect the MCP server and retry
2. Manually create the issue with the extracted content
```

### LSP Tools Fail

- Fall back to Serena MCP for code analysis
- Note in metadata: `"lspFallback": true`

### Thoughtbox Session Fails

- Continue with simpler extraction approach
- Note in metadata: `"thoughtboxAvailable": false`
- Use default complexity assessment

---

## Template Support

If the user specifies `--template=[type]`:

| Template | Focus | Mental Models |
|----------|-------|---------------|
| `bug-fix` | Root cause, regression test | FIVE-WHYS |
| `feature` | Full user stories, API design | DECOMPOSITION |
| `refactor` | Preserve behavior, impact analysis | findReferences |
| `performance` | Benchmarks, hotspots | Call hierarchy |

---

## FINAL VALIDATION

**This was an EXECUTABLE command, not documentation.**

Did you:
- [ ] Initialize Thoughtbox and capture session_id?
- [ ] Use LSP/Serena for code analysis (if relevant)?
- [ ] Use Context7 for unfamiliar libraries (if relevant)?
- [ ] Search Linear for duplicate issues?
- [ ] Display pre-creation summary?
- [ ] Call Linear MCP to CREATE the issue?
- [ ] Receive a Linear issue ID (like TRG-123)?
- [ ] Display the actual issue URL?
- [ ] Show PRD compliance report?

**If you did not receive a Linear issue ID, you did NOT create an issue - you FAILED this task.**
