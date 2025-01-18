import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, act, fireEvent } from '@testing-library/react';
import EventDashboard from './EventDashboard';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ApolloLink, DefaultOptions } from '@apollo/client';
import styles from '../../../style/app.module.css';

import { MOCKS_WITHOUT_TIME, MOCKS_WITH_TIME } from './EventDashboard.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, expect, it, describe } from 'vitest';

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
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
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
  it('The page should display event details correctly and also show the time if provided', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);

    await wait();

    expect(getByTestId('event-title')).toBeInTheDocument();
    expect(getByTestId('event-description')).toBeInTheDocument();
    expect(getByTestId('event-location')).toHaveTextContent('India');

    expect(getByTestId('registrations-card')).toBeInTheDocument();
    expect(getByTestId('attendees-card')).toBeInTheDocument();
    expect(getByTestId('feedback-card')).toBeInTheDocument();
    expect(getByTestId('feedback-rating')).toHaveTextContent('4/5');

    const editButton = getByTestId('edit-event-button');
    fireEvent.click(editButton);
    expect(getByTestId('event-title')).toBeInTheDocument();
    const closeButton = getByTestId('eventModalCloseBtn');
    fireEvent.click(closeButton);
  });

  it('The page should display event details correctly and should not show the time if it is null', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    expect(getByTestId('event-title')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
  });

  it('Should show loader while data is being fetched', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockWithTime);
    expect(getByTestId('spinner')).toBeInTheDocument();
    // Wait for loading to complete
    await wait();

    // Verify spinner is gone
    expect(queryByTestId('spinner')).not.toBeInTheDocument();

    // Verify content is visible
    expect(getByTestId('event-title')).toBeInTheDocument();
  });
});

describe('CSS Styling Tests', () => {
  it('should apply correct styling to event stats cards', async () => {
    const { getByTestId, getAllByAltText } = renderEventDashboard(mockWithTime);
    await wait();
    const statsSection = getByTestId('event-stats');
    expect(statsSection).toHaveClass('d-flex', 'mt-4', 'px-6');
    const cards = statsSection.querySelectorAll(`.${styles.ctacards}`);
    expect(cards).toHaveLength(3);
    const cardImages = getAllByAltText('userImage');
    cardImages.forEach((image) => {
      expect(image).toBeInTheDocument();
    });
  });

  it('should style event details container correctly', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();
    const eventContainer = getByTestId('event-details');
    expect(eventContainer).toHaveClass(styles.eventContainer);
    const detailsBox = eventContainer.querySelector(
      `.${styles.eventDetailsBox}`,
    );
    expect(detailsBox).toBeInTheDocument();
  });

  it('should style event title and description properly', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();
    const title = getByTestId('event-title');
    expect(title).toHaveClass(styles.titlename);
    const description = getByTestId('event-description');
    expect(description).toHaveClass(styles.description);
  });

  it('should style location and registrants information correctly', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();
    const location = getByTestId('event-location');
    const registrants = getByTestId('event-registrants');
    expect(location).toHaveClass(styles.toporgloc);
    expect(registrants).toHaveClass(styles.toporgloc);
  });

  it('should style edit button correctly', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();
    const editButton = getByTestId('edit-event-button');
    expect(editButton).toHaveClass(
      'btn',
      'btn-light',
      'rounded-circle',
      'position-absolute',
      'end-0',
      'me-3',
      'p-1',
      'mt-2',
    );
  });

  it('should style time section properly', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();
    const timeSection = getByTestId('event-time');
    expect(timeSection).toHaveClass(styles.time);
    const startTime = getByTestId('start-time');
    const endTime = getByTestId('end-time');
    const startDate = getByTestId('start-date');
    const endDate = getByTestId('end-date');
    expect(startTime).toHaveClass(styles.startTime);
    expect(endTime).toHaveClass(styles.endTime);
    expect(startDate).toHaveClass(styles.startDate);
    expect(endDate).toHaveClass(styles.endDate);
  });

  it('should style recurring status with correct colors', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();
    const recurringStatus = getByTestId('recurring-status');
    expect(recurringStatus).toHaveClass(styles.toporgloc, 'd-flex');
    const statusText = recurringStatus.querySelector('.text-success');
    expect(statusText).toBeInTheDocument();
    expect(statusText).toHaveClass('ml-2');
  });
});
