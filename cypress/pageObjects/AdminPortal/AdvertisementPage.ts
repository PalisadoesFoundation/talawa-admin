export class AdvertisementPage {
  private readonly _createAdBtn = '[data-testid="createAdvertisement"]';
  private readonly _adNameInput = '[data-cy="advertisementNameInput"]';
  private readonly _adDescriptionInput =
    '[data-cy="advertisementDescriptionInput"]';
  private readonly _adMediaInput = '[data-cy="advertisementMediaInput"]';
  private readonly _adTypeSelect = '[data-cy="advertisementTypeSelect"]';
  private readonly _registerAdBtn = '[data-cy="registerAdvertisementButton"]';
  private readonly _leftDrawerAdBtn =
    '[data-cy="leftDrawerButton-Advertisement"]';
  private readonly _activeCampaignsTab = 'Active Campaigns';
  private readonly _dropdownBtn = '[data-cy="dropdownbtn"]';
  private readonly _editBtn = '[data-testid="editBtn"]';
  private readonly _saveChangesBtn = '[data-cy="saveChanges"]';
  private readonly _deleteBtn = '[data-cy="deletebtn"]';
  private readonly _deleteConfirmBtn = '[data-testid="delete_yes"]';

  /**
   * Wait for the advertisement page to be fully loaded and ready for interaction.
   * Asserts that the "Create Advertisement" button is visible.
   */
  waitForPageReady() {
    cy.get(this._createAdBtn).should('be.visible');
    return this;
  }

  visitAdvertisementPage() {
    cy.get(this._leftDrawerAdBtn).should('be.visible').click();
    cy.url().should('match', /\/admin\/orgads\/[a-f0-9-]+/);
    return this;
  }

  createAdvertisement(name: string, description: string, type: string) {
    cy.get(this._createAdBtn).should('be.visible').click();
    cy.get(this._adNameInput).should('be.visible').type(name);
    cy.get(this._adDescriptionInput).should('be.visible').type(description);
    cy.get(this._adTypeSelect).should('be.visible').select(type);
    cy.get(this._registerAdBtn).should('be.visible').click();
    cy.assertToast('Advertisement created successfully.');
    return this;
  }

  createAdvertisementWithAttachment(
    name: string,
    description: string,
    type: string,
    fixturePath: string,
  ) {
    // 1. Mock the MinIO PUT upload (intercept any PUT to the presigned URL pattern)
    cy.intercept('PUT', '**/talawa/**', {
      statusCode: 200,
      body: '',
    }).as('minioUpload');

    // 2. Open modal and fill form
    cy.get(this._createAdBtn).should('be.visible').click();
    cy.get(this._adNameInput).should('be.visible').type(name);
    cy.get(this._adDescriptionInput).should('be.visible').type(description);
    cy.get(this._adTypeSelect).should('be.visible').select(type);

    // 3. Attach file
    cy.get(this._adMediaInput).selectFile(`cypress/fixtures/${fixturePath}`, {
      force: true,
    });

    // 4. Wait for mocked operations
    cy.wait('@minioUpload');

    // 5. Submit
    cy.get(this._registerAdBtn).should('be.visible').click();
    cy.assertToast('Advertisement created successfully.');
    return this;
  }

  verifyAndEditAdvertisement(oldName: string, newName: string) {
    cy.contains(this._activeCampaignsTab).should('be.visible').click();
    cy.contains(oldName).should('be.visible');
    cy.get(this._dropdownBtn).should('be.visible').first().click();
    cy.get(this._editBtn).should('be.visible').first().trigger('click');
    cy.get(this._adNameInput).should('be.visible').clear().type(newName);
    cy.get(this._saveChangesBtn).should('be.visible').click();
    cy.assertToast('Advertisement updated Successfully');
    return this;
  }

  verifyAndDeleteAdvertisement(adName: string) {
    cy.contains(this._activeCampaignsTab).should('be.visible').click();
    cy.contains(adName).should('be.visible');
    cy.get(this._dropdownBtn).should('be.visible').first().click();
    cy.get(this._deleteBtn).should('be.visible').first().trigger('click');
    cy.get(this._deleteConfirmBtn).should('be.visible').click();
    cy.assertToast('Advertisement deleted successfully.');
    return this;
  }
}
