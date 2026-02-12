import { AdminEventPage } from '../../pageObjects/AdminPortal/AdminEventPage';

describe('Admin Event Tab', () => {
  const eventPage = new AdminEventPage();
  let orgId = '';

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } }).then(
      ({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
      },
    );
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.visit(`/admin/orgdash/${orgId}`);
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

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId);
    }
  });
});
