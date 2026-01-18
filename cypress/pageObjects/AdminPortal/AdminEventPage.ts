export class AdminEventPage {
  private readonly _eventsTabButton = '[data-cy="leftDrawerButton-Events"]';
  private readonly _venueTabButton = '[data-cy="leftDrawerButton-Events"]';
  private readonly _createEventModalButton = '[data-cy="createEventModalBtn"]';
  private readonly _eventTitleInput = '[data-cy="eventTitleInput"]';
  private readonly _eventDescriptionInput = '[data-cy="eventDescriptionInput"]';
  private readonly _eventLocationInput = '[data-cy="eventLocationInput"]';
  private readonly _createEventBtn = '[data-cy="createEventBtn"]';
  private readonly _updateNameInput = '[data-cy="updateName"]';
  private readonly _updateDescriptionInput = '[data-cy="updateDescription"]';
  private readonly _updateLocationInput = '[data-cy="updateLocation"]';
  private readonly _previewUpdateEventBtn = '[data-cy="previewUpdateEventBtn"]';
  private readonly _deleteEventModalBtn = '[data-cy="deleteEventModalBtn"]';
  private readonly _deleteEventBtn = '[data-testid="deleteEventBtn"]';

  visitEventPage(): void {
    cy.get(this._eventsTabButton).should('be.visible').click();
    cy.url().should('match', /\/orgevents\/[a-f0-9-]+/);
  }

  createEvent(title: string, description: string, location: string): void {
    cy.get(this._createEventModalButton).should('be.visible').click();
    cy.get(this._eventTitleInput).should('be.visible').type(title);
    cy.get(this._eventDescriptionInput).should('be.visible').type(description);
    cy.get(this._eventLocationInput).should('be.visible').type(location);
    cy.get(this._createEventBtn).should('be.visible').click();
    cy.assertToast('Congratulations! The Event is created.');
  }

  updateEvent(
    existingName: string,
    name: string,
    description: string,
    location: string,
  ): void {
    cy.get(this._venueTabButton).should('be.visible').click();
    cy.get(this._eventsTabButton).should('be.visible').click();
    cy.get('[data-testid="card"]').contains(existingName).click();
    cy.get(this._updateNameInput).should('be.visible').clear().type(name);
    cy.get(this._updateDescriptionInput)
      .should('be.visible')
      .clear()
      .type(description);
    cy.get(this._updateLocationInput)
      .should('be.visible')
      .clear()
      .type(location);
    cy.get(this._previewUpdateEventBtn).should('be.visible').click();
    cy.assertToast('Event updated successfully.');
  }

  deleteEvent(name: string): void {
    cy.get(this._venueTabButton).should('be.visible').click();
    cy.get(this._eventsTabButton).should('be.visible').click();
    cy.get('[data-testid="card"]')
      .should('be.visible')
      .should('contain.text', name);
    cy.get('[data-testid="card"]').contains(name).click();
    cy.get(this._deleteEventModalBtn).should('be.visible').click();
    cy.get(this._deleteEventBtn).should('be.visible').click();
    cy.assertToast('Event deleted successfully.');
  }
}
