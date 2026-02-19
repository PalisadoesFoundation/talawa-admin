import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import PeopleTabUserEvents from './PeopleTabUserEvents';

describe('PeopleTabUserEvents', () => {
  const startDate = dayjs().add(30, 'days').format('YYYY-MM-DD');
  const endDate = dayjs().add(30, 'days').format('YYYY-MM-DD');

  const defaultProps = {
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startDate,
    endDate,
    eventName: 'Community Meetup',
    eventDescription: 'A session to discuss upcoming projects.',
    actionIcon: <span data-testid="arrow-icon">➡️</span>,
    actionName: 'View Details',
  };

  it('renders start and end times', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);
    expect(screen.getByText(defaultProps.startTime)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.endTime)).toBeInTheDocument();

    const toElements = screen.getAllByText(/to/i);
    expect(toElements[0]).toBeInTheDocument();
  });

  it('renders start and end dates', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);
    expect(screen.getAllByText(startDate)[0]).toBeInTheDocument();
    expect(screen.getAllByText(endDate)[1]).toBeInTheDocument();
  });

  it('renders event name and description', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);
    expect(screen.getByText(defaultProps.eventName)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.eventDescription)).toBeInTheDocument();
  });

  it('renders action button with icon and label', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(button).toHaveTextContent(defaultProps.actionName);
  });

  it('renders correctly without actionIcon and actionName', () => {
    render(
      <PeopleTabUserEvents
        startTime={defaultProps.startTime}
        endTime={defaultProps.endTime}
        startDate={startDate}
        endDate={endDate}
        eventName={defaultProps.eventName}
        eventDescription={defaultProps.eventDescription}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders correctly if optional props are missing', () => {
    render(<PeopleTabUserEvents eventName="Test Event" />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('handles click on the action button', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
