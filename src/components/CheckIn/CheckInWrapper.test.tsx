import React from 'react';
<<<<<<< HEAD
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
=======
import { fireEvent, render, waitFor } from '@testing-library/react';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { MockedProvider } from '@apollo/react-testing';
import { CheckInWrapper } from './CheckInWrapper';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { checkInQueryMock } from './mocks';
import { StaticMockLink } from 'utils/StaticMockLink';

const link = new StaticMockLink(checkInQueryMock, true);

describe('Testing CheckIn Wrapper', () => {
  const props = {
    eventId: 'event123',
  };

  test('The button to open and close the modal should work properly', async () => {
<<<<<<< HEAD
    render(
=======
    const { queryByText } = render(
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <CheckInWrapper {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );

    // Open the modal
    fireEvent.click(screen.getByLabelText('checkInRegistrants') as Element);

    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).toBeInTheDocument(),
    );

    //  Close the modal
    const closebtn = screen.getByLabelText('Close');

    fireEvent.click(closebtn as Element);

    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument(),
    );
=======
      </MockedProvider>
    );

    // Open the modal
    fireEvent.click(queryByText('Check In Registrants') as Element);

    await waitFor(() =>
      expect(queryByText('Event Check In Management')).toBeInTheDocument()
    );

    /* 
    TODO 
    The following test of closing the modal should be uncommented when the memory leak issue of MUI Data Grid is fixed.

    It will consequently ensure 100% coverage of the file. 
    */
    // Close the modal
    // fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);
    // await waitFor(() =>
    //   expect(queryByText('Event Check In Management')).not.toBeInTheDocument()
    // );
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});
