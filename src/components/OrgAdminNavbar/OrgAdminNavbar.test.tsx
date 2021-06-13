import React from 'react';
import { render, screen, within } from '@testing-library/react';
import OrgAdminNavbar from './OrgAdminNavbar';

describe('This is the test for Navbar component', () => {
  test('should render 5 text elements test for the Navbar componet', () => {
    render(<OrgAdminNavbar />);
    expect(screen.getByText('TalawaAdmin')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByText('LogOut')).toBeInTheDocument();
  });

  test('list test', () => {
    render(<OrgAdminNavbar />);
    const list = screen.getByRole('list');
    const { getAllByRole } = within(list);
    const listItems = getAllByRole('listitem');
    expect(listItems.length).toBe(2);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('checking anchor tags', () => {
    render(<OrgAdminNavbar />);
    expect(screen.getByText('Home')).toHaveAttribute('href', '/orghome');
    expect(screen.getByText('Member')).toHaveAttribute('href', '/orgmember');
    expect(screen.getByText('LogOut')).toHaveAttribute('href', '/orghome');
  });
});
