import React, { act } from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import type { InterfaceEvent } from 'types/Event/interface';
import EventListCard from './EventListCard';
import i18n from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useLocalStorage from 'utils/useLocalstorage';
import { props } from './EventListCardProps';
import { ERROR_MOCKS, MOCKS } from './Modal/EventListCardMocks';
import { vi, beforeAll, afterAll, expect, it } from 'vitest';

const { setItem } = useLocalStorage();

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(ERROR_MOCKS, true);

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventListCard ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const renderEventListCard = (props: InterfaceEvent): RenderResult => {
  const { key, ...restProps } = props; // Destructure the key and separate other props

  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgevents/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/orgevents/:orgId"
                  element={<EventListCard key={key} {...restProps} />}
                />
                <Route
                  path="/event/:orgId/"
                  element={<EventListCard key={key} {...restProps} />}
                />
                <Route
                  path="/event/:orgId/:eventId"
                  element={<div>Event Dashboard (Admin)</div>}
                />
                <Route
                  path="/user/event/:orgId/:eventId"
                  element={<div>Event Dashboard (User)</div>}
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
    startDate: '03/18/2022',
    endDate: '03/20/2022',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
  };

  beforeAll(() => {
    vi.mock('react-router-dom', async () => ({
      ...(await vi.importActual('react-router-dom')),
    }));
  });

  afterAll(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('Testing for event modal', async () => {
    renderEventListCard(props[1]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('eventModalCloseBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('Should navigate to "/" if orgId is not defined', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <EventListCard
              key="123"
              _id="1"
              title=""
              location=""
              description=""
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
              attendees={[]}
              creator={{}}
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

  it('Should render default text if event details are null', async () => {
    renderEventListCard(props[0]);

    await waitFor(() => {
      expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    });
  });

  it('should render props and text elements test for the screen', async () => {
    renderEventListCard(props[1]);

    expect(screen.getByText(props[1].title)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateDescription')).toBeInTheDocument();
    });

    expect(screen.getByTestId('updateDescription')).toHaveValue(
      props[1].description,
    );
    expect(screen.getByTestId('updateLocation')).toHaveValue(props[1].location);

    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('Should render truncated event name when length is more than 100', async () => {
    const longEventName = 'a'.repeat(101);
    renderEventListCard({ ...props[1], title: longEventName });

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateTitle')).toBeInTheDocument();
    });

    expect(screen.getByTestId('updateTitle')).toHaveValue(
      `${longEventName.substring(0, 100)}...`,
    );

    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('Should render full event name when length is less than or equal to 100', async () => {
    const shortEventName = 'a'.repeat(100);
    renderEventListCard({ ...props[1], title: shortEventName });

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateTitle')).toBeInTheDocument();
    });

    expect(screen.getByTestId('updateTitle')).toHaveValue(shortEventName);

    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('Should render truncated event description when length is more than 256', async () => {
    const longEventDescription = 'a'.repeat(257);

    renderEventListCard({
      ...props[1],
      description: longEventDescription,
    });

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateDescription')).toBeInTheDocument();
    });
    expect(screen.getByTestId('updateDescription')).toHaveValue(
      `${longEventDescription.substring(0, 256)}...`,
    );

    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('Should render full event description when length is less than or equal to 256', async () => {
    const shortEventDescription = 'a'.repeat(256);

    renderEventListCard({
      ...props[1],
      description: shortEventDescription,
    });

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateDescription')).toBeInTheDocument();
    });
    expect(screen.getByTestId('updateDescription')).toHaveValue(
      shortEventDescription,
    );

    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('Should navigate to event dashboard when clicked (For Admin)', async () => {
    renderEventListCard(props[1]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('showEventDashboardBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('showEventDashboardBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
      expect(screen.queryByText('Event Dashboard (Admin)')).toBeInTheDocument();
    });
  });

  it('Should navigate to event dashboard when clicked (For User)', async () => {
    setItem('userId', '123');
    renderEventListCard(props[2]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('showEventDashboardBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('showEventDashboardBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
      expect(screen.queryByText('Event Dashboard (User)')).toBeInTheDocument();
    });
  });

  it('Should update a non-recurring event', async () => {
    renderEventListCard(props[1]);

    await userEvent.click(screen.getByTestId('card'));

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    await userEvent.type(eventTitle, updateData.title);

    const description = screen.getByTestId('updateDescription');
    fireEvent.change(description, { target: { value: '' } });
    await userEvent.type(description, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    await userEvent.type(eventLocation, updateData.location);

    const startDatePicker = screen.getByLabelText(translations.startDate);
    fireEvent.change(startDatePicker, {
      target: { value: updateData.startDate },
    });

    const endDatePicker = screen.getByLabelText(translations.endDate);
    fireEvent.change(endDatePicker, {
      target: { value: updateData.endDate },
    });

    await userEvent.click(screen.getByTestId('updateAllDay'));
    await userEvent.click(screen.getByTestId('updateIsPublic'));
    await userEvent.click(screen.getByTestId('updateRegistrable'));
    await userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('Should update a non all day non-recurring event', async () => {
    renderEventListCard(props[1]);

    await userEvent.click(screen.getByTestId('card'));

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    await userEvent.type(eventTitle, updateData.title);

    const description = screen.getByTestId('updateDescription');
    fireEvent.change(description, { target: { value: '' } });
    await userEvent.type(description, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    await userEvent.type(eventLocation, updateData.location);

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

    await userEvent.click(screen.getByTestId('updateIsPublic'));
    await userEvent.click(screen.getByTestId('updateRegistrable'));

    await userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should update a single event to be recurring', async () => {
    renderEventListCard(props[1]);

    await userEvent.click(screen.getByTestId('card'));

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    await userEvent.type(eventTitle, updateData.title);

    const description = screen.getByTestId('updateDescription');
    fireEvent.change(description, { target: { value: '' } });
    await userEvent.type(description, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    await userEvent.type(eventLocation, updateData.location);

    const startDatePicker = screen.getByLabelText(translations.startDate);
    fireEvent.change(startDatePicker, {
      target: { value: updateData.startDate },
    });

    const endDatePicker = screen.getByLabelText(translations.endDate);
    fireEvent.change(endDatePicker, {
      target: { value: updateData.endDate },
    });

    await userEvent.click(screen.getByTestId('updateAllDay'));
    await userEvent.click(screen.getByTestId('updateRecurring'));
    await userEvent.click(screen.getByTestId('updateIsPublic'));
    await userEvent.click(screen.getByTestId('updateRegistrable'));
    await userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should show different update options for a recurring event based on different conditions', async () => {
    renderEventListCard(props[5]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.queryByTestId('updateEventBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateEventBtn'));

    // shows options to update thisInstance and thisAndFollowingInstances, and allInstances
    await waitFor(() => {
      expect(screen.getByTestId('update-thisInstance')).toBeInTheDocument();
      expect(
        screen.getByTestId('update-thisAndFollowingInstances'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('update-allInstances')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByTestId('eventUpdateOptionsModalCloseBtn'),
    );

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

    await userEvent.click(screen.getByTestId('updateEventBtn'));

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

    await userEvent.click(
      screen.getByTestId('eventUpdateOptionsModalCloseBtn'),
    );

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
    await userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('customRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('customRecurrenceFrequencyDropdown'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('customDailyRecurrence')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('customDailyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceSubmitBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('updateEventBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateEventBtn'));

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

    await userEvent.click(
      screen.getByTestId('eventUpdateOptionsModalCloseBtn'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('eventModalCloseBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should show recurrenceRule as changed if the recurrence weekdays have changed', async () => {
    renderEventListCard(props[4]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('customRecurrence'));

    // since the current recurrence weekDay for the current recurring event is "SATURDAY",
    // let's first deselect it, and then we'll select a different day
    // the recurrence rule should be marked as changed and we should see the option to update
    // thisAndFollowingInstances and allInstances only
    await waitFor(() => {
      expect(screen.getAllByTestId('recurrenceWeekDay')[6]).toBeInTheDocument();
    });

    // deselect saturday, which is the 7th day in recurrenceWeekDay options
    await userEvent.click(screen.getAllByTestId('recurrenceWeekDay')[6]);

    // select a different day, say wednesday, the 4th day in recurrenceWeekDay options
    await userEvent.click(screen.getAllByTestId('recurrenceWeekDay')[3]);

    await userEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('updateEventBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateEventBtn'));

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

    await userEvent.click(
      screen.getByTestId('eventUpdateOptionsModalCloseBtn'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('eventModalCloseBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should update all instances of a recurring event', async () => {
    renderEventListCard(props[6]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('updateTitle')).toBeInTheDocument();
    });

    const eventTitle = screen.getByTestId('updateTitle');
    fireEvent.change(eventTitle, { target: { value: '' } });
    await userEvent.type(eventTitle, updateData.title);

    const description = screen.getByTestId('updateDescription');
    fireEvent.change(description, { target: { value: '' } });
    await userEvent.type(description, updateData.description);

    const eventLocation = screen.getByTestId('updateLocation');
    fireEvent.change(eventLocation, { target: { value: '' } });
    await userEvent.type(eventLocation, updateData.location);

    await userEvent.click(screen.getByTestId('updateEventBtn'));

    // shows options to update thisInstance and thisAndFollowingInstances, and allInstances
    await waitFor(() => {
      expect(screen.getByTestId('update-thisInstance')).toBeInTheDocument();
      expect(
        screen.getByTestId('update-thisAndFollowingInstances'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('update-allInstances')).toBeInTheDocument();
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('update-allInstances'));
      fireEvent.click(
        screen.getByTestId('recurringEventUpdateOptionSubmitBtn'),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('updateEventBtn')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should update thisAndFollowingInstances of a recurring event', async () => {
    renderEventListCard(props[5]);

    await userEvent.click(screen.getByTestId('card'));

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
    await userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('customRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('customRecurrenceFrequencyDropdown'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('customDailyRecurrence')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('customDailyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceSubmitBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('updateEventBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventUpdated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render the delete modal', async () => {
    renderEventListCard(props[1]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('eventDeleteModalCloseBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('eventDeleteModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventDeleteModalCloseBtn'),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('eventModalCloseBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('eventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should call the delete event mutation when the "Yes" button is clicked', async () => {
    renderEventListCard(props[1]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventDeleted);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('select different delete options on recurring events & then delete the recurring event', async () => {
    renderEventListCard(props[4]);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('delete-thisAndFollowingInstances'),
      ).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByTestId('delete-thisAndFollowingInstances'),
    );

    await userEvent.click(screen.getByTestId('delete-allInstances'));
    await userEvent.click(screen.getByTestId('delete-thisInstance'));

    await userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventDeleted);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should show an error toast when the delete event mutation fails', async () => {
    // Destructure key from props[1] and pass it separately to avoid spreading it
    const { key, ...otherProps } = props[1];
    render(
      <MockedProvider addTypename={false} link={link2}>
        <MemoryRouter initialEntries={['/orgevents/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgevents/:orgId"
                    element={<EventListCard key={key} {...otherProps} />}
                  />
                  <Route
                    path="/event/:orgId/"
                    element={<EventListCard key={key} {...otherProps} />}
                  />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByTestId('card'));
    await userEvent.click(screen.getByTestId('deleteEventModalBtn'));
    await userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('handle register should work properly', async () => {
    setItem('userId', '456');

    renderEventListCard(props[2]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('registerEventBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('registerEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        `Successfully registered for ${props[2].title}`,
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('should show already registered text when the user is registered for an event', async () => {
    renderEventListCard(props[3]);

    await userEvent.click(screen.getByTestId('card'));

    expect(
      screen.getByText(translations.alreadyRegistered),
    ).toBeInTheDocument();
  });
});
