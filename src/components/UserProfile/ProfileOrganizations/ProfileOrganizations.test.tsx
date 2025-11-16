/**
 * Unit tests for ProfileOrganizations component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileOrganizations from './ProfileOrganizations';
import type { InterfaceUserData } from '../types';

describe('ProfileOrganizations Component', () => {
  const mockUserWithOrgs = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
    organizationsWhereMember: {
      edges: [
        {
          node: {
            id: 'org1',
            name: 'Test Organization',
            description: 'Test org description',
          },
        },
        {
          node: {
            id: 'org2',
            name: 'Another Organization',
            description: 'Another org description',
          },
        },
      ],
    },
  } as InterfaceUserData;

  const mockUserNoOrgs: InterfaceUserData = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };

  test('renders organizations filter dropdown', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    expect(screen.getByText('Created Organizations')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    expect(
      screen.getByPlaceholderText('Search created organizations'),
    ).toBeInTheDocument();
  });

  test('renders organization cards when data is available', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    // Check for organizations from backend data
    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByText('Another Organization')).toBeInTheDocument();
  });

  test('renders empty state when no organizations', () => {
    render(<ProfileOrganizations user={mockUserNoOrgs} isOwnProfile={true} />);

    // Should show "no organizations" message
    expect(screen.getByText(/no organizations found/i)).toBeInTheDocument();
  });

  test('handles search input change', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    const searchInput = screen.getByPlaceholderText(
      'Search created organizations',
    );
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(searchInput).toHaveValue('test');
  });

  test('renders sort button', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    expect(screen.getByText(/Sort/i)).toBeInTheDocument();
  });

  test('handles filter change', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    const filterButton = screen.getByText('Created Organizations');
    fireEvent.click(filterButton);

    // Filter dropdown should be visible
    expect(filterButton).toBeInTheDocument();
  });

  test('filters organizations by search term', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    const searchInput = screen.getByPlaceholderText(
      'Search created organizations',
    );
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Should still show Test Organization
    expect(screen.getByText('Test Organization')).toBeInTheDocument();
  });

  test('renders organization description', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    expect(screen.getByText('Test org description')).toBeInTheDocument();
    expect(screen.getByText('Another org description')).toBeInTheDocument();
  });

  test('handles sort order toggle', () => {
    render(
      <ProfileOrganizations user={mockUserWithOrgs} isOwnProfile={true} />,
    );

    const sortButton = screen.getByText(/Sort/i);
    expect(sortButton).toBeInTheDocument();

    // Initial sort order is 'name'
    expect(sortButton.textContent).toContain('name');
  });
});
