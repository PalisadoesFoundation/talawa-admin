import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminNavbar from './AdminNavbar';

describe('This is the test for Navbar component', () => {
  test('should render 5 text elements test for the Navbar component', () => {
    render(
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/' },
          { name: 'People', url: '/supermember' },
          { name: 'Organisation', url: '/superorg' },
          { name: 'LogOut', url: '/' },
        ]}
      />
    );
    expect(screen.getByText('Talawa Portal')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Organisation')).toBeInTheDocument();
    expect(screen.getByText('LogOut')).toBeInTheDocument();
  });

  test('checking anchor tags', () => {
    render(
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/' },
          { name: 'People', url: '/supermember' },
          { name: 'Organisation', url: '/superorg' },
          { name: 'LogOut', url: '/' },
        ]}
      />
    );
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
    expect(screen.getByText('People')).toHaveAttribute('href', '/supermember');
    expect(screen.getByText('LogOut')).toHaveAttribute('href', '/');
    expect(screen.getByText('Organisation')).toHaveAttribute(
      'href',
      '/superorg'
    );
  });

  test('should render 3 text elements test for the Navbar component', () => {
    render(
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/orghome' },
          { name: 'Member', url: '/orgmember' },
          { name: 'LogOut', url: '/' },
        ]}
      />
    );
    expect(screen.getByText('Talawa')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByText('LogOut')).toBeInTheDocument();
  });

  test('checking 3 anchor tags', () => {
    render(
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/orghome' },
          { name: 'Member', url: '/orgmember' },
          { name: 'LogOut', url: '/' },
        ]}
      />
    );
    expect(screen.getByText('Home')).toHaveAttribute('href', '/orghome');
    expect(screen.getByText('Member')).toHaveAttribute('href', '/orgmember');
    expect(screen.getByText('LogOut')).toHaveAttribute('href', '/');
  });
});
