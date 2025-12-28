export class AdminEventPage {
  private readonly _eventsTabButton = '[data-cy="leftDrawerButton-Events"]';
  private readonly _createEventModalButton = '[data-cy="createEventModalBtn"]';
  private readonly _eventTitleInput = '[data-cy="eventTitleInput"]';
  private readonly _eventDescriptionInput = '[data-cy="eventDescriptionInput"]';
  private readonly _eventLocationInput = '[data-cy="eventLocationInput"]';
  private readonly _createEventBtn = '[data-cy="createEventBtn"]';
  private readonly _eventCard = '[data-testid="card"]';

  visitEventPage(): void {
    cy.get(this._eventsTabButton).should('be.visible').click();
    cy.url().should('match', /\/orgevents\/[a-f0-9-]+/);
  }

  createEvent(title: string, description: string, location: string): this {
    // Click create event button and wait for modal to appear
    cy.get(this._createEventModalButton).should('be.visible').click();

    // Wait for modal form to be fully rendered
    cy.get(this._eventTitleInput).should('be.visible').and('be.enabled');

    // Clear and type each field, then verify the value was set
    cy.get(this._eventTitleInput).clear().type(title);
    cy.get(this._eventTitleInput).should('have.value', title);

    cy.get(this._eventDescriptionInput).clear().type(description);
    cy.get(this._eventDescriptionInput).should('have.value', description);

    cy.get(this._eventLocationInput).clear().type(location);
    cy.get(this._eventLocationInput).should('have.value', location);

    // Submit the form
    cy.get(this._createEventBtn).should('be.visible').and('be.enabled').click();

    // Assert success toast
    cy.assertToast('Congratulations! The Event is created.');

    return this;
  }

  findEventCard(eventName: string): Cypress.Chainable {
    // Wait for events to load and find the specific event card
    return cy
      .get(this._eventCard, { timeout: 30000 })
      .contains(eventName, { timeout: 30000 });
  }

  openEventDetails(eventName: string): this {
    this.findEventCard(eventName).click();
    return this;
  }

  updateEvent(
    existingName: string,
    newName: string,
    newDescription: string,
    newLocation: string,
  ): this {
    // Find and click on the event card
    this.openEventDetails(existingName);

    // Wait for edit form to load and update fields
    cy.get('[data-cy="updateName"]', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type(newName);
    cy.get('[data-cy="updateName"]').should('have.value', newName);

    cy.get('[data-cy="updateDescription"]')
      .should('be.visible')
      .clear()
      .type(newDescription);

    cy.get('[data-cy="updateLocation"]')
      .should('be.visible')
      .clear()
      .type(newLocation);

    // Click update button
    cy.get('[data-cy="previewUpdateEventBtn"]')
      .should('be.visible')
      .and('be.enabled')
      .click();

    cy.assertToast('Event updated successfully.');

    return this;
  }

  deleteEvent(eventName: string): this {
    // Find and click on the event card
    this.openEventDetails(eventName);

    // Click delete button in event details
    cy.get('[data-cy="deleteEventModalBtn"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Confirm deletion
    cy.get('[data-testid="deleteEventBtn"]').should('be.visible').click();

    cy.assertToast('Event deleted successfully.');

    return this;
  }

  verifyEventNotInList(eventTitle: string, timeout = 40000): this {
    // Verify the event doesn't appear in the event list
    // Using should('not.exist') handles the case where no cards exist
    cy.contains(this._eventCard, eventTitle, { timeout }).should('not.exist');
    return this;
  }
}
