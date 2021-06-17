import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgAdminNavbar from './OrgAdminNavbar';

describe('This is the test for Navbar component', () => {
  test('should render 5 text elements test for the Navbar componet', () => {
    render(<OrgAdminNavbar />);
    expect(screen.getByText('TalawaAdmin')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByText('LogOut')).toBeInTheDocument();
  });

  test('checking anchor tags', () => {
    render(<OrgAdminNavbar />);
    expect(screen.getByText('Home')).toHaveAttribute('href', '/orghome');
    expect(screen.getByText('Member')).toHaveAttribute('href', '/orgmember');
    expect(screen.getByText('LogOut')).toHaveAttribute('href', '/');
  });
});
