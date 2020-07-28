/// <reference path="../../jest.d.ts" />

it('replace', async () => {
  const run = createRunner(__dirname);
  const out = await run('input.md', '--dry-run', '--define.text', 'B');
  expect(strip(out)).toBe(`
B
`);
});
