import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import i18nForTest from 'utils/i18nForTest';
import EventCard from './EventCard';
import { render, screen, waitFor } from '@testing-library/react';
import { REGISTER_EVENT } from 'GraphQl/Mutations/mutations';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: REGISTER_EVENT,
      variables: { eventId: '123' },
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
});

describe('Testing Event Card In User portal', () => {
  const props = {
    id: '123',
    title: 'Test Event',
    description: 'This is a test event',
    location: 'Virtual',
    startDate: '2023-04-13',
    endDate: '2023-04-15',
    isRegisterable: true,
    isPublic: true,
    endTime: '19:49:12Z',
    startTime: '17:49:12Z',
    recurring: false,
    allDay: true,
    creator: {
      firstName: 'Joe',
      lastName: 'David',
      id: '123',
    },
    registrants: [
      {
        id: '234',
      },
    ],
  };

  test('The card should be rendered properly, and all the details should be displayed correct', async () => {
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
      </MockedProvider>
    );
    await waitFor(() => expect(queryByText('Test Event')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText('This is a test event')).toBeInTheDocument()
    );
    await waitFor(() => expect(queryByText('Location')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('Virtual')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('Starts')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('5:49:12 PM')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText(`13 April '23`)).toBeInTheDocument()
    );
    await waitFor(() => expect(queryByText('Ends')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('7:49:12 PM')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText(`15 April '23`)).toBeInTheDocument()
    );
    await waitFor(() => expect(queryByText('Creator')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('Joe David')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('Register')).toBeInTheDocument());
  });

  test('When the user is already registered', async () => {
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
      </MockedProvider>
    );
    await waitFor(() =>
      expect(queryByText('Already registered')).toBeInTheDocument()
    );
  });

  test('Handle register should work properly', async () => {
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
      </MockedProvider>
    );
    userEvent.click(screen.getByText('Register'));
    await waitFor(() =>
      expect(
        queryByText('Successfully registered for Test Event')
      ).toBeInTheDocument()
    );
  });
});

describe('Event card when start and end time are not given', () => {
  const props = {
    id: '123',
    title: 'Test Event',
    description: 'This is a test event',
    location: 'Virtual',
    startDate: '2023-04-13',
    endDate: '2023-04-15',
    isRegisterable: true,
    isPublic: true,
    endTime: '',
    startTime: '',
    recurring: false,
    allDay: true,
    creator: {
      firstName: 'Joe',
      lastName: 'David',
      id: '123',
    },
    registrants: [
      {
        id: '234',
      },
    ],
  };

  test('Card is rendered correctly', async () => {
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
      </MockedProvider>
    );

    await waitFor(() =>
      expect(container.querySelector(':empty')).toBeInTheDocument()
    );
  });
});
