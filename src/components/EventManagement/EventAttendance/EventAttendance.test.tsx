import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EventAttendance from './EventAttendance';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

const mockMembers = [
  {
    _id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    image: '',
    createdAt: '2023-01-01',
    organizationsBlockedBy: [],
    __typename: 'User',
    eventsAttended: ['event1', 'event2'],
  },
  {
    _id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    image: '',
    createdAt: '2023-01-02',
    organizationsBlockedBy: [],
    __typename: 'Admin',
    eventsAttended: [],
  },
];

const mocks = [
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
            members: mockMembers,
          },
        ],
      },
    },
  },
];

describe('EventAttendance Component', () => {
  const renderComponent = (): any=>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventAttendance />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

  test('renders EventAttendance component', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Attendance Statistics')).toBeInTheDocument();
      expect(screen.getByText('Sort')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search event')).toBeInTheDocument();
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
    });
  });

  test('displays correct number of table rows', async () => {
    renderComponent();

    await waitFor(() => {
      const rows = screen.getAllByTestId('row');
      expect(rows.length).toBe(3);
    });
  });
});
