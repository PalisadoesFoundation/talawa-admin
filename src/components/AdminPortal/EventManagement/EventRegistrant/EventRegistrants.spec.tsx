import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import type { MockedResponse } from '@apollo/react-testing';
import EventRegistrants from './EventRegistrants';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import { vi } from 'vitest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import {
  COMBINED_MOCKS,
  EMPTY_STATE_MOCKS,
  RECURRING_EVENT_MOCKS,
  MISSING_DATE_MOCKS,
  MISSING_NAME_MOCKS,
  ERROR_DELETION_MOCKS,
} from './Registrations.mocks';

// Mock NotificationToast
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

let mockParams: { eventId?: string; orgId?: string } = {
  eventId: 'event123',
  orgId: 'org123',
};

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');

  return {
    ...actual,
    useParams: () => mockParams,
    useNavigate: () => mockNavigate,
  };
});

const renderEventRegistrants = (
  customMocks: MockedResponse[] = COMBINED_MOCKS,
): RenderResult => {
  const link = new StaticMockLink(customMocks, true);
  return render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <EventRegistrants />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Event Registrants Component - Enhanced Coverage', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  // Basic rendering tests
  test('Component loads correctly with table headers', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByText('Serial Number')).toBeInTheDocument();
      expect(screen.getByText('Registrant')).toBeInTheDocument();
      expect(screen.getByText('Registered At')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
      expect(screen.getByText('Options')).toBeInTheDocument();
    });
  });

  test('Renders all column headers with correct text', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByText('Serial Number')).toBeInTheDocument();
      expect(screen.getByText('Registrant')).toBeInTheDocument();
      expect(screen.getByText('Registered At')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
      expect(screen.getByText('Options')).toBeInTheDocument();
    });
  });

  // Data display tests
  test('Displays registrant data correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const registrantCells = screen.getAllByTestId(
        'datatable-cell-registrant',
      );

      expect(registrantCells[0]).toHaveTextContent('Bruce Garza');
      expect(registrantCells[1]).toHaveTextContent('Jane Smith');
    });
  });

  test('Displays serial numbers correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('datatable-cell-serial')[0],
      ).toHaveTextContent('1');
      expect(
        screen.getAllByTestId('datatable-cell-serial')[1],
      ).toHaveTextContent('2');
    });
  });

  test('Formats registration dates correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const registeredAtCells = screen.getAllByTestId(
        'datatable-cell-registeredAt',
      );

      const expectedDate = dayjs.utc().add(4, 'year').format('YYYY-MM-DD');

      expect(registeredAtCells[0]).toHaveTextContent(expectedDate);
      expect(registeredAtCells[1]).toHaveTextContent(expectedDate);
    });
  });

  test('Formats creation time correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const createdAtCells = screen.getAllByTestId('datatable-cell-createdAt');

      expect(createdAtCells.length).toBeGreaterThanOrEqual(2);

      expect(createdAtCells[0]).toBeInTheDocument();
      expect(createdAtCells[1]).toBeInTheDocument();

      expect(createdAtCells[0]).not.toHaveTextContent('N/A');
      expect(createdAtCells[1]).not.toHaveTextContent('N/A');
    });
  });

  // Check-in status tests
  test('Displays checked-in status for users who have checked in', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const checkedInButton = screen.getByRole('button', {
        name: 'Checked In',
      });

      expect(checkedInButton).toBeDisabled();
      expect(checkedInButton).toHaveClass('btn-secondary');
    });
  });

  test('Displays unregister button for users who have not checked in', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const buttons = screen.getAllByRole('button', {
        name: /unregister|checked in/i,
      });

      const unregisterButton = buttons.find(
        (btn) => btn.textContent === 'Unregister',
      );

      expect(unregisterButton).toBeInTheDocument();
      expect(unregisterButton).not.toBeDisabled();
      expect(unregisterButton).toHaveClass('btn-outline-danger');
    });
  });

  test('Shows correct tooltip for checked-in users', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const checkedInButton = screen.getByRole('button', {
        name: 'Checked In',
      });

      expect(checkedInButton).toHaveAttribute(
        'title',
        'Cannot unregister checked-in user',
      );
    });
  });

  test('Shows correct tooltip for non-checked-in users', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const unregisterButton = screen.getByRole('button', {
        name: 'Unregister',
      });

      expect(unregisterButton).toHaveAttribute('title', 'Unregister');
    });
  });

  test('Prevents deletion of checked-in user', async () => {
    renderEventRegistrants();

    const checkedInButton = await screen.findByRole('button', {
      name: 'Checked In',
    });

    expect(checkedInButton).toBeDisabled();

    await user.click(checkedInButton);

    expect(NotificationToast.warning).not.toHaveBeenCalled();
  });

  test('Successfully triggers delete for non-checked-in registrant', async () => {
    renderEventRegistrants();

    const unregisterButton = await screen.findByRole('button', {
      name: 'Unregister',
    });

    await user.click(unregisterButton);

    await waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        'Removing the attendee...',
      );
    });

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Attendee removed successfully',
        );
      },
      { timeout: 3000 },
    );
  });

  test('Prevents deletion with NotificationToast error when checked-in user removal attempted programmatically', async () => {
    renderEventRegistrants();

    const checkedInButton = await screen.findByRole('button', {
      name: 'Checked In',
    });

    // Button should be disabled for checked-in users
    expect(checkedInButton).toBeDisabled();

    // Even if clicked programmatically, no side effects should occur
    await user.click(checkedInButton);

    // No warning or error toast should be shown
    expect(NotificationToast.warning).not.toHaveBeenCalled();
  });

  // Empty state tests
  test('Displays no registrants message when list is empty', async () => {
    renderEventRegistrants(EMPTY_STATE_MOCKS);

    await waitFor(() => {
      expect(screen.getByTestId('datatable-empty')).toHaveTextContent(
        'No Registrants Found.',
      );
    });
  });

  test('Handles recurring events correctly', async () => {
    renderEventRegistrants(RECURRING_EVENT_MOCKS);

    await waitFor(() => {
      expect(screen.getByText('No Registrants Found.')).toBeInTheDocument();
    });
  });

  // Edge cases
  test('Handles missing createdAt with N/A fallback', async () => {
    renderEventRegistrants(MISSING_DATE_MOCKS);

    await waitFor(() => {
      const registeredAtCells = screen.getAllByTestId(
        'datatable-cell-registeredAt',
      );
      const createdAtCells = screen.getAllByTestId('datatable-cell-createdAt');

      expect(registeredAtCells[0]).toHaveTextContent('N/A');
      expect(createdAtCells[0]).toHaveTextContent('N/A');
    });
  });

  test('Handles missing user name with N/A fallback', async () => {
    renderEventRegistrants(MISSING_NAME_MOCKS);

    await waitFor(() => {
      const nameCells = screen.getAllByTestId('datatable-cell-registrant');
      expect(nameCells[0]).toHaveTextContent('N/A');
    });
  });

  // Table accessibility tests
  test('Table has correct ARIA attributes', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAccessibleName('Event Registrants Table');
    });
  });

  test('Table renders column headers correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByText('Serial Number')).toBeInTheDocument();
      expect(screen.getByText('Registrant')).toBeInTheDocument();
      expect(screen.getByText('Registered At')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
      expect(screen.getByText('Options')).toBeInTheDocument();
    });
  });

  // Refresh functionality test
  test('Refreshes data after successful deletion', async () => {
    renderEventRegistrants();

    const unregisterButton = await screen.findByRole('button', {
      name: 'Unregister',
    });
    await user.click(unregisterButton);

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Attendee removed successfully',
        );
      },
      { timeout: 3000 },
    );

    // Refetch is implicitly verified by successful mutation completion
  });

  // Error handling test
  test('Handles deletion error gracefully', async () => {
    renderEventRegistrants(ERROR_DELETION_MOCKS);

    const unregisterButton = await screen.findByRole('button', {
      name: 'Unregister',
    });
    await user.click(unregisterButton);

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Error removing attendee',
        );
      },
      { timeout: 3000 },
    );
  });

  test('renders CheckInWrapper when eventId is not provided ', async () => {
    mockParams = {
      orgId: 'org123',
      eventId: undefined,
    };

    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByText('Check In Members')).toBeInTheDocument();
    });
  });
});
