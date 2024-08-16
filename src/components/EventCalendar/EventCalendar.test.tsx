import Calendar from './EventCalendar';
import {
  render,
  screen,
  fireEvent,
  act,
  MatcherFunction,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';

import {
  DELETE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { weekdays, months, hours } from './constants';
import { BrowserRouter as Router } from 'react-router-dom';

const eventData = [
  {
    _id: '1',
    title: 'Event 1',
    description: 'This is event 1',
    startDate: '2022-05-01',
    endDate: '2022-05-01',
    location: 'New York',
    startTime: '10:00',
    endTime: '12:00',
    allDay: false,
    recurring: false,
    recurrenceRule: null,
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: true,
    viewType: ViewType.DAY,
  },
  {
    _id: '2',
    title: 'Event 2',
    description: 'This is event 2',
    startDate: '2022-05-03',
    endDate: '2022-05-03',
    location: 'Los Angeles',
    startTime: '14:00',
    endTime: '16:00',
    allDay: false,
    recurring: false,
    recurrenceRule: null,
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: true,
  },
];

const MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variable: { id: '123' },
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
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 200): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Calendar', () => {
  it('renders weekdays', () => {
    render(<Calendar eventData={eventData} viewType={ViewType.MONTH} />);

    weekdays.forEach((weekday) => {
      expect(screen.getByText(weekday)).toBeInTheDocument();
    });
  });
  it('should initialize currentMonth and currentYear with the current date', () => {
    const today = new Date();
    const { getByTestId } = render(<Calendar eventData={eventData} />);

    const currentMonth = getByTestId('current-date');
    const currentYear = getByTestId('current-date');

    expect(currentMonth).toHaveTextContent(
      today.toLocaleString('default', { month: 'long' }),
    );
    expect(currentYear).toHaveTextContent(today.getFullYear().toString());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the current month and year', () => {
    const { getByTestId } = render(<Calendar eventData={eventData} />);

    // Find the element by its data-testid attribute
    const currentDateElement = getByTestId('current-date');

    // Assert that the text content of the element matches the current month and year
    const currentMonth = new Date().toLocaleString('default', {
      month: 'long',
    });
    const currentYear = new Date().getFullYear();
    const expectedText = `${currentYear} ${currentMonth}`; // Use backticks for template literals
    expect(currentDateElement.textContent).toContain(expectedText);
  });

  it('Should show prev and next month on clicking < & > buttons', () => {
    //testing previous month button
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} />
        </I18nextProvider>
      </MockedProvider>,
    );
    const prevButton = screen.getByTestId('prevmonthordate');
    fireEvent.click(prevButton);
    //testing next month button
    const nextButton = screen.getByTestId('nextmonthordate');
    fireEvent.click(nextButton);
    //Testing year change
    for (let index = 0; index < 13; index++) {
      fireEvent.click(nextButton);
    }
    for (let index = 0; index < 13; index++) {
      fireEvent.click(prevButton);
    }
  });
  it('Should show prev and next year on clicking < & > buttons when in year view', async () => {
    //testing previous month button
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} viewType={ViewType.YEAR} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    const prevButtons = screen.getAllByTestId('prevYear');
    prevButtons.forEach((button) => {
      fireEvent.click(button);
    });
    await wait();
    //testing next year button
    const nextButton = screen.getAllByTestId('prevYear');
    nextButton.forEach((button) => {
      fireEvent.click(button);
    });
  });
  it('Should show prev and next date on clicking < & > buttons in the day view', async () => {
    render(
      <Router>
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar eventData={eventData} />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );
    //testing previous date button
    const prevButton = screen.getByTestId('prevmonthordate');
    fireEvent.click(prevButton);
    //testing next date button
    const nextButton = screen.getByTestId('nextmonthordate');
    fireEvent.click(nextButton);
    //Testing year change and month change
    for (let index = 0; index < 366; index++) {
      fireEvent.click(prevButton);
    }
    for (let index = 0; index < 732; index++) {
      fireEvent.click(nextButton);
    }
  });
  it('Should render eventlistcard of current day event', () => {
    const currentDayEventMock = [
      {
        _id: '0',
        title: 'demo',
        description: 'agrsg',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        location: 'delhi',
        startTime: '10:00',
        endTime: '12:00',
        allDay: false,
        recurring: false,
        recurrenceRule: null,
        isRecurringEventException: false,
        isPublic: true,
        isRegisterable: true,
      },
    ];
    render(
      <Router>
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar eventData={currentDayEventMock} userRole={'SUPERADMIN'} />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
    );
  });
  it('Test for superadmin case', () => {
    render(
      <Router>
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar eventData={eventData} userRole={'SUPERADMIN'} />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
    );
  });

  it('Current time indicator has a border at the current time', async () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <Calendar
          eventData={[]}
          userRole={'SUPERADMIN'}
          viewType={ViewType.DAY}
        />
      </I18nextProvider>,
    );

    screen.debug();

    const timeSlotElements = screen.getAllByText('03 AM');

    const timeSlotElement = timeSlotElements[0];
    expect(timeSlotElement).toBeInTheDocument();
    expect(timeSlotElement).toHaveClass(' _calendar_hour_text_j4n3t_157');
  });
});

it('displays all-day events in the correct section', async () => {
  const allDayEvent = [
    {
      ...eventData[0],
      allDay: true,
    },
  ];

  render(
    <MockedProvider>
      <I18nextProvider i18n={i18nForTest}>
        <Calendar eventData={allDayEvent} viewType={ViewType.DAY} />
      </I18nextProvider>
    </MockedProvider>,
  );

  await wait();
  const allDaySection = screen.getByText('All Day');
  expect(allDaySection).toBeInTheDocument();
});

it('Today button should show today cell', () => {
  render(
    <Router>
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} userRole={'SUPERADMIN'} />
        </I18nextProvider>
      </MockedProvider>
      ,
    </Router>,
  );
  //Changing the month
  const prevButton = screen.getByTestId('prevmonthordate');
  fireEvent.click(prevButton);

  // Clicking today button
  const todayButton = screen.getByTestId('today');
  fireEvent.click(todayButton);
  // const todayCell = screen.getByText(new Date().getDate().toString());
  // expect(todayCell).toHaveClass(styles.day__today);
});
it('Should handle window resize in day view', async () => {
  const multipleEventData = [
    {
      _id: '1',
      title: 'Event 1',
      description: 'This is event 1',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: 'Los Angeles',
      startTime: null,
      endTime: null,
      allDay: true,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
    },
    {
      _id: '2',
      title: 'Event 2',
      description: 'This is event 2',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: 'Los Angeles',
      startTime: null,
      endTime: null,
      allDay: true,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
    },
    {
      _id: '3',
      title: 'Event 3',
      description: 'This is event 3',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: 'Los Angeles',
      startTime: '14:00',
      endTime: '16:00',
      allDay: false,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
    },
    {
      _id: '4',
      title: 'Event 4',
      description: 'This is event 4',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: 'Los Angeles',
      startTime: '14:00',
      endTime: '16:00',
      allDay: false,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
    },
    {
      _id: '5',
      title: 'Event 5',
      description: 'This is event 5',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: 'Los Angeles',
      startTime: '17:00',
      endTime: '19:00',
      allDay: false,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
    },
  ];
  render(
    <Router>
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={multipleEventData} />
        </I18nextProvider>
      </MockedProvider>
      ,
    </Router>,
  );
  await act(async () => {
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
  });
});
test('Handles window resize', () => {
  render(
    <Router>
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} />
        </I18nextProvider>
      </MockedProvider>
      ,
    </Router>,
  );

  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
});

it('renders year view', async () => {
  render(<Calendar eventData={eventData} viewType={ViewType.YEAR} />);

  await wait();
  months.forEach((month) => {
    const elements = screen.getAllByText(month);
    elements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
});

describe('Calendar Day View', () => {
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const eventData = [
    {
      _id: '1',
      title: 'Morning Event',
      description: 'This is a morning event',
      startDate: todayISO,
      endDate: todayISO,
      location: 'New York',
      startTime: '09:00',
      endTime: '11:00',
      allDay: false,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
    },
  ];

  it('renders events correctly in day view', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <Calendar eventData={eventData} viewType={ViewType.DAY} />
      </I18nextProvider>,
    );

    expect(screen.getByText('Today')).toBeInTheDocument();
    const timeZoneElements = screen.getAllByText('UTC+05:30');
    expect(timeZoneElements).toHaveLength(2);
    timeZoneElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });

    hours.forEach((hour) => {
      const elements = screen.getAllByText(hour);
      elements.forEach((element) => {
        expect(element).toBeInTheDocument();
      });
    });
  });
});
