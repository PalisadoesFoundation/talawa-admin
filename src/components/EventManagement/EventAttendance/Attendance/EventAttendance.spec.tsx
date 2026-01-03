import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import EventAttendance from './EventAttendance';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import i18n from 'utils/i18nForTest';
import { MOCKS } from '../EventAttendanceMocks';
import { vi, describe, afterEach, expect, it } from 'vitest';
import styles from 'style/app-fixed.module.css';
import { ApolloError, useLazyQuery } from '@apollo/client';
import * as ApolloClientModule from '@apollo/client';

// Mock chart.js to avoid canvas errors
vi.mock('react-chartjs-2', async () => ({
  ...(await vi.importActual('react-chartjs-2')),
  Line: () => null,
  Bar: () => null,
}));

const renderEventAttendance = (): RenderResult => {
  return render(
    <MockedProvider mocks={MOCKS}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <EventAttendance />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

const renderEventAttendanceWithSpy = (): RenderResult => {
  return render(
    <BrowserRouter>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <EventAttendance />
        </I18nextProvider>
      </Provider>
    </BrowserRouter>,
  );
};

function mockLazyQuery(returned: {
  data?: unknown;
  loading?: boolean;
  error?: ApolloError | null;
}) {
  vi.spyOn(ApolloClientModule, 'useLazyQuery').mockReturnValue([
    () => {},
    {
      data: returned.data,
      loading: returned.loading ?? false,
      error: returned.error ?? undefined,
      called: true,
      client: undefined,
      networkStatus: 7,
      refetch: vi.fn(),
    },
  ] as unknown as ReturnType<typeof useLazyQuery>);
}

describe('Event Attendance Component', () => {
  beforeEach(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
      useParams: () => ({ eventId: 'event123', orgId: 'org123' }),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('Component loads correctly with table headers', async () => {
    renderEventAttendance();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument();
      expect(screen.getByTestId('header-member-name')).toBeInTheDocument();
      expect(screen.getByTestId('header-status')).toBeInTheDocument();
    });
  });

  it('Renders attendee data correctly', async () => {
    renderEventAttendance();

    await waitFor(() => {
      expect(screen.getByTestId('attendee-name-0')).toBeInTheDocument();
      expect(screen.getByTestId('attendee-name-1')).toHaveTextContent(
        'Jane Smith',
      );
    });
  });

  it('Search filters attendees by name correctly', async () => {
    renderEventAttendance();

    const searchInput = await screen.findByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'Bruce' } });

    await waitFor(() => {
      expect(screen.getByTestId('attendee-name-0')).toHaveTextContent(
        'Bruce Garza',
      );
    });
  });

  it('Search filters attendees by email', async () => {
    renderEventAttendance();

    const searchInput = await screen.findByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'example.com' } });

    await waitFor(() => {
      const attendees = screen.getAllByTestId(/^attendee-name-/);
      expect(attendees).toHaveLength(3); // All mock attendees contain example.com
    });
  });

  it('Clears search input', async () => {
    renderEventAttendance();

    const searchInput = await screen.findByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'Bruce' } });
    expect(searchInput).toHaveValue('Bruce');

    // SearchBar renders a clear button when value is not empty
    const clearBtn = screen.getByLabelText('Clear');
    fireEvent.click(clearBtn);

    expect(searchInput).toHaveValue('');
  });

  it('Sort functionality changes attendee order (ascending)', async () => {
    renderEventAttendance();

    await waitFor(() =>
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument(),
    );

    const sortDropdown = screen.getByTestId('sort-dropdown');
    await userEvent.click(sortDropdown);

    await userEvent.click(screen.getByText('Ascending'));

    await waitFor(() => {
      const attendees = screen.getAllByTestId(/^attendee-name-/);
      expect(attendees[0]).toHaveTextContent('Bruce Garza');
    });
  });

  it('Sort functionality - descending branch is covered', async () => {
    renderEventAttendance();

    await waitFor(() => screen.getByTestId('table-header-row'));

    const sortDropdown = screen.getByTestId('sort-dropdown');
    await userEvent.click(sortDropdown);

    await userEvent.click(await screen.findByText('Descending'));

    await waitFor(() => {
      const attendees = screen.getAllByTestId(/^attendee-name-/);
      expect(attendees[0]).toHaveTextContent('Tagged Member');
    });
  });

  it('Date filter shows correct number of attendees (This Month)', async () => {
    renderEventAttendance();

    await waitFor(() =>
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument(),
    );

    const filterDropdown = screen.getByTestId('filter-dropdown');
    await userEvent.click(filterDropdown);
    await userEvent.click(screen.getByText('This Month'));

    await waitFor(() => {
      const attendees = screen.getAllByTestId(/^attendee-row-/);
      expect(attendees).toHaveLength(1); // Only Tagged Member matches current month
    });
  });

  it("Date filter - covers 'This Year' branch", async () => {
    renderEventAttendance();

    await waitFor(() => screen.getByTestId('table-header-row'));

    const filterDropdown = screen.getByTestId('filter-dropdown');
    await userEvent.click(filterDropdown);
    await userEvent.click(screen.getByText('This Year'));

    await waitFor(() => {
      const rows = screen.getAllByTestId(/^attendee-row-/);
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  it('Statistics modal opens and closes correctly', async () => {
    renderEventAttendance();

    await waitFor(() =>
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('stats-modal'));

    await waitFor(() =>
      expect(screen.getByTestId('attendance-modal')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('close-button'));

    await waitFor(() =>
      expect(screen.queryByTestId('attendance-modal')).not.toBeInTheDocument(),
    );
  });

  it('Handles members with no eventsAttended', async () => {
    renderEventAttendance();

    await waitFor(() => screen.getByTestId('table-header-row'));

    const zeroEventsCell = screen.getByTestId('attendee-events-attended-2');

    expect(zeroEventsCell).toHaveTextContent('0');
  });

  it('Covers tagsAssignedWith branch and renders all assigned tags', async () => {
    mockLazyQuery({
      loading: false,
      data: {
        event: {
          attendees: [
            {
              id: 'tagged-123',
              name: 'Tagged Member',
              emailAddress: 'tagged@example.com',
              createdAt: dayjs.utc().add(4, 'year').toISOString(),
              role: 'attendee',
              eventsAttended: [],
              tagsAssignedWith: {
                edges: [
                  { node: { name: 'Volunteer' } },
                  { node: { name: 'Coordinator' } },
                ],
              },
            },
          ],
        },
      },
    });

    renderEventAttendanceWithSpy();

    const cell = await screen.findByTestId('attendee-task-assigned-0');

    const divs = cell.querySelectorAll(':scope > div');

    expect(divs.length).toBe(2);
    expect(cell).toHaveTextContent('Volunteer');
    expect(cell).toHaveTextContent('Coordinator');
  });

  it('Covers comparison===0 path in sortAttendees', async () => {
    renderEventAttendance();

    await waitFor(() => screen.getByTestId('table-header-row'));

    fireEvent.change(screen.getByTestId('searchByName'), {
      target: { value: 'Tagged Member' },
    });

    await waitFor(() => {
      const rows = screen.getAllByTestId(/^attendee-row-/);
      expect(rows.length).toBe(1);
    });
  });

  it('shows loading state when query is loading', async () => {
    mockLazyQuery({ loading: true, data: undefined });

    renderEventAttendanceWithSpy();

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message when query errors', async () => {
    mockLazyQuery({
      loading: false,
      data: undefined,
      error: new ApolloError({ errorMessage: 'Network Error' }),
    });

    renderEventAttendanceWithSpy();

    expect(await screen.findByText('Network Error')).toBeInTheDocument();
  });

  it('renders empty state when no attendees exist', async () => {
    mockLazyQuery({
      loading: false,
      data: { event: { attendees: [] } },
    });

    renderEventAttendanceWithSpy();

    await waitFor(() =>
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument(),
    );

    expect(screen.queryAllByTestId(/^attendee-row-/)).toHaveLength(0);
  });

  it('renders Admin label for administrator role', async () => {
    mockLazyQuery({
      loading: false,
      data: {
        event: {
          attendees: [
            {
              id: 'admin1',
              name: 'Admin User',
              emailAddress: 'admin@example.com',
              createdAt: dayjs.utc().add(4, 'year').toISOString(),
              role: 'administrator',
              eventsAttended: [],
            },
          ],
        },
      },
    });

    renderEventAttendanceWithSpy();

    await waitFor(() =>
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument(),
    );

    expect(screen.getByTestId('attendee-status-0')).toHaveTextContent('Admin');
  });

  it('renders "None" when tagsAssignedWith is missing', async () => {
    mockLazyQuery({
      loading: false,
      data: {
        event: {
          attendees: [
            {
              id: 'no-tags-1',
              name: 'ZZZ User',
              emailAddress: 'notags@example.com',
              createdAt: dayjs.utc().add(4, 'year').toISOString(),
              role: 'attendee',
              eventsAttended: null,
            },
          ],
        },
      },
    });

    renderEventAttendanceWithSpy();

    const cells = await screen.findAllByTestId(/^attendee-task-assigned-/);

    cells.forEach((cell) => {
      expect(cell).toHaveTextContent('None');
    });
  });

  describe('EventAttendance CSS Tests', () => {
    it('should apply correct styles to member name links', async () => {
      renderEventAttendance();
      const memberLinks = await screen.findAllByRole('link');
      memberLinks.forEach((link) => {
        expect(link).toHaveClass(styles.membername);
      });
    });

    it('should style events attended count correctly', async () => {
      renderEventAttendance();
      const cells = await screen.findAllByTestId(/attendee-events-attended-/);
      cells.forEach((cell) => {
        expect(
          cell.querySelector(`.${styles.eventsAttended}`),
        ).toBeInTheDocument();
      });
    });

    it('should apply tooltip styles correctly', async () => {
      renderEventAttendance();

      const cells = await screen.findAllByTestId(
        /attendee-events-attended-\d+/,
      );

      for (const cell of cells) {
        await userEvent.hover(cell);
        const tooltipWrapper = await screen.findByRole('tooltip');
        expect(tooltipWrapper).toBeInTheDocument();

        const inner = tooltipWrapper.querySelector('.MuiTooltip-tooltip');

        expect(inner).toBeInTheDocument();

        expect(inner).toHaveStyle({
          backgroundColor: 'var(--bs-white)',
          fontSize: '2em',
          maxHeight: '170px',
        });

        await userEvent.unhover(cell);
      }
    });
  });
});
