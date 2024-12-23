import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import type { RenderResult } from '@testing-library/react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrganizationFunds from './OrganizationFunds';
import { MOCKS, MOCKS_ERROR, NO_FUNDS } from './OrganizationFundsMocks';
import type { ApolloLink } from '@apollo/client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR, true);
const link3 = new StaticMockLink(NO_FUNDS, true);

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.funds),
);

const renderOrganizationFunds = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgfunds/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgfunds/:orgId"
                  element={<OrganizationFunds />}
                />
                <Route
                  path="/orgfundcampaign/orgId/fundId"
                  element={<div data-testid="campaignScreen"></div>}
                />
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

describe('OrganizationFunds Screen =>', () => {
  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render the Campaign Pledge screen', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    vi.mocked(useParams).mockReturnValue({});
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgfunds/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
                <Route path="/orgfunds/" element={<OrganizationFunds />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('open and close Create Fund modal', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const createFundBtn = await screen.findByTestId('createFundBtn');
    expect(createFundBtn).toBeInTheDocument();
    userEvent.click(createFundBtn);

    await waitFor(() =>
      expect(screen.getAllByText(translations.fundCreate)).toHaveLength(3),
    );
    userEvent.click(screen.getByTestId('fundModalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('fundModalCloseBtn')).toBeNull(),
    );
  });

  it('open and close update fund modal', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });

    const editFundBtn = await screen.findAllByTestId('editFundBtn');
    await waitFor(() => expect(editFundBtn[0]).toBeInTheDocument());
    userEvent.click(editFundBtn[0]);

    await waitFor(() =>
      expect(
        screen.getAllByText(translations.fundUpdate)[0],
      ).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('fundModalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('fundModalCloseBtn')).toBeNull(),
    );
  });

  it('Search the Funds list by name', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);
    const searchField = await screen.findByTestId('searchByName');
    fireEvent.change(searchField, {
      target: { value: '2' },
    });

    await waitFor(() => {
      expect(screen.getByText('Fund 2')).toBeInTheDocument();
      expect(screen.queryByText('Fund 1')).toBeNull();
    });
  });

  it('should render the Fund screen with error', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders the empty fund component', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link3);
    await waitFor(() =>
      expect(screen.getByText(translations.noFundsFound)).toBeInTheDocument(),
    );
  });

  it('Sort the Pledges list by Latest created Date', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const sortBtn = await screen.findByTestId('filter');
    expect(sortBtn).toBeInTheDocument();

    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByTestId('createdAt_DESC'));

    await waitFor(() => {
      expect(screen.getByText('Fund 1')).toBeInTheDocument();
      expect(screen.queryByText('Fund 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('createdOn')[0]).toHaveTextContent(
        '22/06/2024',
      );
    });
  });

  it('Sort the Pledges list by Earliest created Date', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const sortBtn = await screen.findByTestId('filter');
    expect(sortBtn).toBeInTheDocument();

    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByTestId('createdAt_ASC'));

    await waitFor(() => {
      expect(screen.getByText('Fund 1')).toBeInTheDocument();
      expect(screen.queryByText('Fund 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('createdOn')[0]).toHaveTextContent(
        '21/06/2024',
      );
    });
  });

  it('Click on Fund Name', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const fundName = await screen.findAllByTestId('fundName');
    expect(fundName[0]).toBeInTheDocument();
    fireEvent.click(fundName[0]);

    await waitFor(() => {
      expect(screen.getByTestId('campaignScreen')).toBeInTheDocument();
    });
  });

  it('Click on View Campaign', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const viewBtn = await screen.findAllByTestId('viewBtn');
    expect(viewBtn[0]).toBeInTheDocument();
    fireEvent.click(viewBtn[0]);

    await waitFor(() => {
      expect(screen.getByTestId('campaignScreen')).toBeInTheDocument();
    });
  });
});
