<<<<<<< HEAD
import Calendar from './EventCalendar';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { debug } from 'jest-preview';
import React from 'react';
import { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';
=======
/* eslint-disable react/react-in-jsx-scope */
import Calendar from './EventCalendar';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

import {
  DELETE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import styles from './EventCalendar.module.css';
<<<<<<< HEAD
import { weekdays } from './constants';
import { BrowserRouter as Router } from 'react-router-dom';
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

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
    isPublic: true,
    isRegisterable: true,
<<<<<<< HEAD
    viewType: ViewType.DAY,
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

describe('Calendar', () => {
  it('renders weekdays', () => {
<<<<<<< HEAD
    render(<Calendar eventData={eventData} viewType={ViewType.MONTH} />);

=======
    render(<Calendar eventData={eventData} />);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      today.toLocaleString('default', { month: 'long' }),
=======
      today.toLocaleString('default', { month: 'long' })
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    expect(currentYear).toHaveTextContent(today.getFullYear().toString());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the current month and year', () => {
<<<<<<< HEAD
    const { getByTestId } = render(<Calendar eventData={eventData} />);

    // Find the element by its data-testid attribute
    const currentDateElement = getByTestId('current-date');

    // Assert that the text content of the element matches the current month and year
=======
    const { getByText } = render(<Calendar eventData={eventData} />);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    const currentMonth = new Date().toLocaleString('default', {
      month: 'long',
    });
    const currentYear = new Date().getFullYear();
<<<<<<< HEAD
    const expectedText = ` ${currentYear} ${currentMonth}`;
    expect(currentDateElement.textContent).toContain(expectedText);
=======
    expect(getByText(`${currentMonth} ${currentYear}`)).toBeInTheDocument();
  });

  it('should highlight the selected date when clicked', () => {
    const { getByText } = render(<Calendar eventData={eventData} />);
    const selectedDate = getByText('15');
    fireEvent.click(selectedDate);
    expect(selectedDate).toHaveClass(styles.day);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  it('Should show prev and next month on clicking < & > buttons', () => {
    //testing previous month button
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} />
        </I18nextProvider>
<<<<<<< HEAD
      </MockedProvider>,
    );
    const prevButton = screen.getByTestId('prevmonthordate');
    fireEvent.click(prevButton);
    //testing next month button
    const nextButton = screen.getByTestId('nextmonthordate');
=======
      </MockedProvider>
    );
    const prevButton = screen.getByText('<');
    fireEvent.click(prevButton);
    //testing next month button
    const nextButton = screen.getByText('>');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    fireEvent.click(nextButton);
    //Testing year change
    for (let index = 0; index < 13; index++) {
      fireEvent.click(nextButton);
    }
    for (let index = 0; index < 13; index++) {
      fireEvent.click(prevButton);
    }
  });
<<<<<<< HEAD
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
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
        isPublic: true,
        isRegisterable: true,
      },
    ];
    render(
<<<<<<< HEAD
      <Router>
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar eventData={currentDayEventMock} userRole={'SUPERADMIN'} />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
=======
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={currentDayEventMock} />
        </I18nextProvider>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });
  it('Test for superadmin case', () => {
    render(
<<<<<<< HEAD
      <Router>
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar eventData={eventData} userRole={'SUPERADMIN'} />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
=======
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} userRole={'SUPERADMIN'} />
        </I18nextProvider>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });
  it('Today Cell is having correct styles', () => {
    render(
<<<<<<< HEAD
      <Router>
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar eventData={eventData} userRole={'SUPERADMIN'} />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
=======
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} userRole={'SUPERADMIN'} />
        </I18nextProvider>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    // const todayDate = new Date().getDate();
    // const todayElement = screen.getByText(todayDate.toString());
    // expect(todayElement).toHaveClass(styles.day__today);
  });
  it('Today button should show today cell', () => {
    render(
<<<<<<< HEAD
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
=======
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} userRole={'SUPERADMIN'} />
        </I18nextProvider>
      </MockedProvider>
    );
    //Changing the month
    const prevButton = screen.getByText('<');
    fireEvent.click(prevButton);

    // Clicking today button
    const todayButton = screen.getByText('Today');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    fireEvent.click(todayButton);
    // const todayCell = screen.getByText(new Date().getDate().toString());
    // expect(todayCell).toHaveClass(styles.day__today);
  });
<<<<<<< HEAD
  it('Should expand and contract when clicked on View all and View less button', () => {
    const multipleEventData = [
      {
        _id: '1',
        title: 'Event 1',
        description: 'This is event 1',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        location: 'Los Angeles',
        startTime: '14:00',
        endTime: '16:00',
        allDay: false,
        recurring: false,
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
        startTime: '14:00',
        endTime: '16:00',
        allDay: false,
        recurring: false,
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
    const moreButton = screen.getByText('View all');
    fireEvent.click(moreButton);
    expect(screen.getByText('Event 3')).toBeInTheDocument();
    const lessButton = screen.getByText('View less');
    fireEvent.click(lessButton);
    expect(screen.queryByText('Event 3')).not.toBeInTheDocument();
  });
  it('Should Expand and contract when clicked on view all and view less in day view', async () => {
    const multipleEventData = [
      {
        _id: '1',
        title: 'Event 1',
        description: 'This is event 1',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        location: 'Los Angeles',
        startTime: undefined,
        endTime: undefined,
        allDay: true,
        recurring: false,
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
        startTime: undefined,
        endTime: undefined,
        allDay: true,
        recurring: false,
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
      </Router>,
    );

    const moreButtons = screen.getAllByText('View all');
    moreButtons.forEach((moreButton) => {
      fireEvent.click(moreButton);
      expect(screen.getByText('View less')).toBeInTheDocument();
      const lessButton = screen.getByText('View less');
      fireEvent.click(lessButton);
      expect(screen.queryByText('View less')).not.toBeInTheDocument();
    });
  });
  it('Should check without any all day events', async () => {
    const multipleEventData = [
      {
        _id: '1',
        title: 'Event 1',
        description: 'This is event 1',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        location: 'Los Angeles',
        startTime: '17:00',
        endTime: '19:00',
        allDay: false,
        recurring: false,
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
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    debug();
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
        startTime: undefined,
        endTime: undefined,
        allDay: true,
        recurring: false,
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
        startTime: undefined,
        endTime: undefined,
        allDay: true,
        recurring: false,
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
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
});
