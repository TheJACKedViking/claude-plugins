/**
 * Claude Code Plugins Marketplace - Plugin Loader
 *
 * Core framework for loading and managing Claude Code plugins
 */

import * as fs from 'fs';
import * as path from 'path';

export interface PluginMetadata {
  name: string;
  description: string;
  version: string;
  author: {
    name: string;
    email?: string;
    url?: string;
  };
  repository?: string;
  license?: string;
  tags?: string[];
  commands?: CommandDefinition[];
}

export interface CommandDefinition {
  name: string;
  description: string;
  prompt: string;
  parameters?: CommandParameter[];
}

export interface CommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file' | 'directory';
  description: string;
  required: boolean;
  default?: any;
}

export interface LoadedPlugin {
  metadata: PluginMetadata;
  path: string;
  enabled: boolean;
}

export class PluginLoader {
  private plugins: Map<string, LoadedPlugin> = new Map();
  private pluginsDirectory: string;

  constructor(pluginsDirectory: string) {
    this.pluginsDirectory = pluginsDirectory;
  }

  /**
   * Load all plugins from the plugins directory
   */
  async loadAllPlugins(): Promise<LoadedPlugin[]> {
    const pluginDirs = await this.getPluginDirectories();
    const loadedPlugins: LoadedPlugin[] = [];

    for (const pluginDir of pluginDirs) {
      try {
        const plugin = await this.loadPlugin(pluginDir);
        if (plugin) {
          // Use plugin name as key
          this.plugins.set(plugin.metadata.name, plugin);
          loadedPlugins.push(plugin);
        }
      } catch (error) {
        console.error(`Failed to load plugin from ${pluginDir}:`, error);
      }
    }

    return loadedPlugins;
  }

  /**
   * Load a single plugin from a directory
   */
  async loadPlugin(pluginPath: string): Promise<LoadedPlugin | null> {
    // Official Claude Code format: .claude-plugin/plugin.json
    const metadataPath = path.join(pluginPath, '.claude-plugin', 'plugin.json');

    if (!fs.existsSync(metadataPath)) {
      console.warn(`No .claude-plugin/plugin.json found in ${pluginPath}`);
      return null;
    }

    const metadata = JSON.parse(
      fs.readFileSync(metadataPath, 'utf-8')
    ) as PluginMetadata;

    // Validate metadata
    if (!this.validateMetadata(metadata)) {
      console.error(`Invalid plugin metadata in ${pluginPath}`);
      return null;
    }

    // Auto-discover commands from commands directory
    await this.loadCommandPrompts(metadata, pluginPath);

    return {
      metadata,
      path: pluginPath,
      enabled: true
    };
  }

  /**
   * Load command prompt content from command files
   * Auto-discovers all .md files in the commands/ directory
   */
  private async loadCommandPrompts(
    metadata: PluginMetadata,
    pluginPath: string
  ): Promise<void> {
    const commandsDir = path.join(pluginPath, 'commands');

    if (!fs.existsSync(commandsDir)) {
      metadata.commands = [];
      return;
    }

    // Auto-discover commands from markdown files
    metadata.commands = [];
    const commandFiles = fs.readdirSync(commandsDir)
      .filter(file => file.endsWith('.md'));

    for (const file of commandFiles) {
      const commandName = file.replace('.md', '');
      const commandFile = path.join(commandsDir, file);
      const content = fs.readFileSync(commandFile, 'utf-8');

      // Parse frontmatter
      const { frontmatter, body } = this.parseFrontmatter(content);

      metadata.commands.push({
        name: commandName,
        description: frontmatter.description || `${commandName} command`,
        prompt: body,
        parameters: this.parseArgumentHint(frontmatter['argument-hint'])
      });
    }
  }

  /**
   * Parse YAML frontmatter from markdown content
   */
  private parseFrontmatter(content: string): { frontmatter: any; body: string } {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { frontmatter: {}, body: content };
    }

    const frontmatterText = match[1];
    const body = match[2];
    const frontmatter: any = {};

    // Simple YAML parser for key: value pairs
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        frontmatter[key] = value;
      }
    });

    return { frontmatter, body };
  }

  /**
   * Parse argument-hint into parameters array
   */
  private parseArgumentHint(hint?: string): CommandParameter[] | undefined {
    if (!hint) return undefined;

    // Simple parser for [arg1] [arg2] format
    const args = hint.match(/\[([^\]]+)\]/g);
    if (!args) return undefined;

    return args.map((arg, index) => {
      const name = arg.replace(/[\[\]]/g, '');
      const isOptional = hint.indexOf(arg) > hint.indexOf('[') && index > 0;

      return {
        name,
        type: 'string' as const,
        description: `${name} parameter`,
        required: index === 0 && !isOptional
      };
    });
  }

  /**
   * Get all plugin directories
   */
  private async getPluginDirectories(): Promise<string[]> {
    if (!fs.existsSync(this.pluginsDirectory)) {
      return [];
    }

    const entries = fs.readdirSync(this.pluginsDirectory, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => path.join(this.pluginsDirectory, entry.name));
  }

  /**
   * Validate plugin metadata
   */
  private validateMetadata(metadata: PluginMetadata): boolean {
    // Official format: only name, description, and version required
    // id and commands are optional (commands auto-discovered)
    return !!(
      metadata.name &&
      metadata.version &&
      metadata.description
    );
  }

  /**
   * Get a plugin by name
   */
  getPlugin(name: string): LoadedPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): LoadedPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all commands from all plugins
   */
  getAllCommands(): Map<string, { plugin: LoadedPlugin; command: CommandDefinition }> {
    const commands = new Map();

    for (const plugin of this.plugins.values()) {
      if (plugin.metadata.commands) {
        for (const command of plugin.metadata.commands) {
          const commandKey = `${plugin.metadata.name}:${command.name}`;
          commands.set(commandKey, { plugin, command });
        }
      }
    }

    return commands;
  }

  /**
   * Enable or disable a plugin
   */
  setPluginEnabled(id: string, enabled: boolean): boolean {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.enabled = enabled;
      return true;
    }
    return false;
  }
}
