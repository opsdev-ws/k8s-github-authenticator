// external dependencies
import * as chalk from 'chalk';
import { config as configureEnvironmentVariables } from 'dotenv';
import * as express from 'express';
import * as _ from 'lodash';

// configure all of the environment variables that exist within the local .env file
// note: this should happen before we bring in any internal dependencies (in case they rely on
// something to be loaded)
configureEnvironmentVariables();

// internal dependencies
import { config } from './src/config';
import { configureMiddleware } from './src/configure-middleware';
import { log } from './src/log';
import { registerAuthenticationRoute } from './src/register-authentication-route';
import { registerCatchAll } from './src/register-catch-all';

// constants
const app: express.Application = express();
const port: number = _.toInteger(config.port);

// initialize the server and all of its dependencies
configureMiddleware(app);
registerAuthenticationRoute(app);
registerCatchAll(app);

// lastly, begin listening for requests
app.listen(port);
log(`Listening on port ${chalk.cyan(port)}...`);
