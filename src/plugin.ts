import { existsSync, readFileSync } from 'fs';
import globby from 'globby';
import { join, resolve, sep } from 'path';
import { log } from './util';

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
  handler: () => Handler;
}

function readPkg(pkgPath: string): any {
  return JSON.parse(readFileSync(pkgPath, 'utf8'));
}

function stripPrefix(name: string): string {
  return name.replace(/^mdmod-plugin-/, '');
}

function applyUp(dir: string, fn: any) {
  const dirs = resolve(dir).split(sep);
  const res = [];
  while (dirs.length > 1) {
    const target = dirs.join(sep);
    const rv = fn(target);
    if (rv) res.push(rv);
    dirs.splice(-1);
  }
  return res;
}

function collectUp(dir: string, name: string) {
  return applyUp(dir, (path: string) => {
    const target = join(path, name);
    return existsSync(target) ? target : undefined;
  });
}

export class PluginManager {
  private plugins: Plugin[];

  constructor() {
    this.plugins = [];
  }

  async discovery() {
    const searchPaths = collectUp(__dirname, 'node_modules');
    log('search', searchPaths);
    log('dirname', __dirname);
    if (searchPaths.length <= 0) {
      return this;
    }

    let pluginDirs: string[] = [];
    for (const searchPath of searchPaths) {
      const res = await globby(join(searchPath, 'mdmod-plugin-*'), {
        onlyDirectories: true,
      });
      pluginDirs = [...res, ...pluginDirs];
    }
    log('pluginDirs', pluginDirs);

    const plugins = pluginDirs.map<Plugin>((dir: string) => {
      const { name } = readPkg(join(dir, 'package.json'));
      return {
        name,
        handler: () => require(dir),
      };
    });
    this.plugins = plugins;
    log('plugins', plugins);

    return this;
  }

  find(name: string): Handler | undefined {
    return this.plugins
      .find(
        (plugin) => plugin.name === name || stripPrefix(plugin.name) === name,
      )
      ?.handler();
  }
}
