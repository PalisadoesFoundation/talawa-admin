import React from 'react';
import { render } from '@testing-library/react';
import UserProfile from './UserProfile';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import translation from '../../../../public/locales/en/translation.json';
import common from '../../../../public/locales/en/common.json';
import { describe, it, expect, afterEach, vi } from 'vitest';
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
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders with complete user data and shows truncated name and email', () => {
    const userDetails = {
      firstName: 'Christopher',
      lastName: 'Doe',
      createdAt: dayjs.utc().subtract(1, 'year').toDate(),
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
    expect(
      getByText(
        `Joined ${dayjs.utc(userDetails.createdAt).format('D MMMM YYYY')}`,
      ),
    ).toBeInTheDocument();

    expect(getByTestId('copyProfileLink')).toBeInTheDocument();
  });
  it('renders Avatar when image is null', () => {
    const userDetails = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      createdAt: dayjs.utc().subtract(1, 'year').toDate(),
      image: 'null',
    };

    const { getByAltText } = renderWithProviders(
      <UserProfile {...userDetails} />,
    );
    expect(getByAltText(translation.settings.dummyPicture)).toBeInTheDocument();
  });
  it('renders full firstName and email when they are short', () => {
    const userDetails = {
      firstName: 'Bob',
      lastName: 'Lee',
      email: 'bob@ex.com',
      createdAt: dayjs.utc().subtract(1, 'year').toDate(),
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
      createdAt: dayjs.utc().subtract(1, 'year').toDate(),
      image: 'https://example.com/lily.jpg',
    };

    const { getByText } = renderWithProviders(<UserProfile {...userDetails} />);
    expect(
      getByText(
        `Joined ${dayjs.utc(userDetails.createdAt).format('D MMMM YYYY')}`,
      ),
    ).toBeInTheDocument();
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
    expect(getByText(`Joined ${common.unavailable}`)).toBeInTheDocument();
  });
  it('handles createdAt passed as a string and formats it correctly', () => {
    const userDetails = {
      firstName: 'Clara',
      lastName: 'Jones',
      email: 'clara@example.com',
      createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
      image: 'https://example.com/clara.jpg',
    };

    const { getByText } = renderWithProviders(<UserProfile {...userDetails} />);
    expect(
      getByText(
        `Joined ${dayjs.utc(userDetails.createdAt).format('D MMMM YYYY')}`,
      ),
    ).toBeInTheDocument();
  });

  it('renders "Unavailable" when createdAt is null', () => {
    const userDetails = {
      firstName: 'Null',
      lastName: 'User',
      email: 'null@example.com',
      createdAt: null,
      image: 'https://example.com/null.jpg',
    };

    const { getByText } = renderWithProviders(<UserProfile {...userDetails} />);
    expect(getByText(`Joined ${common.unavailable}`)).toBeInTheDocument();
  });

  it('renders "Unavailable" when createdAt is undefined', () => {
    const userDetails = {
      firstName: 'Undefined',
      lastName: 'User',
      email: 'undefined@example.com',
      createdAt: undefined,
      image: 'https://example.com/undefined.jpg',
    };

    const { getByText } = renderWithProviders(<UserProfile {...userDetails} />);
    expect(getByText(`Joined ${common.unavailable}`)).toBeInTheDocument();
  });
});
