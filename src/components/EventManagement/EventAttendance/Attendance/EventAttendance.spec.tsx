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
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import { MOCKS } from '../EventAttendanceMocks';
import { vi, describe, beforeEach, afterEach, expect, it } from 'vitest';
import styles from 'style/app-fixed.module.css';

const link = new StaticMockLink(MOCKS, true);

async function wait(): Promise<void> {
  await waitFor(() => {
    return Promise.resolve();
  });
}
vi.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar: () => null,
  Pie: () => null,
}));

const renderEventAttendance = (): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
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
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('Component loads correctly with table headers', async () => {
    renderEventAttendance();

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument();
      expect(screen.getByTestId('header-member-name')).toBeInTheDocument();
      expect(screen.getByTestId('header-status')).toBeInTheDocument();
    });
  });

  it('Renders attendee data correctly', async () => {
    renderEventAttendance();

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('attendee-name-0')).toBeInTheDocument();
      expect(screen.getByTestId('attendee-name-1')).toHaveTextContent(
        'Jane Smith',
      );
    });
  });

  it('Search filters attendees by name correctly', async () => {
    renderEventAttendance();

    await wait();

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'Bruce' } });

    await waitFor(() => {
      const filteredAttendee = screen.getByTestId('attendee-name-0');
      expect(filteredAttendee).toHaveTextContent('Bruce Garza');
    });
  });

  it('Sort functionality changes attendee order', async () => {
    renderEventAttendance();

    await wait();

    const sortDropdown = screen.getByTestId('sort-dropdown');
    await userEvent.click(sortDropdown); // Open the sort dropdown

    const sortOption = screen.getByText('Ascending'); // Assuming 'Ascending' is the option you choose for sorting
    await userEvent.click(sortOption);

    await waitFor(() => {
      const attendees = screen.getAllByTestId('attendee-name-0');
      // Check if the first attendee is 'Bruce Garza' after sorting
      expect(attendees[0]).toHaveTextContent('Bruce Garza');
    });
  });

  it('Date filter shows correct number of attendees', async () => {
    renderEventAttendance();

    await wait();

    const filterDropdown = screen.getByTestId('filter-dropdown');
    await userEvent.click(filterDropdown); // Open the filter dropdown

    const filterOption = screen.getByText('This Month'); // Assuming 'This Month' is the option you choose for filtering
    await userEvent.click(filterOption);

    await waitFor(() => {
      // Check if the message 'Attendees not Found' is displayed
      expect(screen.getByText('Attendees not Found')).toBeInTheDocument();
    });
  });
  it('Statistics modal opens and closes correctly', async () => {
    renderEventAttendance();
    await wait();

    expect(screen.queryByTestId('attendance-modal')).not.toBeInTheDocument();

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
});

describe('EventAttendance CSS Tests', () => {
  const renderEventAttendance = (): RenderResult => {
    return render(
      <MockedProvider addTypename={false} link={link}>
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

  beforeEach(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should apply correct styles to member name links', async () => {
    renderEventAttendance();
    const memberLinks = await screen.findAllByRole('link');
    memberLinks.forEach((link) => {
      expect(link).toHaveClass(styles.membername);
    });
  });

  it('should style events attended count correctly', async () => {
    renderEventAttendance();
    const eventsAttendedCells = await screen.findAllByTestId(
      /attendee-events-attended-\d+/,
    );
    eventsAttendedCells.forEach((cell) => {
      const countSpan = cell.querySelector(`.${styles.eventsAttended}`);
      expect(countSpan).toBeInTheDocument();
    });
  });

  it('should maintain consistent row spacing in table body', async () => {
    renderEventAttendance();

    const tableRows = await screen.findAllByTestId(/attendee-row-\d+/);
    tableRows.forEach((row) => {
      expect(row).toHaveClass('my-6');
    });
  });

  it('should apply tooltip styles correctly', async () => {
    renderEventAttendance();
    const tooltipCells = await screen.findAllByTestId(
      /attendee-events-attended-\d+/,
    );
    tooltipCells.forEach((cell) => {
      const tooltip = cell.closest('[role="tooltip"]');
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
