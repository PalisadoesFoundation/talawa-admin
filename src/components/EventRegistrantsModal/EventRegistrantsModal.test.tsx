import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventRegistrantsModal } from './EventRegistrantsModal';
import { EVENT_ATTENDEES, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  ADD_EVENT_ATTENDEE,
  REMOVE_EVENT_ATTENDEE,
} from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const queryMockWithoutRegistrant = [
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: { id: 'event123' },
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
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          attendees: [{ _id: 'user1', firstName: 'John', lastName: 'Doe' }],
        },
      },
    },
  },
];

const queryMockOrgMembers = [
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: 'org123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'org123',
            members: [
              {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@palisadoes.com',
                image: '',
                createdAt: '12/12/22',
                organizationsBlockedBy: [],
              },
            ],
          },
        ],
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
    handleClose: jest.fn(),
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
<<<<<<< HEAD
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument(),
=======
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Event Registrants')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('There are no registered attendees for this event.'),
      ).toBeInTheDocument(),
=======
        queryByText('There are no registered attendees for this event.')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    // Get warning modal on blank button click
    fireEvent.click(queryByText('Add Registrant') as Element);

    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('Please choose an user to add first!'),
      ).toBeInTheDocument(),
=======
        queryByText('Please choose an user to add first!')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      expect(queryByText('Adding the attendee...')).toBeInTheDocument(),
=======
      expect(queryByText('Adding the attendee...')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('Added the attendee successfully!'),
      ).toBeInTheDocument(),
=======
        queryByText('Added the attendee successfully!')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
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
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('There are no registered attendees for this event.'),
      ).toBeInTheDocument(),
=======
        queryByText('There are no registered attendees for this event.')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      expect(queryByText('Adding the attendee...')).toBeInTheDocument(),
=======
      expect(queryByText('Adding the attendee...')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('There was an error in adding the attendee!'),
      ).toBeInTheDocument(),
=======
        queryByText('There was an error in adding the attendee!')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument(),
=======
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());

    fireEvent.click(queryByTestId('CancelIcon') as Element);

    await waitFor(() =>
<<<<<<< HEAD
      expect(queryByText('Removing the attendee...')).toBeInTheDocument(),
=======
      expect(queryByText('Removing the attendee...')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('Removed the attendee successfully!'),
      ).toBeInTheDocument(),
=======
        queryByText('Removed the attendee successfully!')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });

  test('Delete attendee mutation must fail properly', async () => {
    const { queryByText, queryByTestId } = render(
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
<<<<<<< HEAD
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument(),
=======
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Registered Registrants')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());

    fireEvent.click(queryByTestId('CancelIcon') as Element);

    await waitFor(() =>
<<<<<<< HEAD
      expect(queryByText('Removing the attendee...')).toBeInTheDocument(),
=======
      expect(queryByText('Removing the attendee...')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('There was an error in removing the attendee!'),
      ).toBeInTheDocument(),
=======
        queryByText('There was an error in removing the attendee!')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });
});
