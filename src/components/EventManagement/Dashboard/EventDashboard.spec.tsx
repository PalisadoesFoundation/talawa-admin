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
