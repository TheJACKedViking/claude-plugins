# Linear Issue PRD Template

This template synthesizes best practices from [ChatPRD for Claude Code](https://www.chatprd.ai/resources/PRD-for-Claude-Code) and [Figma's PRD Approach](https://www.cycle.app/blog/how-figma-writes-product-requirements-document-prd) for creating AI-optimized Linear Issues.

---

## Why PRD Format for Linear Issues?

Linear Issues formatted as PRDs provide:
- **AI-Parseable Structure**: Clear section headers enable Claude Code to fetch specific sections via MCP integration
- **Explicit Scope**: "Out of Scope" section prevents scope creep and clarifies boundaries
- **Measurable Success**: Checkbox acceptance criteria function as discrete items Claude can "tick"
- **Human Readability**: Structured format serves both developers and AI agents
- **Comprehensive Context**: Problem-Solution-Acceptance flow ensures complete understanding

---

## PRD Structure for Linear Issues

### 1. OVERVIEW
**Purpose**: Establish the problem/opportunity and why it matters

```markdown
## Overview

### The Problem
[1-2 sentences describing the issue, bug, or opportunity]

### Why It Matters
- **User Impact**: [How this affects users]
- **Business Impact**: [Why this is important to the business]
- **Technical Impact**: [System/codebase implications]

### Context
[Any relevant background, links to discussions, related issues]
```

**Guidelines**:
- Keep concise (3-5 sentences total)
- Focus on "why" not "how"
- Link to supporting data/discussions
- For bugs: Describe current vs expected behavior
- For features: Describe user need and benefit

---

### 2. OUT OF SCOPE
**Purpose**: Explicitly state what is NOT being addressed (Figma approach)

```markdown
## Out of Scope

The following are explicitly NOT part of this issue:
- [Item 1 that might seem related but isn't included]
- [Item 2 that will be handled separately]
- [Item 3 that's a future consideration]
```

**Guidelines**:
- Be explicit about boundaries
- Prevent scope creep
- Reference separate issues if they exist
- For bugs: Note what won't be fixed
- For features: Note what won't be included in MVP

---

### 3. SOLUTION
**Purpose**: Describe the approach and how users will interact (if applicable)

```markdown
## Solution

### Approach
[High-level description of how this will be solved - 2-4 sentences]

### User Stories (if applicable)
- **US-1**: As a [role], I want [action] so I can [outcome]
- **US-2**: As a [role], I want [action] so I can [outcome]

### Key Implementation Notes
- [Technical note 1]
- [Technical note 2]
- [Files/components likely to be modified]
```

**Guidelines**:
- Use atomic user stories (one action each)
- Focus on value delivered, not implementation details
- Reference existing patterns to follow
- Note architectural decisions
- Include file/component references when known

---

### 4. TECHNICAL REQUIREMENTS
**Purpose**: Explicit constraints, dependencies, and technical boundaries (ChatPRD approach)

```markdown
## Technical Requirements

### Constraints
- **Must use**: [Required technology/library/pattern]
- **Cannot use**: [Forbidden approaches]
- **Must preserve**: [Existing behavior/backward compatibility]

### Dependencies
- **Requires**: [Other issues, PRs, or external dependencies]
- **Blocks**: [Issues that are blocked by this]
- **Related**: [Similar/related issues]

### Code References
- Files to modify: `[file paths]`
- Components affected: `[component names]`
- APIs/services: `[endpoints/services]`

### Performance/Security
- [Any performance requirements]
- [Any security considerations]
- [Any compliance requirements]
```

**Guidelines**:
- Use bold for key terms (**Must use**, **Cannot**, **Requires**)
- List concrete technical constraints
- Reference file paths with `code formatting`
- Note backward compatibility needs
- Include security/performance criteria

---

### 5. ACCEPTANCE CRITERIA
**Purpose**: Measurable, checkbox-style success criteria (ChatPRD approach)

```markdown
## Acceptance Criteria

- [ ] [Specific, measurable outcome 1]
- [ ] [Specific, measurable outcome 2]
- [ ] [Specific, measurable outcome 3]
- [ ] All type checks passing (`npm run typecheck`)
- [ ] All linting passing (`npm run lint`)
- [ ] All tests passing (if applicable)
- [ ] Code reviewed by typescript-expert (if TS/JS changes)
```

**Guidelines**:
- Use checkbox format `- [ ]` for all criteria
- Make each criterion measurable (not "improve performance" but "reduce load time by 50ms")
- Include technical validation criteria
- List in priority order
- Keep atomic (one specific outcome per item)
- Always include type checking and linting criteria

---

### 6. OPEN QUESTIONS
**Purpose**: Document unknowns and decisions to be made (Figma approach)

```markdown
## Open Questions

- **Q1**: [Question that needs investigation]
  - Status: [To investigate / Under discussion / Resolved]
  - Decision: [TBD / Decision made]

- **Q2**: [Technical tradeoff to consider]
  - Option A: [Pro/con]
  - Option B: [Pro/con]
  - Decision: [TBD / Option X chosen because...]
```

**Guidelines**:
- Be explicit about what's unknown
- Document tradeoffs considered
- Track decision status
- Update as decisions are made
- Remove section if no open questions

---

## Special Adaptations by Issue Type

### Bug Fixes
- **OVERVIEW**: "The Bug" section describing current vs expected behavior + "Impact" section
- **OUT OF SCOPE**: What's NOT being fixed, why
- **SOLUTION**: Root cause + fix approach
- **TECHNICAL REQUIREMENTS**: Error codes, reproduction steps, affected versions
- **ACCEPTANCE CRITERIA**: Bug no longer reproduces + regression test added

### Discovery Issues
- **OVERVIEW**: What was discovered + why it needs separate tracking
- **OUT OF SCOPE**: What's NOT part of investigation
- **SOLUTION**: Investigation approach + what to research
- **OPEN QUESTIONS**: Primary section - list all unknowns to investigate

### Error-Fix Issues (TypeScript/Linting)
- **OVERVIEW**: Number and type of errors + where they occur
- **TECHNICAL REQUIREMENTS**: Specific error codes, file locations, severity
- **SOLUTION**: Fix strategy per error category
- **ACCEPTANCE CRITERIA**: All errors resolved + validation passing

### Features
- Use full template with all sections
- Emphasize User Stories in SOLUTION
- Include comprehensive ACCEPTANCE CRITERIA

---

## Formatting Best Practices

1. **Markdown Headers**: Use `##` for main sections, `###` for subsections
2. **Bold Keywords**: Use `**bold**` for important terms (Must, Cannot, Requires)
3. **Code Formatting**: Use backticks for `file paths`, `commands`, `variable names`
4. **Checkboxes**: Always use `- [ ]` format for acceptance criteria
5. **Bullet Points**: Use `-` for unordered lists, `1.` only for sequences
6. **Links**: Reference related issues as `[TRG-123]` or with full URLs
7. **Code Blocks**: Use triple backticks for multi-line code or error output

---

## AI Metadata (Optional Footer)

Include at end of Linear Issue for tracking and analytics:

```markdown
---

## AI Metadata

```json
{
  "complexity": "simple|moderate|complex",
  "estimatedHours": 2,
  "requirementCount": 5,
  "createdBy": "Claude Code /creatework",
  "createdAt": "2025-10-29T10:30:00Z",
  "lastAnalyzedBy": "claude-sonnet-4-5",
  "prdVersion": "1.0"
}
```\u0060\u0060\u0060
```

---

## Integration with Work Plugin Commands

### /creatework
- Uses Sequential-thinking to extract requirements
- Formats output as PRD based on this template
- Adapts sections based on issue type detected
- Includes AI Metadata for tracking

### /performwork
- Documents implementation using PRD format in completion summary
- Updates Linear Issue with PRD-formatted completion report
- Includes execution results in ACCEPTANCE CRITERIA checkboxes

---

## Template Flexibility

**Core Principle**: Structure for AI parsing, adapt for context

- **Simple issues**: Brief sections (2-3 lines each)
- **Complex issues**: Detailed sections with subsections
- **All issues**: Maintain section headers for AI parsing
- **Empty sections**: Include header + "N/A" rather than omitting

This ensures Claude Code can always fetch specific sections via MCP integration regardless of issue complexity.

---

## Version History

- **v1.0** (2025-10-29): Initial template synthesizing ChatPRD and Figma approaches
