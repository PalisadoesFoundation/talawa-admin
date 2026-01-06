export class OrganizationFundCampaignPage {
  private readonly _leftDrawerFundsBtn = '[data-cy="leftDrawerButton-Funds"]';
  private readonly _campaignsList = '[data-testid="campaigns-list"]';
  private readonly _campaignName = '[data-testid="campaignName"]';
  private readonly _raisedCell = '[data-testid="raisedCell"]';
  private readonly _progressCell = '[data-testid="progressCell"]';
  private readonly _goalCell = '[data-testid="goalCell"]';
  private readonly _addCampaignBtn = '[data-testid="addCampaignBtn"]';
  private readonly _editCampaignBtn = '[data-testid="editCampaignBtn"]';
  private readonly _searchInput = '[data-testid="searchFullName"]';
  private readonly _viewBtn = '[data-testid="viewBtn"]';

  visitFundCampaignsPage(orgId: string, fundId: string, timeout = 10000) {
    cy.visit(`/orgfundcampaign/${orgId}/${fundId}`);
    cy.url({ timeout }).should(
      'include',
      `/orgfundcampaign/${orgId}/${fundId}`,
    );
    return this;
  }

  visitFundsPage(timeout = 10000) {
    cy.visit('/orglist');
    cy.get('[data-cy="manageBtn"]').should('be.visible').first().click();
    cy.url({ timeout }).should('match', /\/orgdash\/[a-f0-9-]+/);
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
    cy.get(this._leftDrawerFundsBtn, { timeout })
      .scrollIntoView()
      .should('exist')
      .click({ force: true });
    cy.url().should('match', /\/orgfunds\/[a-f0-9-]+/);
    // Wait for funds page to fully load - either funds list or empty state
    cy.get('[data-testid="funds-list"], [data-testid="funds-empty"]', {
      timeout,
    }).should('exist');
    return this;
  }

  verifyCampaignsListVisible(timeout = 10000) {
    cy.get(this._campaignsList, { timeout }).should('be.visible');
    return this;
  }

  verifyCampaignName(campaignName: string) {
    cy.contains(this._campaignName, campaignName).should('be.visible');
    return this;
  }

  verifyAmountRaised(currencySymbol: string, amount: string | number) {
    cy.get(this._raisedCell)
      .first()
      .should('be.visible')
      .and('contain.text', currencySymbol)
      .and('contain.text', amount.toString());
    return this;
  }

  verifyProgressPercentage(percentage: string) {
    cy.get(this._progressCell)
      .first()
      .should('be.visible')
      .and('contain.text', `${percentage}%`);
    return this;
  }

  verifyGoalAmount(currencySymbol: string, amount: string | number) {
    cy.get(this._goalCell)
      .first()
      .should('be.visible')
      .and('contain.text', currencySymbol)
      .and('contain.text', amount.toString());
    return this;
  }

  clickFirstCampaign() {
    cy.get(this._campaignName).first().click();
    return this;
  }

  searchCampaign(searchTerm: string) {
    cy.get(this._searchInput).should('be.visible').type(searchTerm);
    return this;
  }

  verifySearchResults(campaignName: string, shouldExist: boolean = true) {
    if (shouldExist) {
      cy.contains(this._campaignName, campaignName).should('be.visible');
    } else {
      cy.contains(this._campaignName, campaignName).should('not.exist');
    }
    return this;
  }

  clickAddCampaign() {
    cy.get(this._addCampaignBtn).should('be.visible').click();
    return this;
  }

  clickEditCampaign() {
    cy.get(this._editCampaignBtn).first().should('be.visible').click();
    return this;
  }

  verifyEmptyState() {
    cy.get('[data-testid="campaigns-empty"]').should('be.visible');
    return this;
  }

  checkEmptyStateExists(callback: (exists: boolean) => void) {
    cy.get('body').then(($body) => {
      const exists = $body.find('[data-testid="campaigns-empty"]').length > 0;
      callback(exists);
    });
    return this;
  }

  verifyNoResultsEmptyState() {
    cy.get('[data-testid="campaigns-search-empty"]').should('be.visible');
    return this;
  }

  clickViewBtn(timeout = 10000) {
    // First ensure funds page is loaded
    cy.get('[data-testid="funds-list"], [data-testid="funds-empty"]', {
      timeout,
    }).should('exist');
    // Wait for viewBtn to be available (only exists when funds are present)
    cy.get(this._viewBtn, { timeout })
      .first()
      .should('exist')
      .should('be.visible')
      .should('not.be.disabled')
      .click({ force: true });
    return this;
  }

  verifyRaisedCellsVisible() {
    cy.get(this._raisedCell).should('have.length.greaterThan', 0);
    return this;
  }

  verifyProgressCellsVisible() {
    cy.get(this._progressCell).should('have.length.greaterThan', 0);
    return this;
  }

  verifyGoalCellsVisible() {
    cy.get(this._goalCell).should('have.length.greaterThan', 0);
    return this;
  }

  getFirstRaisedCellText(callback: (text: string) => void) {
    cy.get(this._raisedCell)
      .first()
      .should('be.visible')
      .then(($cell) => {
        callback($cell.text());
      });
    return this;
  }

  getFirstProgressCellText(callback: (text: string) => void) {
    cy.get(this._progressCell)
      .first()
      .should('be.visible')
      .then(($cell) => {
        callback($cell.text());
      });
    return this;
  }

  getFirstCampaignNameText(callback: (text: string) => void) {
    cy.get(this._campaignName)
      .first()
      .invoke('text')
      .then((text) => {
        callback(text);
      });
    return this;
  }

  waitForCampaignsPageLoad(timeout = 15000) {
    cy.url({ timeout }).should('include', '/orgfundcampaign/');
    cy.get('[data-testid="campaigns-list"], [data-testid="campaigns-empty"]', {
      timeout,
    }).should('exist');
    return this;
  }

  verifyCampaignsListOrEmptyState() {
    this.checkEmptyStateExists((exists) => {
      if (exists) {
        this.verifyEmptyState();
      } else {
        this.verifyCampaignsListVisible();
      }
    });
    return this;
  }

  getFirstRaisedCellTextAndVerify(callback: (text: string) => void) {
    cy.get(this._raisedCell)
      .first()
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        callback(text);
      });
    return this;
  }

  getFirstProgressCellTextAndVerify(callback: (text: string) => void) {
    cy.get(this._progressCell)
      .first()
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        callback(text);
      });
    return this;
  }

  verifyCampaignsExistAndRun(callback: () => void) {
    this.checkEmptyStateExists((exists) => {
      if (!exists) {
        callback();
      } else {
        this.verifyEmptyState();
      }
    });
    return this;
  }
}
