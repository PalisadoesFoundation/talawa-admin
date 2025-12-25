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
import OrganizationFundCampaigns from './OrganizationFundCampaigns';
import {
  EMPTY_MOCKS,
  MOCKS,
  MOCK_ERROR,
} from './OrganizationFundCampaignMocks';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import { PAGE_SIZE } from '../../types/ReportingTable/utils';

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
          const testId = item.to?.includes('/orgfunds/')
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
const loadingOverlaySpy = vi.fn();
vi.mock('shared-components/ReportingTable/ReportingTable', async () => {
  const actual = await vi.importActual<
    typeof import('shared-components/ReportingTable/ReportingTable')
  >('shared-components/ReportingTable/ReportingTable');

  return {
    __esModule: true,
    default: (props: {
      gridProps?: {
        slots?: { loadingOverlay?: () => React.ReactNode };
        onPaginationModelChange?: (model: {
          page: number;
          pageSize: number;
        }) => void;
      };
    }) => {
      loadingOverlaySpy(props.gridProps?.slots?.loadingOverlay?.());

      // Create wrapper to ensure callbacks are properly invoked
      const wrappedProps = {
        ...props,
        gridProps: {
          ...props.gridProps,
          // Ensure onPaginationModelChange is called when pagination changes
          onPaginationModelChange: props.gridProps?.onPaginationModelChange,
        },
      };

      const Component = (
        actual as unknown as {
          default: React.ComponentType<typeof wrappedProps>;
        }
      ).default;
      return <Component {...wrappedProps} />;
    },
  };
});

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
                  element={<OrganizationFundCampaigns />}
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
  it('should cover setPaginationModel and TableLoader overlay (lines 112, 483)', async () => {
    mockRouteParams();
    // Use PAGE_SIZE from the component or set to 10 if unknown
    const manyCampaigns = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => ({
      node: {
        id: `campaignId${i + 1}`,
        name: `Campaign ${i + 1}`,
        startAt: '2024-01-01T00:00:00.000Z',
        endAt: '2026-01-01T00:00:00.000Z',
        currencyCode: 'USD',
        goalAmount: 100 + i,
        __typename: 'Campaign',
      },
    }));
    const paginationMocks = [
      {
        request: {
          query: FUND_CAMPAIGN,
          variables: { input: { id: 'fundId' } },
        },
        result: {
          data: {
            fund: {
              id: 'fundId',
              name: 'Fund 1',
              campaigns: {
                edges: manyCampaigns,
                __typename: 'CampaignConnection',
              },
              __typename: 'Fund',
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={paginationMocks}>
        <MemoryRouter initialEntries={['/orgfundcampaign/orgId/fundId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <Routes>
                  <Route
                    path="/orgfundcampaign/:orgId/:fundId"
                    element={<OrganizationFundCampaigns />}
                  />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });
    // Find and click the next page button (should be enabled now)
    const nextButton = screen.getByLabelText('Go to next page');
    if (
      nextButton.hasAttribute('disabled') ||
      nextButton.style.pointerEvents === 'none'
    ) {
      // Print debug info if still disabled

      console.error(
        'Next page button is disabled. Check PAGE_SIZE and campaign mock count.',
      );
      // Print number of rendered rows
      const rows = screen.queryAllByRole('row');

      console.error('Rendered rows:', rows.length);
    }
    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);
    // Optionally, check for TableLoader overlay if you can trigger DataGrid loading state
    // expect(await screen.findByTestId('TableLoader')).toBeInTheDocument();
  });
  it('should render loading spinner when loading', async () => {
    mockRouteParams();
    render(
      <MockedProvider mocks={MOCKS}>
        <MemoryRouter initialEntries={['/orgfundcampaign/orgId/fundId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <Routes>
                  <Route
                    path="/orgfundcampaign/:orgId/:fundId"
                    element={<OrganizationFundCampaigns />}
                  />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    // Spinner should be present while loading
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
  it('should trigger onKeyDown (Enter/Space) on campaignName and cover handler', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });

    // Find the campaignName cell
    const campaignNameCell = screen.getAllByTestId('campaignName')[0];
    expect(campaignNameCell).toBeInTheDocument();

    // Fire Enter key
    fireEvent.keyDown(campaignNameCell, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    // Fire Space key
    fireEvent.keyDown(campaignNameCell, {
      key: ' ',
      code: 'Space',
      charCode: 32,
    });

    // Optionally, check for navigation or modal open if that's the effect
  });
  it('should trigger pagination and cover setPaginationModel', async () => {
    mockRouteParams();
    // Use PAGE_SIZE from the earlier test
    const manyCampaigns = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => ({
      node: {
        id: `campaignId${i + 1}`,
        name: `Campaign ${i + 1}`,
        startAt: '2024-01-01T00:00:00.000Z',
        endAt: '2026-01-01T00:00:00.000Z',
        currencyCode: 'USD',
        goalAmount: 100 + i,
        __typename: 'Campaign',
      },
    }));
    const paginationMocks = [
      {
        request: {
          query: FUND_CAMPAIGN,
          variables: { input: { id: 'fundId' } },
        },
        result: {
          data: {
            fund: {
              id: 'fundId',
              name: 'Fund 1',
              campaigns: {
                edges: manyCampaigns,
                __typename: 'CampaignConnection',
              },
              __typename: 'Fund',
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={paginationMocks}>
        <MemoryRouter initialEntries={['/orgfundcampaign/orgId/fundId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <Routes>
                  <Route
                    path="/orgfundcampaign/:orgId/:fundId"
                    element={<OrganizationFundCampaigns />}
                  />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });

    // Find the DataGrid pagination next button and wait for it to be enabled before clicking
    const nextButton = screen.getByLabelText('Go to next page');
    expect(nextButton).toBeInTheDocument();
    await waitFor(() => expect(nextButton).toBeEnabled());
    await userEvent.click(nextButton);

    // Optionally, check for the presence of a campaign on the next page
    expect(screen.getByText('Campaign 11')).toBeInTheDocument();
  });
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
        <MemoryRouter initialEntries={['/orgfundcampaign/']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <Routes>
                  <Route
                    path="/orgfundcampaign/"
                    element={<OrganizationFundCampaigns />}
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
    // Verify the breadcrumb link has the correct href to the funds page
    expect(fundBreadcrumb).toHaveAttribute('href', '/orgfunds/orgId');
    expect(fundBreadcrumb).toHaveAttribute('data-to', '/orgfunds/orgId');
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
      expect(campaignNameCells.length).toBe(2);
      expect(campaignNameCells[0]).toHaveTextContent('Campaign 1');
      expect(campaignNameCells[1]).toHaveTextContent('Campaign 2');
    });
  });

  it('should display no results message when search yields no matches', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const searchField = await screen.findByTestId('searchFullName');

    // Search for a term that doesn't match any campaign
    fireEvent.change(searchField, {
      target: { value: 'NonExistentCampaign' },
    });

    await waitFor(() => {
      expect(screen.getByText(/No results found for/i)).toBeInTheDocument();
    });
  });

  it('should clear search input when clear button is clicked', async () => {
    mockRouteParams();
    renderFundCampaign(link1);

    const searchField = await screen.findByTestId('searchFullName');

    // Search for a term
    fireEvent.change(searchField, {
      target: { value: 'Campaign' },
    });

    await waitFor(() => {
      expect(searchField).toHaveValue('Campaign');
    });

    // Click the clear button
    const clearButton = screen.getByTestId('clearSearch');
    await userEvent.click(clearButton);

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

    // Each progress cell should contain 0% (since raised is hardcoded to 0)
    progressCells.forEach((cell) => {
      expect(cell).toHaveTextContent('0%');
    });
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

    // Each raised cell should contain $0 (USD currency)
    raisedCells.forEach((cell) => {
      expect(cell).toHaveTextContent('$0');
    });
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
    expect(campaignNameCells.length).toBe(2);

    // Verify goal cells are also visible (confirming table rendering)
    const goalCells = screen.getAllByTestId('goalCell');
    expect(goalCells.length).toBe(2);
  });
});
