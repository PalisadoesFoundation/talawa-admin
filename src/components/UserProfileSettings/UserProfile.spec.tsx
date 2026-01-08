import React from 'react';
import { render } from '@testing-library/react';
import UserProfile from './UserProfile';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <MockedProvider>
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>{ui}</I18nextProvider>
      </BrowserRouter>
    </MockedProvider>,
  );

describe('UserProfile Component', () => {
  it('renders with complete user data and shows truncated name and email', () => {
    const userDetails = {
      firstName: 'Christopher',
      lastName: 'Doe',
      createdAt: dayjs.utc().subtract(1, 'year').toDate(),
      email: 'john.doe@example.com',
      image: 'profile-image-url',
    };

    const { getByText, getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );

    expect(getByText('Chris..')).toBeInTheDocument();
    expect(getByText('john..@example.com')).toBeInTheDocument();

    const profileAvatar = getByTestId('profile-avatar');
    expect(profileAvatar).toBeInTheDocument();
    expect(profileAvatar.querySelector('img')).toHaveAttribute(
      'src',
      'profile-image-url',
    );
    expect(getByText('Joined 13 April 2023')).toBeInTheDocument();
    expect(getByTestId('copyProfileLink')).toBeInTheDocument();
  });
  it('renders fallback avatar when image is null', () => {
    const userDetails = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      createdAt: dayjs.utc().subtract(1, 'year').toDate(),
      image: 'null',
    };
    const { getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    // ProfileAvatarDisplay fallback renders a div with data-testid="profile-avatar"
    expect(getByTestId('profile-avatar')).toBeInTheDocument();
  });
  it('renders full firstName and email when they are short', () => {
    const userDetails = {
      firstName: 'Bob',
      lastName: 'Lee',
      email: 'bob@ex.com',
      createdAt: dayjs.utc().subtract(1, 'year').toDate(),
      image: 'https://example.com/image.jpg',
    };

    const { getByText, getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    expect(getByText('Bob')).toBeInTheDocument();
    expect(getByText('bob@ex.com')).toBeInTheDocument();
    expect(getByTestId('profile-avatar')).toBeInTheDocument();
  });
  it('renders formatted join date when createdAt is valid', () => {
    const userDetails = {
      firstName: 'Lily',
      lastName: 'Brown',
      email: 'lily@example.com',
      createdAt: dayjs.utc().subtract(1, 'year').toDate(),
      image: 'https://example.com/lily.jpg',
    };

    const { getByText, getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    expect(getByText('Joined 15 January 2022')).toBeInTheDocument();
    expect(getByTestId('profile-avatar')).toBeInTheDocument();
  });
  it('renders "Unavailable" when createdAt is invalid', () => {
    const userDetails = {
      firstName: 'Mark',
      lastName: 'Twain',
      email: 'mark@example.com',
      createdAt: new Date('invalid-date'),
      image: 'https://example.com/mark.jpg',
    };

    const { getByText, getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    expect(getByText('Joined Unavailable')).toBeInTheDocument();
    expect(getByTestId('profile-avatar')).toBeInTheDocument();
  });
  it('handles createdAt passed as a string and formats it correctly', () => {
    const userDetails = {
      firstName: 'Clara',
      lastName: 'Jones',
      email: 'clara@example.com',
      createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
      image: 'https://example.com/clara.jpg',
    };

    const castedUser = userDetails as unknown as Parameters<
      typeof UserProfile
    >[0];

    const { getByText, getByTestId } = renderWithProviders(
      <UserProfile {...castedUser} />,
    );
    expect(getByText('Joined 10 February 2023')).toBeInTheDocument();
    expect(getByTestId('profile-avatar')).toBeInTheDocument();
  });
});
