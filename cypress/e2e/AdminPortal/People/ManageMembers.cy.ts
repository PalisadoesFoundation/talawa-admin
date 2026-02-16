import { MemberManagementPage } from '../../../pageObjects/AdminPortal/MemberManagementPage';

type SeededUser = { name: string; userId?: string };

const memberManagementPage = new MemberManagementPage();

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
    memberManagementPage.openFromDrawer();
  });

  it('should search a particular member and then reset to all members', () => {
    memberManagementPage
      .searchMemberByName(wiltShepherd.name)
      .verifyMemberInList(wiltShepherd.name);
    memberManagementPage.resetSearch();
    memberManagementPage.verifyMemberInList(wiltShepherd.name).verifyMinRows(2);
    // Verify that at least 2 members appear (Wilt + the admin who created the org).
    // We avoid hard-coding the admin's display name because it depends on CI seed data.
  });

  it('add an existing member to the organization', () => {
    const member = praiseNorris.name;
    memberManagementPage.clickAddExistingMember();
    memberManagementPage.searchAndSelectUser(member);
    memberManagementPage.confirmAddUser(member);
    memberManagementPage
      .getAlert()
      .should('be.visible')
      .and('contain.text', 'Member added Successfully');
    cy.reload();
    memberManagementPage.searchMemberByName(member).verifyMemberInList(member);
  });

  it('delete a member from the organization', () => {
    if (!praiseNorris.userId) {
      throw new Error('Expected praiseNorris.userId to be set before delete.');
    }

    cy.reload();
    memberManagementPage.deleteMember(praiseNorris.name);
    memberManagementPage
      .getAlert()
      .should('be.visible')
      .and('contain.text', 'The Member is removed');
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
