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

  before(() => {
    cy.fixture('admin/advertisements').then((data) => {
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
    });
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    adPage.visitAdvertisementPage();
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
});
