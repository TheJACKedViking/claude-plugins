/**
 * Claude Code Plugins Marketplace - Plugin Loader
 *
 * Core framework for loading and managing Claude Code plugins
 */

import * as fs from 'fs';
import * as path from 'path';

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  repository?: string;
  license?: string;
  tags?: string[];
  commands: CommandDefinition[];
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
          this.plugins.set(plugin.metadata.id, plugin);
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
    const metadataPath = path.join(pluginPath, 'plugin.json');

    if (!fs.existsSync(metadataPath)) {
      console.warn(`No plugin.json found in ${pluginPath}`);
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

    // Load command prompts from command files
    await this.loadCommandPrompts(metadata, pluginPath);

    return {
      metadata,
      path: pluginPath,
      enabled: true
    };
  }

  /**
   * Load command prompt content from command files
   */
  private async loadCommandPrompts(
    metadata: PluginMetadata,
    pluginPath: string
  ): Promise<void> {
    const commandsDir = path.join(pluginPath, 'commands');

    if (!fs.existsSync(commandsDir)) {
      return;
    }

    for (const command of metadata.commands) {
      const commandFile = path.join(commandsDir, `${command.name}.md`);

      if (fs.existsSync(commandFile)) {
        command.prompt = fs.readFileSync(commandFile, 'utf-8');
      }
    }
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
    return !!(
      metadata.id &&
      metadata.name &&
      metadata.version &&
      metadata.description &&
      metadata.commands &&
      Array.isArray(metadata.commands)
    );
  }

  /**
   * Get a plugin by ID
   */
  getPlugin(id: string): LoadedPlugin | undefined {
    return this.plugins.get(id);
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
      for (const command of plugin.metadata.commands) {
        const commandKey = `${plugin.metadata.id}:${command.name}`;
        commands.set(commandKey, { plugin, command });
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
