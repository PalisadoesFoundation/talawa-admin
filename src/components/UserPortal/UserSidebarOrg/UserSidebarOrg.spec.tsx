import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceUserSidebarOrgProps } from './UserSidebarOrg';
import UserSidebarOrg from './UserSidebarOrg';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { store } from 'state/store';
import { CURRENT_USER, ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, it } from 'vitest';
import { usePluginDrawerItems } from 'plugin';

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
 * `userEvent` simulates user actions, and `vi.fn()` mocks callback functions.
 */
const { setItem, clearAllItems } = useLocalStorage();

vi.mock('@mui/icons-material', () => ({
  QuestionMarkOutlined: vi.fn(() => null),
  WarningAmberOutlined: vi.fn(() => null),
}));

vi.mock('plugin', () => ({
  usePluginDrawerItems: vi.fn(() => []),
}));

// Mock ProfileCard component to avoid router hook errors
vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: () => <div data-testid="profile-card">Profile Card Mock</div>,
}));

// Mock SignOut component to avoid router hook errors
vi.mock('components/SignOut/SignOut', () => ({
  default: ({ hideDrawer }: { hideDrawer?: boolean }) => (
    <div data-testid="sign-out-component" hidden={hideDrawer}>
      Sign Out Mock
    </div>
  ),
}));

// Mock useSession to prevent router hook errors in SignOut component
vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    endSession: vi.fn(),
  })),
}));

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

const createCurrentUserMock = (role: string) => ({
  request: {
    query: CURRENT_USER,
  },
  result: {
    data: {
      user: {
        role,
      },
    },
  },
});

const CURRENT_USER_REGULAR_MOCK = createCurrentUserMock('regular');
const CURRENT_USER_ADMIN_MOCK = createCurrentUserMock('administrator');

const MOCKS = [
  CURRENT_USER_REGULAR_MOCK,
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
  CURRENT_USER_REGULAR_MOCK,
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

const MOCKS_ADMIN = [CURRENT_USER_ADMIN_MOCK, ...MOCKS.slice(1)];

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
  act(() => {
    window.innerWidth = width;
    window.dispatchEvent(new window.Event('resize'));
  });
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
  clearAllItems();
});

const link = new StaticMockLink(MOCKS, true);
const linkImage = new StaticMockLink(MOCKS_WITH_IMAGE, true);
const linkAdmin = new StaticMockLink(MOCKS_ADMIN, true);
// const linkEmpty = new StaticMockLink(MOCKS_EMPTY, true);

describe('Testing LeftDrawerOrg component for SUPERADMIN', () => {
  it('Component should be rendered properly', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider link={link}>
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

  // it('Testing Profile Page & Organization Detail Modal', async () => {
  //   setItem('UserImage', '');
  //   setItem('SuperAdmin', true);
  //   setItem('FirstName', 'John');
  //   setItem('LastName', 'Doe');
  //   render(
  //     <MockedProvider link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <UserSidebarOrg {...props} hideDrawer={null} />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );
  //   await wait();
  //   expect(screen.getByTestId(/orgBtn/i)).toBeInTheDocument();
  // });

  it('Testing Menu Buttons', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={false} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    await userEvent.click(screen.getByText('People'));
    expect(window.location.pathname).toContain('/user/people/123');
  });

  it('Testing when screen size is less than 820px', async () => {
    setItem('SuperAdmin', true);
    render(
      <MockedProvider link={link}>
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
    const previousWidth = window.innerWidth;
    try {
      resizeWindow(800);
      expect(screen.getAllByText(/People/i)[0]).toBeInTheDocument();

      const peopleBtn = screen.getAllByTestId(/People/i)[0];
      await userEvent.click(peopleBtn);
      await wait();
      expect(window.location.pathname).toContain('user/people/123');
    } finally {
      resizeWindow(previousWidth);
    }
  });

  it('Testing when image is present for Organization', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider link={linkImage}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={false} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('Testing Drawer when hideDrawer is null', () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} hideDrawer={false} />
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
      <MockedProvider link={link}>
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

  it('Testing toggle button click functionality', async () => {
    const mockSetHideDrawer = vi.fn();
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg
                {...props}
                hideDrawer={false}
                setHideDrawer={mockSetHideDrawer}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const toggleButton = screen.getByTestId('toggleBtn');
    expect(toggleButton).toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });

  it('Testing toggle button keyboard navigation with Enter key', async () => {
    const mockSetHideDrawer = vi.fn();
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg
                {...props}
                hideDrawer={false}
                setHideDrawer={mockSetHideDrawer}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const toggleButton = screen.getByTestId('toggleBtn');
    toggleButton.focus();

    await userEvent.keyboard('{Enter}');
    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });

  it('Testing toggle button keyboard navigation with Space key', async () => {
    const mockSetHideDrawer = vi.fn();
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg
                {...props}
                hideDrawer={false}
                setHideDrawer={mockSetHideDrawer}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const toggleButton = screen.getByTestId('toggleBtn');
    toggleButton.focus();

    await userEvent.keyboard(' ');
    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });

  it('Testing toggle button keyboard navigation ignores other keys', async () => {
    const mockSetHideDrawer = vi.fn();
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg
                {...props}
                hideDrawer={false}
                setHideDrawer={mockSetHideDrawer}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const toggleButton = screen.getByTestId('toggleBtn');
    toggleButton.focus();

    await userEvent.keyboard('{Escape}');
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{ArrowDown}');

    expect(mockSetHideDrawer).not.toHaveBeenCalled();
  });

  it('Testing conditional rendering with URL - renders NavLink', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');

    const propsWithUrl = {
      ...props,
      targets: [
        {
          name: 'Posts',
          url: '/user/organization/123',
        },
      ],
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...propsWithUrl} hideDrawer={false} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Should render as NavLink when URL is provided
    const navLink = screen.getByRole('link', { name: /Posts/i });
    expect(navLink).toBeInTheDocument();
    expect(navLink).toHaveAttribute('href', '/user/organization/123');
  });

  it('Testing conditional rendering without URL - renders CollapsibleDropdown', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');

    const propsWithoutUrl = {
      ...props,
      targets: [
        {
          name: 'Dropdown Menu',
          subTargets: [
            {
              name: 'Submenu 1',
              url: '/submenu1',
            },
            {
              name: 'Submenu 2',
              url: '/submenu2',
            },
          ],
        },
      ],
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...propsWithoutUrl} hideDrawer={false} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Should render CollapsibleDropdown when URL is not provided
    const dropdownButton = screen.getByRole('button', {
      name: /Dropdown Menu/i,
    });
    expect(dropdownButton).toBeInTheDocument();

    // Verify it's a dropdown and not a NavLink
    const navLink = screen.queryByRole('link', { name: /Dropdown Menu/i });
    expect(navLink).not.toBeInTheDocument();
  });
});

describe('Plugin System Integration', () => {
  it('should not show plugin section when no plugin items', () => {
    vi.mocked(usePluginDrawerItems).mockReturnValue([]);
    setItem('SuperAdmin', true);

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Should not show plugin section when no items
    expect(screen.queryByText('Plugins')).not.toBeInTheDocument();
  });

  it('should show plugin section when plugin items exist', () => {
    const mockPluginItems = [
      {
        pluginId: 'user-plugin-1',
        path: '/user/plugin/:orgId/test1',
        label: 'Test Plugin 1',
        icon: '',
      },
      {
        pluginId: 'user-plugin-2',
        path: '/user/plugin/:orgId/test2',
        label: 'Test Plugin 2',
        icon: 'https://example.com/icon.png',
      },
    ];
    vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);
    setItem('SuperAdmin', true);

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Should show plugin section header
    expect(screen.getByText('Plugins')).toBeInTheDocument();
    // Should show plugin items
    expect(screen.getByText('Test Plugin 1')).toBeInTheDocument();
    expect(screen.getByText('Test Plugin 2')).toBeInTheDocument();
  });

  it('should replace :orgId in plugin paths correctly', () => {
    const mockPluginItems = [
      {
        pluginId: 'param-plugin',
        path: '/user/plugin/:orgId/dashboard',
        label: 'Param Plugin',
        icon: '',
      },
    ];
    vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);
    setItem('SuperAdmin', true);

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} orgId="test-org-123" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const pluginLink = screen.getByRole('link', { name: /Param Plugin/i });
    expect(pluginLink).toHaveAttribute(
      'href',
      '/user/plugin/test-org-123/dashboard',
    );
  });

  it('should render plugin items with custom icons', () => {
    const mockPluginItems = [
      {
        pluginId: 'icon-plugin',
        path: '/user/plugin/:orgId/icon',
        label: 'Icon Plugin',
        icon: 'https://example.com/custom-icon.png',
      },
    ];
    vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);
    setItem('SuperAdmin', true);

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const customIcon = screen.getByAltText('Icon Plugin');
    expect(customIcon).toBeInTheDocument();
    expect(customIcon).toHaveAttribute(
      'src',
      'https://example.com/custom-icon.png',
    );
  });

  it('should handle plugin item clicks and hide drawer on mobile', async () => {
    const mockPluginItems = [
      {
        pluginId: 'mobile-plugin',
        path: '/user/plugin/:orgId/mobile',
        label: 'Mobile Plugin',
        icon: '',
      },
    ];
    vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);
    setItem('SuperAdmin', true);

    // Mock mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    const setHideDrawer = vi.fn();
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} setHideDrawer={setHideDrawer} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const pluginLink = screen.getByRole('link', { name: /Mobile Plugin/i });
    await userEvent.click(pluginLink);

    expect(setHideDrawer).toHaveBeenCalledWith(true);
  });

  it('should call usePluginDrawerItems with correct parameters', () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Should call with empty permissions, false for isAdmin, true for org-specific
    expect(usePluginDrawerItems).toHaveBeenCalledWith([], false, true);
  });
});

describe('Dropdown State Management', () => {
  it('should manage showDropdown state for CollapsibleDropdown', async () => {
    const propsWithDropdown = {
      ...props,
      targets: [
        {
          name: 'Dropdown Menu',
          subTargets: [
            {
              name: 'Submenu 1',
              url: '/submenu1',
            },
            {
              name: 'Submenu 2',
              url: '/submenu2',
            },
          ],
        },
      ],
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...propsWithDropdown} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const dropdownButton = screen.getByRole('button', {
      name: /Dropdown Menu/i,
    });
    expect(dropdownButton).toBeInTheDocument();

    // Test dropdown interaction (the actual dropdown functionality is tested in CollapsibleDropdown tests)
    await userEvent.click(dropdownButton);
  });

  it('should handle mixed targets with and without URLs', () => {
    const mixedProps = {
      ...props,
      targets: [
        {
          name: 'Direct Link',
          url: '/direct',
        },
        {
          name: 'Dropdown Menu',
          subTargets: [
            {
              name: 'Sub Item 1',
              url: '/sub1',
            },
          ],
        },
        {
          name: 'Another Direct Link',
          url: '/another-direct',
        },
      ],
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...mixedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Should render direct links as NavLinks
    const directLinks = screen.getAllByRole('link', { name: /Direct Link/i });
    expect(directLinks.length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: /Another Direct Link/i }),
    ).toBeInTheDocument();

    // Should render dropdown as button
    expect(
      screen.getByRole('button', { name: /Dropdown Menu/i }),
    ).toBeInTheDocument();
  });

  it('shows switch to admin portal button for admin users', () => {
    setItem('role', 'administrator');
    render(
      <MockedProvider link={linkAdmin}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebarOrg {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('switchToAdminPortalBtn')).toBeInTheDocument();
  });
});
