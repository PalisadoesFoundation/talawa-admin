import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import VolunteerManagement from './VolunteerManagement';
import userEvent from '@testing-library/user-event';
import { MOCKS } from './UpcomingEvents/UpcomingEvents.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
const { setItem } = useLocalStorage();

const link1 = new StaticMockLink(MOCKS);

const renderVolunteerManagement = (): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link1}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/user/volunteer/:orgId"
                element={<VolunteerManagement />}
              />
              <Route path="/" element={<div data-testid="paramsError" />} />
              <Route
                path="/user/organization/:orgId"
                element={<div data-testid="orgHome" />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Volunteer Management', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom'); // Import the actual implementation
      return {
        ...actual,
        useParams: () => ({ orgId: 'orgId' }),
      };
    });
  });

  beforeEach(() => {
    setItem('userId', 'userId');
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', null);
    render(
      <MockedProvider addTypename={false}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/user/volunteer/"
                  element={<VolunteerManagement />}
                />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  test('Render Volunteer Management Screen', async () => {
    renderVolunteerManagement();

    const upcomingEventsTab = await screen.findByTestId('upcomingEventsTab');
    expect(upcomingEventsTab).toBeInTheDocument();
    expect(screen.getByTestId('invitationsBtn')).toBeInTheDocument();
    expect(screen.getByTestId('actionsBtn')).toBeInTheDocument();
    expect(screen.getByTestId('groupsBtn')).toBeInTheDocument();
  });

  test('Testing back button navigation', async () => {
    renderVolunteerManagement();

    const backButton = await screen.findByTestId('backBtn');
    userEvent.click(backButton);
    await waitFor(() => {
      const orgHome = screen.getByTestId('orgHome');
      expect(orgHome).toBeInTheDocument();
    });
  });

  test('Testing volunteer management tab switching', async () => {
    renderVolunteerManagement();

    const invitationsBtn = screen.getByTestId('invitationsBtn');
    userEvent.click(invitationsBtn);

    const invitationsTab = screen.getByTestId('invitationsTab');
    expect(invitationsTab).toBeInTheDocument();

    const actionsBtn = screen.getByTestId('actionsBtn');
    userEvent.click(actionsBtn);

    const actionsTab = screen.getByTestId('actionsTab');
    expect(actionsTab).toBeInTheDocument();

    const groupsBtn = screen.getByTestId('groupsBtn');
    userEvent.click(groupsBtn);

    const groupsTab = screen.getByTestId('groupsTab');
    expect(groupsTab).toBeInTheDocument();
  });
  test('Component should highlight the selected tab', async () => {
    renderVolunteerManagement();

    const upcomingEventsBtn = screen.getByTestId('upcomingEventsBtn');
    const invitationsBtn = screen.getByTestId('invitationsBtn');
    // Click the invitations tab
    userEvent.click(invitationsBtn);
    await waitFor(() => {
      expect(invitationsBtn).toHaveClass('btn-success');
      expect(upcomingEventsBtn).not.toHaveClass('btn-success');
    });
  });
  test('should update the component state on tab switch', async () => {
    renderVolunteerManagement();

    const actionsBtn = screen.getByTestId('actionsBtn');
    userEvent.click(actionsBtn);
    const actionsTab = screen.getByTestId('actionsTab');
    expect(actionsTab).toBeInTheDocument();
  });
});
