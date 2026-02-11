import { PeoplePage } from '../../pageObjects/AdminPortal/PeoplePage';

type SeededUser = { name: string; userId?: string };

const peoplePage = new PeoplePage();

describe('Admin People Tab', () => {
  let orgId = '';
  const userIds: string[] = [];
  const wiltShepherd: SeededUser = { name: 'Wilt Shepherd' };
  const praiseNorris: SeededUser = { name: 'Praise Norris' };

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } })
      .then(({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
        return cy.createTestUser({ name: wiltShepherd.name });
      })
      .then(({ userId }) => {
        wiltShepherd.userId = userId;
        userIds.push(userId);
        return cy.createOrganizationMembership({
          memberId: userId,
          organizationId: orgId,
          role: 'regular',
        });
      })
      .then(() => cy.createTestUser({ name: praiseNorris.name }))
      .then(({ userId }) => {
        praiseNorris.userId = userId;
        userIds.push(userId);
      });
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.visit(`/admin/orgdash/${orgId}`);
    peoplePage.visitPeoplePage();
  });

  it('should search a particular member and then reset to all members', () => {
    peoplePage
      .searchMemberByName(wiltShepherd.name)
      .verifyMemberInList(wiltShepherd.name);
    peoplePage.resetSearch();
    peoplePage
      .verifyMemberInList(wiltShepherd.name)
      .verifyMemberInList('administrator');
  });

  it('add an existing member to the organization', () => {
    const member = praiseNorris.name;
    peoplePage.clickAddExistingMember();
    peoplePage.searchAndSelectUser(member);
    peoplePage.confirmAddUser(member);
  });

  it('delete a member from the organization', () => {
    peoplePage.clickAddExistingMember();
    peoplePage.searchAndSelectUser(praiseNorris.name);
    peoplePage.confirmAddUser(praiseNorris.name);
    peoplePage.deleteMember(praiseNorris.name);
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId, { userIds });
    }
  });
});
