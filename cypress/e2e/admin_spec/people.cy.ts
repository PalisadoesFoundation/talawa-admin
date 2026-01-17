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

  it('add and remove a member to maintain test isolation', () => {
    const member = 'Praise Norris';

    // Add member and verify it was added successfully
    peoplePage.clickAddExistingMember();
    peoplePage.searchAndSelectUser(member);
    peoplePage.confirmAddUser(member); // Already includes verification

    // Explicit sync point before deletion
    cy.then(() => {
      // Delete member and verify it was removed
      peoplePage.deleteMember(member); // Already includes success toast check
      peoplePage.resetSearch();
      peoplePage.verifyMemberNotInList(member);
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
