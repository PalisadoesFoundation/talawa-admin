import { BasePage } from '../base/BasePage';

type CreateOrganizationInput = {
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
  private readonly organizationSearchInput = 'searchInput';
  private readonly organizationSearchButton = 'searchBtn';
  private readonly organizationCardContainer = '[data-cy="orgCardContainer"]';
  private readonly organizationManageButton = '[data-cy="manageBtn"]';
  private readonly pageNotFoundSelector = 'h1';

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
    cy.get('body', { timeout }).then(($body) => {
      const hasModal =
        $body.find(`[data-testid="${this.pluginNotificationModal}"]`).length >
        0;
      if (!hasModal) {
        return;
      }
      this.byTestId(this.closePluginNotificationButton, timeout)
        .should('be.visible')
        .click();
    });
    return this;
  }

  searchOrganizationByName(name: string, timeout = 10000): this {
    this.byTestId(this.organizationSearchInput, timeout)
      .should('be.visible')
      .clear()
      .type(name);
    this.byTestId(this.organizationSearchButton, timeout)
      .should('be.visible')
      .click();
    return this;
  }

  openOrganizationDashboardByName(name: string, timeout = 30000): this {
    this.searchOrganizationByName(name, timeout);
    cy.contains(this.organizationCardContainer, name, { timeout })
      .should('be.visible')
      .within(() => {
        cy.get(this.organizationManageButton, { timeout })
          .should('be.visible')
          .click();
      });
    this.assertUrlMatch(/\/admin\/orgdash\/[a-f0-9-]+/, timeout);
    return this;
  }

  assertCreateOrganizationButtonNotVisible(timeout = 10000): this {
    cy.get('body', { timeout })
      .find(`[data-testid="${this.createOrganizationButton}"]`)
      .should('not.exist');
    return this;
  }

  assertPageNotFound(timeout = 10000): this {
    cy.get(this.pageNotFoundSelector, { timeout })
      .should('be.visible')
      .and('contain.text', '404');
    return this;
  }
}
