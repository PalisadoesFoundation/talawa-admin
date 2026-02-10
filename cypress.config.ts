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

  let json: GraphQLResponse<T>;
  try {
    json = (await response.clone().json()) as GraphQLResponse<T>;
  } catch (error) {
    let rawBody = '';
    try {
      rawBody = await response.text();
    } catch (readError) {
      const readMessage =
        readError instanceof Error ? readError.message : String(readError);
      rawBody = `Unable to read response body: ${readMessage}`;
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown JSON parse error';
    return {
      errors: [
        {
          message: `GraphQL response parse failed (${response.status} ${response.statusText}). ${rawBody || errorMessage}`,
        },
      ],
    };
  }
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
    }
  }
`;

const CREATE_ORGANIZATION_MEMBERSHIP_MUTATION = `
  mutation CreateOrganizationMembership(
    $input: MutationCreateOrganizationMembershipInput!
  ) {
    createOrganizationMembership(input: $input) {
      id
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

const CREATE_VOLUNTEER_MUTATION = `
  mutation CreateEventVolunteer($data: EventVolunteerInput!) {
    createEventVolunteer(data: $data) {
      id
    }
  }
`;

const CREATE_POST_MUTATION = `
  mutation CreatePost($input: MutationCreatePostInput!) {
    createPost(input: $input) {
      id
    }
  }
`;

const DELETE_ORGANIZATION_MUTATION = `
  mutation DeleteOrganization($input: MutationDeleteOrganizationInput!) {
    deleteOrganization(input: $input) {
      id
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
      E2E_ADMIN_EMAIL:
        process.env.E2E_ADMIN_EMAIL || process.env.CYPRESS_E2E_ADMIN_EMAIL,
      E2E_ADMIN_PASSWORD:
        process.env.E2E_ADMIN_PASSWORD ||
        process.env.CYPRESS_E2E_ADMIN_PASSWORD,
      E2E_SUPERADMIN_EMAIL:
        process.env.E2E_SUPERADMIN_EMAIL ||
        process.env.CYPRESS_E2E_SUPERADMIN_EMAIL,
      E2E_SUPERADMIN_PASSWORD:
        process.env.E2E_SUPERADMIN_PASSWORD ||
        process.env.CYPRESS_E2E_SUPERADMIN_PASSWORD,
      E2E_USER_EMAIL:
        process.env.E2E_USER_EMAIL || process.env.CYPRESS_E2E_USER_EMAIL,
      E2E_USER_PASSWORD:
        process.env.E2E_USER_PASSWORD || process.env.CYPRESS_E2E_USER_PASSWORD,
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      const runGraphQLTask = async <TData, TResult>({
        apiUrl,
        token,
        operationName,
        query,
        variables,
        extract,
        onErrors,
      }: {
        apiUrl?: string;
        token?: string;
        operationName: string;
        query: string;
        variables?: Record<string, unknown>;
        extract: (data: TData | undefined) => TResult;
        onErrors?: (errors: GraphQLError[]) => TResult | undefined;
      }): Promise<TResult> => {
        const resolvedApiUrl = resolveApiUrl(
          apiUrl || (config.env.apiUrl as string | undefined),
        );
        const response = await postGraphQL<TData>(resolvedApiUrl, token, {
          operationName,
          query,
          variables,
        });
        if (response.errors?.length) {
          const fallback = onErrors?.(response.errors);
          if (fallback !== undefined) {
            return fallback;
          }
          const errorMessage = response.errors
            .map((error) => error.message)
            .join(', ');
          throw new Error(`${operationName} failed: ${errorMessage}`);
        }
        return extract(response.data);
      };

      const isNotFoundError = (errors: GraphQLError[]): boolean => {
        return errors.some((error) => {
          const extensions = error.extensions ?? {};
          const code =
            typeof extensions.code === 'string' ? extensions.code : undefined;
          const classification =
            typeof extensions.classification === 'string'
              ? extensions.classification
              : undefined;
          const indicator =
            `${code ?? ''} ${classification ?? ''}`.toUpperCase();
          if (
            indicator.includes('NOT_FOUND') ||
            indicator.includes('NOT_EXISTS')
          ) {
            return true;
          }
          return /not found|does not exist|no such/i.test(error.message);
        });
      };
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
          return runGraphQLTask<
            {
              signIn?: {
                authenticationToken?: string;
                user?: { id?: string };
              };
            },
            { token: string; userId: string }
          >({
            apiUrl,
            operationName: 'SignIn',
            query: SIGN_IN_QUERY,
            variables: { email, password, recaptchaToken },
            extract: (data) => {
              const token = data?.signIn?.authenticationToken;
              const userId = data?.signIn?.user?.id;
              if (!token) {
                throw new Error(
                  'SignIn response missing authentication token.',
                );
              }
              if (!userId) {
                throw new Error('SignIn response missing userId.');
              }
              return { token, userId };
            },
          });
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
          return runGraphQLTask<
            { createOrganization?: { id?: string } },
            { orgId: string }
          >({
            apiUrl,
            token,
            operationName: 'CreateOrganization',
            query: CREATE_ORGANIZATION_MUTATION,
            variables: { input },
            extract: (data) => {
              const orgId = data?.createOrganization?.id;
              if (!orgId) {
                throw new Error('CreateOrganization response missing org id.');
              }
              return { orgId };
            },
          });
        },
        async createOrganizationMembership({
          apiUrl,
          token,
          input,
        }: {
          apiUrl?: string;
          token: string;
          input: Record<string, unknown>;
        }) {
          return runGraphQLTask<
            { createOrganizationMembership?: { id?: string } },
            { ok: boolean }
          >({
            apiUrl,
            token,
            operationName: 'CreateOrganizationMembership',
            query: CREATE_ORGANIZATION_MEMBERSHIP_MUTATION,
            variables: { input },
            extract: (data) => ({
              ok: Boolean(data?.createOrganizationMembership?.id),
            }),
            onErrors: (responseErrors) => {
              const errorMessage = responseErrors
                .map((error) => error.message)
                .join(', ');
              if (/already|exists/i.test(errorMessage)) {
                return { ok: true };
              }
              return undefined;
            },
          });
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
          return runGraphQLTask<
            { createEvent?: { id?: string } },
            { eventId: string }
          >({
            apiUrl,
            token,
            operationName: 'CreateEvent',
            query: CREATE_EVENT_MUTATION,
            variables: { input },
            extract: (data) => {
              const eventId = data?.createEvent?.id;
              if (!eventId) {
                throw new Error('CreateEvent response missing event id.');
              }
              return { eventId };
            },
          });
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
          return runGraphQLTask<
            {
              createUser?: {
                authenticationToken?: string;
                user?: { id?: string };
              };
            },
            { userId: string; authenticationToken?: string }
          >({
            apiUrl,
            token,
            operationName: 'CreateUser',
            query: CREATE_USER_MUTATION,
            variables: { input },
            extract: (data) => {
              const userId = data?.createUser?.user?.id;
              if (!userId) {
                throw new Error('CreateUser response missing user id.');
              }
              return {
                userId,
                authenticationToken: data?.createUser?.authenticationToken,
              };
            },
          });
        },
        async createTestVolunteer({
          apiUrl,
          token,
          input,
        }: {
          apiUrl?: string;
          token: string;
          input: Record<string, unknown>;
        }) {
          return runGraphQLTask<
            { createEventVolunteer?: { id?: string } },
            { volunteerId: string }
          >({
            apiUrl,
            token,
            operationName: 'CreateEventVolunteer',
            query: CREATE_VOLUNTEER_MUTATION,
            // CREATE_VOLUNTEER_MUTATION uses $data for CreateEventVolunteer, not $input.
            variables: { data: input },
            extract: (data) => {
              const volunteerId = data?.createEventVolunteer?.id;
              if (!volunteerId) {
                throw new Error('CreateEventVolunteer response missing id.');
              }
              return { volunteerId };
            },
          });
        },
        async createTestPost({
          apiUrl,
          token,
          input,
        }: {
          apiUrl?: string;
          token: string;
          input: Record<string, unknown>;
        }) {
          return runGraphQLTask<
            { createPost?: { id?: string } },
            { postId: string }
          >({
            apiUrl,
            token,
            operationName: 'CreatePost',
            query: CREATE_POST_MUTATION,
            variables: { input },
            extract: (data) => {
              const postId = data?.createPost?.id;
              if (!postId) {
                throw new Error('CreatePost response missing id.');
              }
              return { postId };
            },
          });
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
          return runGraphQLTask<
            { deleteOrganization?: { id?: string } },
            { ok: boolean }
          >({
            apiUrl,
            token,
            operationName: 'DeleteOrganization',
            query: DELETE_ORGANIZATION_MUTATION,
            variables: { input: { id: orgId } },
            extract: (data) => {
              const deletedId = data?.deleteOrganization?.id;
              return { ok: Boolean(deletedId) };
            },
            onErrors: (responseErrors) => {
              const errorMessage = responseErrors
                .map((error) => error.message)
                .join(', ');
              if (allowNotFound && isNotFoundError(responseErrors)) {
                return { ok: true };
              }
              if (allowNotFound) {
                console.warn(
                  `DeleteOrganization failed for ${orgId} with allowNotFound=true: ${errorMessage}`,
                );
              }
              return undefined;
            },
          });
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
          return runGraphQLTask<
            { deleteUser?: { id?: string } },
            { ok: boolean }
          >({
            apiUrl,
            token,
            operationName: 'DeleteUser',
            query: DELETE_USER_MUTATION,
            variables: { input: { id: userId } },
            extract: (data) => ({ ok: Boolean(data?.deleteUser?.id) }),
            onErrors: (responseErrors) => {
              const errorMessage = responseErrors
                .map((error) => error.message)
                .join(', ');
              if (allowNotFound && isNotFoundError(responseErrors)) {
                return { ok: true };
              }
              if (allowNotFound) {
                console.warn(
                  `DeleteUser failed for ${userId} with allowNotFound=true: ${errorMessage}`,
                );
              }
              return undefined;
            },
          });
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
