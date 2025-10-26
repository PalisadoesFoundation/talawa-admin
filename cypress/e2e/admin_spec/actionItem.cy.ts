import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { ActionItemPage } from '../../pageObjects/AdminPortal/ActionItemPage';

describe('Admin Action Items Tab', () => {
  const dashboard = new AdminDashboardPage();
  const actionItemPage = new ActionItemPage();

  beforeEach(() => {
    cy.intercept('POST', Cypress.env('GRAPHQL_URL') ?? '**/graphql', (req) => {
      const op = req.body?.operationName;

      if (op === 'getActionItems') {
        req.alias = 'getActionItems';
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
        return;
      }

      if (op === 'createActionItem') {
        req.alias = 'createActionItem';
        req.reply({
          data: {
            createActionItem: {
              id: '1',
              title: 'Action Category 3',
              assignee: 'administrator',
            },
          },
        });
        return;
      }

      if (op === 'updateActionItem') {
        req.alias = 'updateActionItem';
        req.reply({
          data: {
            updateActionItem: {
              id: '1',
              title: 'Updated notes for this action item',
            },
          },
        });
        return;
      }

      if (op === 'deleteActionItem') {
        req.alias = 'deleteActionItem';
        req.reply({ data: { deleteActionItem: true } });
        return;
      }

      req.continue();
    }).as('graphql');

    cy.loginByApi('admin').then(() => {
      cy.log('Visiting Admin Dashboard');
      dashboard.visit().verifyOnDashboard().openFirstOrganization();
      actionItemPage.visitActionItemsTab();

      cy.get('[data-testid="sort"]', { timeout: 20000 }).should('exist');
      cy.wait('@getActionItems');
      cy.get('[data-testid="sort"]', { timeout: 20000 }).should('exist');
    });
  });

  it('creates a new action item and updates it', () => {
    cy.get('[data-cy="createActionItemBtn"]', { timeout: 30000 })
      .should('be.visible')
      .click();
    cy.wait('@createActionItem');
    actionItemPage
      .createActionItem('Action Category 3', 'administrator')
      .sortByNewest()
      .editFirstActionItem('Updated notes for this action item');

    cy.get('[data-cy="actionItemTitle"]').should(
      'have.text',
      'Updated notes for this action item',
    );
  });

  it('views action item details and marks it as complete', () => {
    actionItemPage
      .sortByNewest()
      .viewFirstActionItemAndCloseModal()
      .markFirstActionItemAsComplete('Completion notes for this action item');

    cy.get('[data-cy="actionItemStatus"]').should(
      'have.attr',
      'data-status',
      'completed',
    );
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
