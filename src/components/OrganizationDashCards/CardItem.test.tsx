import React from 'react';
import { render, screen } from '@testing-library/react';
import CardItem from './CardItem';
import type { InterfaceCardItem } from './CardItem';
import dayjs from 'dayjs';

describe('Testing the Organization Card', () => {
<<<<<<< HEAD
  test('Should render props and text elements For event card', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title: 'Event Title',
      startdate: '2023-09-13',
      enddate: '2023-09-14',
      location: 'Event Location',
=======
  test('should render props and text elements For event card', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title: 'Event Title',
      time: '2023-09-03',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    };

    render(<CardItem {...props} />);

    expect(screen.getByText(/Event Title/i)).toBeInTheDocument();
    expect(
<<<<<<< HEAD
      screen.getByText(
        `${dayjs(props.startdate).format('MMM D, YYYY')} - ${dayjs(
          props.enddate,
        ).format('MMM D, YYYY')}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Event Location/i)).toBeInTheDocument();
=======
      screen.getByText(dayjs(props.time).format('MMM D, YYYY'))
    ).toBeInTheDocument();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  test('Should render props and text elements for Post card', () => {
    const props: InterfaceCardItem = {
      type: 'Post',
      title: 'Post Title',
      time: '2023-09-03',
<<<<<<< HEAD
      creator: {
        email: 'johndoe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        __typename: 'User',
        _id: '1',
      },
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    };

    render(<CardItem {...props} />);

    expect(screen.getByText(/Post Title/i)).toBeInTheDocument();
    expect(
<<<<<<< HEAD
      screen.getByText(dayjs(props.time).format('MMM D, YYYY')),
    ).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
=======
      screen.getByText(dayjs(props.time).format('MMM D, YYYY'))
    ).toBeInTheDocument();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
