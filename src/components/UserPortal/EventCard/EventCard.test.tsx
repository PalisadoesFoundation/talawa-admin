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
<<<<<<< HEAD
import { debug } from 'jest-preview';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

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
<<<<<<< HEAD
    endTime: '19:49:12',
    startTime: '17:49:12',
=======
    endTime: '19:49:12Z',
    startTime: '17:49:12Z',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
    );
    debug();
    await waitFor(() => expect(queryByText('Test Event')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText('This is a test event')).toBeInTheDocument(),
=======
      </MockedProvider>
    );
    await waitFor(() => expect(queryByText('Test Event')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText('This is a test event')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    await waitFor(() => expect(queryByText('Location')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('Virtual')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('Starts')).toBeInTheDocument());
<<<<<<< HEAD
    await waitFor(() =>
      expect(screen.getByTestId('startTime')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(queryByText(`13 April '23`)).toBeInTheDocument(),
    );
    await waitFor(() => expect(queryByText('Ends')).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByTestId('endTime')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(queryByText(`15 April '23`)).toBeInTheDocument(),
=======
    await waitFor(() => expect(queryByText('5:49:12 PM')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText(`13 April '23`)).toBeInTheDocument()
    );
    await waitFor(() => expect(queryByText('Ends')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('7:49:12 PM')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText(`15 April '23`)).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    await waitFor(() => expect(queryByText('Creator')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('Joe David')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('Register')).toBeInTheDocument());
  });

  test('When the user is already registered', async () => {
<<<<<<< HEAD
    setItem('userId', '234');
=======
    localStorage.setItem('userId', '234');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
    );
    await waitFor(() =>
      expect(queryByText('Already registered')).toBeInTheDocument(),
=======
      </MockedProvider>
    );
    await waitFor(() =>
      expect(queryByText('Already registered')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });

  test('Handle register should work properly', async () => {
<<<<<<< HEAD
    setItem('userId', '456');
=======
    localStorage.setItem('userId', '456');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    userEvent.click(screen.getByText('Register'));
    await waitFor(() =>
      expect(
<<<<<<< HEAD
        queryByText('Successfully registered for Test Event'),
      ).toBeInTheDocument(),
=======
        queryByText('Successfully registered for Test Event')
      ).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(container.querySelector(':empty')).toBeInTheDocument(),
=======
      </MockedProvider>
    );

    await waitFor(() =>
      expect(container.querySelector(':empty')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });
});
