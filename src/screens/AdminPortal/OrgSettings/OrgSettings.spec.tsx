import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/react-testing';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import OrgSettings from './OrgSettings';
import { MOCKS } from './OrgSettings.mocks';
import userEvent from '@testing-library/user-event';

const routerMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({ orgId: 'orgId' })),
}));

vi.mock('@mui/x-date-pickers', async () => {
  const actual = await vi.importActual<typeof import('@mui/x-date-pickers')>(
    '@mui/x-date-pickers',
  );
  return {
    ...actual,
    LocalizationProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: routerMocks.useParams,
  };
});

const link1 = new StaticMockLink(MOCKS);
const renderOrganisationSettings = (
  link = link1,
  orgId = 'orgId',
): ReturnType<typeof render> => {
  routerMocks.useParams.mockReturnValue({ orgId });
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={[`/admin/orgsetting/${orgId}`]}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/admin/orgsetting/:orgId"
                element={<OrgSettings />}
              />
              <Route
                path="/"
                element={
                  <div data-testid="paramsError">Redirected to Home</div>
                }
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Organisation Settings Page', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: 'orgId' });
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    routerMocks.useParams.mockReturnValue({
      orgId: undefined as unknown as string,
    });
    render(
      <MockedProvider>
        <MemoryRouter initialEntries={['/admin/orgsetting/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/admin/orgsetting/" element={<OrgSettings />} />
                <Route
                  path="/"
                  element={
                    <div data-testid="paramsError">Redirected to Home</div>
                  }
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const paramsErrorElement = screen.getByTestId('paramsError');
      expect(paramsErrorElement).toBeInTheDocument();
      expect(paramsErrorElement.textContent).toBe('Redirected to Home');
    });
  });

  it('should render the organisation settings page with general tab active by default', async () => {
    renderOrganisationSettings();

    const generalTab = await waitFor(() => screen.getByTestId('generalTab'));
    expect(generalTab).toBeInTheDocument();
    expect(generalTab).toBeVisible();

    await waitFor(() => {
      const container = document.querySelector('.d-flex.flex-column');
      expect(container).toBeInTheDocument();
    });

    expect(screen.getByTestId('generalTab')).toBeInTheDocument();

    // Check if general settings button exists and has active class
    const generalButton = screen.getByTestId('generalSettings');
    expect(generalButton).toBeInTheDocument();
    expect(generalButton.className).toMatch(/_activeTabBtn_/);
  });

  it('should set document title correctly', async () => {
    const originalTitle = document.title;
    renderOrganisationSettings();

    await waitFor(() => {
      expect(document.title).toBe('Settings');
    });

    // Restore original title
    document.title = originalTitle;
  });

  it('should switch to action item categories tab when clicked', async () => {
    renderOrganisationSettings();

    // Wait for component to load
    await waitFor(() => screen.getByTestId('generalTab'));

    // Click on action item categories button
    const actionItemButton = screen.getByTestId('actionItemCategoriesSettings');
    expect(actionItemButton).toBeInTheDocument();

    await user.click(actionItemButton);

    // Check if action item categories tab is now displayed
    await waitFor(() => {
      const actionItemTab = screen.getByTestId('actionItemCategoriesTab');
      expect(actionItemTab).toBeInTheDocument();
      expect(actionItemTab).toBeVisible();
    });

    // General tab should no longer be visible
    expect(screen.queryByTestId('generalTab')).not.toBeInTheDocument();
  });

  it('should switch to agenda item categories tab when clicked', async () => {
    renderOrganisationSettings();

    // Wait for component to load
    await waitFor(() => screen.getByTestId('generalTab'));

    // Click on agenda item categories button
    const agendaItemButton = screen.getByTestId('agendaItemCategoriesSettings');
    expect(agendaItemButton).toBeInTheDocument();

    await user.click(agendaItemButton);

    // Check if agenda item categories tab is now displayed
    await waitFor(() => {
      const agendaItemTab = screen.getByTestId('agendaItemCategoriesTab');
      expect(agendaItemTab).toBeInTheDocument();
      expect(agendaItemTab).toBeVisible();
    });

    // General tab should no longer be visible
    expect(screen.queryByTestId('generalTab')).not.toBeInTheDocument();
  });

  it('should switch between tabs correctly', async () => {
    renderOrganisationSettings();

    // Wait for component to load with general tab active
    await waitFor(() => screen.getByTestId('generalTab'));

    // Switch to action item categories
    await user.click(screen.getByTestId('actionItemCategoriesSettings'));
    await waitFor(() => {
      expect(screen.getByTestId('actionItemCategoriesTab')).toBeInTheDocument();
      expect(screen.queryByTestId('generalTab')).not.toBeInTheDocument();
    });

    // Switch to agenda item categories
    await user.click(screen.getByTestId('agendaItemCategoriesSettings'));
    await waitFor(() => {
      expect(screen.getByTestId('agendaItemCategoriesTab')).toBeInTheDocument();
      expect(
        screen.queryByTestId('actionItemCategoriesTab'),
      ).not.toBeInTheDocument();
    });

    // Switch back to general
    await user.click(screen.getByTestId('generalSettings'));
    await waitFor(() => {
      expect(screen.getByTestId('generalTab')).toBeInTheDocument();
      expect(
        screen.queryByTestId('agendaItemCategoriesTab'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render all tab buttons with correct test IDs', async () => {
    renderOrganisationSettings();

    // Wait for component to load
    await waitFor(() => screen.getByTestId('generalTab'));

    // Check that all tab buttons are rendered
    expect(screen.getByTestId('generalSettings')).toBeInTheDocument();
    expect(
      screen.getByTestId('actionItemCategoriesSettings'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('agendaItemCategoriesSettings'),
    ).toBeInTheDocument();

    // Check that buttons have correct text content
    expect(screen.getByTestId('generalSettings')).toHaveTextContent('General');
    expect(
      screen.getByTestId('actionItemCategoriesSettings'),
    ).toHaveTextContent('Action Item Categories');
    expect(
      screen.getByTestId('agendaItemCategoriesSettings'),
    ).toHaveTextContent('Agenda Item Categories');
  });

  it('should apply correct CSS classes to active and inactive tabs', async () => {
    renderOrganisationSettings();

    // Wait for component to load
    await waitFor(() => screen.getByTestId('generalTab'));

    // Initially, general tab should be active
    const generalButton = screen.getByTestId('generalSettings');
    const actionButton = screen.getByTestId('actionItemCategoriesSettings');
    const agendaButton = screen.getByTestId('agendaItemCategoriesSettings');

    // Check initial state - general should be active (looking for CSS module class)
    expect(generalButton.className).toMatch(/_activeTabBtn_/);
    expect(actionButton.className).not.toMatch(/_activeTabBtn_/);
    expect(agendaButton.className).not.toMatch(/_activeTabBtn_/);

    // Click action item categories tab
    await user.click(actionButton);
    await waitFor(() => screen.getByTestId('actionItemCategoriesTab'));

    // Now action item categories should be active
    expect(generalButton.className).not.toMatch(/_activeTabBtn_/);
    expect(actionButton.className).toMatch(/_activeTabBtn_/);
    expect(agendaButton.className).not.toMatch(/_activeTabBtn_/);

    // Click agenda item categories tab
    await user.click(agendaButton);
    await waitFor(() => screen.getByTestId('agendaItemCategoriesTab'));

    // Now agenda item categories should be active
    expect(generalButton.className).not.toMatch(/_activeTabBtn_/);
    expect(actionButton.className).not.toMatch(/_activeTabBtn_/);
    expect(agendaButton.className).toMatch(/_activeTabBtn_/);
  });
});
