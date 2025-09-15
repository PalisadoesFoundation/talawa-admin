import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { ActionItemPage } from '../../pageObjects/AdminPortal/ActionItemPage';

describe('Admin Action Items Tab', () => {
  const dashboard = new AdminDashboardPage();
  const actionItemPage = new ActionItemPage();

  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    actionItemPage.visitActionItemsTab();
  });

  it('creates a new action item and updates it', () => {
    actionItemPage
      .createActionItem('Action Category 3', 'administrator')
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
