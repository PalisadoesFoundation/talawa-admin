export class AdminEventPage {
  private readonly _eventsTabButton = '[data-cy="leftDrawerButton-Events"]';
  private readonly _venueTabButton = '[data-cy="leftDrawerButton-Events"]';
  private readonly _createEventModalButton = '[data-cy="createEventModalBtn"]';
  private readonly _eventTitleInput = '[data-cy="eventTitleInput"]';
  private readonly _eventDescriptionInput = '[data-cy="eventDescriptionInput"]';
  private readonly _eventLocationInput = '[data-cy="eventLocationInput"]';
  private readonly _createEventBtn = '[data-cy="createEventBtn"]';
  // Note: Form.Switch components use data-testid (not data-cy) as this is the
  // established pattern for React Bootstrap Form.Switch components across the codebase
  // and aligns with React Testing Library's getByTestId queries in unit tests
  private readonly _inviteOnlyEventCheck =
    '[data-testid="inviteOnlyEventCheck"]';
  private readonly _updateNameInput = '[data-cy="updateName"]';
  private readonly _updateDescriptionInput = '[data-cy="updateDescription"]';
  private readonly _updateLocationInput = '[data-cy="updateLocation"]';
  private readonly _updateIsInviteOnly = '[data-testid="updateIsInviteOnly"]';
  private readonly _previewUpdateEventBtn = '[data-cy="previewUpdateEventBtn"]';
  private readonly _confirmUpdateEventBtn =
    '[data-testid="confirmUpdateEventBtn"]';
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
    // Wait for form to be fully loaded, including invite-only checkbox if present
    // This ensures all form elements are ready before submission
    cy.get(this._createEventBtn).should('be.visible');
    // Check if invite-only checkbox exists and wait for it if present
    cy.get('body').then(($body) => {
      if ($body.find(this._inviteOnlyEventCheck).length > 0) {
        cy.get(this._inviteOnlyEventCheck).should('be.visible');
      }
    });
    cy.get(this._createEventBtn).scrollIntoView().click();
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
    // Wait for update modal to fully load
    cy.get(this._updateNameInput).should('be.visible');
    cy.get(this._updateNameInput).clear().type(name);
    cy.get(this._updateDescriptionInput)
      .should('be.visible')
      .clear()
      .type(description);
    cy.get(this._updateLocationInput)
      .should('be.visible')
      .clear()
      .type(location);
    // Check for invite-only checkbox if present
    cy.get('body').then(($body) => {
      if ($body.find(this._updateIsInviteOnly).length > 0) {
        cy.get(this._updateIsInviteOnly).should('be.visible');
      }
    });
    // Scroll button into view and click (implicitly waits for visibility)
    cy.get(this._previewUpdateEventBtn).scrollIntoView().click();
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

  /**
   * Checks if the invite-only checkbox is available in the create event modal.
   * @returns Cypress chainable that resolves to true if checkbox exists, false otherwise
   */
  isInviteOnlyCheckboxAvailable() {
    return cy.get('body').then(($body) => {
      return $body.find(this._inviteOnlyEventCheck).length > 0;
    });
  }

  /**
   * Checks if the invite-only checkbox is available in the update event modal.
   * @returns Cypress chainable that resolves to true if checkbox exists, false otherwise
   */
  isUpdateInviteOnlyCheckboxAvailable() {
    return cy.get('body').then(($body) => {
      return $body.find(this._updateIsInviteOnly).length > 0;
    });
  }

  /**
   * Creates an event with invite-only enabled (if checkbox is available).
   * @param title - Event title
   * @param description - Event description
   * @param location - Event location
   */
  createEventWithInviteOnly(
    title: string,
    description: string,
    location: string,
  ): void {
    cy.get(this._createEventModalButton).should('be.visible').click();
    cy.get(this._eventTitleInput).should('be.visible').type(title);
    cy.get(this._eventDescriptionInput).should('be.visible').type(description);
    cy.get(this._eventLocationInput).should('be.visible').type(location);
    cy.get(this._createEventBtn).should('be.visible');
    // Check if invite-only checkbox exists and toggle it if present
    cy.get('body').then(($body) => {
      if ($body.find(this._inviteOnlyEventCheck).length > 0) {
        cy.get(this._inviteOnlyEventCheck)
          .should('be.visible')
          .should('not.be.checked')
          .check({ force: true });
        cy.get(this._inviteOnlyEventCheck).should('be.checked');
      }
    });
    cy.get(this._createEventBtn).scrollIntoView().click();
    cy.assertToast('Congratulations! The Event is created.');
  }

  /**
   * Creates an event with invite-only disabled (if checkbox is available).
   * @param title - Event title
   * @param description - Event description
   * @param location - Event location
   */
  createEventWithoutInviteOnly(
    title: string,
    description: string,
    location: string,
  ): void {
    cy.get(this._createEventModalButton).should('be.visible').click();
    cy.get(this._eventTitleInput).should('be.visible').type(title);
    cy.get(this._eventDescriptionInput).should('be.visible').type(description);
    cy.get(this._eventLocationInput).should('be.visible').type(location);
    cy.get(this._createEventBtn).should('be.visible');
    // Check if invite-only checkbox exists and ensure it's unchecked
    cy.get('body').then(($body) => {
      if ($body.find(this._inviteOnlyEventCheck).length > 0) {
        cy.get(this._inviteOnlyEventCheck)
          .should('be.visible')
          .should('not.be.checked');
      }
    });
    cy.get(this._createEventBtn).scrollIntoView().click();
    cy.assertToast('Congratulations! The Event is created.');
  }

  /**
   * Updates an event and toggles the invite-only status (if checkbox is available).
   * @param existingName - Name of the event to update
   * @param name - New event name
   * @param description - New event description
   * @param location - New event location
   * @param enableInviteOnly - Whether to enable invite-only (true) or disable it (false)
   */
  updateEventToggleInviteOnly(
    existingName: string,
    name: string,
    description: string,
    location: string,
    enableInviteOnly: boolean,
  ): void {
    cy.get(this._venueTabButton).should('be.visible').click();
    cy.get(this._eventsTabButton).should('be.visible').click();
    cy.get('[data-testid="card"]').contains(existingName).click();
    // Click "Edit Event" button to open update form
    cy.get('[data-cy="previewUpdateEventBtn"]').should('be.visible').click();
    // Wait for update modal to fully load
    cy.get(this._updateNameInput).should('be.visible');
    cy.get(this._updateNameInput).clear().type(name);
    cy.get(this._updateDescriptionInput)
      .should('be.visible')
      .clear()
      .type(description);
    cy.get(this._updateLocationInput)
      .should('be.visible')
      .clear()
      .type(location);
    // Toggle invite-only checkbox if present
    cy.get('body').then(($body) => {
      if ($body.find(this._updateIsInviteOnly).length > 0) {
        cy.get(this._updateIsInviteOnly).should('be.visible');
        cy.get(this._updateIsInviteOnly).then(($checkbox) => {
          const isChecked = $checkbox.is(':checked');
          if (enableInviteOnly && !isChecked) {
            cy.get(this._updateIsInviteOnly).check({ force: true });
            cy.get(this._updateIsInviteOnly).should('be.checked');
          } else if (!enableInviteOnly && isChecked) {
            cy.get(this._updateIsInviteOnly).uncheck({ force: true });
            cy.get(this._updateIsInviteOnly).should('not.be.checked');
          }
        });
      }
    });
    // Scroll button into view and click (implicitly waits for visibility)
    cy.get('[data-testid="confirmUpdateEventBtn"]').scrollIntoView().click();
    cy.assertToast('Event updated successfully.');
  }
}
