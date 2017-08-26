// external dependencies
import * as express from 'express';

// functions
export function catchAll(request: express.Request, response: express.Response, next: express.NextFunction): void {
  response.status(404).end();
}

export function registerCatchAll(app: express.Application): void {
  app.use(catchAll);
}
