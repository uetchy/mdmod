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
  const { define, dryRun } = flags;

  // plugin discovery
  const pluginManager = await new PluginManager().discovery();

  const md = readFileSync(filename, 'utf8');
  const newMd = md.replace(
    /<!-- START mdmod ([\w\W]+?) -->\n([\w\W]*?)\n?<!-- END mdmod -->\n/gm,
    (all, ruleString, content) => {
      const rules = parseRules(ruleString, define);

      // apply rules
      for (const rule of rules) {
        if (rule.use) {
          // plugin
          const plugin = pluginManager.find(rule.use);
          if (plugin) {
            content = plugin({ document: md, all, content, constants: define });
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
                  `Did you forget to add "--define.<key> <value>" ?`,
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

  if (dryRun) {
    console.log(newMd);
  } else {
    writeFileSync(filename, newMd);
  }
}

const cli = cac();
cli
  .command('<filename>')
  .option('--define.* <value>', 'Define constants in replace function')
  .option('--dry-run', 'Print result instead of overwriting input file', {
    default: false,
  })
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
