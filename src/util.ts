import chalk from 'chalk';
import debug from 'debug';

export const log = debug('mdmod');

export function warning(message: string) {
  process.stderr.write(chalk.yellow('Warning: ' + message + '\n'));
}
