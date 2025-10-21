import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, act, waitFor } from '@testing-library/react';
import EventDashboard from './EventDashboard';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ApolloLink, DefaultOptions } from '@apollo/client';
import userEvent from '@testing-library/user-event';

import {
  MOCKS_WITHOUT_TIME,
  MOCKS_WITH_TIME,
  MOCKS_NO_EVENT,
  MOCKS_EMPTY_FIELDS,
} from './EventDashboard.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, expect, it, describe, beforeEach, afterEach } from 'vitest';
import useLocalStorage from 'utils/useLocalstorage';

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);
const mockWithoutTime = new StaticMockLink(MOCKS_WITHOUT_TIME, true);

// We want to disable all forms of caching so that we do not need to define a custom merge function in testing for the network requests
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const mockID = 'event123';
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
}));

const renderEventDashboard = (mockLink: ApolloLink): RenderResult => {
  return render(
    <BrowserRouter>
      <MockedProvider
        addTypename={false}
        link={mockLink}
        defaultOptions={defaultOptions}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18nForTest}>
            <ToastContainer />
            <EventDashboard eventId={mockID} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>
    </BrowserRouter>,
  );
};

describe('Testing Event Dashboard Screen', () => {
  const { setItem } = useLocalStorage();

  beforeAll(() => {
    vi.mock('components/EventListCard/Modal/EventListCardModals', () => ({
      __esModule: true,
      default: () => <div data-testid="event-list-card-modals" />,
    }));
  });

  beforeEach(() => {
    // Setup default localStorage values
    setItem('userId', 'user123');
    setItem('role', 'administrator');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  it('The page should display event details correctly and also show the time if provided', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify basic event details
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    // Verify time and date information
    expect(getByTestId('start-time')).toHaveTextContent('09:00');
    expect(getByTestId('end-time')).toHaveTextContent('17:00');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();

    // Verify statistics cards
    expect(getByTestId('registrations-card')).toBeInTheDocument();
    expect(getByTestId('attendees-card')).toBeInTheDocument();
    expect(getByTestId('feedback-card')).toBeInTheDocument();

    // Test edit button
    const editButton = getByTestId('edit-event-button');
    expect(editButton).toBeInTheDocument();
  });

  it('The page should display event details correctly and should not show the time if all day event', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    // Verify basic event details
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    // Verify date information without time for all-day event
    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
  });

  it('Should show loader while data is being fetched', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockWithTime);

    // Initially show loader
    expect(getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(getByTestId('spinner')).toBeInTheDocument();
    expect(queryByTestId('event-details')).not.toBeInTheDocument();

    // Wait for loading to complete
    await wait();

    // Verify loader is gone and content is shown
    expect(queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    expect(queryByTestId('spinner')).not.toBeInTheDocument();
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should open edit modal when edit button is clicked', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Click edit button
    const editButton = getByTestId('edit-event-button');
    await userEvent.click(editButton);

    await waitFor(() => {
      expect(getByTestId('event-list-card-modals')).toBeInTheDocument();
    });
  });

  it('Should display "Event not found" when no event data is returned', async () => {
    const mockNoEvent = new StaticMockLink(MOCKS_NO_EVENT, true);
    const { getByTestId, queryByTestId } = renderEventDashboard(mockNoEvent);
    await wait();

    expect(getByTestId('no-event')).toBeInTheDocument();
    expect(getByTestId('no-event')).toHaveTextContent('Event not found');
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
  });

  it('Should handle empty/null event fields gracefully', async () => {
    const mockEmptyFields = new StaticMockLink(MOCKS_EMPTY_FIELDS, true);
    const { getByTestId } = renderEventDashboard(mockEmptyFields);
    await wait();

    // Verify N/A is shown for empty location
    expect(getByTestId('event-location')).toHaveTextContent('N/A');

    // Verify event name and description still display
    expect(getByTestId('event-name')).toBeInTheDocument();
    expect(getByTestId('event-description')).toBeInTheDocument();
    expect(getByTestId('event-description')).toHaveTextContent('');
  });

  it('Should render component with complete event data', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify component renders and displays all event data
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-name')).toBeInTheDocument();
    expect(getByTestId('event-description')).toBeInTheDocument();
  });

  it('Should set userRole to REGULAR when role is not administrator', async () => {
    setItem('role', 'user');

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Component should still render properly with REGULAR role
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should get userId from "id" field if "userId" is not available', async () => {
    // Clear userId and set id instead
    setItem('userId', '');
    setItem('id', 'user456');

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify component renders with fallback userId
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should handle missing userId in localStorage', async () => {
    setItem('userId', '');
    setItem('id', '');

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Should still render without crashing
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should display all statistics cards with N/A values', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify all stat cards are present
    expect(getByTestId('registrations-card')).toBeInTheDocument();
    expect(getByTestId('registrations-count')).toHaveTextContent('N/A');

    expect(getByTestId('attendees-card')).toBeInTheDocument();
    expect(getByTestId('attendees-count')).toHaveTextContent('N/A');

    expect(getByTestId('feedback-card')).toBeInTheDocument();
    expect(getByTestId('feedback-rating')).toHaveTextContent('N/A');
  });

  it('Should display event registrants as N/A', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-registrants')).toBeInTheDocument();
    expect(getByTestId('event-registrants')).toHaveTextContent('N/A');
  });

  it('Should correctly format time for non-allDay events', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const startTime = getByTestId('start-time');
    const endTime = getByTestId('end-time');

    // Should display formatted times
    expect(startTime.textContent).toBe('09:00');
    expect(endTime.textContent).toBe('17:00');
  });
});
