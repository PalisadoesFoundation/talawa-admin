import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrgSettings from './OrgSettings';
import userEvent from '@testing-library/user-event';
import type { ApolloLink } from '@apollo/client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MOCKS } from './OrgSettings.mocks';

const link1 = new StaticMockLink(MOCKS);

const renderOrganisationSettings = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgsetting/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/orgsetting/:orgId" element={<OrgSettings />} />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
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
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgsetting/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/orgsetting/" element={<OrgSettings />} />
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

  test('should render the organisation settings page', async () => {
    renderOrganisationSettings(link1);

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
});
