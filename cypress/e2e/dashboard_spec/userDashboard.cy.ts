import { UserDashboardPage } from '../../pageObjects/UserPortal/UserDashboard';

describe('User Dashboard', () => {
  const dashboard = new UserDashboardPage();

  beforeEach(() => {
    cy.loginByApi('user');
    dashboard.visit();
  });

  it('should display the user organizations and visit Organization Dashboard', () => {
    dashboard.verifyOnDashboard().openFirstOrganization();
  });
});
