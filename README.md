# Claude Code Plugins Marketplace

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

A powerful, extensible plugin framework for Claude Code that enables custom slash commands, agent coordination, and workflow automation through a marketplace of plugins.

## Overview

The Claude Code Plugins Marketplace is a comprehensive framework that allows developers to:

- **Create custom slash commands** for Claude Code
- **Build multi-agent coordination systems** for complex tasks
- **Share and distribute plugins** through a centralized marketplace
- **Extend Claude Code's capabilities** with specialized workflows
- **Manage plugin lifecycles** with version control and dependency management

## Features

### Core Framework

- **Plugin System**: Extensible plugin architecture with metadata, versioning, and lifecycle management
- **Command Registry**: Centralized slash command registration and execution
- **CLI Tools**: Command-line interface for plugin management and testing
- **TypeScript Support**: Fully typed with comprehensive interfaces
- **Hot Reloading**: Development mode with automatic plugin reloading
- **Validation**: Schema validation for plugin metadata and commands

### Marketplace Capabilities

- **Plugin Discovery**: Browse and search available plugins
- **Version Management**: Track plugin versions and updates
- **Enable/Disable**: Control which plugins are active
- **Statistics**: View marketplace and plugin analytics
- **Testing**: Built-in command testing and validation

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/claude-code/plugins-marketplace.git
cd plugins-marketplace/marketplace

# Install dependencies
npm install

# Build the project
npm run build
```

### Basic Usage

```bash
# List all installed plugins
npm run list

# View all available slash commands
npm run commands

# Show marketplace statistics
npm run stats

# Get plugin details
marketplace info work

# Enable/disable a plugin
marketplace enable work
marketplace disable work

# Test a command
marketplace exec work:creatework "Add user authentication"
```

## Architecture

```
marketplace/
├── core/                      # Framework core
│   ├── plugin-loader.ts       # Plugin loading and management
│   ├── marketplace.ts         # Marketplace orchestration
│   ├── cli.ts                 # Command-line interface
│   └── index.ts               # Public API exports
├── plugins/                   # Plugin directory
│   └── work/                  # Example: Work plugin
│       ├── plugin.json        # Plugin metadata
│       ├── commands/          # Slash command definitions
│       │   ├── creatework.md  # Create Linear issues
│       │   ├── performwork.md # Execute Linear issues
│       │   ├── validate.md    # Validation
│       │   ├── diagnostic.md  # Diagnostics
│       │   └── linear-setup.md # Setup
│       └── README.md          # Plugin documentation
├── registry.json              # Plugin registry
├── package.json               # Project configuration
└── tsconfig.json              # TypeScript configuration
```

## Plugin Structure

Each plugin follows this structure:

```
plugins/your-plugin/
├── plugin.json           # Required: Plugin metadata
├── commands/             # Slash command prompts
│   └── command-name.md   # Command prompt file
├── README.md             # Plugin documentation
└── assets/               # Optional: Plugin assets
```

### plugin.json Schema

```json
{
  "id": "plugin-id",
  "name": "Plugin Name",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": "Author Name",
  "repository": "https://github.com/...",
  "license": "MIT",
  "tags": ["tag1", "tag2"],
  "commands": [
    {
      "name": "command-name",
      "description": "Command description",
      "parameters": [
        {
          "name": "param1",
          "type": "string",
          "description": "Parameter description",
          "required": true
        }
      ]
    }
  ]
}
```

## Creating a Plugin

### Step 1: Create Plugin Directory

```bash
mkdir -p marketplace/plugins/my-plugin/commands
cd marketplace/plugins/my-plugin
```

### Step 2: Create plugin.json

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "author": "Your Name",
  "commands": [
    {
      "name": "my-command",
      "description": "Does something awesome"
    }
  ]
}
```

### Step 3: Create Command Prompt

Create `commands/my-command.md`:

```markdown
# My Command

This is the prompt that Claude will receive when the command is executed.

You can use parameters like {{param1}} that will be substituted.
```

### Step 4: Test Your Plugin

```bash
marketplace list
marketplace exec my-plugin:my-command
```

## Included Plugins

### Work

Enterprise-grade Linear issue management with intelligent workflows, type safety verification, and comprehensive validation. Streamlines the entire lifecycle of Linear issues from creation to validation.

**Commands**:
- `/work:creatework <description>` - Create Linear issues with smart deduplication
- `/work:performwork <issue-id>` - Execute issues with mandatory type checking
- `/work:validate` - Run comprehensive validation
- `/work:diagnostic [mode]` - System health monitoring
- `/work:linear-setup` - Initialize Linear workspace

**Example**: `/work:creatework "Add user authentication with JWT"`

See [plugins/work/README.md](plugins/work/README.md) for details.

## API Reference

### Marketplace Class

```typescript
import { Marketplace } from './core';

const marketplace = new Marketplace('/path/to/marketplace');
await marketplace.initialize();

// List plugins
const plugins = marketplace.listPlugins();

// Get commands
const commands = marketplace.getSlashCommands();

// Execute command
const result = marketplace.executeCommand('plugin-id:command', ['arg1', 'arg2']);
```

### PluginLoader Class

```typescript
import { PluginLoader } from './core';

const loader = new PluginLoader('/path/to/plugins');
const plugins = await loader.loadAllPlugins();
```

### MarketplaceCLI Class

```typescript
import { MarketplaceCLI } from './core';

const cli = new MarketplaceCLI();
await cli.init();

cli.list();           // List all plugins
cli.listCommands();   // List all commands
cli.stats();          // Show statistics
```

## Development

### Project Scripts

```bash
npm run start      # Start CLI
npm run build      # Build TypeScript
npm run dev        # Development mode with hot reload
npm run test       # Run tests
npm run list       # List plugins
npm run commands   # List commands
npm run stats      # Show statistics
```

### Adding Dependencies

```bash
npm install <package-name>
```

### TypeScript Configuration

The project uses strict TypeScript settings. See `tsconfig.json` for configuration.

## Best Practices

### Plugin Development

1. **Use semantic versioning** for plugin versions
2. **Provide clear descriptions** for commands and parameters
3. **Include comprehensive README** with examples
4. **Test commands thoroughly** before publishing
5. **Follow naming conventions**: `plugin-id:command-name`
6. **Use descriptive tags** for discoverability

### Command Prompts

1. **Be specific and clear** in command prompts
2. **Use parameter placeholders** like `{{param}}`
3. **Provide context** and examples in prompts
4. **Structure output** with markdown formatting
5. **Handle edge cases** in prompt instructions

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add my feature'`
6. Push: `git push origin feature/my-feature`
7. Submit a pull request

### Contribution Guidelines

- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Update documentation for new features
- Ensure all tests pass
- Follow the existing code style

## Publishing Plugins

To share your plugin with the community:

1. Ensure your plugin follows the structure guidelines
2. Add comprehensive README documentation
3. Test thoroughly
4. Submit to the marketplace registry
5. Tag a release version

## Troubleshooting

### Plugin not loading

- Check `plugin.json` syntax is valid JSON
- Ensure all required fields are present
- Verify command files exist in `commands/` directory

### Command not executing

- Check plugin is enabled: `marketplace list`
- Verify command name matches in `plugin.json`
- Test with: `marketplace exec plugin:command`

### TypeScript errors

- Run `npm install` to ensure dependencies are installed
- Check `tsconfig.json` configuration
- Verify TypeScript version: `tsc --version`

## License

MIT License - See LICENSE file for details

## Support

- **Documentation**: See `/docs` for detailed guides
- **Issues**: Report bugs on [GitHub Issues](https://github.com/claude-code/plugins-marketplace/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/claude-code/plugins-marketplace/discussions)
- **Community**: Join our Discord server

## Roadmap

- [ ] Plugin dependency management
- [ ] Remote plugin installation
- [ ] Plugin marketplace web UI
- [ ] Plugin analytics and metrics
- [ ] Multi-language support
- [ ] Plugin templates and scaffolding
- [ ] CI/CD integration
- [ ] Plugin security scanning
- [ ] Version compatibility checking
- [ ] Plugin sandboxing

## Credits

Built with ❤️ by the Claude Code community

### Core Contributors

- Claude Code Marketplace Team

### Special Thanks

- All plugin developers
- Early adopters and testers
- The Claude Code community

---

**Ready to extend Claude Code?** Start creating your first plugin today!
