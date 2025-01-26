import React, { act } from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import EventManagement from './EventManagement';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MOCKS_WITH_TIME } from 'components/EventManagement/Dashboard/EventDashboard.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
const { setItem } = useLocalStorage();

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);

const renderEventManagement = (): RenderResult => {
  return render(
    <MockedProvider
      addTypename={false}
      link={mockWithTime}
      mocks={MOCKS_WITH_TIME}
    >
      <MemoryRouter initialEntries={['/event/orgId/eventId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/event/:orgId/:eventId"
                element={<EventManagement />}
              />
              <Route
                path="/orglist"
                element={<div data-testid="paramsError">paramsError</div>}
              />
              <Route
                path="/orgevents/:orgId"
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
  beforeAll(() => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
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
      userEvent.click(backButton);
      await waitFor(() => {
        const eventsScreen = screen.getByTestId('eventsScreen');
        expect(eventsScreen).toBeInTheDocument();
      });
    });

    it('Testing back button navigation when userType is USER', async () => {
      setItem('SuperAdmin', false);
      setItem('AdminFor', []);

      renderEventManagement();

      const backButton = screen.getByTestId('backBtn');
      userEvent.click(backButton);

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
      userEvent.click(backButton);

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
        userEvent.click(screen.getByTestId(button));
        expect(screen.getByTestId(tab)).toBeInTheDocument();
      }
    });

    it('returns dashboard tab for an invalid tab selection', async () => {
      const setTab = vi.fn();
      const useStateSpy = vi.spyOn(React, 'useState');
      useStateSpy.mockReturnValueOnce(['invalid', setTab]);
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

      await act(async () => {
        userEvent.click(screen.getByTestId('tabsDropdownToggle'));
      });

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
      await act(async () => {
        userEvent.click(screen.getByTestId('tabsDropdownToggle'));
      });

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
        act(() => {
          userEvent.click(screen.getByTestId(`${option}DropdownItem`));
        });

        expect(screen.getByTestId(`${option}DropdownItem`)).toHaveClass(
          'text-secondary',
        );
      }
    });
  });
});
