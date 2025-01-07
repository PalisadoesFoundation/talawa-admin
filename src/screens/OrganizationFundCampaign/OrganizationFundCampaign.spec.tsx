import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
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
    <MockedProvider addTypename={false} link={link}>
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
    vi.mock('react-router-dom', async () => {
      const actualDom = await vi.importActual('react-router-dom');
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
      <MockedProvider addTypename={false} link={link1}>
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
    userEvent.click(addCampaignBtn);

    await waitFor(() =>
      expect(screen.getAllByText(translations.createCampaign)).toHaveLength(2),
    );
    userEvent.click(screen.getByTestId('campaignCloseBtn'));
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
    userEvent.click(editCampaignBtn[0]);

    await waitFor(() =>
      expect(
        screen.getAllByText(translations.updateCampaign)[0],
      ).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('campaignCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('campaignCloseBtn')).toBeNull(),
    );
  });

  it('Search the Campaigns list by Name', async () => {
    mockRouteParams();
    renderFundCampaign(link1);
    const searchField = await screen.findByTestId('searchFullName');
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

  it('Sort the Campaigns list by Latest end Date', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const sortBtn = await screen.findByTestId('filter');
    expect(sortBtn).toBeInTheDocument();

    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByTestId('endDate_DESC'));

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.queryByText('Campaign 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('endDateCell')[0]).toHaveTextContent(
        '01/01/2024',
      );
    });
  });

  it('Sort the Campaigns list by Earliest end Date', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const sortBtn = await screen.findByTestId('filter');
    expect(sortBtn).toBeInTheDocument();

    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByTestId('endDate_ASC'));

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.queryByText('Campaign 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('endDateCell')[0]).toHaveTextContent(
        '01/01/2021',
      );
    });
  });

  it('Sort the Campaigns list by lowest goal', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const sortBtn = await screen.findByTestId('filter');
    expect(sortBtn).toBeInTheDocument();

    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByTestId('fundingGoal_ASC'));

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.queryByText('Campaign 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('goalCell')[0]).toHaveTextContent('100');
    });
  });

  it('Sort the Campaigns list by highest goal', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const sortBtn = await screen.findByTestId('filter');
    expect(sortBtn).toBeInTheDocument();

    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByTestId('fundingGoal_DESC'));

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.queryByText('Campaign 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('goalCell')[0]).toHaveTextContent('200');
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

  it('Click on View Pledge', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const viewBtn = await screen.findAllByTestId('viewBtn');
    expect(viewBtn[0]).toBeInTheDocument();
    fireEvent.click(viewBtn[0]);

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
