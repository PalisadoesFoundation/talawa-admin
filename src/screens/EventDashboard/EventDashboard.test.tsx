import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import EventDashboard from './EventDashboard';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type DefaultOptions } from '@apollo/client';
import {
  queryMockWithTime,
  queryMockWithoutTime,
} from './EventDashboard.mocks';
import {
  REACT_ADMIN_FRONTEND_HOST,
  REACT_APP_CUSTOM_PORT,
} from 'Constant/constant';

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

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Jest)
// These modules are used by the Feedback components
jest.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: jest.fn(),
  PieChart: jest.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: jest.fn(),
}));

// We will wait for 500 ms after each test to ensure that the queries and rendering of the nested components such as `Feedback` and `Statistics` is complete before moving on to the next test suite
// This is important to mitigate the cleanup errors due to nesting of components
async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Event Dashboard Screen', () => {
  beforeEach(() => {
    const url = REACT_APP_CUSTOM_PORT
      ? `${REACT_ADMIN_FRONTEND_HOST}:${REACT_APP_CUSTOM_PORT}/event/event123`
      : `${REACT_ADMIN_FRONTEND_HOST}/event/event123`;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
      writable: true,
    });
  });

  test('The page should display event details correctly and also show the time if provided', async () => {
    const { queryByText, queryAllByText } = render(
      <BrowserRouter>
        <MockedProvider
          addTypename={false}
          mocks={queryMockWithTime}
          defaultOptions={defaultOptions}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ToastContainer />
            <EventDashboard />
          </LocalizationProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => expect(queryAllByText('Event Title').length).toBe(2));

    await waitFor(() =>
      expect(queryAllByText('Event Description').length).toBe(2)
    );

    await waitFor(() => expect(queryByText('India')).toBeInTheDocument());

    await wait();
  });

  test('The page should display event details correctly and should not show the time if it is null', async () => {
    const { queryAllByText } = render(
      <BrowserRouter>
        <MockedProvider
          addTypename={false}
          mocks={queryMockWithoutTime}
          defaultOptions={defaultOptions}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ToastContainer />
            <EventDashboard />
          </LocalizationProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => expect(queryAllByText('Event Title').length).toBe(2));

    await wait();
  });
});
