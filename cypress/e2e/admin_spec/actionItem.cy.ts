import { ActionItemPage } from '../../pageObjects/AdminPortal/ActionItemPage';

describe('Admin Event Action Items Tab', () => {
  const actionItemPage = new ActionItemPage();
  let orgId = '';
  let eventId = '';
  let actionItemCategoryName = '';
  let volunteerDisplayName = '';
  let adminEmail = '';
  let adminPassword = '';
  const userIds: string[] = [];

  before(() => {
    actionItemCategoryName = `E2E Action Category ${Date.now()}`;
    volunteerDisplayName = `E2E Volunteer ${Date.now()}`;

    cy.fixture('auth/credentials')
      .then((credentials) => {
        adminEmail =
          (Cypress.env('E2E_ADMIN_EMAIL') as string | undefined) ||
          credentials.admin.email;
        adminPassword =
          (Cypress.env('E2E_ADMIN_PASSWORD') as string | undefined) ||
          credentials.admin.password;
      })
      .then(() => cy.setupTestEnvironment({ auth: { role: 'admin' } }))
      .then(({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
        return cy.task('gqlSignIn', {
          apiUrl: Cypress.env('apiUrl') as string | undefined,
          email: adminEmail,
          password: adminPassword,
        });
      })
      .then(({ token }) => {
        return cy.task('createTestActionItemCategory', {
          apiUrl: Cypress.env('apiUrl') as string | undefined,
          token,
          input: {
            name: actionItemCategoryName,
            description: 'E2E Action Item Category',
            isDisabled: false,
            organizationId: orgId,
          },
        });
      })
      .then(() => {
        return cy.seedTestData('events', { orgId, auth: { role: 'admin' } });
      })
      .then(({ eventId: createdEventId }) => {
        eventId = createdEventId;
        return cy.seedTestData('volunteers', {
          eventId,
          user: {
            name: volunteerDisplayName,
          },
          auth: { role: 'admin' },
        });
      })
      .then(({ userId }) => {
        if (userId) {
          userIds.push(userId);
        }
      });
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.visit(`/admin/orgdash/${orgId}`);
    actionItemPage.visitEventActionItems(orgId, eventId);
  });

  it('creates a new action item with volunteer and updates it', () => {
    actionItemPage
      .createActionItemWithVolunteer(
        actionItemCategoryName,
        volunteerDisplayName,
      )
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
      cy.cleanupTestOrganization(orgId, { userIds });
    }
  });
});
