import { LoginPage } from '../../pageObjects/auth/LoginPage';

describe('User Login Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // it('User Login', () => {
  //   cy.get('[data-cy="loginEmail"]').type('testsuperadmin@example.com');
  //   cy.get('[data-cy="loginPassword"]').type('Pass@123');
  //   cy.get('[data-cy="loginBtn"]').click();

  //   // Check if login was successful
  //   cy.url().should('include', '/user/organizations');
  //   // cy.contains('Welcome, testuser').should('be.visible')
  // });
  // it('User Login', () => {
  //   cy.fixture('users').then((users) => {
  //     const userData = users["user"];
  //     cy.get('[data-cy="loginEmail"]').type(userData.email);
  //     cy.get('[data-cy="loginPassword"]').type(userData.password);
  //     cy.get('[data-cy="loginBtn"]').click();
  //     // Check if login was successful
  //     cy.url().should('include', '/user/organizations');
  //     // cy.contains('Welcome, testuser').should('be.visible')
  //   })
  // });

  it('User Login', () => {
    cy.fixture('users').then((users) => {
      const userData = users['user'];
      const loginPage = new LoginPage();

      loginPage.verifyLoginPage().login(userData.email, userData.password);
      // Check if login was successful
      cy.url().should('include', '/user/organizations');
    });
  });
});
