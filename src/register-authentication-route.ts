/*
For official information on the Webhook Token Authentication, please visit:
https://kubernetes.io/docs/admin/authentication/#webhook-token-authentication

For official information on the user-facing roles within the system, please visit:
https://kubernetes.io/docs/admin/authorization/rbac/#user-facing-roles

For official information on creating cluster role bindings, please visit:
https://kubernetes.io/docs/admin/authorization/rbac/#kubectl-create-clusterrolebinding
*/

// external dependencies
import * as express from 'express';
import * as _ from 'lodash';

// internal dependencies
import { config } from './config';
import { getGitHubUserByToken } from './github';

// interfaces
export interface AuthenticatedUserData {
  username: string;
  uid: string;
  groups: Array<string>;
}

export interface StatusObject {
  authenticated: boolean;
  user?: AuthenticatedUserData;
}

export interface DefaultResponse {
  apiVersion: string;
  kind: string;
  status: StatusObject;
}

// constants
export const DEFAULT_RESPONSE: DefaultResponse = {
  apiVersion: 'authentication.k8s.io/v1beta1',
  kind: 'TokenReview',
  status: {
    authenticated: false
  }
};

export const ORGANIZATIONS: Array<string> = _.map(_.get(config, 'orgs', '').split(','), _.toLower);

// functions
export async function onAuthenticateRoute(request: express.Request, response: express.Response): Promise<any> {
  // pluck out the token
  const token: boolean|string = _.get(request, 'body.spec.token', false);

  // ensure we're dealing with a token
  if (!Boolean(token)) {
    return response.status(200).json(DEFAULT_RESPONSE);
  }

  // fetch the user's organizations with the token
  const userData: object = await getGitHubUserByToken(String(token));

  // ensure we got real data back
  if (!Boolean(userData)) {
    return response.status(200).json(DEFAULT_RESPONSE);
  }

  // check to see if the user is in one of the specified organizations
  let isAuthenticated: boolean = false;
  _.each(_.get(userData, 'orgs', []), (organization: string): void => {
    if (ORGANIZATIONS.includes(_.toLower(organization))) {
      isAuthenticated = true;
    }
  });

  // ensure the user is authenticated
  if (!Boolean(isAuthenticated)) {
    return response.status(200).json(DEFAULT_RESPONSE);
  }

  // extend the default response with the data necessary to authenticate the user
  const data = _.extend({}, DEFAULT_RESPONSE, {
    status: {
      authenticated: true,
      user: {
        username: _.get(userData, 'username', ''),
        uid: _.get(userData, 'id', '')
      }
    }
  });

  // last, return the successful authentication
  response.status(200).json(data);
}

export function registerAuthenticationRoute(app: express.Application): void {
  app.post('/authenticate', onAuthenticateRoute);
}
