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
  private readonly _advertisementModal =
    '[data-testid="advertisementModal"]';

  private aliasAdvertisementListQuery() {
    cy.aliasGraphQLOperation('OrganizationAdvertisements');
  }

  visitAdvertisementPage(orgId?: string, timeout = 10000) {
    const openOrgDashboard = (id: string) => {
      cy.visit(`/admin/orgdash/${id}`);
      cy.url({ timeout }).should('match', /\/admin\/orgdash\/[a-f0-9-]+/);
    };

    if (orgId) {
      openOrgDashboard(orgId);
    } else {
      cy.createTestOrganization({
        name: `E2E Org ${Date.now()}`,
        auth: { role: 'admin' },
      }).then(({ orgId: createdOrgId }) => {
        openOrgDashboard(createdOrgId);
      });
    }
    cy.get('body').then(($body) => {
      const drawerElement = $body.find('[data-testid="leftDrawerContainer"]');
      if (drawerElement.length > 0) {
        const isCollapsed =
          drawerElement.hasClass('_collapsedDrawer_') ||
          drawerElement.css('width') === '56px' ||
          drawerElement.css('width') === '72px';

        if (isCollapsed) {
          cy.get('[data-testid="hamburgerMenuBtn"]').click();
          cy.wait(500);
        }
      }
    });
    cy.get(this._leftDrawerAdBtn, { timeout })
      .scrollIntoView()
      .should('exist')
      .click({ force: true });
    cy.url().should('match', /\/admin\/orgads\/[a-f0-9-]+/);
    return this;
  }

  createAdvertisement(
    name: string,
    description: string,
    mediaPath: string,
    type: string,
    timeout = 10000,
  ) {
    // Click the "Create Advertisement" button to open the modal
    cy.get(this._createAdBtn, { timeout }).should('be.visible').click();

    // Fill in the form
    cy.get(this._adNameInput).should('be.visible').type(name);
    cy.get(this._adDescriptionInput).should('be.visible').type(description);
    cy.get(this._adMediaInput)
      .should('be.visible')
      .selectFile(mediaPath, { force: true });
    cy.get(this._adTypeSelect).should('be.visible').select(type);

    // Click register
    cy.get(this._registerAdBtn).should('be.visible').click({ force: true });

    // Wait for the mutation response to arrive (file upload can be slow)
    cy.wait(5000);

    // Check if the modal closed (success) or is still open (mutation failed
    // silently, e.g. on a retry where the ad was already created)
    cy.get('body').then(($body) => {
      if ($body.find(this._advertisementModal).length > 0) {
        // Modal is still open — likely a retry where the ad already exists
        // and the mutation failed silently. Close the modal manually via reload.
        cy.reload();
      }
    });

    // Make sure the modal is gone
    cy.get(this._advertisementModal).should('not.exist');

    // Reload to get fresh data (avoids Apollo cache mismatch with refetchQueries)
    cy.reload();

    // Now click the "Active Campaigns" tab (default tab is "Completed Campaigns")
    cy.contains(this._activeCampaignsTab, { timeout: 50000 })
      .should('be.visible')
      .click();

    // Verify the advertisement appears
    cy.contains(name, { timeout: 50000 }).should('be.visible');
    return this;
  }

  verifyAndEditAdvertisement(oldName: string, newName: string) {
    this.aliasAdvertisementListQuery();
    cy.reload();

    // Switch to Active Campaigns tab first (default tab is "Archived Ads")
    cy.contains(this._activeCampaignsTab, { timeout: 50000 })
      .should('be.visible')
      .click();

    // Verify the ad is visible
    cy.contains(oldName, { timeout: 50000 }).should('be.visible');

    // Click the dropdown on the first matching ad card
    cy.get(this._dropdownBtn).first().should('be.visible').click();
    cy.get(this._editBtn).first().should('be.visible').trigger('click');

    // Edit the advertisement name
    cy.get(this._adNameInput).should('be.visible').clear().type(newName);
    cy.get(this._saveChangesBtn).should('be.visible').click();

    // Wait for modal to close (signals handleUpdate succeeded)
    cy.get(this._advertisementModal, { timeout: 15000 }).should('not.exist');

    // Reload and verify the name change persisted
    cy.reload();
    cy.contains(this._activeCampaignsTab, { timeout: 50000 })
      .should('be.visible')
      .click();
    cy.contains(newName, { timeout: 50000 }).should('be.visible');
    return this;
  }

  verifyAndDeleteAdvertisement(adName: string) {
    this.aliasAdvertisementListQuery();
    cy.reload();

    // Switch to Active Campaigns tab first (default tab is "Archived Ads")
    cy.contains(this._activeCampaignsTab, { timeout: 50000 })
      .should('be.visible')
      .click();

    // Verify the ad is visible
    cy.contains(adName, { timeout: 50000 }).should('be.visible');

    cy.get(this._dropdownBtn).first().should('be.visible').click();
    cy.get(this._deleteBtn).first().should('be.visible').trigger('click');
    cy.get(this._deleteConfirmBtn).should('be.visible').click();

    // Wait for the delete mutation to complete
    cy.wait(3000);

    // Reload to verify the ad was deleted
    cy.reload();
    cy.contains(this._activeCampaignsTab, { timeout: 50000 })
      .should('be.visible')
      .click();

    // Wait for the page to load, then verify the ad is gone
    cy.wait(2000);
    cy.contains(adName).should('not.exist');
    return this;
  }
}
