export class PeoplePage {
  private readonly _peopleTabButton = '[data-cy="leftDrawerButton-People"]';
  private readonly _searchInput = '[placeholder="Enter Full Name"]';
  private readonly _searchButton = '[data-testid="searchbtn"]';
  private readonly _searchResult = '[data-field="name"]';
  private readonly _addMembersBtn = '[data-testid="addMembers"]';
  private readonly _existingUserToggle = '[data-testid="existingUser"]';
  private readonly _searchUserInput = '[data-testid="searchUser"]';
  private readonly _submitSearchBtn = '[data-testid="submitBtn"]';
  private readonly _addBtn = '[data-testid="addBtn"]';
  private readonly _removeModalBtn = '[data-testid="removeMemberModalBtn"]';
  private readonly _confirmRemoveBtn = '[data-testid="removeMemberBtn"]';
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
    cy.get(this._searchResult, { timeout })
      .should('be.visible')
      .and('contain.text', name);
    return this;
  }

  clickAddExistingMember(timeout = 40000) {
    // Click the dropdown toggle first (SortingButton with testIdPrefix="addMembers")
    cy.get(this._addMembersBtn, { timeout }).should('be.visible').click();
    // Wait for dropdown menu to appear and click the existingUser option
    cy.get(this._existingUserToggle, { timeout })
      .should('be.visible')
      .click();
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
    this.verifyMemberInList(name, timeout);

    // Wait for DataGrid to stabilize after search
    cy.wait(1000);

    // Scope search to DataGrid rows to avoid matching headers/other UI
    cy.get('.MuiDataGrid-row', { timeout })
      .contains(name)
      .should('be.visible')
      .parents('.MuiDataGrid-row')
      .find(this._removeModalBtn)
      .should('be.visible')
      .click();

    cy.get(this._confirmRemoveBtn, { timeout }).should('be.visible').click();
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
