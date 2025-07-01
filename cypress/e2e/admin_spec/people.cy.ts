import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { PeoplePage } from '../../pageObjects/AdminPortal/PeoplePage';

const dashboard = new AdminDashboardPage();
const peoplePage = new PeoplePage();

describe('Admin People Tab', () => {
  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    cy.get('[data-cy="leftDrawerButton-People"]').should('be.visible').click();
    cy.url().should('match', /\/orgpeople\/[a-f0-9-]+/);
  });

  it('should search a particular member and then reset to all members', () => {
    peoplePage
      .searchMemberByName('Harve Lance')
      .verifyMemberInList('Harve Lance');
    peoplePage.resetSearch();
    peoplePage
      .verifyMemberInList('Harve Lance')
      .verifyMemberInList('administrator');
  });

  it('add an existing member to the organization', () => {
    peoplePage.clickAddExistingMember();
    peoplePage.searchAndSelectUser('Praise Norris');
    peoplePage.confirmAddUser();
  });

  it('delete a member from the organization', () => {
    peoplePage.deleteMember('Praise Norris');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
