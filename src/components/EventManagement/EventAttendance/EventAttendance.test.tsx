import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import EventAttendance from './EventAttendance';
import { EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';

const mockAttendees = [
  {
    _id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    gender: 'male',
    eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
    createdAt: new Date().toISOString(),
    birthDate: new Date('1990-01-01'),
    __typename: 'User',
    tagsAssignedWith: {
      edges: [{ node: { name: 'Tag1' } }],
    },
  },
  {
    _id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    gender: 'female',
    eventsAttended: [],
    createdAt: '2023-01-01',
    birthDate: new Date('1985-05-05'),
    __typename: 'Admin',
    tagsAssignedWith: {
      edges: [],
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
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ eventId: 'event123' }),
}));

describe('EventAttendance Component', () => {
  const renderComponent = () =>
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
      expect(screen.getByTestId('header-index')).toHaveTextContent('#');
      expect(screen.getByTestId('header-member-name')).toHaveTextContent(
        'Member Name',
      );
      expect(screen.getByTestId('header-status')).toHaveTextContent('Status');
      expect(screen.getByTestId('header-events-attended')).toHaveTextContent(
        'Events Attended',
      );
      expect(screen.getByTestId('header-task-assigned')).toHaveTextContent(
        'Task Assigned',
      );
    });
  });

  test('renders attendee rows with correct data', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getAllByText('Member')[0]).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });

  test('search functionality filters attendees correctly', async () => {
    renderComponent();
    await waitFor(() => {
      const searchInput = screen.getByTestId('searchByName');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  test('sort functionality works correctly', async () => {
    renderComponent();
    await waitFor(() => {
      const sortDropdown = screen.getByText('Sort');
      userEvent.click(sortDropdown);
      userEvent.click(screen.getByText('Descending'));
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('John Doe');
    });
  });

  test('filter by date range works correctly', async () => {
    renderComponent();
    await waitFor(() => {
      const filterDropdown = screen.getByText(/Filter:/);
      userEvent.click(filterDropdown);
      userEvent.click(screen.getByText('This Month'));
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  test('opens statistics modal when clicking Historical Statistics button', async () => {
    renderComponent();
    await waitFor(() => {
      const statsButton = screen.getByText('Historical Statistics');
      userEvent.click(statsButton);
      expect(screen.getByText(/Attendance Rate/)).toBeInTheDocument();
    });
  });

  test('displays correct number of events attended', async () => {
    renderComponent();
    await waitFor(() => {
      const johnEventsCount = screen.getByTestId('attendee-events-attended-0');
      expect(johnEventsCount).toHaveTextContent('2');
      const janeEventsCount = screen.getByTestId('attendee-events-attended-1');
      expect(janeEventsCount).toHaveTextContent('0');
    });
  });
});
