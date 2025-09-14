import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';

describe('Admin Event Tab', () => {
  const dashboard = new AdminDashboardPage();
  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    cy.get('[data-cy="leftDrawerButton-Events"]').should('be.visible').click();
    cy.url().should('match', /\/orgevents\/[a-f0-9-]+/);
  });

  it('create an event with all fields and update different fields', () => {
    cy.get('[data-cy="createEventModalBtn"]').should('be.visible').click();
    cy.get('[data-cy="eventTitleInput"]')
      .should('be.visible')
      .type('Testing Event Creation');
    cy.get('[data-cy="eventDescriptionInput"]')
      .should('be.visible')
      .type('This is a test event created during E2E testing.');
    cy.get('[data-cy="eventLocationInput"]')
      .should('be.visible')
      .type('Test Location');
    cy.get('[data-cy="createEventBtn"]').should('be.visible').click();
    cy.assertToast('Congratulations! The Event is created.');
  });

  it('update the created event', () => {
    cy.get('[data-cy="leftDrawerButton-Venues"]').should('be.visible').click();
    cy.get('[data-cy="leftDrawerButton-Events"]').should('be.visible').click();
    cy.get('[data-testid="card"]').contains('Testing Event Creation').click();
    cy.get('[data-cy="updateName"]')
      .should('be.visible')
      .clear()
      .type('Updated Event Name');
    cy.get('[data-cy="updateDescription"]')
      .should('be.visible')
      .clear()
      .type('This is a test event created during E2E testing. Updated.');
    cy.get('[data-cy="updateLocation"]')
      .should('be.visible')
      .clear()
      .type('Updated Location');
    cy.get('[data-cy="previewUpdateEventBtn"]').should('be.visible').click();
    cy.assertToast('Event updated successfully.');
  });

  it('delete the created event', () => {
    cy.get('[data-cy="leftDrawerButton-Venues"]').should('be.visible').click();
    cy.get('[data-cy="leftDrawerButton-Events"]').should('be.visible').click();
    cy.get('[data-testid="card"]')
      .should('be.visible')
      .should('contain.text', 'Updated Event Name');
    cy.get('[data-testid="card"]').contains('Updated Event Name').click();
    cy.get('[data-cy="deleteEventModalBtn"]').should('be.visible').click();
    cy.get('[data-testid="deleteEventBtn"]').should('be.visible').click();
    cy.assertToast('Event deleted successfully.');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});

// import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
// import { AdminEventPage } from '../../pageObjects/AdminPortal/AdminEventPage';

// describe('Admin Event Tab', () => {
//     const dashboard = new AdminDashboardPage();
//     const eventPage = new AdminEventPage();

//     beforeEach(() => {
//         cy.loginByApi('admin');
//         dashboard.visit().verifyOnDashboard().openFirstOrganization();
//         eventPage.openEventsTab();
//     });

//     it('create an event with all fields', () => {
//         eventPage.createEvent(
//             'Testing Event Creation',
//             'This is a test event created during E2E testing.',
//             'Test Location'
//         );
//     });

//     it('update the created event', () => {
//         eventPage.updateEvent(
//             'Testing Event Creation',
//             'Updated Event Name',
//             'This is a test event created during E2E testing. Updated.',
//             'Updated Location'
//         );
//     });

//     it('delete the created event', () => {
//         eventPage.deleteEvent('Updated Event Name');
//     });

//     afterEach(() => {
//         cy.clearCookies();
//         cy.clearLocalStorage();
//     });
// });
