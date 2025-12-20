import React from 'react';
import { MockedProvider } from '@apollo/client/testing/react';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
        <MemoryRouter initialEntries={['/orgfunds/orgId']}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgfunds/:orgId"
                  element={<OrganizationFunds />}
                />
                <Route
                  path="/orgfundcampaign/:orgId/:fundId"
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
  beforeEach(() => {
    mockedUseParams.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    const createFundBtn = await screen.findByTestId('createFundBtn');
    expect(createFundBtn).toBeInTheDocument();
    await userEvent.click(createFundBtn);

    await waitFor(() => {
      const modalTitle = screen.getByTestId('modalTitle');
      expect(modalTitle).toHaveTextContent(translations.fundCreate);
    });

    await userEvent.click(screen.getByTestId('fundModalCloseBtn'));
    await waitFor(() => {
      expect(screen.queryByTestId('fundModalCloseBtn')).not.toBeInTheDocument();
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
    await userEvent.click(editFundBtn[0]);

    await waitFor(() =>
      expect(
        screen.getAllByText(translations.fundUpdate)[0],
      ).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByTestId('fundModalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('fundModalCloseBtn')).toBeNull(),
    );
  });

  it('Search the Funds list by name', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    // Get the search field and type into it
    const searchField = await screen.findByTestId('searchByName');
    await userEvent.clear(searchField);
    await userEvent.type(searchField, '2');
    await userEvent.click(screen.getByTestId('searchBtn'));

    // Wait and verify search results
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

  it('Sort the Pledges list by Latest created Date', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    await userEvent.click(await screen.findByTestId('sort'));
    await userEvent.click(screen.getByTestId('createdAt_DESC'));

    await waitFor(() => {
      const rows = screen.getAllByTestId('fundName');
      expect(rows[0]).toHaveTextContent('Fund 1');
      expect(rows[1]).toHaveTextContent('Fund 2');
    });
  });

  it('Click on Fund Name', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const fundName = await screen.findAllByTestId('fundName');
    expect(fundName[0]).toBeInTheDocument();
    fireEvent.click(fundName[0]);

    await waitFor(() => {
      expect(screen.getByTestId('campaignScreen')).toBeInTheDocument();
    });
  });

  it('Click on View Campaign', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });
    renderOrganizationFunds(link1);

    const viewBtn = await screen.findAllByTestId('viewBtn');
    expect(viewBtn[0]).toBeInTheDocument();
    fireEvent.click(viewBtn[0]);

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
        fireEvent.click(nextButton);
        await wait(300);
      }
    }

    // Verify component is still stable
    await waitFor(() => {
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });
  });
});
