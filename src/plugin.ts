// local node_modules/mdmod-plugin-*
// global node_modules/mdmod-plugin-*

import findUp from 'find-up';
import { readFileSync } from 'fs';
import globby from 'globby';
import { join } from 'path';

export interface Handler {
  (
    params: {
      document: string;
      all: string;
      content: string;
      args: any;
    },
    args?: any,
  ): string;
}

export interface Plugin {
  name: string;
  handler: Handler;
}

function readPkg(pkgPath: string): any {
  return JSON.parse(readFileSync(pkgPath, 'utf8'));
}

function stripPrefix(name: string): string {
  return name.replace(/^mdmod-plugin-/, '');
}

export class PluginManager {
  private plugins: Plugin[];

  constructor() {
    this.plugins = [];
  }

  async discovery() {
    const nodeModules = await findUp('node_modules', {
      type: 'directory',
      cwd: __dirname,
    });
    if (!nodeModules) return this;

    const dirs = await globby(join(nodeModules, 'mdmod-plugin-*'), {
      onlyDirectories: true,
    });
    const plugins = dirs.map<Plugin>((dir: string) => {
      const { name } = readPkg(join(dir, 'package.json'));
      return {
        name,
        handler: require(dir),
      };
    });
    this.plugins = plugins;

    return this;
  }

  find(name: string): Plugin | undefined {
    return this.plugins.find(
      (plugin) => plugin.name === name || stripPrefix(plugin.name) === name,
    );
  }
}
