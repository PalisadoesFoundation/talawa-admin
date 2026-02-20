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
  const orgIdsToCleanup: string[] = [];
  const userIds: string[] = [];

  beforeEach(() => {
    cy.loginByApi('admin');
  });

  afterEach(() => {
    clearTestState();
  });

  after(() => {
    cy.loginByApi('admin');
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

    let seededOrgId = '';
    cy.createTestOrganization({
      name: `E2E Setup Seed ${uniqueSuffix}`,
      description: 'Seeded org for deterministic create workflow',
    }).then(({ orgId: preCreatedOrgId }) => {
      seededOrgId = preCreatedOrgId;
      orgIdsToCleanup.push(preCreatedOrgId);

      // Register intercepts INSIDE .then() so seededOrgId is guaranteed
      // to be set before the createOrganization mutation can fire.
      cy.intercept('POST', '**/graphql', (req) => {
        const body = req.body as
          | {
              operationName?: string;
              variables?: {
                role?: string;
              };
            }
          | undefined;
        const operationName = body?.operationName;

        if (
          operationName === 'createOrganization' ||
          operationName === 'CreateOrganization'
        ) {
          req.reply({
            statusCode: 200,
            body: {
              data: {
                createOrganization: {
                  id: seededOrgId,
                  __typename: 'Organization',
                },
              },
            },
          });
          return;
        }

        if (
          operationName === 'CreateOrganizationMembership' &&
          body?.variables?.role === 'administrator'
        ) {
          req.reply({
            statusCode: 200,
            body: {
              data: {
                createOrganizationMembership: {
                  id: seededOrgId,
                  __typename: 'OrganizationMembership',
                },
              },
            },
          });
          return;
        }

        req.continue();
      });

      setupPage.visitOrgList();
      cy.log('Phase: Create organization');

      setupPage
        .openCreateOrganizationModal()
        .fillCreateOrganizationForm(createOrganizationInput)
        .submitCreateOrganizationForm();

      setupPage
        .getCreatedOrganizationIdFromPluginModal(50000)
        .then((createdOrgId) => {
          orgId = createdOrgId;
          setupPage.closePluginNotificationIfOpen();
          cy.visit(`/admin/orgdash/${orgId}`);
          cy.url().should('include', '/admin/orgdash/');
        });

      cy.log('Phase: Update settings and branding');
      cy.intercept('POST', '**/graphql', (req) => {
        const operationName = (
          req.body as { operationName?: string } | undefined
        )?.operationName;
        if (operationName === 'getOrganizationBasicData') {
          req.alias = 'getOrganizationBasicData';
        }
        if (operationName === 'UpdateOrganization') {
          req.alias = 'UpdateOrganization';
        }
        req.continue();
      });

      cy.then(() => {
        organizationSettingsPage.visitPage(orgId).openGeneralTab();
      });

      cy.wait('@getOrganizationBasicData')
        .its('response.statusCode')
        .should('eq', 200);

      organizationSettingsPage
        .updateOrganizationName(updatedOrgName)
        .updateOrganizationDescription(updatedDescription)
        .updateOrganizationLocation(updatedLocation)
        .toggleIsPublic()
        .saveChanges();

      cy.wait('@UpdateOrganization').then((interception) => {
        expect(
          interception.response?.body?.data?.updateOrganization?.name,
        ).to.eq(updatedOrgName);
      });
      cy.assertToast(/updated/i);

      // Branding step: validate organization image input behavior.
      organizationSettingsPage
        .uploadDisplayImageFromFixture('advertisement_banner.png')
        .assertSelectedDisplayImage('advertisement_banner.png');

      cy.createTestUser({ name: inviteeName }).then(({ userId }) => {
        userIds.push(userId);
      });

      cy.intercept('POST', '**/graphql', (req) => {
        const body = req.body as
          | {
              operationName?: string;
              variables?: {
                role?: string;
              };
            }
          | undefined;
        if (body?.operationName === 'allUsers') {
          req.alias = 'allUsers';
        }
        if (
          body?.operationName === 'CreateOrganizationMembership' &&
          body.variables?.role === 'regular'
        ) {
          req.alias = 'CreateOrganizationMembership';
        }
        req.continue();
      });

      cy.log('Phase: Invite member');
      memberManagementPage.openFromDrawer().clickAddExistingMember();
      cy.wait('@allUsers').its('response.statusCode').should('eq', 200);

      memberManagementPage.searchAndSelectUser(inviteeName);
      cy.wait('@allUsers').its('response.statusCode').should('eq', 200);

      memberManagementPage.confirmAddUser(inviteeName);

      cy.wait('@CreateOrganizationMembership')
        .its('response.statusCode')
        .should('eq', 200);

      memberManagementPage
        .getAlert()
        .should('be.visible')
        .and('contain.text', 'added');

      memberManagementPage.closeAddMemberModal();

      // Give the server a moment to commit the membership before reloading,
      // then reload so the local-filter DataGrid picks up the new member.
      cy.wait(500);
      cy.reload();

      memberManagementPage
        .searchMemberByName(inviteeName)
        .verifyMemberInList(inviteeName);
    });
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

    setupPage.visitOrgList();
    cy.intercept('POST', '**/graphql', (req) => {
      const operationName = (req.body as { operationName?: string } | undefined)
        ?.operationName;
      if (operationName === 'createOrganization') {
        req.reply({
          statusCode: 200,
          body: {
            data: null,
            errors: [
              {
                message: 'Organization name already exists',
                extensions: {
                  code: 'CONFLICT',
                },
              },
            ],
          },
        });
        return;
      }
      req.continue();
    });

    setupPage
      .openCreateOrganizationModal()
      .fillCreateOrganizationForm(duplicateOrganizationInput)
      .submitCreateOrganizationForm();
    cy.assertToast('An organization with this name already exists');
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
