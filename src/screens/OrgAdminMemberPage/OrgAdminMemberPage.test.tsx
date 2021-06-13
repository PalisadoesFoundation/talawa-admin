import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgAdminMemberPage from './OrgAdminMemberPage';

describe('This is the test for Organization member page component', () => {
  test('should render 5 text elements test for the member page componet', () => {
    render(<OrgAdminMemberPage />);
    expect(screen.getByText('List of members')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
});
