import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperDashListCard from './SuperDashListCard';

describe('Testing the SuperDashListPage', () => {
  test('should show the text on the website', () => {
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
