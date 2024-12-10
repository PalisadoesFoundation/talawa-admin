import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import UpcomingEvents from './UpcomingEvents';
import type { ApolloLink } from '@apollo/client';
import {
  MOCKS,
  EMPTY_MOCKS,
  ERROR_MOCKS,
  CREATE_ERROR_MOCKS,
} from './UpcomingEvents.mocks';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';

/**
 * Unit tests for the UpcomingEvents component.
 *
 * This file contains tests to verify the functionality and behavior of the UpcomingEvents component
 * under various scenarios, including successful data fetching, error handling, and user interactions.
 * Mocked dependencies are used to ensure isolated testing of the component.
 */

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const { setItem } = useLocalStorage();

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const link4 = new StaticMockLink(CREATE_ERROR_MOCKS);

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.userVolunteer ?? {},
    ),
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

const renderUpcomingEvents = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/user/volunteer/:orgId"
                  element={<UpcomingEvents />}
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

describe('Testing Upcoming Events Screen', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ orgId: 'orgId' }),
      };
    });
  });

  beforeEach(() => {
    setItem('userId', 'userId');
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', null);
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/" element={<UpcomingEvents />} />
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

  it('should render Upcoming Events screen', async () => {
    renderUpcomingEvents(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
  });

  it('Search by event title', async () => {
    renderUpcomingEvents(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle');
    expect(searchToggle).toBeInTheDocument();
    userEvent.click(searchToggle);

    const searchByTitle = await screen.findByTestId('title');
    expect(searchByTitle).toBeInTheDocument();
    userEvent.click(searchByTitle);

    userEvent.type(searchInput, '1');
    await debounceWait();

    const eventTitle = await screen.findAllByTestId('eventTitle');
    expect(eventTitle[0]).toHaveTextContent('Event 1');
  });

  it('Search by event location on click of search button', async () => {
    renderUpcomingEvents(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle');
    expect(searchToggle).toBeInTheDocument();
    userEvent.click(searchToggle);

    const searchByLocation = await screen.findByTestId('location');
    expect(searchByLocation).toBeInTheDocument();
    userEvent.click(searchByLocation);

    // Search by name on press of ENTER
    userEvent.type(searchInput, 'M');
    await debounceWait();

    const eventTitle = await screen.findAllByTestId('eventTitle');
    expect(eventTitle[0]).toHaveTextContent('Event 1');
  });

  it('should render screen with No Events', async () => {
    renderUpcomingEvents(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noEvents)).toBeInTheDocument();
    });
  });

  it('Error while fetching Events data', async () => {
    renderUpcomingEvents(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Click on Individual volunteer button', async () => {
    renderUpcomingEvents(link1);

    const volunteerBtn = await screen.findAllByTestId('volunteerBtn');
    userEvent.click(volunteerBtn[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.volunteerSuccess);
    });
  });

  it('Join Volunteer Group', async () => {
    renderUpcomingEvents(link1);

    const eventTitle = await screen.findAllByTestId('eventTitle');
    expect(eventTitle[0]).toHaveTextContent('Event 1');
    userEvent.click(eventTitle[0]);

    const joinGroupBtn = await screen.findAllByTestId('joinBtn');
    expect(joinGroupBtn).toHaveLength(3);
    userEvent.click(joinGroupBtn[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.volunteerSuccess);
    });
  });

  it('Error on Create Volunteer Membership', async () => {
    renderUpcomingEvents(link4);

    const volunteerBtn = await screen.findAllByTestId('volunteerBtn');
    userEvent.click(volunteerBtn[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
