---
description: Execute automated command workflows for end-to-end task completion
argument-hint: [workflow-name] [context]
---

# Workflow - Executable Instructions

**Your task:** Execute predefined workflows that chain multiple commands together for end-to-end task completion.

## Workflow Requested

Workflow: `{{workflow-name}}`
Context: `{{context}}`

## Instructions

---

## Phase 1: Determine Workflow

1. **Parse arguments:**
   - Workflow name: first argument
   - Context: remaining arguments

2. **If no workflow specified:**
   ```
   📋 Available Workflows:

   full-lifecycle
     Create and execute a Linear issue end-to-end
     Steps: creatework → performwork → validate
     Usage: /workflow full-lifecycle "Description"

   batch-process
     Process multiple Linear issues in sequence
     Steps: performwork (multiple) → validate
     Usage: /workflow batch-process "TRG-123, TRG-124, TRG-125"

   health-check-fix
     Run diagnostics and fix common issues
     Steps: diagnostic → validate → fix recommendations
     Usage: /workflow health-check-fix

   create-and-validate
     Create issue and validate codebase
     Steps: creatework → validate
     Usage: /workflow create-and-validate "Description"

   ───────────────────────────────────────────────────────
   Usage: /work:workflow <workflow-name> [context]
   ```
   - STOP execution

3. **Validate workflow exists:**
   - Check if workflow name matches one of the available workflows
   - If not found:
     ```
     ❌ Unknown workflow: {{workflow-name}}

     Available workflows: full-lifecycle, batch-process, health-check-fix, create-and-validate

     Use /work:workflow with no arguments to see details.
     ```
     - STOP execution

---

## Phase 2: Execute Workflow

### Workflow: full-lifecycle

**Purpose:** Create and execute a Linear issue from description to completion

**Steps:**

1. **Step 1: Create issue**
   - Use `/work:creatework` slash command with context as description
   - Wait for issue creation
   - Extract issue ID from result

2. **Step 2: Execute issue**
   - Use `/work:performwork` slash command with created issue ID
   - Wait for implementation completion

3. **Step 3: Validate**
   - Use `/work:validate` slash command with `--full` flag
   - Report validation results

4. **Final report:**
   ```
   ═══════════════════════════════════════════════════════════
   ✅ FULL-LIFECYCLE WORKFLOW COMPLETE
   ═══════════════════════════════════════════════════════════

   Issue Created: [ISSUE-ID]
   Implementation: [✅ Complete / ⚠️ Partial / ❌ Failed]
   Validation: [✅ Pass / ❌ Fail]

   🔗 Issue URL: [url]

   ═══════════════════════════════════════════════════════════
   ```

---

### Workflow: batch-process

**Purpose:** Process multiple Linear issues in sequence with validation

**Steps:**

1. **Parse issue IDs:**
   - Split context by comma
   - Extract issue IDs: [ID1, ID2, ID3, ...]
   - Validate format of each ID

2. **Use Sequential-thinking to analyze dependencies and execution order:**

   - Thought: "Executing [N] issues in batch: [list IDs]. I need to: 1) Fetch titles/descriptions from Linear for each issue, 2) Identify potential dependencies between issues (does Issue B depend on Issue A?), 3) Determine optimal execution order, 4) Identify which issues can run in parallel vs must be sequential, 5) Assess overall complexity and time estimate."
   - thoughtNumber: 1
   - totalThoughts: 7
   - nextThoughtNeeded: true

3. **Parse dependency analysis:**
   - Execution order: [list of issue IDs in optimal order]
   - Dependencies: [mapping of dependent issues]
   - Parallel groups: [issues that can run concurrently]
   - Estimated total time

4. **For each issue in determined order:**
   - Use `/work:performwork` slash command
   - Track success/failure
   - Report progress:
     ```
     Processing issue [N]/[Total]: [ISSUE-ID]
     ```

3. **After all issues:**
   - Use `/work:validate` slash command with `--full` flag

4. **Final report:**
   ```
   ═══════════════════════════════════════════════════════════
   ✅ BATCH-PROCESS WORKFLOW COMPLETE
   ═══════════════════════════════════════════════════════════

   Total Issues: [N]
   Completed: [N]
   Failed: [N]
   Validation: [✅ Pass / ❌ Fail]

   Details:
   - [ISSUE-1]: ✅ Complete
   - [ISSUE-2]: ✅ Complete
   - [ISSUE-3]: ❌ Failed - [reason]

   ═══════════════════════════════════════════════════════════
   ```

---

### Workflow: health-check-fix

**Purpose:** Run comprehensive diagnostics and apply fixes

**Steps:**

1. **Step 1: Run diagnostics**
   - Use `/work:diagnostic` slash command with `full` mode
   - Capture all issues found

2. **Step 2: Analyze issues**
   - Categorize by severity (critical/warning/info)
   - Identify auto-fixable issues

3. **Step 3: Apply fixes**
   - For MCP connection issues: Report instructions (cannot auto-fix)
   - For dependency issues: Suggest `npm install`
   - For validation script issues: Suggest script additions

4. **Step 4: Re-run diagnostics**
   - Use `/work:diagnostic` slash command again
   - Compare before/after

5. **Final report:**
   ```
   ═══════════════════════════════════════════════════════════
   ✅ HEALTH-CHECK-FIX WORKFLOW COMPLETE
   ═══════════════════════════════════════════════════════════

   Initial Issues: [N]
   Fixed: [N]
   Remaining: [N]

   Health Status: [✅ Healthy / ⚠️ Warnings / ❌ Critical Issues]

   Manual Actions Required:
   - [Action 1]
   - [Action 2]

   ═══════════════════════════════════════════════════════════
   ```

---

### Workflow: create-and-validate

**Purpose:** Create a Linear issue and validate the codebase is ready

**Steps:**

1. **Step 1: Validate first**
   - Use `/work:validate` slash command with `--quick` flag
   - Ensure codebase is in good state before creating issue

2. **Step 2: Create issue**
   - Use `/work:creatework` slash command with context
   - Wait for issue creation

3. **Final report:**
   ```
   ═══════════════════════════════════════════════════════════
   ✅ CREATE-AND-VALIDATE WORKFLOW COMPLETE
   ═══════════════════════════════════════════════════════════

   Validation: [✅ Pass / ❌ Fail]
   Issue Created: [ISSUE-ID]

   🔗 Issue URL: [url]

   Ready to work: [✅ Yes / ⚠️ Fix validation issues first]

   ═══════════════════════════════════════════════════════════
   ```

---

## Phase 3: Error Handling

**If any step fails:**

1. **Report failure:**
   ```
   ❌ Workflow step failed: [step name]
   Error: [error details]
   ```

2. **Ask user:**
   ```
   Options:
   1. Continue to next step (skip failed step)
   2. Retry failed step
   3. Abort workflow

   What would you like to do?
   ```

3. **Based on user choice:**
   - Continue: Proceed to next step, mark failed step in report
   - Retry: Re-run the failed step once
   - Abort: Stop workflow and provide summary of completed steps

---

## Notes on Workflow Execution

- **Sequential execution:** Steps run one after another (not parallel)
- **Slash command integration:** Each step uses actual slash commands (not direct tool calls)
- **Progress tracking:** Clear progress indicators after each step
- **Error resilience:** Failures don't crash entire workflow, user can choose to continue
- **Comprehensive reporting:** Final reports show full workflow results

---

## Custom Workflow Support (Future)

**Planned:** Allow users to define custom workflows in a config file:

```json
{
  "workflows": {
    "my-custom-workflow": {
      "description": "My custom workflow description",
      "steps": [
        {
          "command": "/work:diagnostic",
          "args": "quick"
        },
        {
          "command": "/work:creatework",
          "args": "$CONTEXT"
        }
      ]
    }
  }
}
```

---

## Error Handling

### If slash command not found:
- Report: "❌ Command not available: [command]"
- Check if work plugin is properly installed
- Suggest running `/work:diagnostic`

### If context missing but required:
- Report: "❌ Context required for this workflow"
- Show usage example
- STOP execution

---

**Remember:** This is an executable prompt. Actually invoke the slash commands mentioned. Actually wait for their completion. Actually report accurate progress.
