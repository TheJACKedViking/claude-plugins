---
description: Comprehensive system health monitoring and diagnostics for all AI command systems
argument-hint: [mode]
---

# System Diagnostics - Executable Instructions

**Your task:** Run comprehensive system diagnostics to check the health of tools, dependencies, and configurations.

## Diagnostic Mode

Mode requested: `{{mode}}` (full/quick/linear/mcp)

## Instructions

---

## Phase 1: Determine Diagnostic Scope

1. **Parse mode argument:**

   - `full` or no arg: All diagnostics
   - `quick`: Essential checks only (Linear MCP, type checking)
   - `linear`: Linear MCP server only
   - `mcp`: All MCP servers

2. **Display diagnostic plan:**
   ```
   🔍 Diagnostic Plan:
   - MCP Servers: ✅
   - Linear Connection: ✅
   - Project Setup: [✅/⏭️]
   - Dependencies: [✅/⏭️]
   - Validation Tools: [✅/⏭️]
   ```

---

## Phase 2: MCP Server Diagnostics

1. **Check available MCP servers:**
   - Use `ListMcpResourcesTool` to list all connected MCP servers
   - Count total servers
   - Identify server types

2. **Display MCP status:**
   ```
   📡 MCP Servers Status:
   - Total servers: [N]
   - Connected: [list server names]
   - Expected but missing: [list if any]
   ```

3. **Check Linear MCP specifically:**
   - Look for Linear-related MCP server
   - Test connection by attempting to list Linear tools
   - Report:
     - ✅ "Linear MCP: Connected"
     - ❌ "Linear MCP: Not connected"

4. **If Linear MCP missing:**
   ```
   ❌ Linear MCP Server Not Found!

   This explains why creatework and performwork aren't working.

   To fix:
   1. Check MCP configuration in Claude Code settings
   2. Ensure Linear MCP server is installed:
      npm install -g @modelcontextprotocol/server-linear
   3. Configure in ~/.config/claude/claude_desktop_config.json:
      {
        "mcpServers": {
          "linear": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-linear"],
            "env": {
              "LINEAR_API_KEY": "your-api-key"
            }
          }
        }
      }
   4. Restart Claude Code
   ```

---

## Phase 3: Project Setup Diagnostics (if full mode)

1. **Check package.json:**
   - Read /volume1/Projects/claude-code/package.json
   - Verify required scripts exist:
     - `typecheck`
     - `lint`
     - `test`
     - `build`
   - Report missing scripts

2. **Check node_modules:**
   ```bash
   test -d node_modules && echo "EXISTS" || echo "MISSING"
   ```

3. **Check TypeScript config:**
   - Look for tsconfig.json
   - Verify it exists and is valid JSON

4. **Display project status:**
   ```
   📦 Project Setup:
   - package.json: [✅ Found / ❌ Missing]
   - node_modules: [✅ Installed / ❌ Missing - run npm install]
   - tsconfig.json: [✅ Found / ❌ Missing]
   - Scripts:
     - typecheck: [✅/❌]
     - lint: [✅/❌]
     - test: [✅/❌]
     - build: [✅/❌]
   ```

---

## Phase 4: Validation Tools Check (if full mode)

1. **Test TypeScript compiler:**
   ```bash
   npx tsc --version
   ```
   - Report version or "Not found"

2. **Test ESLint (if used):**
   ```bash
   npx eslint --version
   ```
   - Report version or "Not found"

3. **Test test runner:**
   ```bash
   npx vitest --version || npx jest --version
   ```
   - Report version or "Not found"

4. **Display tools status:**
   ```
   🔧 Validation Tools:
   - TypeScript: [version / ❌ Not found]
   - ESLint: [version / ❌ Not found / ⏭️ Optional]
   - Test Runner: [version / ❌ Not found / ⏭️ Optional]
   ```

---

## Phase 5: Sequential-thinking MCP Check

1. **Test Sequential-thinking MCP:**
   - Attempt to call `mcp__sequential-thinking__sequentialthinking`
   - Use a simple test thought

2. **Report status:**
   ```
   🧠 Sequential-thinking MCP:
   - Status: [✅ Working / ❌ Not available]
   - Note: Required for creatework and performwork commands
   ```

3. **If not available:**
   ```
   ⚠️ Sequential-thinking MCP not available

   This will impact:
   - creatework command (uses it for requirement extraction)
   - performwork command (uses it for error analysis)

   Both commands will still work but with reduced intelligence.
   ```

---

## Phase 6: Slash Command System Check (if full mode)

1. **Verify marketplace structure:**
   - Check /volume1/Projects/claude-code/marketplace exists
   - Check marketplace/plugins/work exists
   - List command files in marketplace/plugins/work/commands

2. **Display command status:**
   ```
   📋 Work Plugin Commands:
   - creatework: [✅ Found]
   - performwork: [✅ Found]
   - validate: [✅ Found]
   - diagnostic: [✅ Found (this command)]
   - linear-setup: [✅ Found]
   - workflow: [✅ Found]
   ```

---

## Phase 7: Generate Diagnostic Report

**Create comprehensive health report:**

```
═══════════════════════════════════════════════════════════
🏥 SYSTEM HEALTH REPORT
═══════════════════════════════════════════════════════════

MCP Servers:
  📡 Total Connected: [N]
  ✅ Linear MCP: [Connected/❌ Missing]
  🧠 Sequential-thinking: [Working/⚠️ Unavailable]

Project Setup:
  📦 Dependencies: [✅ Installed / ❌ Missing]
  📄 Configuration: [✅ Valid / ⚠️ Issues]

Validation Tools:
  🔍 TypeScript: [✅ v[X] / ❌ Missing]
  🧹 Linter: [✅ v[X] / ⏭️ Optional]
  🧪 Tests: [✅ v[X] / ⏭️ Optional]

Slash Commands:
  📋 Work Plugin: [✅ [N] commands available]

─────────────────────────────────────────────────────────────

Overall Health: [✅ HEALTHY / ⚠️ ISSUES / ❌ CRITICAL]

═══════════════════════════════════════════════════════════
```

---

## Phase 8: Actionable Recommendations with Sequential Thinking

**Use Sequential-thinking to analyze issues and prioritize fixes.**

### Step 1: Analyze Issues with Sequential-Thinking

**If multiple issues found (>= 2), use Sequential-thinking to prioritize:**

1. **Call `mcp__sequential-thinking__sequentialthinking`:**

   - Thought: "Diagnostic found [N] issues: [list issues]. I need to: 1) Categorize by severity (critical/warning/info), 2) Determine dependencies between fixes (what must be done first), 3) Assess impact of each issue on system functionality, 4) Identify quick wins vs complex fixes, 5) Prioritize fixes in optimal order, 6) Estimate effort for each fix."
   - thoughtNumber: 1
   - totalThoughts: 6
   - nextThoughtNeeded: true

2. **Parse Sequential-thinking output:**
   - Critical issues (blocking core functionality)
   - Warnings (degraded functionality)
   - Info (minor improvements)
   - Dependency order (fix X before Y)
   - Estimated effort per fix

### Step 2: Generate Prioritized Recommendations

**If issues found, provide specific fixes:**

```
❌ Issues Found:

Critical:
1. Linear MCP not connected
   → Fix: Configure Linear MCP server (see details above)
   → Impact: creatework and performwork will not work

Warnings:
1. Dependencies not installed
   → Fix: Run `npm install` in project root
   → Impact: Validation commands will fail

2. Sequential-thinking MCP not available
   → Fix: Check MCP server configuration
   → Impact: Reduced intelligence in creatework/performwork

───────────────────────────────────────────────────────────

📝 Recommended Actions (in order):
1. [Highest priority fix]
2. [Second priority fix]
3. [Third priority fix]
```

---

## Error Handling

### If diagnostic fails:
- Report which checks failed
- Provide partial results for successful checks
- Suggest: "Some diagnostics may require project context"

### If permission errors:
- Report: "⚠️ Permission denied for some checks"
- Suggest running with appropriate permissions

---

## Quick Mode Checks

**If mode is `quick`, only run:**
1. Linear MCP connection check
2. TypeScript availability check
3. node_modules existence check

**Report:**
```
🔍 Quick Diagnostic:
- Linear MCP: [status]
- TypeScript: [status]
- Dependencies: [status]

Run with `full` for comprehensive diagnostics.
```

---

## Notes

- Diagnostic results are always truthful
- Critical issues prevent core functionality (creatework, performwork)
- Warnings indicate reduced functionality or missing optional features
- Run this command when slash commands aren't working as expected

---

**Remember:** This is an executable prompt. Actually check the systems mentioned. Actually test the connections. Actually report accurate status.
