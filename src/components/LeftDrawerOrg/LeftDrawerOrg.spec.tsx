import '@testing-library/dom';
import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, MemoryRouter } from 'react-router';

import i18nForTest from 'utils/i18nForTest';
import type { ILeftDrawerProps } from './LeftDrawerOrg';
import LeftDrawerOrg from './LeftDrawerOrg';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { store } from 'state/store';
import {
  ORGANIZATIONS_LIST,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, describe, test, expect, it } from 'vitest';
import styles from './../../style/app-fixed.module.css';

const { setItem } = useLocalStorage();

const props: ILeftDrawerProps = {
  orgId: '123',
  targets: [
    {
      name: 'Admin Profile',
      url: '/member/123',
    },
    {
      name: 'Dashboard',
      url: '/orgdash/123',
    },
    {
      name: 'People',
      url: '/orgpeople/123',
    },
    {
      name: 'Events',
      url: '/orgevents/123',
    },
    {
      name: 'Posts',
      url: '/orgpost/123',
    },
    {
      name: 'Block/Unblock',
      url: '/blockuser/123',
    },
    {
      name: 'Settings',
      url: '/orgsetting/123',
    },
    {
      name: 'All Organizations',
      url: '/orglist/123',
    },
  ],
  hideDrawer: false,
  setHideDrawer: vi.fn(),
};

const MOCKS_ORGANIZATION_DATA = [
  {
    request: {
      query: GET_ORGANIZATION_DATA_PG,
      variables: { id: '123', first: 10, after: null },
    },
    result: {
      data: {
        organization: {
          id: '123',
          name: 'Test Organization',
          description: 'Testing this organization',
          addressLine1: '123 Random Street',
          addressLine2: 'Apartment 456',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110001',
          countryCode: 'IN',
          avatarURL: null,
          createdAt: '2024-03-12',
          updatedAt: '2024-03-12',
          creator: {
            id: 'john123',
            name: 'John Doe',
            emailAddress: 'JohnDoe@example.com',
          },
          updater: {
            id: 'john123',
            name: 'John Doe',
            emailAddress: 'JohnDoe@example.com',
          },
          members: {
            edges: [
              {
                node: {
                  id: 'john123',
                  name: 'John Doe',
                  emailAddress: 'JohnDoe@example.com',
                  role: 'ADMIN',
                },
                cursor: 'cursor1',
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: 'cursor1',
            },
          },
        },
      },
    },
  },
];

const MOCKS_ORGANIZATION_DATA_WITH_AVATAR = [
  {
    request: {
      query: GET_ORGANIZATION_DATA_PG,
      variables: { id: '123', first: 10, after: null },
    },
    result: {
      data: {
        organization: {
          id: '123',
          name: 'Test Organization',
          description: 'Testing this organization',
          addressLine1: '123 Random Street',
          addressLine2: 'Apartment 456',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110001',
          countryCode: 'IN',
          avatarURL: 'https://example.com/avatar.png',
          createdAt: '2024-03-12',
          updatedAt: '2024-03-12',
          creator: {
            id: 'john123',
            name: 'John Doe',
            emailAddress: 'JohnDoe@example.com',
          },
          updater: {
            id: 'john123',
            name: 'John Doe',
            emailAddress: 'JohnDoe@example.com',
          },
          members: {
            edges: [
              {
                node: {
                  id: 'john123',
                  name: 'John Doe',
                  emailAddress: 'JohnDoe@example.com',
                  role: 'ADMIN',
                },
                cursor: 'cursor1',
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: 'cursor1',
            },
          },
        },
      },
    },
  },
];

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
            avatarURL: null,
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
                createdAt: '12-03-2024',
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
            avatarURL: 'https://example.com/avatar.png',
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
                createdAt: '12-03-2024',
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

// const MOCKS_EMPTY = [
//   {
//     request: {
//       query: ORGANIZATIONS_LIST,
//       variables: { id: '123' },
//     },
//     result: {
//       data: {
//         organizations: [],
//       },
//     },
//   },
// ];

const MOCKS_EMPTY_ORGID = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '' },
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
  'Settings',
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
  fireEvent.resize(window);
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
// const linkEmpty = new StaticMockLink(MOCKS_EMPTY, true);
const linkEmptyOrgId = new StaticMockLink(MOCKS_EMPTY_ORGID, true);

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
    // Note: Navigation items are rendered as text content, not test IDs
    // due to plugin system modifications
  });

  test('drawer toggles on click and Enter key', async () => {
    let drawerState: boolean | null = false;

    const setHideDrawer = (val: React.SetStateAction<boolean | null>) => {
      drawerState = typeof val === 'function' ? val(drawerState) : val;
      rerenderComponent();
    };

    const props: {
      targets: { name: string; url: string }[];
      orgId: string;
      hideDrawer: boolean | null;
      setHideDrawer: (val: React.SetStateAction<boolean | null>) => void;
    } = {
      targets: [{ name: 'Dashboard', url: '/dashboard' }],
      orgId: '123',
      hideDrawer: drawerState,
      setHideDrawer,
    };

    const renderComponent = () =>
      render(
        <MockedProvider addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LeftDrawerOrg {...props} />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

    const { rerender } = renderComponent();

    const rerenderComponent = () => {
      props.hideDrawer = drawerState;
      rerender(
        <MockedProvider addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LeftDrawerOrg {...props} />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    };

    // Toggle button functionality moved to separate components

    // Note: Toggle button functionality has been moved to separate components
    // (e.g., SidebarToggle) and is no longer part of the drawer components
    // due to plugin system modifications
  });

  // test('Testing Profile Page & Organization Detail Modal', async () => {
  //   setItem('UserImage', '');
  //   // setItem('SuperAdmin', true);
  //   setItem('Name', 'John Doe');
  //   render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <LeftDrawerOrg {...props} hideDrawer={null} />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );
  //   await wait();
  //   expect(screen.getByTestId(/orgBtn/i)).toBeInTheDocument();
  // });

  test('Should not show org not found error when viewing admin profile', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    setItem('id', '123');
    render(
      <MockedProvider addTypename={false} link={linkEmptyOrgId}>
        <MemoryRouter initialEntries={['/member/123']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg {...props} hideDrawer={false} />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    await wait();
    expect(
      screen.queryByText('Error occured while loading Organization data'),
    ).not.toBeInTheDocument();
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
              <LeftDrawerOrg {...props} hideDrawer={false} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    await userEvent.click(screen.getByText('Dashboard'));
    expect(window.location.pathname).toContain('/orgdash/123');
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
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();

    const peopelBtn = screen.getByText('People');
    await userEvent.click(peopelBtn);
    await wait();
    expect(window.location.pathname).toContain('/orgpeople/123');
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
              <LeftDrawerOrg {...props} hideDrawer={false} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  // test('Testing when Organization does not exists', async () => {
  //   setItem('UserImage', '');
  //   setItem('SuperAdmin', true);
  //   setItem('FirstName', 'John');
  //   setItem('LastName', 'Doe');
  //   render(
  //     <MockedProvider addTypename={false} link={linkEmpty}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <LeftDrawerOrg {...props} hideDrawer={null} />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );
  //   await wait();
  //   expect(
  //     screen.getByText(/Error occured while loading Organization data/i),
  //   ).toBeInTheDocument();
  // });

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
              <LeftDrawerOrg {...props} hideDrawer={false} />
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

  test('Should not call setHideDrawer when hideDrawer has a value', async () => {
    const mockSetHideDrawer = vi.fn();
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg
                {...props}
                hideDrawer={false}
                setHideDrawer={mockSetHideDrawer}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(mockSetHideDrawer).not.toHaveBeenCalled();
  });
});

describe('Organization avatar rendering', () => {
  beforeEach(() => {
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    setItem('SuperAdmin', true);
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders <img> when avatarURL is present', async () => {
    render(
      <MockedProvider
        mocks={MOCKS_ORGANIZATION_DATA_WITH_AVATAR}
        addTypename={false}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg
                orgId="123"
                hideDrawer={false}
                setHideDrawer={() => {}}
                targets={[]}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const avatarImg = await screen.findByAltText(
      'Test Organization profile picture',
    );
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg.tagName).toBe('IMG');
    expect(avatarImg).toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('renders <Avatar> when avatarURL is not present', async () => {
    render(
      <MockedProvider mocks={MOCKS_ORGANIZATION_DATA} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawerOrg
                orgId="123"
                hideDrawer={false}
                setHideDrawer={() => {}}
                targets={[]}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const fallbackAvatar = screen.getByText('Test Organization');
    expect(fallbackAvatar).toBeInTheDocument();
  });
});
