import { PeoplePage } from '../../pageObjects/AdminPortal/PeoplePage';

const peoplePage = new PeoplePage();

describe('Admin People Tab', () => {
  let orgId = '';

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } }).then(
      ({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
      },
    );
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.visit(`/admin/orgdash/${orgId}`);
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
    const member = 'Praise Norris';
    peoplePage.clickAddExistingMember();
    peoplePage.searchAndSelectUser(member);
    peoplePage.confirmAddUser(member);
  });

  it('delete a member from the organization', () => {
    peoplePage.deleteMember('Praise Norris');
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
