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

/**
 * Execute a GraphQL operation via cy.request.
 * @param token - Optional auth token for the request.
 * @param body - GraphQL operation payload.
 * @returns Cypress.Chainable response for assertions.
 */
const requestGraphQL = (
  token: string | null,
  body: Record<string, unknown>,
): Cypress.Chainable<Cypress.Response<unknown>> => {
  const apiUrl = Cypress.env('apiUrl') as string;
  return cy.request({
    method: 'POST',
    url: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body,
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
      throw new Error('Missing auth token while seeding event volunteers.');
    }
    return requestGraphQL(token, {
      operationName: 'GetOrganizationEvents',
      query: getEventsQuery,
      variables: { id: orgId, first: 1 },
    }).then((eventsResponse) => {
      const eventId =
        eventsResponse.body?.data?.organization?.events?.edges?.[0]?.node?.id;

      if (!eventId) {
        throw new Error(
          `No events found for org ${orgId}; cannot seed volunteer.`,
        );
      }

      return requestGraphQL(token, {
        operationName: 'GetEventVolunteers',
        query: getVolunteersQuery,
        variables: { input: { id: eventId }, where: {} },
      }).then((volunteersResponse) => {
        const volunteers = volunteersResponse.body?.data?.event?.volunteers;
        if (Array.isArray(volunteers) && volunteers.length > 0) return;

        return requestGraphQL(token, {
          operationName: 'CurrentUser',
          query: currentUserQuery,
          variables: {},
        }).then((userResponse) => {
          const userId = userResponse.body?.data?.user?.id;
          if (!userId) {
            throw new Error('Current user not found; cannot seed volunteer.');
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
