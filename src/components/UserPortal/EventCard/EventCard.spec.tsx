import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import i18nForTest from 'utils/i18nForTest';
import translation from '../../../../public/locales/en/translation.json';
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
        error: new Error(translation.userEventCard.failedToRegister),
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

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        translation.userEventCard.failedToRegister,
      );
    });
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

  it('should not show success toast when register mutation returns no data', async () => {
    const toastSuccessSpy = vi.spyOn(NotificationToast, 'success');
    setItem('userId', '456');

    const nullDataMocks = [
      {
        request: {
          query: REGISTER_EVENT,
          variables: { id: '123' },
        },
        result: { data: null },
      },
    ];

    const nullDataLink = new StaticMockLink(nullDataMocks, true);

    render(
      <MockedProvider link={nullDataLink}>
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

    // Wait for mutation to complete
    await waitFor(() => {
      // Toast should NOT have been called since data is null
      expect(toastSuccessSpy).not.toHaveBeenCalled();
    });
  });
});

describe('Event card when start and end time are not given', () => {
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

  it('Card is rendered correctly', async () => {
    const { container } = render(
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
      expect(container.querySelector(':empty')).toBeInTheDocument(),
    );
  });
});
