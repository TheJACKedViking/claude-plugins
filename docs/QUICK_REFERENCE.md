# Quick Reference Guide

Fast reference for common marketplace operations and plugin development tasks.

## CLI Commands

### Plugin Management

```bash
# List all plugins
marketplace list

# Show plugin details
marketplace info <plugin-id>

# Enable/disable plugins
marketplace enable <plugin-id>
marketplace disable <plugin-id>

# Show marketplace stats
marketplace stats
```

### Command Management

```bash
# List all commands
marketplace commands

# Execute a command
marketplace exec <plugin-id>:<command-name> [args...]

# Example
marketplace exec ultrathink:ultrathink "Your task here"
```

### Development

```bash
# Start in development mode
npm run dev

# Build TypeScript
npm run build

# Run tests
npm run test
```

## Plugin Structure

### Minimal Plugin

```
plugins/my-plugin/
├── plugin.json
└── commands/
    └── my-command.md
```

### plugin.json Minimal

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "What it does",
  "author": "Your Name",
  "commands": [
    {
      "name": "my-command",
      "description": "Command description"
    }
  ]
}
```

### Command File Template

```markdown
# Command Name

Context and instructions for Claude.

## Task
{{parameter}}

## Output Format
Structure for the response.
```

## Common Patterns

### Command with Parameters

```json
{
  "name": "analyze",
  "description": "Analyze code",
  "parameters": [
    {
      "name": "file",
      "type": "file",
      "description": "File to analyze",
      "required": true
    },
    {
      "name": "depth",
      "type": "number",
      "description": "Analysis depth (1-10)",
      "required": false,
      "default": 5
    }
  ]
}
```

### Using Parameters in Prompt

```markdown
Analyze the file: {{file}}
With depth level: {{depth}}
```

## Parameter Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text input | `"hello world"` |
| `number` | Numeric value | `42` |
| `boolean` | True/false | `true` |
| `file` | File path | `"/path/to/file.ts"` |
| `directory` | Directory path | `"/path/to/dir"` |

## Testing Checklist

- [ ] Plugin appears in `marketplace list`
- [ ] `marketplace info <plugin>` shows correct details
- [ ] Commands execute without errors
- [ ] Parameters are substituted correctly
- [ ] Output is well-formatted
- [ ] Edge cases are handled

## Troubleshooting

### Plugin not loading

```bash
# Check JSON syntax
cat plugins/my-plugin/plugin.json | jq

# Verify structure
ls -la plugins/my-plugin/
```

### Command not found

```bash
# Check registry
cat marketplace/registry.json

# Reload marketplace
marketplace list
```

### TypeScript errors

```bash
# Reinstall dependencies
npm install

# Clean build
rm -rf dist/
npm run build
```

## File Locations

```
marketplace/
├── core/              # Framework code
├── plugins/           # Plugin directory
├── docs/              # Documentation
├── registry.json      # Plugin registry
├── package.json       # NPM config
└── tsconfig.json      # TypeScript config
```

## Version Format

Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

Example: `1.2.3`

## Command Naming

### Plugin ID
- Format: `kebab-case`
- Example: `code-reviewer`, `test-generator`

### Command Name
- Format: `verb-noun` or single word
- Example: `review`, `generate-tests`, `analyze`

### Full Command
- Format: `<plugin-id>:<command-name>`
- Example: `/code-reviewer:review`, `/ultrathink:ultrathink`

## Common Tasks

### Create New Plugin

```bash
# Copy template
cp -r docs/examples/starter-plugin plugins/my-plugin

# Edit metadata
vim plugins/my-plugin/plugin.json

# Create command
vim plugins/my-plugin/commands/my-command.md

# Test
marketplace info my-plugin
marketplace exec my-plugin:my-command
```

### Add Command to Existing Plugin

```json
// In plugin.json, add to commands array:
{
  "name": "new-command",
  "description": "What it does"
}
```

```bash
# Create command file
touch plugins/my-plugin/commands/new-command.md
vim plugins/my-plugin/commands/new-command.md
```

### Update Plugin Version

```json
// In plugin.json
{
  "version": "1.1.0"  // Increment version
}
```

```bash
# Tag release
git tag -a v1.1.0 -m "Version 1.1.0"
git push origin v1.1.0
```

## API Quick Reference

### TypeScript

```typescript
import { Marketplace } from './core';

// Initialize
const marketplace = new Marketplace('/path/to/marketplace');
await marketplace.initialize();

// List plugins
const plugins = marketplace.listPlugins();

// Get commands
const commands = marketplace.getSlashCommands();

// Execute command
const result = marketplace.executeCommand('plugin:command', args);
```

## Useful Links

- [Full Documentation](../README.md)
- [Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)
- [Starter Template](./examples/starter-plugin/)
- [UltraThink Plugin](../plugins/ultrathink/)

## Tags for Plugins

Common tags to improve discoverability:

- `agent`, `automation`, `code-review`
- `testing`, `documentation`, `refactoring`
- `architecture`, `design-patterns`, `best-practices`
- `productivity`, `workflow`, `developer-tools`
- `ai-assistant`, `multi-agent`, `coordination`

## Need Help?

- Check [PLUGIN_DEVELOPMENT.md](./PLUGIN_DEVELOPMENT.md)
- Browse example plugins in `plugins/`
- Open an issue on GitHub
- Join community discussions

---

**Quick tip**: Start with the [starter template](./examples/starter-plugin/) and customize from there!
