import { LoginPage } from '../../pageObjects/auth/LoginPage';

describe('User Login Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('User Login', () => {
    cy.fixture('users').then((users) => {
      const userData = users['user'];
      const loginPage = new LoginPage();

      loginPage.verifyLoginPage().login(userData.email, userData.password);
      // Check if login was successful
      cy.url().should('include', '/user/organizations');
    });
  });

  it('User Login with Invalid Credentials', () => {
    cy.fixture('users').then((users) => {
      const userData = users['user'];
      const loginPage = new LoginPage();

      loginPage.verifyLoginPage().login(userData.email, 'wrongpassword');
      cy.assertToast('Not found');
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
