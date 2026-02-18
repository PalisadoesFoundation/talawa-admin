export class AdvertisementPage {
  private readonly _createAdBtn = '[data-testid="createAdvertisement"]';
  private readonly _adNameInput = '[data-cy="advertisementNameInput"]';
  private readonly _adDescriptionInput =
    '[data-cy="advertisementDescriptionInput"]';
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

  verifyAndEditAdvertisement(oldName: string, newName: string) {
    cy.contains(this._activeCampaignsTab).should('be.visible').click();
    cy.contains(oldName).should('be.visible');
    cy.get(this._dropdownBtn).should('be.visible').click();
    cy.get(this._editBtn).should('be.visible').trigger('click');
    cy.get(this._adNameInput).should('be.visible').clear().type(newName);
    cy.get(this._saveChangesBtn).should('be.visible').click();
    cy.assertToast('Advertisement updated Successfully');
    return this;
  }

  verifyAndDeleteAdvertisement(adName: string) {
    cy.contains(this._activeCampaignsTab).should('be.visible').click();
    cy.contains(adName).should('be.visible');
    cy.get(this._dropdownBtn).should('be.visible').click();
    cy.get(this._deleteBtn).should('be.visible').trigger('click');
    cy.get(this._deleteConfirmBtn).should('be.visible').click();
    cy.assertToast('Advertisement deleted successfully.');
    return this;
  }
}
