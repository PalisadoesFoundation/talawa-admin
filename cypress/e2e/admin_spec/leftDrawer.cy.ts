/// <reference types="cypress" />

import { LeftDrawer } from '../../pageObjects/AdminPortal/LeftDrawer';

describe('LeftDrawer CSS Tests', () => {
  const drawer = new LeftDrawer();

  beforeEach(() => {
    // Setup any necessary authentication or navigation
    cy.loginByApi('admin');
    drawer.checkBreakpoint();
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
});
