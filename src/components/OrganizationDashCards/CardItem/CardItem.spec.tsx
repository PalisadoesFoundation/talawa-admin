import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardItem from './CardItem';
import type { InterfaceCardItem } from './CardItem';
import dayjs from 'dayjs';
import React from 'react';

vi.mock('assets/svgs/cardItemLocation.svg?react', () => ({
  default: () => <div data-testid="marker-icon" />,
}));

vi.mock('assets/svgs/cardItemDate.svg?react', () => ({
  default: () => <div data-testid="date-icon" />,
}));

describe('CardItem Component', () => {
  it('renders Event type card with all properties', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title: 'Tech Conference 2023',
      startdate: '2023-09-15',
      enddate: '2023-09-17',
      location: 'Convention Center',
      creator: {
        id: '1',
        name: 'Event Organizer',
      },
    };

    render(<CardItem {...props} />);
    expect(screen.getByText('Tech Conference 2023..')).toBeInTheDocument();

    expect(screen.getByText('Convention Center')).toBeInTheDocument();

    const expectedDateRange = `${dayjs(props.startdate).format('MMM D, YYYY')} - ${dayjs(props.enddate).format('MMM D, YYYY')}`;
    expect(screen.getByText(expectedDateRange)).toBeInTheDocument();

    expect(screen.getByText('Author: Event Organizer')).toBeInTheDocument();

    expect(screen.getByTestId('marker-icon')).toBeInTheDocument();
    expect(screen.getByTestId('date-icon')).toBeInTheDocument();
  });

  it('handles long titles by truncating them', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title:
        'This is an extremely long title that should be truncated when displayed on the card',
    };

    render(<CardItem {...props} />);

    expect(screen.getByText('This is an extremely long..')).toBeInTheDocument();
  });

  it('does not render location section when location is not provided', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title: 'No Location Event',
      startdate: '2023-10-01',
      enddate: '2023-10-02',
    };

    render(<CardItem {...props} />);

    expect(screen.queryByTestId('marker-icon')).not.toBeInTheDocument();
  });

  it('does not render date range when startdate or enddate is missing', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title: 'No Dates Event',
    };

    render(<CardItem {...props} />);

    expect(screen.queryByTestId('date-icon')).not.toBeInTheDocument();
  });
});
