import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCard from './OrganizationCard';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { MockedProvider } from '@apollo/client/testing';

const props = {
  id: '123',
  image: 'test.jpg',
  name: 'Test Organization',
  description: 'Test Description',
  admins: [{ id: '1' }],
  members: [{ id: '1' }, { id: '2' }],
  address: {
    city: 'Test City',
    countryCode: 'TC',
    line1: 'Test Line 1',
    postalCode: '12345',
    state: 'Test State',
  },
  membershipRequestStatus: '',
  userRegistrationRequired: false,
  membershipRequests: [],
};

describe('Organization Card', () => {
  test('renders organization card with image', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders organization card without image', () => {
    const propsWithoutImage = {
      ...props,
      image: '',
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard {...propsWithoutImage} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('emptyContainerForImage')).toBeInTheDocument();
  });
});
