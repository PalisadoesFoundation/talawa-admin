import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperDashListCard from './SuperDashListCard';

describe('Testing the Super Dash List', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <SuperDashListCard
        key="123"
        id=""
        image=""
        orgName="Dogs Care"
        orgLocation="India"
        createdDate="04/07/2019"
        admins="23"
        members="123"
      />
    );
    expect(screen.getByText('Admins:')).toBeInTheDocument();
    expect(screen.getByText('Members:')).toBeInTheDocument();
    expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('04/07/2019')).toBeInTheDocument();
  });
});
