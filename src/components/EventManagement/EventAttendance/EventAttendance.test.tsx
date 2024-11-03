import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import EventAttendance from './EventAttendance';
import {
  EVENT_ATTENDEES,
  EVENT_DETAILS,
  RECURRING_EVENTS,
} from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';

const mockAttendees = [
  {
    _id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    gender: 'MALE',
    eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
    createdAt: new Date().toISOString(),
    birthDate: new Date('1990-01-01'),
    __typename: 'User',
    tagsAssignedWith: {
      edges: [{ node: { _id: '1', name: 'Tag1' } }],
    },
  },
  {
    _id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    gender: 'FEMALE',
    eventsAttended: [{ _id: 'event123' }],
    createdAt: '2023-01-01',
    birthDate: new Date('1985-05-05'),
    __typename: 'Admin',
    tagsAssignedWith: {
      edges: [{ node: { _id: '1', name: 'Tag1' } }],
    },
  },
];

const mocks = [
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          attendees: mockAttendees,
        },
      },
    },
  },
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          title: 'Test Event',
          description: 'Test Description',
          startDate: '2023-05-01',
          endDate: '2023-05-02',
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: 'Test Location',
          recurring: false,
          baseRecurringEvent: {
            _id: 'recurringEvent123',
          },
          organization: {
            _id: 'org123',
            members: [{ _id: 'member1', firstName: 'John', lastName: 'Doe' }],
          },
          attendees: [{ _id: 'user1' }],
        },
      },
    },
  },
  {
    request: {
      query: RECURRING_EVENTS,
      variables: { baseRecurringEventId: 'recurringEvent123' },
    },
    result: {
      data: {
        getRecurringEvents: [
          {
            _id: 'recurringEvent1',
            startDate: '2023-05-01',
            title: 'Recurring Test Event 1',
            attendees: [
              {
                _id: 'user1',
                gender: 'MALE',
              },
              {
                _id: 'user2',
                gender: 'FEMALE',
              },
            ],
          },
          {
            _id: 'recurringEvent2',
            startDate: '2023-05-08',
            title: 'Recurring Test Event 2',
            attendees: [
              {
                _id: 'user1',
                gender: 'MALE',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          title: 'Test Event',
          description: 'Test Description',
          startDate: '2023-05-01',
          endDate: '2023-05-02',
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: 'Test Location',
          recurring: false,
          baseRecurringEvent: {
            _id: 'recurringEvent123',
          },
          organization: {
            _id: 'org123',
            members: [{ _id: 'member1', firstName: 'John', lastName: 'Doe' }],
          },
          attendees: [{ _id: 'user1' }],
        },
      },
    },
  },
];

// const showModal = jest.fn();
// const handleClose = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ eventId: 'event123', orgId: 'org123' }),
}));

describe('EventAttendance Component', () => {
  const renderComponent = (): ReturnType<typeof render> =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventAttendance />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

  test('renders table headers correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument();
      expect(screen.getByTestId('header-index')).toBeInTheDocument();
      expect(screen.getByTestId('header-member-name')).toBeInTheDocument();
      expect(screen.getByTestId('header-status')).toBeInTheDocument();
      expect(screen.getByTestId('header-events-attended')).toBeInTheDocument();
      expect(screen.getByTestId('header-task-assigned')).toBeInTheDocument();
    });
  });

  test('renders attendee rows with correct data', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('attendee-name-0')).toBeInTheDocument();
      expect(screen.getByTestId('attendee-name-1')).toHaveTextContent(
        'John Doe',
      );
    });
  });

  test('search functionality filters attendees correctly', async () => {
    renderComponent();
    const searchInput = await waitFor(() => screen.getByTestId('searchByName'));
    await userEvent.type(searchInput, 'John');
    await waitFor(() => {
      expect(screen.getByTestId('attendee-name-0')).toHaveTextContent(
        'John Doe',
      );
    });
  });

  test('sort functionality works correctly', async () => {
    renderComponent();
    await act(async () => {
      const sortDropdown = await screen.getByTestId('sort-dropdown');
      await userEvent.click(sortDropdown);
      const descendingOption = screen.getByText('Sort');
      await userEvent.click(descendingOption);
    });
    await waitFor(() => {
      const rows = screen.getAllByTestId(/attendee-name-/);
      expect(rows[0]).toHaveTextContent('Jane Smith');
    });
  });

  test('filter by date range works correctly', async () => {
    renderComponent();
    await act(async () => {
      const filterDropdown = await screen.findByText('Filter: All');
      await userEvent.click(filterDropdown);
      const thisMonthOption = await screen.findByText('This Month');
      await userEvent.click(thisMonthOption);
    });

    await waitFor(() => {
      const rows = screen.getAllByTestId(/attendee-row-/);
      expect(rows).toHaveLength(1);
    });
  });
  test('filter by date range works correctly with this year', async () => {
    renderComponent();
    await act(async () => {
      const filterDropdown = await screen.findByText('Filter: All');
      await userEvent.click(filterDropdown);
      const thisMonthOption = await screen.findByText('This Year');
      await userEvent.click(thisMonthOption);
    });

    await waitFor(() => {
      const rows = screen.getAllByTestId(/attendee-row-/);
      expect(rows).toHaveLength(1);
    });
  });
  test('displays correct number of events attended', async () => {
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getByTestId('attendee-events-attended-0'),
      ).toHaveTextContent('1');
      expect(
        screen.getByTestId('attendee-events-attended-1'),
      ).toHaveTextContent('2');
    });
  });
  // test('opens statistics modal and calls showModal when clicking Historical Statistics button', async () => {
  //   renderComponent();
  //   const statsButton = screen.getByTestId('stats-modal');
  //   await userEvent.click(statsButton);
  //   expect(showModal).toHaveBeenCalled();

  //   // Verify the modal is present
  //   await waitFor(() => {
  //     expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
  //   });

  //   // Simulate closing the modal
  //   await act(async () => {
  //     handleClose();
  //   });

  //   // Assert handleClose was called
  //   expect(handleClose).toHaveBeenCalled();
  // });
});
