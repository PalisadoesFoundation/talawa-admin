import { MemberManagementPage } from '../../../pageObjects/AdminPortal/MemberManagementPage';
import { OrganizationSettingsPage } from '../../../pageObjects/AdminPortal/OrganizationSettingsPage';
import { OrganizationSetupPage } from '../../../pageObjects/AdminPortal/OrganizationSetupPage';

describe('Organization setup workflow', () => {
  const setupPage = new OrganizationSetupPage();
  const organizationSettingsPage = new OrganizationSettingsPage();
  const memberManagementPage = new MemberManagementPage();
  let orgId = '';
  const userIds: string[] = [];

  beforeEach(() => {
    cy.loginByApi('admin');
  });

  afterEach(() => {
    cy.clearAllGraphQLMocks();
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId, { userIds, allowNotFound: true });
    }
  });

  it('creates, configures, and invites members for an organization', () => {
    const uniqueSuffix = Date.now();
    const orgName = `E2E Setup Org ${uniqueSuffix}`;
    const updatedOrgName = `${orgName} Updated`;
    const updatedDescription = 'Updated from Cypress organization setup flow';
    const updatedLocation = 'Updated Cypress Street';
    const inviteeName = `E2E Invitee ${uniqueSuffix}`;

    cy.mockGraphQLOperation('OrganizationFilterList', (req) => {
      req.continue();
    });
    cy.mockGraphQLOperation('createOrganization', (req) => {
      req.continue();
    });
    cy.mockGraphQLOperation('CreateOrganizationMembership', (req) => {
      req.continue();
    });

    setupPage.visitOrgList();
    cy.waitForGraphQLOperation('OrganizationFilterList');

    setupPage
      .openCreateOrganizationModal()
      .fillCreateOrganizationForm({
        name: orgName,
        description: 'Created from Cypress organization setup flow',
        countryCode: 'us',
        state: 'California',
        city: 'San Francisco',
        addressLine1: '123 Cypress Ave',
        postalCode: '94105',
      })
      .submitCreateOrganizationForm();

    cy.waitForGraphQLOperation('createOrganization').then((interception) => {
      const createdOrgId = interception.response?.body?.data?.createOrganization
        ?.id as string | undefined;
      expect(createdOrgId).to.be.a('string').and.not.equal('');
      orgId = createdOrgId as string;
    });

    cy.waitForGraphQLOperation('CreateOrganizationMembership')
      .its('response.statusCode')
      .should('eq', 200);

    cy.waitForGraphQLOperation('OrganizationFilterList');

    setupPage
      .closePluginNotificationIfOpen()
      .openOrganizationDashboardByName(orgName);

    cy.mockGraphQLOperation('getOrganizationBasicData', (req) => {
      req.continue();
    });
    cy.mockGraphQLOperation('UpdateOrganization', (req) => {
      req.continue();
    });

    organizationSettingsPage.openFromDrawer().openGeneralTab();

    cy.waitForGraphQLOperation('getOrganizationBasicData')
      .its('response.statusCode')
      .should('eq', 200);

    organizationSettingsPage
      .updateOrganizationName(updatedOrgName)
      .updateOrganizationDescription(updatedDescription)
      .updateOrganizationLocation(updatedLocation)
      .toggleIsPublic()
      .saveChanges();

    cy.waitForGraphQLOperation('UpdateOrganization').then((interception) => {
      expect(interception.response?.body?.data?.updateOrganization?.name).to.eq(
        updatedOrgName,
      );
    });
    cy.assertToast(/updated/i);

    cy.createTestUser({ name: inviteeName }).then(({ userId }) => {
      userIds.push(userId);
    });

    cy.mockGraphQLOperation('allUsers', (req) => {
      req.continue();
    });

    memberManagementPage.openFromDrawer().clickAddExistingMember();
    cy.waitForGraphQLOperation('allUsers')
      .its('response.statusCode')
      .should('eq', 200);

    memberManagementPage.searchAndSelectUser(inviteeName);
    cy.waitForGraphQLOperation('allUsers')
      .its('response.statusCode')
      .should('eq', 200);

    memberManagementPage.confirmAddUser(inviteeName);

    cy.waitForGraphQLOperation('CreateOrganizationMembership')
      .its('response.statusCode')
      .should('eq', 200);

    memberManagementPage
      .getAlert()
      .should('be.visible')
      .and('contain.text', 'added');

    memberManagementPage
      .searchMemberByName(inviteeName)
      .verifyMemberInList(inviteeName);
  });
});
