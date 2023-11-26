import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import i18nForTest from 'utils/i18nForTest';
import type { InterfaceLeftDrawerProps } from './LeftDrawerOrg';
import LeftDrawerOrg from './LeftDrawerOrg';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { store } from 'state/store';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { act } from 'react-dom/test-utils';
import { StaticMockLink } from 'utils/StaticMockLink';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';

const props: InterfaceLeftDrawerProps = {
  screenName: 'Dashboard',
  orgId: '123',
  targets: [
    {
      name: 'Dashboard',
      url: '/orgdash/id=123',
    },
    {
      name: 'People',
      url: '/orgpeople/id=123',
    },
    {
      name: 'Events',
      url: '/orgevents/id=123',
    },
    {
      name: 'Posts',
      url: '/orgpost/id=123',
    },
    {
      name: 'Block/Unblock',
      url: '/blockuser/id=123',
    },
    {
      name: 'Plugins',
      subTargets: [
        {
          name: 'Plugin Store',
          url: '/orgstore/id=123',
          icon: 'fa-store',
        },
      ],
    },
    {
      name: 'Settings',
      url: '/orgsetting/id=123',
    },
    {
      name: 'All Organizations',
      url: '/orglist/id=123',
    },
  ],
  hideDrawer: false,
  setHideDrawer: jest.fn(),
};

const MOCKS = [
  {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {},
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
            location: 'Gotham, DC',
            isPublic: true,
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
  },
];

const MOCKS_WITH_IMAGE = [
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
            image:
              'https://api.dicebear.com/5.x/initials/svg?seed=Test%20Organization',
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'JohnDoe@example.com',
            },
            name: 'Test Organization',
            description: 'Testing this organization',
            location: 'Gotham, DC',
            isPublic: true,
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
  },
];
const MOCKS_EMPTY = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
];

const defaultScreens = [
  'Dashboard',
  'People',
  'Events',
  'Posts',
  'Block/Unblock',
  'Plugins',
  'Settings',
  'All Organizations',
];

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
beforeEach(() => {
  localStorage.setItem('FirstName', 'John');
  localStorage.setItem('LastName', 'Doe');
  localStorage.setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe'
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const link = new StaticMockLink(MOCKS, true);
const linkImage = new StaticMockLink(MOCKS_WITH_IMAGE, true);
const linkEmpty = new StaticMockLink(MOCKS_EMPTY, true);

describe('Testing Left Drawer component for SUPERADMIN', () => {
  test('Component should be rendered properly', async () => {
    localStorage.setItem('UserImage', '');
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    defaultScreens.map((screenName) => {
      expect(screen.getByText(screenName)).toBeInTheDocument();
    });
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Superadmin/i)).toBeInTheDocument();
    expect(screen.getByAltText(/dummy picture/i)).toBeInTheDocument();
  });

  test('Testing Profile Page & Organization Detail Modal', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    expect(screen.getByTestId(/orgBtn/i)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(/profileBtn/i));
  });

  test('Testing Menu Buttons', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    userEvent.click(screen.getByText('Dashboard'));
    expect(global.window.location.pathname).toContain('/orgdash/id=123');
  });

  test('Testing when image is present for Organization', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={linkImage}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
  });

  test('Testing when Organization does not exists', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={linkEmpty}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    expect(
      screen.getByText(/Error Occured while loading the Organization/i)
    ).toBeInTheDocument();
  });

  test('Testing Drawer when hideDrawer is null', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
  });

  test('Testing Drawer when hideDrawer is true', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={true} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
  });

  test('Testing Drawer open close functionality', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    const closeModalBtn = screen.getByTestId(/closeModalBtn/i);
    userEvent.click(closeModalBtn);
  });

  test('Testing logout functionality', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    userEvent.click(screen.getByTestId('logoutBtn'));
    expect(localStorage.clear).toHaveBeenCalled();
    expect(global.window.location.pathname).toBe('/');
  });
});
