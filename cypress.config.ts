import { defineConfig } from 'cypress';
import fs from 'node:fs';
import { URL } from 'node:url';
import codeCoverageTask from '@cypress/code-coverage/task';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || '4321';
const DEFAULT_API_URL = 'http://localhost:4000/graphql';

type GraphQLError = { message: string; extensions?: Record<string, unknown> };
type GraphQLResponse<T> = { data?: T; errors?: GraphQLError[] };

const resolveApiUrl = (rawUrl?: string): string => {
  const baseUrl =
    rawUrl ||
    process.env.CYPRESS_API_URL ||
    process.env.API_URL ||
    DEFAULT_API_URL;
  if (!baseUrl) {
    throw new Error('Cypress API URL is not configured.');
  }
  if (baseUrl.endsWith('/graphql')) {
    return baseUrl;
  }
  return new URL('/graphql', baseUrl).toString();
};

const postGraphQL = async <T>(
  apiUrl: string,
  token: string | undefined,
  body: {
    operationName: string;
    query: string;
    variables?: Record<string, unknown>;
  },
): Promise<GraphQLResponse<T>> => {
  const fetcher = globalThis.fetch;
  if (!fetcher) {
    throw new Error('Global fetch is not available in this Node runtime.');
  }
  const response = await fetcher(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as GraphQLResponse<T>;
  if (!response.ok && !json.errors?.length) {
    return {
      errors: [
        {
          message: `GraphQL request failed (${response.status} ${response.statusText})`,
        },
      ],
    };
  }

  return json;
};

const SIGN_IN_QUERY = `
  query SignIn($email: EmailAddress!, $password: String!, $recaptchaToken: String) {
    signIn(
      input: {
        emailAddress: $email
        password: $password
        recaptchaToken: $recaptchaToken
      }
    ) {
      user { id }
      authenticationToken
    }
  }
`;

const CREATE_ORGANIZATION_MUTATION = `
  mutation CreateOrganization($input: MutationCreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      _id
    }
  }
`;

const CREATE_EVENT_MUTATION = `
  mutation CreateEvent($input: MutationCreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`;

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: MutationCreateUserInput!) {
    createUser(input: $input) {
      authenticationToken
      user { id }
    }
  }
`;

const DELETE_ORGANIZATION_MUTATION = `
  mutation DeleteOrganization($input: MutationDeleteOrganizationInput!) {
    deleteOrganization(input: $input) {
      id
      _id
    }
  }
`;

const DELETE_USER_MUTATION = `
  mutation DeleteUser($input: MutationDeleteUserInput!) {
    deleteUser(input: $input) {
      id
    }
  }
`;

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${PORT}`,

    // Viewport settings
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    defaultCommandTimeout: 50000,
    requestTimeout: 50000,
    responseTimeout: 50000,
    pageLoadTimeout: 50000,

    testIsolation: false, // Keep state between tests in same spec
    experimentalRunAllSpecs: true,

    watchForFileChanges: true,
    chromeWebSecurity: false,
    retries: {
      runMode: 3,
      openMode: 0,
    },

    // Environment variables
    env: {
      apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:4000/graphql',
      RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      // Custom task to log messages and read files
      on('task', {
        log(message: string) {
          console.log(message);
          return null;
        },
        readFileMaybe(filename: string) {
          return fs.existsSync(filename)
            ? fs.readFileSync(filename, 'utf8')
            : null;
        },
        async gqlSignIn({
          apiUrl,
          email,
          password,
          recaptchaToken,
        }: {
          apiUrl?: string;
          email: string;
          password: string;
          recaptchaToken?: string;
        }) {
          const resolvedApiUrl = resolveApiUrl(
            apiUrl || (config.env.apiUrl as string | undefined),
          );
          const response = await postGraphQL<{
            signIn?: { authenticationToken?: string; user?: { id?: string } };
          }>(resolvedApiUrl, undefined, {
            operationName: 'SignIn',
            query: SIGN_IN_QUERY,
            variables: { email, password, recaptchaToken },
          });
          if (response.errors?.length) {
            throw new Error(
              `SignIn failed: ${response.errors
                .map((error) => error.message)
                .join(', ')}`,
            );
          }
          const token = response.data?.signIn?.authenticationToken;
          const userId = response.data?.signIn?.user?.id;
          if (!token || !userId) {
            throw new Error('SignIn response missing authentication token.');
          }
          return { token, userId };
        },
        async createTestOrganization({
          apiUrl,
          token,
          input,
        }: {
          apiUrl?: string;
          token: string;
          input: Record<string, unknown>;
        }) {
          const resolvedApiUrl = resolveApiUrl(
            apiUrl || (config.env.apiUrl as string | undefined),
          );
          const response = await postGraphQL<{
            createOrganization?: { id?: string; _id?: string };
          }>(resolvedApiUrl, token, {
            operationName: 'CreateOrganization',
            query: CREATE_ORGANIZATION_MUTATION,
            variables: { input },
          });
          if (response.errors?.length) {
            throw new Error(
              `CreateOrganization failed: ${response.errors
                .map((error) => error.message)
                .join(', ')}`,
            );
          }
          const orgId =
            response.data?.createOrganization?.id ||
            response.data?.createOrganization?._id;
          if (!orgId) {
            throw new Error('CreateOrganization response missing org id.');
          }
          return { orgId };
        },
        async createTestEvent({
          apiUrl,
          token,
          input,
        }: {
          apiUrl?: string;
          token: string;
          input: Record<string, unknown>;
        }) {
          const resolvedApiUrl = resolveApiUrl(
            apiUrl || (config.env.apiUrl as string | undefined),
          );
          const response = await postGraphQL<{
            createEvent?: { id?: string };
          }>(resolvedApiUrl, token, {
            operationName: 'CreateEvent',
            query: CREATE_EVENT_MUTATION,
            variables: { input },
          });
          if (response.errors?.length) {
            throw new Error(
              `CreateEvent failed: ${response.errors
                .map((error) => error.message)
                .join(', ')}`,
            );
          }
          const eventId = response.data?.createEvent?.id;
          if (!eventId) {
            throw new Error('CreateEvent response missing event id.');
          }
          return { eventId };
        },
        async createTestUser({
          apiUrl,
          token,
          input,
        }: {
          apiUrl?: string;
          token: string;
          input: Record<string, unknown>;
        }) {
          const resolvedApiUrl = resolveApiUrl(
            apiUrl || (config.env.apiUrl as string | undefined),
          );
          const response = await postGraphQL<{
            createUser?: {
              authenticationToken?: string;
              user?: { id?: string };
            };
          }>(resolvedApiUrl, token, {
            operationName: 'CreateUser',
            query: CREATE_USER_MUTATION,
            variables: { input },
          });
          if (response.errors?.length) {
            throw new Error(
              `CreateUser failed: ${response.errors
                .map((error) => error.message)
                .join(', ')}`,
            );
          }
          const userId = response.data?.createUser?.user?.id;
          if (!userId) {
            throw new Error('CreateUser response missing user id.');
          }
          return {
            userId,
            authenticationToken: response.data?.createUser?.authenticationToken,
          };
        },
        async deleteTestOrganization({
          apiUrl,
          token,
          orgId,
          allowNotFound,
        }: {
          apiUrl?: string;
          token: string;
          orgId: string;
          allowNotFound?: boolean;
        }) {
          const resolvedApiUrl = resolveApiUrl(
            apiUrl || (config.env.apiUrl as string | undefined),
          );
          const response = await postGraphQL<{
            deleteOrganization?: { id?: string; _id?: string };
          }>(resolvedApiUrl, token, {
            operationName: 'DeleteOrganization',
            query: DELETE_ORGANIZATION_MUTATION,
            variables: { input: { id: orgId } },
          });
          if (response.errors?.length) {
            const errorMessage = response.errors
              .map((error) => error.message)
              .join(', ');
            if (allowNotFound && /not found/i.test(errorMessage)) {
              return { ok: true };
            }
            throw new Error(`DeleteOrganization failed: ${errorMessage}`);
          }
          const deletedId =
            response.data?.deleteOrganization?.id ||
            response.data?.deleteOrganization?._id;
          return { ok: Boolean(deletedId) };
        },
        async deleteTestUser({
          apiUrl,
          token,
          userId,
          allowNotFound,
        }: {
          apiUrl?: string;
          token: string;
          userId: string;
          allowNotFound?: boolean;
        }) {
          const resolvedApiUrl = resolveApiUrl(
            apiUrl || (config.env.apiUrl as string | undefined),
          );
          const response = await postGraphQL<{
            deleteUser?: { id?: string };
          }>(resolvedApiUrl, token, {
            operationName: 'DeleteUser',
            query: DELETE_USER_MUTATION,
            variables: { input: { id: userId } },
          });
          if (response.errors?.length) {
            const errorMessage = response.errors
              .map((error) => error.message)
              .join(', ');
            if (allowNotFound && /not found/i.test(errorMessage)) {
              return { ok: true };
            }
            throw new Error(`DeleteUser failed: ${errorMessage}`);
          }
          return { ok: Boolean(response.data?.deleteUser?.id) };
        },
      });

      // Browser launch options for both Chrome and Firefox
      on('before:browser:launch', (browser, launchOptions) => {
        // Chrome specific configurations
        if (browser.name === 'chrome') {
          if (browser.isHeadless) {
            launchOptions.args.push('--max_old_space_size=4096');
          }

          // Chrome performance optimizations
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
        }

        // Firefox specific configurations
        if (browser.name === 'firefox') {
          // Firefox preferences
          launchOptions.preferences = {
            ...launchOptions.preferences,
            'signon.rememberSignons': false,
            'browser.safebrowsing.enabled': false,
            'browser.safebrowsing.malware.enabled': false,
            'app.update.enabled': false,
            'browser.download.folderList': 2,
            'browser.download.manager.showWhenStarting': false,
            'browser.helperApps.neverAsk.saveToDisk':
              'application/pdf,text/csv,application/csv',
          };
          launchOptions.args = launchOptions.args || [];
        }

        return launchOptions;
      });

      // Custom plugins can be registered here
      // Example: require('@cypress/code-coverage/task')(on, config);

      return config;
    },
  },

  includeShadowDom: true,
  experimentalStudio: true,

  downloadsFolder: 'cypress/downloads',
  fixturesFolder: 'cypress/fixtures',
});
