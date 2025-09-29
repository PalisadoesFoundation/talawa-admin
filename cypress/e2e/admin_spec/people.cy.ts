import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { PeoplePage } from '../../pageObjects/AdminPortal/PeoplePage';

const dashboard = new AdminDashboardPage();
const peoplePage = new PeoplePage();

describe('Admin People Tab', () => {
  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    peoplePage.visitPeoplePage();
  });

  it('should search a particular member and then reset to all members', () => {
    peoplePage
      .searchMemberByName('Wilt Shepherd')
      .verifyMemberInList('Wilt Shepherd');
    peoplePage.resetSearch();
    peoplePage
      .verifyMemberInList('Wilt Shepherd')
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
