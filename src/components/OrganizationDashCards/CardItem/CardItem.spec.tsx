import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
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
      enddate: '2023-09-16',
      location: 'Convention Center',
      creator: {
        id: '1',
        name: 'Event Organizer',
      },
    };

    render(<CardItem {...props} />);
    expect(screen.getByText('Tech Conference 2023')).toBeInTheDocument();

    expect(screen.getByText('Convention Center')).toBeInTheDocument();

    const startdate = `${dayjs(props.startdate).format('MMM D, YYYY')}`;
    const enddate = `${dayjs(props.enddate).format('MMM D, YYYY')}`;
    const dateRange = `${startdate} - ${enddate}`;
    expect(screen.getByText(dateRange)).toBeInTheDocument();

    expect(screen.getByText('Author: Event Organizer')).toBeInTheDocument();

    expect(screen.getByTestId('marker-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('date-icon')).not.toHaveLength(0);
  });

  it('does not render location section when location is not provided', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title: 'No Location Event',
      startdate: '2023-10-01',
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

  it('renders post card correctly', () => {
    const props: InterfaceCardItem = {
      type: 'Post',
      title: '#1 Post Title',
    };
    render(<CardItem {...props} />);
    expect(screen.getByText('#1 Post Title')).toBeInTheDocument();
  });

  it('handles image error by falling back to default image for Post', () => {
    const props: InterfaceCardItem = {
      type: 'Post',
      title: 'Post with Image Error',
      image: 'invalid-image-url.jpg',
    };

    render(<CardItem {...props} />);

    const img = screen.getByAltText('Post with Image Error avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'invalid-image-url.jpg');

    // Simulate image load error
    act(() => {
      fireEvent.error(img);
    });

    // After error, the default image should be displayed
    const defaultImg = screen.getByAltText('Post with Image Error');
    expect(defaultImg).toBeInTheDocument();
    expect(defaultImg.getAttribute('src')).toContain('defaultImg.png');
  });

  it('renders MembershipRequest with Avatar when no image provided', () => {
    const props: InterfaceCardItem = {
      type: 'MembershipRequest',
      title: 'John Doe',
    };

    render(<CardItem {...props} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // Avatar component is rendered inside an imageContainer
    const avatarContainer = screen.getByAltText('');
    expect(avatarContainer).toBeInTheDocument();
    expect(avatarContainer).toHaveAttribute(
      'src',
      expect.stringContaining('svg'),
    );
  });

  it('renders MembershipRequest with Avatar when image fails to load', () => {
    const props: InterfaceCardItem = {
      type: 'MembershipRequest',
      title: 'Jane Smith',
      image: 'invalid-image-url.jpg',
    };

    render(<CardItem {...props} />);

    const img = screen.getByAltText('Jane Smith avatar');
    expect(img).toBeInTheDocument();

    // Simulate image load error
    act(() => {
      fireEvent.error(img);
    });

    // After error, the Avatar should be displayed (has empty alt text)
    const avatar = screen.getByAltText('');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', expect.stringContaining('svg'));
  });

  it('renders Post with valid image', () => {
    const props: InterfaceCardItem = {
      type: 'Post',
      title: 'Post with Image',
      image: 'https://example.com/image.jpg',
    };

    render(<CardItem {...props} />);

    const img = screen.getByAltText('Post with Image avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders Post with time information', () => {
    const props: InterfaceCardItem = {
      type: 'Post',
      title: 'Post with Time',
      time: '2023-10-15T10:00:00Z',
    };

    render(<CardItem {...props} />);

    expect(screen.getByText('Post with Time')).toBeInTheDocument();
    expect(screen.getByText(/Posted on:/)).toBeInTheDocument();
    expect(
      screen.getByText(/Oct 15, 2023/, { exact: false }),
    ).toBeInTheDocument();
  });

  it('renders MembershipRequest with valid image', () => {
    const props: InterfaceCardItem = {
      type: 'MembershipRequest',
      title: 'Member Request',
      image: 'https://example.com/member.jpg',
    };

    render(<CardItem {...props} />);

    const img = screen.getByAltText('Member Request avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/member.jpg');
  });
});
