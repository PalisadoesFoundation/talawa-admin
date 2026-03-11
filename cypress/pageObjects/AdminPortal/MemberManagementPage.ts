import { BasePage } from '../base/BasePage';

export class MemberManagementPage extends BasePage<MemberManagementPage> {
  private readonly peopleTabButton = 'leftDrawerButton-People';
  private readonly searchInput = 'member-search-input';
  private readonly searchButton = 'searchBtn';
  private readonly addMembersButton = 'addMembers-toggle';
  private readonly existingUserToggle = 'addMembers-item-existingUser';
  private readonly searchUserInput = 'searchUser';
  private readonly submitSearchButton = 'submitBtn';
  private readonly addButton = 'addBtn';
  private readonly removeMemberActionSelector =
    '[data-testid="removeMemberModalBtn"]';
  private readonly confirmRemoveMemberButton = 'removeMemberBtn';
  private readonly alertSelector = '[role=alert]';
  private readonly tableSelector = '[role="table"]';
  private readonly rowSelector = '[role="row"][data-testid^="org-people-row-"]';
  private readonly removeMemberModal = this.modalActions('[role="dialog"]');

  protected self(): MemberManagementPage {
    return this;
  }

  openFromDrawer(timeout = 40000): this {
    this.byDataCy(this.peopleTabButton, timeout).should('be.visible').click();
    this.assertUrlMatch(/\/admin\/orgpeople\/[a-f0-9-]+/, timeout);
    return this;
  }

  visitPage(orgId: string, timeout = 40000): this {
    this.visit(`/admin/orgpeople/${orgId}`);
    this.assertUrlIncludes(`/admin/orgpeople/${orgId}`, timeout);
    return this;
  }

  searchMemberByName(name: string, timeout = 40000): this {
    this.byTestId(this.searchInput, timeout)
      .should('be.visible')
      .clear()
      .type(name);
    this.byTestId(this.searchButton, timeout).should('be.visible').click();
    return this;
  }

  verifyMemberInList(name: string, timeout = 40000): this {
    cy.get(`${this.tableSelector} ${this.rowSelector}`, { timeout })
      .contains(name)
      .should('be.visible');
    return this;
  }

  clickAddExistingMember(timeout = 40000): this {
    this.byTestId(this.addMembersButton, timeout).should('be.visible').click();
    this.byTestId(this.existingUserToggle, timeout)
      .should('be.visible')
      .trigger('click');
    return this;
  }

  searchAndSelectUser(name: string, timeout = 40000): this {
    this.byTestId(this.searchUserInput, timeout)
      .should('be.visible')
      .clear()
      .type(name);
    this.byTestId(this.submitSearchButton, timeout)
      .should('be.visible')
      .click();
    cy.contains(name, { timeout }).should('be.visible');
    return this;
  }

  confirmAddUser(name: string, timeout = 100000): this {
    void name;
    this.byTestId(this.addButton, timeout).first().should('be.visible').click();
    return this;
  }

  closeAddMemberModal(timeout = 40000): this {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="addExistingUserModal"]').length > 0) {
        cy.get('[data-testid="addExistingUserModal"]')
          .find('[data-testid="modalCloseBtn"]')
          .first()
          .click({ force: true });
      }
    });
    cy.get('[data-testid="addExistingUserModal"]', { timeout }).should(
      'not.exist',
    );
    return this;
  }

  deleteMember(name: string, timeout = 40000): this {
    this.searchMemberByName(name, timeout);

    cy.get(`${this.tableSelector} ${this.rowSelector}`, { timeout })
      .contains(name)
      .closest(this.rowSelector)
      .find(this.removeMemberActionSelector)
      .should('be.visible')
      .click();

    this.removeMemberModal
      .waitVisible(timeout)
      .clickByTestId(this.confirmRemoveMemberButton, { timeout });

    this.getAlert(timeout).should('be.visible');

    return this;
  }

  resetSearch(timeout = 40000): this {
    this.byTestId(this.searchInput, timeout).should('be.visible').clear();
    this.byTestId(this.searchButton, timeout).should('be.visible').click();
    return this;
  }

  getAlert(timeout = 40000): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.alertSelector, { timeout });
  }

  verifyMinRows(minRows: number, timeout = 40000): this {
    cy.get(`${this.tableSelector} ${this.rowSelector}`, { timeout }).should(
      'have.length.at.least',
      minRows,
    );
    return this;
  }
}
