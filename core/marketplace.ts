/**
 * Claude Code Plugins Marketplace - Marketplace Manager
 *
 * Main interface for the plugins marketplace
 */

import * as path from 'path';
import * as fs from 'fs';
import { PluginLoader, LoadedPlugin, CommandDefinition, CommandParameter } from './plugin-loader.js';

export interface MarketplaceConfig {
  version: string;
  pluginsDirectory: string;
  registryFile: string;
  autoLoad: boolean;
}

export interface PluginRegistry {
  version: string;
  plugins: {
    id: string;
    enabled: boolean;
    installedVersion: string;
  }[];
  lastUpdated: string;
}

export class Marketplace {
  private config: MarketplaceConfig;
  private pluginLoader: PluginLoader;
  private registry: PluginRegistry;

  constructor(marketplaceRoot: string) {
    this.config = {
      version: '1.0.0',
      pluginsDirectory: path.join(marketplaceRoot, 'plugins'),
      registryFile: path.join(marketplaceRoot, 'registry.json'),
      autoLoad: true
    };

    this.pluginLoader = new PluginLoader(this.config.pluginsDirectory);
    this.registry = this.loadRegistry();
  }

  /**
   * Initialize the marketplace
   */
  async initialize(): Promise<void> {
    console.log('Initializing Claude Code Plugins Marketplace...');

    if (this.config.autoLoad) {
      await this.loadPlugins();
    }

    this.updateRegistry();
    console.log(`Loaded ${this.pluginLoader.getAllPlugins().length} plugins`);
  }

  /**
   * Load all plugins
   */
  async loadPlugins(): Promise<LoadedPlugin[]> {
    return await this.pluginLoader.loadAllPlugins();
  }

  /**
   * Get all available slash commands
   */
  getSlashCommands(): Map<string, { plugin: LoadedPlugin; command: CommandDefinition }> {
    return this.pluginLoader.getAllCommands();
  }

  /**
   * Execute a slash command
   */
  executeCommand(commandName: string, args?: any[]): string {
    const commands = this.getSlashCommands();
    const commandEntry = commands.get(commandName);

    if (!commandEntry) {
      throw new Error(`Command not found: ${commandName}`);
    }

    if (!commandEntry.plugin.enabled) {
      throw new Error(`Plugin ${commandEntry.plugin.metadata.name} is disabled`);
    }

    // Return the command prompt (in real implementation, this would be processed)
    let prompt = commandEntry.command.prompt;

    // Simple parameter substitution
    if (args && commandEntry.command.parameters) {
      commandEntry.command.parameters.forEach((param: CommandParameter, index: number) => {
        const value = args[index] ?? param.default ?? '';
        prompt = prompt.replace(new RegExp(`\\{\\{${param.name}\\}\\}`, 'g'), String(value));
      });
    }

    return prompt;
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id: string): LoadedPlugin | undefined {
    return this.pluginLoader.getPlugin(id);
  }

  /**
   * List all plugins
   */
  listPlugins(): LoadedPlugin[] {
    return this.pluginLoader.getAllPlugins();
  }

  /**
   * Enable/disable a plugin
   */
  setPluginEnabled(id: string, enabled: boolean): boolean {
    const result = this.pluginLoader.setPluginEnabled(id, enabled);
    if (result) {
      this.updateRegistry();
    }
    return result;
  }

  /**
   * Load registry from file
   */
  private loadRegistry(): PluginRegistry {
    if (fs.existsSync(this.config.registryFile)) {
      return JSON.parse(fs.readFileSync(this.config.registryFile, 'utf-8'));
    }

    return {
      version: '1.0.0',
      plugins: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Update registry with current plugin state
   */
  private updateRegistry(): void {
    const plugins = this.pluginLoader.getAllPlugins();

    this.registry = {
      version: this.config.version,
      plugins: plugins.map((plugin: LoadedPlugin) => ({
        id: plugin.metadata.name,
        enabled: plugin.enabled,
        installedVersion: plugin.metadata.version
      })),
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(
      this.config.registryFile,
      JSON.stringify(this.registry, null, 2),
      'utf-8'
    );
  }

  /**
   * Get marketplace statistics
   */
  getStats() {
    const plugins = this.pluginLoader.getAllPlugins();
    const commands = this.getSlashCommands();

    return {
      totalPlugins: plugins.length,
      enabledPlugins: plugins.filter((p: LoadedPlugin) => p.enabled).length,
      totalCommands: commands.size,
      version: this.config.version
    };
  }
}
