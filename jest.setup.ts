/// <reference path="./jest.d.ts" />

import execa from 'execa';
import { resolve } from 'path';
const { bin } = require('./package.json');

global.createRunner = (basePath: string) => async (...flags: string[]) => {
  const script = resolve(__dirname, bin);
  const { stdout } = await execa(script, flags, {
    cwd: basePath,
  });
  return stdout;
};

global.strip = (str: string): string => {
  return str.replace(/\n?<!--[\w\W]+?-->\n?/g, '');
};
