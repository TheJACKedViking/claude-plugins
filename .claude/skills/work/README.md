# Work Skill

Enterprise Linear issue management with intelligent workflows, type safety verification, and comprehensive validation.

## Quick Start

This skill is automatically discovered by Claude Code. Simply reference Linear issues or request issue management, and Claude will use this skill.

### Automatic Usage Examples

**Create an issue:**
> "Create a Linear issue for adding user authentication"

**Execute an issue:**
> "Work on issue TRG-123"

**Validate code:**
> "Validate the codebase"

**Troubleshoot:**
> "Why aren't my work commands working?"

**Setup Linear:**
> "Set up my Linear workspace"

Claude will automatically:
1. Read the appropriate command from `commands/`
2. Execute all phases in the command
3. Use Sequential-thinking for intelligent decisions
4. Deploy parallel agents when thresholds are met
5. Report results and update Linear

## File Structure

```
.claude/skills/work/
├── SKILL.md                    # Main skill definition (READ THIS FIRST)
├── README.md                   # This file
├── PRD_TEMPLATE.md            # Linear issue formatting guide
├── commands/                   # Executable command instructions
│   ├── creatework.md          # Create Linear issues
│   ├── performwork.md         # Execute Linear issues
│   ├── validate.md            # Validate codebase
│   ├── diagnostic.md          # System health checks
│   ├── linear-setup.md        # Linear workspace setup
│   └── workflow.md            # Workflow management
└── agents/                     # Specialized agent definitions
    ├── typescript-expert.md
    ├── typescript-type-expert.md
    ├── typescript-build-expert.md
    └── research-expert.md
```

## Core Features

### 1. Create Linear Issues (creatework)
- Smart deduplication
- Sequential-thinking for requirement extraction
- Research-expert for unfamiliar technologies
- Serena MCP for codebase analysis
- PRD-formatted descriptions

### 2. Execute Linear Issues (performwork)
- **Maximum Parallelization Mode** (automatic)
- **Mandatory TypeScript review** for ALL TS/JS changes
- **Iterative wave strategy** (up to 3 waves to achieve zero errors)
- **Quality gates** enforce zero-error completion
- Multi-agent orchestration with cascading subagents

### 3. Validate Codebase (validate)
- Type checking
- Linting with auto-fix
- Test execution
- Build verification
- Smart recommendations

### 4. System Diagnostics (diagnostic)
- MCP server health
- Linear connection testing
- Project setup verification
- Dependency checks

### 5. Linear Setup (linear-setup)
- Connection verification
- Workspace discovery
- Permission testing
- Test issue creation

## Key Quality Controls

### Mandatory for performwork

1. **ALL TypeScript/JavaScript files reviewed**
   - Automatic parallel deployment based on file count
   - 4-6 files = 2 agents, 7-12 files = 3 agents, etc.

2. **Type errors must be zero OR tracked**
   - Wave 1: Deploy parallel agents
   - Re-validate
   - Wave 2: Different strategy based on failures
   - Re-validate
   - Wave 3: Create tracking issues if truly architectural

3. **Linting errors must be zero OR tracked**
   - Auto-fix attempted first
   - Parallel linting-expert agents if needed

4. **Business logic validated**
   - All functions reviewed for correctness
   - Not just type-safe, but logically correct

5. **Cannot mark Done unless all gates pass**

## MCP Dependencies

**Required:**
- Linear MCP - Issue creation and management

**Highly Recommended:**
- Sequential-thinking MCP - Intelligent decision-making
- Serena MCP - Codebase analysis

## Parallelization Thresholds

Automatic parallel agent deployment when:
- >6 modified files → 2+ typescript-expert agents
- >20 type errors → 2+ type-resolution agents
- >50 type errors → 3+ agents
- >30 linting errors → 2+ linting-expert agents
- >10 complex functions → Parallel code-review-expert agents

## Usage Notes

### When Claude Uses This Skill

Claude automatically invokes this skill when:
- User mentions Linear issues
- User requests creating or working on issues
- User asks for validation
- User needs diagnostics
- System detects Linear-related context

### How It Works

1. Claude reads the relevant command file (e.g., `commands/performwork.md`)
2. Executes ALL phases in the command sequentially
3. Actually calls MCP tools (Linear, Sequential-thinking, Serena)
4. Deploys agents automatically based on thresholds
5. Reports truthful results

### Critical: These Are Executable Commands

The files in `commands/` are NOT documentation - they are executable instructions.

When Claude reads `performwork.md`, Claude must:
- ✅ Actually fetch the Linear issue
- ✅ Actually run `npm run typecheck`
- ✅ Actually deploy typescript-expert agents
- ✅ Actually create tracking issues via creatework
- ✅ Actually update Linear with completion report

## Troubleshooting

### Skill Not Activating

**Check:**
1. Is the file at `.claude/skills/work/SKILL.md`?
2. Does the YAML frontmatter have proper `name` and `description`?
3. Are you mentioning Linear issues or issue management?

### Commands Not Working

**Run:**
> "Run diagnostics on my work system"

Claude will read `commands/diagnostic.md` and check:
- Linear MCP connection
- Sequential-thinking MCP availability
- Project dependencies
- Validation tools

### Type Errors Not Being Fixed

**Check:**
1. Did Wave 1 agents complete?
2. Was re-validation run after Wave 1?
3. Did Sequential-thinking analyze for Wave 2 strategy?
4. Were tracking issues created if architectural?

**Remember:** Zero-error enforcement means errors must be fixed OR tracked

## Version History

- **v1.0** (2025-11-05)
  - Converted from work plugin to Claude Skill
  - Enterprise Linear issue management
  - Multi-agent orchestration
  - Maximum parallelization mode
  - Iterative wave strategy
  - Zero-error enforcement

## Support

- **Repository**: https://github.com/TheJACKedViking/claude-plugins
- **Issues**: Report via GitHub Issues
- **Documentation**: See `SKILL.md` for complete guide

## License

MIT License - See repository LICENSE file
