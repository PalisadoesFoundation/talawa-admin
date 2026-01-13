export class PeoplePage {
  private readonly _peopleTabButton = '[data-cy="leftDrawerButton-People"]';
  private readonly _searchInput = '[data-testid="searchbtn"]';
  private readonly _searchButton = '[data-testid="searchBtn"]';
  private readonly _tableRows = 'table tbody tr';
  private readonly _addMembersBtn = '[data-testid="addMembers"]';
  private readonly _existingUserToggle = '[data-testid="existingUser"]';
  private readonly _searchUserInput = '[data-testid="searchUser"]';
  private readonly _submitSearchBtn = '[data-testid="submitBtn"]';
  private readonly _addBtn = '[data-testid="addBtn"]';
  private readonly _alert = '[role=alert]';

  visitPeoplePage(): void {
    cy.get(this._peopleTabButton).should('be.visible').click();
    cy.url().should('match', /\/orgpeople\/[a-f0-9-]+/);
  }

  searchMemberByName(name: string, timeout = 40000) {
    cy.get(this._searchInput, { timeout })
      .should('be.visible')
      .clear()
      .type(name);
    cy.get(this._searchButton, { timeout }).should('be.visible').click();
    return this;
  }

  verifyMemberInList(name: string, timeout = 40000) {
    cy.get(this._tableRows, { timeout })
      .should('be.visible')
      .and('contain.text', name);
    return this;
  }

  clickAddExistingMember(timeout = 40000) {
    cy.get(this._addMembersBtn, { timeout }).should('be.visible').click();
    cy.get(this._existingUserToggle, { timeout })
      .should('be.visible')
      .trigger('click');
    return this;
  }

  searchAndSelectUser(name: string, timeout = 40000) {
    cy.get(this._searchUserInput, { timeout }).should('be.visible').type(name);
    cy.get(this._submitSearchBtn, { timeout }).should('be.visible').click();
    cy.contains(name, { timeout }).should('be.visible');
    return this;
  }

  confirmAddUser(name: string, timeout = 100000) {
    cy.get(this._addBtn, { timeout }).should('be.visible').click();
    cy.get(this._alert, { timeout })
      .should('be.visible')
      .and('contain.text', 'Member added Successfully');
    cy.reload();
    this.searchMemberByName(name, timeout);
    this.verifyMemberInList(name, timeout);
    return this;
  }

  deleteMember(name: string, timeout = 40000) {
    this.searchMemberByName(name, timeout);

    // Wait for search to complete - break the chain to avoid detachment issues
    cy.contains(this._tableRows, name, { timeout }).should('be.visible');

    // Re-query to find the row and click remove button
    cy.contains(this._tableRows, name)
      .parents('tr')
      .find('button[data-testid^="removeMemberModalBtn-"]')
      .should('be.visible')
      .click();

    // Click the confirm remove button in the modal footer
    cy.get('[data-testid="remove-member-modal"]', { timeout })
      .should('be.visible')
      .find('[data-testid="modal-footer"]')
      .within(() => {
        cy.contains('button', /remove/i)
          .should('be.visible')
          .click();
      });

    cy.get(this._alert, { timeout })
      .should('be.visible')
      .and('contain.text', 'The Member is removed');
    return this;
  }

  resetSearch(timeout = 40000) {
    cy.get(this._searchInput, { timeout }).should('be.visible').clear();
    cy.get(this._searchButton, { timeout }).should('be.visible').click();
    return this;
  }
}
