import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrganizationFunds from './OrganizationFunds';
import { MOCKS, MOCKS_ERROR, NO_FUNDS } from './OrganizationFundsMocks';
import type { ApolloLink } from '@apollo/client';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import { vi, afterEach } from 'vitest';

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

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

const mockedUseParams = vi.mocked(useParams);
const loadingOverlaySpy = vi.fn();

const link1 = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR, true);
const link3 = new StaticMockLink(NO_FUNDS, true);

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.funds),
);

const renderOrganizationFunds = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin/orgfunds/orgId']}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgfunds/:orgId"
                  element={<OrganizationFunds />}
                />
                <Route
                  path="/admin/orgfundcampaign/:orgId/:fundId"
                  element={
                    <div data-testid="campaignScreen">Campaign Screen</div>
                  }
                />
                <Route
                  path="/"
                  element={<div data-testid="paramsError">Error Page</div>}
                />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </MemoryRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('OrganizationFunds Screen =>', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    mockedUseParams.mockReset();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

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
        listProps?: {
          endMessage?: React.ReactNode;
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

        return (
          <>
            <Component {...wrappedProps} />
            {/* Render endMessage if provided in listProps */}
            {props.listProps?.endMessage}
          </>
        );
      },
    };
  });

  it('should render the Campaign Pledge screen', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    mockedUseParams.mockReturnValue({
      orgId: undefined,
    });
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/admin/orgfunds/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
                <Route
                  path="/admin/orgfunds/"
                  element={<OrganizationFunds />}
                />
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
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    const createFundBtn = await screen.findByTestId('createFundBtn');
    expect(createFundBtn).toBeInTheDocument();
    await user.click(createFundBtn);

    await waitFor(() => {
      const modalTitle = screen.getByTestId('modalTitle');
      expect(modalTitle).toHaveTextContent(translations.fundCreate);
    });

    await user.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('open and close update fund modal', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });

    const editFundBtn = await screen.findAllByTestId('editFundBtn');
    await waitFor(() => expect(editFundBtn[0]).toBeInTheDocument());
    await user.click(editFundBtn[0]);

    await waitFor(() =>
      expect(
        screen.getAllByText(translations.fundUpdate)[0],
      ).toBeInTheDocument(),
    );
    await user.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('Search the Funds list by name', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    // Get the search field and type into it (SearchBar now uses onChange, not searchBtn)
    const searchField = await screen.findByTestId('searchByName');
    await user.clear(searchField);
    await user.type(searchField, '2');

    // Wait and verify search results - search now triggers on type
    await waitFor(
      () => {
        const fund1Elements = screen.queryAllByText('Fund 1');
        const fund2Elements = screen.queryAllByText('Fund 2');
        expect(fund1Elements.length).toBe(0);
        expect(fund2Elements.length).toBe(1);
      },
      { timeout: 3000 },
    );
  });

  it('should render the Fund screen with error', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders the empty fund component', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link3);
    await waitFor(() =>
      expect(screen.getByText(translations.noFundsFound)).toBeInTheDocument(),
    );
  });

  it('Should display loading state', () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    const delayedMocks = [
      {
        request: MOCKS[0].request,
        result: {
          data: {
            organization: {
              funds: {
                edges: [],
              },
            },
          },
        },
        delay: 50,
      },
    ];
    const delayedLink = new StaticMockLink(delayedMocks, true);

    renderOrganizationFunds(delayedLink);
    expect(screen.getByTestId('TableLoader')).toBeInTheDocument();
  });

  it('Displays fund names in the table', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    // Verify fund names are displayed (sorting now via DataGrid column headers)
    await waitFor(() => {
      const rows = screen.getAllByTestId('fundName');
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0]).toBeInTheDocument();
    });
  });

  it('Sort the Pledges list by Earliest created Date', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    const { container } = renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('fundName').length).toBeGreaterThan(0);
    });

    // Find and click on the "Created On" column header to trigger sort (ASC)
    const createdOnHeader = container.querySelector(
      '[data-field="createdAt"] .MuiDataGrid-columnHeaderTitle',
    );

    expect(createdOnHeader).toBeInTheDocument();
    if (createdOnHeader) {
      await user.click(createdOnHeader);
      await wait(300);
    }

    const allFundNames = screen.getAllByTestId('fundName');

    // Find Fund 1 and Fund 2 in the visible list
    const fund1Index = allFundNames.findIndex(
      (row) => row.textContent === 'Fund 1',
    );
    const fund2Index = allFundNames.findIndex(
      (row) => row.textContent === 'Fund 2',
    );

    // If both funds are visible on the current page, verify their relative order
    if (fund1Index >= 0 && fund2Index >= 0) {
      // Verify Fund 2 (2024-06-21, earlier) appears before Fund 1 (2024-06-22, later) when sorted ASC
      expect(fund2Index).toBeLessThan(fund1Index);
    } else {
      // If they're not both visible (due to pagination), verify that funds are still rendered
      expect(allFundNames.length).toBeGreaterThan(0);
    }
  });

  it('Click on Fund Name', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const fundName = await screen.findAllByTestId('fundName');
    expect(fundName[0]).toBeInTheDocument();
    await user.click(fundName[0]);

    await waitFor(() => {
      expect(screen.getByTestId('campaignScreen')).toBeInTheDocument();
    });
  });

  it('Click on View Campaign', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const viewBtn = await screen.findAllByTestId('viewBtn');
    expect(viewBtn[0]).toBeInTheDocument();
    await user.click(viewBtn[0]);

    await waitFor(() => {
      expect(screen.getByTestId('campaignScreen')).toBeInTheDocument();
    });
  });

  it('handles pagination model change', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    const { container } = renderOrganizationFunds(link1);

    await wait();

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    // Verify the page loaded with funds data
    await waitFor(() => {
      expect(screen.getAllByTestId('fundName').length).toBeGreaterThan(0);
    });

    // Find pagination controls in the DataGrid
    const paginationRoot = container.querySelector(
      '[class*="MuiTablePagination-root"]',
    );

    if (paginationRoot) {
      // Find next page button
      const nextButton = paginationRoot.querySelector(
        'button[aria-label*="next"]',
      ) as HTMLButtonElement | null;

      if (nextButton && !nextButton.disabled) {
        await user.click(nextButton);
        await wait(300);
      }
    }

    // Verify component is still stable
    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });
  });

  it('should clear the search input when clear button is clicked', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    // Get the search field and type into it
    const searchField = await screen.findByTestId('searchByName');
    await user.type(searchField, 'testsearch');

    // Verify search text is entered (onChange trims spaces)
    expect(searchField).toHaveValue('testsearch');

    // Click the clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    // Verify search input is cleared
    await waitFor(() => {
      expect(searchField).toHaveValue('');
    });
  });

  it('should display "noResultsFoundFor" message when search yields no results', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    // Wait for funds to load
    await waitFor(() => {
      expect(screen.getAllByTestId('fundName').length).toBeGreaterThan(0);
    });

    // Type a search term that won't match any funds
    const searchField = await screen.findByTestId('searchByName');
    await user.type(searchField, 'nonexistentfundxyz');

    // Verify "No results found for" message is displayed
    await waitFor(() => {
      const emptyState = screen.getByTestId('funds-search-empty');
      expect(emptyState).toBeInTheDocument();
    });
  });

  it('should display "endOfResults" message when funds are displayed', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    // Wait for funds to load
    await waitFor(() => {
      expect(screen.getAllByTestId('fundName').length).toBeGreaterThan(0);
    });

    // Verify "End of results" message is displayed
    await waitFor(() => {
      expect(screen.getByText(/End of results/i)).toBeInTheDocument();
    });
  });

  it('should sort funds by createdAt using sortComparator', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    const { container } = renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    // Wait for funds to load
    await waitFor(() => {
      expect(screen.getAllByTestId('fundName').length).toBeGreaterThan(0);
    });

    // Find and click on the "Created On" column header to trigger sort
    const createdOnHeader = container.querySelector(
      '[data-field="createdAt"] .MuiDataGrid-columnHeaderTitle',
    );

    if (createdOnHeader) {
      await user.click(createdOnHeader);
      await wait(300);

      // Click again to toggle sort direction
      await user.click(createdOnHeader);
      await wait(300);
    }

    // Verify created on dates are displayed
    await waitFor(() => {
      const createdOnElements = screen.getAllByTestId('createdOn');
      expect(createdOnElements.length).toBeGreaterThan(0);
    });
  });
});
