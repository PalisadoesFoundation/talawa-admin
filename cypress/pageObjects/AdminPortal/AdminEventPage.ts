export class AdminEventPage {
  openEventsTab(): void {
    cy.get('[data-cy="leftDrawerButton-Events"]').should('be.visible').click();
    cy.url().should('match', /\/orgevents\/[a-f0-9-]+/);
  }

  createEvent(title: string, description: string, location: string): void {
    cy.get('[data-cy="createEventModalBtn"]').should('be.visible').click();
    cy.get('[data-cy="eventTitleInput"]').should('be.visible').type(title);
    cy.get('[data-cy="eventDescriptionInput"]')
      .should('be.visible')
      .type(description);
    cy.get('[data-cy="eventLocationInput"]')
      .should('be.visible')
      .type(location);
    cy.get('[data-cy="createEventBtn"]').should('be.visible').click();
    cy.assertToast('Congratulations! The Event is created.');
    cy.wait(2000);
  }

  updateEvent(
    existingName: string,
    name: string,
    description: string,
    location: string,
  ): void {
    cy.get('[data-testid="card"]').contains(existingName).click();
    cy.get('[data-cy="updateName"]').should('be.visible').clear().type(name);
    cy.get('[data-cy="updateDescription"]')
      .should('be.visible')
      .clear()
      .type(description);
    cy.get('[data-cy="updateLocation"]')
      .should('be.visible')
      .clear()
      .type(location);
    cy.get('[data-cy="previewUpdateEventBtn"]').should('be.visible').click();
    cy.assertToast('Event updated successfully.');
  }

  deleteEvent(name: string): void {
    cy.get('[data-testid="card"]')
      .should('be.visible')
      .should('contain.text', name);
    cy.get('[data-testid="card"]').contains(name).click();
    cy.get('[data-cy="deleteEventModalBtn"]').should('be.visible').click();
    cy.get('[data-testid="deleteEventBtn"]').should('be.visible').click();
    cy.assertToast('Event deleted successfully.');
  }
}
