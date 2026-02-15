import { BasePage } from '../base/BasePage';

export class OrganizationSettingsPage extends BasePage<OrganizationSettingsPage> {
  private readonly settingsDrawerButton = 'leftDrawerButton-Settings';
  private readonly generalSettingsButton = 'generalSettings';
  private readonly actionItemCategoriesButton = 'actionItemCategoriesSettings';
  private readonly generalTab = 'generalTab';
  private readonly actionItemCategoriesTab = 'actionItemCategoriesTab';
  private readonly organizationNameInput = '[name="orgName"]';
  private readonly organizationDescriptionInput = '[name="orgDescrip"]';
  private readonly organizationLocationInput = '[name="address.line1"]';
  private readonly isPublicSwitch = 'user-reg-switch';
  private readonly saveChangesButton = 'save-org-changes-btn';
  private readonly openDeleteModalButton = 'openDeleteModalBtn';
  private readonly confirmDeleteButton = 'deleteOrganizationBtn';
  private readonly closeDeleteModalButton = 'closeDelOrgModalBtn';
  private readonly deleteOrganizationModal =
    this.modalActions('[role="dialog"]');

  protected self(): OrganizationSettingsPage {
    return this;
  }

  openFromDrawer(timeout = 30000): this {
    this.byDataCy(this.settingsDrawerButton, timeout)
      .should('be.visible')
      .click();
    this.assertUrlMatch(/\/admin\/orgsetting\/[a-f0-9-]+/, timeout);
    return this;
  }

  visitPage(orgId: string, timeout = 30000): this {
    this.visit(`/admin/orgsetting/${orgId}`);
    this.assertUrlIncludes(`/admin/orgsetting/${orgId}`, timeout);
    return this;
  }

  openGeneralTab(timeout = 10000): this {
    this.byTestId(this.generalSettingsButton, timeout)
      .should('be.visible')
      .click();
    this.byTestId(this.generalTab, timeout).should('be.visible');
    return this;
  }

  openActionItemCategoriesTab(timeout = 10000): this {
    this.byTestId(this.actionItemCategoriesButton, timeout)
      .should('be.visible')
      .click();
    this.byTestId(this.actionItemCategoriesTab, timeout).should('be.visible');
    return this;
  }

  updateOrganizationName(name: string, timeout = 10000): this {
    cy.get(this.organizationNameInput, { timeout })
      .should('be.visible')
      .clear()
      .type(name);
    return this;
  }

  updateOrganizationDescription(description: string, timeout = 10000): this {
    cy.get(this.organizationDescriptionInput, { timeout })
      .should('be.visible')
      .clear()
      .type(description);
    return this;
  }

  updateOrganizationLocation(location: string, timeout = 10000): this {
    cy.get(this.organizationLocationInput, { timeout })
      .should('be.visible')
      .clear()
      .type(location);
    return this;
  }

  toggleIsPublic(timeout = 10000): this {
    this.byTestId(this.isPublicSwitch, timeout).should('be.visible').click();
    return this;
  }

  saveChanges(timeout = 10000): this {
    this.byTestId(this.saveChangesButton, timeout).should('be.visible').click();
    return this;
  }

  openDeleteOrganizationModal(timeout = 10000): this {
    this.byTestId(this.openDeleteModalButton, timeout)
      .should('be.visible')
      .click();
    this.deleteOrganizationModal.waitVisible(timeout);
    return this;
  }

  closeDeleteOrganizationModal(timeout = 10000): this {
    this.deleteOrganizationModal.clickByTestId(this.closeDeleteModalButton, {
      timeout,
    });
    return this;
  }

  confirmDeleteOrganization(timeout = 10000): this {
    this.deleteOrganizationModal.clickByTestId(this.confirmDeleteButton, {
      timeout,
    });
    return this;
  }
}
