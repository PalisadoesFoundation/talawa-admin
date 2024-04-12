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
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Frequency, WeekDays } from 'utils/recurrenceUtils';

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
      variables: {
        id: '1',
        title: 'Updated title',
        description: 'This is a new update',
        isPublic: false,
        recurring: false,
        isRegisterable: true,
        allDay: true,
        startDate: '2022-03-19',
        endDate: '2022-03-26',
        location: 'New Delhi',
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
      query: UPDATE_EVENT_MUTATION,
      variables: {
        id: '1',
        title: 'Updated title',
        description: 'This is a new update',
        isPublic: false,
        recurring: false,
        isRegisterable: true,
        allDay: false,
        startDate: '2022-03-19',
        endDate: '2022-03-26',
        location: 'New Delhi',
        startTime: '09:00:00Z',
        endTime: '17:00:00Z',
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
const link2 = new StaticMockLink(ERROR_MOCKS, true);

const link = new StaticMockLink(MOCKS, true);

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
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    allDay: false,
    recurring: false,
    recurrenceRule: null,
    isRecurringEventException: false,
    isPublic: false,
    isRegisterable: false,
  },
  {
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Dogs',
    eventDescription: 'This is shelter for dogs event',
    startDate: '03/19/2022',
    endDate: '03/26/2022',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
    recurring: false,
    recurrenceRule: null,
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: false,
  },
  {
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Cats',
    eventDescription: 'This is shelter for cat event',
    startDate: '19/03/2022',
    endDate: '19/03/2022',
    startTime: '2:00',
    endTime: '6:00',
    allDay: false,
    recurring: true,
    recurrenceRule: {
      recurrenceRuleString:
        'DTSTART:20220319T000000Z\nRRULE:FREQ=WEEKLY;UNTIL=20220326T000000Z;BYDAY=SA',
      startDate: '19/03/2022',
      endDate: '26/03/2022',
      frequency: Frequency.WEEKLY,
      weekDays: [WeekDays.SATURDAY],
      interval: 1,
      count: null,
      weekDayOccurenceInMonth: null,
    },
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: false,
  },
];

const renderEventListCard = (
  props: InterfaceEventListCardProps,
): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgevents/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Testing Event List Card', () => {
  const updateData = {
    title: 'Updated title',
    description: 'This is a new update',
    isPublic: true,
    recurring: false,
    isRegisterable: true,
    allDay: false,
    location: 'New Delhi',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
  };

  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));

    Object.defineProperty(window, 'location', {
      value: {
        reload: jest.fn(),
      },
      writable: true,
    });
  });

  afterAll(() => {
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
              startDate="19/03/2022"
              endDate="26/03/2022"
              startTime="02:00"
              endTime="06:00"
              allDay={true}
              recurring={false}
              recurrenceRule={null}
              isRecurringEventException={false}
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

  test('Testing event preview modal', async () => {
    renderEventListCard(props[1]);
    expect(screen.getByText(props[1].eventName)).toBeInTheDocument();
  });

  test('should render props and text elements test for the screen', async () => {
    const { container } = renderEventListCard(props[1]);

    expect(container.textContent).not.toBe('Loading data...');
    expect(screen.getByText(props[1].eventName)).toBeInTheDocument();
    userEvent.click(screen.getByTestId('card'));
    expect(await screen.findAllByText(props[1].eventName)).toBeTruthy();
    expect(screen.getByText(props[1].eventDescription)).toBeInTheDocument();
    expect(screen.getByText(props[1].eventLocation)).toBeInTheDocument();
  });

  test('Testing for update modal', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('editEventModalBtn'));
    userEvent.click(screen.getByTestId('EventUpdateModalCloseBtn'));
    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
  });

  test('Testing event update functionality', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('editEventModalBtn'));

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    userEvent.type(eventTitle, updateData.title);

    const eventDescription = screen.getByTestId('updateDescription');
    fireEvent.change(eventDescription, { target: { value: '' } });
    userEvent.type(eventDescription, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    userEvent.type(eventLocation, updateData.location);

    userEvent.click(screen.getByTestId('updateIsPublic'));
    userEvent.click(screen.getByTestId('updateRegistrable'));

    userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventUpdated);
    });
  });

  test('Testing if the event is not for all day', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('editEventModalBtn'));

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    userEvent.type(eventTitle, updateData.title);

    const eventDescription = screen.getByTestId('updateDescription');
    fireEvent.change(eventDescription, { target: { value: '' } });
    userEvent.type(eventDescription, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    userEvent.type(eventLocation, updateData.location);

    userEvent.click(screen.getByTestId('updateAllDay'));

    const startTimePicker = screen.getByLabelText(translations.startTime);
    const endTimePicker = screen.getByLabelText(translations.endTime);

    fireEvent.change(startTimePicker, {
      target: { value: updateData.startTime },
    });

    fireEvent.change(endTimePicker, {
      target: { value: updateData.endTime },
    });

    userEvent.click(screen.getByTestId('updateIsPublic'));
    userEvent.click(screen.getByTestId('updateRegistrable'));

    userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventUpdated);
    });
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

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventDeleted);
    });
  });

  test('should show an error toast when the delete event mutation fails', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <MemoryRouter initialEntries={['/orgevents/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));
    userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('Should render truncated event name when length is more than 100', async () => {
    const longEventName = 'a'.repeat(101);
    renderEventListCard({ ...props[1], eventName: longEventName });

    userEvent.click(screen.getByTestId('card'));

    expect(
      screen.getByText(`${longEventName.substring(0, 100)}...`),
    ).toBeInTheDocument();
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

    expect(
      screen.getByText(`${longEventDescription.substring(0, 256)}...`),
    ).toBeInTheDocument();
  });

  test('Should render full event description when length is less than or equal to 256', async () => {
    const shortEventDescription = 'a'.repeat(256);
    renderEventListCard({
      ...props[1],
      eventDescription: shortEventDescription,
    });

    userEvent.click(screen.getByTestId('card'));

    expect(screen.getByText(shortEventDescription)).toBeInTheDocument();
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
});
