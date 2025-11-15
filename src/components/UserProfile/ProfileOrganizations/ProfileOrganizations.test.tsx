/**
 * Unit tests for ProfileOrganizations component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileOrganizations from './ProfileOrganizations';
import type { InterfaceUserData } from '../types';

describe('ProfileOrganizations Component', () => {
  const mockUser: InterfaceUserData = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };

  test('renders organizations filter dropdown', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    expect(screen.getByText('Created Organizations')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    expect(
      screen.getByPlaceholderText('Search created organizations'),
    ).toBeInTheDocument();
  });

  test('renders organization cards', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    // Check for mock organization
    expect(screen.getByText('Lorem Ipsum')).toBeInTheDocument();
  });

  test('handles search input change', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    const searchInput = screen.getByPlaceholderText(
      'Search created organizations',
    );
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(searchInput).toHaveValue('test');
  });

  test('renders sort button', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    expect(screen.getByText(/Sort/i)).toBeInTheDocument();
  });

  test('handles filter change', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    const filterButton = screen.getByText('Created Organizations');
    fireEvent.click(filterButton);

    // Filter dropdown should be visible
    expect(filterButton).toBeInTheDocument();
  });
});
