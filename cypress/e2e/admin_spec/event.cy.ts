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

  describe('Invite-only event functionality', () => {
    it('should create an event with invite-only enabled when feature flag is enabled', () => {
      // Open create modal via Page Object
      eventPage.openCreateEventModal();

      eventPage.isInviteOnlyCheckboxAvailable().then((isAvailable) => {
        if (isAvailable) {
          // Feature flag is enabled - test creating event with invite-only
          eventPage.closeCreateEventModal();
          eventPage.createEventWithInviteOnly(
            'Invite Only Event',
            'This is an invite-only event created during E2E testing.',
            'Test Location',
          );
        } else {
          // Feature flag is disabled - skip this test
          eventPage.closeCreateEventModal();
          cy.log('Skipping test: invite-only feature flag is disabled');
        }
      });
    });

    it('should create an event with invite-only disabled when feature flag is enabled', () => {
      // Open create modal via Page Object
      eventPage.openCreateEventModal();

      eventPage.isInviteOnlyCheckboxAvailable().then((isAvailable) => {
        if (isAvailable) {
          // Feature flag is enabled - test creating event without invite-only
          eventPage.closeCreateEventModal();
          eventPage.createEventWithoutInviteOnly(
            'Public Event',
            'This is a public event created during E2E testing.',
            'Test Location',
          );
        } else {
          // Feature flag is disabled - skip this test
          eventPage.closeCreateEventModal();
          cy.log('Skipping test: invite-only feature flag is disabled');
        }
      });
    });

    it('should update event to toggle invite-only status when feature flag is enabled', () => {
      // First, create an event to update
      eventPage.createEvent(
        'Event To Toggle Invite Only',
        'This event will be updated to toggle invite-only status.',
        'Test Location',
      );

      // Open the update modal for this specific event via Page Object
      eventPage.openUpdateModalForEvent('Event To Toggle Invite Only');

      eventPage.isUpdateInviteOnlyCheckboxAvailable().then((isAvailable) => {
        if (isAvailable) {
          // Feature flag is enabled - test toggling invite-only
          eventPage.closeUpdateEventModal();

          // Enable invite-only
          eventPage.updateEventToggleInviteOnly(
            'Event To Toggle Invite Only',
            'Event To Toggle Invite Only',
            'This event will be updated to toggle invite-only status.',
            'Test Location',
            true, // Enable invite-only
          );
          // Disable invite-only
          eventPage.updateEventToggleInviteOnly(
            'Event To Toggle Invite Only',
            'Event To Toggle Invite Only',
            'This event will be updated to toggle invite-only status.',
            'Test Location',
            false, // Disable invite-only
          );
        } else {
          // Feature flag is disabled - skip this test
          eventPage.closeUpdateEventModal();
          cy.log('Skipping test: invite-only feature flag is disabled');
        }
      });
    });

    it('should not show invite-only checkbox when feature flag is disabled', () => {
      eventPage.openCreateEventModal();

      eventPage.isInviteOnlyCheckboxAvailable().then((isAvailable) => {
        if (!isAvailable) {
          // Feature flag is disabled - verify checkbox is not visible
          eventPage.verifyInviteOnlyCheckboxAbsence();
          cy.log(
            'Verified: invite-only checkbox is not available (feature flag disabled)',
          );
        } else {
          // Feature flag is enabled - this test doesn't apply
          cy.log('Skipping test: invite-only feature flag is enabled');
        }
        eventPage.closeCreateEventModal();
      });
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
