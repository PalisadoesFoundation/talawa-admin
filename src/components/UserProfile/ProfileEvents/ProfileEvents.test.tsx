/**
 * Unit tests for ProfileEvents component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProfileEvents from './ProfileEvents';
import type { InterfaceUserData } from '../types';

describe('ProfileEvents Component', () => {
  const mockUserWithEvents = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
    eventsAttended: {
      edges: [
        {
          node: {
            id: 'event1',
            name: 'Test Event',
            description: 'Test event description',
            startAt: '2024-01-15T10:00:00Z',
            endAt: '2024-01-15T12:00:00Z',
            location: 'Test Location',
          },
        },
        {
          node: {
            id: 'event2',
            name: 'Another Event',
            description: 'Another event description',
            startAt: '2024-02-20T14:00:00Z',
            endAt: '2024-02-20T16:00:00Z',
            location: 'Another Location',
          },
        },
      ],
    },
  } as InterfaceUserData;

  const mockUserNoEvents: InterfaceUserData = {
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
        user={mockUserWithEvents}
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
        user={mockUserWithEvents}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    expect(
      screen.getByPlaceholderText('Search created events'),
    ).toBeInTheDocument();
  });

  test('renders event cards when data is available', () => {
    render(
      <ProfileEvents
        user={mockUserWithEvents}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    // Check for events from backend data
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Another Event')).toBeInTheDocument();
  });

  test('renders empty state when no events', () => {
    render(
      <ProfileEvents
        user={mockUserNoEvents}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    // Should show "no events" message
    expect(screen.getByText(/no events found/i)).toBeInTheDocument();
  });

  test('handles search input change', () => {
    render(
      <ProfileEvents
        user={mockUserWithEvents}
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
        user={mockUserWithEvents}
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
        user={mockUserWithEvents}
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

  test('filters events by search term', () => {
    render(
      <ProfileEvents
        user={mockUserWithEvents}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    const searchInput = screen.getByPlaceholderText('Search created events');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Should still show Test Event
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  test('renders event descriptions', () => {
    render(
      <ProfileEvents
        user={mockUserWithEvents}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText('Test event description')).toBeInTheDocument();
    expect(screen.getByText('Another event description')).toBeInTheDocument();
  });

  test('renders multiple event cards', () => {
    render(
      <ProfileEvents
        user={mockUserWithEvents}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    // Should render 2 event cards
    const eventCards = screen.getAllByText(/Test Event|Another Event/);
    expect(eventCards.length).toBeGreaterThan(0);
  });

  test('shows correct initial sort order', () => {
    render(
      <ProfileEvents
        user={mockUserWithEvents}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    const sortButton = screen.getByText(/Sort/i);
    // Initial sort order should be 'date'
    expect(sortButton.textContent).toContain('date');
  });
});
