import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperAdminOrgMemberPage from './SuperAdminOrgMember';

describe('This is the test for Organization member page component', () => {
  test('should render 5 text elements test for the member page componet', () => {
    render(<SuperAdminOrgMemberPage />);
    expect(screen.getByText('List of People')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
});