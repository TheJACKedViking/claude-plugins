---
name: work
description: Enterprise Linear issue management with intelligent workflows, type safety verification, and comprehensive validation. Use this skill when working with Linear issues - creating, executing, validating, or managing issue lifecycles. Includes smart deduplication, pattern learning, automated type checking, and multi-agent orchestration for maximum efficiency.
---

# Work Skill - Enterprise Linear Issue Management

## Overview

The Work Skill provides comprehensive Linear issue management capabilities optimized for AI-driven workflows. It integrates with Linear MCP, Sequential-thinking MCP, and Serena MCP to deliver intelligent issue creation, execution, and validation with enterprise-grade quality controls.

## Core Capabilities

### 1. **Create Linear Issues** (`creatework`)
Create high-quality Linear issues with intelligent deduplication, pattern learning, and comprehensive requirement extraction.

**When to use:**
- User wants to create a Linear issue
- Need to log a bug, feature request, or task
- Creating multiple related issues
- Documenting work items from analysis

**Key features:**
- Sequential-thinking for requirement extraction
- Smart deduplication to prevent duplicates
- Pattern learning from historical issues
- PRD-formatted descriptions
- Adaptive research depth (uses research-expert for unfamiliar tech)
- Codebase analysis (uses Serena MCP for existing code)

**See:** [commands/creatework.md](commands/creatework.md) for complete executable instructions

---

### 2. **Execute Linear Issues** (`performwork`)
Execute Linear issues with perfect requirement adherence, mandatory type checking, and parallel multi-agent orchestration.

**When to use:**
- User wants to work on a Linear issue
- Need to implement a feature or fix a bug
- Executing development tasks from Linear

**Key features:**
- **Maximum Parallelization Mode**: Automatic deployment of multiple agents in parallel
- **Mandatory TypeScript review**: ALL TS/JS code reviewed by typescript-expert
- **Iterative wave strategy**: Deploy up to 3 waves of agents to achieve zero errors
- **Quality gates**: Type checking, linting, business logic validation
- **PRD-formatted completion reports**: Comprehensive documentation
- **Discovery tracking**: Automatic creation of tracking issues for out-of-scope work

**Quality thresholds (automatic parallel deployment):**
- >6 modified files → Deploy 2+ typescript-expert agents
- >20 type errors → Deploy 2+ type-resolution agents in Wave 1
- >50 type errors → Deploy 3+ agents in parallel
- >30 linting errors → Deploy 2+ linting-expert agents
- >10 complex functions → Deploy parallel code-review-expert agents

**See:** [commands/performwork.md](commands/performwork.md) for complete executable instructions

---

### 3. **Validate Codebase** (`validate`)
Run comprehensive validation with smart parallelization, caching, and detailed metrics.

**When to use:**
- Need to check code quality
- Pre-commit validation
- After making significant changes
- Quality assurance checks

**Key features:**
- Type checking
- Linting with auto-fix
- Test execution
- Build verification
- Smart recommendations via Sequential-thinking

**Modes:**
- `--quick`: Type checking only
- `--full`: All validation layers (default)
- `--fix`: Auto-fix simple issues

**See:** [commands/validate.md](commands/validate.md) for complete executable instructions

---

### 4. **System Diagnostics** (`diagnostic`)
Comprehensive health monitoring for all AI command systems.

**When to use:**
- Troubleshooting issues with work commands
- Verifying MCP connections
- Initial setup verification
- Debugging command failures

**Key features:**
- MCP server health checks
- Linear connection testing
- Project setup verification
- Dependency checks
- Sequential-thinking integration testing

**Modes:**
- `full`: Complete diagnostic (default)
- `quick`: Essential checks only
- `linear`: Linear MCP only
- `mcp`: All MCP servers

**See:** [commands/diagnostic.md](commands/diagnostic.md) for complete executable instructions

---

### 5. **Linear Workspace Setup** (`linear-setup`)
Initialize Linear workspace with batch operations and error recovery.

**When to use:**
- First-time setup of Linear integration
- Verifying Linear MCP configuration
- Testing Linear API permissions
- Team onboarding

**Key features:**
- Connection verification
- Workspace discovery
- Test issue creation
- State workflow mapping
- Sequential-thinking integration testing

**See:** [commands/linear-setup.md](commands/linear-setup.md) for complete executable instructions

---

## Supporting Files

### Command References
All command files contain complete, executable instructions:
- `commands/creatework.md` - Create Linear issues
- `commands/performwork.md` - Execute Linear issues
- `commands/validate.md` - Validate codebase
- `commands/diagnostic.md` - System diagnostics
- `commands/linear-setup.md` - Linear workspace setup

### Agent Definitions
Specialized agents for TypeScript code quality:
- `agents/typescript-expert.md` - General TypeScript/JavaScript review
- `agents/typescript-type-expert.md` - Complex type system issues
- `agents/typescript-build-expert.md` - Module resolution and build issues
- `agents/research-expert.md` - Technology and API research

### Templates
- `PRD_TEMPLATE.md` - Linear issue PRD format guide

---

## Usage Instructions

### Creating a Linear Issue

When a user wants to create a Linear issue:

1. **Read the creatework command:** `commands/creatework.md`
2. **Extract the issue description** from user's request
3. **Execute all phases** in the command file:
   - Phase 1: Requirement extraction with Sequential-thinking
   - Phase 1.5: Domain research & codebase analysis (conditional)
   - Phase 2: Duplicate detection
   - Phase 3: Issue structure optimization
   - Phase 4: Create the Linear issue
   - Phase 5: Report results

**Example user request:**
> "Create a Linear issue for adding JWT authentication"

**Your action:**
1. Read `commands/creatework.md`
2. Execute with description: "Add JWT authentication"
3. Follow all phases including Sequential-thinking calls
4. Actually create the issue via Linear MCP
5. Report the issue ID and URL

---

### Executing a Linear Issue

When a user wants to work on a Linear issue:

1. **Read the performwork command:** `commands/performwork.md`
2. **Extract the issue ID** from user's request
3. **Execute all phases** in the command file:
   - Phase 0: Fetch issue from Linear
   - Phase 0.5: Multi-agent orchestration strategy
   - Phase 1: Requirement analysis
   - Phase 1.5: Code discovery with Serena MCP
   - Phase 2: Implementation (direct or agent-based)
   - Phase 2.3: Parallel TypeScript code review (MANDATORY)
   - Phase 3: Validation (type checking, tests, linting)
   - Phase 3.5: Type error resolution with iterative waves (MANDATORY)
   - Phase 3.7: Linting error resolution (MANDATORY)
   - Phase 3.9: Business logic validation (MANDATORY)
   - Phase 4: Documentation and Linear update
   - Phase 5: Final report

**CRITICAL:** Maximum Parallelization Mode is DEFAULT
- Automatically deploy multiple agents in parallel based on thresholds
- Use iterative waves (up to 3) to achieve zero errors
- All TypeScript/JavaScript code MUST be reviewed (NO EXCEPTIONS)

**Example user request:**
> "Work on issue TRG-123"

**Your action:**
1. Read `commands/performwork.md`
2. Execute with issueId: "TRG-123"
3. Follow ALL phases including mandatory reviews and quality gates
4. Deploy parallel agents automatically when thresholds are met
5. Actually update Linear with completion report

---

### Running Validation

When a user wants to validate code:

1. **Read the validate command:** `commands/validate.md`
2. **Execute all phases** in the command file
3. **Run the actual validation commands** (typecheck, lint, test, build)
4. **Report truthful results**

---

### Running Diagnostics

When a user needs to troubleshoot or verify setup:

1. **Read the diagnostic command:** `commands/diagnostic.md`
2. **Execute all diagnostic checks**
3. **Actually test MCP connections**
4. **Report accurate status**

---

### Setting Up Linear Workspace

When a user needs to configure Linear integration:

1. **Read the linear-setup command:** `commands/linear-setup.md`
2. **Execute all setup phases**
3. **Actually create test issues to verify**
4. **Report configuration status**

---

## Integration with Other Systems

### MCP Dependencies

This skill requires the following MCP servers:

**Required:**
- **Linear MCP**: For issue creation, updates, and queries
  - Tools: `create_issue`, `update_issue`, `get_issue`, `create_comment`, etc.

**Highly Recommended:**
- **Sequential-thinking MCP**: For intelligent decision-making
  - Tool: `mcp__sequential-thinking__sequentialthinking`
  - Used in: creatework (requirement extraction), performwork (error analysis)

**Optional but Valuable:**
- **Serena MCP**: For codebase analysis
  - Tools: `find_symbol`, `get_symbols_overview`, `search_for_pattern`
  - Used in: creatework (codebase analysis), performwork (code discovery)

### Agent Dependencies

The skill uses the Task tool to launch specialized agents:

**TypeScript Experts:**
- `typescript-expert` - General TypeScript/JavaScript review
- `typescript-type-expert` - Complex type system issues
- `typescript-build-expert` - Module resolution problems

**Other Experts:**
- `research-expert` - Technology and API research
- `general-purpose` - For exploratory tasks

---

## Quality Controls

### Mandatory Requirements

When executing issues with `performwork`:

1. **Mandatory TypeScript/JavaScript Review**
   - ALL `.ts`, `.tsx`, `.js`, `.jsx`, `.vue` files MUST be reviewed
   - NO EXCEPTIONS - automatic parallel deployment based on file count
   - Uses cascading subagents for complex modules

2. **Mandatory Type Checking**
   - Must run `npm run typecheck` or equivalent
   - Must achieve zero errors OR create tracking issues
   - Iterative wave strategy (up to 3 waves of agents)

3. **Mandatory Linting**
   - Must run linting if configured
   - Auto-fix attempted first
   - Parallel agents deployed if errors remain

4. **Business Logic Validation**
   - Review all modified functions for correctness
   - Not just type safety - actual logic validation
   - Deploy parallel code-review-expert agents for complex changes

5. **Truthful Documentation**
   - Completion reports must reflect actual state
   - Never claim something works if it doesn't
   - Mark requirements as incomplete if blocked

### Zero-Error Enforcement

**Quality Gates** block progression until passing:
- Gate 1: Zero type errors OR tracking issues created
- Gate 2: Zero linting errors OR tracking issues created
- Gate 3: Zero business logic issues OR tracking issues created
- Gate 4: All requirements met OR documented as incomplete

**Cannot mark issue as "Done" unless:**
- All quality gates passed
- All requirements completed or tracked
- TypeScript review completed (if TS/JS changes)
- Validation passing

---

## Pattern Learning

The skill learns from historical data:

**Issue Creation:**
- Common patterns by issue type
- Suggested labels based on content
- Similar issue detection
- Requirement templates

**Issue Execution:**
- Error patterns and fixes
- Common validation failures
- Successful implementation approaches

**Validation:**
- Recurring error patterns
- Auto-fix strategies
- Performance baselines

---

## Error Handling

### Graceful Degradation

If MCP servers are unavailable:

**Linear MCP missing:**
- Report error clearly
- Cannot create/update issues
- Provide prepared data for manual entry

**Sequential-thinking MCP missing:**
- Fall back to pattern-based logic
- Still functional but reduced intelligence
- Warn user of degraded capability

**Serena MCP missing:**
- Skip codebase analysis phases
- Continue with user-provided context
- Note limitation in reports

### Recovery Strategies

**For validation errors:**
1. Wave 1: Deploy parallel agents based on thresholds
2. Re-validate and count remaining errors
3. Wave 2: Different strategy based on Sequential-thinking analysis
4. Re-validate and count remaining errors
5. Wave 3: Final attempt or create tracking issues

**For blocking issues:**
- Set Linear issue to "On Hold"
- Create tracking issue for blocker
- Document dependency clearly
- Stop execution

**For discoveries:**
- Use `/work:creatework` to track separately
- Link to parent issue
- Continue with original scope
- Report discoveries in completion summary

---

## Best Practices

### When Creating Issues

1. Provide clear, specific descriptions
2. Let the skill check for duplicates
3. Review suggested requirements before creating
4. Use research-expert for unfamiliar technologies
5. Use Serena MCP for modifications to existing code

### When Executing Issues

1. Always read requirements thoroughly
2. Trust the automatic parallelization thresholds
3. Let quality gates block progression until passing
4. Create tracking issues for out-of-scope concerns (not scope creep)
5. Ensure completion reports are truthful

### When Validating

1. Run after significant changes
2. Use `--fix` for auto-fixable issues
3. Review all validation layers
4. Use Sequential-thinking for prioritizing complex issues

---

## Troubleshooting

### Commands Not Working

**Run diagnostics:**
```
diagnostic full
```

**Common issues:**
- Linear MCP not connected
- Missing dependencies (run `npm install`)
- Sequential-thinking MCP unavailable
- Incorrect Linear API permissions

### Type Errors Blocking Completion

**Check:**
1. Did Wave 1 agents complete?
2. Were errors re-validated?
3. Did Sequential-thinking analysis run for Wave 2?
4. Were tracking issues created for architectural concerns?

**Remember:** Zero-error enforcement means you must either fix errors OR create tracking issues

### Parallel Agents Not Deploying

**Check thresholds:**
- Need >6 files for automatic parallel deployment
- Need >20 errors for parallel type error resolution
- Can manually deploy parallel agents even below thresholds

---

## Examples

### Example 1: Create and Execute a Feature

User: "Create an issue for adding dark mode, then implement it"

**Action 1 - Create:**
1. Read `commands/creatework.md`
2. Use Sequential-thinking to extract requirements
3. Check for duplicates via Linear MCP
4. Create issue with PRD format
5. Report issue ID (e.g., "TRG-456")

**Action 2 - Execute:**
1. Read `commands/performwork.md`
2. Fetch TRG-456 from Linear
3. Plan multi-agent orchestration
4. Implement dark mode
5. Deploy parallel typescript-expert agents (if >6 files)
6. Run validation with iterative waves
7. Update Linear with completion report

### Example 2: Validate Before Commit

User: "Validate my code before I commit"

**Action:**
1. Read `commands/validate.md`
2. Run `npm run typecheck`
3. Run `npm run lint`
4. Run `npm run test`
5. Run `npm run build`
6. Report comprehensive results
7. Use Sequential-thinking to prioritize fixes if issues found

### Example 3: Troubleshoot Work Commands

User: "Why isn't creatework working?"

**Action:**
1. Read `commands/diagnostic.md`
2. Check all MCP servers
3. Test Linear MCP specifically
4. Test Sequential-thinking MCP
5. Report status and provide fix instructions

---

## Critical Reminders

### For ALL Commands

- **These are EXECUTABLE commands, not documentation**
- You must ACTUALLY call the tools mentioned (Linear MCP, Sequential-thinking, etc.)
- You must ACTUALLY run the validation commands
- You must ACTUALLY create/update Linear issues
- You must report TRUTHFUL results

### For performwork Specifically

- **MANDATORY typescript-expert review** - ALL TS/JS files, NO EXCEPTIONS
- **MANDATORY validation** - Type checking and linting must pass or be tracked
- **MAXIMUM PARALLELIZATION MODE** - Deploy multiple agents automatically
- **ITERATIVE WAVES** - Up to 3 waves to achieve zero errors
- **QUALITY GATES** - Block progression until passing
- **TRUTHFUL DOCUMENTATION** - Never claim success if errors remain

### For creatework Specifically

- **ACTUALLY use Sequential-thinking** - Not optional, must call the tool
- **ACTUALLY check for duplicates** - Search Linear before creating
- **ACTUALLY create the issue** - Must receive an issue ID back
- Use research-expert when unfamiliar tech is mentioned
- Use Serena MCP when modifying existing code

---

## Version History

- **v1.0** - Initial conversion from work plugin to Claude Skill
  - Enterprise Linear issue management
  - Multi-agent orchestration
  - Maximum parallelization mode
  - Iterative wave strategy
  - Zero-error enforcement
  - PRD-formatted documentation

---

## Support

For issues or questions:
- Run `diagnostic full` to check system health
- Review command files in `commands/` directory
- Check agent definitions in `agents/` directory
- Consult `PRD_TEMPLATE.md` for formatting guidelines

**Repository**: https://github.com/TheJACKedViking/claude-plugins
