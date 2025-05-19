import type { ReactElement } from 'react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
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
  vi.doMock('react-router', async () => {
    const actual = await vi.importActual('react-router');
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
    vi.unmock('react-router');
  });

  const SetupRedirectTest = async (): Promise<ReactElement> => {
    const useParamsMock = vi.fn(() => ({ orgId: undefined }));
    vi.doMock('react-router', async () => {
      const actual = await vi.importActual('react-router');
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

    const generalTab = await waitFor(() => screen.getByTestId('generalTab'));
    expect(generalTab).toBeInTheDocument();
    expect(generalTab).toBeVisible();

    await waitFor(() => {
      const container = document.querySelector('.d-flex.flex-column');
      expect(container).toBeInTheDocument();
    });

    expect(screen.getByTestId('generalTab')).toBeInTheDocument();
  });
});
