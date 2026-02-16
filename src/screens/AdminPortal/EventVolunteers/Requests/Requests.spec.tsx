/**
 * Testing component for managing and displaying Volunteer Membership requests for an event.
 *
 * This component allows users to view, filter, sort, and create action items. It also allows users to accept or reject volunteer membership requests.
 *
 *
 */
import React, { act } from 'react';
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
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
const i18n = i18nForTest;
import Requests from './Requests';
import type { ApolloLink } from '@apollo/client';
import {
  MOCKS,
  EMPTY_MOCKS,
  ERROR_MOCKS,
  UPDATE_ERROR_MOCKS,
  MOCKS_WITH_FILTER_DATA,
} from './Requests.mocks';
import { vi } from 'vitest';

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

const wait = async (ms = 100): Promise<void> => {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
};

const debounceWait = (): Promise<void> => wait(300);

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const link4 = new StaticMockLink(UPDATE_ERROR_MOCKS);
const link5 = new StaticMockLink(MOCKS_WITH_FILTER_DATA);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const renderRequests = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/admin/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/admin/event/:orgId/:eventId"
                  element={<Requests />}
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

describe('Testing Requests Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/admin/event/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/admin/event/" element={<Requests />} />
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
    expect(window.location.pathname).toBe('/');
  });

  it('should render Requests screen', async () => {
    renderRequests(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });
  });

  it('Check Sorting Functionality', async () => {
    const user = userEvent.setup();
    renderRequests(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    let sortBtn = await screen.findByTestId('sort-toggle');
    expect(sortBtn).toBeInTheDocument();

    // Sort by createdAt_DESC
    await user.click(sortBtn);
    const createdAtDESC = await screen.findByTestId('sort-item-createdAt_DESC');
    expect(createdAtDESC).toBeInTheDocument();
    await user.click(createdAtDESC);

    let volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');

    // Sort by createdAt_ASC
    sortBtn = await screen.findByTestId('sort-toggle');
    expect(sortBtn).toBeInTheDocument();
    await user.click(sortBtn);
    const createdAtASC = await screen.findByTestId('sort-item-createdAt_ASC');
    expect(createdAtASC).toBeInTheDocument();
    await user.click(createdAtASC);

    volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('John Doe');
  });

  it('Search Requests by volunteer name', async () => {
    renderRequests(link1);

    // Wait for LoadingState to complete and table data to render
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Search by name with debounced search
    await userEvent.type(searchInput, 'T');
    await debounceWait();

    await waitFor(() => {
      const volunteerName = screen.getAllByTestId('volunteerName');
      expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');
    });
  });

  it('Search Requests by volunteer name using submit (Enter key)', async () => {
    renderRequests(link1);

    // Wait for LoadingState to complete and table data to render
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Search by name using Enter key to trigger onSearchSubmit
    await userEvent.type(searchInput, 'T{Enter}');
    await debounceWait();

    await waitFor(() => {
      const volunteerName = screen.getAllByTestId('volunteerName');
      expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');
    });
  });

  it('should render screen with No Requests', async () => {
    renderRequests(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noRequests)).toBeInTheDocument();
    });
  });

  it('Error while fetching requests data', async () => {
    renderRequests(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Accept Request', async () => {
    renderRequests(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);

    // Accept Request
    await userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(toastMocks.success).toHaveBeenCalled();
    });
  });

  it('Reject Request', async () => {
    renderRequests(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const rejectBtn = await screen.findAllByTestId('rejectBtn');
    expect(rejectBtn).toHaveLength(2);

    // Reject Request
    await userEvent.click(rejectBtn[0]);

    await waitFor(() => {
      expect(toastMocks.success).toHaveBeenCalled();
    });
  });

  it('Error in Update Request Mutation', async () => {
    renderRequests(link4);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);

    // Accept Request
    await userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalled();
    });
  });

  it('should filter requests by individual type', async () => {
    const user = userEvent.setup();
    renderRequests(link5);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Initially should show all requests (2 individual + 1 group = 3)
    let volunteerNames = await screen.findAllByTestId('volunteerName');
    expect(volunteerNames).toHaveLength(3);

    // Click filter button
    const filterBtn = await screen.findByTestId('filter-toggle');
    await user.click(filterBtn);

    // Select individual filter
    const individualFilter = await screen.findByTestId(
      'filter-item-individual',
    );
    await user.click(individualFilter);

    await waitFor(() => {
      // Should only show individual requests (2 requests without group)
      const volunteerNamesAfterFilter = screen.getAllByTestId('volunteerName');
      expect(volunteerNamesAfterFilter).toHaveLength(2);
      expect(volunteerNamesAfterFilter[0]).toHaveTextContent('John Doe');
      expect(volunteerNamesAfterFilter[1]).toHaveTextContent('Teresa Bradley');
    });
  });

  it('should filter requests by group type', async () => {
    const user = userEvent.setup();
    renderRequests(link5);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Initially should show all requests (2 individual + 1 group = 3)
    let volunteerNames = await screen.findAllByTestId('volunteerName');
    expect(volunteerNames).toHaveLength(3);

    // Click filter button
    const filterBtn = await screen.findByTestId('filter-toggle');
    await user.click(filterBtn);

    // Select group filter
    const groupFilter = await screen.findByTestId('filter-item-group');
    await user.click(groupFilter);

    await waitFor(() => {
      // Should only show group requests (1 request with group)
      const volunteerNamesAfterFilter = screen.getAllByTestId('volunteerName');
      expect(volunteerNamesAfterFilter).toHaveLength(1);
      expect(volunteerNamesAfterFilter[0]).toHaveTextContent('Group Volunteer');
    });
  });

  it('should show all requests when filter is set to all', async () => {
    const user = userEvent.setup();
    renderRequests(link5);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Click filter button
    const filterBtn = await screen.findByTestId('filter-toggle');
    await user.click(filterBtn);

    // First set to individual filter
    const individualFilter = await screen.findByTestId(
      'filter-item-individual',
    );
    await user.click(individualFilter);

    await waitFor(() => {
      const filteredNames = screen.getAllByTestId('volunteerName');
      expect(filteredNames).toHaveLength(2);
    });

    // Now click filter button again
    const filterBtnAgain = await screen.findByTestId('filter-toggle');
    await user.click(filterBtnAgain);

    // Select 'all' filter to show all requests again
    const allFilter = await screen.findByTestId('filter-item-all');
    await user.click(allFilter);

    await waitFor(() => {
      // Should show all requests again (2 individual + 1 group = 3)
      const volunteerNamesAll = screen.getAllByTestId('volunteerName');
      expect(volunteerNamesAll).toHaveLength(3);
    });
  });
});

describe('Requests Component CSS Styling', () => {
  const renderComponent = (): RenderResult => {
    return renderRequests(link1);
  };

  test('DataGridWrapper should render with DataGrid', async () => {
    const { container } = renderComponent();
    await wait();

    const dataGrid = container.querySelector('.MuiDataGrid-root');
    expect(dataGrid).toBeInTheDocument();
    expect(dataGrid).toHaveClass('MuiDataGrid-root');
  });

  test('Sort controls should be rendered', async () => {
    const { container } = renderComponent();
    await wait();
    // Verify DataGrid and sort controls are present
    const hasDataGrid = container.querySelector('.MuiDataGrid-root');
    expect(hasDataGrid).toBeInTheDocument();

    const sortButton = await screen.findByTestId('sort-toggle');
    expect(sortButton).toBeInTheDocument();
  });
});
