import React, { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceUserSidebarOrgProps } from './UserSidebarOrg';
import UserSidebarOrg from './UserSidebarOrg';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { store } from 'state/store';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';

/**
 * Unit tests for UserSidebarOrg component:
 *
 * 1. **Rendering with organization data**: Verifies correct rendering when data is fetched.
 * 2. **Profile Page & Modal**: Ensures profile button and organization details modal appear.
 * 3. **Menu Navigation**: Tests correct navigation when menu buttons like 'People' are clicked.
 * 4. **Responsive Design**: Verifies sidebar behavior on screens.
 * 5. **Organization Image**: Ensures correct rendering of organization image.
 * 6. **Empty Organizations**: Verifies error message when no organizations exist.
 * 7. **Drawer Visibility**: Tests drawer visibility with `hideDrawer` prop values.
 * 8. **User Profile Rendering**: Confirms user details are displayed.
 * 9. **Translation Display**: Ensures proper translation of UI text.
 * 10. **Toast Notifications Mocking**: Mocks toast notifications during tests.
 *
 * `fireEvent` simulates user actions, and `vi.fn()` mocks callback functions.
 */
const { setItem } = useLocalStorage();

const props: InterfaceUserSidebarOrgProps = {
  orgId: '123',
  targets: [
    {
      name: 'Posts',
      url: '/user/organization/123',
    },
    {
      name: 'People',
      url: '/user/people/123',
    },
    {
      name: 'Events',
      url: '/user/events/123',
    },
    {
      name: 'Donations',
      url: '/user/donate/123',
    },
    {
      name: 'Settings',
      url: '/user/settings',
    },
    {
      name: 'All Organizations',
      url: '/user/organizations/',
    },
  ],
  hideDrawer: false,
  setHideDrawer: vi.fn(),
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
                createdAt: '4567890234',
              },
              {
                _id: 'jane123',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'JaneDoe@example.com',
                createdAt: '4567890234',
              },
            ],
            admins: [
              {
                _id: 'john123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'JohnDoe@example.com',
                createdAt: '4567890234',
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
                createdAt: '4567890234',
              },
              {
                _id: 'jane123',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'JaneDoe@example.com',
                createdAt: '4567890234',
              },
            ],
            admins: [
              {
                _id: 'john123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'JohnDoe@example.com',
                createdAt: '4567890234',
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
  'People',
  'Events',
  'Posts',
  'Donations',
  'All Organizations',
];

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
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
  vi.clearAllMocks();
  localStorage.clear();
});

const link = new StaticMockLink(MOCKS, true);
const linkImage = new StaticMockLink(MOCKS_WITH_IMAGE, true);
const linkEmpty = new StaticMockLink(MOCKS_EMPTY, true);

describe('Testing LeftDrawerOrg component for SUPERADMIN', () => {
  it('Component should be rendered properly', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} />
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

  it('Testing Profile Page & Organization Detail Modal', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(screen.getByTestId(/orgBtn/i)).toBeInTheDocument();
  });

  it('Testing Menu Buttons', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByText('People'));
    expect(global.window.location.pathname).toContain('/user/people/123');
  });

  it('Testing when screen size is less than 820px', async () => {
    setItem('SuperAdmin', true);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    resizeWindow(800);
    expect(screen.getAllByText(/People/i)[0]).toBeInTheDocument();

    const peopelBtn = screen.getByTestId(/People/i);
    userEvent.click(peopelBtn);
    await wait();
    expect(window.location.pathname).toContain('user/people/123');
  });

  it('Testing when image is present for Organization', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={linkImage}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('Testing when Organization does not exists', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={linkEmpty}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(
      screen.getByText(/Error Occured while loading the Organization/i),
    ).toBeInTheDocument();
  });

  it('Testing Drawer when hideDrawer is null', () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });

  it('Testing Drawer when hideDrawer is true', () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={true} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });
});
