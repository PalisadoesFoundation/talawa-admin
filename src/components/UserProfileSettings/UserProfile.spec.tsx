import React from 'react';
import dayjs from 'dayjs';
import { render } from '@testing-library/react';
import UserProfile from './UserProfile';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});

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

    const avatarImage = profileAvatar.querySelector('img');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'profile-image-url');
    expect(getByText('Joined 13 April 2023')).toBeInTheDocument();
    expect(getByTestId('copyProfileLink')).toBeInTheDocument();
  });
  it('renders fallback avatar when image is null', () => {
    const userDetails = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      createdAt: new Date('2022-12-12'),
      image: null,
    };
    const castedUser = userDetails as unknown as Parameters<
      typeof UserProfile
    >[0];
    const { getByTestId } = renderWithProviders(
      <UserProfile {...castedUser} />,
    );
    // ProfileAvatarDisplay fallback renders a div with data-testid="profile-avatar"
    expect(getByTestId('profile-avatar')).toBeInTheDocument();
  });
  it('renders fallback avatar when image is the string "null"', () => {
    const userDetails = {
      firstName: 'Nora',
      lastName: 'Literal',
      email: 'nora@example.com',
      createdAt: new Date('2024-02-20'),
      image: 'null',
    };
    const { getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
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

describe('UserProfile edge and accessibility cases', () => {
  it('opens and closes enlarge modal with enableEnlarge', async () => {
    const user = userEvent.setup();
    const userDetails = {
      firstName: 'Modal',
      lastName: 'Test',
      image: 'https://example.com/avatar.jpg',
    };
    const { getByTestId, queryByRole, getByRole } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    const avatar = getByTestId('profile-avatar');
    // Click avatar to open modal
    await user.click(avatar);
    // Modal should appear (role dialog)
    expect(getByRole('dialog')).toBeInTheDocument();
    // Modal should have close button
    const closeBtn = getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
    // Close modal with button
    await user.click(closeBtn);
    expect(queryByRole('dialog')).not.toBeInTheDocument();
    // Reopen and close with Escape key
    await user.click(avatar);
    expect(getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders fallback avatar when image is undefined', () => {
    const userDetails = {
      firstName: 'Fallback',
      lastName: 'Undefined',
      image: undefined,
    };
    const { getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    expect(getByTestId('profile-avatar')).toBeInTheDocument();
  });

  it('renders empty fallbackName and fallback UI when names are missing', () => {
    const userDetails = {
      firstName: undefined,
      lastName: undefined,
      image: undefined,
    };
    const { getByTestId } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    // Avatar fallback UI should be present (no initials)
    expect(getByTestId('profile-avatar')).toBeInTheDocument();
    // Optionally, check for empty fallback text or aria-label
  });

  it('shows tooltip text and is keyboard accessible', async () => {
    const user = userEvent.setup();
    const userDetails = {
      firstName: 'Tooltip',
      lastName: 'Check',
      image: undefined,
    };
    const { getByText, getByTestId, getByRole } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    // Tooltip text should match fullName
    const nameSpan = getByText('Tooltip');
    expect(nameSpan).toHaveAttribute('data-tooltip-content', 'Tooltip Check');
    // Keyboard navigation: Tab to avatar (simulate real user)
    const avatar = getByTestId('profile-avatar');
    // Tab until avatar is focused (skip any preceding tabbable elements)
    // The avatar is the first tabbable element in the profile card
    await user.tab();
    expect(document.activeElement).toBe(avatar);
  });
});
