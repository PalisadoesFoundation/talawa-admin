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
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useLocalStorage from 'utils/useLocalstorage';
import { props } from './EventListCardProps';
import { ERROR_MOCKS, MOCKS } from './EventListCardMocks';

const { setItem } = useLocalStorage();

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
                <Route path="/event/:orgId/:eventId" element={<></>} />
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
    startDate: '03/18/2022',
    endDate: '03/20/2022',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
  };

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

  test('Testing for event modal', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('eventModalCloseBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Should navigate to "/" if orgId is not defined', async () => {
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

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/');
    });
  });

  test('Should render default text if event details are null', async () => {
    renderEventListCard(props[0]);

    await waitFor(() => {
      expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    });
  });

  test('should render props and text elements test for the screen', async () => {
    renderEventListCard(props[1]);

    expect(screen.getByText(props[1].eventName)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateDescription')).toBeInTheDocument();
    });

    expect(screen.getByTestId('updateDescription')).toHaveValue(
      props[1].eventDescription,
    );
    expect(screen.getByTestId('updateLocation')).toHaveValue(
      props[1].eventLocation,
    );

    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Should render truncated event name when length is more than 100', async () => {
    const longEventName = 'a'.repeat(101);
    renderEventListCard({ ...props[1], eventName: longEventName });

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateTitle')).toBeInTheDocument();
    });

    expect(screen.getByTestId('updateTitle')).toHaveValue(
      `${longEventName.substring(0, 100)}...`,
    );

    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Should render full event name when length is less than or equal to 100', async () => {
    const shortEventName = 'a'.repeat(100);
    renderEventListCard({ ...props[1], eventName: shortEventName });

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateTitle')).toBeInTheDocument();
    });

    expect(screen.getByTestId('updateTitle')).toHaveValue(shortEventName);

    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Should render truncated event description when length is more than 256', async () => {
    const longEventDescription = 'a'.repeat(257);

    renderEventListCard({
      ...props[1],
      eventDescription: longEventDescription,
    });

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateDescription')).toBeInTheDocument();
    });
    expect(screen.getByTestId('updateDescription')).toHaveValue(
      `${longEventDescription.substring(0, 256)}...`,
    );

    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Should render full event description when length is less than or equal to 256', async () => {
    const shortEventDescription = 'a'.repeat(256);

    renderEventListCard({
      ...props[1],
      eventDescription: shortEventDescription,
    });

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateDescription')).toBeInTheDocument();
    });
    expect(screen.getByTestId('updateDescription')).toHaveValue(
      shortEventDescription,
    );

    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Should navigate to event dashboard when clicked', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('showEventDashboardBtn')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('showEventDashboardBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });
  });

  test('Should update a non-recurring event', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    userEvent.type(eventTitle, updateData.title);

    const eventDescription = screen.getByTestId('updateDescription');
    fireEvent.change(eventDescription, { target: { value: '' } });
    userEvent.type(eventDescription, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    userEvent.type(eventLocation, updateData.location);

    const startDatePicker = screen.getByLabelText(translations.startDate);
    fireEvent.change(startDatePicker, {
      target: { value: updateData.startDate },
    });

    const endDatePicker = screen.getByLabelText(translations.endDate);
    fireEvent.change(endDatePicker, {
      target: { value: updateData.endDate },
    });

    userEvent.click(screen.getByTestId('updateAllDay'));
    userEvent.click(screen.getByTestId('updateIsPublic'));
    userEvent.click(screen.getByTestId('updateRegistrable'));
    userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Should update a non all day non-recurring event', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    userEvent.type(eventTitle, updateData.title);

    const eventDescription = screen.getByTestId('updateDescription');
    fireEvent.change(eventDescription, { target: { value: '' } });
    userEvent.type(eventDescription, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    userEvent.type(eventLocation, updateData.location);

    const startDatePicker = screen.getByLabelText(translations.startDate);
    fireEvent.change(startDatePicker, {
      target: { value: updateData.startDate },
    });

    const endDatePicker = screen.getByLabelText(translations.endDate);
    fireEvent.change(endDatePicker, {
      target: { value: updateData.endDate },
    });

    const startTimePicker = screen.getByLabelText(translations.startTime);
    fireEvent.change(startTimePicker, {
      target: { value: updateData.startTime },
    });

    const endTimePicker = screen.getByLabelText(translations.endTime);
    fireEvent.change(endTimePicker, {
      target: { value: updateData.endTime },
    });

    userEvent.click(screen.getByTestId('updateIsPublic'));
    userEvent.click(screen.getByTestId('updateRegistrable'));

    userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('should update a single event to be recurring', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    userEvent.type(eventTitle, updateData.title);

    const eventDescription = screen.getByTestId('updateDescription');
    fireEvent.change(eventDescription, { target: { value: '' } });
    userEvent.type(eventDescription, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    userEvent.type(eventLocation, updateData.location);

    const startDatePicker = screen.getByLabelText(translations.startDate);
    fireEvent.change(startDatePicker, {
      target: { value: updateData.startDate },
    });

    const endDatePicker = screen.getByLabelText(translations.endDate);
    fireEvent.change(endDatePicker, {
      target: { value: updateData.endDate },
    });

    userEvent.click(screen.getByTestId('updateAllDay'));
    userEvent.click(screen.getByTestId('updateRecurring'));
    userEvent.click(screen.getByTestId('updateIsPublic'));
    userEvent.click(screen.getByTestId('updateRegistrable'));
    userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('should show different update options for a recurring event based on different conditions', async () => {
    renderEventListCard(props[5]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.queryByTestId('updateEventBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateEventBtn'));

    // shows options to update thisInstance and thisAndFollowingInstances, and allInstances
    await waitFor(() => {
      expect(screen.getByTestId('update-thisInstance')).toBeInTheDocument();
      expect(
        screen.getByTestId('update-thisAndFollowingInstances'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('update-allInstances')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('eventUpdateOptionsModalCloseBtn'));

    await waitFor(() => {
      expect(screen.getByLabelText(translations.startDate)).toBeInTheDocument();
    });

    // change the event dates
    let startDatePicker = screen.getByLabelText(translations.startDate);
    fireEvent.change(startDatePicker, {
      target: { value: updateData.startDate },
    });

    let endDatePicker = screen.getByLabelText(translations.endDate);
    fireEvent.change(endDatePicker, {
      target: { value: updateData.endDate },
    });

    userEvent.click(screen.getByTestId('updateEventBtn'));

    // shows options to update thisInstance and thisAndFollowingInstances only
    await waitFor(() => {
      expect(screen.getByTestId('update-thisInstance')).toBeInTheDocument();
      expect(
        screen.getByTestId('update-thisAndFollowingInstances'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('update-allInstances'),
      ).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('eventUpdateOptionsModalCloseBtn'));

    await waitFor(() => {
      expect(screen.getByLabelText(translations.startDate)).toBeInTheDocument();
    });

    // reset the event dates to their original values
    startDatePicker = screen.getByLabelText(translations.startDate);
    fireEvent.change(startDatePicker, {
      target: { value: '03/17/2022' },
    });

    endDatePicker = screen.getByLabelText(translations.endDate);
    fireEvent.change(endDatePicker, {
      target: { value: '03/17/2022' },
    });

    // now change the recurrence rule of the event
    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customDailyRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customDailyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceSubmitBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('updateEventBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateEventBtn'));

    // shows options to update thisAndFollowingInstances and allInstances only
    await waitFor(() => {
      expect(
        screen.queryByTestId('update-thisInstance'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('update-thisAndFollowingInstances'),
      ).toBeInTheDocument();
      expect(screen.queryByTestId('update-allInstances')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('eventUpdateOptionsModalCloseBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventModalCloseBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('should show recurrenceRule as changed if the recurrence weekdays have changed', async () => {
    renderEventListCard(props[4]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customRecurrence'));

    // since the current recurrence weekDay for the current recurring event is "SATURDAY",
    // let's first deselect it, and then we'll select a different day
    // the recurrence rule should be marked as changed and we should see the option to update
    // thisAndFollowingInstances and allInstances only
    await waitFor(() => {
      expect(screen.getAllByTestId('recurrenceWeekDay')[6]).toBeInTheDocument();
    });

    // deselect saturday, which is the 7th day in recurrenceWeekDay options
    userEvent.click(screen.getAllByTestId('recurrenceWeekDay')[6]);

    // select a different day, say wednesday, the 4th day in recurrenceWeekDay options
    userEvent.click(screen.getAllByTestId('recurrenceWeekDay')[3]);

    userEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('updateEventBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateEventBtn'));

    // shows options to update thisInstance and thisAndFollowingInstances, and allInstances
    await waitFor(() => {
      expect(
        screen.queryByTestId('update-thisInstance'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('update-thisAndFollowingInstances'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('update-allInstances')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('eventUpdateOptionsModalCloseBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventModalCloseBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('should update all instances of a recurring event', async () => {
    renderEventListCard(props[6]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateTitle')).toBeInTheDocument();
    });

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    userEvent.type(eventTitle, updateData.title);

    const eventDescription = screen.getByTestId('updateDescription');
    fireEvent.change(eventDescription, { target: { value: '' } });
    userEvent.type(eventDescription, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    userEvent.type(eventLocation, updateData.location);

    userEvent.click(screen.getByTestId('updateEventBtn'));

    // shows options to update thisInstance and thisAndFollowingInstances, and allInstances
    await waitFor(() => {
      expect(screen.getByTestId('update-thisInstance')).toBeInTheDocument();
      expect(
        screen.getByTestId('update-thisAndFollowingInstances'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('update-allInstances')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('update-allInstances'));
    userEvent.click(screen.getByTestId('recurringEventUpdateOptionSubmitBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('updateEventBtn')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('should update thisAndFollowingInstances of a recurring event', async () => {
    renderEventListCard(props[5]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByLabelText(translations.startDate)).toBeInTheDocument();
    });

    // change the event dates
    const startDatePicker = screen.getByLabelText(translations.startDate);
    fireEvent.change(startDatePicker, {
      target: { value: updateData.startDate },
    });

    const endDatePicker = screen.getByLabelText(translations.endDate);
    fireEvent.change(endDatePicker, {
      target: { value: updateData.endDate },
    });

    // now change the recurrence rule of the event
    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customDailyRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customDailyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceSubmitBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('updateEventBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('should render the delete modal', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('eventDeleteModalCloseBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('eventDeleteModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventDeleteModalCloseBtn'),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('eventModalCloseBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('should call the delete event mutation when the "Yes" button is clicked', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventDeleted);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('select different delete options on recurring events & then delete the recurring event', async () => {
    renderEventListCard(props[4]);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('delete-thisAndFollowingInstances'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('delete-thisAndFollowingInstances'));

    userEvent.click(screen.getByTestId('delete-allInstances'));
    userEvent.click(screen.getByTestId('delete-thisInstance'));

    userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventDeleted);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
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

  test('handle register should work properly', async () => {
    setItem('userId', '456');

    renderEventListCard(props[2]);

    userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('registerEventBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('registerEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(
        `Successfully registered for ${props[2].eventName}`,
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('should show already registered text when the user is registered for an event', async () => {
    renderEventListCard(props[3]);

    userEvent.click(screen.getByTestId('card'));

    expect(
      screen.getByText(translations.alreadyRegistered),
    ).toBeInTheDocument();
  });
});
