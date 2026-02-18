import { MemberManagementPage } from '../../../pageObjects/AdminPortal/MemberManagementPage';
import { OrganizationSettingsPage } from '../../../pageObjects/AdminPortal/OrganizationSettingsPage';
import {
  OrganizationSetupPage,
  type CreateOrganizationInput,
} from '../../../pageObjects/AdminPortal/OrganizationSetupPage';

const clearTestState = () => {
  cy.clearAllGraphQLMocks();
  cy.clearCookies();
  cy.clearLocalStorage();
};

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
    clearTestState();
  });

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId, { userIds, allowNotFound: true });
    }
  });

  it('creates, configures, applies branding input, and invites members', () => {
    const uniqueSuffix = Date.now();
    const orgName = `E2E Setup Org ${uniqueSuffix}`;
    const updatedOrgName = `${orgName} Updated`;
    const updatedDescription = 'Updated from Cypress organization setup flow';
    const updatedLocation = 'Updated Cypress Street';
    const inviteeName = `E2E Invitee ${uniqueSuffix}`;
    const createOrganizationInput: CreateOrganizationInput = {
      name: orgName,
      description: 'Created from Cypress organization setup flow',
      countryCode: 'us',
      state: 'California',
      city: 'San Francisco',
      addressLine1: '123 Cypress Ave',
      postalCode: '94105',
    };

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

    setupPage
      .openCreateOrganizationModal()
      .fillCreateOrganizationForm(createOrganizationInput)
      .submitCreateOrganizationForm();

    cy.waitForGraphQLOperation('CreateOrganizationMembership')
      .its('response.statusCode')
      .should('eq', 200);

    setupPage
      .closePluginNotificationIfOpen()
      .openOrganizationDashboardByName(orgName);

    cy.url().then((currentUrl) => {
      const createdOrgId = currentUrl.match(
        /\/admin\/orgdash\/([a-f0-9-]+)/,
      )?.[1];
      expect(createdOrgId).to.be.a('string').and.not.equal('');
      if (!createdOrgId) {
        throw new Error(
          'Expected organization id in /admin/orgdash/:orgId URL',
        );
      }
      orgId = createdOrgId;
    });

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

    // Branding step: validate organization image input behavior.
    organizationSettingsPage
      .uploadDisplayImageFromFixture('advertisement_banner.png')
      .assertSelectedDisplayImage('advertisement_banner.png');

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

  it('shows an error for duplicate organization names', () => {
    const duplicateOrgName = `E2E Duplicate Org ${Date.now()}`;
    const duplicateOrganizationInput: CreateOrganizationInput = {
      name: duplicateOrgName,
      description: 'Conflict path validation',
      countryCode: 'us',
      state: 'California',
      city: 'San Francisco',
      addressLine1: '123 Conflict Ave',
      postalCode: '94105',
    };

    cy.mockGraphQLOperation('OrganizationFilterList', (req) => {
      req.continue();
    });
    cy.mockGraphQLOperation(
      'createOrganization',
      'api/graphql/createOrganization.error.conflict.json',
    );

    setupPage.visitOrgList();

    setupPage
      .openCreateOrganizationModal()
      .fillCreateOrganizationForm(duplicateOrganizationInput)
      .submitCreateOrganizationForm();
    cy.assertToast(/already exists/i);
  });
});

describe('Organization setup permissions', () => {
  const setupPage = new OrganizationSetupPage();

  afterEach(() => {
    clearTestState();
  });

  it('blocks regular users from admin organization setup routes', () => {
    cy.loginByApi('user');
    cy.visit('/admin/orglist');
    cy.url().should('include', '/admin/orglist');
    setupPage.assertPageNotFound().assertCreateOrganizationButtonNotVisible();
  });
});

describe('Organization switching workflow', () => {
  const setupPage = new OrganizationSetupPage();
  const uniqueSuffix = Date.now();
  const firstOrgName = `E2E Switch Org A ${uniqueSuffix}`;
  const secondOrgName = `E2E Switch Org B ${uniqueSuffix}`;
  let firstOrgId = '';
  let secondOrgId = '';

  before(() => {
    cy.setupTestEnvironment({
      orgName: firstOrgName,
      auth: { role: 'admin' },
    })
      .then(({ orgId }) => {
        firstOrgId = orgId;
        return cy.setupTestEnvironment({
          orgName: secondOrgName,
          auth: { role: 'admin' },
        });
      })
      .then(({ orgId }) => {
        secondOrgId = orgId;
      });
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.mockGraphQLOperation('OrganizationFilterList', (req) => {
      req.continue();
    });
  });

  afterEach(() => {
    clearTestState();
  });

  after(() => {
    if (firstOrgId) {
      cy.cleanupTestOrganization(firstOrgId, { allowNotFound: true });
    }
    if (secondOrgId) {
      cy.cleanupTestOrganization(secondOrgId, { allowNotFound: true });
    }
  });

  it('switches between organizations from the org list', () => {
    setupPage.visitOrgList();

    setupPage.openOrganizationDashboardByName(firstOrgName);
    cy.url().should('include', `/admin/orgdash/${firstOrgId}`);

    setupPage.visitOrgList();

    setupPage.openOrganizationDashboardByName(secondOrgName);
    cy.url().should('include', `/admin/orgdash/${secondOrgId}`);
  });
});
