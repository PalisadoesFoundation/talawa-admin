import { render } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { vi } from 'vitest';

import CreateEventModal from '../CreateEventModal';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('@mui/x-date-pickers', async () => {
  const actual = await vi.importActual('@mui/x-date-pickers');
  const { MockPicker } = await import('../../../test-utils/mockDatePickers');

  return {
    ...actual,
    DatePicker: MockPicker,
    TimePicker: MockPicker,
  };
});

export const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  onEventCreated: vi.fn(),
  currentUrl: 'org123',
};

export const renderComponent = (
  props = mockProps,
  mocks: MockedResponse[] = [],
) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <CreateEventModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};
