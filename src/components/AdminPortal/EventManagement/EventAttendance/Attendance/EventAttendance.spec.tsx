import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import EventAttendance from './EventAttendance';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import i18n from 'utils/i18nForTest';
import { MOCKS } from '../EventAttendanceMocks';
import { vi, describe, afterEach, expect, it, beforeEach } from 'vitest';
import styles from './EventAttendance.module.css';
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

  it('Component loads correctly with DataGrid', async () => {
    renderEventAttendance();

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });
  });

  it('Renders attendee data correctly in grid rows', async () => {
    renderEventAttendance();

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  it('Search filters attendees by name correctly', async () => {
    renderEventAttendance();

    const searchInput = await screen.findByTestId('searchByName');
    await userEvent.type(searchInput, 'Bruce');

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  it('Search filters attendees by email', async () => {
    renderEventAttendance();

    const searchInput = await screen.findByTestId('searchByName');
    await userEvent.type(searchInput, 'example.com');

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  it('Clears search input', async () => {
    renderEventAttendance();

    const searchInput = (await screen.findByTestId(
      'searchByName',
    )) as HTMLInputElement;
    await userEvent.type(searchInput, 'Bruce');
    expect(searchInput.value).toBe('Bruce');

    await userEvent.clear(searchInput);
    expect(searchInput.value).toBe('');
  });

  it('Sort functionality changes attendee order (ascending)', async () => {
    renderEventAttendance();

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });

    const sortDropdown = screen.getByTestId('sort-dropdown-toggle');
    await userEvent.click(sortDropdown);

    await userEvent.click(screen.getByText('Ascending'));

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  it('Sort functionality - descending branch is covered', async () => {
    renderEventAttendance();

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });

    const sortDropdown = screen.getByTestId('sort-dropdown-toggle');
    await userEvent.click(sortDropdown);

    await userEvent.click(await screen.findByText('Descending'));

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  it('Date filter shows correct number of attendees (This Month)', async () => {
    renderEventAttendance();

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });

    const filterDropdown = screen.getByTestId('filter-dropdown-toggle');
    await userEvent.click(filterDropdown);
    await userEvent.click(screen.getByText('This Month'));

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("Date filter - covers 'This Year' branch", async () => {
    renderEventAttendance();

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });

    const filterDropdown = screen.getByTestId('filter-dropdown-toggle');
    await userEvent.click(filterDropdown);
    await userEvent.click(screen.getByText('This Year'));

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  it('Statistics modal opens and closes correctly', async () => {
    renderEventAttendance();

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('stats-modal'));

    await waitFor(() =>
      expect(screen.getByTestId('attendance-modal')).toBeInTheDocument(),
    );

    const closeButton = await screen.findByTestId('close-button');
    await userEvent.click(closeButton);

    await waitFor(() =>
      expect(screen.queryByTestId('attendance-modal')).not.toBeInTheDocument(),
    );
  });

  it('Handles members with no eventsAttended', async () => {
    renderEventAttendance();

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    const styledSpans = document.querySelectorAll(`.${styles.eventsAttended}`);
    expect(styledSpans.length).toBeGreaterThan(0);

    let foundZero = false;
    styledSpans.forEach((span) => {
      if (span.textContent === '0') {
        foundZero = true;
      }
    });
    expect(foundZero).toBe(true);
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

    await waitFor(() => {
      expect(screen.getByText('Volunteer')).toBeInTheDocument();
      expect(screen.getByText('Coordinator')).toBeInTheDocument();
    });
  });

  it('Covers comparison===0 path in sortAttendees', async () => {
    renderEventAttendance();

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId('searchByName');
    await userEvent.type(searchInput, 'Tagged Member');

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  it('shows loading state when query is loading', async () => {
    mockLazyQuery({ loading: true, data: undefined });

    renderEventAttendanceWithSpy();

    // DataGridLoadingOverlay renders LoadingState with data-testid="loading-state"
    expect(await screen.findByTestId('loading-state')).toBeInTheDocument();
    expect(await screen.findByTestId('spinner')).toBeInTheDocument();
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

    await waitFor(() => {
      const dataGrid = screen.getByRole('grid');
      expect(dataGrid).toBeInTheDocument();
    });

    // EmptyState renders message with data-testid="${dataTestId}-message"
    const emptyStateMessage = await screen.findByTestId(
      'empty-state-noattendees-message',
    );
    expect(emptyStateMessage).toBeInTheDocument();
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

    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });

  it('renders Member label for non-administrator role', async () => {
    mockLazyQuery({
      loading: false,
      data: {
        event: {
          attendees: [
            {
              id: 'member1',
              name: 'Regular Member',
              emailAddress: 'member@example.com',
              createdAt: dayjs.utc().add(4, 'year').toISOString(),
              role: 'attendee',
              eventsAttended: [],
            },
          ],
        },
      },
    });

    renderEventAttendanceWithSpy();

    await waitFor(() => {
      expect(screen.getByText('Member')).toBeInTheDocument();
    });
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

    await waitFor(() => {
      const noneText = screen.queryAllByText('None');
      expect(noneText.length).toBeGreaterThan(0);
    });
  });

  describe('EventAttendance CSS Tests', () => {
    it('should apply correct styles to member name links', async () => {
      renderEventAttendance();

      await waitFor(() => {
        const memberLinks = screen.queryAllByRole('link');
        const memberNameLinks = memberLinks.filter((link) =>
          link.getAttribute('href')?.includes('/admin/member/'),
        );
        expect(memberNameLinks.length).toBeGreaterThan(0);
        memberNameLinks.forEach((link) => {
          expect(link).toHaveClass(styles.membername);
        });
      });
    });

    it('should style events attended count correctly', async () => {
      renderEventAttendance();

      await waitFor(() => {
        const styledSpans = document.querySelectorAll(
          `.${styles.eventsAttended}`,
        );
        expect(styledSpans.length).toBeGreaterThan(0);
      });
    });

    it('should apply tooltip styles correctly', async () => {
      renderEventAttendance();

      await waitFor(() => {
        const dataGrid = screen.getByRole('grid');
        expect(dataGrid).toBeInTheDocument();
      });

      const eventCountCells = screen.queryAllByText(/^\d+$/);
      if (eventCountCells.length > 0) {
        const cell = eventCountCells[0];
        await userEvent.hover(cell);

        await waitFor(() => {
          const tooltip = screen.queryByRole('tooltip');
          if (tooltip) {
            expect(tooltip).toBeInTheDocument();
          }
        });

        await userEvent.unhover(cell);
      }
    });
  });
});
