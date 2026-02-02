import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  },
}));

const { setItem, clearAllItems } = useLocalStorage();

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
  clearAllItems();
  vi.clearAllMocks();
});

describe('Testing Event Card In User portal', () => {
  const props = {
    id: '123',
    name: 'Test Event',
    description: 'This is a test event',
    location: 'Virtual',
    // Use dynamic dates to avoid test staleness
    startAt: dayjs.utc().add(10, 'days').toISOString(),
    endAt: dayjs.utc().add(12, 'days').toISOString(),
    isRegisterable: true,
    isInviteOnly: false,
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

  it('shows loading spinner when registration is in flight', async () => {
    const user = userEvent.setup();
    const delayedMocks = [
      {
        request: {
          query: REGISTER_EVENT,
          variables: { id: '123' },
        },
        result: {
          data: {
            registerForEvent: [{ _id: '123' }],
          },
        },
        delay: 500,
      },
    ];

    render(
      <MockedProvider mocks={delayedMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const registerBtn = screen.getByText('Register');
    await user.click(registerBtn);

    expect(screen.getByTestId('loadingIcon')).toBeInTheDocument();
  });

  it('When the user is already registered', async () => {
    setItem('userId', '234');
    const { queryByText } = render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
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
    const toastSuccessSpy = vi.spyOn(NotificationToast, 'success');
    setItem('userId', '456');
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByText('Register'));
    await waitFor(() =>
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Successfully registered for Test Event',
      ),
    );
  });

  it('should display an error toast when the register mutation fails', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
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
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByText('Register'));

    await waitFor(() =>
      expect(toastErrorSpy).toHaveBeenCalledWith(
        'Failed to register for the event',
      ),
    );
  });

  it('should display "Invite Only" badge and disable registration when isInviteOnly is true', () => {
    const inviteOnlyProps = { ...props, isInviteOnly: true };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventCard {...inviteOnlyProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const inviteOnlyButton = screen.getByText('Invite Only');
    expect(inviteOnlyButton).toBeInTheDocument();
    expect(inviteOnlyButton.closest('button')).toBeDisabled();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('should set aria-label with event name for accessibility', () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const eventCard = screen.getByTestId('event-card');
    expect(eventCard).toHaveAttribute(
      'aria-label',
      `Event card for ${props.name}`,
    );
  });

  it('should handle combined scenario with isPublic: false and isInviteOnly: true', () => {
    const combinedProps = { ...props, isPublic: false, isInviteOnly: true };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventCard {...combinedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const inviteOnlyButton = screen.getByText('Invite Only');
    expect(inviteOnlyButton).toBeInTheDocument();
    expect(inviteOnlyButton.closest('button')).toBeDisabled();
  });
});

describe('Event card when start and end time are not given', () => {
  // Props with empty startTime and endTime to test all-day events
  const props = {
    id: '123',
    name: 'Test Event',
    description: 'This is a test event',
    location: 'Virtual',
    // Use dynamic dates to avoid test staleness
    startAt: dayjs.utc().add(10, 'days').startOf('day').toISOString(),
    endAt: dayjs.utc().add(12, 'days').endOf('day').toISOString(),
    isRegisterable: true,
    isInviteOnly: false,
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

  it('Card is rendered correctly without start and end times', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify event name is displayed
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    // Verify times are not displayed when empty
    expect(screen.queryByTestId('startTime')).not.toBeInTheDocument();
    expect(screen.queryByTestId('endTime')).not.toBeInTheDocument();
  });
});
