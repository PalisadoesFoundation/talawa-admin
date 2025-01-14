import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import OrganizationCard from './OrganizationCard';

// Initialize i18n for testing
i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        users: {
          MembershipRequestSent: 'Request sent',
          orgJoined: 'Joined',
          AlreadyJoined: 'Already joined',
          errorOccured: 'Error occurred',
          MembershipRequestNotFound: 'Request not found',
          MembershipRequestWithdrawn: 'Request withdrawn',
          visit: 'Visit',
          withdraw: 'Withdraw',
          joinNow: 'Join Now',
        },
      },
      common: {
        admins: 'Admins',
        members: 'Members',
      },
    },
  },
});

// Wrapper component to provide all required contexts
const TestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  return (
    <MockedProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>{children}</BrowserRouter>
      </I18nextProvider>
    </MockedProvider>
  );
};

describe('Testing the Organization Card', () => {
  it('should render props and text elements test for the page component', () => {
    const props = {
      id: '123',
      image: 'https://via.placeholder.com/80',
      firstName: 'John',
      lastName: 'Doe',
      name: 'Sample',
      description: '',
      admins: [],
      members: [],
      address: {
        city: '',
        countryCode: '',
        line1: '',
        postalCode: '',
        state: '',
      },
      membershipRequestStatus: '',
      userRegistrationRequired: false,
      membershipRequests: [],
    };

    render(
      <TestWrapper>
        <OrganizationCard {...props} />
      </TestWrapper>,
    );

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText(/Admins/i)).toBeInTheDocument();
    expect(screen.getByText(/Members/i)).toBeInTheDocument();
  });

  it('Should render text elements when props value is not passed', () => {
    const props = {
      id: '123',
      image: '',
      firstName: 'John',
      lastName: 'Doe',
      name: 'Sample',
      description: '',
      admins: [],
      members: [],
      address: {
        city: '',
        countryCode: '',
        line1: '',
        postalCode: '',
        state: '',
      },
      membershipRequestStatus: '',
      userRegistrationRequired: false,
      membershipRequests: [],
    };

    render(
      <TestWrapper>
        <OrganizationCard {...props} />
      </TestWrapper>,
    );

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText(/Admins/i)).toBeInTheDocument();
    expect(screen.getByText(/Members/i)).toBeInTheDocument();
  });
});
