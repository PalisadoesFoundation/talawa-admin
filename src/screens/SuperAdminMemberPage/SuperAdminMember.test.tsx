import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperAdminMemberPage from './SuperAdminMemberPage';

describe('This is the test for Organization member page component', () => {
  test('should render 5 text elements test for the member page componet', () => {
    render(<SuperAdminMemberPage />);
    expect(screen.getByText('List of People')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
});
