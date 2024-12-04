import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import EventManagement from './EventManagement';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MOCKS_WITH_TIME } from 'components/EventManagement/Dashboard/EventDashboard.mocks';
import useLocalStorage from 'utils/useLocalstorage';
const { setItem } = useLocalStorage();

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);

const renderEventManagement = (): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={mockWithTime}>
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
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId', eventId: 'eventId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('Testing back button navigation when userType is SuperAdmin', async () => {
    setItem('SuperAdmin', true);
    renderEventManagement();

    const backButton = screen.getByTestId('backBtn');
    fireEvent.click(backButton);
    await waitFor(() => {
      const eventsScreen = screen.getByTestId('eventsScreen');
      expect(eventsScreen).toBeInTheDocument();
    });
  });

  test('Testing event management tab switching', async () => {
    renderEventManagement();

    const registrantsButton = screen.getByTestId('registrantsBtn');
    fireEvent.click(registrantsButton);

    const registrantsTab = screen.getByTestId('eventRegistrantsTab');
    expect(registrantsTab).toBeInTheDocument();
    const eventAttendanceButton = screen.getByTestId('attendanceBtn');
    fireEvent.click(eventAttendanceButton);
    const eventAttendanceTab = screen.getByTestId('eventAttendanceTab');
    expect(eventAttendanceTab).toBeInTheDocument();
    const eventActionsButton = screen.getByTestId('actionsBtn');
    fireEvent.click(eventActionsButton);

    const eventActionsTab = screen.getByTestId('eventActionsTab');
    expect(eventActionsTab).toBeInTheDocument();

    const eventAgendasButton = screen.getByTestId('agendasBtn');
    fireEvent.click(eventAgendasButton);

    const eventAgendasTab = screen.getByTestId('eventAgendasTab');
    expect(eventAgendasTab).toBeInTheDocument();

    const eventStatsButton = screen.getByTestId('statisticsBtn');
    fireEvent.click(eventStatsButton);

    const eventStatsTab = screen.getByTestId('eventStatsTab');
    expect(eventStatsTab).toBeInTheDocument();

    const volunteerButton = screen.getByTestId('volunteersBtn');
    fireEvent.click(volunteerButton);

    const eventVolunteersTab = screen.getByTestId('eventVolunteersTab');
    expect(eventVolunteersTab).toBeInTheDocument();
  });
  test('renders nothing when invalid tab is selected', () => {
    render(
      <MockedProvider addTypename={false} link={mockWithTime}>
        <MemoryRouter initialEntries={['/event/orgId/eventId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/event/:orgId/:eventId"
                  element={<EventManagement />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Force an invalid tab state
    const setTab = jest.fn();
    React.useState = jest.fn().mockReturnValue(['invalidTab', setTab]);

    // Verify nothing is rendered
    expect(screen.queryByTestId('eventDashboardTab')).toBeInTheDocument();
    expect(screen.queryByTestId('eventRegistrantsTab')).not.toBeInTheDocument();
    expect(screen.queryByTestId('eventAttendanceTab')).not.toBeInTheDocument();
    expect(screen.queryByTestId('eventActionsTab')).not.toBeInTheDocument();
    expect(screen.queryByTestId('eventVolunteersTab')).not.toBeInTheDocument();
    expect(screen.queryByTestId('eventAgendasTab')).not.toBeInTheDocument();
    expect(screen.queryByTestId('eventStatsTab')).not.toBeInTheDocument();
  });
});
