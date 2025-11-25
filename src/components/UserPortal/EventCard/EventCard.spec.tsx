import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import i18nForTest from 'utils/i18nForTest';
import EventCard from './EventCard';
import { render, screen, waitFor } from '@testing-library/react';
import { REGISTER_EVENT } from 'GraphQl/Mutations/EventMutations';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, it } from 'vitest';

const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: REGISTER_EVENT,
      variables: { id: '123' },
    },
    result: {
      data: {
        registerForEvent: [
          {
            _id: '123',
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('Testing Event Card In User portal', () => {
  const props = {
    id: '123',
    name: 'Test Event',
    description: 'This is a test event',
    location: 'Virtual',
    startAt: '2023-04-13T17:49:12Z',
    endAt: '2023-04-15T19:49:12Z',
    isRegisterable: true,
    isPublic: true,
    endTime: '19:49:12',
    startTime: '17:49:12',
    recurring: false,
    allDay: true,
    creator: {
      id: '123',
      name: 'Joe David',
      emailAddress: 'joe@example.com',
    },
    attendees: [
      {
        id: '234',
        name: 'Attendee 1',
        emailAddress: 'attendee1@example.com',
      },
    ],
    recurrenceRule: null,
    isRecurringEventException: false,
  };

  it('When the user is already registered', async () => {
    setItem('userId', '234');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await waitFor(() =>
      expect(queryByText('Already registered')).toBeInTheDocument(),
    );
  });

  it('Handle register should work properly', async () => {
    setItem('userId', '456');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByText('Register'));
    await waitFor(() =>
      expect(
        queryByText('Successfully registered for Test Event'),
      ).toBeInTheDocument(),
    );
  });

  it('should display an error toast when the register mutation fails', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const errorMocks = [
      {
        request: {
          query: REGISTER_EVENT,
          variables: { id: '123' },
        },
        error: new Error('Failed to register for the event'),
      },
    ];

    const errorLink = new StaticMockLink(errorMocks, true);

    render(
      <MockedProvider addTypename={false} link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        `Failed to register for the event`,
      );
    });
  });
});

describe('Event card when start and end time are not given', () => {
  const props = {
    id: '123',
    name: 'Test Event',
    description: 'This is a test event',
    location: 'Virtual',
    startAt: '2023-04-13T00:00:00Z',
    endAt: '2023-04-15T23:59:59Z',
    isRegisterable: true,
    isPublic: true,
    endTime: '',
    startTime: '',
    recurring: false,
    allDay: true,
    creator: {
      id: '123',
      name: 'Joe David',
      emailAddress: 'joe@example.com',
    },
    attendees: [
      {
        id: '234',
        name: 'Attendee 1',
        emailAddress: 'attendee1@example.com',
      },
    ],
    recurrenceRule: null,
    isRecurringEventException: false,
  };

  it('Card is rendered correctly', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(container.querySelector(':empty')).toBeInTheDocument(),
    );
  });
});
