export class PeoplePage {
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

  searchMemberByName(name: string) {
    cy.get(this._searchInput).should('be.visible').clear().type(name);
    cy.get(this._searchButton).should('be.visible').click();
    return this;
  }

  verifyMemberInList(name: string) {
    cy.get(this._searchResult).should('be.visible').and('contain.text', name);
    return this;
  }

  clickAddExistingMember() {
    cy.get(this._addMembersBtn).should('be.visible').click();
    cy.get(this._existingUserToggle).should('be.visible').trigger('click');
    return this;
  }

  searchAndSelectUser(name: string) {
    cy.get(this._searchUserInput).should('be.visible').type(name);
    cy.get(this._submitSearchBtn).should('be.visible').click();
    cy.contains(name).should('be.visible');
    return this;
  }

  confirmAddUser() {
    cy.get(this._addBtn).should('be.visible').click();
    cy.get(this._alert)
      .should('be.visible')
      .and('contain.text', 'Member added Successfully');
    return this;
  }

  deleteMember(name: string) {
    this.searchMemberByName(name);
    this.verifyMemberInList(name);
    cy.get(this._removeModalBtn).should('be.visible').click();
    cy.get(this._confirmRemoveBtn).should('be.visible').click();
    cy.get(this._alert)
      .should('be.visible')
      .and('contain.text', 'The Member is removed');
    return this;
  }

  resetSearch() {
    cy.get(this._searchInput).should('be.visible').clear();
    cy.get(this._searchButton).should('be.visible').click();
    return this;
  }
}
