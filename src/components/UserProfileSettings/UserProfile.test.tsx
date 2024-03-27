import React from 'react';
import { render } from '@testing-library/react';
import UserProfile from './UserProfile';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

describe('UserProfile component', () => {
  test('renders user profile details correctly', () => {
    const userDetails = {
      firstName: 'John',
      lastName: 'Doe',
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

    expect(getByText('John')).toBeInTheDocument();
    expect(getByText('john.doe@example.com')).toBeInTheDocument();

    const profileImage = getByAltText('profile picture');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'profile-image-url');

    expect(getByText('Joined 1st May, 2021')).toBeInTheDocument();

    expect(getByText('Copy Profile Link')).toBeInTheDocument();
  });
});
