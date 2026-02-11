export class AdvertisementPage {
  private readonly _createAdBtn = '[data-testid="createAdvertisement"]';
  private readonly _adNameInput = '[data-cy="advertisementNameInput"]';
  private readonly _adDescriptionInput =
    '[data-cy="advertisementDescriptionInput"]';
  private readonly _adMediaInput = '[data-cy="advertisementMediaInput"]';
  private readonly _adTypeSelect = '[data-cy="advertisementTypeSelect"]';
  private readonly _registerAdBtn = '[data-cy="registerAdvertisementButton"]';
  private readonly _alert = '[role="alert"]';
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

  private aliasDeleteAdvertisementMutation() {
    const apiPattern =
      (Cypress.env('apiUrl') as string | undefined) ||
      (Cypress.env('API_URL') as string | undefined) ||
      (Cypress.env('CYPRESS_API_URL') as string | undefined) ||
      '**/graphql';

    cy.intercept('POST', apiPattern, (req) => {
      if (req.body?.query?.includes('deleteAdvertisement')) {
        req.alias = 'deleteAdvertisement';
      }
    });
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

    // Wait for the success toast notification
    cy.get(this._alert, { timeout: 50000 })
      .should('be.visible')
      .and('contain.text', 'Advertisement created successfully.');

    // Wait for the modal to fully close (fade animation completes)
    cy.get(this._advertisementModal, { timeout: 10000 }).should('not.exist');

    // Now click the "Active Campaigns" tab
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

    // Wait for success and modal to close
    cy.get(this._alert, { timeout: 50000 })
      .should('be.visible')
      .and('contain.text', 'Advertisement updated Successfully');
    cy.get(this._advertisementModal, { timeout: 10000 }).should('not.exist');
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

    this.aliasDeleteAdvertisementMutation();
    cy.get(this._dropdownBtn).first().should('be.visible').click();
    cy.get(this._deleteBtn).first().should('be.visible').trigger('click');
    cy.get(this._deleteConfirmBtn).should('be.visible').click();
    cy.wait('@deleteAdvertisement');
    cy.get(this._alert, { timeout: 50000 })
      .should('be.visible')
      .and('contain.text', 'Advertisement deleted successfully.');
    return this;
  }
}
