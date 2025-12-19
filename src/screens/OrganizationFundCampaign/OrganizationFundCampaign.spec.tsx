import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router';
import { store } from '../../state/store';
import { StaticMockLink } from '../../utils/StaticMockLink';
import i18nForTest from '../../utils/i18nForTest';
import OrganizaitionFundCampiagn from './OrganizationFundCampagins';
import {
  EMPTY_MOCKS,
  MOCKS,
  MOCK_ERROR,
} from './OrganizationFundCampaignMocks';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actual.DesktopDateTimePicker,
  };
});

const link1 = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCK_ERROR, true);
const link3 = new StaticMockLink(EMPTY_MOCKS, true);

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.fundCampaign),
);

const renderFundCampaign = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/orgfundcampaign/orgId/fundId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgfundcampaign/:orgId/:fundId"
                  element={<OrganizaitionFundCampiagn />}
                />
                <Route
                  path="/fundCampaignPledge/orgId/campaignId1"
                  element={<div data-testid="pledgeScreen"></div>}
                />
                <Route
                  path="/orgfunds/orgId"
                  element={<div data-testid="fundScreen"></div>}
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

describe('FundCampaigns Screen', () => {
  beforeEach(() => {
    vi.mock('react-router', async () => {
      const actualDom = await vi.importActual('react-router');
      return {
        ...actualDom,
        useParams: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockRouteParams = (orgId = 'orgId', fundId = 'fundId'): void => {
    vi.mocked(useParams).mockReturnValue({ orgId, fundId });
  };

  it('should render the Campaign Pledge screen', async () => {
    mockRouteParams();
    renderFundCampaign(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchFullName')).toBeInTheDocument();
    });

    expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    expect(screen.getByText('Campaign 2')).toBeInTheDocument();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    mockRouteParams('', '');
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/orgfundcampaign/']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <Routes>
                  <Route
                    path="/orgfundcampaign/"
                    element={<OrganizaitionFundCampiagn />}
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
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('open and close Create Campaign modal', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const addCampaignBtn = await screen.findByTestId('addCampaignBtn');
    expect(addCampaignBtn).toBeInTheDocument();
    await userEvent.click(addCampaignBtn);

    await waitFor(() =>
      expect(screen.getAllByText(translations.createCampaign)).toHaveLength(2),
    );
    await userEvent.click(screen.getByTestId('campaignCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('campaignCloseBtn')).toBeNull(),
    );
  });

  it('open and close update campaign modal', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchFullName')).toBeInTheDocument();
    });

    const editCampaignBtn = await screen.findAllByTestId('editCampaignBtn');
    await waitFor(() => expect(editCampaignBtn[0]).toBeInTheDocument());

    // The edit button needs stopPropagation test in component or just verify modal opens
    await userEvent.click(editCampaignBtn[0]);

    await waitFor(() =>
      expect(
        screen.getAllByText(translations.updateCampaign)[0],
      ).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByTestId('campaignCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('campaignCloseBtn')).toBeNull(),
    );
  });

  it('Search the Campaigns list by Name', async () => {
    mockRouteParams();
    renderFundCampaign(link1);
    const searchField = await screen.findByTestId('searchFullName');

    // SearchBar now uses onChange instead of searchBtn
    fireEvent.change(searchField, {
      target: { value: '2' },
    });

    await waitFor(() => {
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
      expect(screen.queryByText('Campaign 1')).toBeNull();
    });
  });

  it('should render the Campaign screen with error', async () => {
    mockRouteParams();
    renderFundCampaign(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders the empty campaign component', async () => {
    mockRouteParams();
    renderFundCampaign(link3);
    await waitFor(() =>
      expect(
        screen.getByText(translations.noCampaignsFound),
      ).toBeInTheDocument(),
    );
  });

  it('Displays campaigns with dates correctly', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });

    // Verify end date cells are rendered (sorting now via DataGrid column headers)
    await waitFor(() => {
      const endDateCells = screen.getAllByTestId('endDateCell');
      expect(endDateCells.length).toBeGreaterThan(0);
    });
  });

  it('Displays goal cells correctly', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });

    // Verify goal cells are rendered (sorting now via DataGrid column headers)
    await waitFor(() => {
      const goalCells = screen.getAllByTestId('goalCell');
      expect(goalCells.length).toBeGreaterThan(0);
    });
  });

  it('Click on Campaign Name', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const campaignName = await screen.findAllByTestId('campaignName');
    expect(campaignName[0]).toBeInTheDocument();
    fireEvent.click(campaignName[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeScreen')).toBeInTheDocument();
    });
  });

  it('Click on View Pledge (via row click)', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const campaignName = await screen.findAllByTestId('campaignName');
    expect(campaignName[0]).toBeInTheDocument();

    // Row click navigates to pledge screen
    fireEvent.click(campaignName[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeScreen')).toBeInTheDocument();
    });
  });

  it('should render the Fund screen on fund breadcrumb click', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const fundBreadcrumb = await screen.findByTestId('fundsLink');
    expect(fundBreadcrumb).toBeInTheDocument();
    fireEvent.click(fundBreadcrumb);

    await waitFor(() => {
      expect(screen.getByTestId('fundScreen')).toBeInTheDocument();
    });
  });
});
