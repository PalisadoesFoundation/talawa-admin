import React from 'react';
import { render } from '@testing-library/react';
import UserProfile from './UserProfile';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { describe, it, expect } from 'vitest';

describe('UserProfile component', () => {
  it('renders user profile details correctly', () => {
    const userDetails = {
      firstName: 'Christopher',
      lastName: 'Doe',
      createdAt: '2023-04-13T04:53:17.742+00:00',
      email: 'john.doe@example.com',
      image: 'profile-image-url',
    };
    const { getByText, getByAltText } = render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserProfile {...userDetails} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(getByText('Chris..')).toBeInTheDocument();
    expect(getByText('john..@example.com')).toBeInTheDocument();

    const profileImage = getByAltText('profile picture');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'profile-image-url');

    expect(getByText('Joined 13 April 2023')).toBeInTheDocument();

    expect(getByText('Copy Profile Link')).toBeInTheDocument();
  });
});
