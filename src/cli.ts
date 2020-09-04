#!/usr/bin/env node

import { cac } from "cac";
import epicfail, { log as epicLog } from "epicfail";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import replaceAsync from "string-replace-async";
import { PluginManager } from "./plugin";
import { parseRules } from "./rule";
import { log, warning } from "./util";

epicfail({
  assertExpected: (err) => err.name === "CACError",
});

const { version } = require(join("..", "package.json"));

function replacerFactory({
  constants,
  pluginManager,
  cwd,
  document,
}: {
  constants: { [index: string]: any };
  pluginManager: PluginManager;
  cwd: string;
  document: string;
}): (substring: string, ...args: any[]) => string | Promise<string> {
  return async (_, ruleString, fragment) => {
    // parse rules
    const rules = parseRules(ruleString, constants);

    // apply rules
    for (const rule of rules) {
      if (rule.use) {
        // call plugin
        const plugin = pluginManager.find(rule.use, {
          cwd,
        });
        log("plugin", plugin);
        if (plugin) {
          fragment = await Promise.resolve(
            plugin({
              document,
              fragment,
              constants,
              cwd,
            })
          );
        } else {
          warning(`plugin "${rule.use}" cannot be found.`);
        }
      } else if (rule.replace) {
        // find and replace
        const replacer =
          typeof rule.replace === "string"
            ? () => rule.replace as string
            : rule.replace;

        if (rule.match) {
          fragment = await replaceAsync(fragment, rule.match, replacer);
        } else {
          fragment = await Promise.resolve(replacer());
        }
      }
    }

    return `<!-- START mdmod ${ruleString} -->\n${fragment}\n<!-- END mdmod -->\n`;
  };
}

async function transformMarkdown(filename: string, flags: any) {
  const { define: constants, dryRun } = flags;
  const cwd = dirname(filename);

  // plugin discovery
  const pluginManager = await PluginManager.initialize();

  const document = readFileSync(filename, "utf8");

  const newMd = await replaceAsync(
    document,
    /<!-- START mdmod ([\w\W]+?) -->\n([\w\W]*?)\n?<!-- END mdmod -->\n/gm,
    replacerFactory({
      cwd,
      document,
      constants,
      pluginManager,
    })
  );

  if (dryRun) {
    console.log(newMd);
  } else {
    writeFileSync(filename, newMd);
  }
}

const cli = cac();
cli
  .command("<filename>")
  .option("--define.* <value>", "Define constants in replace function")
  .option("--dry-run", "Print result instead of overwriting input file", {
    default: false,
  })
  .action(transformMarkdown);
cli.version(version);
cli.help();

cli.parse();
