import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import EventDashboard from './EventDashboard';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  queryMockWithProject,
  queryMockWithTime,
  queryMockWithoutTime,
  queryMockWithProjectAndTask,
} from './EventDashboard.mocks';

describe('Testing Event Dashboard Screen', () => {
  beforeEach(() => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000/event/event123',
      },
      writable: true,
    });
  });

  test('The page should display event details correctly and also show the time if provided', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <MockedProvider addTypename={false} mocks={queryMockWithTime}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <EventDashboard />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => expect(queryByText('Event Title')).toBeInTheDocument());

    await waitFor(() =>
      expect(queryByText('Event Description')).toBeInTheDocument()
    );

    await waitFor(() => expect(queryByText('India')).toBeInTheDocument());

    // Relevant message should be shown if the projects are 0 in length
    await waitFor(() =>
      expect(
        queryByText('There are no active projects for this event!')
      ).toBeInTheDocument()
    );
  });

  test('The page should display event details correctly and should not show the time if it is null', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <MockedProvider addTypename={false} mocks={queryMockWithoutTime}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <EventDashboard />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => expect(queryByText('Event Title')).toBeInTheDocument());
  });

  test('The page should display event project details correctly when provided', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <MockedProvider addTypename={false} mocks={queryMockWithProject}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <EventDashboard />
                <ToastContainer />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => expect(queryByText('Project 1')).toBeInTheDocument());

    await waitFor(() =>
      expect(queryByText('Project Description 1')).toBeInTheDocument()
    );
  });

  test('The modals from the page should work properly', async () => {
    const { queryByRole, queryByText, getByRole } = render(
      <BrowserRouter>
        <MockedProvider addTypename={false} mocks={queryMockWithProjectAndTask}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <EventDashboard />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => expect(queryByText('Event Title')).toBeInTheDocument());

    // Edit Event Project Modal
    await waitFor(() =>
      fireEvent.click(
        getByRole('button', { name: 'addEventProject' }) as HTMLElement
      )
    );
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);

    // Edit Event Project Modal
    await waitFor(() =>
      fireEvent.click(
        getByRole('button', { name: 'editEventProject' }) as HTMLElement
      )
    );
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);

    // Delete Event Project Modal
    await waitFor(() =>
      fireEvent.click(
        getByRole('button', { name: 'deleteEventProject' }) as HTMLElement
      )
    );
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);

    // Add Task Modal
    await waitFor(() =>
      fireEvent.click(getByRole('button', { name: 'addTask' }) as HTMLElement)
    );
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);
  });
});
