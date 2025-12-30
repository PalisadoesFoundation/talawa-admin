import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PeopleTabUserEvents from './PeopleTabUserEvents';

describe('PeopleTabUserEvents', () => {
  const defaultProps = {
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startDate: '2025-12-20',
    endDate: '2025-12-20',
    eventName: 'Community Meetup',
    eventDescription: 'A session to discuss upcoming projects.',
    actionIcon: <span data-testid="arrow-icon">➡️</span>,
    actionName: 'View Details',
  };

  it('renders start and end times', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);
    expect(screen.getByText(defaultProps.startTime)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.endTime)).toBeInTheDocument();
    const toElements = screen.getAllByText(/TO/i);
    expect(toElements[0]).toBeInTheDocument();
  });

  it('renders start and end dates', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);
    expect(screen.getAllByText(defaultProps.startDate)[0]).toBeInTheDocument();
    expect(screen.getAllByText(defaultProps.endDate)[1]).toBeInTheDocument();
  });

  it('renders event name and description', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);
    expect(screen.getByText(defaultProps.eventName)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.eventDescription)).toBeInTheDocument();
  });

  it('renders action button with icon and label', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);
    const button = screen.getByRole('button', {
      name: `➡️${defaultProps.actionName}`,
    });
    expect(button).toBeInTheDocument();

    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(button).toHaveTextContent(defaultProps.actionName);
  });

  it('renders correctly without actionIcon and actionName', () => {
    render(
      <PeopleTabUserEvents
        startTime={defaultProps.startTime}
        endTime={defaultProps.endTime}
        startDate={defaultProps.startDate}
        endDate={defaultProps.endDate}
        eventName={defaultProps.eventName}
        eventDescription={defaultProps.eventDescription}
      />,
    );

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('renders correctly if optional props are missing', () => {
    render(<PeopleTabUserEvents eventName="Test Event" />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('handles click on the action button', () => {
    render(<PeopleTabUserEvents {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Since no onClick is passed, just verify button exists
    expect(button).toBeInTheDocument();
  });
});
