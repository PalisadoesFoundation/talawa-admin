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
    createdAt: '2023-01-01',
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
    createdAt: '2023-06-01',
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
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('None')).toBeInTheDocument();
    });
  });

  test('filters attendees by search text', async () => {
    renderComponent();
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search member');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  test('sorts attendees by name', async () => {
    renderComponent();
    await waitFor(() => {
      const sortButton = screen.getByText('Sort');
      fireEvent.click(sortButton);
      fireEvent.click(screen.getByText('Descending'));
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('John Doe');
      expect(rows[2]).toHaveTextContent('Jane Smith');
    });
  });

  test('filters attendees by date range', async () => {
    renderComponent();
    await waitFor(() => {
      const filterButton = screen.getByText('Filter: All');
      fireEvent.click(filterButton);
      fireEvent.click(screen.getByText('This Month'));
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
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

  test('displays tooltip with attended events', async () => {
    renderComponent();
    await waitFor(() => {
      const eventsAttendedCell = screen.getByText('2');
      fireEvent.mouseOver(eventsAttendedCell);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  test('handles empty attendees list', async () => {
    const emptyMock = [
      {
        request: {
          query: EVENT_ATTENDEES,
          variables: { id: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              attendees: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMock} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventAttendance />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });
});
