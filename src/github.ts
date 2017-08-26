// external dependencies
import * as github from 'github';
import * as _ from 'lodash';

// interfaces
export interface GitHubUserData {
  id: string;
  username: string;
  orgs: Array<string>;
}

export interface GitHubOrganization {
  login: string;
}

// functions
export function getGitHubClientForToken(token: string): github {
  // create a new client
  const client: github = new github();

  // setup the authentication
  client.authenticate({
    type: 'oauth',
    token
  });

  // finally, return the client
  return client;
}

export async function getGitHubUserByToken(token: string): Promise<GitHubUserData> {
  const client: github = getGitHubClientForToken(token);
  const userData: Object = await client.users.get({});
  const orgData: Object = await client.users.getOrgs({
    per_page: 100
  });
  const orgs: Array<string> = [];

  // pluck out the organization logins (the slug)
  _.each(_.get(orgData, 'data', []), (organization: GitHubOrganization|string): void => {
    organization = _.get(organization, 'login', '');

    if (_.isEmpty(organization) || !_.isString(organization)) {
      return;
    }

    orgs.push(organization);
  });

  // finally, return all of the metadata about this user
  return {
    id: String(_.get(userData, 'data.id', '')),
    username: String(_.get(userData, 'data.login', '')),
    orgs
  };
}
