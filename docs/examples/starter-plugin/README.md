# Starter Plugin Template

A complete template for creating new Claude Code plugins. Use this as a starting point for your own plugins.

## Quick Start

1. **Copy this template**:
   ```bash
   cp -r docs/examples/starter-plugin plugins/my-new-plugin
   cd plugins/my-new-plugin
   ```

2. **Update plugin.json**:
   - Change `id` to your plugin's unique identifier
   - Update `name`, `description`, and `author`
   - Modify commands as needed
   - Add your repository URL

3. **Create command prompts**:
   - Edit `commands/example.md` or create new command files
   - Each command needs a corresponding `.md` file in `commands/`

4. **Update README.md**:
   - Replace this content with your plugin's documentation
   - Include usage examples
   - Add installation instructions

5. **Test your plugin**:
   ```bash
   marketplace list                    # Verify it appears
   marketplace info my-new-plugin      # Check details
   marketplace exec my-new-plugin:example "test input"
   ```

## Template Structure

```
starter-plugin/
├── plugin.json           # Plugin metadata
├── commands/
│   └── example.md        # Example command prompt
└── README.md            # This file
```

## Customization Guide

### Adding Commands

1. Add command definition to `plugin.json`:
   ```json
   {
     "name": "my-command",
     "description": "What this command does",
     "parameters": [...]
   }
   ```

2. Create `commands/my-command.md` with the prompt

3. Test with: `marketplace exec your-plugin:my-command`

### Parameter Types

- `string`: Text input
- `number`: Numeric values
- `boolean`: True/false flags
- `file`: File paths
- `directory`: Directory paths

### Best Practices

- Keep command names short and descriptive
- Use verb-noun format (e.g., `generate-docs`, `analyze-code`)
- Provide clear parameter descriptions
- Include usage examples
- Document expected outputs

## Publishing Your Plugin

Once your plugin is ready:

1. Test thoroughly
2. Update version number
3. Write comprehensive documentation
4. Submit to marketplace via PR

See [PLUGIN_DEVELOPMENT.md](../../PLUGIN_DEVELOPMENT.md) for detailed publishing guide.

## Example Command

```bash
# Basic usage
/starter-plugin:example "hello world"

# With verbose flag
/starter-plugin:example "complex task" --verbose
```

## License

MIT License - feel free to use this template for your own plugins!
