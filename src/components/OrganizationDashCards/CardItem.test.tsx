import React from 'react';
import { render, screen } from '@testing-library/react';
import CardItem from './CardItem';
import type { InterfaceCardItem } from './CardItem';
import dayjs from 'dayjs';

describe('Testing the Organization Card', () => {
  test('Should render props and text elements For event card', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title: 'Event Title',
      startdate: '2023-09-03',
      enddate: '2023-09-04',
      location: 'Event Location',
    };

    render(<CardItem {...props} />);

    expect(screen.getByText(/Event Title/i)).toBeInTheDocument();
    expect(
      screen.getByText(dayjs(props.startdate).format('MMM D, YYYY'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(dayjs(props.enddate).format('MMM D, YYYY'))
    ).toBeInTheDocument();
    expect(screen.getByText(/Event Location/i)).toBeInTheDocument();
  });

  test('Should render props and text elements for Post card', () => {
    const props: InterfaceCardItem = {
      type: 'Post',
      title: 'Post Title',
      time: '2023-09-03',
      creator: {
        email: 'johndoe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        __typename: 'User',
        _id: '1',
      },
    };

    render(<CardItem {...props} />);

    expect(screen.getByText(/Post Title/i)).toBeInTheDocument();
    expect(
      screen.getByText(dayjs(props.time).format('MMM D, YYYY'))
    ).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  test('Should render props and text elements for Membership Request card', () => {
    const props: InterfaceCardItem = {
      type: 'MembershipRequest',
      title: 'Membership Request Title',
    };

    render(<CardItem {...props} />);
    expect(screen.getByText(/Membership Request Title/i)).toBeInTheDocument();
  });
});
