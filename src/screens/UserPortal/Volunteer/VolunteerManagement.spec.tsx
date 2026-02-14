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

    // Use findBy instead of getBy inside waitFor
    const paramsError = await screen.findByTestId('paramsError');
    expect(paramsError).toBeInTheDocument();
  });

  test('Render Volunteer Management Screen', async () => {
    renderVolunteerManagement();

    // Wait for initial render
    const upcomingEventsTab = await screen.findByTestId('upcomingEventsTab');
    expect(upcomingEventsTab).toBeInTheDocument();

    // These should all be present now, but use findBy to be safe
    expect(await screen.findByTestId('invitationsBtn')).toBeInTheDocument();
    expect(await screen.findByTestId('actionsBtn')).toBeInTheDocument();
    expect(await screen.findByTestId('groupsBtn')).toBeInTheDocument();
  });

  test('Testing back button navigation', async () => {
    renderVolunteerManagement();

    const backButton = await screen.findByTestId('mobile-back-btn');
    expect(backButton).toBeInTheDocument();

    await userEvent.click(backButton as HTMLButtonElement);

    // Use findBy instead of getBy inside waitFor
    const orgHome = await screen.findByTestId('orgHome');
    expect(orgHome).toBeInTheDocument();
  });

  test('Testing volunteer management tab switching', async () => {
    renderVolunteerManagement();

    // Wait for initial render
    await screen.findByTestId('upcomingEventsTab');

    // Click invitations
    const invitationsBtn = await screen.findByTestId('invitationsBtn');
    await userEvent.click(invitationsBtn);

    // Wait for tab to appear
    const invitationsTab = await screen.findByTestId('invitationsTab');
    expect(invitationsTab).toBeInTheDocument();

    // Click actions
    const actionsBtn = await screen.findByTestId('actionsBtn');
    await userEvent.click(actionsBtn);

    // Wait for tab to appear
    const actionsTab = await screen.findByTestId('actionsTab');
    expect(actionsTab).toBeInTheDocument();

    // Click groups
    const groupsBtn = await screen.findByTestId('groupsBtn');
    await userEvent.click(groupsBtn);

    // Wait for tab to appear
    const groupsTab = await screen.findByTestId('groupsTab');
    expect(groupsTab).toBeInTheDocument();
  });

  test('Component should highlight the selected tab', async () => {
    renderVolunteerManagement();

    // Wait for initial render
    await screen.findByTestId('upcomingEventsTab');

    const upcomingEventsBtn = await screen.findByTestId('upcomingEventsBtn');
    const invitationsBtn = await screen.findByTestId('invitationsBtn');

    // Click the invitations tab
    await userEvent.click(invitationsBtn);

    await waitFor(() => {
      expect(invitationsBtn).toHaveClass('btn-success');
      expect(upcomingEventsBtn).not.toHaveClass('btn-success');
    });
  });

  test('should update the component state on tab switch', async () => {
    renderVolunteerManagement();

    // Wait for initial render
    await screen.findByTestId('upcomingEventsTab');

    const actionsBtn = await screen.findByTestId('actionsBtn');
    await userEvent.click(actionsBtn);

    const actionsTab = await screen.findByTestId('actionsTab');
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

    // Wait for initial render
    await screen.findByTestId('upcomingEventsTab');

    const dropdownToggle = await screen.findByTestId('tabs-dropdown-toggle');
    await userEvent.click(dropdownToggle);

    // Wait for menu to open
    await screen.findByTestId('tabs-dropdown-menu');

    // Wait for specific item to be available
    const actionsItem = await screen.findByTestId('tabs-dropdown-item-actions');
    await userEvent.click(actionsItem);

    // Wait for tab to render
    const actionsTab = await screen.findByTestId('actionsTab');
    expect(actionsTab).toBeInTheDocument();

    // Wait for dropdown to close
    await waitFor(() => {
      expect(dropdownToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('Testing mobile dropdown switches to groups tab', async () => {
    renderVolunteerManagement();

    await screen.findByTestId('upcomingEventsTab');

    // Open dropdown
    const dropdownToggle = await screen.findByTestId('tabs-dropdown-toggle');
    await userEvent.click(dropdownToggle);

    // Find dropdown menu and verify it's open
    await screen.findByTestId('tabs-dropdown-menu');

    const groupsItem = await screen.findByTestId('tabs-dropdown-item-groups');
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

    await screen.findByTestId('upcomingEventsTab');

    // First switch to a different tab
    const invitationsBtn = await screen.findByTestId('invitationsBtn');
    await userEvent.click(invitationsBtn);
    const invitationsTab = await screen.findByTestId('invitationsTab');
    expect(invitationsTab).toBeInTheDocument();

    // Open dropdown
    const dropdownToggle = await screen.findByTestId('tabs-dropdown-toggle');
    await userEvent.click(dropdownToggle);

    // Find dropdown menu and verify it's open
    await screen.findByTestId('tabs-dropdown-menu');

    const upcomingEventsItem = await screen.findByTestId(
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
