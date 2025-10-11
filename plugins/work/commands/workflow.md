# /workflow - Automated Command Workflows

Execute predefined or custom workflows that chain multiple commands together.

## Usage

```bash
# Run predefined workflow
/workflow <workflow-name> [context]

# Examples:
/workflow full-lifecycle "Add user authentication"
/workflow batch-process "TRG-123, TRG-124, TRG-125"
/workflow health-check-fix
```

## Execution

```javascript
// Load shared systems
const workflowEngine = require('../shared/workflow-engine.js');
const globalState = require('../shared/state-manager.js');
const eventBus = require('../shared/event-bus.js');

// Parse arguments
const args = $ARGUMENTS.split(/\s+/);
const workflowName = args[0];
const contextArgs = args.slice(1).join(' ');

// Validate workflow exists
const availableWorkflows = workflowEngine.list();

if (!workflowName) {
  console.log('📋 Available Workflows:\n');
  availableWorkflows.forEach(wf => {
    console.log(`  ${wf.name.padEnd(25)} - ${wf.description}`);
    console.log(`  ${' '.repeat(25)}   (${wf.steps} steps)\n`);
  });

  console.log('\nUsage: /workflow <workflow-name> [context]');
  console.log('\nExamples:');
  console.log('  /workflow full-lifecycle "Add user auth"');
  console.log('  /workflow batch-process "TRG-123, TRG-124"');
  console.log('  /workflow health-check-fix');
  return;
}

// Parse context based on workflow
let context = {};

switch(workflowName) {
  case 'full-lifecycle':
    context = { description: contextArgs };
    break;

  case 'batch-process':
    const issueIds = contextArgs.split(',').map(id => id.trim());
    context = { issueIds };
    break;

  case 'health-check-fix':
    context = {};
    break;

  default:
    // Try to parse as JSON or use as string
    try {
      context = JSON.parse(contextArgs);
    } catch {
      context = { input: contextArgs };
    }
}

// Subscribe to workflow events for progress tracking
eventBus.on(`workflow:started`, (data) => {
  console.log(`\n🚀 Workflow started: ${data.workflow}`);
  console.log(`   Execution ID: ${data.executionId}\n`);
});

eventBus.on(`workflow:step:completed`, (data) => {
  console.log(`✅ Step completed: ${data.step}`);
});

eventBus.on(`workflow:step:failed`, (data) => {
  console.log(`❌ Step failed: ${data.step} - ${data.error}`);
});

// Execute workflow
console.log(`\n${'='.repeat(60)}`);
console.log(`🔄 EXECUTING WORKFLOW: ${workflowName}`);
console.log(`${'='.repeat(60)}\n`);

try {
  const result = await workflowEngine.execute(workflowName, context);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ WORKFLOW COMPLETED SUCCESSFULLY`);
  console.log(`${'='.repeat(60)}\n`);

  console.log('📊 Results Summary:');
  for (const [step, stepResult] of Object.entries(result)) {
    console.log(`\n  ${step}:`);
    if (typeof stepResult === 'object') {
      console.log(`    ${JSON.stringify(stepResult, null, 2).split('\n').join('\n    ')}`);
    } else {
      console.log(`    ${stepResult}`);
    }
  }

  // Store in global state
  globalState.setState('lastWorkflow', {
    name: workflowName,
    context,
    result,
    timestamp: Date.now()
  }, { persist: true });

  return result;

} catch (error) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`❌ WORKFLOW FAILED`);
  console.log(`${'='.repeat(60)}\n`);

  console.log(`Error: ${error.message}`);

  // Get execution details
  const executions = workflowEngine.getRunning();
  const currentExec = executions.find(e => e.workflow === workflowName);

  if (currentExec) {
    console.log('\n📋 Execution Details:');
    console.log(`  Status: ${currentExec.status}`);
    console.log(`  Completed Steps: ${currentExec.steps.filter(s => s.status === 'completed').length}/${currentExec.steps.length}`);

    const failedSteps = currentExec.steps.filter(s => s.status === 'failed');
    if (failedSteps.length > 0) {
      console.log('\n  Failed Steps:');
      failedSteps.forEach(step => {
        console.log(`    - ${step.name}: ${step.error}`);
      });
    }
  }

  throw error;
}
```

## Predefined Workflows

### full-lifecycle
Creates, implements, and validates an issue end-to-end.

**Context:**
- `description`: Issue description

**Steps:**
1. Create issue via /creatework
2. Implement via /performwork
3. Validate via /validate

### batch-process
Processes multiple issues with dependency analysis.

**Context:**
- `issueIds`: Array of issue IDs

**Steps:**
1. Validate input
2. Execute batch via /performwork
3. Validate all changes

### health-check-fix
Diagnoses system and auto-remediates issues.

**Context:** None

**Steps:**
1. Run diagnostics
2. Verify health
3. Auto-remediate if needed
4. Verify fix

## Custom Workflows

You can define custom workflows programmatically:

```javascript
const workflowEngine = require('./shared/workflow-engine.js');

workflowEngine.define('my-workflow', {
  name: 'My Custom Workflow',
  description: 'Custom workflow description',
  steps: [
    {
      name: 'step1',
      execute: async (ctx) => {
        // Step logic
        return result;
      },
      condition: (ctx, results) => {
        // Optional: only run if condition is true
        return true;
      },
      updateContext: true, // Pass result to next steps
      onError: 'continue' // 'continue', 'retry', or 'stop' (default)
    },
    // More steps...
  ]
});
```

## Benefits

✅ **Automated Workflows** - Chain commands without manual intervention
✅ **Error Recovery** - Configurable error handling per step
✅ **Progress Tracking** - Real-time updates via event bus
✅ **Conditional Logic** - Skip steps based on conditions
✅ **Context Passing** - Share data between steps
✅ **Reusable Patterns** - Define once, use many times
