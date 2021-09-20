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
        orgName=""
        orgLocation=""
        createdDate=""
      />
    );
    expect(screen.getByText('Admins:')).toBeInTheDocument();
    expect(screen.getByText('Members:')).toBeInTheDocument();
  });
});
