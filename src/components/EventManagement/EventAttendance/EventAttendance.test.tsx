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

const mockAttendees = [
  {
    _id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    gender: 'male',
    eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
    birthDate: new Date('1990-01-01'),
    __typename: 'User',
    tagsAssignedWith: {
      edges: [],
    },
  },
  {
    _id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    gender: 'female',
    eventsAttended: [],
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
          _id: 'event123',
          attendees: mockAttendees,
        },
      },
    },
  },
];

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

  test('renders EventAttendance component', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Historical Statistics')).toBeInTheDocument();
      expect(screen.getByText('Sort')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search member')).toBeInTheDocument();
    });
  });

  test('displays correct table headers', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('Member Name')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Events Attended')).toBeInTheDocument();
      expect(screen.getByText('Task Assigned')).toBeInTheDocument();
    });
  });

  test('displays correct member information', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Member')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getAllByText('0').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    });
  });

  test('displays correct number of table rows', async () => {
    renderComponent();

    await waitFor(() => {
      const rows = screen.getAllByTestId('row');
      expect(rows.length).toBeGreaterThan(2);
    });
  });

  test('filters attendees by search text', async () => {
    renderComponent();

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search member');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).toBeNull();
    });
  });

  test('sorts attendees by name', async () => {
    renderComponent();

    await waitFor(() => {
      const sortButton = screen.getByText('Sort');
      fireEvent.click(sortButton);
      const firstAttendee = screen.getAllByTestId('row')[1];
      expect(firstAttendee).toHaveTextContent('John Doe');
    });
  });

  test('shows modal with attendance statistics', async () => {
    renderComponent();

    await waitFor(() => {
      const statsButton = screen.getByText('Historical Statistics');
      fireEvent.click(statsButton);
      expect(screen.getByText('Attendance Rate')).toBeInTheDocument();
    });
  });
});
