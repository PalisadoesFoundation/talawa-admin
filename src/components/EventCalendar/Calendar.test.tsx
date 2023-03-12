/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from './Calendar';

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
});
