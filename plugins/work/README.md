# Work Plugin

![Version](https://img.shields.io/badge/version-4.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

**Work** is an enterprise-grade Linear issue management plugin for Claude Code. It covers the lifecycle from issue creation to a review-ready PR: PRD-formatted issue creation with deduplication, and multi-phase execution with type safety verification, multi-agent error resolution, and truthful documentation.

It is built for **parallel agents**. Linear status is the coordination mechanism — see [Issue Ownership](#issue-ownership-linear-status) — so several agents can work a backlog without stepping on each other.

## Features

- **Intelligent issue creation**: deduplication, PRD formatting, label/priority inference
- **Ownership-aware execution**: claim, park, and hand off issues via Linear status
- **Inline structured analysis**: named reasoning lenses, no external reasoning service
- **Multi-agent execution**: parallel specialist agents in waves, with a circuit breaker
- **Type safety verification**: mandatory type check + lint gates before a PR is opened
- **Local memory stack**: auto-memory + Serena + OpenWolf, file-based, no cloud memory service
- **Checkpoint and resume**: durable handoffs that survive a new session on a different machine

## Commands

### 🎯 /work:creatework

Create Linear issues with intelligent deduplication, issue-type detection, and PRD optimization.

**Features**:

- Advanced deduplication to prevent duplicate issues
- Smart requirement extraction and complexity assessment
- Adaptive research depth based on complexity
- PRD formatting via the bundled `prd-format` skill
- Label and priority inference, validated against the workspace

**Usage**:

```bash
/work:creatework [issue details]
```

**Use Cases**:

- Creating new feature requests
- Logging bugs with context
- Planning technical tasks
- Documenting requirements

---

### 🚀 /work:performwork

Execute Linear issues with requirement adherence, mandatory type checking, and truthful documentation.

**Features**:

- Ownership claim before the first edit; guaranteed release on every exit path
- Perfect requirement adherence, 1:1 todo-to-requirement mapping
- Mandatory TypeScript type checking with wave-based error resolution
- Serena/LSP-driven code reading and symbol-level edits
- Comprehensive follow-up discovery (creates tracking issues)
- Checkpoint and resume system

**Execution Modes**:

- **ultra_fast**: trivial issues; single decomposition pass
- **fast**: skips orchestration planning
- **full**: complete 8-phase execution (default)

**Quality Controls**:

- Zero scope creep tolerance
- Mandatory type check before the issue moves to In Review
- Block completion on errors — unresolved errors park the issue instead of passing it
- Auto-refactor simple TypeScript errors

**Usage**:

```bash
/work:performwork [issue-id] [--resume] [--push] [--simple] [--project=NAME] [--cycle=NAME]
```

**Use Cases**:

- Executing development tasks
- Implementing features
- Fixing bugs with validation
- Continuing work another agent parked in Standby

---

## Issue Ownership (Linear Status)

**`In Progress` is an ownership claim, not a progress label.** This is what lets multiple agents share one backlog.

| Status | Meaning | May an agent pick it up? |
|--------|---------|--------------------------|
| **Todo** | Ready to start, nothing done yet | **Yes** — claim it first |
| **Standby** | Started work with no agent or engineer currently on it (parked/handoff state) | **Yes** — claim it and carry it to completion |
| **In Progress** | An agent or engineer is working it **right now** | **No** — only with explicit coordination with the owner |
| **Needs Action** | Blocked on a human decision or answer an agent must not make | No — leave it for the engineer |
| **In Review** | Fully complete, PR open, awaiting engineer code review and sign-off | No new implementation — review feedback only |
| **On Hold** | Blocked until another Linear issue lands | No |
| **Done** | Reviewed, merged, deployed | — |

**Transitions `/work:performwork` performs:**

- `Todo` / `Standby` → `In Progress` before the first edit (`[CLAIM_ISSUE]`). If the issue is already `In Progress`, the command stops rather than taking it over.
- Execution stops before completion, for any reason → `Standby` with a handoff comment listing what landed, what remains, and the branch/PR (`[RELEASE_CLAIM]`). **An issue is never left in `In Progress`.**
- A decision only a human can make → `Needs Action` with the question, the options considered, and a recommendation.
- Fully complete with a PR open → `In Review`.

**`Done` is not an agent transition.** An engineer moves `In Review` → `Done` after review and sign-off.

Your Linear team must have `Standby` and `Needs Action` workflow states (both of type *started*). Without them the command falls back to reporting the intended status and leaving the issue where it is.

## Structured Analysis (No External Reasoning Service)

Reasoning happens **inline** via the `[ANALYSIS]` pattern, using named lenses — decomposition, pre-mortem, inversion, five-whys, rubber-duck, abstraction-laddering, trade-off-matrix, assumption-surfacing, steelmanning.

Each analysis names its lens and follows one shape:

```text
[LENS] — [what is being decided]

Given:   [facts established so far]
Options: [the real alternatives]
Chosen:  [the option] because [rationale]
Risks:   [what this could break]
```

Durability comes from writing reasoning where the next agent will look — Linear checkpoint/handoff/completion comments plus the memory stack — not from an in-flight session handle. A `--resume` therefore works in a brand-new Claude Code session on a different machine.

When a decision is **not the agent's to make** (design choice, product/policy call, a selection with no technical tiebreaker), the issue goes to `Needs Action` with the question rather than a guess.

## Memory Stack (Local, File-Based)

The plugin persists and retrieves cross-session context through three local memory layers — never a cloud memory service:

| Layer | Location | Holds |
|-------|----------|-------|
| Built-in auto-memory | `MEMORY.md` + topic files in the agent's project memory directory (auto-loaded by Claude Code) | Session/work history, active issues, decisions |
| Serena memories | `.serena/memories/` via `list_memories` / `read_memory` / `write_memory` | Codebase-wide patterns and conventions |
| OpenWolf (when the project has `.wolf/`) | `.wolf/memory.md`, `.wolf/cerebrum.md`, `.wolf/buglog.json`, `.wolf/anatomy.md` | Action log, preferences/do-not-repeat, known bug fixes, file map |

- `/work:performwork` searches the stack during initialization (Phase 1, `[MEMORY_STACK]` pattern) and persists learnings at completion (Phase 8.4)
- `/work:creatework` searches the stack during duplicate detection (Phase 2.2) and records created issues (Phase 5.3)
- Layers degrade gracefully: skip any layer whose files/tools are unavailable, but never skip all three

## MCP Servers

Declared in `.mcp.json`:

| Server | Required | Used for |
|--------|----------|----------|
| `linear` | Required | Issue fetch, status transitions, comments |
| `serena` | Required | Semantic code reading and symbol-level edits |
| `context7` | Optional | Current documentation for unfamiliar libraries |
| `sentry` | Optional | Production error context on bug-fix issues |

## Bundled Agents and Skills

- `agents/typescript-expert`, `typescript-type-expert`, `typescript-build-expert` — deployed in waves during error resolution
- `agents/research-expert` — used when Context7 is unavailable or the topic is not a library
- `skills/prd-format` — the PRD structure `/work:creatework` writes and `/work:performwork` reads

## Workflow Examples

### Complete Feature Development

```bash
# 1. Create issue for a new feature
/work:creatework "Add user authentication with JWT"

# 2. Execute the work and open a PR
/work:performwork AUTH-123 --push
```

The issue ends in **In Review** awaiting an engineer. If execution stopped early it ends in **Standby**, and any agent can continue it:

```bash
/work:performwork AUTH-123 --resume
```

### Bug Fix Workflow

```bash
# 1. Create bug issue
/work:creatework "Fix memory leak in event processor"

# 2. Perform the fix with type safety
/work:performwork BUG-456
```

### Parallel Agents on One Backlog

Each agent claims a different issue. `In Progress` tells the others to stay away; `Standby` is the shared queue of resumable in-flight work.

## Enterprise Features

### Type Safety Verification

The plugin enforces mandatory type checking before an issue reaches In Review:

- **Auto-refactor simple errors**: automatically fixes common TypeScript errors
- **Block completion on errors**: unresolved type errors park the issue in Standby rather than passing it to review
- **Truth enforcement**: documentation reflects actual implementation
- **Circuit breaker**: three waves maximum, then remaining errors become tracked follow-up issues

### Error Recovery

- Automatic retry with backoff on transient Linear MCP errors
- Checkpoint comments for long operations
- Guaranteed claim release, so a crashed run does not strand an issue
- Graceful degradation when optional tooling is unavailable

## Configuration

### Quality Controls

```typescript
{
  requirementReReadInterval: 30,     // Re-read requirements every 30 min
  scopeCreepTolerance: 0,            // Zero tolerance for scope creep
  todoWriteMapping: '1:1',           // One todo per requirement
  mandatoryTypeCheck: true,          // Must pass type check
  blockCompletionOnErrors: true      // Cannot reach In Review with errors
}
```

## Best Practices

### Issue Creation

1. Provide clear, specific descriptions
2. Include relevant context and constraints
3. Let the system suggest labels based on the workspace
4. Review deduplication suggestions

### Issue Execution

1. Prefer `Standby` issues over `Todo` when continuing an epic — the scoping work is already done
2. Never take over an issue that is `In Progress`
3. Read the handoff comment before resuming someone else's work
4. Let the command escalate to `Needs Action` instead of guessing at a design decision

## Troubleshooting

**"Issue is In Progress — owned by another agent"**:

- Another agent or engineer holds the claim. Work a different issue, or confirm coordination with the owner.
- If you know the owner is gone (crashed session), move the issue to `Standby` in Linear, then re-run.

**Type errors blocking completion**:

- Review the tracked errors; the command creates follow-up issues after Wave 3
- Fix complex errors manually and re-run with `--resume`

**Deduplication false positives**:

- Provide more specific descriptions
- Review suggested similar issues

**Status transitions not applying**:

- Confirm the team has `Standby` and `Needs Action` workflow states
- Check the `LINEAR_API_KEY` environment variable used by the `linear` MCP server

## Version History

### 4.0.0 (Current)

- **Agent-ownership status model**: `In Progress` is a claim; adds `Standby` (parked, claimable) and `Needs Action` (human decision required)
- **`[CLAIM_ISSUE]` / `[RELEASE_CLAIM]`**: an issue is never left in `In Progress` on any exit path
- `/work:performwork` no longer sets `Done` — it stops at `In Review` for engineer sign-off
- **Removed the Thoughtbox MCP dependency**: reasoning is now inline via `[ANALYSIS]`, with durability provided by Linear comments and the local memory stack
- README corrected — it previously documented three commands that do not exist

### 3.x

- Local memory stack (auto-memory + Serena + OpenWolf) replacing cloud memory
- LSP code intelligence, multi-agent wave execution, PRD format skill

## Support

- **Repository**: [GitHub](https://github.com/TheJACKedViking/claude-plugins)
- **Issues**: Report bugs via GitHub Issues
- **Documentation**: See command files for detailed specs

## License

MIT License - See LICENSE file for details

---

**Built for enterprise Linear workflows** with Claude Code
