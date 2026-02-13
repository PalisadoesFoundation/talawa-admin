import { ActionItemPage } from '../../pageObjects/AdminPortal/ActionItemPage';

describe('Admin Event Action Items Tab', () => {
  const actionItemPage = new ActionItemPage();
  let orgId = '';
  let eventId = '';
  let actionItemCategoryName = '';
  let volunteerDisplayName = '';
  const userIds: string[] = [];

  before(() => {
    actionItemCategoryName = `E2E Action Category ${Date.now()}`;
    volunteerDisplayName = `E2E Volunteer ${Date.now()}`;

    cy.setupTestEnvironment({ auth: { role: 'admin' } })
      .then(({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
        return cy.seedTestData('actionItemCategories', {
          orgId,
          name: actionItemCategoryName,
          description: 'E2E Action Item Category',
          isDisabled: false,
          auth: { role: 'admin' },
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

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId, { userIds });
    }
  });
});
