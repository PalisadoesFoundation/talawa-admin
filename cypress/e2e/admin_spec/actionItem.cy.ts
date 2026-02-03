import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
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

type GraphQLResponse = {
  status: number;
  body: unknown;
};

const requestTimeoutMs = 10000;

type EventsResponseShape = {
  data?: {
    organization?: {
      events?: {
        edges?: Array<{
          node?: {
            id?: string;
          };
        }>;
      };
    };
  };
};

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
 * Ensure an event volunteer exists for the first event in the organization.
 * @param orgId - Organization ID to seed volunteers for.
 * @returns Cypress.Chainable that resolves when a volunteer exists.
 */
const ensureVolunteerExistsForOrg = (
  orgId: string,
): Cypress.Chainable<void> => {
  const getEventsQuery = `
    query GetOrganizationEvents($id: String!, $first: Int) {
      organization(input: { id: $id }) {
        events(first: $first) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

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

  return getAuthToken().then((token) => {
    if (!token) {
      cy.log('Auth token not found; attempting volunteer seed via cookies.');
    }
    return requestGraphQL(token, {
      operationName: 'GetOrganizationEvents',
      query: getEventsQuery,
      variables: { id: orgId, first: 1 },
    }).then((eventsResponse) => {
      if (eventsResponse.status !== 200) {
        cy.log(
          `Skipping volunteer seed: events query failed with status ${eventsResponse.status}`,
        );
        return;
      }
      const eventsBody = eventsResponse.body as EventsResponseShape;
      const eventId =
        eventsBody?.data?.organization?.events?.edges?.[0]?.node?.id;

      if (!eventId) {
        cy.log(`Skipping volunteer seed: no events found for org ${orgId}.`);
        return;
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
        const volunteersBody =
          volunteersResponse.body as VolunteersResponseShape;
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
  });
};

describe('Admin Event Action Items Tab', () => {
  const dashboard = new AdminDashboardPage();
  const actionItemPage = new ActionItemPage();

  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    cy.url().then((url) => {
      const match = url.match(/\/admin\/orgdash\/([a-f0-9-]+)/);
      if (!match) return;
      return ensureVolunteerExistsForOrg(match[1]);
    });
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
  });
});
