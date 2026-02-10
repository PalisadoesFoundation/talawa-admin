import { ActionItemPage } from '../../pageObjects/AdminPortal/ActionItemPage';

/**
 * Retrieve the auth token from localStorage.
 * @returns Cypress.Chainable of string or null if missing/invalid.
 */
const getAuthToken = (): Cypress.Chainable<string | null> => {
  return cy.window().then((win) => {
    const rawToken = win.localStorage.getItem('Talawa-admin_token');
    if (!rawToken) return null;
    try {
      return JSON.parse(rawToken) as string;
    } catch {
      cy.log('Failed to parse Talawa-admin_token from localStorage');
      return null;
    }
  });
};

const resolveCredentials = (
  role: 'admin',
): Cypress.Chainable<{ email: string; password: string }> => {
  const envEmail = Cypress.env('E2E_ADMIN_EMAIL') as string | undefined;
  const envPassword = Cypress.env('E2E_ADMIN_PASSWORD') as string | undefined;
  if (envEmail && envPassword) {
    return cy.wrap({ email: envEmail, password: envPassword });
  }
  return cy
    .fixture('auth/credentials')
    .then(
      (credentials: Record<string, { email: string; password: string }>) => {
        const user = credentials[role];
        if (!user) {
          throw new Error(
            `User role "${role}" not found in auth/credentials fixture`,
          );
        }
        return user;
      },
    );
};

type GraphQLResponse = {
  status: number;
  body: unknown;
};

const requestTimeoutMs = 10000;

type VolunteersResponseShape = {
  data?: {
    event?: {
      volunteers?: Array<{
        id?: string;
      }>;
    };
  };
};

type CurrentUserResponseShape = {
  data?: {
    user?: {
      id?: string;
    };
  };
};

/**
 * Execute a GraphQL operation using window.fetch so browser cookies apply.
 * @param token - Optional auth token for the request.
 * @param body - GraphQL operation payload.
 * @returns Cypress.Chainable response for assertions.
 */
const requestGraphQL = (
  token: string | null,
  body: Record<string, unknown>,
): Cypress.Chainable<GraphQLResponse> => {
  return cy.window({ timeout: requestTimeoutMs + 5000 }).then((win) => {
    const apiBase =
      (Cypress.env('apiUrl') as string | undefined) ||
      (Cypress.env('API_URL') as string | undefined) ||
      (Cypress.env('CYPRESS_API_URL') as string | undefined) ||
      win.location.origin;
    const requestUrl = apiBase.endsWith('/graphql')
      ? apiBase
      : new URL('/graphql', apiBase).toString();
    const operationName =
      typeof body.operationName === 'string'
        ? body.operationName
        : 'UnknownOperation';
    const controller = new AbortController();
    const timeoutId = win.setTimeout(
      () => controller.abort(),
      requestTimeoutMs,
    );
    return win
      .fetch(requestUrl, {
        method: 'POST',
        signal: controller.signal,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })
      .then(async (response) => ({
        status: response.status,
        body: await response.json(),
      }))
      .catch((error) => {
        cy.log(`GraphQL request "${operationName}" failed: ${String(error)}`);
        return {
          status: 0,
          body: { errors: [{ message: String(error) }] },
        };
      })
      .finally(() => {
        win.clearTimeout(timeoutId);
      });
  });
};

/**
 * Ensure an event volunteer exists for the provided event id.
 * @param eventId - Event ID to seed volunteers for.
 * @returns Cypress.Chainable that resolves when a volunteer exists.
 */
const ensureVolunteerExistsForEvent = (
  eventId: string,
): Cypress.Chainable<void> => {
  const getVolunteersQuery = `
    query GetEventVolunteers($input: QueryEventInput!, $where: EventVolunteerWhereInput!) {
      event(input: $input) {
        volunteers(where: $where) {
          id
        }
      }
    }
  `;

  const currentUserQuery = `
    query CurrentUser {
      user: currentUser {
        id
      }
    }
  `;

  const createVolunteerMutation = `
    mutation CreateEventVolunteer($data: EventVolunteerInput!) {
      createEventVolunteer(data: $data) {
        id
      }
    }
  `;

  if (!eventId) {
    cy.log('Skipping volunteer seed: event id is missing.');
    return cy.wrap(undefined);
  }

  return getAuthToken().then((token) => {
    if (!token) {
      cy.log('Auth token not found; attempting volunteer seed via cookies.');
    }
    return requestGraphQL(token, {
      operationName: 'GetEventVolunteers',
      query: getVolunteersQuery,
      variables: { input: { id: eventId }, where: {} },
    }).then((volunteersResponse) => {
      if (volunteersResponse.status !== 200) {
        cy.log(
          `Skipping volunteer seed: volunteers query failed with status ${volunteersResponse.status}`,
        );
        return;
      }
      const volunteersBody = volunteersResponse.body as VolunteersResponseShape;
      const volunteers = volunteersBody?.data?.event?.volunteers;
      if (Array.isArray(volunteers) && volunteers.length > 0) return;

      return requestGraphQL(token, {
        operationName: 'CurrentUser',
        query: currentUserQuery,
        variables: {},
      }).then((userResponse) => {
        if (userResponse.status !== 200) {
          cy.log(
            `Skipping volunteer seed: current user query failed with status ${userResponse.status}`,
          );
          return;
        }
        const userBody = userResponse.body as CurrentUserResponseShape;
        const userId = userBody?.data?.user?.id;
        if (!userId) {
          cy.log('Skipping volunteer seed: current user not found.');
          return;
        }

        return requestGraphQL(token, {
          operationName: 'CreateEventVolunteer',
          query: createVolunteerMutation,
          variables: { data: { eventId, userId } },
        }).then(() => undefined);
      });
    });
  });
};

describe('Admin Event Action Items Tab', () => {
  const actionItemPage = new ActionItemPage();
  let orgId = '';
  let eventId = '';

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } }).then(
      ({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
        return resolveCredentials('admin').then((credentials) => {
          return cy
            .task('gqlSignIn', {
              apiUrl: Cypress.env('apiUrl'),
              email: credentials.email,
              password: credentials.password,
            })
            .then((result) => {
              const { userId } = result as SignInTaskResult;
              if (!userId) {
                throw new Error(
                  'Unable to resolve admin userId for membership seeding.',
                );
              }
              return cy
                .createOrganizationMembership({
                  memberId: userId,
                  organizationId: orgId,
                  role: 'administrator',
                })
                .then(() => {
                  return cy
                    .seedTestData('events', {
                      orgId,
                      auth: { role: 'admin' },
                    })
                    .then(({ eventId: createdEventId }) => {
                      eventId = createdEventId;
                    });
                });
            });
        });
      },
    );
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.visit(`/admin/orgdash/${orgId}`);
    ensureVolunteerExistsForEvent(eventId);
    actionItemPage.visitEventActionItems();
  });

  it('creates a new action item with volunteer and updates it', () => {
    actionItemPage
      .createActionItemWithVolunteer('Action Category 3')
      .sortByNewest()
      .editFirstActionItem('Updated notes for this action item');
  });

  it('views action item details and marks it as complete', () => {
    actionItemPage
      .sortByNewest()
      .viewFirstActionItemAndCloseModal()
      .markFirstActionItemAsComplete('Completion notes for this action item');
  });

  it('deletes the created action item', () => {
    actionItemPage.sortByNewest().deleteFirstActionItem();
  });

  after(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    if (orgId) {
      cy.cleanupTestOrganization(orgId);
    }
  });
});
