import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    render(
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
      </MockedProvider>
    );

    // Open the modal
    fireEvent.click(screen.getByLabelText('checkInRegistrants') as Element);

    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).toBeInTheDocument()
    );

    //  Close the modal
    const closebtn = screen.getByLabelText('Close');

    fireEvent.click(closebtn as Element);

    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument()
    );
  });
});
