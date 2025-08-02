import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';

describe('Admin Dashboard', () => {
  const adminDashboard = new AdminDashboardPage();

  const goToOrgDashboard = () => {
    adminDashboard.verifyOnDashboard().openFirstOrganization();
  };

  beforeEach(() => {
    cy.loginByApi('admin');
    adminDashboard.visit();
  });

  it('should display the admin organizations and visit Organization Dashboard', () => {
    goToOrgDashboard();
  });

  it('should check for each option in the menu', () => {
    goToOrgDashboard();
    adminDashboard.verifyLeftDrawerOptions();
  });

  it('should logout of the Admin Dashboard', () => {
    adminDashboard.logout();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
