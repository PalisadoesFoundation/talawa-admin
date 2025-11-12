/**
 * Testing component for managing and displaying Volunteer Membership requests for an event.
 *
 * This component allows users to view, filter, sort, and create action items. It also allows users to accept or reject volunteer membership requests.
 *
 *
 */
import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';
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
import { toast } from 'react-toastify';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const debounceWait = async (ms = 300): Promise<void> => {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
};

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

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const renderRequests = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/event/:orgId/:eventId" element={<Requests />} />
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
  beforeAll(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
      useParams: () => ({ orgId: 'orgId', eventId: 'eventId' }),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/event/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/event/" element={<Requests />} />
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
    renderRequests(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    let sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by createdAt_DESC
    fireEvent.click(sortBtn);
    const createdAtDESC = await screen.findByTestId('createdAt_DESC');
    expect(createdAtDESC).toBeInTheDocument();
    fireEvent.click(createdAtDESC);

    let volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');

    // Sort by createdAt_ASC
    sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();
    fireEvent.click(sortBtn);
    const createdAtASC = await screen.findByTestId('createdAt_ASC');
    expect(createdAtASC).toBeInTheDocument();
    fireEvent.click(createdAtASC);

    volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('John Doe');
  });

  it('Search Requests by volunteer name', async () => {
    renderRequests(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Search by name on press of ENTER
    await userEvent.type(searchInput, 'T');
    await debounceWait();
    fireEvent.click(screen.getByTestId('searchBtn'));

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
      expect(toast.success).toHaveBeenCalledWith(t.requestAccepted);
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
      expect(toast.success).toHaveBeenCalledWith(t.requestRejected);
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
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should filter requests by individual type', async () => {
    renderRequests(link5);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Initially should show all requests (2 individual + 1 group = 3)
    let volunteerNames = await screen.findAllByTestId('volunteerName');
    expect(volunteerNames).toHaveLength(3);

    // Click filter button
    const filterBtn = await screen.findByTestId('filter');
    fireEvent.click(filterBtn);

    // Select individual filter
    const individualFilter = await screen.findByTestId('individual');
    fireEvent.click(individualFilter);

    await waitFor(() => {
      // Should only show individual requests (2 requests without group)
      const volunteerNamesAfterFilter = screen.getAllByTestId('volunteerName');
      expect(volunteerNamesAfterFilter).toHaveLength(2);
      expect(volunteerNamesAfterFilter[0]).toHaveTextContent('John Doe');
      expect(volunteerNamesAfterFilter[1]).toHaveTextContent('Teresa Bradley');
    });
  });

  it('should filter requests by group type', async () => {
    renderRequests(link5);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Initially should show all requests (2 individual + 1 group = 3)
    let volunteerNames = await screen.findAllByTestId('volunteerName');
    expect(volunteerNames).toHaveLength(3);

    // Click filter button
    const filterBtn = await screen.findByTestId('filter');
    fireEvent.click(filterBtn);

    // Select group filter
    const groupFilter = await screen.findByTestId('group');
    fireEvent.click(groupFilter);

    await waitFor(() => {
      // Should only show group requests (1 request with group)
      const volunteerNamesAfterFilter = screen.getAllByTestId('volunteerName');
      expect(volunteerNamesAfterFilter).toHaveLength(1);
      expect(volunteerNamesAfterFilter[0]).toHaveTextContent('Group Volunteer');
    });
  });

  it('should show all requests when filter is set to all', async () => {
    renderRequests(link5);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Click filter button
    const filterBtn = await screen.findByTestId('filter');
    fireEvent.click(filterBtn);

    // First set to individual filter
    const individualFilter = await screen.findByTestId('individual');
    fireEvent.click(individualFilter);

    await waitFor(() => {
      const filteredNames = screen.getAllByTestId('volunteerName');
      expect(filteredNames).toHaveLength(2);
    });

    // Now click filter button again
    const filterBtnAgain = await screen.findByTestId('filter');
    fireEvent.click(filterBtnAgain);

    // Select 'all' filter to show all requests again
    const allFilter = await screen.findByTestId('all');
    fireEvent.click(allFilter);

    await waitFor(() => {
      // Should show all requests again (2 individual + 1 group = 3)
      const volunteerNamesAll = screen.getAllByTestId('volunteerName');
      expect(volunteerNamesAll).toHaveLength(3);
    });
  });
});

describe('Requests Component CSS Styling', () => {
  const renderComponent = (): RenderResult => {
    return render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  test('DataGrid should have correct styling', async () => {
    const { container } = renderComponent();
    await wait();

    const dataGrid = container.querySelector('.MuiDataGrid-root');
    expect(dataGrid).toBeInTheDocument();
    expect(dataGrid).toHaveClass('MuiDataGrid-root');

    const styles = getComputedStyle(dataGrid as Element);
    expect(styles.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(styles.borderRadius).toBe('16px');
  });

  test('Sort button container should have correct spacing', async () => {
    const { container } = renderComponent();
    await wait();

    const sortContainer = container.querySelector('.d-flex.gap-3.mb-1');
    expect(sortContainer).toBeInTheDocument();

    const sortButtonWrapper = container.querySelector(
      '.d-flex.justify-space-between.align-items-center.gap-3',
    );
    expect(sortButtonWrapper).toBeInTheDocument();
  });
});
