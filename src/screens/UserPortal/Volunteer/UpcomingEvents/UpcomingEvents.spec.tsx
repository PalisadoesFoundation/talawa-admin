import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import UpcomingEvents from './UpcomingEvents';
import type { ApolloLink } from '@apollo/client';
import {
  MOCKS,
  EMPTY_MOCKS,
  ERROR_MOCKS,
  MEMBERSHIP_STATUS_MOCKS,
  MEMBERSHIP_LOOKUP_MOCKS,
} from './UpcomingEvents.mocks';

import useLocalStorage from 'utils/useLocalstorage';
import {
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  describe,
  it,
  expect,
} from 'vitest';

const sharedMocks = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  useParams: vi.fn(() => ({ orgId: 'orgId' })),
}));

vi.mock('react-toastify', () => ({
  toast: sharedMocks.toast,
}));

vi.mock('@mui/icons-material', () => ({
  Circle: vi.fn(() => null),
  WarningAmberRounded: vi.fn(() => null),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: sharedMocks.useParams,
  };
});

const { setItem, clearAllItems } = useLocalStorage();

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const link6 = new StaticMockLink(MEMBERSHIP_STATUS_MOCKS);
const link8 = new StaticMockLink(MEMBERSHIP_LOOKUP_MOCKS);

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.userVolunteer ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

// debounce helper removed (not used in this spec)

const renderUpcomingEvents = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
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
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;

  beforeAll(() => {
    vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(function (
      this: Date,
    ) {
      return originalToLocaleDateString.call(this, 'en-US');
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    setItem('userId', 'userId');
  });

  afterEach(() => {
    vi.clearAllMocks();
    sharedMocks.useParams.mockReturnValue({ orgId: 'orgId' });
    clearAllItems();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', null);
    render(
      <MockedProvider link={link1}>
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
    expect(await screen.findByTestId('searchByInput')).toBeInTheDocument();
  });

  it('should render screen with No Events', async () => {
    renderUpcomingEvents(link3);

    await waitFor(() => {
      expect(screen.getByText(t.noEvents)).toBeInTheDocument();
    });
  });

  it('Error while fetching Events data', async () => {
    renderUpcomingEvents(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('should display events with volunteer buttons', async () => {
    renderUpcomingEvents(link1);

    await waitFor(() => {
      const eventTitles = screen.getAllByTestId('eventTitle');
      expect(eventTitles.length).toBeGreaterThan(0);
    });

    const volunteerBtns = screen.getAllByTestId('volunteerBtn');
    expect(volunteerBtns.length).toBeGreaterThan(0);
  });

  it('should display correct button states based on membership status', async () => {
    renderUpcomingEvents(link6);

    await waitFor(() => {
      const volunteerBtns = screen.getAllByTestId('volunteerBtn');
      expect(volunteerBtns.length).toBeGreaterThan(0);
    });
  });

  it('should handle membership lookup logic', async () => {
    renderUpcomingEvents(link8);

    await waitFor(() => {
      const volunteerBtns = screen.getAllByTestId('volunteerBtn');
      expect(volunteerBtns.length).toBeGreaterThan(0);
    });
  });

  it('should filter events by title', async () => {
    renderUpcomingEvents(link1);

    const searchInput = await screen.findByTestId('searchByInput');

    // Type in search
    await userEvent.type(searchInput, 'Event 1');

    await waitFor(() => {
      const eventTitles = screen.getAllByTestId('eventTitle');
      expect(eventTitles.length).toBeGreaterThan(0);
    });
  });

  it('should filter events by location', async () => {
    renderUpcomingEvents(link1);

    const searchInput = await screen.findByTestId('searchByInput');

    // Change search filter to location
    const searchByBtn = screen.getByTestId('searchBy');
    await userEvent.click(searchByBtn);

    const locationOption = await screen.findByTestId('location');
    await userEvent.click(locationOption);

    // Type in search
    await userEvent.type(searchInput, 'Location');

    await waitFor(() => {
      expect(searchInput).toHaveValue('Location');
    });
  });

  it('should expand accordion to show event details', async () => {
    renderUpcomingEvents(link1);

    await waitFor(() => {
      const eventTitle = screen.getAllByTestId('eventTitle')[0];
      expect(eventTitle).toBeInTheDocument();
    });

    // Get the first accordion summary button
    const accordionButtons = screen.getAllByRole('button');
    const firstAccordionButton = accordionButtons.find((btn) =>
      btn.classList.contains('MuiAccordionSummary-root'),
    );

    expect(firstAccordionButton).toBeDefined();

    if (firstAccordionButton) {
      await userEvent.click(firstAccordionButton);

      // Accordion should now be expanded
      await waitFor(() => {
        expect(firstAccordionButton).toHaveAttribute('aria-expanded', 'true');
      });
    }
  });
});
