// SKIP_LOCALSTORAGE_CHECK
import { LoginPage } from '../../pageObjects/auth/LoginPage';

describe('Admin Login Functionality', () => {
  const rolesToTest = ['superAdmin', 'admin'];

  rolesToTest.forEach((role) => {
    it(`logs in as ${role}`, () => {
      cy.fixture('auth/credentials').then((users) => {
        const userData = users[role];
        const loginPage = new LoginPage();

        cy.visit('/admin');
        loginPage.verifyLoginPage().login(userData.email, userData.password);

        cy.url().should('include', '/admin/orglist');
      });
    });
  });

  rolesToTest.forEach((role) => {
    it(`fails to log in as ${role} with invalid credentials`, () => {
      cy.fixture('auth/credentials').then((users) => {
        const userData = users[role];
        const loginPage = new LoginPage();

        cy.visit('/admin');
        loginPage
          .verifyLoginPage()
          .login(userData.email, 'wrongpassword')
          .verifyErrorToast();
        cy.url().should('include', '/admin');
        cy.window().then((win) => {
          expect(win.localStorage.getItem('Talawa-admin_token')).to.eq(null);
        });
      });
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});

describe('User Login Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('User Login', () => {
    cy.fixture('auth/credentials').then((users) => {
      const userData = users['user'];
      const loginPage = new LoginPage();

      loginPage.verifyLoginPage().login(userData.email, userData.password);
      cy.url().should('include', '/user/organizations');
    });
  });

  it('User Login with Invalid Credentials', () => {
    cy.fixture('auth/credentials').then((users) => {
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
