import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { ActionItemPage } from '../../pageObjects/AdminPortal/ActionItemPage';

describe('Admin Action Items Tab', () => {
  const dashboard = new AdminDashboardPage();
  const actionItemPage = new ActionItemPage();

  beforeEach(() => {
    // Mock GraphQL endpoints to isolate UI behavior
    cy.intercept('POST', 'http://127.0.0.1:4000/graphql', (req) => {
      if (req.body.operationName === 'getActionItems') {
        req.reply({
          data: {
            actionItems: [
              {
                id: '1',
                title: 'Action Category 3',
                completed: false,
                assignee: 'administrator',
              },
            ],
          },
        });
      }
      if (req.body.operationName === 'createActionItem') {
        req.reply({
          data: {
            createActionItem: {
              id: '1',
              title: 'Action Category 3',
              assignee: 'administrator',
            },
          },
        });
      }
      if (req.body.operationName === 'updateActionItem') {
        req.reply({
          data: {
            updateActionItem: {
              id: '1',
              title: 'Updated notes for this action item',
            },
          },
        });
      }
      if (req.body.operationName === 'deleteActionItem') {
        req.reply({ data: { deleteActionItem: true } });
      }
    }).as('graphql');

    // Login and navigate
    cy.loginByApi('admin').then(() => {
      cy.log('Visiting Admin Dashboard');
      dashboard.visit().verifyOnDashboard().openFirstOrganization();
      actionItemPage.visitActionItemsTab();
      cy.get('[data-testid="sort"]', { timeout: 20000 }).should('exist');
    });
  });

  it('creates a new action item and updates it', () => {
    cy.get('[data-cy="createActionItemBtn"]', { timeout: 30000 })
      .should('be.visible')
      .click();

    actionItemPage
      .createActionItem('Action Category 3', 'administrator')
      .sortByNewest()
      .editFirstActionItem('Updated notes for this action item');

    cy.get('[data-cy="actionItemTitle"]').should('contain', 'Updated notes');
  });

  it('views action item details and marks it as complete', () => {
    actionItemPage
      .sortByNewest()
      .viewFirstActionItemAndCloseModal()
      .markFirstActionItemAsComplete('Completion notes for this action item');

    cy.get('[data-cy="actionItemStatus"]').should('contain', 'Completed');
  });

  it('deletes the created action item', () => {
    actionItemPage.sortByNewest().deleteFirstActionItem();
    cy.get('[data-cy="actionItemTitle"]').should('not.exist');
  });

  after(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
