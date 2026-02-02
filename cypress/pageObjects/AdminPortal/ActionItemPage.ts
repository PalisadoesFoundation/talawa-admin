export class ActionItemPage {
  private readonly createActionItemBtn = '[data-cy="createActionItemBtn"]';
  private readonly categorySelect = '[data-cy="categorySelect"]';
  private readonly memberSelect = '[data-cy="memberSelect"]';
  private readonly volunteerSelect = '[data-cy="volunteerSelect"]';
  private readonly submitBtn = '[data-testid="modal-submit-btn"]';
  private readonly sortBtn = '[data-testid="sort-toggle"]';
  private readonly sortByAssignedAtDesc =
    '[data-testid="sort-item-assignedAt_DESC"]';
  private readonly editItemBtn = '[data-testid^="editItemBtn"]';
  private readonly viewItemBtn = '[data-testid^="viewItemBtn"]';
  private readonly statusCheckbox = '[data-testid^="statusCheckbox"]';
  private readonly postCompletionNotes = '[data-cy="postCompletionNotes"]';
  private readonly createCompletionBtn = '[data-testid="createBtn"]';
  private readonly completionBtnSeries = '[data-cy="markCompletionForSeries"]';
  private readonly deleteItemBtn = '[data-testid^="deleteItemBtn"]';
  private readonly deleteYesBtn = '[data-testid="modal-delete-btn"]';
  private readonly modalCloseBtn = '[data-testid="modalCloseBtn"]';
  private readonly notesInput = '[data-cy="preCompletionNotes"]';

  // Event page selectors
  private readonly eventsTabButton = '[data-cy="leftDrawerButton-Events"]';
  private readonly eventCard = '[data-testid="card"]';
  private readonly showEventDashboardBtn =
    '[data-testid="showEventDashboardBtn"]';
  private readonly actionItemsTab = '[data-testid="actionsBtn"]';

  visitActionItemsTab() {
    cy.get('[data-cy="leftDrawerButton-Action Items"]')
      .should('be.visible')
      .click();
    cy.url().should('match', /\/orgactionitems\/[a-f0-9-]+/);
    return this;
  }

  visitEventsPage() {
    cy.get(this.eventsTabButton).should('be.visible').click();
    cy.url().should('match', /\/admin\/orgevents\/[a-f0-9-]+/);
    return this;
  }

  selectFirstEvent() {
    cy.get(this.eventCard).first().should('be.visible').click();
    return this;
  }

  clickShowEventDashboard() {
    cy.get(this.showEventDashboardBtn).should('be.visible').click();
    return this;
  }

  navigateToEventActionItemsTab() {
    // After being in event dashboard, click action items tab
    cy.get(this.actionItemsTab).should('be.visible').click();
    return this;
  }

  visitEventActionItems() {
    this.visitEventsPage();
    this.selectFirstEvent();
    // After selecting event, click "Show Event Dashboard" button
    this.clickShowEventDashboard();

    // Now click the action items tab within the event dashboard
    this.navigateToEventActionItemsTab();
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

  createActionItemWithVolunteer(category: string) {
    cy.get(this.createActionItemBtn).should('be.visible').click();
    cy.get(this.categorySelect).should('be.visible').click();
    cy.get('ul[role="listbox"] li').contains(category).click();
    cy.get(this.volunteerSelect).should('be.visible').click();
    cy.get('ul[role="listbox"] li').first().click();
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
    cy.get(this.completionBtnSeries).should('be.visible').click();
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
