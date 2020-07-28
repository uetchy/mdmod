/// <reference path="../../jest.d.ts" />

it('replace', async () => {
  const run = createRunner(__dirname);
  const out = await run('input.md', '--dry-run', '--define.version', 'v1.0.0');
  expect(strip(out)).toBe(`Hello`);
});
