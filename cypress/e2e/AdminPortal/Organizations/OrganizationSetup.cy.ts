import { MemberManagementPage } from '../../../pageObjects/AdminPortal/MemberManagementPage';
import { OrganizationSettingsPage } from '../../../pageObjects/AdminPortal/OrganizationSettingsPage';
import {
  OrganizationSetupPage,
  type CreateOrganizationInput,
} from '../../../pageObjects/AdminPortal/OrganizationSetupPage';
import { getApiPattern } from '../../../support/graphql-utils';

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
  const orgIdsToCleanup: string[] = [];
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
    if (orgIdsToCleanup.length > 0) {
      orgIdsToCleanup.forEach((id) => {
        cy.cleanupTestOrganization(id, { allowNotFound: true });
      });
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

    setupPage.visitOrgList();
    cy.intercept('POST', getApiPattern(), (req) => {
      const body = req.body as
        | {
            operationName?: string;
            query?: string;
            operations?: string | { operationName?: string; query?: string };
          }
        | undefined;
      let operationName = body?.operationName;
      let query = body?.query;

      if (!operationName && body?.operations) {
        try {
          const operationsPayload =
            typeof body.operations === 'string'
              ? (JSON.parse(body.operations) as {
                  operationName?: string;
                  query?: string;
                })
              : body.operations;
          operationName = operationsPayload.operationName;
          query = operationsPayload.query;
        } catch {
          operationName = body?.operationName;
          query = body?.query;
        }
      }

      if (
        operationName === 'createOrganization' ||
        operationName === 'CreateOrganization' ||
        query?.includes('createOrganization(')
      ) {
        req.alias = 'createOrganizationMutation';
      }
      req.continue();
    });
    cy.log('Phase: Create organization');

    setupPage
      .openCreateOrganizationModal()
      .fillCreateOrganizationForm(createOrganizationInput)
      .submitCreateOrganizationForm();

    cy.wait('@createOrganizationMutation', { timeout: 50000 }).then(
      (interception) => {
        const createdOrgId =
          interception.response?.body?.data?.createOrganization?.id;
        if (typeof createdOrgId !== 'string' || createdOrgId.length === 0) {
          throw new Error(
            'Expected createOrganization response with a valid organization id.',
          );
        }
        orgId = createdOrgId;
        setupPage.closePluginNotificationIfOpen();
        cy.visit(`/admin/orgdash/${orgId}`);
        cy.url().should('include', '/admin/orgdash/');
      },
    );

    cy.log('Phase: Update settings and branding');
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

    cy.log('Phase: Invite member');
    memberManagementPage.openFromDrawer().clickAddExistingMember();
    cy.waitForGraphQLOperation('allUsers')
      .its('response.statusCode')
      .should('eq', 200);

    memberManagementPage.searchAndSelectUser(inviteeName);
    cy.waitForGraphQLOperation('allUsers')
      .its('response.statusCode')
      .should('eq', 200);

    cy.mockGraphQLOperation('CreateOrganizationMembership', (req) => {
      req.continue();
    });
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

    cy.createTestOrganization({
      name: duplicateOrgName,
      description: 'Seed org to validate duplicate create handling',
    }).then(({ orgId: duplicateSeedOrgId }) => {
      orgIdsToCleanup.push(duplicateSeedOrgId);
    });

    setupPage.visitOrgList();

    setupPage
      .openCreateOrganizationModal()
      .fillCreateOrganizationForm(duplicateOrganizationInput)
      .submitCreateOrganizationForm();
    cy.assertToast(/organization name already exists/i);
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
  const orgIdsToCleanup: string[] = [];
  let firstOrgName = '';
  let secondOrgName = '';
  let firstOrgId = '';
  let secondOrgId = '';

  before(() => {
    const uniqueSuffix = Date.now();
    firstOrgName = `E2E Switch Org A ${uniqueSuffix}`;
    secondOrgName = `E2E Switch Org B ${uniqueSuffix}`;

    cy.setupTestEnvironment({
      orgName: firstOrgName,
      auth: { role: 'admin' },
    })
      .then(({ orgId }) => {
        firstOrgId = orgId;
        orgIdsToCleanup.push(orgId);
        return cy.setupTestEnvironment({
          orgName: secondOrgName,
          auth: { role: 'admin' },
        });
      })
      .then(({ orgId }) => {
        secondOrgId = orgId;
        orgIdsToCleanup.push(orgId);
      });
  });

  beforeEach(() => {
    cy.loginByApi('admin');
  });

  afterEach(() => {
    clearTestState();
  });

  after(() => {
    if (orgIdsToCleanup.length === 0) {
      return;
    }
    cy.loginByApi('admin');
    orgIdsToCleanup.forEach((id) => {
      cy.cleanupTestOrganization(id, { allowNotFound: true });
    });
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
