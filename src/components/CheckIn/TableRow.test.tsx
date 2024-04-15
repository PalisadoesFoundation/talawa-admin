import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TableRow } from './TableRow';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MockedProvider } from '@apollo/react-testing';
import { checkInMutationSuccess, checkInMutationUnsuccess } from './mocks';

describe('Testing Table Row for CheckIn Table', () => {
  test('If the user in not checked in, button to check in should be displayed, and the user should be able to check in succesfully', async () => {
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkIn: null,
        eventId: `event123`,
      },
      refetch: jest.fn(),
    };

    const { queryByText } = render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockedProvider addTypename={false} mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    await waitFor(() => expect(queryByText('Check In')).toBeInTheDocument());

    fireEvent.click(queryByText('Check In') as Element);

    await waitFor(() =>
      expect(queryByText('Checked in successfully!')).toBeInTheDocument(),
    );
  });

  test('If the user in checked in, option to download tag should be shown', async () => {
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkIn: {
          _id: '123',
          time: '12:00:00',
        },
        eventId: `event123`,
      },
      refetch: jest.fn(),
    };

    const { queryByText } = render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockedProvider addTypename={false} mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    // Stubbing functions required by the @pdfme to show pdfs
    global.URL.createObjectURL = jest.fn();
    global.window.open = jest.fn();

    await waitFor(() => expect(queryByText('Checked In')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText('Download Tag')).toBeInTheDocument(),
    );

    fireEvent.click(queryByText('Download Tag') as Element);

    await waitFor(() =>
      expect(queryByText('Generating pdf...')).toBeInTheDocument(),
    );
    await waitFor(() => {
      expect(queryByText('PDF generated successfully!')).toBeInTheDocument();
    });
  });

  test('Upon failing of check in mutation, the appropiate error message should be shown', async () => {
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkIn: null,
        eventId: `event123`,
      },
      refetch: jest.fn(),
    };

    const { queryByText } = render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockedProvider addTypename={false} mocks={checkInMutationUnsuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    await waitFor(() => expect(queryByText('Check In')).toBeInTheDocument());

    fireEvent.click(queryByText('Check In') as Element);

    await waitFor(() =>
      expect(
        queryByText('There was an error in checking in!'),
      ).toBeInTheDocument(),
    );
    await waitFor(() => expect(queryByText('Oops')).toBeInTheDocument());
  });
});
