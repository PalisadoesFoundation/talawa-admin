/// <reference types="cypress" />
import { ModalActions } from '../shared/ModalActions';
import { TableActions } from '../shared/TableActions';

export class PeoplePage {
  private readonly _peopleTabButton = '[data-cy="leftDrawerButton-People"]';
  private readonly _searchInput = '[placeholder="Enter Full Name"]';
  private readonly _searchButton = '[data-testid="searchbtn"]';
  private readonly _addMembersBtn = '[data-testid="addMembers-toggle"]';
  private readonly _existingUserToggle =
    '[data-testid="addMembers-item-existingUser"]';
  private readonly _searchUserInput = '[data-testid="searchUser"]';
  private readonly _submitSearchBtn = '[data-testid="submitBtn"]';
  private readonly _addBtn = '[data-testid="addBtn"]';
  private readonly _removeModalBtn = '[data-testid="removeMemberModalBtn"]';
  private readonly _confirmRemoveBtnTestId = 'removeMemberBtn';
  private readonly _alert = '[role=alert]';
  private readonly tableActions = new TableActions('.MuiDataGrid-root');
  private readonly removeMemberModal = new ModalActions('[role="dialog"]');

  visitPeoplePage(): void {
    cy.get(this._peopleTabButton).should('be.visible').click();
    cy.url().should('match', /\/admin\/orgpeople\/[a-f0-9-]+/);
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
    this.tableActions.findRowByText(name, timeout);
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
    cy.get(this._searchUserInput, { timeout })
      .should('be.visible')
      .clear()
      .type(name);
    cy.get(this._submitSearchBtn, { timeout }).should('be.visible').click();
    cy.contains(name, { timeout }).should('be.visible');
    return this;
  }

  confirmAddUser(name: string, timeout = 100000) {
    cy.get(this._addBtn, { timeout }).first().should('be.visible').click();
    cy.contains(this._alert, 'Member added Successfully', { timeout }).should(
      'be.visible',
    );
    cy.reload();
    this.searchMemberByName(name, timeout);
    this.verifyMemberInList(name, timeout);
    return this;
  }

  deleteMember(name: string, timeout = 40000) {
    this.searchMemberByName(name, timeout);
    cy.then(() => {
      this.tableActions.waitVisible(timeout);
      this.tableActions.clickRowActionByText(
        name,
        this._removeModalBtn,
        timeout,
      );
    });

    this.removeMemberModal
      .waitVisible(timeout)
      .clickByTestId(this._confirmRemoveBtnTestId, { timeout });

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

  verifyMinRows(minRows: number, timeout = 40000) {
    this.tableActions.expectMinRows(minRows, timeout);
    return this;
  }
}
