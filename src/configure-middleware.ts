// external dependencies
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

// functions
export function configureMiddleware(app: express.Application): void {
  // setup the body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 10000,
    limit: (1024 * 1024 * 50)
  }));

  // setup compression
  app.use(compression());

  // setup helmet to ensure security enhancements are in place
  app.use(helmet.noCache());
  app.use(helmet.frameguard({action: 'deny'}));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());

  // setup morgan for logging
  app.use(morgan('dev'));

  // setup cors policies
  app.use(cors());
}
