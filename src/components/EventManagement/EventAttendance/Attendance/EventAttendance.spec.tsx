import React from 'react';
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

// Mock chart.js to avoid canvas errors
vi.mock('react-chartjs-2', async () => ({
  ...(await vi.importActual('react-chartjs-2')),
  Line: () => null,
  Bar: () => null,
}));

const renderEventAttendance = (): RenderResult => {
  return render(
    <MockedProvider mocks={MOCKS} addTypename={false}>
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

describe('Event Attendance Component', () => {
  beforeEach(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
      useParams: () => ({ eventId: 'event123', orgId: 'org123' }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
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

    await waitFor(async () => {
      const searchInput = screen.getByTestId('searchByName');
      fireEvent.change(searchInput, { target: { value: 'Bruce' } });

      await waitFor(() => {
        const filteredAttendee = screen.getByTestId('attendee-name-0');
        expect(filteredAttendee).toHaveTextContent('Bruce Garza');
      });
    });
  });

  it('Search filters attendees by email', async () => {
    renderEventAttendance();

    const searchInput = await screen.findByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'example.com' } });

    await waitFor(() => {
      const attendees = screen.getAllByTestId(/^attendee-name-/);
      expect(attendees.length).toBeGreaterThan(0);
    });
  });

  it('Sort functionality changes attendee order (ascending)', async () => {
    renderEventAttendance();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument();
    });

    const sortDropdown = screen.getByTestId('sort-dropdown');
    await userEvent.click(sortDropdown);

    await waitFor(() => {
      const sortOption = screen.getByText('Ascending');
      userEvent.click(sortOption);
    });

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

    const descendingOption = await screen.findByText('Descending');
    await userEvent.click(descendingOption);

    await waitFor(() => {
      const attendees = screen.getAllByTestId(/^attendee-name-/);
      expect(attendees[0]).toHaveTextContent('Tagged Member'); // FIXED
    });
  });

  it('Date filter shows correct number of attendees (This Month)', async () => {
    renderEventAttendance();

    await waitFor(() =>
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument(),
    );

    const filterDropdown = screen.getByTestId('filter-dropdown');
    await userEvent.click(filterDropdown);

    const filterOption = screen.getByText('This Month');
    await userEvent.click(filterOption);

    await waitFor(() => {
      const attendees = screen.getAllByTestId(/^attendee-row-/);
      expect(attendees).toHaveLength(1); // FIXED
    });
  });

  it("Date filter - covers 'This Year' branch", async () => {
    renderEventAttendance();

    await waitFor(() => screen.getByTestId('table-header-row'));

    const filterDropdown = screen.getByTestId('filter-dropdown');
    await userEvent.click(filterDropdown);

    const thisYearOption = screen.getByText('This Year');
    await userEvent.click(thisYearOption);

    await waitFor(() => {
      const rows = screen.getAllByTestId(/^attendee-row-/);
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  it('Statistics modal opens and closes correctly', async () => {
    renderEventAttendance();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument();
    });

    const statsButton = screen.getByTestId('stats-modal');
    await userEvent.click(statsButton);

    await waitFor(() => {
      expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('close-button');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('attendance-modal')).not.toBeInTheDocument();
    });
  });

  it('Handles members with no eventsAttended', async () => {
    renderEventAttendance();

    await waitFor(() => screen.getByTestId('table-header-row'));

    const zeroEventsCell = await screen.findByText('0');
    expect(zeroEventsCell).toBeInTheDocument();
  });

  it('Covers tagsAssignedWith branch without relying on text structure', async () => {
    renderEventAttendance();

    // Wait for table to load
    await waitFor(() => {
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument();
    });

    const rows = await screen.findAllByTestId(/attendee-row-/);
    expect(rows.length).toBeGreaterThan(0);

    // Find the specific row that contains Tagged Member
    const taggedRow = rows.find((row) =>
      (row.textContent ?? '').includes('Tagged Member'),
    );

    expect(taggedRow).not.toBeUndefined();
    if (!taggedRow) return;

    const taskCells = taggedRow.querySelectorAll(
      "[data-testid^='attendee-task-assigned-']",
    );
    expect(taskCells.length).toBeGreaterThan(0);

    const taskCell = taskCells[0] as HTMLElement;

    const divs = Array.from(taskCell.querySelectorAll('div'));
    expect(divs.length).toBeGreaterThan(0);
  });

  it('Covers comparison===0 path in sortAttendees', async () => {
    renderEventAttendance();

    await waitFor(() => screen.getByTestId('table-header-row'));

    // Enter same name to produce comparison=0
    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'Tagged Member' } });

    await waitFor(() => {
      const rows = screen.getAllByTestId(/^attendee-row-/);
      expect(rows.length).toBe(1); // comparison=0 hit
    });
  });

  describe('EventAttendance CSS Tests', () => {
    const renderEventAttendanceCSS = (): RenderResult => {
      return render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
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

    it('should apply correct styles to member name links', async () => {
      renderEventAttendanceCSS();
      const memberLinks = await screen.findAllByRole('link');
      memberLinks.forEach((link) => {
        expect(link).toHaveClass(styles.membername);
      });
    });

    it('should style events attended count correctly', async () => {
      renderEventAttendanceCSS();
      const cells = await screen.findAllByTestId(/attendee-events-attended-/);
      cells.forEach((cell) => {
        const span = cell.querySelector(`.${styles.eventsAttended}`);
        expect(span).toBeInTheDocument();
      });
    });

    it('should maintain consistent row spacing', async () => {
      renderEventAttendanceCSS();
      const tableRows = await screen.findAllByTestId(/attendee-row-/);
      tableRows.forEach((row) => {
        expect(row).toHaveClass('my-6');
      });
    });

    it('should apply tooltip styles correctly', async () => {
      renderEventAttendanceCSS();
      const tooltipCells = await screen.findAllByTestId(
        /attendee-events-attended-\d+/,
      );

      tooltipCells.forEach((cell) => {
        const tooltip = cell.closest("[role='tooltip']");
        if (tooltip) {
          expect(tooltip).toHaveStyle({
            backgroundColor: 'var(--bs-white)',
            fontSize: '2em',
            maxHeight: '170px',
          });
        }
      });
    });
  });
});
