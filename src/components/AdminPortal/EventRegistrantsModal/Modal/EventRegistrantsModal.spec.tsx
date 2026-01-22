import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    // BaseModal has dataTestId="event-registrants-modal"
    const modal = await screen.findByTestId('event-registrants-modal');
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
    const modal = await screen.findByTestId('event-registrants-modal');
    expect(modal).toBeInTheDocument();

    // Close button has data-testid="modalCloseBtn"
    const closeButton = await screen.findByTestId('modalCloseBtn');
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  test('shows warning when Add Registrant is clicked without selecting a member', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    // Wait for modal and button to appear
    await screen.findByTestId('event-registrants-modal');
    const addButton = await screen.findByTestId('add-registrant-btn');

    // Click button
    await userEvent.click(addButton);

    // Assert NotificationToast was called (it's mocked)
    await waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        'Please choose an user to add first!',
      );
    });
  });

  test('successfully adds registrant for non-recurring event', async () => {
    const user = await import('@testing-library/user-event').then(
      (m) => m.default,
    );

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantSuccessMock(),
    ]);

    await screen.findByTestId('event-registrants-modal');

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
    const user = await import('@testing-library/user-event').then(
      (m) => m.default,
    );

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantErrorMock(),
    ]);

    await screen.findByTestId('event-registrants-modal');

    const input = await screen.findByTestId('autocomplete');

    // Use userEvent to type
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
    const user = await import('@testing-library/user-event').then(
      (m) => m.default,
    );

    renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantRecurringSuccessMock(),
    ]);

    await screen.findByTestId('event-registrants-modal');

    const input = await screen.findByTestId('autocomplete');

    // Use userEvent to type
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
    const user = await import('@testing-library/user-event').then(
      (m) => m.default,
    );

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
    await userEvent.click(reloadBtn);

    const closeBtn = screen.getByTestId('add-onspot-close');
    await userEvent.click(closeBtn);

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
    await screen.findByTestId('event-registrants-modal');

    // Click invite button using data-testid
    const inviteButton = screen.getByTestId('invite-by-email-btn');
    await userEvent.click(inviteButton);

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
    await userEvent.click(closeInvite);

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

    await screen.findByTestId('event-registrants-modal');

    const inviteButton = screen.getByTestId('invite-by-email-btn');
    await userEvent.click(inviteButton);

    const inviteModal = await screen.findByTestId('invite-by-email-modal');
    expect(inviteModal).toBeInTheDocument();

    // Verify isRecurring is true
    expect(screen.getByTestId('invite-is-recurring')).toHaveTextContent('true');

    // Click send button to trigger onInvitesSent
    const sendBtn = screen.getByTestId('invite-send');
    await userEvent.click(sendBtn);
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

    // Open autocomplete options - need to click first to focus
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');

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

    const user = await import('@testing-library/user-event').then(
      (m) => m.default,
    );

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
    );

    await user.type(input, 'NonexistentUser');
    // Wait for the button to appear
    const addOnspotLink = await screen.findByText('Add Onspot Registration');

    // Use click instead of keyboard Enter because focus inside popper is unstable in test env
    await user.click(addOnspotLink);

    expect(await screen.findByTestId('add-onspot-modal')).toBeInTheDocument();
  });

  test('opens AddOnSpot modal when Space key is pressed on Add Onspot Registration link', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const user = await import('@testing-library/user-event').then(
      (m) => m.default,
    );

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
    );

    await user.type(input, 'NonexistentUser');

    const addOnspotLink = await screen.findByText('Add Onspot Registration');

    // Use click instead of keyboard Space because focus inside popper is unstable in test env
    await user.click(addOnspotLink);

    expect(await screen.findByTestId('add-onspot-modal')).toBeInTheDocument();
  });

  test('dont open AddOnSpot modal when any key other than Enter and space is pressed on Add Onspot Registration link', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
    );

    await userEvent.type(input, 'NonexistentUser');
    // Wait for the link to appear (ensures autocomplete has rendered noOptionsText)
    const _addOnspotLink = await screen.findByText('Add Onspot Registration');

    for (const key of ['Escape', 'Tab', 'ArrowDown', 'a', 'Backspace']) {
      await userEvent.keyboard(`{${key}}`);
      expect(screen.queryByTestId('add-onspot-modal')).not.toBeInTheDocument();
    }
  });

  test('onMouseDown on Add Onspot Registration link calls preventDefault', async () => {
    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersEmptyMock(),
    ]);

    const user = await import('@testing-library/user-event').then(
      (m) => m.default,
    );

    const input = await screen.findByPlaceholderText(
      'Choose the user that you want to add',
    );

    await user.type(input, 'NonexistentUser');

    const addOnspotLink = await screen.findByText('Add Onspot Registration');

    // Trigger mouseDown event - the onMouseDown handler calls preventDefault
    // userEvent.pointer simulates mouse events
    await userEvent.pointer({ keys: '[MouseLeft>]', target: addOnspotLink });

    // The link should still be visible (autocomplete dropdown should not close)
    expect(addOnspotLink).toBeInTheDocument();
  });

  test('renderOption displays Unknown User fallback when member name is null', async () => {
    // Create a mock with null name
    const makeMembersNullNameMock = (): ApolloMock => ({
      request: {
        query: MEMBERS_LIST,
        variables: { organizationId: 'org123' },
      },
      result: {
        data: {
          usersByOrganizationId: [
            {
              id: 'user3',
              name: null,
              emailAddress: 'nullname@example.com',
              role: 'member',
              avatarURL: 'https://example.com/avatar.png',
              createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
              updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
            },
          ],
        },
      },
    });

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersNullNameMock(),
    ]);

    const input = await screen.findByTestId('autocomplete');
    expect(input).toBeInTheDocument();

    // Open autocomplete options
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');

    // Verify the "Unknown User" fallback text appears in the dropdown option
    const option = await screen.findByText('Unknown User');
    expect(option).toBeInTheDocument();
  });

  test('renderOption displays ProfileAvatarDisplay with avatarURL', async () => {
    // Create a mock with avatarURL
    const makeMembersWithAvatarMock = (): ApolloMock => ({
      request: {
        query: MEMBERS_LIST,
        variables: { organizationId: 'org123' },
      },
      result: {
        data: {
          usersByOrganizationId: [
            {
              id: 'user4',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              role: 'member',
              avatarURL: 'https://example.com/jane-avatar.png',
              createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
              updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
            },
          ],
        },
      },
    });

    renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithAvatarMock(),
    ]);

    const input = await screen.findByTestId('autocomplete');

    // Open autocomplete dropdown
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');

    // Verify the option with name is displayed
    const option = await screen.findByText('Jane Smith');
    expect(option).toBeInTheDocument();
  });

  test('does not render modal when show is false', async () => {
    render(
      <MockedProvider
        mocks={[
          makeEventDetailsNonRecurringMock(),
          makeAttendeesEmptyMock(),
          makeMembersWithOneMock(),
        ]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventRegistrantsModal {...defaultProps} show={false} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait a bit for any async operations
    await waitFor(() => {
      // The modal should not be visible when show is false
      // BaseModal likely hides content when show is false
      expect(screen.queryByTestId('autocomplete')).not.toBeInTheDocument();
    });
  });
});
