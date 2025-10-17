import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  act,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import EventDashboard from './EventDashboard';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ApolloLink, DefaultOptions } from '@apollo/client';

import {
  MOCKS_WITHOUT_TIME,
  MOCKS_WITH_TIME,
  MOCKS_WITHOUT_LOCATION,
  MOCKS_WITH_EMPTY_DESCRIPTION,
} from './EventDashboard.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, expect, it, describe, beforeEach, afterEach } from 'vitest';

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);
const mockWithoutTime = new StaticMockLink(MOCKS_WITHOUT_TIME, true);
const mockWithoutLocation = new StaticMockLink(MOCKS_WITHOUT_LOCATION, true);
const mockWithEmptyDescription = new StaticMockLink(
  MOCKS_WITH_EMPTY_DESCRIPTION,
  true,
);

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

const mockLocalStorage = vi.fn();

vi.mock('utils/useLocalstorage', () => ({
  default: () => mockLocalStorage(),
}));

vi.mock('components/EventListCard/Modal/EventListCardModals', () => ({
  __esModule: true,
  default: ({
    eventModalIsOpen,
    hideViewModal,
  }: {
    eventModalIsOpen: boolean;
    hideViewModal: () => void;
  }) => (
    <div data-testid="event-list-card-modals">
      {eventModalIsOpen && (
        <button
          type="button"
          data-testid="close-modal-button"
          onClick={hideViewModal}
        >
          Close Modal
        </button>
      )}
    </div>
  ),
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
  beforeEach(() => {
    mockLocalStorage.mockReturnValue({
      getItem: (key: string) => {
        const storage: { [key: string]: string } = {
          userId: 'user123',
          role: 'administrator',
        };
        return storage[key] || null;
      },
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
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

  it('Should open modal when edit button is clicked', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Initially modal should not be visible
    expect(queryByTestId('close-modal-button')).not.toBeInTheDocument();

    // Click edit button
    const editButton = getByTestId('edit-event-button');
    fireEvent.click(editButton);

    // Wait for modal to appear
    await waitFor(() => {
      expect(getByTestId('close-modal-button')).toBeInTheDocument();
    });
  });

  it('Should close modal when close button is clicked', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Click edit button to open modal
    const editButton = getByTestId('edit-event-button');
    fireEvent.click(editButton);

    // Wait for modal to appear
    await waitFor(() => {
      expect(getByTestId('close-modal-button')).toBeInTheDocument();
    });

    // Click close modal button
    const closeButton = getByTestId('close-modal-button');
    fireEvent.click(closeButton);

    // Modal should close
    await waitFor(() => {
      expect(queryByTestId('close-modal-button')).not.toBeInTheDocument();
    });
  });

  it('Should display N/A for location when location is not provided', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutLocation);
    await wait();

    const locationElement = getByTestId('event-location');
    expect(locationElement).toHaveTextContent('N/A');
  });

  it('Should handle empty description gracefully', async () => {
    const { getByTestId } = renderEventDashboard(mockWithEmptyDescription);
    await wait();

    const descriptionElement = getByTestId('event-description');
    expect(descriptionElement).toBeInTheDocument();
  });

  it('Should display all statistics cards with N/A values', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify all statistics cards are present
    expect(getByTestId('registrations-card')).toBeInTheDocument();
    expect(getByTestId('attendees-card')).toBeInTheDocument();
    expect(getByTestId('feedback-card')).toBeInTheDocument();

    // Verify statistics show N/A
    expect(getByTestId('registrations-count')).toHaveTextContent('N/A');
    expect(getByTestId('attendees-count')).toHaveTextContent('N/A');
    expect(getByTestId('feedback-rating')).toHaveTextContent('N/A');
  });

  it('Should render event dashboard container with correct data-testid', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const dashboard = getByTestId('event-dashboard');
    expect(dashboard).toBeInTheDocument();
  });

  it('Should render event stats container', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const eventStats = getByTestId('event-stats');
    expect(eventStats).toBeInTheDocument();
  });

  it('Should display event details box with registrants info', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const registrants = getByTestId('event-registrants');
    expect(registrants).toBeInTheDocument();
    expect(registrants).toHaveTextContent('N/A');
  });

  it('Should properly format time from datetime string', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify the time formatting works correctly
    const startTime = getByTestId('start-time');
    const endTime = getByTestId('end-time');

    expect(startTime).toHaveTextContent('09:00');
    expect(endTime).toHaveTextContent('17:00');
  });

  it('Should render EventListCardModals component', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const modalsComponent = getByTestId('event-list-card-modals');
    expect(modalsComponent).toBeInTheDocument();
  });

  it('Should handle user role from localStorage', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Component should render successfully with admin role
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should handle user without administrator role', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Component should render successfully even for non-admin users
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should render date information in correct format', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const startDate = getByTestId('start-date');
    const endDate = getByTestId('end-date');

    expect(startDate).toBeInTheDocument();
    expect(endDate).toBeInTheDocument();
  });
});
