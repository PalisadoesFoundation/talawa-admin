/// <reference types="cypress" />

import { LeftDrawer } from '../../pageObjects/AdminPortal/LeftDrawer';

describe('LeftDrawer CSS Tests', () => {
  const drawer = new LeftDrawer();
  let orgId = '';

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } }).then(
      ({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
      },
    );
  });

  beforeEach(() => {
    // Setup any necessary authentication or navigation
    cy.loginByApi('admin');
    drawer.checkBreakpoint(orgId);
  });

  it('profile container uses row under <1280px viewport', () => {
    drawer.checkRowViewport();
  });

  it('should check profileContainer styling when organization data is loaded', () => {
    drawer.checkProfileContainerStyling();
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
