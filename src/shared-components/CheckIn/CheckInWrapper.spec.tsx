import React from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
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
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { vi, type Mock } from 'vitest';

vi.mock('shared-components/CRUDModalTemplate/hooks/useModalState', () => ({
  useModalState: vi.fn(),
}));

const link = new StaticMockLink(checkInQueryMock, true);

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

beforeEach(() => {
  (useModalState as Mock).mockReturnValue({
    isOpen: false,
    open: vi.fn(),
    close: vi.fn(),
    toggle: vi.fn(),
  });
});

describe('Testing CheckIn Wrapper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('The button to open the modal should work properly', async () => {
    vi.resetModules();

    const mockOpen = vi.fn();

    (useModalState as Mock).mockReturnValue({
      isOpen: false,
      open: mockOpen,
      close: vi.fn(),
      toggle: vi.fn(),
    });

    const { CheckInWrapper } = await import('./CheckInWrapper');

    const user = userEvent.setup({ delay: null });

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <CheckInWrapper eventId="event123" />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByLabelText('Check In Members'));
    expect(mockOpen).toHaveBeenCalledTimes(1);
  }, 60000);
});

describe('CheckInWrapper CSS Tests', () => {
  let CheckInWrapper: typeof import('./CheckInWrapper').CheckInWrapper;

  beforeAll(async () => {
    ({ CheckInWrapper } = await import('./CheckInWrapper'));
  });

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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
    const { container } = renderComponent();
    const image = within(container).getByAltText('Sort');
    expect(image).toHaveAttribute('src', '/images/svg/options-outline.svg');
    expect(image).toHaveAttribute('width', '30.63');
    expect(image).toHaveAttribute('height', '30.63');
  });
});

describe('CheckInWrapper callback behavior', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should call onCheckInUpdate callback when check-in is updated', async () => {
    vi.resetModules();

    vi.doMock('./Modal/CheckInModal', () => ({
      CheckInModal: ({ onCheckInUpdate }: { onCheckInUpdate?: () => void }) => (
        <button
          type="button"
          data-testid="mock-checkin-update"
          onClick={() => onCheckInUpdate?.()}
        >
          Mock Check-In Update
        </button>
      ),
    }));

    const { CheckInWrapper } = await import('./CheckInWrapper');

    (useModalState as Mock).mockReturnValue({
      isOpen: true,
      open: vi.fn(),
      close: vi.fn(),
      toggle: vi.fn(),
    });

    const user = userEvent.setup();
    const mockOnCheckInUpdate = vi.fn();

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <CheckInWrapper
                  eventId="event123"
                  onCheckInUpdate={mockOnCheckInUpdate}
                />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('mock-checkin-update'));

    expect(mockOnCheckInUpdate).toHaveBeenCalledTimes(1);
  });
});
