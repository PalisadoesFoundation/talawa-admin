import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { ActionItemPage } from '../../pageObjects/AdminPortal/ActionItemPage';

const getAuthToken = (): Cypress.Chainable<string | null> => {
  return cy.window().then((win) => {
    const rawToken = win.localStorage.getItem('Talawa-admin_token');
    return rawToken ? (JSON.parse(rawToken) as string) : null;
  });
};

const requestGraphQL = (
  token: string | null,
  body: Record<string, unknown>,
): Cypress.Chainable<Cypress.Response> => {
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
    return requestGraphQL(token, {
      operationName: 'GetOrganizationEvents',
      query: getEventsQuery,
      variables: { id: orgId, first: 1 },
    }).then((eventsResponse) => {
      const eventId =
        eventsResponse.body?.data?.organization?.events?.edges?.[0]?.node?.id;

      if (!eventId) return;

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
          if (!userId) return;

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
