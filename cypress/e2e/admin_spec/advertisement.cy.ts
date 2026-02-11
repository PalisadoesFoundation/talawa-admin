import { AdvertisementPage } from '../../pageObjects/AdminPortal/AdvertisementPage';
import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';

interface InterfaceAdvertisementData {
  ad1: {
    name: string;
    description: string;
    type: string;
  };
  ad2: {
    updatedName: string;
  };
}

describe('Testing Admin Advertisement Management', () => {
  const dashboard = new AdminDashboardPage();
  const adPage = new AdvertisementPage();
  let adData: InterfaceAdvertisementData;

  before(() => {
    cy.fixture('admin/advertisements').then((data) => {
      const ad1 = data.advertisements?.[0];
      adData = {
        ad1: {
          name: ad1?.name ?? 'Advertisement 1',
          description: ad1?.description ?? 'This is a test advertisement',
          type: ad1?.type ?? 'Popup Ad',
        },
        ad2: {
          updatedName: data.advertisements?.[1]?.name ?? 'Advertisement 2',
        },
      };
    });
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    adPage.visitAdvertisementPage();
  });

  it('create a new advertisement', () => {
    adPage.createAdvertisement(
      adData.ad1.name,
      adData.ad1.description,
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
});
