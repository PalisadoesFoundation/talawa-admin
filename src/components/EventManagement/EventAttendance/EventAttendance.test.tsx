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
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import EventAttendance from './EventAttendance';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import { MOCKS } from './Attendance.mocks';

const link = new StaticMockLink(MOCKS, true);

async function wait(): Promise<void> {
  await waitFor(() => {
    return Promise.resolve();
  });
}
jest.mock('react-chartjs-2', () => ({
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
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ eventId: 'event123', orgId: 'org123' }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly with table headers', async () => {
    renderEventAttendance();

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-row')).toBeInTheDocument();
      expect(screen.getByTestId('header-member-name')).toBeInTheDocument();
      expect(screen.getByTestId('header-status')).toBeInTheDocument();
    });
  });

  test('Renders attendee data correctly', async () => {
    renderEventAttendance();

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('attendee-name-0')).toBeInTheDocument();
      expect(screen.getByTestId('attendee-name-1')).toHaveTextContent(
        'Jane Smith',
      );
    });
  });

  test('Search filters attendees by name correctly', async () => {
    renderEventAttendance();

    await wait();

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'Bruce' } });

    await waitFor(() => {
      const filteredAttendee = screen.getByTestId('attendee-name-0');
      expect(filteredAttendee).toHaveTextContent('Bruce Garza');
    });
  });

  test('Sort functionality changes attendee order', async () => {
    renderEventAttendance();

    await wait();

    const sortDropdown = screen.getByTestId('sort-dropdown');
    userEvent.click(sortDropdown);
    userEvent.click(screen.getByText('Sort'));

    await waitFor(() => {
      const attendees = screen.getAllByTestId('attendee-name-0');
      expect(attendees[0]).toHaveTextContent('Bruce Garza');
    });
  });

  test('Date filter shows correct number of attendees', async () => {
    renderEventAttendance();

    await wait();

    userEvent.click(screen.getByText('Filter: All'));
    userEvent.click(screen.getByText('This Month'));

    await waitFor(() => {
      expect(screen.getByText('Attendees not Found')).toBeInTheDocument();
    });
  });
  test('Statistics modal opens and closes correctly', async () => {
    renderEventAttendance();
    await wait();

    expect(screen.queryByTestId('attendance-modal')).not.toBeInTheDocument();

    const statsButton = screen.getByTestId('stats-modal');
    userEvent.click(statsButton);

    await waitFor(() => {
      expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('close-button');
    userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('attendance-modal')).not.toBeInTheDocument();
    });
  });
});
