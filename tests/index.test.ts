import execa from 'execa';

const { bin, version } = require('../package.json');

async function run(...flags: string[]) {
  const { stdout } = await execa(bin, flags);
  return stdout;
}

it('version', async () => {
  const stdout = await run('--version');
  expect(stdout).toContain(version);
});
