import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';

describe('Admin Dashboard', () => {
  const adminDashboard = new AdminDashboardPage();
  let orgId = '';

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } }).then(
      ({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
      },
    );
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.visit(`/admin/orgdash/${orgId}`);
  });

  it('should display the admin organizations and visit Organization Dashboard', () => {
    cy.url().should('match', /\/admin\/orgdash\/[a-f0-9-]+/);
  });

  it('should check for each option in the menu', () => {
    adminDashboard.verifyLeftDrawerOptions();
  });

  it('should logout of the Admin Dashboard', () => {
    adminDashboard.logout();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId);
    }
  });
});
