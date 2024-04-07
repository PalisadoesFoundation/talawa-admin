import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, act } from '@testing-library/react';
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
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ eventId: mockID }),
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
  test('The page should display event details correctly and also show the time if provided', async () => {
    const { queryByText, queryAllByText } = renderEventDashboard(mockWithTime);

    await wait();

    expect(queryAllByText('Event Title').length).toBe(1);
    expect(queryAllByText('Event Description').length).toBe(1);
    expect(queryByText('India')).toBeInTheDocument();

    await wait();
  });

  test('The page should display event details correctly and should not show the time if it is null', async () => {
    const { queryAllByText } = renderEventDashboard(mockWithoutTime);
    await wait();
    expect(queryAllByText('Event Title').length).toBe(1);
  });
});
