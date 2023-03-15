/* eslint-disable react/react-in-jsx-scope */
import Calendar from './Calendar';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider, MockLink } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import {
  DELETE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';

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

const mocklink = new MockLink(MOCKS, false, { showWarnings: false });

describe('Calendar', () => {
  it('renders weekdays', () => {
    render(<Calendar eventData={eventData} />);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
      today.toLocaleString('default', { month: 'long' })
    );
    expect(currentYear).toHaveTextContent(today.getFullYear().toString());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the current month and year', () => {
    const { getByText } = render(<Calendar eventData={eventData} />);
    const currentMonth = new Date().toLocaleString('default', {
      month: 'long',
    });
    const currentYear = new Date().getFullYear();
    expect(getByText(`${currentMonth} ${currentYear}`)).toBeInTheDocument();
  });

  it('should render the correct number of days', () => {
    const { getAllByTestId } = render(<Calendar eventData={eventData} />);
    const days = getAllByTestId('day');
    expect(days.length).toBe(35);
  });

  it('should highlight the selected date when clicked', () => {
    const { getByText } = render(<Calendar eventData={eventData} />);
    const selectedDate = getByText('15');
    fireEvent.click(selectedDate);
    expect(selectedDate).toHaveClass('day');
  });

  it('Should show prev and next month on clicking < & > buttons', () => {
    //testing previous month button
    render(
      <MockedProvider addTypename={false} link={mocklink}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={eventData} />
        </I18nextProvider>
      </MockedProvider>
    );
    const prevButton = screen.getByText('<');
    fireEvent.click(prevButton);
    //testing next month button
    const nextButton = screen.getByText('>');
    fireEvent.click(nextButton);
    //Testing year change
    for (let index = 0; index < 13; index++) {
      fireEvent.click(nextButton);
    }
    for (let index = 0; index < 13; index++) {
      fireEvent.click(prevButton);
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
        isPublic: true,
        isRegisterable: true,
      },
    ];
    render(
      <MockedProvider addTypename={false} link={mocklink}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar eventData={currentDayEventMock} />
        </I18nextProvider>
      </MockedProvider>
    );
  });
});
