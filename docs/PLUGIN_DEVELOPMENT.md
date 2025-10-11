# Plugin Development Guide

A comprehensive guide to creating plugins for the Claude Code Plugins Marketplace.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Plugin Architecture](#plugin-architecture)
3. [Creating Your First Plugin](#creating-your-first-plugin)
4. [Command Design](#command-design)
5. [Parameter Handling](#parameter-handling)
6. [Best Practices](#best-practices)
7. [Testing](#testing)
8. [Publishing](#publishing)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- TypeScript knowledge
- Familiarity with Claude Code
- Understanding of prompt engineering

### Development Environment Setup

```bash
# Clone the marketplace
git clone https://github.com/claude-code/plugins-marketplace.git
cd plugins-marketplace/marketplace

# Install dependencies
npm install

# Start in development mode
npm run dev
```

## Plugin Architecture

### Directory Structure

```
plugins/your-plugin/
├── plugin.json              # Plugin metadata (required)
├── commands/                # Command prompts directory
│   ├── command1.md          # Command prompt file
│   └── command2.md          # Another command
├── README.md                # Plugin documentation (recommended)
├── LICENSE                  # License file (recommended)
├── examples/                # Usage examples (optional)
│   └── example.md
└── assets/                  # Assets like images (optional)
    └── logo.png
```

### Plugin Metadata (plugin.json)

The `plugin.json` file is the heart of your plugin. It defines metadata, commands, and parameters.

**Required Fields**:
- `id`: Unique plugin identifier (kebab-case)
- `name`: Human-readable plugin name
- `version`: Semantic version (e.g., "1.0.0")
- `description`: Brief description of the plugin
- `author`: Plugin author name
- `commands`: Array of command definitions

**Optional Fields**:
- `repository`: Git repository URL
- `license`: License identifier (e.g., "MIT")
- `tags`: Array of descriptive tags
- `homepage`: Plugin homepage URL
- `bugs`: Bug tracker URL
- `dependencies`: Plugin dependencies

### Example plugin.json

```json
{
  "id": "code-reviewer",
  "name": "Code Reviewer",
  "version": "1.0.0",
  "description": "Automated code review with best practices",
  "author": "Jane Developer",
  "repository": "https://github.com/jane/code-reviewer",
  "license": "MIT",
  "tags": ["code-review", "quality", "best-practices"],
  "commands": [
    {
      "name": "review",
      "description": "Review code for quality and best practices",
      "parameters": [
        {
          "name": "file",
          "type": "file",
          "description": "File to review",
          "required": true
        },
        {
          "name": "level",
          "type": "string",
          "description": "Review depth (quick|detailed|comprehensive)",
          "required": false,
          "default": "detailed"
        }
      ]
    },
    {
      "name": "suggest",
      "description": "Suggest improvements for code",
      "parameters": [
        {
          "name": "code",
          "type": "string",
          "description": "Code to analyze",
          "required": true
        }
      ]
    }
  ]
}
```

## Creating Your First Plugin

### Step 1: Create Plugin Directory

```bash
cd marketplace/plugins
mkdir my-first-plugin
cd my-first-plugin
mkdir commands
```

### Step 2: Create plugin.json

Create `plugin.json` with basic metadata:

```json
{
  "id": "my-first-plugin",
  "name": "My First Plugin",
  "version": "0.1.0",
  "description": "My awesome first plugin",
  "author": "Your Name",
  "commands": [
    {
      "name": "hello",
      "description": "Says hello to the user"
    }
  ]
}
```

### Step 3: Create Command Prompt

Create `commands/hello.md`:

```markdown
# Hello Command

You are a friendly assistant. Greet the user warmly and introduce yourself as coming from the "My First Plugin" plugin for Claude Code.

Explain that you're here to demonstrate how slash commands work in the Claude Code Plugins Marketplace.

Be enthusiastic and helpful!
```

### Step 4: Test Your Plugin

```bash
# From marketplace root
marketplace list                          # Verify plugin appears
marketplace info my-first-plugin          # View plugin details
marketplace exec my-first-plugin:hello    # Test the command
```

## Command Design

### Command Prompt Guidelines

Command prompts are markdown files that define how Claude should behave when the command is executed.

**Structure**:
1. **Title**: Clear command name/purpose
2. **Context**: Background information
3. **Instructions**: Specific directives
4. **Format**: Expected output format
5. **Examples**: Sample outputs (optional)

### Example: Code Review Command

```markdown
# Code Review Command

You are an expert code reviewer with deep knowledge of software engineering best practices, design patterns, and language-specific conventions.

## Task
Review the provided code for:
- Code quality and readability
- Potential bugs and edge cases
- Performance considerations
- Security vulnerabilities
- Design patterns and architecture
- Documentation completeness

## Review Depth
{{level}}

## Code to Review
{{file}}

## Output Format

Provide your review in the following structure:

### Summary
[Brief overview of the code quality]

### Issues Found
1. **[Severity]** Issue description
   - Location: File:Line
   - Recommendation: How to fix

### Strengths
- List positive aspects

### Recommendations
1. Actionable improvement
2. Another suggestion

### Score
Code Quality: [X/10]

Use severity levels: Critical, High, Medium, Low, Info
```

### Parameter Placeholders

Use double curly braces for parameters:

```markdown
Hello {{name}}! You asked about {{topic}}.
```

### Conditional Content

While the framework doesn't support conditionals natively, you can structure prompts to handle optional parameters:

```markdown
Review the code{{#if level}} with {{level}} depth{{/if}}.

# Becomes either:
# "Review the code."
# or
# "Review the code with detailed depth."
```

## Parameter Handling

### Parameter Types

- `string`: Text input
- `number`: Numeric input
- `boolean`: True/false flag
- `file`: File path
- `directory`: Directory path

### Parameter Definition

```json
{
  "name": "depth",
  "type": "number",
  "description": "Analysis depth level (1-10)",
  "required": false,
  "default": 5
}
```

### Required vs Optional

- **Required**: Must be provided by user
- **Optional**: Can use default value if not provided

### Default Values

```json
{
  "parameters": [
    {
      "name": "format",
      "type": "string",
      "default": "markdown",
      "required": false
    }
  ]
}
```

## Best Practices

### 1. Naming Conventions

**Plugin IDs**:
- Use kebab-case: `code-reviewer`, `test-generator`
- Be descriptive and unique
- Avoid generic names

**Command Names**:
- Use verb-noun format: `review`, `generate-tests`, `analyze`
- Keep it short and memorable
- Use hyphens for multi-word commands

### 2. Version Management

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

Example: `1.2.3`

### 3. Documentation

**README.md Should Include**:
- Plugin overview
- Installation instructions
- Usage examples
- Command reference
- Configuration options
- Troubleshooting
- Changelog

### 4. Prompt Engineering

**Effective Prompts**:
- Be specific and clear
- Provide context and background
- Define expected output format
- Include examples when helpful
- Handle edge cases
- Use structured markdown

**Avoid**:
- Vague instructions
- Overly complex prompts
- Ambiguous language
- Missing context

### 5. Error Handling

Include error handling in your prompts:

```markdown
If the file cannot be found, respond with:
"Error: File not found. Please check the file path and try again."

If the code is too large, respond with:
"Error: Code exceeds maximum size. Please provide a smaller code sample."
```

### 6. User Experience

- Provide clear, actionable output
- Use formatting (headers, lists, code blocks)
- Include next steps or recommendations
- Be consistent across commands

## Testing

### Manual Testing

```bash
# Test plugin loads correctly
marketplace list

# View plugin information
marketplace info your-plugin

# Test command execution
marketplace exec your-plugin:command arg1 arg2

# Check command output
marketplace exec your-plugin:command --help
```

### Integration Testing

Create test scripts in `tests/` directory:

```typescript
import { Marketplace } from '../core';

describe('MyPlugin', () => {
  let marketplace: Marketplace;

  beforeAll(async () => {
    marketplace = new Marketplace('./');
    await marketplace.initialize();
  });

  test('plugin loads successfully', () => {
    const plugin = marketplace.getPlugin('my-plugin');
    expect(plugin).toBeDefined();
    expect(plugin?.metadata.version).toBe('1.0.0');
  });

  test('command executes', () => {
    const result = marketplace.executeCommand('my-plugin:hello');
    expect(result).toContain('Hello');
  });
});
```

### Validation Checklist

- [ ] `plugin.json` is valid JSON
- [ ] All required fields are present
- [ ] Command files exist in `commands/` directory
- [ ] README.md is comprehensive
- [ ] Examples are provided
- [ ] Version follows semantic versioning
- [ ] No syntax errors in prompts
- [ ] Parameters are well-documented

## Publishing

### Pre-publish Checklist

1. **Code Quality**
   - [ ] No TypeScript errors
   - [ ] All commands tested
   - [ ] Documentation complete
   - [ ] Examples included

2. **Metadata**
   - [ ] Accurate description
   - [ ] Correct version number
   - [ ] Valid repository URL
   - [ ] License specified

3. **Documentation**
   - [ ] README.md complete
   - [ ] Usage examples clear
   - [ ] Troubleshooting guide included
   - [ ] Changelog updated

### Publishing Steps

1. **Tag a Release**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Submit to Marketplace**
   - Fork the marketplace repository
   - Add your plugin to `plugins/` directory
   - Update `registry.json`
   - Submit pull request

3. **Create Release Notes**
   - Describe new features
   - List bug fixes
   - Note breaking changes
   - Include migration guide if needed

### Marketplace Submission

Create a pull request with:
- Plugin directory in `plugins/`
- Updated `registry.json`
- Passing tests
- Documentation

## Advanced Topics

### Multi-Command Plugins

Organize related commands in a single plugin:

```json
{
  "id": "git-helper",
  "commands": [
    {"name": "commit", "description": "Generate commit message"},
    {"name": "review", "description": "Review changes"},
    {"name": "branch", "description": "Suggest branch name"}
  ]
}
```

### Plugin Dependencies

Specify dependencies on other plugins:

```json
{
  "dependencies": {
    "core-utils": "^1.0.0",
    "code-analyzer": ">=2.0.0"
  }
}
```

### Configuration Files

Add `config.json` for plugin settings:

```json
{
  "defaultReviewLevel": "detailed",
  "maxFileSize": 10000,
  "excludePatterns": ["*.test.ts", "*.spec.ts"]
}
```

## Support and Resources

- **Documentation**: `/docs` directory
- **Examples**: Browse `plugins/` for inspiration
- **Community**: GitHub Discussions
- **Issues**: GitHub Issues

## Example Plugins

Study these for reference:
- `ultrathink`: Multi-agent coordination
- Coming soon: More examples!

---

**Happy Plugin Development!** 🚀
