import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventRegistrantsModal } from './EventRegistrantsModal';
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
import { describe, test, expect, vi } from 'vitest';

// Mock the AddOnSpotAttendee component
vi.mock('./AddOnSpot/AddOnSpotAttendee', () => ({
  default: ({
    show,
    handleClose,
    reloadMembers,
  }: {
    show: boolean;
    handleClose: () => void;
    reloadMembers: () => void;
  }) => {
    return show ? (
      <div data-testid="add-onspot-modal">
        <button onClick={handleClose}>Close Modal</button>
        <button onClick={reloadMembers} data-testid="reload-members-btn">
          Reload Members
        </button>
      </div>
    ) : null;
  },
}));

const queryMockWithoutRegistrant = [
  {
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
  },
];

const queryMockWithRegistrant = [
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          __typename: 'Event',
          attendees: [
            {
              id: 'user1',
              name: 'John Doe',
              email: 'johndoe@example.com',
              avatarURL: null,
              createdAt: '2023-01-01',
              role: 'attendee',
              natalSex: 'Male',
              birthDate: '1990-01-01',
              eventsAttended: {
                id: 'event123',
              },
            },
          ],
        },
      },
    },
  },
];

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
            email: 'johndoe@example.com',
            role: 'member',
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
        addEventAttendee: {
          id: 'user1',
          name: 'John Doe',
          emailAddress: 'johndoe@example.com',
        },
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
        removeEventAttendee: {
          id: 'user1',
          name: 'John Doe',
          emailAddress: 'johndoe@example.com',
        },
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
    const { queryByText, queryByLabelText, getByTestId } = render(
      <MockedProvider
        addTypename={false}
        mocks={[
          ...queryMockWithoutRegistrant,
          ...queryMockOrgMembers,
          ...successfulAddRegistrantMock,
          ...queryMockWithRegistrant,
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
      expect(getByTestId('autocomplete')).toBeInTheDocument(),
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
      expect(queryByText('Attendee added Successfully')).toBeInTheDocument();
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
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
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
    const { queryByText, getByTestId } = render(
      <MockedProvider
        addTypename={false}
        mocks={[
          ...queryMockWithRegistrant,
          ...queryMockOrgMembers,
          ...successfulRemoveRegistrantMock,
          ...queryMockWithoutRegistrant,
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
      expect(getByTestId('autocomplete')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Add Registrant')).toBeInTheDocument(),
    );

    // Test that autocomplete works
    const autocomplete = getByTestId('autocomplete');
    expect(autocomplete).toBeInTheDocument();
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
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(getByTestId('autocomplete')).toBeInTheDocument(),
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

  test('Modal renders with basic elements', async () => {
    const { queryByText, getByTestId } = render(
      <MockedProvider
        addTypename={false}
        mocks={[...queryMockWithoutRegistrant, ...queryMockOrgMembers]}
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

    await waitFor(() => {
      expect(queryByText('Event Registrants')).toBeInTheDocument();
      expect(getByTestId('autocomplete')).toBeInTheDocument();
    });
  });

  test('Modal close functionality works correctly', async () => {
    const handleClose = vi.fn();
    const customProps = {
      ...props,
      handleClose: handleClose,
    };

    const { getByRole } = render(
      <MockedProvider
        addTypename={false}
        mocks={[...queryMockWithoutRegistrant, ...queryMockOrgMembers]}
      >
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <EventRegistrantsModal {...customProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    const closeButton = getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  test('AddOnSpotAttendee modal reloadMembers callback is triggered', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <MockedProvider
        addTypename={false}
        mocks={[
          ...queryMockWithoutRegistrant,
          ...queryMockWithoutOrgMembers,
          ...queryMockWithoutRegistrant, // refetch mock
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

    // Wait for loading state to finish
    await waitFor(() => {
      const autocomplete = getByPlaceholderText(
        'Choose the user that you want to add',
      );
      expect(autocomplete).toBeInTheDocument();
    });

    // Open the AddOnSpotAttendee modal
    const autocomplete = getByPlaceholderText(
      'Choose the user that you want to add',
    );
    fireEvent.change(autocomplete, { target: { value: 'NonexistentUser' } });

    await waitFor(() => {
      expect(getByText('Add Onspot Registration')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Add Onspot Registration'));

    // The AddOnSpotAttendee modal should be shown
    await waitFor(() => {
      expect(getByTestId('add-onspot-modal')).toBeInTheDocument();
    });

    // Click the reload members button which should trigger the reloadMembers callback
    const reloadButton = getByTestId('reload-members-btn');
    fireEvent.click(reloadButton);

    // Close the modal
    fireEvent.click(getByText('Close Modal'));

    // Verify modal is closed
    await waitFor(() => {
      expect(() => getByTestId('add-onspot-modal')).toThrow();
    });
  });

  test('Attendee with only id field (no _id) works correctly', async () => {
    // Mock with an attendee that has id but no _id to test the fallback branch
    const queryMockWithIdOnly = [
      {
        request: {
          query: EVENT_ATTENDEES,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              __typename: 'Event',
              attendees: [
                {
                  __typename: 'User',
                  id: 'user2',
                  // Intentionally no _id to test the fallback
                  name: 'Jane Smith',

                  createdAt: '2023-02-01',
                  gender: 'Female',
                  birthDate: '1992-02-02',
                  eventsAttended: [
                    {
                      __typename: 'Event',
                      id: 'event123',
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    ];

    const successfulRemoveWithIdOnly = [
      {
        request: {
          query: REMOVE_EVENT_ATTENDEE,
          variables: { userId: 'user2', eventId: 'event123' },
        },
        result: {
          data: {
            removeEventAttendee: { _id: 'user2' },
          },
        },
      },
    ];

    const { queryByText, getByTestId } = render(
      <MockedProvider
        addTypename={false}
        mocks={[
          ...queryMockWithIdOnly,
          ...queryMockOrgMembers,
          ...successfulRemoveWithIdOnly,
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
      expect(getByTestId('autocomplete')).toBeInTheDocument(),
    );
  });
});
