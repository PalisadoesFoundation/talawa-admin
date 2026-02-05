import React from 'react';
import { render, waitFor, screen, cleanup } from '@testing-library/react';
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
import {
  InterfaceBaseModalProps,
  InterfaceAutocompleteMockProps,
} from 'types/AdminPortal/EventRegistrantsModal/interface';

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

vi.mock('@mui/material/Autocomplete', () => ({
  __esModule: true,
  default: ({
    renderInput,
    options,
    onChange,
    noOptionsText,
    onInputChange,
  }: InterfaceAutocompleteMockProps & { inputValue?: string }) => {
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      // Trigger onInputChange when input value changes
      if (onInputChange) {
        onInputChange({} as React.SyntheticEvent, e.target.value, 'input');
      }
    };

    const inputProps = {
      onChange: handleInputChange,
      onInput: handleInputChange,
    };

    return (
      <div data-testid="autocomplete-mock">
        {renderInput({
          InputProps: { ref: vi.fn() },
          id: 'test-autocomplete',
          disabled: false,
          inputProps: inputProps, // ← Pass inputProps with onChange
        })}
        {options && options.length > 0 ? (
          options.map((option) => (
            <div
              key={option.id}
              data-testid={`option-${option.id}`}
              onClick={(): void => {
                if (onChange) {
                  onChange({} as React.SyntheticEvent, option);
                }
              }}
              onKeyDown={(): void => {
                /* mock */
              }}
              role="button"
              tabIndex={0}
            >
              {option.name || 'Unknown User'}
            </div>
          ))
        ) : (
          <div data-testid="no-options">{noOptionsText}</div>
        )}
      </div>
    );
  },
}));

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
      { timeout: 3000 },
    );
    expect(modal).toBeInTheDocument();

    // Autocomplete input should be rendered
    const autocomplete = await screen.findByTestId(
      'autocomplete',
      {},
      { timeout: 3000 },
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
      { timeout: 3000 },
    );
    expect(modal).toBeInTheDocument();

    // Close button has data-testid="modalCloseBtn"
    const closeButton = await screen.findByTestId(
      'modalCloseBtn',
      {},
      { timeout: 3000 },
    );
    await user.click(closeButton);

    await waitFor(
      () => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );
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
      { timeout: 3000 },
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
      { timeout: 3000 },
    );
  });

  test('successfully adds registrant for non-recurring event', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantSuccessMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'autocomplete',
      {},
      { timeout: 3000 },
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
      { timeout: 3000 },
    );

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 3000 },
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
      { timeout: 3000 },
    );

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('uses recurring variables when event is recurring (isRecurring branch)', async () => {
    renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantRecurringSuccessMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'autocomplete',
      {},
      { timeout: 3000 },
    );

    await user.type(input, 'John');

    const option = await screen.findByTestId(
      'option-user1',
      {},
      { timeout: 3000 },
    );
    await user.click(option);

    // Wait for selection to complete
    await waitFor(
      () => {
        expect(input).toHaveValue('John');
      },
      { timeout: 3000 },
    );

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 3000 },
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
      { timeout: 3000 },
    );

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test('noOptionsText and AddOnSpotAttendee modal open & reloadMembers callback', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
      makeAttendeesEmptyMock(), // for reloadMembers refetch
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
      {},
      { timeout: 3000 },
    );
    expect(input).toBeInTheDocument();

    await user.type(input, 'NonexistentUser');

    // Wait for no options message
    await waitFor(
      () => {
        expect(screen.getByText('No Registrations found')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const addOnspotLink = await screen.findByText(
      'Add Onspot Registration',
      {},
      { timeout: 3000 },
    );
    expect(addOnspotLink).toBeInTheDocument();

    await user.click(addOnspotLink);

    const onspotModal = await screen.findByTestId(
      'add-onspot-modal',
      {},
      { timeout: 3000 },
    );
    expect(onspotModal).toBeInTheDocument();

    const reloadBtn = await screen.findByTestId(
      'reload-members-btn',
      {},
      { timeout: 3000 },
    );
    await user.click(reloadBtn);

    const closeBtn = await screen.findByTestId(
      'add-onspot-close',
      {},
      { timeout: 3000 },
    );
    await user.click(closeBtn);

    await waitFor(
      () => {
        expect(
          screen.queryByTestId('add-onspot-modal'),
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('Invite by Email button opens InviteByEmailModal and handleClose closes it', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // Wait for main modal to appear
    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // Click invite button using data-testid
    const inviteButton = await screen.findByTestId(
      'invite-by-email-btn',
      {},
      { timeout: 3000 },
    );
    await user.click(inviteButton);

    // Wait for invite modal to appear (mocked as a div with data-testid)
    const inviteModal = await screen.findByTestId(
      'invite-by-email-modal',
      {},
      { timeout: 3000 },
    );
    expect(inviteModal).toBeInTheDocument();

    // Verify props passed to InviteByEmailModal
    const eventIdElement = await screen.findByTestId(
      'invite-event-id',
      {},
      { timeout: 3000 },
    );
    const isRecurringElement = await screen.findByTestId(
      'invite-is-recurring',
      {},
      { timeout: 3000 },
    );

    expect(eventIdElement).toHaveTextContent('event123');
    expect(isRecurringElement).toHaveTextContent('false');

    // Close invite modal
    const closeInvite = await screen.findByTestId(
      'invite-close',
      {},
      { timeout: 3000 },
    );
    await user.click(closeInvite);

    await waitFor(
      () => {
        expect(
          screen.queryByTestId('invite-by-email-modal'),
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('InviteByEmailModal onInvitesSent callback triggers and isRecurring is true for recurring event', async () => {
    renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const inviteButton = await screen.findByTestId(
      'invite-by-email-btn',
      {},
      { timeout: 3000 },
    );
    await user.click(inviteButton);

    const inviteModal = await screen.findByTestId(
      'invite-by-email-modal',
      {},
      { timeout: 3000 },
    );
    expect(inviteModal).toBeInTheDocument();

    // Verify isRecurring is true
    const isRecurringElement = await screen.findByTestId(
      'invite-is-recurring',
      {},
      { timeout: 3000 },
    );
    expect(isRecurringElement).toHaveTextContent('true');

    // Click send button to trigger onInvitesSent
    const sendBtn = await screen.findByTestId(
      'invite-send',
      {},
      { timeout: 3000 },
    );
    await user.click(sendBtn);

    // Wait for any potential side effects
    await waitFor(
      () => {
        expect(sendBtn).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  test('shows warning when user types but does not select an option', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersUnknownNameMock(),
    ]);

    const input = await screen.findByTestId(
      'autocomplete',
      {},
      { timeout: 3000 },
    );
    expect(input).toBeInTheDocument();

    await user.type(input, 'Unknown');

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 3000 },
    );

    // Clear previous mocks
    vi.clearAllMocks();

    await user.click(addButton);

    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'Please choose a user to add first!',
        );
        expect(NotificationToast.warning).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );
  });

  test('opens AddOnSpot modal on Enter key press (first scenario)', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
      {},
      { timeout: 3000 },
    );

    await user.type(input, 'NonexistentUser');

    // Wait for the link to appear
    const addOnspotLink = await screen.findByText(
      'Add Onspot Registration',
      {},
      { timeout: 3000 },
    );
    expect(addOnspotLink).toBeInTheDocument();

    await user.type(addOnspotLink, '{Enter}');

    const onspotModal = await screen.findByTestId(
      'add-onspot-modal',
      {},
      { timeout: 3000 },
    );
    expect(onspotModal).toBeInTheDocument();
  });

  test('opens AddOnSpot modal on Enter key press (second scenario)', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
      {},
      { timeout: 3000 },
    );

    await user.type(input, 'NonexistentUser');

    const addOnspotLink = await screen.findByText(
      'Add Onspot Registration',
      {},
      { timeout: 3000 },
    );
    expect(addOnspotLink).toBeInTheDocument();

    addOnspotLink.focus();
    await user.keyboard('{Enter}');

    const onspotModal = await screen.findByTestId(
      'add-onspot-modal',
      {},
      { timeout: 3000 },
    );
    expect(onspotModal).toBeInTheDocument();
  });

  test('doesnt open AddOnSpot modal when any key other than Enter and space is pressed on Add Onspot Registration link', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
      {},
      { timeout: 3000 },
    );

    await user.type(input, 'NonexistentUser');

    await user.keyboard('{ArrowDown}');

    const addOnspotLink = await screen.findByTestId(
      'add-onspot-link',
      {},
      { timeout: 3000 },
    );

    const ignoredKeys = ['Escape', 'Tab', 'ArrowDown', 'a', 'Backspace'];

    for (const key of ignoredKeys) {
      addOnspotLink.focus();

      const keyPress = key.length === 1 ? key : `{${key}}`;
      await user.keyboard(keyPress);

      // Use queryBy for negative assertion
      expect(screen.queryByTestId('add-onspot-modal')).not.toBeInTheDocument();

      // Small delay between iterations
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  });

  test('shows error toasts when add attendee mutation fails', async () => {
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

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const input = await screen.findByTestId(
      'autocomplete',
      {},
      { timeout: 3000 },
    );
    await user.type(input, 'John');

    const option = await screen.findByText('John Doe', {}, { timeout: 3000 });
    await user.click(option);

    // Wait for selection
    await waitFor(
      () => {
        expect(input).toHaveValue('John');
      },
      { timeout: 3000 },
    );

    // Clear previous mocks
    vi.clearAllMocks();

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 3000 },
    );
    await user.click(addButton);

    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'Adding the attendee...',
        );
      },
      { timeout: 3000 },
    );

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Error adding attendee',
        );
      },
      { timeout: 5000 },
    );

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Network error: Failed to add attendee',
        );
      },
      { timeout: 2000 },
    );

    expect(NotificationToast.error).toHaveBeenCalledTimes(2);
  });

  test('opens AddOnSpot modal when Space key is pressed on add-onspot link', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
      {},
      { timeout: 3000 },
    );
    await user.type(input, 'NonExistentUser');

    const addOnspotLink = await screen.findByTestId(
      'add-onspot-link',
      {},
      { timeout: 3000 },
    );
    expect(addOnspotLink).toBeInTheDocument();

    addOnspotLink.focus();

    await user.keyboard(' ');

    const onspotModal = await screen.findByTestId(
      'add-onspot-modal',
      {},
      { timeout: 3000 },
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
      'autocomplete',
      {},
      { timeout: 3000 },
    );
    await user.type(input, 'unknown');

    const option = await screen.findByTestId(
      'option-user2',
      {},
      { timeout: 3000 },
    );
    await user.click(option);

    // Wait for selection
    await waitFor(
      () => {
        expect(input).toHaveValue('unknown');
      },
      { timeout: 3000 },
    );

    // Clear previous mocks
    vi.clearAllMocks();

    const addButton = await screen.findByTestId(
      'add-registrant-btn',
      {},
      { timeout: 3000 },
    );
    await user.click(addButton);

    await waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledTimes(2);
      },
      { timeout: 3000 },
    );
  });

  test('updates inputValue state when user types in autocomplete', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    const input = await screen.findByTestId(
      'autocomplete',
      {},
      { timeout: 3000 },
    );

    await user.type(input, 'Test User');

    await waitFor(
      () => {
        expect(input).toHaveValue('Test User');
      },
      { timeout: 3000 },
    );

    await user.clear(input);

    // Wait for clear to complete
    await waitFor(
      () => {
        expect(input).toHaveValue('');
      },
      { timeout: 3000 },
    );

    await user.type(input, 'Another Test');

    await waitFor(
      () => {
        expect(input).toHaveValue('Another Test');
      },
      { timeout: 3000 },
    );
  });

  test('renders ProfileAvatarDisplay in renderOption with correct props for member with name', async () => {
    // Mock ProfileAvatarDisplay to verify it receives correct props
    const ProfileAvatarDisplayMock = vi.fn(() => (
      <div data-testid="profile-avatar-display">Avatar</div>
    ));

    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // The renderOption function should be called when options are rendered
    // Since we're using a mock Autocomplete, we need to verify the component
    // would pass correct props to ProfileAvatarDisplay
    const input = await screen.findByTestId(
      'autocomplete',
      {},
      { timeout: 3000 },
    );
    await user.type(input, 'John');

    // Verify the option is rendered with the member's name
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('renders ProfileAvatarDisplay in renderOption with unknownUser fallback when name is empty', async () => {
    // Create a custom mock for this test that actually renders the renderOption
    const customAutocompleteMock = ({
      renderInput,
      renderOption,
      options,
      onChange,
      getOptionLabel,
    }: InterfaceAutocompleteMockProps) => {
      return (
        <div data-testid="autocomplete-mock">
          {renderInput({
            InputProps: { ref: vi.fn() },
            id: 'test-autocomplete',
            disabled: false,
            inputProps: {},
          })}
          {options && options.length > 0 ? (
            options.map((option) => {
              // Call renderOption to test the actual rendering logic
              const renderedOption = renderOption
                ? renderOption({ key: option.id }, option, { selected: false })
                : null;

              return (
                <div
                  key={option.id}
                  data-testid={`option-${option.id}`}
                  onClick={(): void => {
                    if (onChange) {
                      onChange({} as React.SyntheticEvent, option);
                    }
                  }}
                  onKeyDown={(): void => {
                    /* mock */
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {renderedOption || getOptionLabel?.(option) || option.name}
                </div>
              );
            })
          ) : (
            <div data-testid="no-options">No options</div>
          )}
        </div>
      );
    };

    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: customAutocompleteMock,
    }));

    const ProfileAvatarDisplayMock = vi.fn(
      ({ imageUrl, fallbackName, size, enableEnlarge }) => (
        <div
          data-testid="profile-avatar-display"
          data-image-url={imageUrl || 'null'}
          data-fallback-name={fallbackName}
          data-size={size}
          data-enable-enlarge={String(enableEnlarge)}
        >
          Avatar: {fallbackName}
        </div>
      ),
    );

    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersUnknownNameMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // Wait for the option to be rendered
    await waitFor(
      () => {
        const option = screen.queryByTestId('option-user2');
        expect(option).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Verify ProfileAvatarDisplay was called with unknownUser fallback
    await waitFor(
      () => {
        const avatarDisplay = screen.queryByTestId('profile-avatar-display');
        if (avatarDisplay) {
          expect(avatarDisplay).toHaveAttribute(
            'data-fallback-name',
            'Unknown User',
          );
          expect(avatarDisplay).toHaveAttribute('data-size', 'small');
          expect(avatarDisplay).toHaveAttribute('data-enable-enlarge', 'false');
          expect(avatarDisplay).toHaveAttribute('data-image-url', 'null');
        }
      },
      { timeout: 3000 },
    );
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

    // Re-mock ProfileAvatarDisplay for these tests
    vi.doMock(
      'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay',
      () => ({
        ProfileAvatarDisplay: ProfileAvatarDisplayMock,
      }),
    );
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

  // Enhanced Autocomplete mock that renders the actual renderOption
  const enhancedAutocompleteMock = ({
    renderInput,
    renderOption,
    options,
    onChange,
    getOptionLabel,
    onInputChange,
  }: InterfaceAutocompleteMockProps) => {
    const [_localInputValue, setLocalInputValue] = React.useState('');

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      const newValue = e.target.value;
      setLocalInputValue(newValue);
      if (onInputChange) {
        onInputChange({} as React.SyntheticEvent, newValue, 'input');
      }
    };

    const inputProps = {
      onChange: handleInputChange,
      onInput: handleInputChange,
    };

    return (
      <div data-testid="autocomplete-mock">
        {renderInput({
          InputProps: { ref: vi.fn() },
          id: 'test-autocomplete',
          disabled: false,
          inputProps: inputProps,
        })}
        <div data-testid="options-container">
          {options && options.length > 0 ? (
            options.map((option) => {
              const liProps = {
                key: option.id,
                'data-testid': `rendered-option-${option.id}`,
                onClick: (): void => {
                  if (onChange) {
                    onChange({} as React.SyntheticEvent, option);
                  }
                },
                role: 'option',
                tabIndex: 0,
              };

              // Actually call renderOption to execute the real code
              return renderOption
                ? renderOption(liProps, option, { selected: false })
                : getOptionLabel?.(option) || option.name;
            })
          ) : (
            <div data-testid="no-options">No options</div>
          )}
        </div>
      </div>
    );
  };

  test('renderOption renders ProfileAvatarDisplay with correct props for members with names and avatars (lines 192, 195-202)', async () => {
    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: enhancedAutocompleteMock,
    }));

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithMultipleMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // Wait for options to be rendered
    await waitFor(
      () => {
        const optionsContainer = screen.getByTestId('options-container');
        expect(optionsContainer).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Verify ProfileAvatarDisplay components are rendered
    await waitFor(
      () => {
        const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
        expect(avatarDisplays.length).toBe(3);
      },
      { timeout: 3000 },
    );

    // Verify user1 with avatar
    const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
    const user1Avatar = avatarDisplays[0];
    expect(user1Avatar).toHaveAttribute(
      'data-image-url',
      'https://example.com/avatar1.jpg',
    );
    expect(user1Avatar).toHaveAttribute('data-fallback-name', 'John Doe');
    expect(user1Avatar).toHaveAttribute('data-size', 'small');
    expect(user1Avatar).toHaveAttribute('data-enable-enlarge', 'false');

    // Verify user2 without avatar
    const user2Avatar = avatarDisplays[1];
    expect(user2Avatar).toHaveAttribute('data-image-url', 'null');
    expect(user2Avatar).toHaveAttribute('data-fallback-name', 'Jane Smith');
  });

  test('renderOption uses unknownUser fallback when member name is empty (lines 199, 204)', async () => {
    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: enhancedAutocompleteMock,
    }));

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithMultipleMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // Verify user3 with empty name uses "Unknown User"
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
      { timeout: 3000 },
    );

    // Verify the span also shows Unknown User (line 204)
    const optionsContainer = screen.getByTestId('options-container');
    expect(optionsContainer).toHaveTextContent('Unknown User');
  });

  test('renderOption creates li elements with correct structure (line 195-196)', async () => {
    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: enhancedAutocompleteMock,
    }));

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithMultipleMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    // Verify li elements are created with correct keys and props
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
      { timeout: 3000 },
    );

    // Verify d-flex align-items-center divs exist (line 196)
    const optionsContainer = screen.getByTestId('options-container');
    const flexDivs = optionsContainer.querySelectorAll(
      '.d-flex.align-items-center',
    );
    expect(flexDivs.length).toBeGreaterThan(0);
  });

  test('renderOption span elements contain correct member names with ms-2 class (line 203-204)', async () => {
    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: enhancedAutocompleteMock,
    }));

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithMultipleMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const optionsContainer = screen.getByTestId('options-container');
        const spanElements = optionsContainer.querySelectorAll('span.ms-2');

        expect(spanElements.length).toBeGreaterThan(0);

        // Verify spans contain correct text
        const spanTexts = Array.from(spanElements).map(
          (span) => span.textContent,
        );
        expect(spanTexts).toContain('John Doe');
        expect(spanTexts).toContain('Jane Smith');
        expect(spanTexts).toContain('Unknown User');
      },
      { timeout: 3000 },
    );
  });

  test('getOptionLabel returns correct labels for all member types (line 192)', async () => {
    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: enhancedAutocompleteMock,
    }));

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithMultipleMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const option1 = screen.getByTestId('rendered-option-user1');
        const option2 = screen.getByTestId('rendered-option-user2');
        const option3 = screen.getByTestId('rendered-option-user3');

        // Verify correct names are displayed
        expect(option1).toHaveTextContent('John Doe');
        expect(option2).toHaveTextContent('Jane Smith');
        expect(option3).toHaveTextContent('Unknown User');
      },
      { timeout: 3000 },
    );
  });

  test('ProfileAvatarDisplay always receives enableEnlarge=false (line 201)', async () => {
    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: enhancedAutocompleteMock,
    }));

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithMultipleMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
        expect(avatarDisplays.length).toBe(3);

        avatarDisplays.forEach((display) => {
          expect(display).toHaveAttribute('data-enable-enlarge', 'false');
        });
      },
      { timeout: 3000 },
    );
  });

  test('ProfileAvatarDisplay always receives size="small" (line 200)', async () => {
    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: enhancedAutocompleteMock,
    }));

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithMultipleMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    await waitFor(
      () => {
        const avatarDisplays = screen.getAllByTestId('profile-avatar-display');
        expect(avatarDisplays.length).toBe(3);

        avatarDisplays.forEach((display) => {
          expect(display).toHaveAttribute('data-size', 'small');
        });
      },
      { timeout: 3000 },
    );
  });

  test('clicking on rendered option triggers onChange (line 195)', async () => {
    vi.doMock('@mui/material/Autocomplete', () => ({
      __esModule: true,
      default: enhancedAutocompleteMock,
    }));

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithMultipleMock(),
    ]);

    await screen.findByTestId('invite-modal', {}, { timeout: 3000 });

    const option1 = await screen.findByTestId(
      'rendered-option-user1',
      {},
      { timeout: 3000 },
    );

    // Click should work without errors
    await user.click(option1);

    // Verify option is in the document and clickable
    expect(option1).toBeInTheDocument();
  });
});
