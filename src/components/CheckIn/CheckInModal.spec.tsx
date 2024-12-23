import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { CheckInModal } from './CheckInModal';
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
import { vi } from 'vitest';

const link = new StaticMockLink(checkInQueryMock, true);

describe('Testing Check In Attendees Modal', () => {
  const props = {
    show: true,
    eventId: 'event123',
    handleClose: vi.fn(),
  };

  /**
   * Test case for rendering the CheckInModal component and verifying functionality.
   * It checks that the modal renders fetched users and verifies the filtering mechanism.
   */

  test('The modal should be rendered, and all the fetched users should be shown properly and user filtering should work', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <CheckInModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Event Check In Management')).toBeInTheDocument(),
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('John2 Doe2')).toBeInTheDocument());

    // Tetst filtering of users
    fireEvent.change(queryByLabelText('Search Attendees') as Element, {
      target: { value: 'John Doe' },
    });

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText('John2 Doe2')).not.toBeInTheDocument(),
    );
  });
});
