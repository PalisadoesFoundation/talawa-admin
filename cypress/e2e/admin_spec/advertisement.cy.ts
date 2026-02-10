import { AdvertisementPage } from '../../pageObjects/AdminPortal/AdvertisementPage';

interface InterfaceAdvertisementData {
  ad1: {
    name: string;
    description: string;
    mediaPath: string;
    type: string;
  };
  ad2: {
    updatedName: string;
  };
}

describe('Testing Admin Advertisement Management', () => {
  const adPage = new AdvertisementPage();
  let adData: InterfaceAdvertisementData;
  let orgId = '';
  let adminEmail = '';
  let adminPassword = '';

  before(() => {
    cy.fixture('auth/credentials')
      .then((credentials) => {
        adminEmail =
          (Cypress.env('E2E_ADMIN_EMAIL') as string | undefined) ||
          credentials.admin.email;
        adminPassword =
          (Cypress.env('E2E_ADMIN_PASSWORD') as string | undefined) ||
          credentials.admin.password;
      })
      .then(() => cy.fixture('admin/advertisements'))
      .then((data) => {
        const ad1 = data.advertisements?.[0];
        adData = {
          ad1: {
            name: ad1?.name ?? 'Advertisement 1',
            description: ad1?.description ?? 'This is a test advertisement',
            mediaPath: 'cypress/fixtures/advertisement_banner.png',
            type: ad1?.type ?? 'Popup Ad',
          },
          ad2: {
            updatedName: data.advertisements?.[1]?.name ?? 'Advertisement 2',
          },
        };
      })
      .then(() => cy.setupTestEnvironment({ auth: { role: 'admin' } }))
      .then(({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
        return cy.task('gqlSignIn', {
          apiUrl: Cypress.env('apiUrl') as string | undefined,
          email: adminEmail,
          password: adminPassword,
        });
      })
      .then(({ token }) => {
        return cy
          .task('createTestPlugin', {
            apiUrl: Cypress.env('apiUrl') as string | undefined,
            token,
            pluginId: 'advertisement',
          })
          .then(() =>
            cy.task('installTestPlugin', {
              apiUrl: Cypress.env('apiUrl') as string | undefined,
              token,
              pluginId: 'advertisement',
            }),
          );
      });
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.window().then((win) => {
      const token = win.localStorage.getItem('Talawa-admin_token');
      expect(token, 'User should be authenticated').to.not.equal(null);
    });
    adPage.visitAdvertisementPage(orgId);
  });

  it('create a new advertisement', () => {
    adPage.createAdvertisement(
      adData.ad1.name,
      adData.ad1.description,
      adData.ad1.mediaPath,
      adData.ad1.type,
    );
  });

  it('shows the created advertisement under active campaigns and allows editing', () => {
    adPage.verifyAndEditAdvertisement(adData.ad1.name, adData.ad2.updatedName);
  });

  it('shows the updated advertisement under active campaigns and deletes it', () => {
    adPage.verifyAndDeleteAdvertisement(adData.ad2.updatedName);
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
