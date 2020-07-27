import execa from 'execa';
import { resolve } from 'path';
const { bin } = require('../../package.json');

async function run(...flags: string[]) {
  const script = resolve(__dirname, '..', '..', bin);
  const { stdout } = await execa(script, flags, {
    cwd: __dirname,
  });
  return stdout;
}

it('replace', async () => {
  const out = await run('input.md', '--dry-run', '--define.text', 'B');
  expect(out).toBe(`<!-- START mdmod {match: /A/g, replace: text} -->

B

<!-- END mdmod -->
`);
});
