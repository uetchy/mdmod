#!/usr/bin/env node

import { cac } from 'cac';
import epicfail, { fail } from 'epicfail';
import { readFileSync } from 'fs';
import { parseRules } from '.';

epicfail();

async function main(filename: string, flags: any) {
  const { args } = flags;

  const md = readFileSync(filename, 'utf8');
  const newMd = md.replace(
    /<!-- START mdmod ([\w\W]+?) -->\n([\w\W]+?)\n<!-- END mdmod -->\n/gm,
    (_, ruleString, content) => {
      const rules = parseRules(ruleString, args);

      // apply rules
      for (const rule of rules) {
        // plugin
        if (rule.use) {
        }

        // find and replace
        if (rule.replace) {
          content = rule.match
            ? content.replace(rule.match, rule.replace)
            : rule.replace();
        }
      }

      return `<!-- START mdmod ${ruleString} -->\n${content}\n<!-- END mdmod -->\n`;
    },
  );
  console.log('new', newMd);

  // TODO: writeFileSync(filename, newMd);
}

const cli = cac();
cli
  .command('<filename>')
  .option('--args <value>', 'Key-value pair')
  .action(main);
cli.version('0.0.0');
cli.help();

try {
  cli.parse();
} catch (err) {
  if (err.name === 'CACError') {
    fail(err.message, { soft: true });
  }
  throw err;
}
