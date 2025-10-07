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

  it('create an event with all fields', () => {
    eventPage.createEvent(
      'Testing Event Creation',
      'This is a test event created during E2E testing.',
      'Test Location',
    );
  });

  it('update the created event', () => {
    eventPage.updateEvent(
      'Testing Event Creation',
      'Updated Event Name',
      'This is a test event created during E2E testing. Updated.',
      'Updated Location',
    );
  });

  it('delete the created event', () => {
    eventPage.deleteEvent('Updated Event Name');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
