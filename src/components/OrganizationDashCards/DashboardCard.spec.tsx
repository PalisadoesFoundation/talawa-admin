import { render, screen } from '@testing-library/react';
import DashboardCard from './DashboardCard';
import React from 'react';

const props = {
  icon: <i className="fa fa-user" />,
  title: 'Example Title',
  count: 100,
};
const propsWithoutCount = {
  icon: <i className="fa fa-user" />,
  title: 'Example Title',
};

describe('Testing the Dashboard Card', () => {
  test('should render props and text elements correctly', () => {
    render(<DashboardCard {...props} />);
    expect(screen.getByTestId('cardTitle')).toHaveTextContent('Example Title');
    expect(screen.getByTestId('cardCount')).toHaveTextContent('100');
  });

  test('renders count to 0 when count is missing', () => {
    render(<DashboardCard {...propsWithoutCount} />);
    expect(screen.getByTestId('cardTitle')).toHaveTextContent('Example Title');
    expect(screen.getByTestId('cardCount')).toHaveTextContent('0');
  });
});
