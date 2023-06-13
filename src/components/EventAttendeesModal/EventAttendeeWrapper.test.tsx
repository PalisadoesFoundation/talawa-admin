import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventAttendeeWrapper } from './EventAttendeeWrapper';
import { EVENT_ATTENDEES, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const queryMock = [
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

describe('Testing Event Attendees Wrapper', () => {
  const props = {
    eventId: 'event123',
    orgId: 'org123',
  };

  test('The button should work properly', async () => {
    const { queryByText, queryByRole } = render(
      <MockedProvider addTypename={false} mocks={queryMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <EventAttendeeWrapper {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    // Open the modal
    fireEvent.click(queryByText('Show Attendees') as Element);

    await waitFor(() =>
      expect(queryByText('Event Attendees')).toBeInTheDocument()
    );

    // Close the modal
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);
    await waitFor(() =>
      expect(queryByText('Event Attendees')).not.toBeInTheDocument()
    );
  });
});
