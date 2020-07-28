import debug from 'debug';
import chalk from 'chalk';

export const log = debug('mdmod');

export function warning(message: string) {
  process.stderr.write(chalk.yellow('Warning: ' + message + '\n'));
}
