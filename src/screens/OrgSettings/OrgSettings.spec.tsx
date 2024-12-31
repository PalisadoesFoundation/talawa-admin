import type { ReactElement } from 'react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MockedProvider } from '@apollo/react-testing';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import OrgSettings from './OrgSettings';
import { MOCKS } from './OrgSettings.mocks';

const link1 = new StaticMockLink(MOCKS);
const mockRouterParams = (orgId: string | undefined): void => {
  vi.doMock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useParams: () => ({ orgId }),
    };
  });
};
const renderOrganisationSettings = (
  link = link1,
  orgId = 'orgId',
): ReturnType<typeof render> => {
  mockRouterParams(orgId);
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={[`/orgsetting/${orgId}`]}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/orgsetting/:orgId" element={<OrgSettings />} />
                <Route
                  path="/"
                  element={
                    <div data-testid="paramsError">Redirected to Home</div>
                  }
                />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Organisation Settings Page', () => {
  afterEach(() => {
    vi.unmock('react-router-dom');
  });

  const SetupRedirectTest = async (): Promise<ReactElement> => {
    const useParamsMock = vi.fn(() => ({ orgId: undefined }));
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: useParamsMock,
      };
    });
    const orgSettingsModule = await import('./OrgSettings');
    return <orgSettingsModule.default />;
  };

  it('should redirect to fallback URL if URL params are undefined', async () => {
    const OrgSettings = await SetupRedirectTest();
    render(
      <MockedProvider addTypename={false}>
        <MemoryRouter initialEntries={['/orgsetting/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/orgsetting/" element={OrgSettings} />
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

  it('should render the organisation settings page', async () => {
    renderOrganisationSettings();

    await waitFor(() => {
      expect(screen.getByTestId('generalSettings')).toBeInTheDocument();
      expect(
        screen.getByTestId('actionItemCategoriesSettings'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('agendaItemCategoriesSettings'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('generalSettings'));
    await waitFor(() => {
      expect(screen.getByTestId('generalTab')).toBeInTheDocument();
      expect(screen.getByTestId('generalTab')).toBeVisible();
    });

    userEvent.click(screen.getByTestId('actionItemCategoriesSettings'));
    await waitFor(() => {
      expect(screen.getByTestId('actionItemCategoriesTab')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('agendaItemCategoriesSettings'));
    await waitFor(() => {
      expect(screen.getByTestId('agendaItemCategoriesTab')).toBeInTheDocument();
    });
  });

  it('should handle dropdown item selection correctly', async () => {
    renderOrganisationSettings();

    // Wait for the dropdown to be rendered
    await waitFor(() => {
      expect(
        screen.getByTestId('settingsDropdownContainer'),
      ).toBeInTheDocument();
    });

    // Click to open the dropdown
    const dropdownToggle = screen.getByTestId('settingsDropdownToggle');
    await userEvent.click(dropdownToggle);

    // Find all dropdown items
    const dropdownItems = screen.getAllByRole('button');
    expect(dropdownItems).toHaveLength(12); // Should have 3 items: general, actionItemCategories, agendaItemCategories

    // Click on each dropdown item and verify the content changes
    for (const item of dropdownItems) {
      await userEvent.click(item);

      // Verify that the corresponding tab content is displayed
      if (item.textContent?.includes('general')) {
        await waitFor(() => {
          expect(screen.getByTestId('generalTab')).toBeInTheDocument();
        });
      } else if (item.textContent?.includes('actionItemCategories')) {
        await waitFor(() => {
          expect(
            screen.getByTestId('actionItemCategoriesTab'),
          ).toBeInTheDocument();
        });
      } else if (item.textContent?.includes('agendaItemCategories')) {
        await waitFor(() => {
          expect(
            screen.getByTestId('agendaItemCategoriesTab'),
          ).toBeInTheDocument();
        });
      }

      // Reopen dropdown for next iteration if not the last item
      if (item !== dropdownItems[dropdownItems.length - 1]) {
        await userEvent.click(dropdownToggle);
      }
    }

    // Verify that the selected tab is reflected in the dropdown toggle text
    expect(dropdownToggle).toHaveTextContent(
      screen.getByTestId('agendaItemCategoriesSettings').textContent || '',
    );
  });
});
