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
<<<<<<< HEAD
      </BrowserRouter>,
=======
      </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() => expect(queryByText('Check In')).toBeInTheDocument());

    fireEvent.click(queryByText('Check In') as Element);

    await waitFor(() =>
<<<<<<< HEAD
      expect(queryByText('Checked in successfully!')).toBeInTheDocument(),
=======
      expect(queryByText('Checked in successfully!')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======
          allotedRoom: '',
          allotedSeat: '',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </BrowserRouter>,
=======
      </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    // Stubbing functions required by the @pdfme to show pdfs
    global.URL.createObjectURL = jest.fn();
    global.window.open = jest.fn();

    await waitFor(() => expect(queryByText('Checked In')).toBeInTheDocument());
    await waitFor(() =>
<<<<<<< HEAD
      expect(queryByText('Download Tag')).toBeInTheDocument(),
=======
      expect(queryByText('Download Tag')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    fireEvent.click(queryByText('Download Tag') as Element);

    await waitFor(() =>
<<<<<<< HEAD
      expect(queryByText('Generating pdf...')).toBeInTheDocument(),
=======
      expect(queryByText('Generating pdf...')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </BrowserRouter>,
=======
      </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await waitFor(() => expect(queryByText('Check In')).toBeInTheDocument());

    fireEvent.click(queryByText('Check In') as Element);

    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('There was an error in checking in!'),
      ).toBeInTheDocument(),
=======
        queryByText('There was an error in checking in!')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    await waitFor(() => expect(queryByText('Oops')).toBeInTheDocument());
  });
});
