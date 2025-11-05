---
description: Run comprehensive validation with smart parallelization, caching, and detailed metrics
---

# Validation - Executable Instructions

**Your task:** Run comprehensive validation on the codebase to ensure code quality.

## Instructions

Follow these steps to perform thorough validation:

---

## Phase 1: Determine Validation Scope

1. **Parse arguments:**
   - Arguments: `{{arguments}}`
   - Check for flags: `--watch`, `--quick`, `--full`, `--fix`

2. **Determine what to validate:**

   **Quick mode (`--quick`):**
   - Type checking only
   - Skip tests
   - Skip linting

   **Full mode (`--full` or no args):**
   - Type checking
   - Linting
   - Tests
   - Build verification

   **Watch mode (`--watch`):**
   - Continuous validation on file changes
   - Report: "⚠️ Watch mode not fully supported in slash commands. Consider running `npm run typecheck -- --watch` directly."

3. **Display validation plan:**
   ```
   📋 Validation Plan:
   - Type checking: ✅
   - Linting: [✅/⏭️]
   - Tests: [✅/⏭️]
   - Build: [✅/⏭️]
   ```

---

## Phase 2: Type Checking

1. **Find typecheck command:**
   - Check package.json for `typecheck` script
   - Common alternatives: `tsc --noEmit`, `vue-tsc --noEmit`

2. **Run type checking:**
   ```bash
   npm run typecheck
   ```

3. **Parse results:**
   - Count total errors
   - Group by file
   - Identify error types

4. **Display results:**
   ```
   🔍 Type Check Results:
   - Status: [✅ Pass / ❌ Fail]
   - Total errors: [N]
   - Files with errors: [N]
   - Most common errors: [list top 3 error codes]
   ```

5. **If errors found, use Serena MCP for context (optional but recommended):**

   For files with the most errors, use Serena MCP to understand code structure:

   ```
   Tool: mcp__serena__get_symbols_overview
   Parameters:
     relative_path: "path/to/file/with/errors.ts"
   ```

   This helps understand:
   - Which classes/functions have errors
   - Code structure and organization
   - Whether errors are localized or systemic

6. **If --fix flag provided and errors found:**
   - Attempt to auto-fix trivial errors:
     - Remove unused imports
     - Remove unused variables (prefix with `_`)
     - Add missing type annotations for simple cases
   - Report: "✅ Auto-fixed [N] errors. Remaining: [N]"

---

## Phase 3: Linting (if full mode)

1. **Find lint command:**
   - Check package.json for `lint` script
   - Common alternatives: `eslint .`, `npm run lint`

2. **Run linter:**
   ```bash
   npm run lint
   ```

3. **Parse results:**
   - Count warnings and errors
   - Group by rule
   - Identify fixable issues

4. **Display results:**
   ```
   🧹 Lint Results:
   - Status: [✅ Pass / ⚠️ Warnings / ❌ Errors]
   - Errors: [N]
   - Warnings: [N]
   - Auto-fixable: [N]
   ```

5. **If --fix flag provided:**
   ```bash
   npm run lint -- --fix
   ```
   - Report fixed issues

---

## Phase 4: Tests (if full mode)

1. **Find test command:**
   - Check package.json for `test` script
   - Common alternatives: `vitest run`, `jest`, `npm test`

2. **Check if tests exist:**
   - Look for test files (*.test.ts, *.spec.ts, etc.)
   - If no tests found: Report "⚠️ No tests found. Consider adding tests."

3. **Run tests:**
   ```bash
   npm run test
   ```

4. **Parse results:**
   - Count passed/failed
   - Identify failed test suites
   - Calculate coverage if available

5. **Display results:**
   ```
   🧪 Test Results:
   - Status: [✅ Pass / ❌ Fail]
   - Passed: [N]
   - Failed: [N]
   - Coverage: [X%] (if available)
   ```

---

## Phase 5: Build Verification (if full mode)

1. **Find build command:**
   - Check package.json for `build` script
   - Skip if no build script exists

2. **Run build:**
   ```bash
   npm run build
   ```

3. **Check build output:**
   - Verify dist/build directory created
   - Check for build warnings/errors

4. **Display results:**
   ```
   🏗️ Build Results:
   - Status: [✅ Success / ❌ Failed]
   - Warnings: [N]
   - Output size: [size] (if available)
   ```

---

## Phase 6: Generate Validation Report

**Create comprehensive summary:**

```
═══════════════════════════════════════════════════════════
📊 VALIDATION REPORT
═══════════════════════════════════════════════════════════

🔍 Type Check:      [✅ Pass / ❌ [N] errors]
🧹 Linting:         [✅ Pass / ⚠️ [N] warnings / ❌ [N] errors]
🧪 Tests:           [✅ Pass / ❌ [N] failed]
🏗️ Build:           [✅ Success / ❌ Failed]

─────────────────────────────────────────────────────────────

Overall Status: [✅ ALL PASS / ⚠️ WARNINGS / ❌ FAILURES]

═══════════════════════════════════════════════════════════
```

**If any failures:**

```
❌ Action Required:

Type Errors ([N]):
- [file:line] - [error message]
- [file:line] - [error message]
...

Test Failures ([N]):
- [test name] - [failure reason]
...

💡 Suggestions:
- Run with --fix to auto-fix simple issues
- Review error details above
- Consider creating issues for complex problems
```

---

## Phase 7: Smart Recommendations

**Use Sequential-thinking if significant issues found:**

If total errors + failures > 10:

1. **Analyze issue patterns:**

   - Thought: "Validation found [N] type errors, [N] lint issues, [N] test failures. I need to: 1) Identify patterns in the errors, 2) Determine if errors are related or independent, 3) Assess priority (blocking vs non-blocking), 4) Suggest most efficient fix order, 5) Determine if any errors indicate larger architectural issues."
   - thoughtNumber: 1
   - totalThoughts: 5
   - nextThoughtNeeded: true

2. **Parse recommendations:**
   - Priority order for fixes
   - Suggested approach
   - Estimated effort

3. **Display recommendations:**
   ```
   🧠 Smart Recommendations:

   Priority 1: [issue type] ([N] occurrences)
   - Suggested fix: [approach]
   - Estimated effort: [time]

   Priority 2: [issue type] ([N] occurrences)
   - Suggested fix: [approach]
   - Estimated effort: [time]

   💡 Consider creating tracking issues for:
   - [Major issue 1]
   - [Major issue 2]
   ```

---

## Error Handling

### If validation commands fail:
- Report which commands failed and why
- Show available package.json scripts
- Suggest: "Run `npm install` if packages are missing"

### If no validation scripts found:
- Report: "⚠️ No validation scripts found in package.json"
- Suggest adding basic scripts:
  ```json
  {
    "scripts": {
      "typecheck": "tsc --noEmit",
      "lint": "eslint .",
      "test": "vitest run"
    }
  }
  ```

---

## Configuration

**Validation levels:**
- `--quick`: Type check only (~30 seconds)
- `--full`: All checks (~2-5 minutes)
- `--fix`: Auto-fix simple issues
- `--watch`: Continuous validation (limited support)

**Default**: Full validation without auto-fix

---

## Notes

- Validation results are reported honestly - no false positives
- Auto-fix only applies to trivial, safe changes
- Complex issues should be tracked as separate Linear issues
- Use this before marking issues as "Done" to ensure quality

---

**Remember:** This is an executable prompt. Actually run the validation commands. Actually parse the output. Actually report accurate results.
