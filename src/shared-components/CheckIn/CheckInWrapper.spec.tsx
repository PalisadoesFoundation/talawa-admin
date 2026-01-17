import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { CheckInWrapper } from './CheckInWrapper';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { NotificationToastContainer } from 'components/NotificationToast/NotificationToast';

import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { checkInQueryMock } from './CheckInMocks';
import { StaticMockLink } from 'utils/StaticMockLink';

/**
 * This file contains unit tests for the CheckInWrapper component.
 *
 * The tests cover:
 * - Rendering and behavior of the modal component.
 * - Functionality of the button to open and close the modal.
 * - Integration with mocked GraphQL queries for testing Apollo Client.
 *
 * Purpose:
 * These tests ensure that the CheckInWrapper component behaves as expected
 * when opening and closing modals, and correctly integrates with its dependencies.
 */

const link = new StaticMockLink(checkInQueryMock, true);

describe('Testing CheckIn Wrapper', () => {
  const props = {
    eventId: 'event123',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('The button to open and close the modal should work properly', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <CheckInWrapper {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Open the modal
    await user.click(screen.getByLabelText('Check In Members'));

    await waitFor(() =>
      expect(screen.getByText(/Event Check In/i)).toBeInTheDocument(),
    );

    //  Close the modal
    const closebtn = screen.getByLabelText('Close');

    await user.click(closebtn);

    await waitFor(() =>
      expect(screen.queryByText(/Event Check In/i)).not.toBeInTheDocument(),
    );
  });
});

describe('CheckInWrapper CSS Tests', () => {
  const props = {
    eventId: 'event123',
  };

  const renderComponent = (): ReturnType<typeof render> => {
    return render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <CheckInWrapper {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  it('should render the options-outline SVG image with correct dimensions', () => {
    renderComponent();
    const image = screen.getByAltText('Sort');
    expect(image).toHaveAttribute('src', '/images/svg/options-outline.svg');
    expect(image).toHaveAttribute('width', '30.63');
    expect(image).toHaveAttribute('height', '30.63');
  });
});
