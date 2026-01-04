// SKIP_LOCALSTORAGE_CHECK
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

      loginPage
        .verifyLoginPage()
        .login(userData.email, 'wrongpassword')
        .verifyErrorToast();
      cy.url().should('not.include', '/user/organizations');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('Talawa-admin_token')).to.eq(null);
      });
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
