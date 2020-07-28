/// <reference path="../jest.d.ts" />

const { version } = require('../package.json');

it('version', async () => {
  const run = createRunner(__dirname);
  const stdout = await run('--version');
  expect(stdout).toContain(version);
});
