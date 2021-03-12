import { existsSync, readFileSync } from "fs";
import globby from "globby";
import { join, resolve, sep } from "path";
import { log } from "./util";

export interface Handler {
  (
    params: {
      document: string;
      fragment: string;
      constants: { [index: string]: unknown };
      cwd: string;
      args: { [index: string]: unknown };
    },
    constants?: any
  ): string | Promise<string>;
}

export type HandlerFactory = () => Handler | undefined;

export interface Plugin {
  name: string;
  handler: HandlerFactory;
}

function readPkg(pkgPath: string): any {
  return JSON.parse(readFileSync(pkgPath, "utf8"));
}

function stripPrefix(name: string): string {
  return name.replace(/^mdmod-plugin-/, "");
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

function makeHandlerFactory(dir: string): HandlerFactory {
  return () => {
    try {
      const mod = require(dir);
      return mod?.default ?? mod;
    } catch (err) {
      if (err.code !== "MODULE_NOT_FOUND") {
        throw err;
      }
      return undefined;
    }
  };
}

export class PluginManager {
  private plugins: Plugin[];

  private constructor(plugins: Plugin[]) {
    this.plugins = plugins;
  }

  static async initialize() {
    return new PluginManager(await PluginManager.lookup());
  }

  static async lookup(): Promise<Plugin[]> {
    const searchPaths = [
      ...new Set([
        ...collectUp(__dirname, "node_modules"),
        ...collectUp(process.cwd(), "node_modules"),
      ]),
    ];
    log("search", searchPaths);
    log("dirname", __dirname);
    if (searchPaths.length <= 0) {
      return [];
    }

    let pluginDirs: string[] = [];
    for (const searchPath of searchPaths) {
      const res = await globby(join(searchPath, "mdmod-plugin-*"), {
        onlyDirectories: true,
      });
      pluginDirs = [...res, ...pluginDirs];
    }
    log("pluginDirs", pluginDirs);

    const plugins = pluginDirs.map<Plugin>((dir: string) => {
      const { name } = readPkg(join(dir, "package.json"));
      return {
        name,
        handler: makeHandlerFactory(dir),
      };
    });
    log("plugins", plugins);

    return plugins;
  }

  find(
    name: string,
    { cwd = process.cwd() }: { cwd?: string } = {}
  ): Handler | undefined {
    // relative
    if (name?.startsWith(".")) {
      return makeHandlerFactory(resolve(cwd, name))();
    }

    // node_modules
    return this.plugins
      .find(
        (plugin) => plugin.name === name || stripPrefix(plugin.name) === name
      )
      ?.handler();
  }
}
