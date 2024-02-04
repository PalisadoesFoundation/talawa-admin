import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import OrgLeftDrawer from './OrgLeftDrawer';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { ORGANIZATIONS_LIST, USER_DETAILS } from 'GraphQl/Queries/Queries';
import { act } from 'react-dom/test-utils';
import 'jest-localstorage-mock';
import 'jest-location-mock';

const props = {
  hideDrawer: false,
  setHideDrawer: jest.fn(),
  screenName: 'Posts',
};

const MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'User',
          image: null,
          firstName: 'Test',
          lastName: 'User',
          email: 'user1@test.com',
          role: 'USER',
          appLanguageCode: 'en',
          userType: 'USER',
          pluginCreationAllowed: false,
          adminApproved: true,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
        },
      },
    },
    loading: false,
  },
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'JohnDoe@example.com',
            },
            name: 'Test Organization',
            description: 'Testing this organization',
            address: {
              city: 'Delhi',
              countryCode: 'IN',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Random Street',
              line2: 'Apartment 456',
              postalCode: '110001',
              sortingCode: 'ABC-123',
              state: 'Delhi',
            },
            userRegistrationRequired: true,
            visibleInSearch: true,
            members: [
              {
                _id: 'john123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'JohnDoe@example.com',
              },
              {
                _id: 'jane123',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'JaneDoe@example.com',
              },
            ],
            admins: [
              {
                _id: 'john123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'JohnDoe@example.com',
              },
            ],
            membershipRequests: [],
            blockedUsers: [],
          },
        ],
      },
    },
    loading: false,
  },
  {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {},
  },
];

const MOCKS2 = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'User',
          image: 'testimage.com/testimage.png',
          firstName: 'Test',
          lastName: 'User',
          email: 'user1@test.com',
          role: 'USER',
          appLanguageCode: 'en',
          userType: 'USER',
          pluginCreationAllowed: false,
          adminApproved: true,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
        },
      },
    },
    loading: false,
  },
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            image: 'testimage.com/testimage.png',
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'JohnDoe@example.com',
            },
            name: 'Test Organization',
            description: 'Testing this organization',
            address: {
              city: 'Delhi',
              countryCode: 'IN',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Random Street',
              line2: 'Apartment 456',
              postalCode: '110001',
              sortingCode: 'ABC-123',
              state: 'Delhi',
            },
            userRegistrationRequired: true,
            visibleInSearch: true,
            members: [
              {
                _id: 'john123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'JohnDoe@example.com',
              },
              {
                _id: 'jane123',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'JaneDoe@example.com',
              },
            ],
            admins: [
              {
                _id: 'john123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'JohnDoe@example.com',
              },
            ],
            membershipRequests: [],
            blockedUsers: [],
          },
        ],
      },
    },
    loading: false,
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS2, true);

async function wait(ms = 1000): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://example.com/user/organization/id=123',
    },
    writable: true,
  });
  localStorage.setItem('userId', '1');
});

describe('Testing OrgLeftDrawer component [User Portal]', () => {
  test('Component is rendered properly', async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    expect(getByTestId('talawaLogo')).toBeInTheDocument();
    expect(getByText('Talawa User Portal')).toBeInTheDocument();
    expect(getByText('Test Organization')).toBeInTheDocument();
    expect(getByText('Delhi')).toBeInTheDocument();
    expect(getByText('Menu')).toBeInTheDocument();
    expect(getByText('Posts')).toBeInTheDocument();
    expect(getByText('Events')).toBeInTheDocument();
    expect(getByText('Donations')).toBeInTheDocument();
    expect(getByText('Test User')).toBeInTheDocument();
    expect(getByText('user')).toBeInTheDocument();
    expect(getByText('Sign out')).toBeInTheDocument();
  });

  test('Testing hidedrawer functionality', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    const collapseButton = getByTestId('collapseButton');
    expect(collapseButton).toBeInTheDocument();
    fireEvent.click(collapseButton);
  });

  test('Testing navigation functionality', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    fireEvent.click(getByText('Posts'));
    fireEvent.click(getByText('Events'));
    fireEvent.click(getByText('Donations'));
    fireEvent.click(getByText('Test Organization'));
    fireEvent.click(getByText('Test User'));
  });

  test('Testing image to render if available', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
  });

  test('Testing logout functionality', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    fireEvent.click(getByText('Sign out'));
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
