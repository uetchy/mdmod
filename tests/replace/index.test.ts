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
  const out = await run('input.md', '--dry-run', '--define.version', 'v1.0.0');
  expect(out).toBe(`<!-- START mdmod [
  {match: /v\\d\\.\\d\\.\\d/, replace: () => version}
] -->

v1.0.0

<!-- END mdmod -->
`);
});
