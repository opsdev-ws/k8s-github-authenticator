// external dependencies
import * as _ from 'lodash';

// internal dependencies
import { DEFAULT_CONFIGURATION } from './defaults';

// functions
export function loadConfiguration(dictionary: object = {}, environmentKeyPrefix: string = '',
  configuration: object = {}): object {
  let environmentKey;
  let value;

  _.each(_.keys(dictionary), (key: string): void => {
    environmentKey = environmentKeyPrefix + _.toUpper(key);
    value = dictionary[key];

    if (_.isObject(value)) {
      configuration[key] = loadConfiguration(value, `${environmentKey}_`, {});

      if (_.keys(configuration[key]).length === 0) {
        delete configuration[key];
      }

      return;
    }

    if (_.has(process.env, environmentKey)) {
      configuration[key] = process.env[environmentKey];
    }
  });

  return configuration;
}

export function loadConfigurationFromFile(filePath: string = '', prefix: string = ''): object {
  // tslint:disable-next-line no-require-imports
  const configuration = require(filePath);

  return _.merge({}, configuration, loadConfiguration(configuration, prefix, {}));
}

// constants
export const PREFIX: string = 'AUTHENTICATOR_';
export const config = _.merge({}, DEFAULT_CONFIGURATION, loadConfiguration(DEFAULT_CONFIGURATION, PREFIX, {}));
