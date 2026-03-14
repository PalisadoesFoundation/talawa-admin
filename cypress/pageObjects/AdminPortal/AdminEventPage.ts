export class AdminEventPage {
  private readonly _eventsTabButton = '[data-cy="leftDrawerButton-Events"]';
  private readonly _createEventModalButton = '[data-cy="createEventModalBtn"]';
  private readonly _eventTitleInput = '[data-cy="eventTitleInput"]';
  private readonly _eventDescriptionInput = '[data-cy="eventDescriptionInput"]';
  private readonly _eventLocationInput = '[data-cy="eventLocationInput"]';
  private readonly _createEventBtn = '[data-cy="createEventBtn"]';
  private readonly _eventCard = '[data-testid="card"]';
  // Selectors that match all-day event renderers in FullCalendar
  private readonly _allDayChip = '[data-cy="calendar-all-day-chip"]';
  private readonly _fcEvent = '.fc-event, .fc-daygrid-event';

  /**
   * Combined selector that matches both timed event cards
   * and all-day event renderers (chips / FullCalendar elements).
   */
  private anyEventSelector(): string {
    return [this._eventCard, this._allDayChip, this._fcEvent].join(', ');
  }

  visitEventPage(): void {
    cy.get(this._eventsTabButton).should('be.visible').click();
    cy.url().should('match', /\/admin\/orgevents\/[a-f0-9-]+/);
  }

  createEvent(title: string, description: string, location: string): this {
    // Set up intercepts for GraphQL operations
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreateEvent') {
        req.alias = 'CreateEvent';
      }
      if (req.body.operationName === 'GetOrganizationEvents') {
        req.alias = 'eventsQuery';
      }
    });

    cy.get(this._createEventModalButton)
      .should('be.visible')
      .should('be.enabled');
    cy.get(this._createEventModalButton).click({
      force: true,
    });

    // Wait for modal form to be fully rendered
    cy.get(this._eventTitleInput).should('be.visible').and('be.enabled');

    // Clear and type each field
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

    // Wait for CreateEvent mutation to complete
    cy.wait('@CreateEvent', { timeout: 15000 })
      .its('response.statusCode')
      .should('eq', 200);

    // Assert success toast
    cy.assertToast('Congratulations! The Event is created.');

    // Wait for modal to close
    cy.get(this._eventTitleInput).should('not.exist');

    // Reload to ensure fresh data
    cy.reload();
    cy.wait('@eventsQuery', { timeout: 15000 });

    // Wait for page to fully load
    cy.get(this._createEventModalButton, {
      timeout: 10000,
    }).should('be.visible');

    // Expand collapsed calendar cells
    cy.get('body').then(($body) => {
      const $allMore = $body.find('[data-testid="more"]');
      $allMore.each((_: number, el: HTMLElement) => {
        if (/view all/i.test(el.innerText || el.textContent || '')) {
          cy.wrap(el).click({ force: true });
        }
      });
    });

    // Accept both timed and all-day renderers
    cy.contains(this.anyEventSelector(), title, {
      timeout: 30000,
    }).should('exist');

    return this;
  }

  findEventCard(eventName: string): Cypress.Chainable {
    // Find the specific event element (timed card or all-day chip)
    return cy.contains(this.anyEventSelector(), eventName, {
      timeout: 30000,
    });
  }

  openEventDetails(eventName: string): this {
    this.findEventCard(eventName).click({ force: true });
    return this;
  }

  updateEvent(
    existingName: string,
    newName: string,
    newDescription: string,
    newLocation: string,
  ): this {
    this.openEventDetails(existingName);

    const typeOpts = { delay: 30 };
    cy.get(this._eventTitleInput, { timeout: 10000 }).should('be.visible');
    cy.get(this._eventTitleInput).clear();
    cy.get(this._eventTitleInput).should('have.value', '');
    cy.get(this._eventTitleInput).type(newName, typeOpts);
    cy.get(this._eventTitleInput).should('have.value', newName);

    cy.get(this._eventDescriptionInput).clear();
    cy.get(this._eventDescriptionInput).should('have.value', '');
    cy.get(this._eventDescriptionInput).type(newDescription, typeOpts);
    cy.get(this._eventDescriptionInput).should('have.value', newDescription);

    cy.get(this._eventLocationInput).clear();
    cy.get(this._eventLocationInput).should('have.value', '');
    cy.get(this._eventLocationInput).type(newLocation, typeOpts);
    cy.get(this._eventLocationInput).should('have.value', newLocation);

    cy.get('[data-cy="previewUpdateEventBtn"]')
      .should('be.visible')
      .and('be.enabled')
      .click();

    cy.assertToast('Event updated successfully.');

    return this;
  }

  deleteEvent(eventName: string): this {
    this.openEventDetails(eventName);

    cy.get('[data-cy="deleteEventModalBtn"]', {
      timeout: 10000,
    })
      .should('be.visible')
      .click();

    cy.get('[data-testid="deleteEventBtn"]').should('be.visible').click();

    cy.assertToast('Event deleted successfully.');

    return this;
  }

  verifyEventNotInList(eventTitle: string, timeout = 40000): this {
    // Verify the event doesn't appear in any event renderer
    cy.contains(this.anyEventSelector(), eventTitle, {
      timeout,
    }).should('not.exist');
    return this;
  }
}
