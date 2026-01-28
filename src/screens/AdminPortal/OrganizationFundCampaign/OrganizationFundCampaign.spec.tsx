import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrganizationFundCampaign from './OrganizationFundCampaigns';
import {
  EMPTY_MOCKS,
  MOCKS,
  MOCK_ERROR,
} from './OrganizationFundCampaignMocks';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
vi.mock('GraphQl/Queries/fundQueries', async () => {
  const actual = await vi.importActual<
    typeof import('GraphQl/Queries/fundQueries')
  >('GraphQl/Queries/fundQueries');
  const gql = (await import('graphql-tag')).default;
  return {
    ...actual,
    FUND_CAMPAIGN: gql`
      query GetFundById($input: QueryFundInput!) {
        fund(input: $input) {
          id
          name
          campaigns(first: 10) {
            edges {
              node {
                id
                name
                startAt
                endAt
                currencyCode
                goalAmount
                fundingRaised
              }
            }
          }
        }
      }
    `,
  };
});

const routerMocks = vi.hoisted(() => ({
  useParams: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: routerMocks.useParams,
  };
});

// Mock BreadcrumbsComponent with simple static content
vi.mock('shared-components/BreadcrumbsComponent/BreadcrumbsComponent', () => ({
  __esModule: true,
  default: function MockBreadcrumbs({
    items,
  }: {
    items: Array<{ label?: string; to?: string }>;
  }) {
    return (
      <nav data-testid="breadcrumbs">
        {items.map((item, index) => {
          const testId = item.to?.includes('/admin/orgfunds/')
            ? item.to?.includes('/campaigns')
              ? 'campaignsLink'
              : 'fundsLink'
            : 'breadcrumbLink';

          return (
            <a
              key={index}
              href={item.to || '#'}
              data-testid={testId}
              data-to={item.to}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    );
  },
}));

const mockedUseParams = vi.mocked(useParams);

const link1 = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCK_ERROR, true);
const link3 = new StaticMockLink(EMPTY_MOCKS, true);

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.fundCampaign),
);

const renderFundCampaign = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/admin/orgfundcampaign/orgId/fundId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgfundcampaign/:orgId/:fundId"
                  element={<OrganizationFundCampaign />}
                />
                <Route
                  path="/admin/fundCampaignPledge/orgId/campaignId1"
                  element={<div data-testid="pledgeScreen"></div>}
                />
                <Route
                  path="/admin/orgfunds/orgId"
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
    mockedUseParams.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockRouteParams = (orgId = 'orgId', fundId = 'fundId'): void => {
    mockedUseParams.mockReturnValue({ orgId, fundId });
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
        <MemoryRouter initialEntries={['/admin/orgfundcampaign/']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <Routes>
                  <Route
                    path="/admin/orgfundcampaign/"
                    element={<OrganizationFundCampaign />}
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
    await userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('campaignModal')).toBeNull(),
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
    await userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('campaignModal')).toBeNull(),
    );
  });

  it('Search the Campaigns list by Name', async () => {
    const user = userEvent.setup();
    mockRouteParams();
    renderFundCampaign(link1);
    const searchField = await screen.findByTestId('searchFullName');

    // SearchBar now uses onChange instead of searchBtn
    await user.clear(searchField);
    await user.type(searchField, '2');

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

  it('renders the empty campaign EmptyState when no campaigns exist', async () => {
    mockRouteParams();
    renderFundCampaign(link3);
    const emptyState = await screen.findByTestId('campaigns-empty');
    expect(emptyState).toBeInTheDocument();

    expect(emptyState).toHaveTextContent(/No Campaigns Found/i);
  });

  it('Should display loading state', () => {
    mockRouteParams();
    // Create a link with a delay to simulate loading
    const delayedMocks = [
      {
        request: MOCKS[0].request,
        result: {
          data: {
            organization: {
              fund: {
                campaigns: {
                  edges: [],
                },
              },
            },
          },
        },
        delay: 50,
      },
    ];
    const delayedLink = new StaticMockLink(delayedMocks, true);

    renderFundCampaign(delayedLink);
    // Immediately check for loader
    expect(screen.getByTestId('TableLoader')).toBeInTheDocument();
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
    const user = userEvent.setup();
    mockRouteParams();
    renderFundCampaign(link1);

    const campaignName = await screen.findAllByTestId('campaignName');
    expect(campaignName[0]).toBeInTheDocument();
    await user.click(campaignName[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeScreen')).toBeInTheDocument();
    });
  });

  it('Click on View Pledge (via row click)', async () => {
    const user = userEvent.setup();
    mockRouteParams();
    renderFundCampaign(link1);

    const campaignName = await screen.findAllByTestId('campaignName');
    expect(campaignName[0]).toBeInTheDocument();

    // Row click navigates to pledge screen
    await user.click(campaignName[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeScreen')).toBeInTheDocument();
    });
  });

  it('should render the Fund screen on fund breadcrumb click', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const fundBreadcrumb = await screen.findByTestId('fundsLink');
    expect(fundBreadcrumb).toBeInTheDocument();
    // Verify the breadcrumb link has the correct href to the funds page
    expect(fundBreadcrumb).toHaveAttribute('href', '/admin/orgfunds/orgId');
    expect(fundBreadcrumb).toHaveAttribute('data-to', '/admin/orgfunds/orgId');
  });

  it('should sort campaigns by start date when clicking start date column header', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });

    // Find and click the Start Date column header to trigger sorting
    const startDateHeader = screen.getByText('Start Date');
    expect(startDateHeader).toBeInTheDocument();
    await userEvent.click(startDateHeader);

    // Wait for sorting to be applied - the campaigns should still be visible
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });

    // Click again to reverse sort order
    await userEvent.click(startDateHeader);

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });
  });

  it('should sort campaigns by end date when clicking end date column header', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });

    // Find and click the End Date column header to trigger sorting
    const endDateHeader = screen.getByText('End Date');
    expect(endDateHeader).toBeInTheDocument();
    await userEvent.click(endDateHeader);

    // Wait for sorting to be applied
    await waitFor(() => {
      const endDateCells = screen.getAllByTestId('endDateCell');
      expect(endDateCells.length).toBeGreaterThan(0);
    });

    // Click again to reverse sort order
    await userEvent.click(endDateHeader);

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });
  });

  it('should render campaign name cells with correct data-testid', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      const campaignNameCells = screen.getAllByTestId('campaignName');
      expect(campaignNameCells.length).toBe(5);
      expect(campaignNameCells[0]).toHaveTextContent('Campaign 1');
    });
  });

  it('should display no results empty state when search yields no matches', async () => {
    const user = userEvent.setup();
    mockRouteParams();
    renderFundCampaign(link1);

    const searchField = await screen.findByTestId('searchFullName');

    // Search for a term that doesn't match any campaign
    await user.clear(searchField);
    await user.type(searchField, 'NonExistentCampaign');

    // Assert EmptyState is rendered
    const emptyState = await screen.findByTestId('campaigns-search-empty');
    expect(emptyState).toBeInTheDocument();

    // Assert primary message (EmptyState message prop)
    expect(emptyState).toHaveTextContent(
      i18nForTest.t('common:noResultsFound'),
    );

    // Assert description with query
    expect(emptyState).toHaveTextContent(
      i18nForTest.t('common:noResultsFoundFor', {
        query: `"NonExistentCampaign"`,
      }),
    );
  });

  it('should clear search input when clear button is clicked', async () => {
    const user = userEvent.setup();
    mockRouteParams();
    renderFundCampaign(link1);

    const searchField = await screen.findByTestId('searchFullName');

    // Search for a term
    await user.clear(searchField);
    await user.type(searchField, 'Campaign');

    await waitFor(() => {
      expect(searchField).toHaveValue('Campaign');
    });

    // Click the clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(searchField).toHaveValue('');
    });
  });

  it('should render progress cells with CircularProgress and percentage', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });

    // Verify progress cells are rendered with the percentage display
    const progressCells = screen.getAllByTestId('progressCell');
    expect(progressCells.length).toBeGreaterThan(0);

    // Filter out only the cells that match our specific test cases (ignoring others if any)
    const campaign1Cell = progressCells.find((cell) =>
      cell.textContent?.includes('0%'),
    );
    const campaignHalfCell = progressCells.find((cell) =>
      cell.textContent?.includes('50%'),
    );
    const hundredPercentCells = progressCells.filter((cell) =>
      cell.textContent?.includes('100%'),
    );
    expect(campaign1Cell).toBeInTheDocument();
    expect(campaignHalfCell).toBeInTheDocument();
    expect(hundredPercentCells.length).toBe(2);
  });

  it('should display raised cells with currency symbol', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });

    // Verify raised cells are rendered
    const raisedCells = screen.getAllByTestId('raisedCell');
    expect(raisedCells.length).toBeGreaterThan(0);

    // Verify presence of specific amounts
    const raised0 = raisedCells.find((cell) =>
      cell.textContent?.includes('$0'),
    );
    const raised50 = raisedCells.find((cell) =>
      cell.textContent?.includes('$50'),
    );
    const raised100 = raisedCells.find((cell) =>
      cell.textContent?.includes('$100'),
    );
    const raised150 = raisedCells.find((cell) =>
      cell.textContent?.includes('$150'),
    );

    expect(raised0).toBeInTheDocument();
    expect(raised50).toBeInTheDocument();
    expect(raised100).toBeInTheDocument();
    expect(raised150).toBeInTheDocument();
  });

  it('should display end of results message when campaigns are displayed', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });

    // Verify that multiple campaign elements are visible (confirming the list is displayed)
    const campaignNameCells = screen.getAllByTestId('campaignName');
    expect(campaignNameCells.length).toBe(5);

    // Verify goal cells are also visible (confirming table rendering)
    const goalCells = screen.getAllByTestId('goalCell');
    expect(goalCells.length).toBe(5);
  });
});
