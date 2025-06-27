import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';

describe('Admin Dashboard', () => {
  const adminDashboard = new AdminDashboardPage();

  beforeEach(() => {
    cy.loginByApi('admin');
    adminDashboard.visit();
  });

  it('should display the admin organizations and visit Organization Dashboard', () => {
    adminDashboard.verifyOnDashboard().openFirstOrganization();
  });

  it('Admin Logout', () => {
    adminDashboard.logout();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
