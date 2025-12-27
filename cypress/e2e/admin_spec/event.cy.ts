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
    // Create event
    eventPage.createEvent(
      'Testing Event Creation',
      'This is a test event created during E2E testing.',
      'Test Location',
    );

    // Visit events page to see the created event
    eventPage.visitEventPage();

    // Update the event
    eventPage.updateEvent(
      'Testing Event Creation',
      'Updated Event Name',
      'This is a test event created during E2E testing. Updated.',
      'Updated Location',
    );

    // Visit events page to see the updated event
    eventPage.visitEventPage();

    // Delete the event
    eventPage.deleteEvent('Updated Event Name');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
