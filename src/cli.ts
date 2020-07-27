#!/usr/bin/env node

import { cac } from 'cac';
import epicfail, { fail } from 'epicfail';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PluginManager } from './plugin';
import { parseRules } from './rule';

epicfail();

const { version } = require(join('..', 'package.json'));

async function transformMarkdown(filename: string, flags: any) {
  const { args } = flags;

  // plugin discovery
  const pluginManager = await new PluginManager().discovery();

  const md = readFileSync(filename, 'utf8');
  const newMd = md.replace(
    /<!-- START mdmod ([\w\W]+?) -->\n([\w\W]*?)\n?<!-- END mdmod -->\n/gm,
    (all, ruleString, content) => {
      const rules = parseRules(ruleString, args);

      // apply rules
      for (const rule of rules) {
        if (rule.use) {
          // plugin
          const plugin = pluginManager.find(rule.use);
          if (plugin) {
            content = plugin.handler({ document: md, all, content, args });
          }
        } else if (rule.replace) {
          // find and replace
          try {
            content = rule.match
              ? content.replace(rule.match, rule.replace)
              : rule.replace();
          } catch (err) {
            if (err instanceof ReferenceError) {
              fail(
                err.message +
                  '\n' +
                  `Did you forget to add "--args.<key> <value>" ?`,
                {
                  soft: true,
                },
              );
            }
            throw err;
          }
        }
      }

      return `<!-- START mdmod ${ruleString} -->\n${content}\n<!-- END mdmod -->\n`;
    },
  );

  writeFileSync(filename, newMd);
}

const cli = cac();
cli
  .command('<filename>')
  .option('--args', 'Key-value pair: --args.<key> <value>')
  .action(transformMarkdown);
cli.version(version);
cli.help();

try {
  cli.parse();
} catch (err) {
  if (err.name === 'CACError') {
    fail(err.message, { soft: true });
  }
  throw err;
}
