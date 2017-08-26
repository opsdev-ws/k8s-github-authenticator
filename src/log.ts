// external dependencies
import * as chalk from 'chalk';

// internal dependencies
// tslint:disable-next-line no-require-imports no-var-requires
const packageJson = require('../package.json');

// functions
export function log(...args): void {
  args.unshift(chalk.green(`[${packageJson.name}]:`));

  console.log.apply(console, args);
}
