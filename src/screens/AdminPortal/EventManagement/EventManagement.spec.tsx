import React, { act } from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { MemoryRouter, Route, Routes, useParams } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import EventManagement from './EventManagement';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MOCKS_WITH_TIME } from 'components/AdminPortal/EventManagement/Dashboard/EventDashboard.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, it } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
const { setItem, clearAllItems } = useLocalStorage();

vi.mock('@mui/icons-material', async () => {
  const actual = (await vi.importActual('@mui/icons-material')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    Edit: vi.fn(() => null),
    WarningAmberRounded: vi.fn(() => null),
    Circle: vi.fn(() => null),
    Group: vi.fn(() => null),
  };
});

const MOCKS_WITH_FIXED_TIME = JSON.parse(JSON.stringify(MOCKS_WITH_TIME));
MOCKS_WITH_FIXED_TIME[0].result.data.event.startTime =
  MOCKS_WITH_TIME[0].result.data.event.startAt;
MOCKS_WITH_FIXED_TIME[0].result.data.event.endTime =
  MOCKS_WITH_TIME[0].result.data.event.endAt;
MOCKS_WITH_FIXED_TIME[0].result.data.event.createdAt = dayjs
  .utc()
  .toISOString();
MOCKS_WITH_FIXED_TIME[0].result.data.event.updatedAt = dayjs
  .utc()
  .toISOString();
MOCKS_WITH_FIXED_TIME[0].result.data.event.creator.id = 'creator1';
MOCKS_WITH_FIXED_TIME[0].result.data.event.creator.name = 'John Doe';
MOCKS_WITH_FIXED_TIME[0].result.data.event.creator.emailAddress =
  'john.doe@example.com';
MOCKS_WITH_FIXED_TIME[0].result.data.event.organization = {
  _id: 'orgId',
  id: 'orgId',
  name: 'Test Organization',
};
MOCKS_WITH_FIXED_TIME[0].result.data.event.updater = {
  _id: 'updater1',
  id: 'updater1',
  firstName: 'Jane',
  lastName: 'Doe',
  name: 'Jane Doe',
  emailAddress: 'jane.doe@example.com',
};

const mockWithTime = new StaticMockLink(MOCKS_WITH_FIXED_TIME, true);

const renderEventManagement = (): RenderResult => {
  return render(
    <MockedProvider link={mockWithTime} mocks={MOCKS_WITH_FIXED_TIME}>
      <MemoryRouter initialEntries={['/admin/event/orgId/eventId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/admin/event/:orgId/:eventId"
                element={<EventManagement />}
              />
              <Route
                path="/admin/orglist"
                element={<div data-testid="paramsError">paramsError</div>}
              />
              <Route
                path="/admin/orgevents/:orgId"
                element={<div data-testid="eventsScreen">eventsScreen</div>}
              />
              <Route
                path="/user/events/:orgId"
                element={
                  <div data-testid="userEventsScreen">userEventsScreen</div>
                }
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Event Management', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  beforeAll(() => {
    vi.mock('react-router', async () => {
      const actual = await vi.importActual('react-router');
      return {
        ...actual,
        useParams: vi.fn(),
      };
    });
    vi.mock('components/EventListCard/Modal/EventListCardModals', () => ({
      __esModule: true,
      default: () => <div data-testid="event-list-card-modals" />,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearAllItems();
  });

  describe('Navigation Tests', () => {
    beforeEach(() => {
      vi.mocked(useParams).mockReturnValue({
        orgId: 'orgId',
        eventId: 'eventId',
      });
    });

    it('Testing back button navigation when userType is SuperAdmin', async () => {
      setItem('SuperAdmin', true);
      renderEventManagement();

      const backButton = screen.getByTestId('backBtn');
      await user.click(backButton);

      const eventsScreen = screen.getByTestId('eventsScreen');
      expect(eventsScreen).toBeInTheDocument();
    });

    it('Testing back button navigation when userType is USER', async () => {
      setItem('SuperAdmin', false);
      setItem('AdminFor', []);

      renderEventManagement();

      const backButton = screen.getByTestId('backBtn');
      await user.click(backButton);

      await waitFor(() => {
        const userEventsScreen = screen.getByTestId('userEventsScreen');
        expect(userEventsScreen).toBeInTheDocument();
      });
    });

    it('Testing back button navigation when userType is ADMIN', async () => {
      setItem('SuperAdmin', false);
      setItem('AdminFor', ['someOrg']);

      renderEventManagement();

      const backButton = screen.getByTestId('backBtn');
      await user.click(backButton);

      await waitFor(() => {
        const eventsScreen = screen.getByTestId('eventsScreen');
        expect(eventsScreen).toBeInTheDocument();
      });
    });
    it('redirects to orglist when params are missing', async () => {
      vi.mocked(useParams).mockReturnValue({});

      renderEventManagement();

      await waitFor(() => {
        const paramsError = screen.getByTestId('paramsError');
        expect(paramsError).toBeInTheDocument();
      });
    });
  });

  describe('Tab Management Tests', () => {
    beforeEach(() => {
      vi.mocked(useParams).mockReturnValue({
        orgId: 'orgId',
        eventId: 'event123',
      });
    });

    it('renders dashboard tab by default', async () => {
      renderEventManagement();
      expect(screen.getByTestId('eventDashboardTab')).toBeInTheDocument();
    });

    it('switches between all available tabs', async () => {
      renderEventManagement();

      const tabsToTest = [
        { button: 'registrantsBtn', tab: 'eventRegistrantsTab' },
        { button: 'attendanceBtn', tab: 'eventAttendanceTab' },
        { button: 'actionsBtn', tab: 'eventActionsTab' },
        { button: 'agendasBtn', tab: 'eventAgendasTab' },
        { button: 'statisticsBtn', tab: 'eventStatsTab' },
        { button: 'volunteersBtn', tab: 'eventVolunteersTab' },
      ];

      for (const { button, tab } of tabsToTest) {
        await user.click(screen.getByTestId(button));
        expect(screen.getByTestId(tab)).toBeInTheDocument();
      }
    });

    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ tab: 'invalid' }), // simulate invalid tab
      };
    });

    it('returns dashboard tab for an invalid tab selection', async () => {
      await act(async () => {
        renderEventManagement();
      });

      expect(screen.queryByTestId('eventDashboardTab')).toBeInTheDocument();
      expect(
        screen.queryByTestId('eventRegistrantsTab'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('eventAttendanceTab'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('eventActionsTab')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('eventVolunteersTab'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('eventAgendasTab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('eventStatsTab')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Dropdown Tests', () => {
    beforeEach(() => {
      vi.mocked(useParams).mockReturnValue({
        orgId: 'orgId',
        eventId: 'event123',
      });
    });

    it('renders dropdown with all options', async () => {
      await act(async () => {
        renderEventManagement();
      });

      const dropdownContainer = screen.getByTestId('tabsDropdownContainer');
      expect(dropdownContainer).toBeInTheDocument();

      await user.click(screen.getByTestId('tabsDropdownToggle'));

      const tabOptions = [
        'dashboard',
        'registrants',
        'attendance',
        'agendas',
        'actions',
        'volunteers',
        'statistics',
      ];

      tabOptions.forEach((option) => {
        expect(screen.getByTestId(`${option}DropdownItem`)).toBeInTheDocument();
      });
    });

    it('switches tabs through dropdown selection', async () => {
      await act(async () => {
        renderEventManagement();
      });
      await user.click(screen.getByTestId('tabsDropdownToggle'));

      const tabOptions = [
        'dashboard',
        'registrants',
        'attendance',
        'agendas',
        'actions',
        'volunteers',
        'statistics',
      ];

      for (const option of tabOptions) {
        await user.click(screen.getByTestId(`${option}DropdownItem`));

        expect(screen.getByTestId(`${option}DropdownItem`)).toHaveClass(
          'd-flex gap-2 dropdown-item',
        );
      }
    });
  });
});
