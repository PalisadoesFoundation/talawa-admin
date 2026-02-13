import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/client/testing/react';
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
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('should render the organisation settings page with general tab active by default', async () => {
    renderOrganisationSettings();

    const generalTab = await waitFor(() => screen.getByTestId('generalTab'));
    expect(generalTab).toBeInTheDocument();
    expect(generalTab).toBeVisible();

    const generalButton = screen.getByTestId('generalSettings');
    expect(generalButton.className).toMatch(/_activeTabBtn_/);
  });

  it('should set document title correctly', async () => {
    const originalTitle = document.title;

    renderOrganisationSettings();

    await waitFor(() => {
      expect(document.title).toBe('Settings');
    });

    document.title = originalTitle;
  });

  it('should switch to action item categories tab when clicked', async () => {
    renderOrganisationSettings();

    await waitFor(() => screen.getByTestId('generalTab'));

    const actionItemButton = screen.getByTestId('actionItemCategoriesSettings');
    expect(actionItemButton).toBeInTheDocument();

    await user.click(actionItemButton);

    await waitFor(() => {
      expect(screen.getByTestId('actionItemCategoriesTab')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('generalTab')).not.toBeInTheDocument();
  });

  it('should switch between tabs correctly', async () => {
    renderOrganisationSettings();

    await waitFor(() => screen.getByTestId('generalTab'));

    await user.click(screen.getByTestId('actionItemCategoriesSettings'));

    await waitFor(() => {
      expect(screen.getByTestId('actionItemCategoriesTab')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('generalSettings'));

    await waitFor(() => {
      expect(screen.getByTestId('generalTab')).toBeInTheDocument();
    });
  });

  it('should render all tab buttons with correct test IDs', async () => {
    renderOrganisationSettings();

    await waitFor(() => screen.getByTestId('generalTab'));

    expect(screen.getByTestId('generalSettings')).toBeInTheDocument();
    expect(
      screen.getByTestId('actionItemCategoriesSettings'),
    ).toBeInTheDocument();

    expect(screen.getByTestId('generalSettings')).toHaveTextContent('General');
    expect(
      screen.getByTestId('actionItemCategoriesSettings'),
    ).toHaveTextContent('Action Item Categories');
  });

  it('should apply correct CSS classes to active and inactive tabs', async () => {
    renderOrganisationSettings();

    await waitFor(() => screen.getByTestId('generalTab'));

    const generalButton = screen.getByTestId('generalSettings');
    const actionButton = screen.getByTestId('actionItemCategoriesSettings');

    expect(generalButton.className).toMatch(/_activeTabBtn_/);
    expect(actionButton.className).not.toMatch(/_activeTabBtn_/);

    await user.click(actionButton);

    await waitFor(() => {
      expect(screen.getByTestId('actionItemCategoriesTab')).toBeInTheDocument();
    });

    expect(generalButton.className).not.toMatch(/_activeTabBtn_/);
    expect(actionButton.className).toMatch(/_activeTabBtn_/);
  });
});
