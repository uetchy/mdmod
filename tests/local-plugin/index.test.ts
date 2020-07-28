/// <reference path="../../jest.d.ts" />

it('local-plugin', async () => {
  const run = createRunner(__dirname);
  const out = await run('input.md', '--dry-run');
  expect(strip(out)).toBe(`Hello`);
});
