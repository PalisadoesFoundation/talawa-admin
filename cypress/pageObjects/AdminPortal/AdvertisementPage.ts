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

  private aliasGraphQLByKeyword(alias: string, keyword: string) {
    cy.intercept('POST', '**/graphql', (req) => {
      const body = req.body as unknown;
      const candidates: string[] = [];

      if (
        body &&
        typeof body === 'object' &&
        'operationName' in body &&
        typeof (body as { operationName?: unknown }).operationName === 'string'
      ) {
        candidates.push(
          (body as { operationName: string }).operationName as string,
        );
      }

      if (
        body &&
        typeof body === 'object' &&
        'operations' in body &&
        typeof (body as { operations?: unknown }).operations === 'string'
      ) {
        candidates.push((body as { operations: string }).operations as string);
      }

      const headerOperation = req.headers['x-apollo-operation-name'];
      if (typeof headerOperation === 'string') {
        candidates.push(headerOperation);
      }

      if (typeof body === 'string') {
        candidates.push(body);
      } else if (body && typeof body === 'object') {
        try {
          candidates.push(JSON.stringify(body));
        } catch {
          // Ignore serialization failures for multipart bodies.
        }
      }

      if (candidates.some((candidate) => candidate.includes(keyword))) {
        req.alias = alias;
      }
    });
  }

  private aliasAdvertisementListQuery() {
    this.aliasGraphQLByKeyword(
      'OrganizationAdvertisements',
      'OrganizationAdvertisements',
    );
  }

  private waitForGraphQL(alias: string, label: string) {
    return cy.wait(`@${alias}`, { timeout: 20000 }).then((interception) => {
      const body = interception.response?.body as {
        errors?: { message: string }[];
      };
      if (body?.errors?.length) {
        const errorMessage = body.errors
          .map((error) => error.message)
          .join(', ');
        throw new Error(`${label} failed: ${errorMessage}`);
      }
    });
  }

  visitAdvertisementPage(timeout = 10000) {
    cy.visit('/admin/orglist');
    cy.get('[data-cy="manageBtn"]').should('be.visible').first().click();
    cy.url({ timeout }).should('match', /\/admin\/orgdash\/[a-f0-9-]+/);
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
    this.aliasGraphQLByKeyword('createAdvertisement', 'createAdvertisement');
    this.aliasAdvertisementListQuery();

    cy.get(this._createAdBtn, { timeout }).should('be.visible').click();
    cy.get(this._adNameInput).should('be.visible').type(name);
    cy.get(this._adDescriptionInput).should('be.visible').type(description);
    cy.get(this._adMediaInput)
      .should('be.visible')
      .selectFile(mediaPath, { force: true });
    cy.get(this._adTypeSelect).should('be.visible').select(type);
    cy.get(this._registerAdBtn).should('be.visible').click();
    this.waitForGraphQL('createAdvertisement', 'CreateAdvertisement');
    cy.assertToast('Advertisement created successfully.');
    cy.reload();
    cy.wait('@OrganizationAdvertisements', { timeout: 20000 });
    return this;
  }

  verifyAndEditAdvertisement(oldName: string, newName: string) {
    cy.aliasGraphQLOperation('UpdateAdvertisement');
    this.aliasAdvertisementListQuery();

    cy.contains(this._activeCampaignsTab).should('be.visible').click();
    cy.reload();
    cy.wait('@OrganizationAdvertisements', { timeout: 20000 });
    cy.contains(oldName).should('be.visible');
    cy.get(this._dropdownBtn).should('be.visible').click();
    cy.get(this._editBtn).should('be.visible').trigger('click');
    cy.get(this._adNameInput).should('be.visible').clear().type(newName);
    cy.get(this._saveChangesBtn).should('be.visible').click();
    this.waitForGraphQL('UpdateAdvertisement', 'UpdateAdvertisement');
    cy.assertToast('Advertisement updated Successfully');
    cy.reload();
    cy.wait('@OrganizationAdvertisements', { timeout: 20000 });
    return this;
  }

  verifyAndDeleteAdvertisement(adName: string) {
    this.aliasGraphQLByKeyword('deleteAdvertisement', 'deleteAdvertisement');

    cy.contains(this._activeCampaignsTab).should('be.visible').click();
    cy.reload();
    cy.wait('@OrganizationAdvertisements', { timeout: 20000 });
    cy.contains(adName).should('be.visible');
    cy.get(this._dropdownBtn).should('be.visible').click();
    cy.get(this._deleteBtn).should('be.visible').trigger('click');
    cy.get(this._deleteConfirmBtn).should('be.visible').click();
    this.waitForGraphQL('deleteAdvertisement', 'DeleteAdvertisement');
    cy.assertToast('Advertisement deleted successfully.');
    return this;
  }
}
