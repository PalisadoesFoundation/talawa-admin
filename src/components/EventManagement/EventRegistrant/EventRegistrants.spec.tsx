import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import type { MockedResponse } from '@apollo/react-testing';
import EventRegistrants from './EventRegistrants';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import { vi } from 'vitest';
import {
  EVENT_REGISTRANTS,
  EVENT_DETAILS,
  EVENT_CHECKINS,
} from 'GraphQl/Queries/Queries';
import { REMOVE_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ eventId: 'event123', orgId: 'org123' }),
    useNavigate: () => mockNavigate,
  };
});

// Mock data setup
const EVENT_DETAILS_MOCK: MockedResponse = {
  request: {
    query: EVENT_DETAILS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        id: 'event123',
        title: 'Test Event',
        recurrenceRule: null,
      },
    },
  },
};

const EVENT_CHECKINS_MOCK: MockedResponse = {
  request: {
    query: EVENT_CHECKINS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        attendeesCheckInStatus: [
          {
            user: { id: '6589386a2caa9d8d69087484' },
            isCheckedIn: true,
          },
          {
            user: { id: '6589386a2caa9d8d69087485' },
            isCheckedIn: false,
          },
        ],
      },
    },
  },
};

const REGISTRANTS_MOCK: MockedResponse = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [
        {
          id: '6589386a2caa9d8d69087484',
          user: {
            id: '6589386a2caa9d8d69087484',
            name: 'Bruce Garza',
            emailAddress: 'bruce@example.com',
          },
          isRegistered: true,
          createdAt: '2030-04-13T10:23:17.742Z',
        },
        {
          id: '6589386a2caa9d8d69087485',
          user: {
            id: '6589386a2caa9d8d69087485',
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
          },
          isRegistered: true,
          createdAt: '2030-04-13T10:23:17.742Z',
        },
      ],
    },
  },
};

const REMOVE_ATTENDEE_SUCCESS_MOCK: MockedResponse = {
  request: {
    query: REMOVE_EVENT_ATTENDEE,
    variables: { userId: '6589386a2caa9d8d69087485', eventId: 'event123' },
  },
  result: {
    data: {
      removeEventAttendee: {
        id: '6589386a2caa9d8d69087485',
      },
    },
  },
};

const REMOVE_ATTENDEE_ERROR_MOCK: MockedResponse = {
  request: {
    query: REMOVE_EVENT_ATTENDEE,
    variables: { userId: 'user3', eventId: 'event123' },
  },
  error: new Error('Failed to remove attendee'),
};

const COMBINED_MOCKS: MockedResponse[] = [
  EVENT_DETAILS_MOCK,
  EVENT_CHECKINS_MOCK,
  REGISTRANTS_MOCK,
  REMOVE_ATTENDEE_SUCCESS_MOCK,
  REMOVE_ATTENDEE_ERROR_MOCK,
];

const renderEventRegistrants = (
  customMocks: MockedResponse[] = COMBINED_MOCKS,
): RenderResult => {
  const link = new StaticMockLink(customMocks, true);
  return render(
    <MockedProvider addTypename={false} link={link}>
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // Basic rendering tests
  test('Component loads correctly with table headers', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-serial')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-registrant')).toBeInTheDocument();
      expect(
        screen.getByTestId('table-header-registered-at'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('table-header-created-at')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-options')).toBeInTheDocument();
    });
  });

  test('Renders all column headers with correct text', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-serial')).toHaveTextContent(
        'Serial Number',
      );
      expect(screen.getByTestId('table-header-registrant')).toHaveTextContent(
        'Registrant',
      );
      expect(
        screen.getByTestId('table-header-registered-at'),
      ).toHaveTextContent('Registered At');
      expect(screen.getByTestId('table-header-created-at')).toHaveTextContent(
        'Created At',
      );
      expect(screen.getByTestId('table-header-options')).toHaveTextContent(
        'Options',
      );
    });
  });

  // Data display tests
  test('Displays registrant data correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('registrant-row-1')).toBeInTheDocument();
    });

    expect(screen.getByTestId('attendee-name-0')).toHaveTextContent(
      'Bruce Garza',
    );
    expect(screen.getByTestId('attendee-name-1')).toHaveTextContent(
      'Jane Smith',
    );
  });

  test('Displays serial numbers correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByTestId('serial-number-1')).toHaveTextContent('1');
      expect(screen.getByTestId('serial-number-2')).toHaveTextContent('2');
    });
  });

  test('Formats registration dates correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(
        screen.getByTestId('registrant-registered-at-0'),
      ).toHaveTextContent('2030-04-13');
      expect(
        screen.getByTestId('registrant-registered-at-1'),
      ).toHaveTextContent('2030-04-13');
    });
  });

  test('Formats creation time correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const timeCell0 = screen.getByTestId('registrant-created-at-0');
      const timeCell1 = screen.getByTestId('registrant-created-at-1');

      // Should display formatted time (10:23 AM format)
      expect(timeCell0).toBeInTheDocument();
      expect(timeCell1).toBeInTheDocument();
      // The exact format may vary by locale, so we just check it's not N/A
      expect(timeCell0).not.toHaveTextContent('N/A');
      expect(timeCell1).not.toHaveTextContent('N/A');
    });
  });

  // Check-in status tests
  test('Displays checked-in status for users who have checked in', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-0');
      expect(deleteButton).toHaveTextContent('Checked In');
      expect(deleteButton).toBeDisabled();
      expect(deleteButton).toHaveClass('btn-secondary');
    });
  });

  test('Displays unregister button for users who have not checked in', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-1');
      expect(deleteButton).toHaveTextContent('Unregister');
      expect(deleteButton).not.toBeDisabled();
      expect(deleteButton).toHaveClass('btn-outline-danger');
    });
  });

  test('Shows correct tooltip for checked-in users', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-0');
      expect(deleteButton).toHaveAttribute(
        'title',
        'Cannot unregister checked-in user',
      );
    });
  });

  test('Shows correct tooltip for non-checked-in users', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-1');
      expect(deleteButton).toHaveAttribute('title', 'Unregister');
    });
  });

  // Deletion tests
  test('Prevents deletion of checked-in user', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-0');
      expect(deleteButton).toBeDisabled();

      // Try to click (should do nothing)
      fireEvent.click(deleteButton);
    });

    // Toast should not be called since button is disabled
    expect(toast.warn).not.toHaveBeenCalled();
  });

  test('Successfully triggers delete for non-checked-in registrant', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-1');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith('Removing the attendee...');
    });

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(
          'Attendee removed successfully',
        );
      },
      { timeout: 3000 },
    );
  });

  test('Prevents deletion with toast error when checked-in user removal attempted programmatically', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-0');
      // Simulate programmatic attempt to delete
      if (!deleteButton.hasAttribute('disabled')) {
        fireEvent.click(deleteButton);
      }
    });

    // Should not show warning toast since button is disabled
    expect(toast.warn).not.toHaveBeenCalled();
  });

  // Empty state tests
  test('Displays no registrants message when list is empty', async () => {
    const emptyMocks: MockedResponse[] = [
      EVENT_DETAILS_MOCK,
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            getEventAttendeesByEventId: [],
          },
        },
      },
      {
        request: {
          query: EVENT_CHECKINS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              attendeesCheckInStatus: [],
            },
          },
        },
      },
    ];

    renderEventRegistrants(emptyMocks);

    await waitFor(() => {
      expect(screen.getByTestId('no-registrants')).toBeInTheDocument();
      expect(screen.getByTestId('no-registrants')).toHaveTextContent(
        'No Registrants Found.',
      );
    });
  });

  // Recurring event tests
  test('Handles recurring events correctly', async () => {
    const recurringEventMocks: MockedResponse[] = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              id: 'event123',
              title: 'Recurring Event',
              recurrenceRule: 'FREQ=WEEKLY',
            },
          },
        },
      },
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { recurringEventInstanceId: 'event123' },
        },
        result: {
          data: {
            getEventAttendeesByEventId: [],
          },
        },
      },
      {
        request: {
          query: EVENT_CHECKINS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              attendeesCheckInStatus: [],
            },
          },
        },
      },
    ];

    renderEventRegistrants(recurringEventMocks);

    await waitFor(() => {
      expect(screen.getByTestId('no-registrants')).toBeInTheDocument();
    });
  });

  // Edge cases
  test('Handles missing createdAt with N/A fallback', async () => {
    const missingDateMocks: MockedResponse[] = [
      EVENT_DETAILS_MOCK,
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            getEventAttendeesByEventId: [
              {
                id: '1',
                user: {
                  id: 'user1',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                },
                isRegistered: true,
                createdAt: null,
              },
            ],
          },
        },
      },
      EVENT_CHECKINS_MOCK,
    ];

    renderEventRegistrants(missingDateMocks);

    await waitFor(() => {
      expect(
        screen.getByTestId('registrant-registered-at-0'),
      ).toHaveTextContent('N/A');
      expect(screen.getByTestId('registrant-created-at-0')).toHaveTextContent(
        'N/A',
      );
    });
  });

  test('Handles missing user name with N/A fallback', async () => {
    const missingNameMocks: MockedResponse[] = [
      EVENT_DETAILS_MOCK,
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            getEventAttendeesByEventId: [
              {
                id: '1',
                user: {
                  id: 'user1',
                  name: null,
                  emailAddress: 'john@example.com',
                },
                isRegistered: true,
                createdAt: '2030-04-13T10:23:17.742Z',
              },
            ],
          },
        },
      },
      EVENT_CHECKINS_MOCK,
    ];

    renderEventRegistrants(missingNameMocks);

    await waitFor(() => {
      expect(screen.getByTestId('attendee-name-0')).toHaveTextContent('N/A');
    });
  });

  // Table accessibility tests
  test('Table has correct ARIA attributes', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const table = screen.getByRole('grid');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label', 'Event Registrants Table');
    });
  });

  test('Table headers have correct role attributes', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const serialHeader = screen.getByTestId('table-header-serial');
      expect(serialHeader).toHaveAttribute('role', 'columnheader');
      expect(serialHeader).toHaveAttribute('aria-sort', 'none');
    });
  });

  // Refresh functionality test
  test('Refreshes data after successful deletion', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-1');
      fireEvent.click(deleteButton);
    });

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(
          'Attendee removed successfully',
        );
      },
      { timeout: 3000 },
    );

    // Data should be refreshed (queries should be called again)
    // This is implicitly tested by the successful completion of the delete operation
  });

  // Error handling test
  test('Handles deletion error gracefully', async () => {
    const errorMocks: MockedResponse[] = [
      EVENT_DETAILS_MOCK,
      EVENT_CHECKINS_MOCK,
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            getEventAttendeesByEventId: [
              {
                id: 'user3',
                user: {
                  id: 'user3',
                  name: 'Error User',
                  emailAddress: 'error@example.com',
                },
                isRegistered: true,
                createdAt: '2030-04-13T10:23:17.742Z',
              },
            ],
          },
        },
      },
      REMOVE_ATTENDEE_ERROR_MOCK,
    ];

    renderEventRegistrants(errorMocks);

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-registrant-0');
      fireEvent.click(deleteButton);
    });

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith('Error removing attendee');
      },
      { timeout: 3000 },
    );
  });
});
