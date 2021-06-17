import React from 'react';
import { render, screen, within } from '@testing-library/react';
import OrgAdminNavbar from './SuperAdminNavbar';

describe('This is the test for Navbar component', () => {
  test('should render 5 text elements test for the Navbar componet', () => {
    render(<OrgAdminNavbar />);
    expect(screen.getByText('TalawaAdmin')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('LogOut')).toBeInTheDocument();
  });

  test('checking anchor tags', () => {
    render(<OrgAdminNavbar />);
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
    expect(screen.getByText('People')).toHaveAttribute('href', '/supermember');
    expect(screen.getByText('LogOut')).toHaveAttribute('href', '/');
    expect(screen.getByText('Organization')).toHaveAttribute('href', '/');
  });
});
