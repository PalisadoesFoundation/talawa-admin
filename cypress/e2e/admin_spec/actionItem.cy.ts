import { ActionItemPage } from '../../pageObjects/AdminPortal/ActionItemPage';

describe('Admin Event Action Items Tab', () => {
  const actionItemPage = new ActionItemPage();
  let orgId = '';
  const userIds: string[] = [];

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } })
      .then(({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
        return cy.seedTestData('events', { orgId, auth: { role: 'admin' } });
      })
      .then(({ eventId }) => {
        return cy.seedTestData('volunteers', {
          eventId,
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
      cy.cleanupTestOrganization(orgId, { userIds });
    }
  });
});
