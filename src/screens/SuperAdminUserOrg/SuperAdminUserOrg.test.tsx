import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperAdminUserOrgPage from './SuperAdminUserOrg';

describe('This is the test for Organization member page component', () => {
  test('should render 5 text elements test for the member page componet', () => {
    render(<SuperAdminUserOrgPage />);
    expect(screen.getByText('List of Organisation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
});
