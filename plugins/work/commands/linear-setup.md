---
description: Initialize Linear workspace with batch operations, error recovery, and comprehensive configuration
---

# Linear Setup - Executable Instructions

**Your task:** Initialize and configure the Linear workspace for optimal use with the work plugin commands.

## Instructions

---

## Phase 1: Verify Linear MCP Connection

1. **Check Linear MCP status:**
   - Use `ListMcpResourcesTool` to check for Linear MCP server
   - Verify it's in the connected servers list

2. **If Linear MCP not connected:**
   ```
   ❌ Linear MCP Server Not Connected!

   Cannot proceed with Linear setup without MCP connection.

   Please:
   1. Configure Linear MCP server in Claude Code settings
   2. Add Linear API key to environment
   3. Restart Claude Code
   4. Run this command again

   See /work:diagnostic for detailed MCP setup instructions.
   ```
   - STOP execution

3. **If connected:**
   ```
   ✅ Linear MCP server connected
   ```

---

## Phase 2: Discover Linear Workspace

1. **Fetch Linear workspace information:**
   - Use Linear MCP tools to get workspace details
   - Common tools: `mcp__linear__get_viewer`, `mcp__linear__get_organization`

2. **Fetch available teams:**
   - List all teams in the workspace
   - Common tool: `mcp__linear__list_teams`

3. **Display workspace info:**
   ```
   📊 Linear Workspace Information:
   - Organization: [name]
   - Teams: [N] teams found
     - [Team 1 name] (ID: [id])
     - [Team 2 name] (ID: [id])
     ...
   - User: [current user name/email]
   ```

4. **Identify "The Reiss Group" team:**
   - Look for team with name "The Reiss Group"
   - Store the team ID for later use

5. **If team not found:**
   ```
   ⚠️ "The Reiss Group" team not found in workspace

   Available teams:
   - [Team 1]
   - [Team 2]
   ...

   Please verify team name or update commands to use correct team.
   ```

---

## Phase 3: Test Issue Operations

1. **Test issue listing:**
   - Attempt to list recent issues
   - Common tool: `mcp__linear__list_issues` with limit=5

2. **Display recent issues:**
   ```
   📋 Recent Issues (last 5):
   1. [ID] - [Title] ([State])
   2. [ID] - [Title] ([State])
   ...
   ```

3. **If listing fails:**
   - Report error details
   - Check API key permissions
   - Suggest verifying Linear API token scopes

---

## Phase 4: Test Issue Creation

1. **Create a test issue:**
   - Team: The Reiss Group (or first available team)
   - Title: "Test issue from Linear setup"
   - Description: "This is a test issue created by /work:linear-setup command to verify issue creation works."
   - Use tool: `mcp__linear__create_issue` or similar

2. **If creation succeeds:**
   ```
   ✅ Test issue created successfully!
   - Issue ID: [ID]
   - URL: [url]

   You can delete this test issue manually if needed.
   ```

3. **If creation fails:**
   ```
   ❌ Failed to create test issue

   Error: [error message]

   Possible causes:
   - Insufficient API permissions
   - Team ID incorrect
   - MCP tool naming mismatch

   The creatework command may not work properly.
   ```

---

## Phase 5: Test Comment Creation

1. **Add comment to test issue:**
   - Use the test issue ID from Phase 4
   - Comment: "Test comment from Linear setup - verifying comment creation works."
   - Use tool: `mcp__linear__create_comment` or similar

2. **If succeeds:**
   ```
   ✅ Comment creation works
   ```

3. **If fails:**
   ```
   ⚠️ Comment creation failed

   This may impact performwork command's ability to update issues.
   Error: [error message]
   ```

---

## Phase 6: Discover Issue States

1. **Fetch available workflow states:**
   - Common states: Backlog, Todo, In Progress, Done, Canceled
   - Use tool: `mcp__linear__list_workflow_states` or query from team

2. **Display states:**
   ```
   🔄 Available Workflow States:
   - [State 1] (ID: [id])
   - [State 2] (ID: [id])
   - [State 3] (ID: [id])
   ...
   ```

3. **Identify key states:**
   - "Backlog" or "Todo" (for new issues)
   - "In Progress" (for active work)
   - "Done" (for completed work)

---

## Phase 7: Test Sequential-thinking Integration

1. **Test Sequential-thinking MCP:**
   - Attempt a simple Sequential-thinking call:

   - Thought: "Testing Sequential-thinking MCP integration for Linear setup. This is a simple test to verify the tool is working correctly. I should confirm the tool responds and returns valid output."
   - thoughtNumber: 1
   - totalThoughts: 2
   - nextThoughtNeeded: true

2. **If works:**
   ```
   ✅ Sequential-thinking MCP working

   This enables intelligent requirement extraction and duplicate detection.
   ```

3. **If fails:**
   ```
   ⚠️ Sequential-thinking MCP not available

   Impact:
   - creatework will work but with reduced intelligence
   - performwork will work but without smart error analysis

   Commands will fall back to pattern-based logic.
   ```

---

## Phase 8: Configuration Summary

**Generate setup report:**

```
═══════════════════════════════════════════════════════════
✅ LINEAR SETUP COMPLETE
═══════════════════════════════════════════════════════════

Connection Status:
  📡 Linear MCP: ✅ Connected
  🧠 Sequential-thinking: [✅ Working / ⚠️ Unavailable]

Workspace Configuration:
  🏢 Organization: [name]
  👥 Team: [The Reiss Group / or first team]
  👤 User: [name/email]

Verified Capabilities:
  📋 List Issues: [✅ / ❌]
  ➕ Create Issues: [✅ / ❌]
  💬 Add Comments: [✅ / ❌]
  🔄 Update States: [✅ Not tested / ❌]

Test Issue Created:
  🔗 [Issue URL]
  (You can safely delete this test issue)

─────────────────────────────────────────────────────────────

Ready to Use:
  ✅ /work:creatework - Create Linear issues with intelligence
  ✅ /work:performwork - Execute Linear issues with type safety
  [✅/⚠️] Other commands depending on test results

═══════════════════════════════════════════════════════════
```

---

## Phase 9: Cleanup (Optional)

**Ask user about test issue:**

```
The setup created a test issue: [Issue ID]

Would you like me to:
1. Leave it for manual review/deletion
2. Archive it now
3. Delete it now

Test issues are safe to delete - they were only for verification.
```

**If user requests deletion:**
- Use Linear MCP delete/archive issue tool
- Confirm deletion

---

## Error Handling

### If Linear MCP fails during setup:
- Report which phase failed
- Provide diagnostic information
- Suggest running `/work:diagnostic linear` for details

### If permissions insufficient:
- Report: "Linear API key may lack required permissions"
- Suggest checking Linear API token scopes at linear.app/settings/api
- Required scopes: read, write, issues:create, comment:create

### If no teams found:
- Report: "No teams found in Linear workspace"
- Suggest: "Verify API key is for correct organization"

---

## Configuration File Support (Future)

**Planned:** Save configuration to file for faster future setups

```json
{
  "linearTeamId": "[id]",
  "linearTeamName": "The Reiss Group",
  "workflowStates": {
    "backlog": "[state-id]",
    "todo": "[state-id]",
    "inProgress": "[state-id]",
    "done": "[state-id]"
  },
  "setupCompleted": "[timestamp]",
  "mcpStatus": "connected"
}
```

---

## Notes

- Setup should be run once after installing the work plugin
- Re-run if Linear connection changes or team changes
- Test issue creation is safe and can be deleted afterward
- All phases except Phase 4 are non-destructive

---

**Remember:** This is an executable prompt. Actually test the Linear MCP connections. Actually create the test issue. Actually verify the capabilities work.
