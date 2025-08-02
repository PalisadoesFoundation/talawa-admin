import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';

describe('Admin Event Tab', () => {
  const dashboard = new AdminDashboardPage();
  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    cy.get('[data-cy="leftDrawerButton-Events"]').should('be.visible').click();
    cy.url().should('match', /\/orgevents\/[a-f0-9-]+/);
  });

  it('create an event with all fields', () => {});
});
