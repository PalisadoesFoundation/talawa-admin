export class ActionItemPage {
  private readonly createActionItemBtn = '[data-cy="createActionItemBtn"]';
  private readonly categorySelect = '[data-cy="categorySelect"]';
  private readonly memberSelect = '[data-cy="memberSelect"]';
  private readonly submitBtn = '[data-cy="submitBtn"]';
  private readonly sortBtn = '[data-testid="sort"]';
  private readonly sortByAssignedAtDesc = '[data-testid="assignedAt_DESC"]';
  private readonly editItemBtn = '[data-testid^="editItemBtn"]';
  private readonly viewItemBtn = '[data-testid^="viewItemBtn"]';
  private readonly statusCheckbox = '[data-testid^="statusCheckbox"]';
  private readonly postCompletionNotes = '[data-cy="postCompletionNotes"]';
  private readonly createCompletionBtn = '[data-testid="createBtn"]';
  private readonly deleteItemBtn = '[data-testid^="deleteItemBtn"]';
  private readonly deleteYesBtn = '[data-testid="deleteyesbtn"]';
  private readonly modalCloseBtn = '[data-testid="modalCloseBtn"]';
  private readonly notesInput = '[data-cy="preCompletionNotes"]';

  visitActionItemsTab() {
    cy.get('[data-cy="leftDrawerButton-Action Items"]')
      .should('be.visible')
      .click();
    cy.url().should('match', /\/orgactionitems\/[a-f0-9-]+/);
    return this;
  }

  createActionItem(category: string, member: string) {
    cy.get(this.createActionItemBtn).should('be.visible').click();
    cy.get(this.categorySelect).should('be.visible').click();
    cy.get('ul[role="listbox"] li').contains(category).click();
    cy.get(this.memberSelect).should('be.visible').click();
    cy.get('ul[role="listbox"] li').contains(member).click();
    cy.get(this.submitBtn).should('be.visible').click();
    cy.assertToast('Action Item created successfully');
    return this;
  }

  sortByNewest() {
    cy.get(this.sortBtn).should('be.visible').click();
    cy.get(this.sortByAssignedAtDesc).should('be.visible').click();
    return this;
  }

  editFirstActionItem(newNotes: string) {
    cy.get(this.editItemBtn).first().click();
    cy.get(this.notesInput).should('be.visible').type(newNotes);
    cy.get(this.submitBtn).should('be.visible').click();
    cy.assertToast('Action Item updated successfully');
    return this;
  }

  viewFirstActionItemAndCloseModal() {
    cy.get(this.viewItemBtn).first().click();
    cy.get(this.modalCloseBtn).should('be.visible').click();
    return this;
  }

  markFirstActionItemAsComplete(completionNotes: string) {
    cy.get(this.statusCheckbox).first().click();
    cy.get(this.postCompletionNotes).type(completionNotes);
    cy.get(this.createCompletionBtn).should('be.visible').click();
    cy.assertToast('Completed');
    return this;
  }

  deleteFirstActionItem() {
    cy.get(this.deleteItemBtn).first().click();
    cy.get(this.deleteYesBtn).should('be.visible').click();
    cy.assertToast('Action Item deleted successfully');
    return this;
  }
}
