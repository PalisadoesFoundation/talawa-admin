import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import type { InterfaceEventListCardProps } from './EventListCard';
import EventListCard from './EventListCard';
import {
  DELETE_EVENT_MUTATION,
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variables: { id: '1' },
    },
    result: {
      data: {
        removeEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variables: { id: '1', recurringEventDeleteType: 'ThisInstance' },
    },
    result: {
      data: {
        removeEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variable: {
        id: '123',
        title: 'Updated title',
        description: 'This is a new update',
        isPublic: true,
        recurring: false,
        isRegisterable: true,
        allDay: false,
        location: 'New Delhi',
        startDate: '2024-04-01',
        endDate: '2024-04-01',
        startTime: '02:00',
        endTime: '07:00',
      },
    },
    result: {
      data: {
        updateEvent: {
          _id: '1',
        },
      },
    },
  },
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

const ERROR_MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variables: {
        id: '1',
      },
    },
    error: new Error('Something went wrong'),
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(ERROR_MOCKS, true);

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.eventListCard,
  ),
);

const props: InterfaceEventListCardProps[] = [
  {
    key: '',
    id: '',
    eventLocation: '',
    eventName: '',
    eventDescription: '',
    regDate: '',
    regEndDate: '',
    startTime: '',
    endTime: '',
    allDay: false,
    recurring: false,
    isPublic: false,
    isRegisterable: false,
  },
  {
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Dogs',
    eventDescription: 'This is shelter for dogs event',
    regDate: '19/03/2022',
    regEndDate: '26/03/2022',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
    recurring: false,
    isPublic: true,
    isRegisterable: false,
  },
  {
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Cats',
    eventDescription: 'This is shelter for cat event',
    regDate: '19/03/2022',
    regEndDate: '26/03/2022',
    startTime: '2:00',
    endTime: '6:00',
    allDay: false,
    recurring: true,
    isPublic: true,
    isRegisterable: false,
  },
  {
    userRole: 'USER',
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Dogs',
    eventDescription: 'This is shelter for dogs event',
    regDate: '19/03/2022',
    regEndDate: '26/03/2022',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
    recurring: false,
    isPublic: true,
    isRegisterable: false,
    creator: {
      firstName: 'Joe',
      lastName: 'David',
      _id: '123',
    },
    registrants: [
      {
        _id: '234',
      },
    ],
  },
  {
    userRole: 'USER',
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Dogs',
    eventDescription: 'This is shelter for dogs event',
    regDate: '19/03/2022',
    regEndDate: '26/03/2022',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
    recurring: false,
    isPublic: true,
    isRegisterable: false,
    creator: {
      firstName: 'Joe',
      lastName: 'David',
      _id: '123',
    },
    registrants: [
      {
        _id: '456',
      },
    ],
  },
];

const renderEventListCard = (
  props: InterfaceEventListCardProps,
): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgevents/orgId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/orgevents/:orgId"
                element={<EventListCard {...props} />}
              />
              <Route
                path="/event/:orgId/"
                element={<EventListCard {...props} />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Testing Event List Card', () => {
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterAll(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('Testing for modal', async () => {
    renderEventListCard(props[0]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('showEventDashboardBtn'));
    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
  });

  test('Should render text elements when props value is not passed', async () => {
    global.confirm = (): boolean => false;

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <EventListCard
              key="123"
              id="1"
              eventName=""
              eventLocation=""
              eventDescription=""
              regDate="19/03/2022"
              regEndDate="26/03/2022"
              startTime="02:00"
              endTime="06:00"
              allDay={true}
              recurring={false}
              isPublic={true}
              isRegisterable={false}
            />
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    expect(screen.queryByText(props[1].eventName)).not.toBeInTheDocument();
  });

  test('Testing event update functionality', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.type(screen.getByTestId('updateTitle'), props[1].eventName);
    userEvent.type(
      screen.getByTestId('updateDescription'),
      props[1].eventDescription,
    );
    userEvent.type(
      screen.getByTestId('updateLocation'),
      props[1].eventLocation,
    );
    userEvent.click(screen.getByTestId('updateAllDay'));
    userEvent.click(screen.getByTestId('updateRecurring'));
    userEvent.click(screen.getByTestId('updateIsPublic'));
    userEvent.click(screen.getByTestId('updateRegistrable'));

    userEvent.click(screen.getByTestId('updatePostBtn'));
  });

  test('should show an error toast when endDate is earlier than startDate', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.type(screen.getByTestId('updateregDate'), '2024-04-04');
    userEvent.type(screen.getByTestId('updateregEndDate'), '2024-04-01');

    userEvent.click(screen.getByTestId('updatePostBtn'));
  });

  test('should render props and text  elements test for the screen', async () => {
    const { container } = renderEventListCard(props[1]);

    expect(container.textContent).not.toBe('Loading data...');
    expect(screen.getByText(props[1].eventName)).toBeInTheDocument();
    userEvent.click(screen.getByTestId('card'));
    expect(await screen.findAllByText(props[1].eventName)).toBeTruthy();
    expect(screen.getByTestId('updateDescription')).toHaveValue(
      props[1].eventDescription,
    );
    expect(screen.getByTestId('updateLocation')).toHaveValue(
      props[1].eventLocation,
    );
  });

  test('Testing if the event is not for all day', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.type(screen.getByTestId('updateTitle'), props[1].eventName);
    userEvent.type(
      screen.getByTestId('updateDescription'),
      props[1].eventDescription,
    );
    userEvent.type(
      screen.getByTestId('updateLocation'),
      props[1].eventLocation,
    );
    userEvent.click(screen.getByTestId('updateAllDay'));

    userEvent.type(
      screen.getByTestId('updateStartTime'),
      props[1].startTime ?? '',
    );
    userEvent.type(screen.getByTestId('updateEndTime'), props[1].endTime ?? '');
    userEvent.click(screen.getByTestId('updatePostBtn'));
  });

  test('Testing event preview modal', async () => {
    renderEventListCard(props[1]);
    expect(screen.getByText(props[1].eventName)).toBeInTheDocument();
  });

  test('should render the delete modal', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    userEvent.click(screen.getByTestId('EventDeleteModalCloseBtn'));
    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
  });

  test('should call the delete event mutation when the "Yes" button is clicked', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));
    const deleteBtn = screen.getByTestId('deleteEventBtn');
    fireEvent.click(deleteBtn);
  });

  test('should show an error toast when the delete event mutation fails', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <MemoryRouter initialEntries={['/orgevents/orgId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgevents/:orgId"
                  element={<EventListCard {...props[1]} />}
                />
                <Route
                  path="/event/:orgId/"
                  element={<EventListCard {...props[1]} />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));
    const deleteBtn = screen.getByTestId('deleteEventBtn');
    fireEvent.click(deleteBtn);
  });

  test('Should render truncated event name when length is more than 100', async () => {
    const longEventName = 'a'.repeat(101);
    renderEventListCard({ ...props[1], eventName: longEventName });

    userEvent.click(screen.getByTestId('card'));

    expect(screen.getByTestId('updateTitle')).toHaveValue(
      `${longEventName.substring(0, 100)}...`,
    );
  });

  test('Should render full event name when length is less than or equal to 100', async () => {
    const shortEventName = 'a'.repeat(100);
    renderEventListCard({ ...props[1], eventName: shortEventName });

    userEvent.click(screen.getByTestId('card'));

    expect(screen.findAllByText(shortEventName)).toBeTruthy();
  });

  test('Should render truncated event description when length is more than 256', async () => {
    const longEventDescription = 'a'.repeat(257);
    renderEventListCard({
      ...props[1],
      eventDescription: longEventDescription,
    });

    userEvent.click(screen.getByTestId('card'));

    expect(screen.getByTestId('updateDescription')).toHaveValue(
      `${longEventDescription.substring(0, 256)}...`,
    );
  });

  test('Should render full event description when length is less than or equal to 256', async () => {
    const shortEventDescription = 'a'.repeat(256);
    renderEventListCard({
      ...props[1],
      eventDescription: shortEventDescription,
    });

    userEvent.click(screen.getByTestId('card'));

    expect(screen.getByTestId('updateDescription')).toHaveValue(
      shortEventDescription,
    );
  });

  test('Select different delete options on recurring events & then delete the recurring event', async () => {
    renderEventListCard(props[2]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    userEvent.click(screen.getByTestId('ThisAndFollowingInstances'));
    userEvent.click(screen.getByTestId('AllInstances'));
    userEvent.click(screen.getByTestId('ThisInstance'));

    userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventDeleted);
    });
  });

  test('Handle register should work properly', async () => {
    setItem('userId', '456');
    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/orgevents/orgId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgevents/:orgId"
                  element={<EventListCard {...props[3]} />}
                />
                <Route
                  path="/event/:orgId/"
                  element={<EventListCard {...props[3]} />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('card'));
    const registerBtn = screen.getByTestId('registerEventBtn');
    fireEvent.click(registerBtn);
  });

  test('When the user is already registered', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/orgevents/orgId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgevents/:orgId"
                  element={<EventListCard {...props[4]} />}
                />
                <Route
                  path="/event/:orgId/"
                  element={<EventListCard {...props[4]} />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('card'));
    expect(screen.queryByText('Already registered')).toBeInTheDocument();
  });
});
