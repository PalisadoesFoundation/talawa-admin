import { LoginPage } from '../../pageObjects/auth/LoginPage';

describe('Admin Login Functionality', () => {
  const rolesToTest = ['superAdmin', 'admin'];

  rolesToTest.forEach((role) => {
    it(`logs in as ${role}`, () => {
      cy.fixture('users').then((users) => {
        const userData = users[role];
        const loginPage = new LoginPage();

        cy.visit('/admin');
        loginPage.verifyLoginPage().login(userData.email, userData.password);

        cy.url().should('include', '/orglist');
      });
    });
  });

  rolesToTest.forEach((role) => {
    it(`fails to log in as ${role} with invalid credentials`, () => {
      cy.fixture('users').then((users) => {
        const userData = users[role];
        const loginPage = new LoginPage();

        cy.visit('/admin');
        loginPage.verifyLoginPage().login(userData.email, 'wrongpassword');
        cy.assertToast('Invalid email address or password.');
      });
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
