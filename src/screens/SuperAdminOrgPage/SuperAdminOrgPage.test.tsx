import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperAdminOrgPage from './SuperAdminOrgPage';

describe('This is the test for Organization member page component', () => {
  test('should render 5 text elements test for the member page componet', () => {
    render(<SuperAdminOrgPage />);
    expect(screen.getByText('List of Organization')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
});
