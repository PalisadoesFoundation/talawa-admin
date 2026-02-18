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
    cy.url().should('match', /\/admin\/orgevents\/[a-f0-9-]+/);
  }

  createEvent(title: string, description: string, location: string): this {
    // Set up intercept for specific events query (not all GraphQL operations)
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetOrganizationEvents') {
        req.alias = 'eventsQuery';
      }
    });

    cy.get(this._createEventModalButton)
      .should('be.visible')
      .should('be.enabled');
    cy.get(this._createEventModalButton).click({ force: true });

    // Wait for modal form to be fully rendered
    cy.get(this._eventTitleInput).should('be.visible').and('be.enabled');

    // Clear and type each field, breaking up command chains to handle page re-renders
    cy.get(this._eventTitleInput).clear();
    cy.get(this._eventTitleInput).type(title);
    cy.get(this._eventTitleInput).should('have.value', title);

    cy.get(this._eventDescriptionInput).clear();
    cy.get(this._eventDescriptionInput).type(description);
    cy.get(this._eventDescriptionInput).should('have.value', description);

    cy.get(this._eventLocationInput).clear();
    cy.get(this._eventLocationInput).type(location);
    cy.get(this._eventLocationInput).should('have.value', location);

    // Submit the form
    cy.get(this._createEventBtn).should('be.visible').and('be.enabled').click();

    // Assert success toast
    cy.assertToast('Congratulations! The Event is created.');

    // Wait for modal to close
    cy.get(this._eventTitleInput).should('not.exist');

    // Reload to ensure fresh data and wait for specific events query to complete
    cy.reload();
    cy.wait('@eventsQuery', { timeout: 15000 });

    // Wait for page to fully load
    cy.get(this._createEventModalButton, { timeout: 10000 }).should(
      'be.visible',
    );

    // Cypress cannot click this due to calendar cards overlapping the button.
    // This is a known Cypress actionability limitation — force click is required.
    cy.get('[data-testid="more"]')
      .filter(':contains("View all")')
      .each(($btn) => {
        cy.wrap($btn).click({ force: true });
      })
      .then(($buttons) => {
        // Wait for all clicks to be flushed; branch on whether any buttons existed.
        if ($buttons.length === 0) {
          return;
        }
        cy.contains(this._eventCard, title, { timeout: 30000 }).should('exist');
      });

    return this;
  }

  findEventCard(eventName: string): Cypress.Chainable {
    // Find the specific event card containing the event name
    // This pattern retries until an element matching both selector AND text is found
    return cy.contains(this._eventCard, eventName, { timeout: 30000 });
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

    // Wait for edit form to load and update fields, breaking up command chains
    cy.get('[data-cy="updateName"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="updateName"]').clear();
    cy.get('[data-cy="updateName"]').type(newName);
    cy.get('[data-cy="updateName"]').should('have.value', newName);

    cy.get('[data-cy="updateDescription"]').should('be.visible');
    cy.get('[data-cy="updateDescription"]').clear();
    cy.get('[data-cy="updateDescription"]').type(newDescription);

    cy.get('[data-cy="updateLocation"]').should('be.visible');
    cy.get('[data-cy="updateLocation"]').clear();
    cy.get('[data-cy="updateLocation"]').type(newLocation);

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
