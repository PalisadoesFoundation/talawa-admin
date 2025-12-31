import React from 'react';
import { render } from '@testing-library/react';
import UserProfile from './UserProfile';
import { MockedProvider } from '@apollo/client/testing/react';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { describe, it, expect } from 'vitest';

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
      createdAt: new Date('2023-04-13'),
      email: 'john.doe@example.com',
      image: 'profile-image-url',
    };

    const { getByText, getByAltText, getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );

    expect(getByText('Chris..')).toBeInTheDocument();

    expect(getByText('john..@example.com')).toBeInTheDocument();

    const profileImage = getByAltText('profile picture');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'profile-image-url');
    expect(getByText('Joined 13 April 2023')).toBeInTheDocument();

    expect(getByTestId('copyProfileLink')).toBeInTheDocument();
  });
  it('renders Avatar when image is null', () => {
    const userDetails = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      createdAt: new Date('2022-12-12'),
      image: 'null',
    };

    const { getByAltText } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    expect(getByAltText('dummy picture')).toBeInTheDocument();
  });
  it('renders full firstName and email when they are short', () => {
    const userDetails = {
      firstName: 'Bob',
      lastName: 'Lee',
      email: 'bob@ex.com',
      createdAt: new Date('2023-05-01'),
      image: 'https://example.com/image.jpg',
    };

    const { getByText } = renderWithProviders(<UserProfile {...userDetails} />);

    expect(getByText('Bob')).toBeInTheDocument();
    expect(getByText('bob@ex.com')).toBeInTheDocument();
  });
  it('renders formatted join date when createdAt is valid', () => {
    const userDetails = {
      firstName: 'Lily',
      lastName: 'Brown',
      email: 'lily@example.com',
      createdAt: new Date('2022-01-15'),
      image: 'https://example.com/lily.jpg',
    };

    const { getByText } = renderWithProviders(<UserProfile {...userDetails} />);
    expect(getByText('Joined 15 January 2022')).toBeInTheDocument();
  });
  it('renders "Unavailable" when createdAt is invalid', () => {
    const userDetails = {
      firstName: 'Mark',
      lastName: 'Twain',
      email: 'mark@example.com',
      createdAt: new Date('invalid-date'),
      image: 'https://example.com/mark.jpg',
    };

    const { getByText } = renderWithProviders(<UserProfile {...userDetails} />);
    expect(getByText('Joined Unavailable')).toBeInTheDocument();
  });
  it('handles createdAt passed as a string and formats it correctly', () => {
    const userDetails = {
      firstName: 'Clara',
      lastName: 'Jones',
      email: 'clara@example.com',
      createdAt: '2023-02-10',
      image: 'https://example.com/clara.jpg',
    };

    const castedUser = userDetails as unknown as Parameters<
      typeof UserProfile
    >[0];

    const { getByText } = renderWithProviders(<UserProfile {...castedUser} />);
    expect(getByText('Joined 10 February 2023')).toBeInTheDocument();
  });
});
