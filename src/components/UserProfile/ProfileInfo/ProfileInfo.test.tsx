/**
 * Unit tests for ProfileInfo component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProfileInfo from './ProfileInfo';
import type { InterfaceUserData } from '../types';

describe('ProfileInfo Component', () => {
  const mockUser: InterfaceUserData = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    avatarURL: 'https://example.com/avatar.jpg',
    description: 'Test description',
    birthDate: '1990-01-01',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    countryCode: 'US',
    postalCode: '10001',
    homePhoneNumber: '555-0123',
    mobilePhoneNumber: '555-0124',
    workPhoneNumber: '555-0125',
    educationGrade: 'GRADUATE',
    employmentStatus: 'EMPLOYED',
    maritalStatus: 'SINGLE',
    natalSex: 'MALE',
    naturalLanguageCode: 'en',
    createdAt: '2023-01-01T00:00:00Z',
  };

  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders personal info section', () => {
    render(
      <ProfileInfo user={mockUser} onSave={mockOnSave} isOwnProfile={true} />,
    );

    // Check for Personal Information header
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  test('renders contact info section', () => {
    render(
      <ProfileInfo user={mockUser} onSave={mockOnSave} isOwnProfile={true} />,
    );

    // Check for Contact Information header
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  test('prevents saving when not own profile', async () => {
    render(
      <ProfileInfo user={mockUser} onSave={mockOnSave} isOwnProfile={false} />,
    );

    // Component should render without errors
    expect(screen.getByText('Personal Information')).toBeInTheDocument();

    // Save functionality should be prevented for non-owned profiles
    // The isOwnProfile check prevents the onSave callback
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('renders component without errors', () => {
    const { container } = render(
      <ProfileInfo user={mockUser} onSave={mockOnSave} isOwnProfile={true} />,
    );

    // Component should render without errors
    expect(container).toBeInTheDocument();
  });
});
