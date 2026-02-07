/**
 * Unit tests for the VolunteerManagement component.
 *
 * This file contains tests for the VolunteerManagement component to ensure it behaves
 * as expected under various scenarios including tab navigation, mobile dropdown
 * functionality, and URL parameter handling.
 */

import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import VolunteerManagement from './VolunteerManagement';
import userEvent from '@testing-library/user-event';
import { MOCKS } from './UpcomingEvents/UpcomingEvents.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';

vi.mock('@mui/icons-material', async () => {
  const actual = (await vi.importActual('@mui/icons-material')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    SettingsInputComponentSharp: vi.fn(() =>
      React.createElement('div', { 'data-testid': 'settings-icon' }),
    ),
    Circle: vi.fn(() =>
      React.createElement('div', { 'data-testid': 'circle-icon' }),
    ),
    WarningAmberRounded: vi.fn(() =>
      React.createElement('div', { 'data-testid': 'warning-icon' }),
    ),
    ExpandMore: vi.fn(() =>
      React.createElement('div', { 'data-testid': 'expand-more-icon' }),
    ),
  };
});

vi.mock('react-icons/io5', () => ({
  IoLocationOutline: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'location-icon' }),
  ),
}));

vi.mock('react-icons/io', () => ({
  IoIosHand: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'hand-icon' }),
  ),
}));

vi.mock('react-icons/fa', () => ({
  FaCheck: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'check-icon' }),
  ),
  FaTasks: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'tasks-icon' }),
  ),
  FaChevronLeft: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'chevron-left-icon' }),
  ),
}));

vi.mock('react-icons/fa6', () => ({
  FaRegEnvelopeOpen: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'envelope-open-icon' }),
  ),
  FaUserGroup: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'user-group-icon' }),
  ),
}));

vi.mock('react-icons/tb', () => ({
  TbCalendarEvent: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'calendar-event-icon' }),
  ),
}));

const { setItem, clearAllItems } = useLocalStorage();

const renderVolunteerManagement = (): RenderResult => {
  const link = new StaticMockLink(MOCKS);
  return render(
    <MockedProvider link={link}>
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
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    clearAllItems();
    setItem('userId', 'userId');
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    const link = new StaticMockLink(MOCKS);
    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/user/volunteer']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/user/volunteer"
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

    const backButton = screen
      .getByTestId('chevron-left-icon')
      .closest('button');
    expect(backButton).toBeInTheDocument();

    await userEvent.click(backButton as HTMLButtonElement);
    await waitFor(() => {
      const orgHome = screen.getByTestId('orgHome');
      expect(orgHome).toBeInTheDocument();
    });
  });

  test('Testing volunteer management tab switching', async () => {
    renderVolunteerManagement();

    const invitationsBtn = screen.getByTestId('invitationsBtn');
    await userEvent.click(invitationsBtn);

    const invitationsTab = screen.getByTestId('invitationsTab');
    expect(invitationsTab).toBeInTheDocument();

    const actionsBtn = screen.getByTestId('actionsBtn');
    await userEvent.click(actionsBtn);

    const actionsTab = screen.getByTestId('actionsTab');
    expect(actionsTab).toBeInTheDocument();

    const groupsBtn = screen.getByTestId('groupsBtn');
    await userEvent.click(groupsBtn);

    const groupsTab = screen.getByTestId('groupsTab');
    expect(groupsTab).toBeInTheDocument();
  });
  test('Component should highlight the selected tab', async () => {
    renderVolunteerManagement();

    const upcomingEventsBtn = screen.getByTestId('upcomingEventsBtn');
    const invitationsBtn = screen.getByTestId('invitationsBtn');
    // Click the invitations tab
    await userEvent.click(invitationsBtn);
    await waitFor(() => {
      expect(invitationsBtn).toHaveClass('btn-success');
      expect(upcomingEventsBtn).not.toHaveClass('btn-success');
    });
  });
  test('should update the component state on tab switch', async () => {
    renderVolunteerManagement();

    const actionsBtn = screen.getByTestId('actionsBtn');
    await userEvent.click(actionsBtn);
    const actionsTab = screen.getByTestId('actionsTab');
    expect(actionsTab).toBeInTheDocument();
  });

  test('Testing mobile dropdown menu for tab switching', async () => {
    renderVolunteerManagement();

    // Find the dropdown toggle button
    const dropdownToggle = await screen.findByTestId('tabs-dropdown-toggle');
    expect(dropdownToggle).toBeInTheDocument();

    // Click the dropdown to open it
    await userEvent.click(dropdownToggle);

    // Find and click on "Invitations" within the dropdown menu
    const invitationsItem = await screen.findByTestId(
      'tabs-dropdown-item-invitations',
    );
    await userEvent.click(invitationsItem);

    // Verify that invitations tab is now displayed
    const invitationsTab = await screen.findByTestId('invitationsTab');
    expect(invitationsTab).toBeInTheDocument();

    // Verify dropdown closed after selection
    await waitFor(() => {
      expect(dropdownToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('Testing mobile dropdown switches to actions tab', async () => {
    renderVolunteerManagement();

    // Open dropdown
    const dropdownToggle = await screen.findByTestId('tabs-dropdown-toggle');
    await userEvent.click(dropdownToggle);

    // Find dropdown menu and verify it's open
    // Find dropdown menu and verify it's open
    await screen.findByTestId('tabs-dropdown-menu');

    const actionsItem = screen.getByTestId('tabs-dropdown-item-actions');
    await userEvent.click(actionsItem);

    // Verify that actions tab is now displayed
    const actionsTab = await screen.findByTestId('actionsTab');
    expect(actionsTab).toBeInTheDocument();

    // Verify dropdown closed after selection
    await waitFor(() => {
      expect(dropdownToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('Testing mobile dropdown switches to groups tab', async () => {
    renderVolunteerManagement();

    // Open dropdown
    const dropdownToggle = await screen.findByTestId('tabs-dropdown-toggle');
    await userEvent.click(dropdownToggle);

    // Find dropdown menu and verify it's open
    // Find dropdown menu and verify it's open
    await screen.findByTestId('tabs-dropdown-menu');

    const groupsItem = screen.getByTestId('tabs-dropdown-item-groups');
    await userEvent.click(groupsItem);

    // Verify that groups tab is now displayed
    const groupsTab = await screen.findByTestId('groupsTab');
    expect(groupsTab).toBeInTheDocument();

    // Verify dropdown closed after selection
    await waitFor(() => {
      expect(dropdownToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('Testing mobile dropdown switches to upcomingEvents tab', async () => {
    renderVolunteerManagement();

    // First switch to a different tab
    const invitationsBtn = screen.getByTestId('invitationsBtn');
    await userEvent.click(invitationsBtn);
    expect(screen.getByTestId('invitationsTab')).toBeInTheDocument();

    // Open dropdown
    const dropdownToggle = await screen.findByTestId('tabs-dropdown-toggle');
    await userEvent.click(dropdownToggle);

    // Find dropdown menu and verify it's open
    // Find dropdown menu and verify it's open
    await screen.findByTestId('tabs-dropdown-menu');

    const upcomingEventsItem = screen.getByTestId(
      'tabs-dropdown-item-upcomingEvents',
    );
    await userEvent.click(upcomingEventsItem);

    // Verify that upcoming events tab is now displayed
    const upcomingEventsTab = await screen.findByTestId('upcomingEventsTab');
    expect(upcomingEventsTab).toBeInTheDocument();

    // Verify dropdown closed after selection
    await waitFor(() => {
      expect(dropdownToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
