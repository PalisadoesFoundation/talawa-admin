import { BasePage } from '../base/BasePage';

export type CreateOrganizationInput = {
  name: string;
  description: string;
  countryCode: string;
  state: string;
  city: string;
  addressLine1: string;
  postalCode?: string;
  addressLine2?: string;
};

export class OrganizationSetupPage extends BasePage<OrganizationSetupPage> {
  private readonly createOrganizationButton = 'createOrganizationBtn';
  private readonly createOrganizationModalHeader = 'modalOrganizationHeader';
  private readonly organizationNameInput = 'modalOrganizationName';
  private readonly organizationDescriptionInput =
    'modalOrganizationDescription';
  private readonly organizationCountryCodeInput =
    'modalOrganizationCountryCode';
  private readonly organizationStateInput = 'modalOrganizationState';
  private readonly organizationCityInput = 'modalOrganizationCity';
  private readonly organizationPostalCodeInput = 'modalOrganizationPostalCode';
  private readonly organizationAddressLine1Input =
    'modalOrganizationAddressLine1';
  private readonly organizationAddressLine2Input =
    'modalOrganizationAddressLine2';
  private readonly submitOrganizationFormButton = 'submitOrganizationForm';
  private readonly pluginNotificationModal = 'pluginNotificationModal';
  private readonly closePluginNotificationButton = 'enableEverythingForm';
  private readonly goToStoreLink = 'goToStore';
  private readonly organizationSearchInput = 'searchInput';
  private readonly organizationSearchButton = 'searchBtn';
  private readonly organizationCardContainer = 'orgCardContainer';
  private readonly organizationManageButton = 'manageBtn';
  private readonly pageNotFoundHeading = 'page-not-found-heading';

  protected self(): OrganizationSetupPage {
    return this;
  }

  visitOrgList(timeout = 30000): this {
    this.visit('/admin/orglist');
    this.assertUrlIncludes('/admin/orglist', timeout);
    return this;
  }

  openCreateOrganizationModal(timeout = 10000): this {
    this.byTestId(this.createOrganizationButton, timeout)
      .should('be.visible')
      .click();
    this.byTestId(this.createOrganizationModalHeader, timeout).should(
      'be.visible',
    );
    return this;
  }

  fillCreateOrganizationForm(
    input: CreateOrganizationInput,
    timeout = 10000,
  ): this {
    this.byTestId(this.organizationNameInput, timeout)
      .should('be.visible')
      .clear()
      .type(input.name);
    this.byTestId(this.organizationDescriptionInput, timeout)
      .should('be.visible')
      .clear()
      .type(input.description);
    this.byTestId(this.organizationCountryCodeInput, timeout)
      .should('be.visible')
      .select(input.countryCode);
    this.byTestId(this.organizationStateInput, timeout)
      .should('be.visible')
      .clear()
      .type(input.state);
    this.byTestId(this.organizationCityInput, timeout)
      .should('be.visible')
      .clear()
      .type(input.city);
    this.byTestId(this.organizationAddressLine1Input, timeout)
      .should('be.visible')
      .clear()
      .type(input.addressLine1);
    if (input.postalCode) {
      this.byTestId(this.organizationPostalCodeInput, timeout)
        .should('be.visible')
        .clear()
        .type(input.postalCode);
    }
    if (input.addressLine2) {
      this.byTestId(this.organizationAddressLine2Input, timeout)
        .should('be.visible')
        .clear()
        .type(input.addressLine2);
    }
    return this;
  }

  submitCreateOrganizationForm(timeout = 10000): this {
    this.byTestId(this.submitOrganizationFormButton, timeout)
      .should('be.visible')
      .click();
    return this;
  }

  closePluginNotificationIfOpen(timeout = 15000): this {
    const modalSelector = `[data-testid="${this.pluginNotificationModal}"]`;
    const startedAt = Date.now();
    const pollIntervalMs = 250;
    const waitForAndClose = (): Cypress.Chainable<unknown> => {
      return cy.document({ log: false }).then((doc) => {
        const modal = doc.querySelector(modalSelector);
        if (!modal) {
          if (Date.now() - startedAt >= timeout) {
            return cy.wrap(undefined);
          }
          return cy
            .wait(pollIntervalMs, { log: false })
            .then(() => waitForAndClose());
        }
        return this.byTestId(this.closePluginNotificationButton, timeout)
          .should('be.visible')
          .click()
          .then(() => cy.wrap(undefined));
      });
    };
    // Wrap in cy.then() so the polling chain is enqueued and Cypress
    // awaits its completion before advancing to subsequent commands.
    cy.then(() => waitForAndClose());
    return this;
  }

  getCreatedOrganizationIdFromPluginModal(
    timeout = 30000,
  ): Cypress.Chainable<string> {
    return this.byTestId(this.pluginNotificationModal, timeout)
      .should('be.visible')
      .then(() => {
        return this.byTestId(this.goToStoreLink, timeout)
          .should('be.visible')
          .invoke('attr', 'href')
          .then((href) => {
            const orgId = href?.match(/id=([^/?#]+)/)?.[1];
            if (!orgId) {
              throw new Error(
                'Could not extract organization id from plugin modal store link.',
              );
            }
            return orgId;
          });
      });
  }

  searchOrganizationByName(name: string, timeout = 10000): this {
    this.byTestId(this.organizationSearchInput, timeout)
      .should('be.visible')
      .clear({ force: true })
      .type(name, { force: true });
    this.byTestId(this.organizationSearchButton, timeout)
      .should('be.visible')
      .click({ force: true });
    return this;
  }

  openOrganizationDashboardByName(name: string, timeout = 30000): this {
    this.searchOrganizationByName(name, timeout);
    this.byDataCy(this.organizationCardContainer, timeout)
      .contains(name, { timeout })
      .closest(`[data-cy="${this.organizationCardContainer}"]`)
      .find(`[data-cy="${this.organizationManageButton}"]`, { timeout })
      .should('be.visible')
      .click();
    this.assertUrlMatch(/\/admin\/orgdash\/[^/?#]+/, timeout);
    return this;
  }

  assertCreateOrganizationButtonNotVisible(timeout = 10000): this {
    cy.get('body', { timeout })
      .find(`[data-testid="${this.createOrganizationButton}"]`)
      .should('not.exist');
    return this;
  }

  assertPageNotFound(timeout = 10000): this {
    this.byTestId(this.pageNotFoundHeading, timeout)
      .should('be.visible')
      .and('contain.text', '404');
    return this;
  }
}
