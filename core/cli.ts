#!/usr/bin/env node
/**
 * Claude Code Plugins Marketplace - CLI Interface
 *
 * Command-line interface for managing the marketplace
 */

import { Marketplace } from './marketplace.js';
import { LoadedPlugin, CommandDefinition, CommandParameter } from './plugin-loader.js';
import { fileURLToPath } from 'url';

export class MarketplaceCLI {
  private marketplace: Marketplace;

  constructor(marketplaceRoot?: string) {
    const root = marketplaceRoot || process.cwd();
    this.marketplace = new Marketplace(root);
  }

  /**
   * Initialize the CLI
   */
  async init(): Promise<void> {
    await this.marketplace.initialize();
  }

  /**
   * List all plugins
   */
  list(): void {
    const plugins = this.marketplace.listPlugins();

    console.log('\nInstalled Plugins:');
    console.log('═'.repeat(80));

    if (plugins.length === 0) {
      console.log('No plugins installed.');
      return;
    }

    plugins.forEach((plugin: LoadedPlugin) => {
      const status = plugin.enabled ? '✓' : '✗';
      console.log(`\n[${status}] ${plugin.metadata.name}`);
      console.log(`    Version: ${plugin.metadata.version}`);
      console.log(`    ${plugin.metadata.description}`);
      console.log(`    Commands: ${plugin.metadata.commands?.length || 0}`);

      if (plugin.metadata.commands && plugin.metadata.commands.length > 0) {
        plugin.metadata.commands.forEach((cmd: CommandDefinition) => {
          console.log(`      - /${plugin.metadata.name}:${cmd.name} - ${cmd.description}`);
        });
      }
    });

    console.log('\n' + '═'.repeat(80));
  }

  /**
   * List all slash commands
   */
  listCommands(): void {
    const commands = this.marketplace.getSlashCommands();

    console.log('\nAvailable Slash Commands:');
    console.log('═'.repeat(80));

    if (commands.size === 0) {
      console.log('No commands available.');
      return;
    }

    commands.forEach(({ plugin, command }: { plugin: LoadedPlugin; command: CommandDefinition }, commandKey: string) => {
      const status = plugin.enabled ? '✓' : '✗';
      console.log(`[${status}] /${commandKey}`);
      console.log(`    ${command.description}`);
      console.log(`    Plugin: ${plugin.metadata.name} v${plugin.metadata.version}`);

      if (command.parameters && command.parameters.length > 0) {
        console.log('    Parameters:');
        command.parameters.forEach((param: CommandParameter) => {
          const required = param.required ? 'required' : 'optional';
          console.log(`      - ${param.name} (${param.type}, ${required}): ${param.description}`);
        });
      }
      console.log('');
    });

    console.log('═'.repeat(80));
  }

  /**
   * Show marketplace statistics
   */
  stats(): void {
    const stats = this.marketplace.getStats();

    console.log('\nMarketplace Statistics:');
    console.log('═'.repeat(80));
    console.log(`Version:          ${stats.version}`);
    console.log(`Total Plugins:    ${stats.totalPlugins}`);
    console.log(`Enabled Plugins:  ${stats.enabledPlugins}`);
    console.log(`Total Commands:   ${stats.totalCommands}`);
    console.log('═'.repeat(80));
  }

  /**
   * Enable a plugin
   */
  enable(pluginId: string): void {
    if (this.marketplace.setPluginEnabled(pluginId, true)) {
      console.log(`✓ Plugin '${pluginId}' enabled`);
    } else {
      console.error(`✗ Plugin '${pluginId}' not found`);
    }
  }

  /**
   * Disable a plugin
   */
  disable(pluginId: string): void {
    if (this.marketplace.setPluginEnabled(pluginId, false)) {
      console.log(`✓ Plugin '${pluginId}' disabled`);
    } else {
      console.error(`✗ Plugin '${pluginId}' not found`);
    }
  }

  /**
   * Show plugin details
   */
  info(pluginName: string): void {
    const plugin = this.marketplace.getPlugin(pluginName);

    if (!plugin) {
      console.error(`✗ Plugin '${pluginName}' not found`);
      return;
    }

    console.log('\nPlugin Information:');
    console.log('═'.repeat(80));
    console.log(`Name:         ${plugin.metadata.name}`);
    console.log(`Version:      ${plugin.metadata.version}`);
    console.log(`Author:       ${plugin.metadata.author.name}`);
    console.log(`Description:  ${plugin.metadata.description}`);
    console.log(`Status:       ${plugin.enabled ? 'Enabled' : 'Disabled'}`);

    if (plugin.metadata.repository) {
      console.log(`Repository:   ${plugin.metadata.repository}`);
    }

    if (plugin.metadata.license) {
      console.log(`License:      ${plugin.metadata.license}`);
    }

    if (plugin.metadata.tags && plugin.metadata.tags.length > 0) {
      console.log(`Tags:         ${plugin.metadata.tags.join(', ')}`);
    }

    console.log(`\nCommands (${plugin.metadata.commands?.length || 0}):`);
    if (plugin.metadata.commands) {
      plugin.metadata.commands.forEach((cmd: CommandDefinition) => {
        console.log(`  /${plugin.metadata.name}:${cmd.name}`);
        console.log(`    ${cmd.description}`);
      });
    }

    console.log('═'.repeat(80));
  }

  /**
   * Execute a command (for testing)
   */
  execute(commandName: string, ...args: any[]): void {
    try {
      const prompt = this.marketplace.executeCommand(commandName, args);
      console.log('\nCommand Prompt:');
      console.log('═'.repeat(80));
      console.log(prompt);
      console.log('═'.repeat(80));
    } catch (error) {
      console.error(`✗ Error: ${(error as Error).message}`);
    }
  }
}

// CLI entry point - check if this module is being run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cli = new MarketplaceCLI();
  const args = process.argv.slice(2);
  const command = args[0];

  (async () => {
    await cli.init();

    switch (command) {
      case 'list':
        cli.list();
        break;
      case 'commands':
        cli.listCommands();
        break;
      case 'stats':
        cli.stats();
        break;
      case 'enable':
        if (args[1]) cli.enable(args[1]);
        else console.error('Usage: marketplace enable <plugin-id>');
        break;
      case 'disable':
        if (args[1]) cli.disable(args[1]);
        else console.error('Usage: marketplace disable <plugin-id>');
        break;
      case 'info':
        if (args[1]) cli.info(args[1]);
        else console.error('Usage: marketplace info <plugin-id>');
        break;
      case 'exec':
        if (args[1]) cli.execute(args[1], ...args.slice(2));
        else console.error('Usage: marketplace exec <command-name> [args...]');
        break;
      default:
        console.log('Claude Code Plugins Marketplace CLI\n');
        console.log('Usage: marketplace <command> [options]\n');
        console.log('Commands:');
        console.log('  list              List all installed plugins');
        console.log('  commands          List all available slash commands');
        console.log('  stats             Show marketplace statistics');
        console.log('  info <plugin-id>  Show detailed plugin information');
        console.log('  enable <plugin>   Enable a plugin');
        console.log('  disable <plugin>  Disable a plugin');
        console.log('  exec <command>    Execute a command (for testing)');
    }
  })();
}
