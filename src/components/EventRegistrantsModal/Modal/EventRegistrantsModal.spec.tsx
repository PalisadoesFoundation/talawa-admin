import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { describe, test, expect, vi } from 'vitest';

import { EventRegistrantsModal } from './EventRegistrantsModal';
import {
  EVENT_ATTENDEES,
  MEMBERS_LIST,
  EVENT_DETAILS,
} from 'GraphQl/Queries/Queries';
import { ADD_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';

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
      <div data-testid="invite-modal">
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
        id: 'event123',
        __typename: 'Event',
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
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
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
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
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
        name: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        startAt: '2023-01-01T10:00:00.000Z',
        endAt: '2023-01-01T12:00:00.000Z',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        isRecurringEventTemplate: false,
        baseEvent: null,
        recurrenceRule: null,
        creator: {
          id: 'creator1',
          name: 'Creator',
          emailAddress: 'creator@example.com',
          __typename: 'User',
        },
        updater: null,
        organization: {
          id: 'org123',
          name: 'Test Org',
          __typename: 'Organization',
        },
        __typename: 'Event',
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
        name: 'Recurring Event',
        description: 'Recurring Description',
        location: 'Test Location',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        startAt: '2023-01-01T10:00:00.000Z',
        endAt: '2023-01-01T12:00:00.000Z',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        isRecurringEventTemplate: false,
        baseEvent: null,
        recurrenceRule: {
          id: 'RRULE:FREQ=DAILY',
          __typename: 'RecurrenceRule',
        },
        creator: {
          id: 'creator1',
          name: 'Creator',
          emailAddress: 'creator@example.com',
          __typename: 'User',
        },
        updater: null,
        organization: {
          id: 'org123',
          name: 'Test Org',
          __typename: 'Organization',
        },
        __typename: 'Event',
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
              <ToastContainer />
              <EventRegistrantsModal {...props} />
            </I18nextProvider>
          </Provider>
        </LocalizationProvider>
      </BrowserRouter>
    </MockedProvider>,
  );

describe('EventRegistrantsModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('renders modal with basic elements', async () => {
    const { queryByText, getByTestId } = renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await waitFor(() => {
      expect(queryByText('Event Registrants')).toBeInTheDocument();
      expect(getByTestId('autocomplete')).toBeInTheDocument();
    });
  });

  test('modal close button calls handleClose', async () => {
    const handleClose = vi.fn();
    const { getAllByRole } = renderWithProviders(
      [
        makeEventDetailsNonRecurringMock(),
        makeAttendeesEmptyMock(),
        makeMembersWithOneMock(),
      ],
      { ...defaultProps, handleClose },
    );

    await waitFor(() => {
      expect(getAllByRole('button', { name: /close/i })[0]).toBeInTheDocument();
    });

    const closeButton = getAllByRole('button', { name: /close/i })[0];
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  test('shows warning when Add Registrant is clicked without selecting a member', async () => {
    const { queryByText } = renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    fireEvent.click(queryByText('Add Registrant') as Element);

    await waitFor(() =>
      expect(
        queryByText('Please choose an user to add first!'),
      ).toBeInTheDocument(),
    );
  });

  test('successfully adds registrant for non-recurring event', async () => {
    const { queryByText, queryByLabelText, findByText } = renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeAttendeesEmptyMock(), // Refetch
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantSuccessMock(),
    ]);

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    const input = queryByLabelText('Add an Registrant') as HTMLElement;
    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Select option by clicking
    const option = await findByText('John Doe');
    fireEvent.click(option);

    fireEvent.click(queryByText('Add Registrant') as Element);

    await waitFor(() =>
      expect(queryByText('Adding the attendee...')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Attendee added Successfully')).toBeInTheDocument(),
    );
  });

  test('handles error when add registrant mutation fails', async () => {
    const { queryByText, queryByLabelText, findByText } = renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantErrorMock(),
    ]);

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    const input = queryByLabelText('Add an Registrant') as HTMLElement;
    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Select option by clicking
    const option = await findByText('John Doe');
    fireEvent.click(option);

    fireEvent.click(queryByText('Add Registrant') as Element);

    await waitFor(() =>
      expect(queryByText('Adding the attendee...')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Error adding attendee')).toBeInTheDocument(),
    );
  });

  test('uses recurring variables when event is recurring (isRecurring branch)', async () => {
    const { queryByText, queryByLabelText, findByText } = renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeAttendeesEmptyMock(), // Refetch
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
      makeMembersWithOneMock(),
      makeAddRegistrantRecurringSuccessMock(),
    ]);

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    const input = queryByLabelText('Add an Registrant') as HTMLElement;
    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Select option by clicking
    const option = await findByText('John Doe');
    fireEvent.click(option);

    fireEvent.click(queryByText('Add Registrant') as Element);

    await waitFor(() =>
      expect(queryByText('Adding the attendee...')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Attendee added Successfully')).toBeInTheDocument(),
    );
  });

  test('noOptionsText and AddOnSpotAttendee modal open & reloadMembers callback', async () => {
    const { getByPlaceholderText, getByText, getByTestId, queryByTestId } =
      renderWithProviders([
        makeEventDetailsNonRecurringMock(),
        makeAttendeesEmptyMock(),
        makeMembersEmptyMock(),
        makeAttendeesEmptyMock(), // for reloadMembers refetch
      ]);

    await waitFor(() => {
      const input = getByPlaceholderText(
        'Choose the user that you want to add',
      );
      expect(input).toBeInTheDocument();
    });

    const input = getByPlaceholderText(
      'Choose the user that you want to add',
    ) as HTMLElement;
    fireEvent.change(input, { target: { value: 'NonexistentUser' } });

    await waitFor(() => {
      expect(getByText('No Registrations found')).toBeInTheDocument();
      expect(getByText('Add Onspot Registration')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Add Onspot Registration'));

    await waitFor(() =>
      expect(getByTestId('add-onspot-modal')).toBeInTheDocument(),
    );

    const reloadBtn = getByTestId('reload-members-btn');
    fireEvent.click(reloadBtn);

    const closeBtn = getByTestId('add-onspot-close');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(queryByTestId('add-onspot-modal')).not.toBeInTheDocument();
    });
  });

  test('Invite by Email button opens InviteByEmailModal and handleClose closes it', async () => {
    const { queryByText, getByTestId, queryByTestId } = renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    const inviteButton = queryByText('Invite by Email') as HTMLElement;
    fireEvent.click(inviteButton);

    await waitFor(() =>
      expect(getByTestId('invite-modal')).toBeInTheDocument(),
    );
    expect(getByTestId('invite-event-id').textContent).toBe('event123');
    expect(getByTestId('invite-is-recurring').textContent).toBe('false');

    const closeInvite = getByTestId('invite-close');
    fireEvent.click(closeInvite);

    await waitFor(() => {
      expect(queryByTestId('invite-modal')).not.toBeInTheDocument();
    });
  });

  test('InviteByEmailModal onInvitesSent callback triggers and isRecurring is true for recurring event', async () => {
    const { queryByText, getByTestId } = renderWithProviders([
      makeEventDetailsRecurringMock(),
      makeEventDetailsRecurringMock(),
      makeAttendeesEmptyMock(),
      makeAttendeesEmptyMock(), // Refetch
      makeAttendeesEmptyMock(),
      makeMembersWithOneMock(),
    ]);

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    const inviteButton = queryByText('Invite by Email') as HTMLElement;
    fireEvent.click(inviteButton);

    await waitFor(() => {
      expect(getByTestId('invite-modal')).toBeInTheDocument();
      expect(getByTestId('invite-is-recurring').textContent).toBe('true');
    });

    const sendBtn = getByTestId('invite-send');
    fireEvent.click(sendBtn);
    // coverage hits onInvitesSent -> attendeesRefetch
  });

  test('getOptionLabel falls back to "Unknown User" when member name is empty', async () => {
    const { getByLabelText, findByText } = renderWithProviders([
      makeEventDetailsNonRecurringMock(),
      makeAttendeesEmptyMock(),
      makeMembersUnknownNameMock(),
    ]);

    await waitFor(() =>
      expect(getByLabelText('Add an Registrant')).toBeInTheDocument(),
    );

    const input = getByLabelText('Add an Registrant') as HTMLElement;

    // Open options so the Autocomplete renders the items using getOptionLabel
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // This text only appears via getOptionLabel's "Unknown User" fallback
    const option = await findByText('Unknown User');
    expect(option).toBeInTheDocument();
  });
});
