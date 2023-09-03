import React from 'react';
import { render, screen } from '@testing-library/react';
import CardItem from './CardItem';
import type { InterfaceCardItem } from './CardItem';

describe('Testing the Organization Card', () => {
  test('should render props and text elements For event card', () => {
    const props: InterfaceCardItem = {
      type: 'Event',
      title: 'Event Title',
      time: '2023-09-03',
    };

    render(<CardItem {...props} />);

    expect(screen.getByText(/Event Title/i)).toBeInTheDocument();
    expect(screen.getByText(/03-09-2023/i)).toBeInTheDocument();
  });

  test('Should render props and text elements for Post card', () => {
    const props: InterfaceCardItem = {
      type: 'Post',
      title: 'Post Title',
      time: '2023-09-03',
    };

    render(<CardItem {...props} />);
    
    expect(screen.getByText(/Post Title/i)).toBeInTheDocument();
    expect(screen.getByText(/03-09-2023/i)).toBeInTheDocument();
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
