/**
 * Unit tests for ProfileEvents component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProfileEvents from './ProfileEvents';
import type { InterfaceUserData } from '../types';

describe('ProfileEvents Component', () => {
  const mockUser: InterfaceUserData = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };

  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders event filter dropdown', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText('Created Events')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    expect(
      screen.getByPlaceholderText('Search created events'),
    ).toBeInTheDocument();
  });

  test('renders event cards', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    // Check for mock event
    expect(screen.getByText('Lorem ipsum dolor ammet')).toBeInTheDocument();
  });

  test('handles search input change', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    const searchInput = screen.getByPlaceholderText('Search created events');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(searchInput).toHaveValue('test');
  });

  test('renders sort button', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText(/Sort/i)).toBeInTheDocument();
  });

  test('handles sort button click', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    const sortButton = screen.getByText(/Sort/i);
    fireEvent.click(sortButton);

    // Button should still be in document after click
    expect(sortButton).toBeInTheDocument();
  });
});
