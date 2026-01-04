import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { AdminEventPage } from '../../pageObjects/AdminPortal/AdminEventPage';

describe('Admin Event Tab', () => {
  const dashboard = new AdminDashboardPage();
  const eventPage = new AdminEventPage();

  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    eventPage.visitEventPage();
  });

  it('create, update, and delete an event', () => {
    const eventName = `Test Event ${Date.now()}`;
    const updatedEventName = `Updated ${eventName}`;

    // Create event
    eventPage.createEvent(
      eventName,
      'This is a test event created during E2E testing.',
      'Test Location',
    );

    // Update the event
    eventPage.updateEvent(
      eventName,
      updatedEventName,
      'This is a test event created during E2E testing. Updated.',
      'Updated Location',
    );

    // Delete the event
    eventPage.deleteEvent(updatedEventName);
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
