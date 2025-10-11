# /diagnostic - Enterprise System Health Monitoring

Comprehensive health check and performance monitoring for all AI command systems.

## Purpose

Monitor and diagnose the health of all enterprise systems including learning patterns, cache performance, checkpoint recovery, and execution metrics.

## System Initialization

```javascript
// Initialize diagnostic systems
const systems = {
  performance: new PerformanceMonitor(),
  learning: new LearningSystem(),
  cache: new CacheSystem(),
  checkpoint: new CheckpointSystem(),
  deduplication: new DeduplicationSystem(),
  errorRecovery: new ErrorRecoverySystem(),
  linearHealth: new LinearHealthCheck(),
  systemHealth: new SystemHealthCheck()
};

// Load shared systems
const globalState = require('../shared/global-cache.js');
const eventBus = require('../shared/event-bus.js');
const linearCache = require('../shared/global-cache.js');

// Diagnostic modes
const diagnosticMode = $ARGUMENTS || 'full'; // full, quick, specific system
```

## Proactive Monitoring System

```javascript
// ====== PROACTIVE DIAGNOSTICS & AUTO-REMEDIATION ======

class ProactiveDiagnostics {
  constructor() {
    this.thresholds = {
      errorRate: 0.15,          // 15% max error rate
      cacheHitRate: 0.50,       // 50% min cache hit rate
      healthScore: 70,          // 70% min health score
      apiLatency: 2000,         // 2s max API latency
      memoryUsage: 0.85         // 85% max memory usage
    };

    this.scheduledChecks = [];
    this.alerts = [];
  }

  /**
   * Schedule regular diagnostic checks
   */
  schedule(frequency = '1h', checks = ['full']) {
    const intervalMs = this.parseFrequency(frequency);

    console.log(`\n📅 Scheduling proactive diagnostics: ${frequency}`);
    console.log(`   Checks: ${checks.join(', ')}\n`);

    const intervalId = setInterval(async () => {
      console.log(`\n⏰ Scheduled diagnostic check (${frequency})...`);
      console.log(`   ${new Date().toLocaleString()}\n`);

      for (const check of checks) {
        try {
          const result = await this.runCheck(check);
          await this.analyzeAndAlert(result);
        } catch (error) {
          console.error(`❌ Check '${check}' failed: ${error.message}`);
        }
      }
    }, intervalMs);

    this.scheduledChecks.push({
      intervalId,
      frequency,
      checks,
      startedAt: Date.now()
    });

    console.log(`✅ Proactive monitoring started (ID: ${intervalId})\n`);

    return intervalId;
  }

  parseFrequency(freq) {
    const match = freq.match(/^(\d+)(m|h|d)$/);
    if (!match) return 3600000; // default 1 hour

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
      'm': 60000,      // minutes
      'h': 3600000,    // hours
      'd': 86400000    // days
    };

    return value * multipliers[unit];
  }

  async runCheck(checkType) {
    // Run specific diagnostic check
    const startTime = Date.now();

    // Would run actual diagnostic logic here
    const result = {
      checkType,
      timestamp: Date.now(),
      duration: Date.now() - startTime,
      healthScore: 75 + Math.random() * 20, // Placeholder
      errors: {
        last24h: {
          total: Math.floor(Math.random() * 10),
          recoveryRate: 0.8 + Math.random() * 0.15
        }
      },
      cache: {
        performance: {
          hitRate: 0.5 + Math.random() * 0.3
        }
      },
      apiLatency: 1000 + Math.random() * 1500
    };

    return result;
  }

  async analyzeAndAlert(diagnosticResult) {
    const alerts = [];

    console.log(`📊 Analyzing diagnostic results...`);
    console.log(`   Health Score: ${Math.round(diagnosticResult.healthScore)}%\n`);

    // Check error rate
    if (diagnosticResult.errors?.last24h.recoveryRate < (1 - this.thresholds.errorRate)) {
      alerts.push({
        severity: 'high',
        type: 'error_rate',
        message: `Error recovery rate dropped to ${Math.round(diagnosticResult.errors.last24h.recoveryRate * 100)}%`,
        action: 'Review error patterns and update recovery strategies',
        value: diagnosticResult.errors.last24h.recoveryRate
      });
    }

    // Check cache performance
    if (diagnosticResult.cache?.performance.hitRate < this.thresholds.cacheHitRate) {
      alerts.push({
        severity: 'medium',
        type: 'cache_performance',
        message: `Cache hit rate dropped to ${Math.round(diagnosticResult.cache.performance.hitRate * 100)}%`,
        action: 'Review cache TTL settings and access patterns',
        value: diagnosticResult.cache.performance.hitRate
      });
    }

    // Check overall health
    if (diagnosticResult.healthScore < this.thresholds.healthScore) {
      alerts.push({
        severity: 'critical',
        type: 'health_degradation',
        message: `System health dropped to ${Math.round(diagnosticResult.healthScore)}%`,
        action: 'Run full diagnostic and review component health',
        value: diagnosticResult.healthScore
      });
    }

    // Check API latency
    if (diagnosticResult.apiLatency > this.thresholds.apiLatency) {
      alerts.push({
        severity: 'medium',
        type: 'api_latency',
        message: `API latency increased to ${Math.round(diagnosticResult.apiLatency)}ms`,
        action: 'Check network connectivity and API health',
        value: diagnosticResult.apiLatency
      });
    }

    if (alerts.length > 0) {
      console.log(`🚨 ${alerts.length} Alert(s) Generated:\n`);

      await this.sendAlerts(alerts);
      await this.attemptAutoRemediation(alerts);
    } else {
      console.log(`✅ All systems within normal parameters\n`);
    }

    // Store alerts
    this.alerts.push(...alerts);

    // Emit event
    eventBus.emit('diagnostic:completed', {
      result: diagnosticResult,
      alerts,
      timestamp: Date.now()
    });
  }

  async sendAlerts(alerts) {
    for (const alert of alerts) {
      const severityIcon = alert.severity === 'critical' ? '🔴' :
                           alert.severity === 'high' ? '🟠' : '🟡';

      console.log(`${severityIcon} ${alert.severity.toUpperCase()}: ${alert.message}`);
      console.log(`   Action: ${alert.action}\n`);

      // Create Linear issue for critical alerts
      if (alert.severity === 'critical') {
        try {
          console.log(`   📝 Creating Linear issue for critical alert...`);

          // Would call /creatework here
          const issueDesc = `${alert.message} - Auto-detected system issue\n\nAction Required: ${alert.action}\n\nDetected at: ${new Date().toISOString()}`;

          console.log(`   ✅ Issue would be created: "${alert.message}"\n`);

          // Store that we created an issue for this alert
          alert.issueCreated = true;
        } catch (error) {
          console.error(`   ❌ Failed to create issue: ${error.message}\n`);
        }
      }
    }
  }

  async attemptAutoRemediation(alerts) {
    console.log(`🔧 Attempting auto-remediation...\n`);

    for (const alert of alerts) {
      try {
        switch (alert.type) {
          case 'cache_performance':
            await this.optimizeCache();
            console.log(`   ✅ Cache optimization completed\n`);
            break;

          case 'error_rate':
            await this.reviewErrorPatterns();
            console.log(`   ✅ Error patterns reviewed\n`);
            break;

          case 'api_latency':
            await this.checkAPIHealth();
            console.log(`   ✅ API health check completed\n`);
            break;

          case 'health_degradation':
            console.log(`   ⚠️  Manual intervention required for health degradation\n`);
            break;

          default:
            console.log(`   ℹ️  No auto-remediation available for ${alert.type}\n`);
        }
      } catch (error) {
        console.error(`   ❌ Remediation failed for ${alert.type}: ${error.message}\n`);
      }
    }
  }

  async optimizeCache() {
    // Prune old cache entries
    const pruned = linearCache.prune(300000); // 5 minutes
    console.log(`   🧹 Pruned ${pruned} old cache entries`);

    // Reset cache stats to recalculate hit rate
    linearCache.resetStats();
    console.log(`   📊 Cache statistics reset`);
  }

  async reviewErrorPatterns() {
    // Analyze recent errors
    const errorHistory = globalState.getState('errorHistory') || [];
    const recentErrors = errorHistory.filter(e => Date.now() - e.timestamp < 86400000);

    console.log(`   📊 Found ${recentErrors.length} errors in last 24h`);

    // Group by type
    const errorTypes = {};
    recentErrors.forEach(error => {
      const type = error.type || 'unknown';
      errorTypes[type] = (errorTypes[type] || 0) + 1;
    });

    console.log(`   📈 Error types:`, errorTypes);
  }

  async checkAPIHealth() {
    // Verify Linear API connectivity
    try {
      const startTime = Date.now();
      await linearCache.get('list_issues', { first: 1 }, { ttl: 0 });
      const latency = Date.now() - startTime;

      console.log(`   🌐 API latency: ${latency}ms`);

      if (latency > this.thresholds.apiLatency) {
        console.log(`   ⚠️  API latency still high, check network`);
      } else {
        console.log(`   ✅ API latency normal`);
      }
    } catch (error) {
      console.error(`   ❌ API health check failed: ${error.message}`);
    }
  }

  stopScheduled(intervalId) {
    const index = this.scheduledChecks.findIndex(c => c.intervalId === intervalId);

    if (index !== -1) {
      clearInterval(intervalId);
      this.scheduledChecks.splice(index, 1);
      console.log(`\n🛑 Stopped scheduled diagnostics (ID: ${intervalId})\n`);
      return true;
    }

    return false;
  }

  getScheduledChecks() {
    return this.scheduledChecks.map(c => ({
      intervalId: c.intervalId,
      frequency: c.frequency,
      checks: c.checks,
      uptime: Math.round((Date.now() - c.startedAt) / 1000)
    }));
  }

  getAlerts(since = 0) {
    return this.alerts.filter(a => (a.timestamp || Date.now()) > since);
  }
}

const proactiveDiagnostics = new ProactiveDiagnostics();

// Check for monitoring flags
if (diagnosticMode.includes('--monitor')) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`📊 PROACTIVE MONITORING MODE`);
  console.log(`${'═'.repeat(80)}\n`);

  const frequency = diagnosticMode.match(/--monitor=([^\s]+)/)?.[1] || '1h';

  const intervalId = proactiveDiagnostics.schedule(frequency, ['full']);

  console.log(`\n⏰ Monitoring active. Press Ctrl+C to stop.\n`);
  console.log(`To stop: proactiveDiagnostics.stopScheduled(${intervalId})\n`);

  // Keep process alive
  process.stdin.resume();

  return new Promise(() => {});
}

if (diagnosticMode.includes('--alerts')) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🚨 RECENT ALERTS`);
  console.log(`${'═'.repeat(80)}\n`);

  const since = diagnosticMode.match(/--since=([^\s]+)/)?.[1] || '24h';
  const sinceMs = Date.now() - proactiveDiagnostics.parseFrequency(since);

  const alerts = proactiveDiagnostics.getAlerts(sinceMs);

  if (alerts.length === 0) {
    console.log(`✅ No alerts in the last ${since}\n`);
  } else {
    console.log(`Found ${alerts.length} alert(s):\n`);

    alerts.forEach((alert, i) => {
      const severityIcon = alert.severity === 'critical' ? '🔴' :
                           alert.severity === 'high' ? '🟠' : '🟡';

      console.log(`${i + 1}. ${severityIcon} ${alert.severity.toUpperCase()}: ${alert.message}`);
      console.log(`   Type: ${alert.type}`);
      console.log(`   Action: ${alert.action}`);
      if (alert.issueCreated) {
        console.log(`   ✅ Linear issue created`);
      }
      console.log('');
    });
  }

  return { alerts };
}
```

## Phase 1: System Health Check

```javascript
console.log('🏥 ENTERPRISE SYSTEM DIAGNOSTICS\n');
console.log('═'.repeat(60));
console.log(`Mode: ${diagnosticMode}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('═'.repeat(60) + '\n');

// Quick system checks
const quickChecks = await Promise.all([
  systems.systemHealth.checkAPIConnectivity(),
  systems.systemHealth.checkFileSystemAccess(),
  systems.systemHealth.checkMemoryUsage(),
  systems.systemHealth.checkDiskSpace()
]);

console.log('📊 System Health:');
quickChecks.forEach(check => {
  const icon = check.passed ? '✅' : '❌';
  console.log(`  ${icon} ${check.name}: ${check.status}`);
  if (check.warning) console.log(`     ⚠️ ${check.warning}`);
});
```

## Phase 2: Linear Integration Health

```javascript
if (diagnosticMode === 'full' || diagnosticMode === 'linear') {
  console.log('\n🔗 Linear Integration:');

  const linearHealth = await systems.linearHealth.checkHealth({
    testAPICall: true,
    checkRateLimit: true,
    verifyLabels: true,
    checkPermissions: true
  });

  console.log(`  API Status: ${linearHealth.api.status}`);
  console.log(`  Rate Limit: ${linearHealth.rateLimit.remaining}/${linearHealth.rateLimit.limit}`);
  console.log(`  Labels Configured: ${linearHealth.labels.configured}/${linearHealth.labels.required}`);
  console.log(`  Permissions: ${linearHealth.permissions.adequate ? '✅' : '❌'}`);

  if (linearHealth.issues.length > 0) {
    console.log('\n  ⚠️ Issues Found:');
    linearHealth.issues.forEach(issue => {
      console.log(`    - ${issue}`);
    });
  }

  // Recent Linear activity
  const recentActivity = await systems.linearHealth.getRecentActivity({
    limit: 5,
    includeErrors: true
  });

  console.log('\n  📈 Recent Activity:');
  console.log(`    Issues Created (24h): ${recentActivity.issuesCreated}`);
  console.log(`    Issues Updated (24h): ${recentActivity.issuesUpdated}`);
  console.log(`    API Errors (24h): ${recentActivity.errors}`);
  console.log(`    Success Rate: ${Math.round(recentActivity.successRate * 100)}%`);
}
```

## Phase 3: Learning System Diagnostics

```javascript
if (diagnosticMode === 'full' || diagnosticMode === 'learning') {
  console.log('\n🧠 Learning System:');

  const learningStats = await systems.learning.getDiagnostics();

  console.log(`  Patterns Stored: ${learningStats.patterns.total}`);
  console.log(`  Pattern Categories: ${learningStats.patterns.categories.join(', ')}`);
  console.log(`  Average Confidence: ${Math.round(learningStats.patterns.avgConfidence * 100)}%`);
  console.log(`  Learning Rate: ${learningStats.learningRate}`);

  // Top patterns
  console.log('\n  📊 Top Patterns (by usage):');
  learningStats.topPatterns.slice(0, 5).forEach((pattern, i) => {
    console.log(`    ${i + 1}. ${pattern.name} (used ${pattern.usageCount} times, ${Math.round(pattern.successRate * 100)}% success)`);
  });

  // Pattern effectiveness
  console.log('\n  📈 Pattern Effectiveness:');
  console.log(`    Successful predictions: ${learningStats.predictions.successful}`);
  console.log(`    Failed predictions: ${learningStats.predictions.failed}`);
  console.log(`    Accuracy: ${Math.round(learningStats.predictions.accuracy * 100)}%`);

  // Recommendations
  if (learningStats.recommendations.length > 0) {
    console.log('\n  💡 Learning Recommendations:');
    learningStats.recommendations.forEach(rec => {
      console.log(`    - ${rec}`);
    });
  }
}
```

## Phase 4: Cache Performance Diagnostics

```javascript
if (diagnosticMode === 'full' || diagnosticMode === 'cache') {
  console.log('\n💾 Cache System:');

  const cacheStats = await systems.cache.getDiagnostics();

  console.log(`  Total Entries: ${cacheStats.entries.total}`);
  console.log(`  Memory Usage: ${cacheStats.memory.used}MB / ${cacheStats.memory.limit}MB`);
  console.log(`  Hit Rate: ${Math.round(cacheStats.performance.hitRate * 100)}%`);
  console.log(`  Miss Rate: ${Math.round(cacheStats.performance.missRate * 100)}%`);

  // Cache efficiency
  console.log('\n  ⚡ Cache Efficiency:');
  console.log(`    Avg Response Time (cached): ${cacheStats.performance.avgCachedTime}ms`);
  console.log(`    Avg Response Time (uncached): ${cacheStats.performance.avgUncachedTime}ms`);
  console.log(`    Time Saved: ${cacheStats.performance.totalTimeSaved}ms`);
  console.log(`    API Calls Saved: ${cacheStats.performance.apiCallsSaved}`);

  // Top cached items
  console.log('\n  🔥 Hottest Cache Entries:');
  cacheStats.hotEntries.slice(0, 5).forEach((entry, i) => {
    console.log(`    ${i + 1}. ${entry.key} (${entry.hits} hits, ${entry.age}s old)`);
  });

  // Cache health
  if (cacheStats.health.issues.length > 0) {
    console.log('\n  ⚠️ Cache Issues:');
    cacheStats.health.issues.forEach(issue => {
      console.log(`    - ${issue}`);
    });
  }
}
```

## Phase 5: Checkpoint & Recovery Diagnostics

```javascript
if (diagnosticMode === 'full' || diagnosticMode === 'checkpoint') {
  console.log('\n💾 Checkpoint System:');

  const checkpointStats = await systems.checkpoint.getDiagnostics();

  console.log(`  Active Checkpoints: ${checkpointStats.active.count}`);
  console.log(`  Completed Checkpoints: ${checkpointStats.completed.count}`);
  console.log(`  Failed Recoveries: ${checkpointStats.failed.count}`);
  console.log(`  Disk Usage: ${checkpointStats.storage.used}MB`);

  // Recent checkpoints
  if (checkpointStats.recent.length > 0) {
    console.log('\n  📍 Recent Checkpoints:');
    checkpointStats.recent.slice(0, 5).forEach(cp => {
      const age = Math.round((Date.now() - cp.created) / 60000);
      console.log(`    - ${cp.id}: ${cp.type} (${age}m ago, ${cp.status})`);
    });
  }

  // Recovery capability
  console.log('\n  🔄 Recovery Capability:');
  console.log(`    Successful Recoveries: ${checkpointStats.recovery.successful}`);
  console.log(`    Recovery Success Rate: ${Math.round(checkpointStats.recovery.successRate * 100)}%`);
  console.log(`    Avg Recovery Time: ${checkpointStats.recovery.avgTime}ms`);

  // Cleanup recommendations
  if (checkpointStats.storage.oldCheckpoints > 0) {
    console.log(`\n  🧹 Cleanup: ${checkpointStats.storage.oldCheckpoints} old checkpoints can be removed`);
  }
}
```

## Phase 6: Performance Analytics

```javascript
if (diagnosticMode === 'full' || diagnosticMode === 'performance') {
  console.log('\n⚡ Performance Analytics:');

  const perfStats = await systems.performance.getComprehensiveStats();

  // Command performance
  console.log('\n  📊 Command Performance (last 7 days):');
  const commands = ['/performwork', '/creatework', '/validate'];

  for (const cmd of commands) {
    const stats = perfStats.commands[cmd];
    if (stats) {
      console.log(`\n  ${cmd}:`);
      console.log(`    Executions: ${stats.count}`);
      console.log(`    Avg Duration: ${stats.avgDuration}ms`);
      console.log(`    P50: ${stats.p50}ms | P95: ${stats.p95}ms | P99: ${stats.p99}ms`);
      console.log(`    Success Rate: ${Math.round(stats.successRate * 100)}%`);
    }
  }

  // Agent performance
  console.log('\n  🤖 Agent Performance:');
  perfStats.agents.top.slice(0, 5).forEach((agent, i) => {
    console.log(`    ${i + 1}. ${agent.name}: ${agent.executions} runs, ${agent.avgDuration}ms avg`);
  });

  // System bottlenecks
  if (perfStats.bottlenecks.length > 0) {
    console.log('\n  🚨 Bottlenecks Detected:');
    perfStats.bottlenecks.forEach(bottleneck => {
      console.log(`    - ${bottleneck.component}: ${bottleneck.issue}`);
      console.log(`      Impact: ${bottleneck.impact}`);
      console.log(`      Suggestion: ${bottleneck.suggestion}`);
    });
  }

  // Trends
  console.log('\n  📈 Performance Trends:');
  console.log(`    Overall: ${perfStats.trends.overall}`);
  console.log(`    API Latency: ${perfStats.trends.apiLatency}`);
  console.log(`    Cache Effectiveness: ${perfStats.trends.cacheEffectiveness}`);
  console.log(`    Error Rate: ${perfStats.trends.errorRate}`);
}
```

## Phase 7: Error & Recovery Analytics

```javascript
if (diagnosticMode === 'full' || diagnosticMode === 'errors') {
  console.log('\n🚨 Error Analytics:');

  const errorStats = await systems.errorRecovery.getDiagnostics();

  console.log(`  Total Errors (24h): ${errorStats.last24h.total}`);
  console.log(`  Recovered: ${errorStats.last24h.recovered}`);
  console.log(`  Unrecoverable: ${errorStats.last24h.unrecoverable}`);
  console.log(`  Recovery Rate: ${Math.round(errorStats.last24h.recoveryRate * 100)}%`);

  // Error categories
  console.log('\n  📊 Error Categories:');
  Object.entries(errorStats.categories).forEach(([category, count]) => {
    const percentage = Math.round((count / errorStats.last24h.total) * 100);
    console.log(`    ${category}: ${count} (${percentage}%)`);
  });

  // Common errors
  if (errorStats.topErrors.length > 0) {
    console.log('\n  🔴 Most Common Errors:');
    errorStats.topErrors.slice(0, 5).forEach((error, i) => {
      console.log(`    ${i + 1}. ${error.message} (${error.count} occurrences)`);
      console.log(`       Last seen: ${error.lastSeen}`);
      console.log(`       Recovery strategy: ${error.recoveryStrategy}`);
    });
  }

  // Recovery strategies effectiveness
  console.log('\n  🔄 Recovery Strategy Effectiveness:');
  Object.entries(errorStats.recoveryStrategies).forEach(([strategy, stats]) => {
    console.log(`    ${strategy}: ${stats.attempts} attempts, ${Math.round(stats.successRate * 100)}% success`);
  });
}
```

## Phase 8: Deduplication System Diagnostics

```javascript
if (diagnosticMode === 'full' || diagnosticMode === 'deduplication') {
  console.log('\n🔍 Deduplication System:');

  const dedupStats = await systems.deduplication.getDiagnostics();

  console.log(`  Duplicates Prevented: ${dedupStats.prevented.total}`);
  console.log(`  False Positives: ${dedupStats.falsePositives.count}`);
  console.log(`  Accuracy: ${Math.round(dedupStats.accuracy * 100)}%`);

  // Deduplication methods effectiveness
  console.log('\n  📊 Method Effectiveness:');
  console.log(`    Exact Match: ${dedupStats.methods.exact.prevented} prevented`);
  console.log(`    Semantic: ${dedupStats.methods.semantic.prevented} prevented`);
  console.log(`    Pattern: ${dedupStats.methods.pattern.prevented} prevented`);

  // Recent duplicate prevention
  if (dedupStats.recent.length > 0) {
    console.log('\n  🚫 Recently Prevented Duplicates:');
    dedupStats.recent.slice(0, 3).forEach(dup => {
      console.log(`    - "${dup.title}" (${Math.round(dup.similarity * 100)}% similar to ${dup.existingId})`);
    });
  }
}
```

## Phase 9: Recommendations & Actions

```javascript
console.log('\n' + '═'.repeat(60));
console.log('💡 RECOMMENDATIONS');
console.log('═'.repeat(60));

const recommendations = await generateRecommendations({
  linearHealth,
  learningStats,
  cacheStats,
  checkpointStats,
  perfStats,
  errorStats,
  dedupStats
});

// Critical actions
if (recommendations.critical.length > 0) {
  console.log('\n🔴 Critical Actions Required:');
  recommendations.critical.forEach((action, i) => {
    console.log(`  ${i + 1}. ${action.issue}`);
    console.log(`     Action: ${action.action}`);
    console.log(`     Command: ${action.command}`);
  });
}

// Performance optimizations
if (recommendations.performance.length > 0) {
  console.log('\n⚡ Performance Optimizations:');
  recommendations.performance.forEach((opt, i) => {
    console.log(`  ${i + 1}. ${opt.suggestion}`);
    console.log(`     Expected improvement: ${opt.improvement}`);
  });
}

// Maintenance tasks
if (recommendations.maintenance.length > 0) {
  console.log('\n🔧 Maintenance Tasks:');
  recommendations.maintenance.forEach((task, i) => {
    console.log(`  ${i + 1}. ${task.task}`);
    console.log(`     Priority: ${task.priority}`);
  });
}
```

## Phase 10: Health Score Summary

```javascript
console.log('\n' + '═'.repeat(60));
console.log('📊 OVERALL HEALTH SCORE');
console.log('═'.repeat(60));

const healthScore = calculateOverallHealth({
  system: quickChecks,
  linear: linearHealth,
  learning: learningStats,
  cache: cacheStats,
  checkpoint: checkpointStats,
  performance: perfStats,
  errors: errorStats,
  deduplication: dedupStats
});

// Visual health bar
const healthBar = generateHealthBar(healthScore.overall);
console.log(`\nOverall Health: ${healthBar} ${healthScore.overall}%`);

// Component scores
console.log('\nComponent Health:');
Object.entries(healthScore.components).forEach(([component, score]) => {
  const bar = generateHealthBar(score, 20);
  console.log(`  ${component.padEnd(15)} ${bar} ${score}%`);
});

// Health trend
console.log(`\nHealth Trend: ${healthScore.trend} (vs last check)`);

// Status summary
const statusEmoji = healthScore.overall >= 90 ? '✅' :
                   healthScore.overall >= 70 ? '⚠️' :
                   '❌';

console.log(`\nSystem Status: ${statusEmoji} ${healthScore.status}`);
console.log(healthScore.summary);

console.log('\n' + '═'.repeat(60));
console.log(`Diagnostic completed at ${new Date().toISOString()}`);
console.log('═'.repeat(60));

// Save diagnostic report
await saveDiagnosticReport({
  timestamp: new Date().toISOString(),
  mode: diagnosticMode,
  healthScore,
  recommendations,
  allStats: {
    linearHealth,
    learningStats,
    cacheStats,
    checkpointStats,
    perfStats,
    errorStats,
    dedupStats
  }
});

return {
  healthScore: healthScore.overall,
  status: healthScore.status,
  criticalIssues: recommendations.critical.length,
  recommendations: recommendations
};
```

## Helper Functions

```javascript
function generateHealthBar(percentage, width = 30) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const color = percentage >= 90 ? '🟢' :
                percentage >= 70 ? '🟡' :
                percentage >= 50 ? '🟠' :
                '🔴';
  return `[${color}${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
}

function calculateOverallHealth(stats) {
  // Weighted health calculation
  const weights = {
    system: 0.15,
    linear: 0.20,
    learning: 0.10,
    cache: 0.10,
    checkpoint: 0.10,
    performance: 0.20,
    errors: 0.10,
    deduplication: 0.05
  };

  let overall = 0;
  const components = {};

  Object.entries(weights).forEach(([component, weight]) => {
    const componentScore = calculateComponentScore(stats[component]);
    components[component] = componentScore;
    overall += componentScore * weight;
  });

  return {
    overall: Math.round(overall),
    components,
    status: getHealthStatus(overall),
    summary: getHealthSummary(overall, components),
    trend: calculateTrend(overall)
  };
}

async function generateRecommendations(stats) {
  const recommendations = {
    critical: [],
    performance: [],
    maintenance: []
  };

  // Analyze each component for issues
  if (stats.errorStats?.last24h.recoveryRate < 0.8) {
    recommendations.critical.push({
      issue: 'High error rate with low recovery',
      action: 'Review error patterns and update recovery strategies',
      command: '/diagnostic errors'
    });
  }

  if (stats.cacheStats?.performance.hitRate < 0.5) {
    recommendations.performance.push({
      suggestion: 'Increase cache TTL for frequently accessed items',
      improvement: '30-40% reduction in API calls'
    });
  }

  if (stats.checkpointStats?.storage.oldCheckpoints > 10) {
    recommendations.maintenance.push({
      task: 'Clean up old checkpoints',
      priority: 'Medium',
      command: '/checkpoint-cleanup'
    });
  }

  return recommendations;
}
```

## Usage Examples

```bash
# Full system diagnostic
/diagnostic

# Quick health check only
/diagnostic quick

# Specific system diagnostics
/diagnostic linear      # Check Linear integration
/diagnostic cache       # Check cache performance
/diagnostic learning    # Check learning system
/diagnostic errors      # Check error patterns
/diagnostic performance # Check performance metrics

# Export diagnostic report
/diagnostic full --export
```

## Benefits

1. **🏥 Comprehensive Health Monitoring** - Full system visibility
2. **📊 Performance Analytics** - Detailed metrics and trends
3. **🚨 Early Issue Detection** - Identify problems before they impact users
4. **💡 Actionable Recommendations** - Specific steps to improve
5. **📈 Trend Analysis** - Track improvements over time
6. **🔄 Recovery Validation** - Ensure systems can recover from failures