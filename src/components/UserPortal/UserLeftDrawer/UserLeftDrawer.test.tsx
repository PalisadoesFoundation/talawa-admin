import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';
import UserLeftDrawer from './UserLeftDrawer';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import 'jest-localstorage-mock';
import { act } from 'react-dom/test-utils';

const props = {
  hideDrawer: false,
  setHideDrawer: jest.fn(),
  screenName: 'Organizations',
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
          image: 'https://testimage.com/testimage.jpg',
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
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS2, true);

beforeEach(() => {
  localStorage.setItem('userId', '1');
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing UserLeftDrawer Component [User Portal]', () => {
  test('Component is rendered properly', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getByTestId('talawaLogo')).toBeInTheDocument();
    expect(getByText('Talawa User Portal')).toBeInTheDocument();
    expect(getByText('Menu')).toBeInTheDocument();
    expect(getByText('My Organizations')).toBeInTheDocument();
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Test User')).toBeInTheDocument();
    expect(getByText('user')).toBeInTheDocument();
    expect(getByTestId('profileImage')).toBeInTheDocument();
    expect(getByTestId('orgButton')).toBeInTheDocument();
    expect(getByTestId('settingsButton')).toBeInTheDocument();
    expect(getByText('Sign out')).toBeInTheDocument();
    expect(getByTestId('collapseButton')).toBeInTheDocument();
  });

  test('Testing image render', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getByTestId('profileImage')).toBeInTheDocument();
  });

  test('Testing hiding drawer functionality', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    fireEvent.click(getByTestId('collapseButton'));
  });

  test('Testing navigation functionality', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();

    fireEvent.click(getByText('My Organizations'));
    expect(global.window.location.pathname).toBe('/user/organizations');
    expect(getByTestId('orgButton')).toHaveClass('text-white');

    fireEvent.click(getByTestId('profileButton'));
    expect(global.window.location.pathname).toBe('/user/settings');
  });

  test('Testing navigate to setting', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserLeftDrawer {...{ ...props, screenName: 'Settings' }} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();

    fireEvent.click(getByText('Settings'));
    expect(global.window.location.pathname).toBe('/user/settings');
    expect(getByTestId('settingsButton')).toHaveClass('text-white');
  });

  test('Testing logout functionality', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UserLeftDrawer {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    fireEvent.click(getByText('Sign out'));
    expect(localStorage.clear).toHaveBeenCalled();
    expect(global.window.location.pathname).toBe('/user');
  });
});
