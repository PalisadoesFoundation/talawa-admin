import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
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
import { describe, test, expect, vi, afterEach } from 'vitest';
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

const makeAddRegistrantErrorMock = (): ApolloMock => ({
  request: {
    query: ADD_EVENT_ATTENDEE,
    variables: { userId: 'user1', eventId: 'event123' },
  },
  error: new Error('Oops'),
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
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  test('renders modal with basic elements', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // BaseModal has dataTestId="invite-modal"
    const modal = await screen.findByTestId('invite-modal');
    expect(modal).toBeInTheDocument();

    // Autocomplete input should be rendered
    const autocomplete = await screen.findByTestId('autocomplete');
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
    const modal = await screen.findByTestId('invite-modal');
    expect(modal).toBeInTheDocument();

    // Close button has data-testid="modalCloseBtn"
    const closeButton = await screen.findByTestId('modalCloseBtn');
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  test('shows warning when Add Registrant is clicked without selecting a member', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // Wait for modal and button to appear
    await screen.findByTestId('invite-modal');
    const addButton = await screen.findByTestId('add-registrant-btn');

    // Click button
    await user.click(addButton);

    // Assert NotificationToast was called (it's mocked)
    await waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        'Please choose a user to add first!',
      );
    });
  });

  test('successfully adds registrant for non-recurring event', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantSuccessMock(),
    ]);

    await screen.findByTestId('invite-modal');

    const input = await screen.findByTestId('autocomplete');

    await user.click(input);
    await user.type(input, 'John Doe');

    await waitFor(() => {
      const option = screen.getByText('John Doe');
      expect(option).toBeInTheDocument();
    });

    const option = screen.getByText('John Doe');
    await user.click(option);

    const addButton = screen.getByTestId('add-registrant-btn');
    await user.click(addButton);

    await waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        'Adding the attendee...',
      );
    });

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  test('handles error when add registrant mutation fails', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantErrorMock(),
    ]);

    await screen.findByTestId('invite-modal');

    const input = await screen.findByTestId('autocomplete');

    await user.click(input);
    await user.type(input, 'John Doe');

    // Wait for dropdown and select option
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const option = screen.getByText('John Doe');
    await user.click(option);

    const addButton = screen.getByTestId('add-registrant-btn');
    await user.click(addButton);

    // Assert warning shown first
    await waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        'Adding the attendee...',
      );
    });

    // Assert error toast
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('uses recurring variables when event is recurring (isRecurring branch)', async () => {
    renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantRecurringSuccessMock(),
    ]);

    await screen.findByTestId('invite-modal');

    const input = await screen.findByTestId('autocomplete');

    await user.click(input);
    await user.type(input, 'John Doe');

    // Wait for dropdown and select option
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const option = screen.getByText('John Doe');
    await user.click(option);

    const addButton = screen.getByTestId('add-registrant-btn');
    await user.click(addButton);

    await waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        'Adding the attendee...',
      );
    });

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
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
    );
    expect(input).toBeInTheDocument();

    await user.type(input, 'NonexistentUser');

    await waitFor(() => {
      expect(screen.getByText('No Registrations found')).toBeInTheDocument();
      expect(screen.getByText('Add Onspot Registration')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Add Onspot Registration'));

    const onspotModal = await screen.findByTestId('add-onspot-modal');
    expect(onspotModal).toBeInTheDocument();

    const reloadBtn = screen.getByTestId('reload-members-btn');
    await user.click(reloadBtn);

    const closeBtn = screen.getByTestId('add-onspot-close');
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('add-onspot-modal')).not.toBeInTheDocument();
    });
  });

  test('Invite by Email button opens InviteByEmailModal and handleClose closes it', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // Wait for main modal to appear
    await screen.findByTestId('invite-modal');

    // Click invite button using data-testid
    const inviteButton = screen.getByTestId('invite-by-email-btn');
    await user.click(inviteButton);

    // Wait for invite modal to appear (mocked as a div with data-testid)
    const inviteModal = await screen.findByTestId('invite-by-email-modal');
    expect(inviteModal).toBeInTheDocument();

    // Verify props passed to InviteByEmailModal
    expect(screen.getByTestId('invite-event-id')).toHaveTextContent('event123');
    expect(screen.getByTestId('invite-is-recurring')).toHaveTextContent(
      'false',
    );

    // Close invite modal
    const closeInvite = screen.getByTestId('invite-close');
    await user.click(closeInvite);

    await waitFor(() => {
      expect(
        screen.queryByTestId('invite-by-email-modal'),
      ).not.toBeInTheDocument();
    });
  });

  test('InviteByEmailModal onInvitesSent callback triggers and isRecurring is true for recurring event', async () => {
    renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await screen.findByTestId('invite-modal');

    const inviteButton = screen.getByTestId('invite-by-email-btn');
    await user.click(inviteButton);

    const inviteModal = await screen.findByTestId('invite-by-email-modal');
    expect(inviteModal).toBeInTheDocument();

    // Verify isRecurring is true
    expect(screen.getByTestId('invite-is-recurring')).toHaveTextContent('true');

    // Click send button to trigger onInvitesSent
    const sendBtn = screen.getByTestId('invite-send');
    await user.click(sendBtn);
    // onInvitesSent callback is triggered implicitly
  });

  test('getOptionLabel falls back to "unknownUser" translation when member name is empty', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersUnknownNameMock(),
    ]);

    const input = await screen.findByTestId('autocomplete');
    expect(input).toBeInTheDocument();

    // Open autocomplete options
    await user.type(input, '{ArrowDown}');

    // This text appears via getOptionLabel's t('unknownUser') fallback
    // i18nForTest translates it to the English text
    const option = await screen.findByText('Unknown User');
    expect(option).toBeInTheDocument();
  });

  test('opens AddOnSpot modal when Enter key is pressed on Add Onspot Registration link', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
    );

    await user.type(input, 'NonexistentUser');
    // Wait for the button to appear
    const addOnspotLink = await screen.findByText('Add Onspot Registration');

    await user.type(addOnspotLink, '{Enter}');

    expect(await screen.findByTestId('add-onspot-modal')).toBeInTheDocument();
  });

  test('opens AddOnSpot modal when Space key is pressed on Add Onspot Registration link', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
    );

    await user.type(input, 'NonexistentUser');
    const addOnspotLink = await screen.findByText('Add Onspot Registration');

    await user.type(addOnspotLink, ' ');

    expect(await screen.findByTestId('add-onspot-modal')).toBeInTheDocument();
  });

  test('doesnt open AddOnSpot modal when any key other than Enter and space is pressed on Add Onspot Registration link', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
    );

    await user.type(input, 'NonexistentUser');
    const addOnspotLink = await screen.findByText('Add Onspot Registration');

    // Keys that should NOT open the modal
    const ignoredKeys = ['Escape', 'Tab', 'ArrowDown', 'a', 'Backspace'];

    for (const key of ignoredKeys) {
      addOnspotLink.focus();
      const keyPress = key.length === 1 ? key : `{${key}}`;
      await user.keyboard(keyPress);

      expect(screen.queryByTestId('add-onspot-modal')).not.toBeInTheDocument();
    }
  });
});
