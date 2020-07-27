import debug from 'debug';
import { join } from 'path';

export const log = debug('mdmod');

export const MDMOD_ROOT = join(__dirname, '..');
