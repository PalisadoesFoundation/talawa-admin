import { MockedProvider } from '@apollo/react-testing';
import { toast } from 'react-toastify';

import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import EventRegistrants from './EventRegistrants';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import {
  COMBINED_MOCKS,
  EVENT_CHECKINS_MOCK,
  EVENT_CHECKINS_WITH_CHECKED_IN_MOCK,
  EVENT_DETAILS_MOCK,
  EVENT_DETAILS_RECURRING_MOCK,
  MOCK_REGISTRANTS,
  REMOVE_REGISTRANT_SUCCESS_MOCK,
  MOCK_REGISTRANTS_WITH_NULL_CREATED_AT,
  MOCK_REGISTRANTS_WITH_EMPTY_USER,
  EVENT_CHECKINS_WITH_UNDEFINED_ATTENDEES,
  MOCK_REGISTRANTS_NULL,
  EventRegistrantsMockType,
} from './EventRegistrants.mocks';
import { vi } from 'vitest';
import { EVENT_REGISTRANTS } from 'GraphQl/Queries/Queries';
import styles from 'style/app-fixed.module.css';
import { CheckInWrapper as MockedCheckInWrapper } from 'components/CheckIn/CheckInWrapper';
import { EventRegistrantsWrapper as MockedEventRegistrantsWrapper } from 'components/EventRegistrantsModal/EventRegistrantsWrapper';
import type { TFunction } from 'i18next';
import * as Utils from './utils';

vi.mock('components/CheckIn/CheckInWrapper', () => ({
  CheckInWrapper: vi.fn((props) => (
    <div data-testid="mock-checkin-wrapper" {...props} />
  )),
}));

vi.mock('components/EventRegistrantsModal/EventRegistrantsWrapper', () => ({
  EventRegistrantsWrapper: vi.fn((props) => (
    <div data-testid="mock-event-registrants-wrapper" {...props} />
  )),
}));

const mocks = vi.hoisted(() => {
  return { useParams: vi.fn() };
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: mocks.useParams,
    useNavigate: vi.fn(),
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

const renderEventRegistrants = (
  customMocks: EventRegistrantsMockType[] = COMBINED_MOCKS,
) => {
  const customLink = new StaticMockLink(customMocks, true);
  return render(
    <MockedProvider addTypename={false} link={customLink}>
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

describe('Event Registrants Component', () => {
  beforeEach(() => {
    mocks.useParams.mockReturnValue({ eventId: 'event123', orgId: 'org123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly with table headers', async () => {
    renderEventRegistrants();
    await waitFor(() => {
      expect(screen.getByTestId('table-header-serial')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-registrant')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-created-at')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-options')).toBeInTheDocument();
    });
  });

  test('Handles empty registrants list', async () => {
    const emptyMocks = [
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { eventId: 'event123' },
        },
        result: { data: { getEventAttendeesByEventId: [] } },
      },
      EVENT_DETAILS_MOCK,
      EVENT_CHECKINS_MOCK,
    ];
    renderEventRegistrants(emptyMocks);
    await waitFor(() => {
      expect(screen.getByTestId('no-registrants')).toBeInTheDocument();
    });
  });

  test('CheckInWrapper should call with empty eventId', async () => {
    mocks.useParams.mockReturnValue({ eventId: undefined, orgId: 'org123' });
    renderEventRegistrants();
    await waitFor(() => {
      expect(MockedCheckInWrapper).toHaveBeenCalledWith(
        expect.objectContaining({ eventId: '' }),
        undefined,
      );
    });
  });

  test('CheckInWrapper should be called with correct eventId and onCheckInUpdate when eventId is defined', async () => {
    renderEventRegistrants();
    await waitFor(() => {
      expect(MockedCheckInWrapper).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'event123',
          onCheckInUpdate: expect.any(Function),
        }),
        undefined,
      );
    });
  });

  test('EventRegistrantsWrapper should not be called when eventId is undefined', async () => {
    mocks.useParams.mockReturnValue({ eventId: undefined, orgId: 'org123' });
    renderEventRegistrants();
    await waitFor(() => {
      expect(MockedEventRegistrantsWrapper).not.toHaveBeenCalled();
    });
  });

  test('EventRegistrantsWrapper should not be called when orgId is undefined', async () => {
    mocks.useParams.mockReturnValue({ eventId: 'event123', orgId: undefined });
    renderEventRegistrants();
    await waitFor(() => {
      expect(MockedEventRegistrantsWrapper).not.toHaveBeenCalled();
    });
  });

  test('EventRegistrantsWrapper should be called with correct props when both eventId and orgId are defined', async () => {
    renderEventRegistrants();
    await waitFor(() => {
      expect(MockedEventRegistrantsWrapper).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'event123',
          orgId: 'org123',
          onUpdate: expect.any(Function),
        }),
        undefined,
      );
    });
  });

  test('Successfully combines and displays registrant and attendee data', async () => {
    renderEventRegistrants();
    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });
    expect(screen.getByTestId('attendee-name-0')).toHaveTextContent(
      'Bruce Garza',
    );
    expect(screen.getByTestId('registrant-registered-at-0')).toHaveTextContent(
      '2024-07-22',
    );
  });

  test('Handles missing createdAt data with fallback values', async () => {
    const mocksWithMissingFields = [
      MOCK_REGISTRANTS_WITH_NULL_CREATED_AT,
      EVENT_DETAILS_MOCK,
      EVENT_CHECKINS_MOCK,
    ];
    renderEventRegistrants(mocksWithMissingFields);
    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });
    expect(screen.getByTestId('attendee-name-0')).toHaveTextContent('Jane Doe');
    expect(screen.getByTestId('registrant-created-at-0')).toHaveTextContent(
      'N/A',
    );
  });

  test('should handle non-empty registrant with empty user object', async () => {
    const mocksWithEmptyUser = [
      MOCK_REGISTRANTS_WITH_EMPTY_USER,
      EVENT_DETAILS_MOCK,
      EVENT_CHECKINS_MOCK,
    ];
    renderEventRegistrants(mocksWithEmptyUser);
    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });
    expect(screen.getByTestId('attendee-name-0')).toHaveTextContent('N/A');
  });

  test('should call deleteRegistrantUtil when unregister button is clicked', async () => {
    const deleteRegistrantUtilSpy = vi.spyOn(Utils, 'deleteRegistrantUtil');
    renderEventRegistrants([...COMBINED_MOCKS, REMOVE_REGISTRANT_SUCCESS_MOCK]);

    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });

    const unregisterButton = screen.getByTestId('delete-registrant-0');
    fireEvent.click(unregisterButton);

    await waitFor(() => {
      expect(deleteRegistrantUtilSpy).toHaveBeenCalled();
    });
  });

  test('should disable unregister button for checked-in user', async () => {
    renderEventRegistrants([
      MOCK_REGISTRANTS,
      EVENT_DETAILS_MOCK,
      EVENT_CHECKINS_WITH_CHECKED_IN_MOCK,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });

    const unregisterButton = screen.getByTestId('delete-registrant-0');
    await waitFor(() => {
      expect(unregisterButton).toBeDisabled();
    });
    expect(unregisterButton).toHaveAttribute(
      'title',
      'Cannot unregister checked-in user',
    );
  });

  test('should fetch registrants for a recurring event', async () => {
    const recurringMocks = [
      MOCK_REGISTRANTS,
      EVENT_DETAILS_RECURRING_MOCK,
      EVENT_CHECKINS_MOCK,
    ];
    renderEventRegistrants(recurringMocks);
    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });
  });

  test('should handle undefined attendeesCheckInStatus in check-in', async () => {
    const mocksWithUndefinedAttendees = [
      MOCK_REGISTRANTS,
      EVENT_DETAILS_MOCK,
      EVENT_CHECKINS_WITH_UNDEFINED_ATTENDEES,
    ];
    renderEventRegistrants(mocksWithUndefinedAttendees);
    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });
  });

  test('should handle missing getEventAttendeesByEventId in registrants query response', async () => {
    const mocksWithMissingRegistrants = [
      MOCK_REGISTRANTS_NULL,
      EVENT_DETAILS_MOCK,
      EVENT_CHECKINS_MOCK,
    ];
    renderEventRegistrants(mocksWithMissingRegistrants);
    await waitFor(() => {
      expect(screen.getByTestId('no-registrants')).toBeInTheDocument();
    });
  });
});

describe('deleteRegistrantUtil edge cases', () => {
  const refreshData = vi.fn();
  const baseArgs = {
    userId: 'user-1',
    eventId: 'event-1',
  };

  const mockT = ((key: string) => key) as unknown as TFunction;

  beforeEach(() => {
    refreshData.mockReset();
    vi.clearAllMocks();
  });

  test('should not call mutation when user already checked in', async () => {
    const removeRegistrantMutation = vi.fn();
    await Utils.deleteRegistrantUtil(
      baseArgs.userId,
      false,
      baseArgs.eventId,
      removeRegistrantMutation,
      refreshData,
      [baseArgs.userId],
      mockT,
    );

    expect(toast.error).toHaveBeenCalledWith('cannotUnregisterCheckedIn');
    expect(removeRegistrantMutation).not.toHaveBeenCalled();
  });

  test('should surface mutation errors', async () => {
    const error = new Error('Mutation failed');
    const removeRegistrantMutation = vi.fn().mockRejectedValueOnce(error);

    await Utils.deleteRegistrantUtil(
      baseArgs.userId,
      false,
      baseArgs.eventId,
      removeRegistrantMutation,
      refreshData,
      [],
      mockT,
    );

    await Promise.resolve();
    expect(toast.error).toHaveBeenCalledWith('errorRemovingAttendee');
    expect(toast.error).toHaveBeenCalledWith(error.message);
  });

  test('should handle non-Error mutation failures', async () => {
    const error = 'Unknown error';
    const removeRegistrantMutation = vi.fn().mockRejectedValueOnce(error);

    await Utils.deleteRegistrantUtil(
      baseArgs.userId,
      false,
      baseArgs.eventId,
      removeRegistrantMutation,
      refreshData,
      [],
      mockT,
    );

    await Promise.resolve();
    expect(toast.error).toHaveBeenCalledWith('errorRemovingAttendee');
    expect(toast.error).not.toHaveBeenCalledWith(error);
  });

  test('should surface mutation errors for recurring events', async () => {
    const error = new Error('Mutation failed');
    const removeRegistrantMutation = vi.fn().mockRejectedValueOnce(error);

    await Utils.deleteRegistrantUtil(
      baseArgs.userId,
      true,
      baseArgs.eventId,
      removeRegistrantMutation,
      refreshData,
      [],
      mockT,
    );

    await Promise.resolve();
    expect(toast.error).toHaveBeenCalledWith('errorRemovingAttendee');
    expect(toast.error).toHaveBeenCalledWith(error.message);
  });

  it('should resolve immediately when eventId is undefined', async () => {
    const removeRegistrantMutation = vi.fn();
    await Utils.deleteRegistrantUtil(
      'user1',
      false,
      undefined,
      removeRegistrantMutation,
      refreshData,
      [],
      mockT,
    );

    expect(removeRegistrantMutation).not.toHaveBeenCalled();
    expect(refreshData).not.toHaveBeenCalled();
  });
});

describe('EventRegistrants CSS Tests', () => {
  beforeEach(() => {
    mocks.useParams.mockReturnValue({ eventId: 'event123', orgId: 'org123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should apply correct styles to the table container', async () => {
    renderEventRegistrants();
    await waitFor(() => {
      const tableContainer = screen.getByRole('grid').closest('.MuiPaper-root');
      expect(tableContainer).toHaveClass('mt-3');
      expect(tableContainer).toHaveStyle({ borderRadius: '16px' });
    });
  });

  it('should style table header cells with custom cell class', async () => {
    renderEventRegistrants();
    await waitFor(() => {
      const headerCells = [
        screen.getByTestId('table-header-serial'),
        screen.getByTestId('table-header-registrant'),
        screen.getByTestId('table-header-registered-at'),
        screen.getByTestId('table-header-created-at'),
        screen.getByTestId('table-header-options'),
      ];
      headerCells.forEach((cell) => {
        expect(cell).toHaveClass(styles.customcell);
      });
    });
  });
});
