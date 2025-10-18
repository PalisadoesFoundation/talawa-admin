import { render, screen } from '@testing-library/react';
import DashboardCard from './DashboardCard';
import React from 'react';
describe('Testing the Dashboard Card', () => {
  test('should render props and text elements For event card', () => {
    const props = {
      icon: <i className="fa fa-user" />,
      title: 'Example Title',
      count: 100,
    };

    render(<DashboardCard {...props} />);

    expect(screen.getByText(/Example Title/i)).toBeInTheDocument();
    expect(screen.getByText(/100/i)).toBeInTheDocument();
  });
});
