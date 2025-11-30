/**
 * Unit tests for the VolunteerManagement component.
 *
 * This file contains tests for the VolunteerManagement component to ensure it behaves
 * as expected under various scenarios including tab navigation, mobile dropdown
 * functionality, and URL parameter handling.
 */

import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { screen, waitFor, within } from '@testing-library/dom';
import { render } from '@testing-library/react';
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
  beforeEach(() => {
    setItem('userId', 'userId');
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
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

    const backButton = await screen.findByTestId('backBtn');
    await userEvent.click(backButton);
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
    const dropdownToggle = await screen.findByTestId('tabsDropdownToggle');
    expect(dropdownToggle).toBeInTheDocument();

    // Click the dropdown to open it
    await userEvent.click(dropdownToggle);

    // Find the dropdown container and get the dropdown menu within it
    const dropdownContainer = screen.getByTestId('tabsDropdownContainer');
    // The dropdown menu has class "dropdown-menu" in Bootstrap
    const dropdownMenu = dropdownContainer.querySelector('.dropdown-menu');
    expect(dropdownMenu).toBeInTheDocument();

    // Find and click on "Invitations" within the dropdown menu
    const invitationsItem = within(dropdownMenu as HTMLElement).getByText(
      'Invitations',
    );
    await userEvent.click(invitationsItem);

    // Verify that invitations tab is now displayed
    const invitationsTab = await screen.findByTestId('invitationsTab');
    expect(invitationsTab).toBeInTheDocument();

    // Verify dropdown closed after selection
    await waitFor(() => {
      expect(dropdownMenu).not.toHaveClass('show');
    });
  });

  test('Testing mobile dropdown switches to actions tab', async () => {
    renderVolunteerManagement();

    // Open dropdown
    const dropdownToggle = await screen.findByTestId('tabsDropdownToggle');
    await userEvent.click(dropdownToggle);

    // Find dropdown menu and click on "Action Items" within it
    const dropdownContainer = screen.getByTestId('tabsDropdownContainer');
    const dropdownMenu = dropdownContainer.querySelector('.dropdown-menu');
    const actionsItem = within(dropdownMenu as HTMLElement).getByText(
      'Action Items',
    );
    await userEvent.click(actionsItem);

    // Verify that actions tab is now displayed
    const actionsTab = await screen.findByTestId('actionsTab');
    expect(actionsTab).toBeInTheDocument();

    // Verify dropdown closed after selection
    await waitFor(() => {
      expect(dropdownMenu).not.toHaveClass('show');
    });
  });

  test('Testing mobile dropdown switches to groups tab', async () => {
    renderVolunteerManagement();

    // Open dropdown
    const dropdownToggle = await screen.findByTestId('tabsDropdownToggle');
    await userEvent.click(dropdownToggle);

    // Find dropdown menu and click on "Volunteer Groups" within it
    const dropdownContainer = screen.getByTestId('tabsDropdownContainer');
    const dropdownMenu = dropdownContainer.querySelector('.dropdown-menu');
    const groupsItem = within(dropdownMenu as HTMLElement).getByText(
      'Volunteer Groups',
    );
    await userEvent.click(groupsItem);

    // Verify that groups tab is now displayed
    const groupsTab = await screen.findByTestId('groupsTab');
    expect(groupsTab).toBeInTheDocument();

    // Verify dropdown closed after selection
    await waitFor(() => {
      expect(dropdownMenu).not.toHaveClass('show');
    });
  });

  test('Testing mobile dropdown switches to upcomingEvents tab', async () => {
    renderVolunteerManagement();

    // First switch to a different tab
    const invitationsBtn = screen.getByTestId('invitationsBtn');
    await userEvent.click(invitationsBtn);
    expect(screen.getByTestId('invitationsTab')).toBeInTheDocument();

    // Open dropdown
    const dropdownToggle = await screen.findByTestId('tabsDropdownToggle');
    await userEvent.click(dropdownToggle);

    // Find dropdown menu and click on "Upcoming Events" within it
    const dropdownContainer = screen.getByTestId('tabsDropdownContainer');
    const dropdownMenu = dropdownContainer.querySelector('.dropdown-menu');
    const upcomingEventsItem = within(dropdownMenu as HTMLElement).getByText(
      'Upcoming Events',
    );
    await userEvent.click(upcomingEventsItem);

    // Verify that upcoming events tab is now displayed
    const upcomingEventsTab = await screen.findByTestId('upcomingEventsTab');
    expect(upcomingEventsTab).toBeInTheDocument();

    // Verify dropdown closed after selection
    await waitFor(() => {
      expect(dropdownMenu).not.toHaveClass('show');
    });
  });
});
