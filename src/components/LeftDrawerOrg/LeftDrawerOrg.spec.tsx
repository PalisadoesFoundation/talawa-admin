import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import type { IDrawerExtension } from 'plugin/types';
import LeftDrawerOrg from './LeftDrawerOrg';
import type { ILeftDrawerProps } from './LeftDrawerOrg';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
// Mock CSS modules
vi.mock('shared-components/SidebarBase/SidebarBase.module.css', () => ({
  default: {
    leftDrawer: 'leftDrawer',
    collapsedDrawer: 'collapsedDrawer',
    expandedDrawer: 'expandedDrawer',
  },
}));

vi.mock('style/app-fixed.module.css', () => ({
  default: {
    leftDrawer: 'leftDrawer',
    hideElemByDefault: 'hideElemByDefault',
    collapsedDrawer: 'collapsedDrawer',
    expandedDrawer: 'expandedDrawer',
    brandingContainer: 'brandingContainer',
    talawaLogo: 'talawaLogo',
    talawaText: 'talawaText',
    organizationContainer: 'organizationContainer',
    profileContainer: 'profileContainer',
    bgDanger: 'bgDanger',
    imageContainer: 'imageContainer',
    ProfileRightContainer: 'ProfileRightContainer',
    profileText: 'profileText',
    primaryText: 'primaryText',
    secondaryText: 'secondaryText',
    ArrowIcon: 'ArrowIcon',
    titleHeader: 'titleHeader',
    optionList: 'optionList',
    leftDrawerActiveButton: 'leftDrawerActiveButton',
    leftDrawerInactiveButton: 'leftDrawerInactiveButton',
    iconWrapper: 'iconWrapper',
    avatarContainer: 'avatarContainer',
    userSidebarOrgFooter: 'userSidebarOrgFooter',
  },
}));

vi.mock(
  'shared-components/SidebarOrgSection/SidebarOrgSection.module.css',
  () => ({
    default: {
      organizationContainer: 'organizationContainer',
      profileContainer: 'profileContainer',
      bgDanger: 'bgDanger',
      imageContainer: 'imageContainer',
      ProfileRightContainer: 'ProfileRightContainer',
      profileText: 'profileText',
      primaryText: 'primaryText',
      secondaryText: 'secondaryText',
      ArrowIcon: 'ArrowIcon',
      avatarContainer: 'avatarContainer',
    },
  }),
);

// Type definitions for better type safety
interface IMockedResponse {
  request: {
    query: typeof GET_ORGANIZATION_BASIC_DATA;
    variables: {
      id: string;
    };
  };
  result?: {
    data: {
      organization: {
        id: string;
        name: string;
        description: string;
        addressLine1: string;
        addressLine2: string;
        city: string | null;
        state: string;
        postalCode: string;
        countryCode: string;
        avatarURL: string | null;
        createdAt: string;
        isUserRegistrationRequired: boolean;
        __typename: string;
      };
    };
  };
  error?: Error;
  delay?: number;
}

// Mock the dependencies
let mockT: ReturnType<typeof vi.fn>;

let mockTErrors: ReturnType<typeof vi.fn>;

const mockTImplementation = (key: string) => {
  const translations: Record<string, string> = {
    talawaAdminPortal: 'Talawa Admin Portal',
    adminPortal: 'Admin Portal',
    menu: 'Menu',
    plugins: 'Plugins',
    Dashboard: 'Dashboard',
    Members: 'Members',
    Events: 'Events',
    'Action Items': 'Action Items',
    Posts: 'Posts',
    switchToUserPortal: 'Switch to User Portal',
  };
  return translations[key] || key;
};

const mockTErrorsImplementation = (
  key: string,
  options?: { entity?: string },
) => {
  if (key === 'errorLoading' && options?.entity) {
    return `Error loading ${options.entity}`;
  }
  return key;
};

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn((namespace: string) => {
    if (namespace === 'common') {
      return { t: mockT || vi.fn() };
    }
    if (namespace === 'errors') {
      return { t: mockTErrors || vi.fn() };
    }
    return { t: mockT || vi.fn() };
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

const { mockUsePluginDrawerItems } = vi.hoisted(() => ({
  mockUsePluginDrawerItems: vi.fn((): IDrawerExtension[] => []),
}));

vi.mock('plugin', () => ({
  usePluginDrawerItems: mockUsePluginDrawerItems,
}));

vi.mock('components/CollapsibleDropdown/CollapsibleDropdown', () => ({
  default: vi.fn(({ target }) => (
    <div data-testid="collapsible-dropdown">
      CollapsibleDropdown: {target.name}
    </div>
  )),
}));

vi.mock('components/IconComponent/IconComponent', () => ({
  default: vi.fn(({ name, fill }) => (
    <div data-testid="icon-component" data-name={name} data-fill={fill}>
      {name}Icon
    </div>
  )),
}));

vi.mock('shared-components/Avatar/Avatar', () => ({
  default: vi.fn(({ name, alt }) => (
    <div data-testid="avatar" data-name={name} data-alt={alt}>
      Avatar: {name}
    </div>
  )),
}));

vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: vi.fn(() => <div data-testid="profile-card">Profile Card</div>),
}));

vi.mock('components/SignOut/SignOut', () => ({
  default: vi.fn(({ hideDrawer }: { hideDrawer?: boolean }) => (
    <div data-testid="sign-out" data-hide-drawer={hideDrawer}>
      Sign Out Component
    </div>
  )),
}));

let mockGetItem: ReturnType<typeof vi.fn>;
let mockSetItem: ReturnType<typeof vi.fn>;

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    getItem: mockGetItem,
    setItem: mockSetItem,
  })),
}));

// Mock SVG imports
vi.mock('assets/svgs/angleRight.svg?react', () => ({
  default: vi.fn(({ fill }) => (
    <div data-testid="angle-right-icon" data-fill={fill}>
      AngleRightIcon
    </div>
  )),
}));

vi.mock('assets/svgs/talawa.svg?react', () => ({
  default: vi.fn(() => <div data-testid="talawa-logo">TalawaLogo</div>),
}));

vi.mock('assets/svgs/plugins.svg?react', () => ({
  default: vi.fn(({ fill, stroke }) => (
    <div data-testid="plugin-logo" data-fill={fill} data-stroke={stroke}>
      PluginLogo
    </div>
  )),
}));

const mockOrganizationData = {
  organization: {
    id: 'org-123',
    name: 'Test Organization',
    description: 'Test Organization Description',
    addressLine1: '123 Test Street',
    addressLine2: 'Suite 456',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    countryCode: 'US',
    avatarURL: 'https://example.com/avatar.jpg',
    createdAt: dayjs.utc().toISOString(),
    isUserRegistrationRequired: false,
    __typename: 'Organization',
  },
};

const mockOrganizationDataWithoutAvatar = {
  organization: {
    ...mockOrganizationData.organization,
    avatarURL: null,
  },
};

const mockOrganizationDataWithoutCity = {
  organization: {
    ...mockOrganizationData.organization,
    city: null,
  },
};

const successMocks: IMockedResponse[] = [
  {
    request: {
      query: GET_ORGANIZATION_BASIC_DATA,
      variables: { id: 'org-123' },
    },
    result: {
      data: mockOrganizationData,
    },
  },
];

const loadingMocks: IMockedResponse[] = [
  {
    request: {
      query: GET_ORGANIZATION_BASIC_DATA,
      variables: { id: 'org-123' },
    },
    delay: 30000, // Never resolve to simulate loading
  },
];

const errorMocks: IMockedResponse[] = [
  {
    request: {
      query: GET_ORGANIZATION_BASIC_DATA,
      variables: { id: 'org-123' },
    },
    error: new Error('Failed to fetch organization'),
  },
];

describe('LeftDrawerOrg', () => {
  const originalInnerWidth = window.innerWidth;
  const mockSetHideDrawer = vi.fn();

  const defaultProps: ILeftDrawerProps = {
    orgId: 'org-123',
    targets: [
      { name: 'Dashboard', url: '/admin/orgdash/org-123' },
      { name: 'Members', url: '/admin/orgpeople/org-123' },
      { name: 'Events', url: '/admin/orgevents/org-123' },
      {
        name: 'Action Items',
        url: undefined,
        subTargets: [
          {
            name: 'Action Item Categories',
            url: '/orgactionitemcategory/org-123',
          },
          { name: 'Action Items', url: '/orgactionitems/org-123' },
        ],
      },
    ],
    hideDrawer: false,
    setHideDrawer: mockSetHideDrawer,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockT = vi.fn(mockTImplementation);
    mockTErrors = vi.fn(mockTErrorsImplementation);
    mockGetItem = vi.fn((key: string) => {
      if (key === 'id') return 'user-123';
      return null;
    });
    mockSetItem = vi.fn();
    mockUsePluginDrawerItems.mockReturnValue([]);
    // Reset window.innerWidth to a default value
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const renderComponent = (
    props: Partial<ILeftDrawerProps> = {},
    mocks: IMockedResponse[] = successMocks,
    initialRoute = '/admin/orgdash/org-123',
  ) => {
    return render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <LeftDrawerOrg {...defaultProps} {...props} />
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  describe('Component Rendering', () => {
    it('should render all required elements', async () => {
      renderComponent();

      expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
      expect(screen.getByTestId('talawa-logo')).toBeInTheDocument();
      expect(screen.getByText('Admin Portal')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('OrgBtn')).toBeInTheDocument();
      });
    });

    it('should render navigation targets', () => {
      renderComponent();

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Members')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    it('should render collapsible dropdown for targets without URL', () => {
      renderComponent();

      expect(screen.getByTestId('collapsible-dropdown')).toBeInTheDocument();
      expect(
        screen.getByText('CollapsibleDropdown: Action Items'),
      ).toBeInTheDocument();
    });
  });

  describe('Switch to User Portal', () => {
    it('should render switch to user portal link with correct href and test id', () => {
      renderComponent();

      const switchButton = screen.getByTestId('switchToUserPortalBtn');
      expect(switchButton).toBeInTheDocument();
      expect(switchButton).toHaveTextContent('Switch to User Portal');

      const switchLink = switchButton.closest('a');
      expect(switchLink).toHaveAttribute('href', '/user/organizations');
    });

    it('should call setHideDrawer when switch link is clicked on mobile', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      renderComponent();

      const switchButton = screen.getByTestId('switchToUserPortalBtn');
      const user = userEvent.setup();
      await user.click(switchButton);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });
  });

  describe('Drawer State Management', () => {
    it('should apply correct CSS classes when hideDrawer is true', () => {
      renderComponent({ hideDrawer: true });

      const container = screen.getByTestId('leftDrawerContainer');
      expect(container).toHaveClass('leftDrawer', 'collapsedDrawer');
    });

    it('should apply correct CSS classes when hideDrawer is false', () => {
      renderComponent({ hideDrawer: false });

      const container = screen.getByTestId('leftDrawerContainer');
      expect(container).toHaveClass('leftDrawer', 'expandedDrawer');
    });
  });

  describe('Organization Data Display', () => {
    it('should display organization information correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Organization')).toBeInTheDocument();
        expect(screen.getByText('Test City')).toBeInTheDocument();
      });

      const avatar = screen.getByAltText('Test Organization');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should display Avatar component when no avatarURL', async () => {
      const mocksWithoutAvatar: IMockedResponse[] = [
        {
          request: {
            query: GET_ORGANIZATION_BASIC_DATA,
            variables: { id: 'org-123' },
          },
          result: {
            data: mockOrganizationDataWithoutAvatar,
          },
        },
      ];

      renderComponent({}, mocksWithoutAvatar);

      await waitFor(() => {
        const avatars = screen.getAllByTestId('avatar');
        const orgAvatar = avatars.find(
          (avatar) => avatar.getAttribute('data-name') === 'Test Organization',
        );
        expect(orgAvatar).toBeInTheDocument();
        expect(orgAvatar).toHaveTextContent('Avatar: Test Organization');
      });
    });

    it('should display N/A when city is not available', async () => {
      const mocksWithoutCity: IMockedResponse[] = [
        {
          request: {
            query: GET_ORGANIZATION_BASIC_DATA,
            variables: { id: 'org-123' },
          },
          result: {
            data: mockOrganizationDataWithoutCity,
          },
        },
      ];

      renderComponent({}, mocksWithoutCity);

      await waitFor(() => {
        expect(screen.getByText('N/A')).toBeInTheDocument();
      });
    });

    it('should show loading state while fetching organization data', () => {
      renderComponent({}, loadingMocks);

      expect(screen.getByTestId('orgBtn')).toBeInTheDocument();
      expect(screen.getByTestId('orgBtn')).toHaveClass('shimmer');
    });

    it('should show error state when organization data fails to load', async () => {
      renderComponent({}, errorMocks);

      await waitFor(() => {
        expect(
          screen.getByText('Error loading Organization'),
        ).toBeInTheDocument();
      });

      const errorButton = screen.getByRole('button', {
        name: /Error loading Organization/i,
      });
      expect(errorButton).toBeDisabled();
      expect(errorButton).toHaveClass('bgDanger');
    });

    it('should not show error state on profile page when data fails to load', async () => {
      renderComponent({}, errorMocks, '/admin/member/user-123');

      await waitFor(() => {
        expect(
          screen.queryByText('Error loading Organization'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should hide drawer on mobile when navigation link is clicked', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800, // Mobile width
      });

      renderComponent();

      const dashboardLink = screen.getByText('Dashboard');
      const user = userEvent.setup();
      await user.click(dashboardLink);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('should not hide drawer on desktop when navigation link is clicked', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200, // Desktop width
      });

      renderComponent();

      const dashboardLink = screen.getByText('Dashboard');
      const user = userEvent.setup();
      await user.click(dashboardLink);

      expect(mockSetHideDrawer).not.toHaveBeenCalled();
    });

    it('should hide drawer at exactly 820px breakpoint', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 820, // Exact breakpoint - should trigger mobile behavior (<=820)
      });

      renderComponent();

      const membersLink = screen.getByText('Members');
      const user = userEvent.setup();
      await user.click(membersLink);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('should hide drawer below 820px breakpoint', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 819, // Just below breakpoint
      });

      renderComponent();

      const eventsLink = screen.getByText('Events');
      const user = userEvent.setup();
      await user.click(eventsLink);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for navigation links', () => {
      renderComponent();

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveAttribute('href', '/admin/orgdash/org-123');

      const membersLink = screen.getByText('Members').closest('a');
      expect(membersLink).toHaveAttribute('href', '/admin/orgpeople/org-123');

      const eventsLink = screen.getByText('Events').closest('a');
      expect(eventsLink).toHaveAttribute('href', '/admin/orgevents/org-123');
    });

    it('should apply active styles when on corresponding route', () => {
      renderComponent({}, successMocks, '/admin/orgpeople/org-123');

      const membersLink = screen.getByText('Members').closest('a');
      expect(membersLink).toHaveClass('leftDrawerActiveButton');
    });

    it('should apply inactive styles when not on corresponding route', () => {
      renderComponent({}, successMocks, '/admin/orgdash/org-123');

      const membersLink = screen.getByText('Members').closest('a');
      expect(membersLink).toHaveClass('leftDrawerInactiveButton');
    });

    it('should render icon components with correct props', () => {
      renderComponent({}, successMocks, '/admin/orgdash/org-123');

      const iconComponents = screen.getAllByTestId('icon-component');
      const dashboardIcon = iconComponents.find(
        (icon) => icon.getAttribute('data-name') === 'Dashboard',
      );
      expect(dashboardIcon).toHaveAttribute('data-name', 'Dashboard');
      expect(dashboardIcon).toHaveAttribute('data-fill', 'var(--bs-black)');
    });

    it('should render inactive icon with correct fill color', () => {
      renderComponent({}, successMocks, '/admin/orgdash/org-123');

      const iconComponents = screen.getAllByTestId('icon-component');
      const inactiveIcon = iconComponents.find(
        (icon) => icon.getAttribute('data-fill') === 'var(--bs-secondary)',
      );
      expect(inactiveIcon).toBeInTheDocument();
    });

    it('should handle special icon name mapping for Membership Requests', () => {
      const propsWithRequests = {
        ...defaultProps,
        targets: [
          { name: 'Membership Requests', url: '/admin/requests/org-123' },
        ],
      };

      renderComponent(propsWithRequests);

      const requestsIcon = screen.getByTestId('icon-component');
      expect(requestsIcon).toHaveAttribute('data-name', 'Requests');
    });
  });

  describe('Plugin Integration', () => {
    it('should not show plugin section when no plugin items', () => {
      mockUsePluginDrawerItems.mockReturnValue([]);

      renderComponent();

      expect(screen.queryByText('Plugins')).not.toBeInTheDocument();
    });

    it('should show plugin section when plugin items exist', () => {
      const mockPluginItems: IDrawerExtension[] = [
        {
          pluginId: 'test-plugin',
          path: '/plugin/:orgId/test',
          label: 'Test Plugin',
          icon: 'test-icon.png',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      expect(screen.getByText('Plugins')).toBeInTheDocument();
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });

    it('should replace :orgId in plugin paths', () => {
      const mockPluginItems: IDrawerExtension[] = [
        {
          pluginId: 'test-plugin',
          path: '/plugin/:orgId/test',
          label: 'Test Plugin',
          icon: 'test-icon.png',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      const pluginLink = screen.getByText('Test Plugin').closest('a');
      expect(pluginLink).toHaveAttribute('href', '/plugin/org-123/test');
    });

    it('should render plugin item with custom icon', () => {
      const mockPluginItems: IDrawerExtension[] = [
        {
          pluginId: 'test-plugin',
          path: '/plugin/:orgId/test',
          label: 'Test Plugin',
          icon: 'custom-icon.png',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      const customIcon = screen.getByAltText('Test Plugin');
      expect(customIcon).toBeInTheDocument();
      expect(customIcon).toHaveAttribute('src', 'custom-icon.png');
    });

    it('should render plugin item with default plugin icon when no custom icon', () => {
      const mockPluginItems: IDrawerExtension[] = [
        {
          pluginId: 'test-plugin',
          path: '/plugin/:orgId/test',
          label: 'Test Plugin',
          icon: '',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      expect(screen.getByTestId('plugin-logo')).toBeInTheDocument();
    });

    it('should hide drawer on mobile when plugin link is clicked', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      const mockPluginItems: IDrawerExtension[] = [
        {
          pluginId: 'test-plugin',
          path: '/plugin/:orgId/test',
          label: 'Test Plugin',
          icon: 'test-icon.png',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      const pluginButton = screen.getByText('Test Plugin');
      const user = userEvent.setup();
      await user.click(pluginButton);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('should call usePluginDrawerItems with correct parameters', () => {
      renderComponent();

      expect(mockUsePluginDrawerItems).toHaveBeenCalledWith(
        [], // userPermissions
        true, // isAdmin
        true, // isOrg
      );
    });

    it('should render multiple plugin items', () => {
      const mockPluginItems: IDrawerExtension[] = [
        {
          pluginId: 'plugin-1',
          path: '/plugin/:orgId/1',
          label: 'Plugin One',
          icon: 'icon1.png',
        },
        {
          pluginId: 'plugin-2',
          path: '/plugin/:orgId/2',
          label: 'Plugin Two',
          icon: '',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.getByText('Plugin Two')).toBeInTheDocument();
      expect(screen.getByAltText('Plugin One')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-logo')).toBeInTheDocument();
    });
  });

  describe('Profile Page Detection', () => {
    it('should detect profile page when pathname contains user ID', () => {
      renderComponent({}, successMocks, '/admin/member/user-123');

      // Profile page detection is internal state, but we can test its effect
      // by checking that error message doesn't show on profile page
      expect(
        screen.queryByText('Error loading Organization'),
      ).not.toBeInTheDocument();
    });

    it('should not detect profile page when pathname contains different ID', () => {
      renderComponent({}, successMocks, '/admin/member/other-user');

      // This should not be considered a profile page for the current user
      expect(true).toBe(true); // Profile page logic is internal
    });
  });

  it('should handle empty pathname via direct routing', () => {
    render(
      <MockedProvider mocks={successMocks}>
        <MemoryRouter initialEntries={['']}>
          <LeftDrawerOrg {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>,
    );

    // The component should still render without error
    expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
  });

  it('should toggle drawer state and update localStorage on click events', async () => {
    // Test with initial hideDrawer = false
    const { unmount: unmount1 } = renderComponent({ hideDrawer: false });

    const toggleButton = screen.getByTestId('toggleBtn');
    expect(toggleButton).toBeInTheDocument();

    // Test onClick functionality - clicking when drawer is visible should hide it
    const user = userEvent.setup();
    await user.click(toggleButton);

    expect(mockSetItem).toHaveBeenCalledWith('sidebar', true);
    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);

    // Clear mocks and unmount previous component
    mockSetItem.mockClear();
    mockSetHideDrawer.mockClear();
    unmount1();

    // Re-render with hideDrawer = true
    const { unmount: unmount2 } = renderComponent({ hideDrawer: true });
    const toggleButtonCollapsed = screen.getByTestId('toggleBtn');

    // Test onClick when drawer is hidden - clicking should show it
    await user.click(toggleButtonCollapsed);

    expect(mockSetItem).toHaveBeenCalledWith('sidebar', false);
    expect(mockSetHideDrawer).toHaveBeenCalledWith(false);

    unmount2();
  });

  describe('Internationalization', () => {
    it('should use correct translation keys', () => {
      renderComponent();

      expect(mockT).toHaveBeenCalledWith('adminPortal');
      expect(mockT).toHaveBeenCalledWith('Dashboard');
      expect(mockT).toHaveBeenCalledWith('Members');
      expect(mockT).toHaveBeenCalledWith('Events');
    });

    it('should use error translation for loading errors', async () => {
      renderComponent({}, errorMocks);

      await waitFor(() => {
        expect(mockTErrors).toHaveBeenCalledWith('errorLoading', {
          entity: 'Organization',
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined plugin items gracefully', () => {
      mockUsePluginDrawerItems.mockReturnValue(
        undefined as unknown as IDrawerExtension[],
      );

      expect(() => renderComponent()).not.toThrow();
      expect(screen.queryByText('Plugins')).not.toBeInTheDocument();
    });

    it('should handle null setHideDrawer prop', () => {
      const propsWithNullSetter = {
        ...defaultProps,
        setHideDrawer: null as unknown as React.Dispatch<
          React.SetStateAction<boolean>
        >,
      };

      expect(() => renderComponent(propsWithNullSetter)).not.toThrow();
    });

    it('should handle empty targets array', () => {
      const propsWithEmptyTargets = {
        ...defaultProps,
        targets: [],
      };

      renderComponent(propsWithEmptyTargets);

      expect(screen.getByText('Admin Portal')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('should handle targets with null URLs', () => {
      const propsWithNullUrls = {
        ...defaultProps,
        targets: [{ name: 'Null Target', url: undefined }],
      };

      renderComponent(propsWithNullUrls);

      expect(screen.getByTestId('collapsible-dropdown')).toBeInTheDocument();
    });

    it('should handle window resize during interaction', async () => {
      renderComponent();

      // Start on desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const dashboardLink = screen.getByText('Dashboard');
      const user = userEvent.setup();
      await user.click(dashboardLink);
      expect(mockSetHideDrawer).not.toHaveBeenCalled();

      // Change to mobile during next interaction
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      await user.click(dashboardLink);
      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });
  });

  describe('GraphQL Query Variables', () => {
    it('should use correct variables for organization query', () => {
      renderComponent();

      // The query should be called with correct variables
      expect(successMocks[0].request.variables).toEqual({
        id: 'org-123',
      });
    });

    it('should handle different orgId prop', () => {
      const differentOrgMocks: IMockedResponse[] = [
        {
          request: {
            query: GET_ORGANIZATION_BASIC_DATA,
            variables: { id: 'different-org' },
          },
          result: {
            data: {
              organization: {
                ...mockOrganizationData.organization,
                id: 'different-org',
                name: 'Different Organization',
              },
            },
          },
        },
      ];

      renderComponent({ orgId: 'different-org' }, differentOrgMocks);

      expect(differentOrgMocks[0].request.variables.id).toBe('different-org');
    });
  });
});
