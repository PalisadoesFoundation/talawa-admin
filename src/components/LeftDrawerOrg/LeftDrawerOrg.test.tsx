import React, { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
import { ORGANIZATIONS_LIST_BY_CREATOR_ID } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const props: InterfaceLeftDrawerProps = {
  orgId: '64378abd85008f171cf2990d',
  targets: [
    {
      name: 'Dashboard',
      url: '/orgdash/6437904485008f171cf29924',
    },
    {
      name: 'People',
      url: '/orgpeople/6437904485008f171cf29924',
    },
    {
      name: 'Events',
      url: '/orgevents/6437904485008f171cf29924',
    },
    {
      name: 'Posts',
      url: '/orgpost/6437904485008f171cf29924',
    },
    {
      name: 'Block/Unblock',
      url: '/blockuser/6437904485008f171cf29924',
    },
    {
      name: 'Plugins',
      subTargets: [
        {
          name: 'Plugin Store',
          url: '/orgstore/6437904485008f171cf29924',
          icon: 'fa-store',
        },
      ],
    },
    {
      name: 'Settings',
      url: '/orgsetting/6437904485008f171cf29924',
    },
    {
      name: 'All Organizations',
      url: '/orglist/6437904485008f171cf29924',
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
    result: {
      data: {
        revokeRefreshTokenForUser: true,
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_LIST_BY_CREATOR_ID,
      variables: { id: '64378abd85008f171cf2990d' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '6437904485008f171cf29924',
            image: null,
            name: 'Unity Foundation',
            description:
              'A foundation aimed at uniting the world and making it a better place for all.',
            address: {
              city: 'Bronx',
              countryCode: 'US',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Random Street',
              line2: 'Apartment 456',
              postalCode: '10451',
              sortingCode: 'ABC-123',
              state: 'NYC',
            },
            userRegistrationRequired: false,
            visibleInSearch: true,
            members: [
              '64378abd85008f171cf2990d',
              '658930fd2caa9d8d6908745c',
              '6589386a2caa9d8d69087484',
              '6589387e2caa9d8d69087485',
              '6589388b2caa9d8d69087486',
              '6589389d2caa9d8d69087487',
              '658938a62caa9d8d69087488',
              '658938b02caa9d8d69087489',
              '658938ba2caa9d8d6908748a',
            ],
            admins: ['64378abd85008f171cf2990d'],
            groupChats: [],
            posts: [],
            pinnedPosts: [],
            membershipRequests: [],
            blockedUsers: [],
            creatorId: '64378abd85008f171cf2990d',
            createdAt: '2023-04-13T05:16:52.827Z',
          },
        ],
      },
    },
  },
];

const MOCKS_WITH_IMAGE = [
  {
    request: {
      query: ORGANIZATIONS_LIST_BY_CREATOR_ID,
      variables: { id: '64378abd85008f171cf2990d' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '6437904485008f171cf29924',
            image:
              'https://api.dicebear.com/5.x/initials/svg?seed=Unity%20Foundation', // Unity Foundation image
            name: 'Unity Foundation',
            description:
              'A foundation aimed at uniting the world and making it a better place for all.',
            address: {
              city: 'Bronx',
              countryCode: 'US',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Random Street',
              line2: 'Apartment 456',
              postalCode: '10451',
              sortingCode: 'ABC-123',
              state: 'NYC',
            },
            userRegistrationRequired: false,
            visibleInSearch: true,
            members: [
              '64378abd85008f171cf2990d',
              '658930fd2caa9d8d6908745c',
              '6589386a2caa9d8d69087484',
              '6589387e2caa9d8d69087485',
              '6589388b2caa9d8d69087486',
              '6589389d2caa9d8d69087487',
              '658938a62caa9d8d69087488',
              '658938b02caa9d8d69087489',
              '658938ba2caa9d8d6908748a',
            ],
            admins: ['64378abd85008f171cf2990d'],
            groupChats: [],
            posts: [],
            pinnedPosts: [],
            membershipRequests: [],
            blockedUsers: [],
            creatorId: '64378abd85008f171cf2990d',
            createdAt: '2023-04-13T05:16:52.827Z',
          },
        ],
      },
    },
  },
];

const MOCKS_EMPTY = [
  {
    request: {
      query: ORGANIZATIONS_LIST_BY_CREATOR_ID,
      variables: { id: '64378abd85008f171cf2990d' },
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

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

beforeEach(() => {
  setItem('FirstName', 'John');
  setItem('LastName', 'Doe');
  setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const link = new StaticMockLink(MOCKS, true);
const linkImage = new StaticMockLink(MOCKS_WITH_IMAGE, true);
const linkEmpty = new StaticMockLink(MOCKS_EMPTY, true);

describe('Testing LeftDrawerOrg component for SUPERADMIN', () => {
  test('Component should be rendered properly', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    defaultScreens.map((screenName) => {
      expect(screen.getByText(screenName)).toBeInTheDocument();
    });
  });

  test('Testing Profile Page & Organization Detail Modal', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(await screen.findByTestId(/orgBtn/i)).toBeInTheDocument();
  });

  test('Testing Menu Buttons', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByText('Dashboard'));
    expect(global.window.location.pathname).toContain(
      '/orgdash/6437904485008f171cf29924',
    );
  });

  test('Testing when screen size is less than 820px', async () => {
    setItem('SuperAdmin', true);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    resizeWindow(800);
    expect(screen.getAllByText(/Dashboard/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/People/i)[0]).toBeInTheDocument();

    const peopelBtn = screen.getByTestId(/People/i);
    userEvent.click(peopelBtn);
    await wait();
    expect(window.location.pathname).toContain(
      '/orgpeople/6437904485008f171cf29924',
    );
  });

  test('Testing when image is present for Organization', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={linkImage}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  test('Testing when Organization does not exists', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={linkEmpty}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(
      screen.getByText(/Error occured while loading Organization data/i),
    ).toBeInTheDocument();
  });

  test('Testing Drawer when hideDrawer is null', () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });

  test('Testing Drawer when hideDrawer is true', () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={true} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });
});
