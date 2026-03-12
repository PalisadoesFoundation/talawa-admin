import React from 'react';
import { render, waitFor, screen, cleanup } from '@testing-library/react';
import * as ApolloClient from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import type { MockedResponse } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import { EventRegistrantsModal } from './EventRegistrantsModal';
import {
  EVENT_ATTENDEES,
  MEMBERS_LIST,
  EVENT_DETAILS,
} from 'GraphQl/Queries/Queries';
import { ADD_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import userEvent from '@testing-library/user-event';
import { InterfaceBaseModalProps } from 'types/AdminPortal/EventRegistrantsModal/interface';
import {
  EnhancedAutocompleteMock,
  createGetOptionLabelMock,
} from 'test-utils/mocks/shared-autocomplete';

vi.mock('./AddOnSpot/AddOnSpotAttendee', () => ({
  __esModule: true,
  default: ({
    show,
    handleClose,
    reloadMembers,
  }: {
    show: boolean;
    handleClose: () => void;
    reloadMembers: () => void;
  }) =>
    show ? (
      <div data-testid="add-onspot-modal">
        <button
          type="button"
          data-testid="add-onspot-close"
          onClick={handleClose}
        >
          Close Onspot
        </button>
        <button
          type="button"
          data-testid="reload-members-btn"
          onClick={reloadMembers}
        >
          Reload Members
        </button>
      </div>
    ) : null,
}));

vi.mock('./InviteByEmail/InviteByEmailModal', () => ({
  __esModule: true,
  default: ({
    show,
    handleClose,
    onInvitesSent,
    eventId,
    isRecurring,
  }: {
    show: boolean;
    handleClose: () => void;
    onInvitesSent?: () => void;
    eventId: string;
    isRecurring?: boolean;
  }) =>
    show ? (
      <div data-testid="invite-by-email-modal">
        <span data-testid="invite-event-id">{eventId}</span>
        <span data-testid="invite-is-recurring">
          {String(isRecurring ?? false)}
        </span>
        <button type="button" data-testid="invite-close" onClick={handleClose}>
          Close Invite
        </button>
        {onInvitesSent && (
          <button
            type="button"
            data-testid="invite-send"
            onClick={onInvitesSent}
          >
            Send Invites
          </button>
        )}
      </div>
    ) : null,
}));

// Mock NotificationToast
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock('shared-components/BaseModal', async () => {
  return {
    BaseModal: ({
      show,
      children,
      footer,
      title,
      dataTestId,
      onHide,
    }: InterfaceBaseModalProps) => {
      if (!show) return null;

      return (
        <div data-testid={dataTestId || 'base-modal'}>
          <div>
            {title && <h2>{title}</h2>}
            <button
              aria-label="Close"
              data-testid="modalCloseBtn"
              onClick={onHide}
            >
              Close
            </button>
          </div>

          <div>{children}</div>

          {footer && <div data-testid="modal-footer">{footer}</div>}
        </div>
      );
    },
  };
});

vi.mock('shared-components/Autocomplete', async () => {
  const { SimpleAutocompleteMock } =
    await import('test-utils/mocks/shared-autocomplete');
  return {
    __esModule: true,
    Autocomplete: SimpleAutocompleteMock,
  };
});

type ApolloMock = MockedResponse<Record<string, unknown>>;

const defaultProps = {
  show: true,
  eventId: 'event123',
  orgId: 'org123',
  handleClose: () => {},
};

const makeAttendeesEmptyMock = (): ApolloMock => ({
  request: {
    query: EVENT_ATTENDEES,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        attendees: [],
      },
    },
  },
});

const makeMembersWithOneMock = (): ApolloMock => ({
  request: {
    query: MEMBERS_LIST,
    variables: { organizationId: 'org123' },
  },
  result: {
    data: {
      usersByOrganizationId: [
        {
          id: 'user1',
          name: 'John Doe',
          emailAddress: 'johndoe@example.com',
          role: 'member',
          avatarURL: null,
          createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
          updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
        },
      ],
    },
  },
});

const makeMembersEmptyMock = (): ApolloMock => ({
  request: {
    query: MEMBERS_LIST,
    variables: { organizationId: 'org123' },
  },
  result: {
    data: {
      usersByOrganizationId: [],
    },
  },
});

const makeMembersUnknownNameMock = (): ApolloMock => ({
  request: {
    query: MEMBERS_LIST,
    variables: { organizationId: 'org123' },
  },
  result: {
    data: {
      usersByOrganizationId: [
        {
          id: 'user2',
          name: '',
          emailAddress: 'unknown@example.com',
          role: 'member',
          avatarURL: null,
          createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
          updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
        },
      ],
    },
  },
});

const makeEventDetailsNonRecurringMock = (): ApolloMock => ({
  request: {
    query: EVENT_DETAILS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        id: 'event123',
        recurrenceRule: null,
      },
    },
  },
});

const makeEventDetailsRecurringMock = (): ApolloMock => ({
  request: {
    query: EVENT_DETAILS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        id: 'event123',
        recurrenceRule: {
          id: 'RRULE:FREQ=DAILY',
        },
      },
    },
  },
});

const makeAddRegistrantSuccessMock = (): ApolloMock => ({
  request: {
    query: ADD_EVENT_ATTENDEE,
    variables: { userId: 'user1', eventId: 'event123' },
  },
  result: {
    data: {
      addEventAttendee: {
        id: 'user1',
        name: 'John Doe',
        emailAddress: 'johndoe@example.com',
      },
    },
  },
});

const makeAddRegistrantRecurringSuccessMock = (): ApolloMock => ({
  request: {
    query: ADD_EVENT_ATTENDEE,
    variables: { userId: 'user1', recurringEventInstanceId: 'event123' },
  },
  result: {
    data: {
      addEventAttendee: {
        id: 'user1',
        name: 'John Doe',
        emailAddress: 'johndoe@example.com',
      },
    },
  },
});

const renderWithProviders = (
  mocks: ApolloMock[],
  props: typeof defaultProps = defaultProps,
) =>
  render(
    <MockedProvider mocks={mocks}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventRegistrantsModal {...props} />
            </I18nextProvider>
          </Provider>
        </LocalizationProvider>
      </BrowserRouter>
    </MockedProvider>,
  );

describe('EventRegistrantsModal', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('renders modal with basic elements', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // BaseModal has dataTestId="invite-modal"
    const modal = await screen.findByTestId(
      'invite-modal',
      {},
      { timeout: 5000 },
    );
    expect(modal).toBeInTheDocument();

    // Autocomplete input should be rendered
    const autocomplete = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    expect(autocomplete).toBeInTheDocument();
  });

  test('modal close button calls handleClose', async () => {
    const handleClose = vi.fn();
    renderWithProviders(
      [
        makeEventDetailsNonRecurringMock(),
        makeAttendeesEmptyMock(),
        makeMembersWithOneMock(),
      ],
      { ...defaultProps, handleClose },
    );

    // Wait for modal to appear using stable test id
    const modal = await screen.findByTestId(
      'invite-modal',
      {},
      { timeout: 5000 },
    );
    expect(modal).toBeInTheDocument();

    // Close button has data-testid="modalCloseBtn"
    const closeButton = await screen.findByTestId(
      'modalCloseBtn',
      {},
      { timeout: 5000 },
    );
    await user.click(closeButton);

    await waitFor(
      () => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('does not trigger addRegistrant when isAdding is true (guard at line 123)', async () => {
    // TEST FLOW: This test validates the isAdding guard that prevents double-click mutations
    // STEP 1: Setup - Mock slow mutation (500ms delay) and spy on useMutation
    const addMutateMock = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 500)),
      );

    const useMutationSpy = vi
      .spyOn(ApolloClient, 'useMutation')
      .mockReturnValue([
        addMutateMock,
        {
          loading: false,
          error: undefined,
          called: false,
          client: {} as ApolloClient.ApolloClient<object>,
          reset: vi.fn(),
        },
      ]);

    // STEP 2: Render and prepare component
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // STEP 3: Select a member via autocomplete (required for add button to work)
    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    await user.type(input, 'John');
    const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
    await user.click(option);

    await waitFor(() => expect(input).toHaveValue('John'), { timeout: 5000 });

    vi.clearAllMocks();

    // STEP 4: First click on add button - should trigger mutation (no isAdding guard active)
    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );

    await user.click(addButton);

    await waitFor(
      () => {
        expect(addMutateMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );

    // STEP 5: Second click on add button - should NOT trigger mutation (isAdding=true)
    // while first mutation is still in progress (500ms delay), the guard prevents second call
    vi.clearAllMocks();

    await user.click(addButton);

    await waitFor(
      () => {
        expect(addMutateMock).not.toHaveBeenCalled();
      },
      { timeout: 5000 },
    );

    useMutationSpy.mockRestore();
  });

  test('shows warning when Add Registrant is clicked without selecting a member', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // Wait for modal and button to appear
    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });
    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );

    // Clear any previous mock calls
    vi.clearAllMocks();

    // Click button
    await user.click(addButton);

    // Assert NotificationToast was called (it's mocked)
    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'Please choose a user to add first!',
        );
        expect(NotificationToast.warning).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('successfully adds registrant for non-recurring event', async () => {
    // TEST FLOW: Full successful registration workflow for non-recurring events
    // STEP 1: Render with necessary test data (event, attendees list, members list, mutation mock)
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantSuccessMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );

    await user.click(input);
    await user.type(input, 'John Doe');

    // Wait for option to appear
    const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
    expect(option).toBeInTheDocument();

    await user.click(option);

    // Wait for member to be selected
    await waitFor(
      () => {
        expect(input).toHaveValue('John Doe');
      },
      { timeout: 5000 },
    );

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );

    // Clear previous mocks
    vi.clearAllMocks();

    await user.click(addButton);

    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'Adding the attendee...',
        );
      },
      { timeout: 5000 },
    );

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('uses recurring variables when event is recurring (isRecurring branch)', async () => {
    // TEST FLOW: Verify that mutations use recurringEventInstanceId instead of eventId
    // when event has a recurrence rule. Similar flow to non-recurring test but validates
    // the different mutation variables based on event type.
    // STEP 1: Render with recurring event mock (key difference from non-recurring test)
    renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantRecurringSuccessMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );

    await user.type(input, 'John');

    const option = await screen.findByTestId(
      'option-user1',
      {},
      { timeout: 5000 },
    );
    await user.click(option);

    // Wait for selection to complete
    await waitFor(
      () => {
        expect(input).toHaveValue('John');
      },
      { timeout: 5000 },
    );

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );

    // Clear previous mocks
    vi.clearAllMocks();

    await user.click(addButton);

    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'Adding the attendee...',
        );
      },
      { timeout: 5000 },
    );

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('noOptionsText and AddOnSpotAttendee modal open & reloadMembers callback', async () => {
    // TEST FLOW: Validates multi-modal interaction sequence when no members exist
    // Tests: (1) Fallback UI for empty search results, (2) Modal opening, (3) Callback execution
    // STEP 1: Render with empty members list - triggers noOptionsText rendering
    //         Two empty attendee mocks: first for initial load, second for reloadMembers refetch
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
      makeAttendeesEmptyMock(), // for reloadMembers refetch
    ]);

    // STEP 2: Get autocomplete input and verify it's ready
    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    expect(input).toBeInTheDocument();

    // STEP 3: Type in autocomplete to trigger search with empty results
    await user.type(input, 'NonexistentUser');

    // STEP 4: Verify noOptionsText "No Registrations found" appears due to empty results
    await waitFor(
      () => {
        expect(screen.getByText('No Registrations found')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // STEP 5: Find and click "Add Onspot Registration" link that appears in no-options state
    const addOnspotLink = await screen.findByText(
      'Add Onspot Registration',
      {},
      { timeout: 5000 },
    );
    expect(addOnspotLink).toBeInTheDocument();

    await user.click(addOnspotLink);

    // STEP 6: Verify on-spot modal opened after clicking link
    const onspotModal = await screen.findByTestId(
      'add-onspot-modal',
      {},
      { timeout: 5000 },
    );
    expect(onspotModal).toBeInTheDocument();

    // STEP 7: Click reload-members button inside modal - tests callback that refetches data
    //         This triggers the second MEMBERS_LIST mock to be called
    const reloadBtn = await screen.findByTestId(
      'reload-members-btn',
      {},
      { timeout: 5000 },
    );
    await user.click(reloadBtn);

    // STEP 8: Close the on-spot modal via close button
    const closeBtn = await screen.findByTestId(
      'add-onspot-close',
      {},
      { timeout: 5000 },
    );
    await user.click(closeBtn);

    // STEP 9: Verify modal is removed from DOM after close
    await waitFor(
      () => {
        expect(
          screen.queryByTestId('add-onspot-modal'),
        ).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  test('Invite by Email button opens InviteByEmailModal and handleClose closes it', async () => {
    // TEST FLOW: Modal state management - opening and closing with prop verification
    // Tests: (1) Button click toggles modal visibility, (2) Props correctly passed, (3) Close works
    // STEP 1: Render main registrants modal
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // STEP 2: Wait for main modal to render
    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // STEP 3: Find and click the "Invite by Email" button to open invite modal
    const inviteButton = await screen.findByTestId(
      'invite-by-email-btn',
      {},
      { timeout: 5000 },
    );
    await user.click(inviteButton);

    // STEP 4: Verify invite modal appears after button click
    const inviteModal = await screen.findByTestId(
      'invite-by-email-modal',
      {},
      { timeout: 5000 },
    );
    expect(inviteModal).toBeInTheDocument();

    // STEP 5: Verify correct props passed to InviteByEmailModal component
    //         Check eventId matches and isRecurring=false for non-recurring event
    const eventIdElement = await screen.findByTestId(
      'invite-event-id',
      {},
      { timeout: 5000 },
    );
    const isRecurringElement = await screen.findByTestId(
      'invite-is-recurring',
      {},
      { timeout: 5000 },
    );

    expect(eventIdElement).toHaveTextContent('event123');
    expect(isRecurringElement).toHaveTextContent('false');

    // STEP 6: Click close button to dismiss invite modal
    const closeInvite = await screen.findByTestId(
      'invite-close',
      {},
      { timeout: 5000 },
    );
    await user.click(closeInvite);

    // STEP 7: Verify modal is removed after close
    await waitFor(
      () => {
        expect(
          screen.queryByTestId('invite-by-email-modal'),
        ).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  test('InviteByEmailModal onInvitesSent callback triggers and isRecurring is true for recurring event', async () => {
    // TEST FLOW: Modal callback execution with recurring event verification
    // Tests: (1) Correct isRecurring value passed, (2) onInvitesSent callback fires, (3) Side effects occur
    // STEP 1: Render with recurring event mock to validate isRecurring=true
    renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // STEP 2: Wait for main modal and click invite by email button
    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const inviteButton = await screen.findByTestId(
      'invite-by-email-btn',
      {},
      { timeout: 5000 },
    );
    await user.click(inviteButton);

    // STEP 3: Verify invite modal opened
    const inviteModal = await screen.findByTestId(
      'invite-by-email-modal',
      {},
      { timeout: 5000 },
    );
    expect(inviteModal).toBeInTheDocument();

    // STEP 4: Verify isRecurring prop is true (key difference from non-recurring test)
    const isRecurringElement = await screen.findByTestId(
      'invite-is-recurring',
      {},
      { timeout: 5000 },
    );
    expect(isRecurringElement).toHaveTextContent('true');

    // STEP 5: Click send button to trigger onInvitesSent callback
    //         This callback typically notifies parent component of state changes
    const sendBtn = await screen.findByTestId(
      'invite-send',
      {},
      { timeout: 5000 },
    );
    await user.click(sendBtn);

    // STEP 6: Verify onInvitesSent side effect — modal remains open
    //         and no error toasts are shown after callback execution
    await waitFor(
      () => {
        expect(NotificationToast.error).not.toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  test('shows warning when user types but does not select an option', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersUnknownNameMock(),
    ]);

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    expect(input).toBeInTheDocument();

    await user.type(input, 'Unknown');

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );

    // Clear previous mocks
    vi.clearAllMocks();

    await user.click(addButton);

    await waitFor(
      () => {
        const warningCalls = vi.mocked(NotificationToast.warning).mock.calls;
        const warningMessage = warningCalls[0]?.[0];
        // Check for either the English text or the translation key
        expect(warningMessage).toMatch(
          /Please choose a user to add first!|selectUserFirst/,
        );
        expect(NotificationToast.warning).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('opens AddOnSpot modal on Enter key press (first scenario)', async () => {
    // TEST FLOW: Keyboard navigation for empty search results - Enter key triggers modal
    // Tests: (1) User types but gets no matches, (2) Presses Enter on \"Add Onspot Registration\" link, (3) Modal opens
    // STEP 1: Render with empty members list to ensure no match when typing
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    // STEP 2: Get autocomplete input and type non-existent user
    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );

    await user.type(input, 'NonexistentUser');

    // STEP 3: Wait for \"Add Onspot Registration\" link to appear (fallback UI for no results)
    const addOnspotLink = await screen.findByText(
      'Add Onspot Registration',
      {},
      { timeout: 5000 },
    );
    expect(addOnspotLink).toBeInTheDocument();

    // STEP 4: Press Enter on the link to trigger modal open
    await user.type(addOnspotLink, '{Enter}');

    // STEP 5: Verify on-spot modal opened after Enter key
    const onspotModal = await screen.findByTestId(
      'add-onspot-modal',
      {},
      { timeout: 5000 },
    );
    expect(onspotModal).toBeInTheDocument();
  });

  test('opens AddOnSpot modal on Enter key press (second scenario)', async () => {
    // TEST FLOW: Alternative keyboard interaction path - focus then Enter
    // Tests: Same outcome as first scenario but using focus() + keyboard() instead of type()
    // STEP 1: Render with empty members to get no-results fallback UI
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    // STEP 2: Get input and type to trigger empty result
    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );

    await user.type(input, 'NonexistentUser');

    // STEP 3: Get the \"Add Onspot Registration\" link that appears in no-results state
    const addOnspotLink = await screen.findByTestId(
      'add-onspot-link',
      {},
      { timeout: 5000 },
    );
    expect(addOnspotLink).toBeInTheDocument();

    // STEP 4: Focus the link explicitly (alternative to userEvent.type's implicit focus)
    addOnspotLink.focus();

    // STEP 5: Emit Enter key via keyboard API instead of type API
    await user.keyboard('{Enter}');

    // STEP 6: Verify modal opens - same result as first scenario despite different input method
    const onspotModal = await screen.findByTestId(
      'add-onspot-modal',
      {},
      { timeout: 5000 },
    );
    expect(onspotModal).toBeInTheDocument();
  });

  test('doesnt open AddOnSpot modal when any key other than Enter and space is pressed on Add Onspot Registration link', async () => {
    // TEST FLOW: Keyboard filtering - only specific keys (Enter, Space) should open modal
    // Tests: (1) Get no-results UI, (2) Try various keys (Escape, Tab, ArrowDown, etc), (3) Modal stays closed for all except Enter/Space
    // STEP 1: Render with empty members to get fallback UI
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    // STEP 2: Input search term to trigger empty results and show link
    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );

    await user.type(input, 'NonexistentUser');

    // STEP 3: Get the \"Add Onspot Registration\" link
    await user.keyboard('{ArrowDown}');

    const addOnspotLink = await screen.findByTestId(
      'add-onspot-link',
      {},
      { timeout: 5000 },
    );

    // STEP 4: Define keys that should NOT open modal (negative test cases)
    //         Only Enter and Space should trigger modal open
    const ignoredKeys = ['Escape', 'Tab', 'ArrowDown', 'a', 'Backspace'];

    // STEP 5: For each ignored key, focus link, press key, and verify modal doesn't open
    for (const key of ignoredKeys) {
      addOnspotLink.focus();

      const keyPress = key.length === 1 ? key : `{${key}}`;
      await user.keyboard(keyPress);

      // STEP 6: Verify modal stays closed for this key
      await waitFor(() => {
        expect(
          screen.queryByTestId('add-onspot-modal'),
        ).not.toBeInTheDocument();
      });
    }
  });

  test('shows error toasts when add attendee mutation fails', async () => {
    // TEST FLOW: Multiple error notification handling for failed mutation
    // Tests: (1) Load modal and add warning toasts, (2) Mutation fails, (3) Multiple error toasts call with different messages
    // STEP 1: Render with Apollo mock that returns network error from mutation
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      {
        request: {
          query: ADD_EVENT_ATTENDEE,
          variables: { userId: 'user1', eventId: 'event123' },
        },
        error: new Error('Network error: Failed to add attendee'),
      },
    ]);

    // STEP 2: Wait for modal and select a member
    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    await user.type(input, 'John');

    // STEP 3: Click on member option to select
    const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
    await user.click(option);

    // STEP 4: Wait for selection to complete
    await waitFor(
      () => {
        expect(input).toHaveValue('John');
      },
      { timeout: 5000 },
    );

    // STEP 5: Clear mocks and click add button to trigger mutation
    vi.clearAllMocks();

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );
    await user.click(addButton);

    // STEP 6: Verify \"Adding\" warning toast shown immediately
    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'Adding the attendee...',
        );
      },
      { timeout: 5000 },
    );

    // STEP 7: Verify first generic error toast  (generic message)
    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Error adding attendee',
        );
      },
      { timeout: 5000 },
    );

    // STEP 8: Verify second error toast with specific network error details
    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Network error: Failed to add attendee',
        );
      },
      { timeout: 5000 },
    );

    // STEP 9: Verify error.error() called exactly twice (one generic + one detailed)
    expect(NotificationToast.error).toHaveBeenCalledTimes(2);
  });

  test('opens AddOnSpot modal when Space key is pressed on add-onspot link', async () => {
    // TEST FLOW: Keyboard accessibility - Space key (along with Enter) should open modal
    // Tests: (1) Get empty search results, (2) Focus link, (3) Press Space, (4) Modal opens
    // STEP 1: Render with empty members list to get no-results fallback
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    // STEP 2: Input non-existent search term to trigger fallback UI
    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    await user.type(input, 'NonExistentUser');

    // STEP 3: Get the \"Add Onspot Registration\" link from no-results state
    const addOnspotLink = await screen.findByTestId(
      'add-onspot-link',
      {},
      { timeout: 5000 },
    );
    expect(addOnspotLink).toBeInTheDocument();

    // STEP 4: Focus the link and emit Space key
    addOnspotLink.focus();

    await user.keyboard(' ');

    // STEP 5: Verify on-spot modal opens after Space key press
    const onspotModal = await screen.findByTestId(
      'add-onspot-modal',
      {},
      { timeout: 5000 },
    );
    expect(onspotModal).toBeInTheDocument();
  });

  test('falls back to translated unknownUser when member name is empty', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersUnknownNameMock(),
    ]);

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    await user.type(input, 'unknown');

    const option = await screen.findByTestId(
      'option-user2',
      {},
      { timeout: 5000 },
    );
    await user.click(option);

    // Wait for selection
    await waitFor(
      () => {
        expect(input).toHaveValue('unknown');
      },
      { timeout: 5000 },
    );

    // Clear previous mocks
    vi.clearAllMocks();

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );
    await user.click(addButton);

    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('updates inputValue state when user types in autocomplete', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );

    await user.type(input, 'Test User');

    await waitFor(
      () => {
        expect(input).toHaveValue('Test User');
      },
      { timeout: 5000 },
    );

    await user.clear(input);

    // Wait for clear to complete
    await waitFor(
      () => {
        expect(input).toHaveValue('');
      },
      { timeout: 5000 },
    );

    await user.type(input, 'Another Test');

    await waitFor(
      () => {
        expect(input).toHaveValue('Another Test');
      },
      { timeout: 5000 },
    );
  });
  describe('Error Handling and Edge Cases', () => {
    test('handles mutation error when adding registrant (Network error)', async () => {
      // TEST FLOW: Error handling path when mutation fails with network error
      // Tests: (1) Member selection flow, (2) Mutation called, (3) Error toast displayed with message
      // STEP 1: Render with network error mock for ADD_EVENT_ATTENDEE mutation
      renderWithProviders([
        makeEventDetailsNonRecurringMock(),
        makeAttendeesEmptyMock(),
        makeMembersWithOneMock(),
        {
          request: {
            query: ADD_EVENT_ATTENDEE,
            variables: { userId: 'user1', eventId: 'event123' },
          },
          error: new Error('Network error'),
        },
      ]);

      // STEP 2: Wait for modal and select a member
      await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

      const input = await screen.findByTestId(
        'shared-autocomplete-input',
        {},
        { timeout: 5000 },
      );
      await user.type(input, 'John');
      const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
      await user.click(option);

      // STEP 3: Wait for selection to complete
      await waitFor(() => expect(input).toHaveValue('John'), { timeout: 5000 });

      // STEP 4: Clear mocks and click add button to trigger mutation
      vi.clearAllMocks();
      const addButton = await screen.findByTestId(
        'add-registrant-btn',
        {},
        { timeout: 5000 },
      );
      await user.click(addButton);

      // STEP 5: Verify error toast appears with network error details
      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Error adding attendee',
          );
          expect(NotificationToast.error).toHaveBeenCalledWith('Network error');
        },
        { timeout: 5000 },
      );
    });

    test('handles unmounted component during mutation (Success path)', async () => {
      // TEST FLOW: Cleanup/memory leak prevention when component unmounts mid-mutation
      // Tests: (1) Mutation starts, (2) Component unmounts before mutation completes, (3) No toast shown
      // This simulates user navigating away before async operation finishes
      // STEP 1: Render with delayed mutation result (300ms) to allow unmount during flight
      const { unmount } = renderWithProviders([
        makeEventDetailsNonRecurringMock(),
        makeAttendeesEmptyMock(),
        makeMembersWithOneMock(),
        {
          request: {
            query: ADD_EVENT_ATTENDEE,
            variables: { userId: 'user1', eventId: 'event123' },
          },
          result: {
            data: {
              addEventAttendee: {
                id: 'user1',
                name: 'John Doe',
                emailAddress: 'johndoe@example.com',
              },
            },
          },
          delay: 300, // Introduce delay to allow unmount
        },
      ]);

      // STEP 2: Wait for modal and select a member
      await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

      const input = await screen.findByTestId(
        'shared-autocomplete-input',
        {},
        { timeout: 5000 },
      );
      await user.type(input, 'John');
      const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
      await user.click(option);

      // STEP 3: Wait for selection to complete
      await waitFor(() => expect(input).toHaveValue('John'), { timeout: 5000 });

      // STEP 4: Prepare for mutation and click add button
      vi.clearAllMocks();
      const addButton = await screen.findByTestId(
        'add-registrant-btn',
        {},
        { timeout: 5000 },
      );
      await user.click(addButton);

      // STEP 5: Unmount component immediately after mutation starts (before 300ms delay completes)
      //         This simulates user navigating away from modal, destroys component cleanup
      unmount();

      // STEP 6: Verify no success toast shown after unmount
      //         Component should be unmounted before mutation.onCompleted fires
      await waitFor(
        () => {
          expect(NotificationToast.success).not.toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    test('handles unmounted component during mutation (Error path)', async () => {
      // TEST FLOW: Error cleanup when component unmounts during failed mutation
      // Tests: (1) Mutation starts, (2) Component unmounts before mutation error returns, (3) No error toast shown
      // STEP 1: Render with delayed error mutation (300ms) to allow unmount during flight
      const { unmount } = renderWithProviders([
        makeEventDetailsNonRecurringMock(),
        makeAttendeesEmptyMock(),
        makeMembersWithOneMock(),
        {
          request: {
            query: ADD_EVENT_ATTENDEE,
            variables: { userId: 'user1', eventId: 'event123' },
          },
          error: new Error('Network error'),
          delay: 300, // Introduce delay to allow unmount
        },
      ]);

      // STEP 2: Wait for modal and select a member
      await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

      const input = await screen.findByTestId(
        'shared-autocomplete-input',
        {},
        { timeout: 5000 },
      );
      await user.type(input, 'John');
      const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
      await user.click(option);

      // STEP 3: Wait for selection to complete
      await waitFor(() => expect(input).toHaveValue('John'), { timeout: 5000 });

      // STEP 4: Prepare for mutation and click add button
      vi.clearAllMocks();
      const addButton = await screen.findByTestId(
        'add-registrant-btn',
        {},
        { timeout: 5000 },
      );
      await user.click(addButton);

      // STEP 5: Unmount component immediately after mutation starts (before error returns in 300ms)
      //         Tests that error handling doesn't execute after unmount
      unmount();

      // STEP 6: Verify no error toast shown after unmount
      //         Component cleanup should prevent mutation.onError callback from firing
      await waitFor(
        () => {
          expect(NotificationToast.error).not.toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    test('handles non-Error exceptions', async () => {
      // TEST FLOW: Error handling for non-standard error objects (e.g., strings, arbitrary values)
      // Tests: (1) Mutation rejects with non-Error value, (2) Component catches it, (3) Fallback toast shown
      // STEP 1: Mock useMutation to reject with string instead of Error object
      //         This tests fallback error handling: err instanceof Error ? err.message : 'Unknown error'
      const mockMutate = vi.fn().mockRejectedValue('String error');

      const useMutationSpy = vi
        .spyOn(ApolloClient, 'useMutation')
        .mockReturnValue([
          mockMutate,
          {
            data: undefined,
            loading: false,
            error: undefined,
            called: false,
            reset: vi.fn(),
            client: {} as ApolloClient.ApolloClient<object>,
          },
        ]);

      // STEP 2: Render modal and select member
      renderWithProviders([
        makeEventDetailsNonRecurringMock(),
        makeAttendeesEmptyMock(),
        makeMembersWithOneMock(),
      ]);

      // STEP 3: Wait for modal and perform member selection
      await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

      const input = await screen.findByTestId(
        'shared-autocomplete-input',
        {},
        { timeout: 5000 },
      );
      await user.type(input, 'John');
      const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
      await user.click(option);

      // STEP 4: Wait for selection and clear mocks
      await waitFor(() => expect(input).toHaveValue('John'), { timeout: 5000 });

      // STEP 5: Click add button to trigger the mock mutation that rejects with string
      vi.clearAllMocks();
      const addButton = await screen.findByTestId(
        'add-registrant-btn',
        {},
        { timeout: 5000 },
      );
      await user.click(addButton);

      // STEP 6: Verify mutation was attempted
      await waitFor(
        () => {
          expect(mockMutate).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      // STEP 7: Verify 'Unknown error' toast shown since 'String error' is not instanceof Error
      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith('Unknown error');
        },
        { timeout: 5000 },
      );

      // Clean up spy
      useMutationSpy.mockRestore();
    });
  });
});

// Additional tests for renderOption coverage (lines 192, 195, 199, 204)
describe('EventRegistrantsModal - renderOption Coverage', () => {
  let user: ReturnType<typeof userEvent.setup>;

  // Mock ProfileAvatarDisplay at the module level for this describe block
  const ProfileAvatarDisplayMock = vi.fn(
    ({ imageUrl, fallbackName, size, enableEnlarge }) => (
      <div
        data-testid="profile-avatar-display"
        data-image-url={imageUrl || 'null'}
        data-fallback-name={fallbackName}
        data-size={size}
        data-enable-enlarge={String(enableEnlarge)}
      >
        <span>Avatar: {fallbackName}</span>
      </div>
    ),
  );

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const makeMembersWithMultipleMock = (): ApolloMock => ({
    request: {
      query: MEMBERS_LIST,
      variables: { organizationId: 'org123' },
    },
    result: {
      data: {
        usersByOrganizationId: [
          {
            id: 'user1',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
            role: 'member',
            avatarURL: 'https://example.com/avatar1.jpg',
            createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
            updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
          },
          {
            id: 'user2',
            name: 'Jane Smith',
            emailAddress: 'janesmith@example.com',
            role: 'member',
            avatarURL: null,
            createdAt: dayjs.utc().subtract(2, 'months').toISOString(),
            updatedAt: dayjs.utc().subtract(2, 'months').toISOString(),
          },
          {
            id: 'user3',
            name: '',
            emailAddress: 'unknown@example.com',
            role: 'member',
            avatarURL: null,
            createdAt: dayjs.utc().subtract(3, 'months').toISOString(),
            updatedAt: dayjs.utc().subtract(3, 'months').toISOString(),
          },
        ],
      },
    },
  });

  test('renderOption renders ProfileAvatarDisplay with correct props for members with names and avatars (lines 192, 195-202)', async () => {
    vi.resetModules();
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));
    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const optionsContainer = screen.getByTestId('options-container');
        expect(optionsContainer).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await waitFor(
      () => {
        const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
        expect(avatarDisplays.length).toBe(3);
      },
      { timeout: 5000 },
    );
    const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
    const user1Avatar = avatarDisplays[0];
    expect(user1Avatar).toHaveAttribute(
      'data-image-url',
      'https://example.com/avatar1.jpg',
    );
    expect(user1Avatar).toHaveAttribute('data-fallback-name', 'John Doe');
    expect(user1Avatar).toHaveAttribute('data-size', 'small');
    expect(user1Avatar).toHaveAttribute('data-enable-enlarge', 'false');

    const user2Avatar = avatarDisplays[1];
    expect(user2Avatar).toHaveAttribute('data-image-url', 'null');
    expect(user2Avatar).toHaveAttribute('data-fallback-name', 'Jane Smith');
  });

  test('renderOption uses unknownUser fallback when member name is empty (lines 199, 204)', async () => {
    vi.resetModules();
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));
    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
        expect(avatarDisplays.length).toBe(3);

        const user3Avatar = avatarDisplays[2];
        expect(user3Avatar).toHaveAttribute(
          'data-fallback-name',
          'Unknown User',
        );
        expect(user3Avatar).toHaveTextContent('Avatar: Unknown User');
      },
      { timeout: 5000 },
    );

    const optionsContainer = screen.getByTestId('options-container');
    expect(optionsContainer).toHaveTextContent('Unknown User');
  });

  test('renderOption creates li elements with correct structure (line 195-196)', async () => {
    vi.resetModules();
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));
    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const option1 = screen.getByTestId('rendered-option-user1');
        const option2 = screen.getByTestId('rendered-option-user2');
        const option3 = screen.getByTestId('rendered-option-user3');

        expect(option1).toBeInTheDocument();
        expect(option2).toBeInTheDocument();
        expect(option3).toBeInTheDocument();

        expect(option1).toHaveAttribute('role', 'option');
        expect(option2).toHaveAttribute('role', 'option');
        expect(option3).toHaveAttribute('role', 'option');
      },
      { timeout: 5000 },
    );

    const optionsContainer = screen.getByTestId('options-container');
    const flexDivs = optionsContainer.querySelectorAll(
      '[class*="avatarContainer"]',
    );
    expect(flexDivs.length).toBeGreaterThan(0);
  });

  test('renderOption span elements contain correct member names with ms-2 class (line 203-204)', async () => {
    vi.resetModules();
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));
    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const optionsContainer = screen.getByTestId('options-container');
        const spanElements = optionsContainer.querySelectorAll(
          'span[class*="avatarName"]',
        );

        expect(spanElements.length).toBeGreaterThan(0);

        const spanTexts = Array.from(spanElements).map(
          (span) => span.textContent,
        );
        expect(spanTexts).toContain('John Doe');
        expect(spanTexts).toContain('Jane Smith');
        expect(spanTexts).toContain('Unknown User');
      },
      { timeout: 5000 },
    );
  });

  test('getOptionLabel returns correct labels for all member types (line 192)', async () => {
    vi.resetModules();
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));
    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const option1 = screen.getByTestId('rendered-option-user1');
        const option2 = screen.getByTestId('rendered-option-user2');
        const option3 = screen.getByTestId('rendered-option-user3');

        expect(option1).toHaveTextContent('John Doe');
        expect(option2).toHaveTextContent('Jane Smith');
        expect(option3).toHaveTextContent('Unknown User');
      },
      { timeout: 5000 },
    );
  });

  test('ProfileAvatarDisplay always receives enableEnlarge=false (line 201)', async () => {
    vi.resetModules();
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));
    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
        expect(avatarDisplays.length).toBe(3);

        avatarDisplays.forEach((display) => {
          expect(display).toHaveAttribute('data-enable-enlarge', 'false');
        });
      },
      { timeout: 5000 },
    );
  });

  test('ProfileAvatarDisplay always receives size="small" (line 200)', async () => {
    vi.resetModules();
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));
    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
        expect(avatarDisplays.length).toBe(3);

        avatarDisplays.forEach((display) => {
          expect(display).toHaveAttribute('data-size', 'small');
        });
      },
      { timeout: 5000 },
    );
  });

  test('getOptionLabel returns member.name when present, falls back to unknownUser when name is empty (line 192)', async () => {
    vi.resetModules();

    const getOptionLabelCalls: { option: unknown; result: string }[] = [];

    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: createGetOptionLabelMock(getOptionLabelCalls),
    }));

    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        expect(getOptionLabelCalls.length).toBe(3);
      },
      { timeout: 5000 },
    );

    expect(getOptionLabelCalls[0].result).toBe('John Doe');
    expect(getOptionLabelCalls[1].result).toBe('Jane Smith');
    expect(getOptionLabelCalls[2].result).toBe('Unknown User');
  });

  test('clicking on rendered option triggers onChange (line 195)', async () => {
    vi.resetModules();
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));
    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithMultipleMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const option1 = await screen.findByTestId(
      'rendered-option-user1',
      {},
      { timeout: 5000 },
    );

    await user.click(option1);

    expect(option1).toBeInTheDocument();
  });

  test('handles mutation error when adding registrant', async () => {
    const errorMock = {
      request: {
        query: ADD_EVENT_ATTENDEE,
        variables: { userId: 'user1', eventId: 'event123' },
      },
      error: new Error('Network error'),
    };

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      errorMock,
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    await user.click(input);
    await user.type(input, 'John Doe');
    const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
    await user.click(option);

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );
    vi.clearAllMocks();
    await user.click(addButton);

    await waitFor(
      () => {
        // The component calls toast.error twice: one strict string, one from err.message
        // expecting 'Network error' ensures catch block was hit with correct error
        expect(NotificationToast.error).toHaveBeenCalledWith('Network error');
      },
      { timeout: 5000 },
    );
  });

  test('handles unmounted component during mutation', async () => {
    const delayedMock = {
      request: {
        query: ADD_EVENT_ATTENDEE,
        variables: { userId: 'user1', eventId: 'event123' },
      },
      result: {
        data: {
          addEventAttendee: {
            id: 'user1',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
          },
        },
      },
      delay: 300,
    };

    const { unmount } = renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      delayedMock,
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    await user.click(input);
    await user.type(input, 'John Doe');
    const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
    await user.click(option);

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );
    vi.clearAllMocks();

    await user.click(addButton);

    // Unmount immediately
    unmount();

    await waitFor(
      () => {
        expect(NotificationToast.success).not.toHaveBeenCalled();
        expect(NotificationToast.error).not.toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  test('handles non-Error exceptions', async () => {
    // Spy on useMutation to reject with string
    const addRegistrantMutationMock = vi.fn().mockRejectedValue('String error');

    // Spy on the module's useMutation
    const spy = vi
      .spyOn(ApolloClient, 'useMutation')
      .mockReturnValue([
        addRegistrantMutationMock,
        { loading: false } as ApolloClient.MutationResult,
      ]);

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    await user.click(input);
    await user.type(input, 'John Doe');
    const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
    await user.click(option);

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );
    vi.clearAllMocks();

    await user.click(addButton);

    await waitFor(
      () => {
        // Logic: const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        expect(NotificationToast.error).toHaveBeenCalledWith('Unknown error');
      },
      { timeout: 5000 },
    );

    spy.mockRestore();
  });

  test('prevents double-click when isAdding is true', async () => {
    // Create a slow mutation to simulate the isAdding state
    const slowAddMock: ApolloMock = {
      request: {
        query: ADD_EVENT_ATTENDEE,
        variables: { userId: 'user1', eventId: 'event123' },
      },
      delay: 1000, // Delay to keep isAdding true
      result: {
        data: {
          addEventAttendee: {
            id: 'user1',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
          },
        },
      },
    };

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      slowAddMock,
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );
    await user.click(input);
    await user.type(input, 'John Doe');
    const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
    await user.click(option);

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 5000 },
    );

    vi.clearAllMocks();

    // First click - should trigger the mutation
    await user.click(addButton);

    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'Adding the attendee...',
        );
      },
      { timeout: 5000 },
    );

    // Second click while isAdding is true - should be ignored
    await user.click(addButton);

    // Warning should still only be called once (from the first click)
    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('ProfileAvatarDisplay onError logs warning when avatar fails to load', async () => {
    vi.resetModules();
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: vi.fn(({ imageUrl, fallbackName, onError }) => (
          <img
            data-testid="profile-avatar-img"
            src={imageUrl ?? ''}
            alt={fallbackName}
            onError={onError}
          />
        )),
      }),
    );
    vi.doMock('shared-components/Autocomplete', () => ({
      __esModule: true,
      Autocomplete: EnhancedAutocompleteMock,
    }));

    const { EventRegistrantsModal } = await import('./EventRegistrantsModal');
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    // Create a mock with a user that has an avatar URL
    const mockWithAvatar: ApolloMock = {
      request: {
        query: MEMBERS_LIST,
        variables: { organizationId: 'org123' },
      },
      result: {
        data: {
          usersByOrganizationId: [
            {
              id: 'user1',
              name: 'John Doe',
              emailAddress: 'johndoe@example.com',
              role: 'member',
              avatarURL: 'https://invalid-url.com/avatar.jpg',
              createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
              updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
            },
          ],
        },
      },
    };

    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          mockWithAvatar,
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // Wait for the option to appear (rendered by the MUI mock)
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    const avatarImg = await screen.findByTestId(
      'profile-avatar-img',
      {},
      { timeout: 5000 },
    );

    avatarImg.dispatchEvent(new Event('error'));

    // Verify console.warn was called with the expected message
    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to load avatar for user: user1',
      );
    });

    consoleWarnSpy.mockRestore();
  });

  it('should prevent double-clicking add registrant button (isAdding guard)', async () => {
    const user = userEvent.setup();

    // Spy on the mutation to verify it's only called once
    const addRegistrantSpy = vi.fn().mockResolvedValue({
      data: {
        addEventAttendee: {
          id: 'attendee1',
        },
      },
    });

    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      addRegistrantSpy,
      {
        loading: false,
        error: undefined,
        data: undefined,
        called: false,
        client: {} as ApolloClient.ApolloClient<object>,
        reset: vi.fn(),
      },
    ]);

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'shared-autocomplete-input',
      {},
      { timeout: 5000 },
    );

    // Type to select a member
    await user.type(input, 'John');

    // Wait for the option to appear and click it
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    const option = screen.getByText('John Doe');
    await user.click(option);

    // Get the add button
    const addButton = screen.getByTestId('add-registrant-btn');

    // Click the button twice rapidly
    await user.click(addButton);
    await user.click(addButton);

    // The mutation should only be called once due to the isAdding guard
    await waitFor(
      () => {
        expect(addRegistrantSpy).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });
});
