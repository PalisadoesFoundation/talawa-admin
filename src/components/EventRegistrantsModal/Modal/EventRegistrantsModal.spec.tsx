import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import * as EventRegistrantsModalModule from './EventRegistrantsModal';
import { EVENT_ATTENDEES, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  ADD_EVENT_ATTENDEE,
  REMOVE_EVENT_ATTENDEE,
} from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { InterfaceUser } from 'types/User/interface';
import { describe, test, expect, vi } from 'vitest';

const {
  EventRegistrantsModal,
  getAttendeeDisplayName,
  getAttendeeInitials,
  areMembersEqual,
} = EventRegistrantsModalModule;

vi.mock('./AddOnSpot/AddOnSpotAttendee', async () => {
  const React = await vi.importActual<typeof import('react')>('react');

  const MockAddOnSpotAttendee = ({
    show,
    handleClose,
    reloadMembers,
  }: {
    show: boolean;
    handleClose: () => void;
    reloadMembers: () => void;
  }) => {
    React.useEffect(() => {
      if (show) {
        reloadMembers();
        handleClose();
      }
    }, [show, reloadMembers, handleClose]);

    if (!show) {
      return null;
    }

    return <div data-testid="add-onspot-modal">Mock Add Onspot Attendee</div>;
  };

  return {
    __esModule: true,
    default: MockAddOnSpotAttendee,
    AddOnSpotAttendee: MockAddOnSpotAttendee,
  };
});
const createEventAttendeesMock = (
  attendees: Array<{
    _id: string | null;
    id?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    createdAt?: string | null;
    gender?: string | null;
    birthDate?: string | null;
    eventsAttended?: {
      _id: string;
    } | null;
  }>,
  occurrences = 1,
) =>
  Array.from({ length: occurrences }, () => ({
    request: {
      query: EVENT_ATTENDEES,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          attendees,
        },
      },
    },
  }));

const queryMockWithoutRegistrant = createEventAttendeesMock([], 2);

const queryMockWithRegistrant = createEventAttendeesMock(
  [
    {
      _id: 'user1',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2023-01-01',
      gender: 'Male',
      birthDate: '1990-01-01',
      eventsAttended: {
        _id: 'event123',
      },
    },
  ],
  2,
);

const queryMockWithUnknownRegistrant = createEventAttendeesMock(
  [
    {
      _id: null,
      id: null,
      name: null,
      firstName: null,
      lastName: null,
      createdAt: null,
      gender: null,
      birthDate: null,
      eventsAttended: {
        _id: 'event123',
      },
    },
  ],
  2,
);

const queryMockOrgMembers = [
  {
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
            role: 'REGULAR',
            avatarURL: null,
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
          },
        ],
      },
    },
  },
];
const queryMockWithoutOrgMembers = [
  {
    request: {
      query: MEMBERS_LIST,
      variables: { organizationId: 'org123' },
    },
    result: {
      data: {
        usersByOrganizationId: [],
      },
    },
  },
];

const successfulAddRegistrantMock = [
  {
    request: {
      query: ADD_EVENT_ATTENDEE,
      variables: { userId: 'user1', eventId: 'event123' },
    },
    result: {
      data: {
        addEventAttendee: { _id: 'user1' },
      },
    },
  },
];

const unsuccessfulAddRegistrantMock = [
  {
    request: {
      query: ADD_EVENT_ATTENDEE,
      variables: { userId: 'user1', eventId: 'event123' },
    },
    error: new Error('Oops'),
  },
];

const successfulRemoveRegistrantMock = [
  {
    request: {
      query: REMOVE_EVENT_ATTENDEE,
      variables: { userId: 'user1', eventId: 'event123' },
    },
    result: {
      data: {
        removeEventAttendee: { _id: 'user1' },
      },
    },
  },
];

const unsuccessfulRemoveRegistrantMock = [
  {
    request: {
      query: REMOVE_EVENT_ATTENDEE,
      variables: { userId: 'user1', eventId: 'event123' },
    },
    error: new Error('Oops'),
  },
];

describe('Testing Event Registrants Modal', () => {
  const props = {
    show: true,
    eventId: 'event123',
    orgId: 'org123',
    handleClose: vi.fn(),
  };

  test('The modal should be rendered, correct text must be displayed when there are no attendees and add attendee mutation must function properly', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[
          ...queryMockWithoutRegistrant,
          ...queryMockOrgMembers,
          ...successfulAddRegistrantMock,
        ]}
      >
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

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        queryByText('There are no registered attendees for this event.'),
      ).toBeInTheDocument(),
    );

    // Get warning modal on blank button click
    fireEvent.click(queryByText('Add Registrant') as Element);

    await waitFor(() =>
      expect(
        queryByText('Please choose an user to add first!'),
      ).toBeInTheDocument(),
    );

    // Choose a user to add as an attendee
    const attendeeInput = queryByLabelText('Add an Registrant');
    fireEvent.change(attendeeInput as Element, {
      target: { value: 'John Doe' },
    });
    fireEvent.keyDown(attendeeInput as HTMLElement, { key: 'ArrowDown' });
    fireEvent.keyDown(attendeeInput as HTMLElement, { key: 'Enter' });

    fireEvent.click(queryByText('Add Registrant') as Element);

    await waitFor(() =>
      expect(queryByText('Adding the attendee...')).toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(true).toBe(true);
    });
  });

  test('Add attendee mutation must fail properly', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[
          ...queryMockWithoutRegistrant,
          ...queryMockOrgMembers,
          ...unsuccessfulAddRegistrantMock,
        ]}
      >
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

    await waitFor(() =>
      expect(
        queryByText('There are no registered attendees for this event.'),
      ).toBeInTheDocument(),
    );

    // Choose a user to add as an attendee
    const attendeeInput = queryByLabelText('Add an Registrant');
    fireEvent.change(attendeeInput as Element, {
      target: { value: 'John Doe' },
    });
    fireEvent.keyDown(attendeeInput as HTMLElement, { key: 'ArrowDown' });
    fireEvent.keyDown(attendeeInput as HTMLElement, { key: 'Enter' });

    fireEvent.click(queryByText('Add Registrant') as Element);

    await waitFor(() =>
      expect(queryByText('Adding the attendee...')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Error adding attendee')).toBeInTheDocument(),
    );
  });

  test('Assigned attendees must be shown with badges and delete attendee mutation must function properly', async () => {
    const { queryByText, queryByTestId } = render(
      <MockedProvider
        addTypename={false}
        mocks={[
          ...queryMockWithRegistrant,
          ...queryMockOrgMembers,
          ...successfulRemoveRegistrantMock,
        ]}
      >
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

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument(),
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());

    fireEvent.click(queryByTestId('CancelIcon') as Element);

    await waitFor(() =>
      expect(queryByText('Removing the attendee...')).toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(true).toBe(true);
    });
  });

  test('Delete attendee mutation must fail properly', async () => {
    const { queryByText, getByTestId } = render(
      <MockedProvider
        addTypename={false}
        mocks={[
          ...queryMockWithRegistrant,
          ...queryMockOrgMembers,
          ...unsuccessfulRemoveRegistrantMock,
        ]}
      >
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

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument(),
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());

    const deleteButton = getByTestId('CancelIcon');
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(queryByText('Removing the attendee...')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Error removing attendee')).toBeInTheDocument(),
    );
  });

  test('Attendee without identifiers uses fallback UI and prevents deletion', async () => {
    const { queryByText, getByTestId } = render(
      <MockedProvider
        addTypename={false}
        mocks={[...queryMockWithUnknownRegistrant, ...queryMockOrgMembers]}
      >
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

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument(),
    );

    await waitFor(() => expect(queryByText('Unknown')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('?')).toBeInTheDocument());

    const deleteButton = getByTestId('CancelIcon');
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(
        queryByText('Unable to remove this attendee.'),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Removing the attendee...')).not.toBeInTheDocument(),
    );
  });
  test('Autocomplete functionality works correctly', async () => {
    const { getByTitle, getByText, getByPlaceholderText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[...queryMockWithoutRegistrant, ...queryMockWithoutOrgMembers]}
      >
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

    // Wait for loading state to finish
    await waitFor(() => {
      const autocomplete = getByPlaceholderText(
        'Choose the user that you want to add',
      );
      expect(autocomplete).toBeInTheDocument();
    });

    // Test empty state with no options
    const autocomplete = getByPlaceholderText(
      'Choose the user that you want to add',
    );
    fireEvent.change(autocomplete, { target: { value: 'NonexistentUser' } });

    await waitFor(() => {
      expect(getByText('No Registrations found')).toBeInTheDocument();
      expect(getByText('Add Onspot Registration')).toBeInTheDocument();
    });

    // Test clicking "Add Onspot Registration"
    fireEvent.click(getByText('Add Onspot Registration'));
    expect(getByText('Add Onspot Registration')).toBeInTheDocument();
    const closeButton = getByTitle('Close');
    fireEvent.click(closeButton);
  });
});

describe('Event Registrants helpers', () => {
  test('getAttendeeDisplayName falls back to full name when name missing', () => {
    const attendee: InterfaceUser = {
      id: 'user-1',
      createdAt: new Date(),
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
    };

    expect(getAttendeeDisplayName(attendee)).toBe('Ada Lovelace');
  });

  test('getAttendeeInitials returns fallback when derived initials are empty', () => {
    const attendee: InterfaceUser = {
      id: 'user-2',
      createdAt: new Date(),
      email: 'placeholder@example.com',
      name: '   ',
    };

    expect(getAttendeeInitials(attendee)).toBe('?');
  });

  test('areMembersEqual compares users by id', () => {
    const option: InterfaceUser = {
      id: 'user-3',
      createdAt: new Date(),
      email: 'option@example.com',
    };

    const sameIdValue: InterfaceUser = {
      id: 'user-3',
      createdAt: new Date(),
      email: 'value@example.com',
    };

    const differentIdValue: InterfaceUser = {
      id: 'user-4',
      createdAt: new Date(),
      email: 'different@example.com',
    };

    expect(areMembersEqual(option, sameIdValue)).toBe(true);
    expect(areMembersEqual(option, differentIdValue)).toBe(false);
  });

  test('getAttendeeDisplayName returns "Unknown" when all name fields missing', () => {
    const attendee: InterfaceUser = {
      id: 'user-x',
      createdAt: new Date(),
      email: 'noid@example.com',
    };

    expect(getAttendeeDisplayName(attendee)).toBe('Unknown');
  });

  test('areMembersEqual handles null/undefined inputs', () => {
    const user: InterfaceUser = {
      id: 'user-3',
      createdAt: new Date(),
      email: 'test@example.com',
    };

    expect(areMembersEqual(null, user)).toBe(false);
    expect(areMembersEqual(user, null)).toBe(false);
    expect(areMembersEqual(null, null)).toBe(false);
    expect(areMembersEqual(undefined, user)).toBe(false);
    expect(areMembersEqual(user, undefined)).toBe(false);
    expect(areMembersEqual(undefined, undefined)).toBe(false);
  });
});
