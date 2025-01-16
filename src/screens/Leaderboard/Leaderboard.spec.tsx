import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import Leaderboard from './Leaderboard';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, EMPTY_MOCKS, ERROR_MOCKS } from './Leaderboard.mocks';
import { vi } from 'vitest';

/**
 * Unit tests for the Leaderboard component.
 *
 * This file verifies the Leaderboard's functionality in scenarios like URL handling, sorting, filtering,
 * user interactions, and error states. Mocked dependencies and Apollo links ensure isolated testing
 * of Redux, React Router, and internationalization integration.
 *
 * Key tests include:
 * - Redirecting when parameters are missing.
 * - Rendering with mock data, empty states, and errors.
 * - Sorting and filtering for various timeframes.
 * - Searching volunteers and navigating to the Member screen.
 * - Handling errors during data fetching.
 *
 * Mock setups:
 * - StaticMockLink for GraphQL responses.
 * - Mocked `useParams` for route parameters.
 * - Redux store and i18n for consistent state and translations.
 */

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const t = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.leaderboard ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const debounceWait = async (ms = 300): Promise<void> => {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
};

const renderLeaderboard = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/leaderboard/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/leaderboard/:orgId" element={<Leaderboard />} />
                <Route
                  path="/member/:orgId"
                  element={<div data-testid="memberScreen" />}
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

describe('Testing Leaderboard Screen', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => {
      const originalModule = await vi.importActual('react-router-dom');
      return {
        ...originalModule,
        useParams: vi.fn(),
      };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: '' });
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/leaderboard/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/leaderboard/" element={<Leaderboard />} />
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

  it('should render Leaderboard screen', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });
  });

  it('Check Sorting Functionality', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by hours_DESC
    fireEvent.click(sortBtn);
    const hoursDesc = await screen.findByTestId('hours_DESC');
    expect(hoursDesc).toBeInTheDocument();
    fireEvent.click(hoursDesc);

    let userName = await screen.findAllByTestId('userName');
    expect(userName[0]).toHaveTextContent('Teresa Bradley');

    // Sort by hours_ASC
    expect(sortBtn).toBeInTheDocument();
    fireEvent.click(sortBtn);
    const hoursAsc = await screen.findByTestId('hours_ASC');
    expect(hoursAsc).toBeInTheDocument();
    fireEvent.click(hoursAsc);

    userName = await screen.findAllByTestId('userName');
    expect(userName[0]).toHaveTextContent('Jane Doe');
  });

  it('Check Timeframe filter Functionality (All Time)', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Filter by allTime
    const filter = await screen.findByTestId('timeFrame');
    expect(filter).toBeInTheDocument();

    fireEvent.click(filter);
    const timeFrameAll = await screen.findByTestId('allTime');
    expect(timeFrameAll).toBeInTheDocument();

    fireEvent.click(timeFrameAll);
    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(4);
  });

  it('Check Timeframe filter Functionality (Weekly)', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const filter = await screen.findByTestId('timeFrame');
    expect(filter).toBeInTheDocument();

    // Filter by weekly
    expect(filter).toBeInTheDocument();
    fireEvent.click(filter);

    const timeFrameWeekly = await screen.findByTestId('weekly');
    expect(timeFrameWeekly).toBeInTheDocument();
    fireEvent.click(timeFrameWeekly);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(1);
  });

  it('Check Timeframe filter Functionality (Monthly)', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Filter by monthly
    const filter = await screen.findByTestId('timeFrame');
    expect(filter).toBeInTheDocument();
    fireEvent.click(filter);

    const timeFrameMonthly = await screen.findByTestId('monthly');
    expect(timeFrameMonthly).toBeInTheDocument();
    fireEvent.click(timeFrameMonthly);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(2);
  });

  it('Check Timeframe filter Functionality (Yearly)', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Filter by yearly
    const filter = await screen.findByTestId('timeFrame');
    expect(filter).toBeInTheDocument();
    fireEvent.click(filter);

    const timeFrameYearly = await screen.findByTestId('yearly');
    expect(timeFrameYearly).toBeInTheDocument();
    fireEvent.click(timeFrameYearly);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(3);
  });

  it('Search Volunteers', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Search by name on press of ENTER
    userEvent.type(searchInput, 'T');
    await debounceWait();

    await waitFor(() => {
      const userName = screen.getAllByTestId('userName');
      expect(userName).toHaveLength(1);
    });
  });

  it('OnClick of Member navigate to Member Screen', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const userName = screen.getAllByTestId('userName');
    userEvent.click(userName[0]);

    await waitFor(() => {
      expect(screen.getByTestId('memberScreen')).toBeInTheDocument();
    });
  });

  it('should render Leaderboard screen with No Volunteers', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noVolunteers)).toBeInTheDocument();
    });
  });

  it('Error while fetching volunteer data', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderLeaderboard(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });
});
