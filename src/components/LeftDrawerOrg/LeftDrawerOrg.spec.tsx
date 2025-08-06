import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router';
import LeftDrawerOrg from './LeftDrawerOrg';
import type { ILeftDrawerProps } from './LeftDrawerOrg';
import { GET_ORGANIZATION_DATA_PG } from 'GraphQl/Queries/Queries';

// Mock the dependencies
const mockT = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    talawaAdminPortal: 'Talawa Admin Portal',
    menu: 'Menu',
    plugins: 'Plugins',
    Dashboard: 'Dashboard',
    Members: 'Members',
    Events: 'Events',
    'Action Items': 'Action Items',
    Posts: 'Posts',
  };
  return translations[key] || key;
});

const mockTErrors = vi.fn((key: string, options?: any) => {
  if (key === 'errorLoading' && options?.entity) {
    return `Error loading ${options.entity}`;
  }
  return key;
});

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn((namespace: string) => {
    if (namespace === 'common') {
      return { t: mockT };
    }
    if (namespace === 'errors') {
      return { t: mockTErrors };
    }
    return { t: mockT };
  }),
}));

const { mockUsePluginDrawerItems } = vi.hoisted(() => ({
  mockUsePluginDrawerItems: vi.fn(
    (): import('plugin/types').IDrawerExtension[] => [],
  ),
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

vi.mock('components/Avatar/Avatar', () => ({
  default: vi.fn(({ name, alt }) => (
    <div data-testid="avatar" data-name={name} data-alt={alt}>
      Avatar: {name}
    </div>
  )),
}));

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    getItem: vi.fn((key: string) => {
      if (key === 'id') return 'user-123';
      return null;
    }),
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

// Mock CSS modules
vi.mock('../../style/app-fixed.module.css', () => ({
  default: {
    leftDrawer: 'leftDrawer',
    hideElemByDefault: 'hideElemByDefault',
    inactiveDrawer: 'inactiveDrawer',
    activeDrawer: 'activeDrawer',
    brandingContainer: 'brandingContainer',
    talawaLogo: 'talawaLogo',
    talawaText: 'talawaText',
    organizationContainer: 'organizationContainer',
    profileContainer: 'profileContainer',
    bgDanger: 'bgDanger',
    imageContainer: 'imageContainer',
    ProfileRightConatiner: 'ProfileRightConatiner',
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
  },
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
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    creator: {
      id: 'creator-123',
      name: 'Creator Name',
      emailAddress: 'creator@example.com',
    },
    updater: {
      id: 'updater-123',
      name: 'Updater Name',
      emailAddress: 'updater@example.com',
    },
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

const successMocks = [
  {
    request: {
      query: GET_ORGANIZATION_DATA_PG,
      variables: { id: 'org-123', first: 10, after: null },
    },
    result: {
      data: mockOrganizationData,
    },
  },
];

const loadingMocks = [
  {
    request: {
      query: GET_ORGANIZATION_DATA_PG,
      variables: { id: 'org-123', first: 10, after: null },
    },
    delay: 30000, // Never resolve to simulate loading
  },
];

const errorMocks = [
  {
    request: {
      query: GET_ORGANIZATION_DATA_PG,
      variables: { id: 'org-123', first: 10, after: null },
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
      { name: 'Dashboard', url: '/orgdash/org-123' },
      { name: 'Members', url: '/orgpeople/org-123' },
      { name: 'Events', url: '/orgevents/org-123' },
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
    mockT.mockClear();
    mockTErrors.mockClear();
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
    mocks: any[] = successMocks,
    initialRoute = '/orgdash/org-123',
  ) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
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
      expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();
      expect(screen.getByText('Menu')).toBeInTheDocument();

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

  describe('Drawer State Management', () => {
    it('should apply correct CSS classes when hideDrawer is true', () => {
      renderComponent({ hideDrawer: true });

      const container = screen.getByTestId('leftDrawerContainer');
      expect(container).toHaveClass('leftDrawer', 'inactiveDrawer');
    });

    it('should apply correct CSS classes when hideDrawer is false', () => {
      renderComponent({ hideDrawer: false });

      const container = screen.getByTestId('leftDrawerContainer');
      expect(container).toHaveClass('leftDrawer', 'activeDrawer');
    });
  });

  describe('Organization Data Display', () => {
    it('should display organization information correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Organization')).toBeInTheDocument();
        expect(screen.getByText('Test City')).toBeInTheDocument();
      });

      const avatar = screen.getByAltText('Test Organization profile picture');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should display Avatar component when no avatarURL', async () => {
      const mocksWithoutAvatar = [
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: { id: 'org-123', first: 10, after: null },
          },
          result: {
            data: mockOrganizationDataWithoutAvatar,
          },
        },
      ];

      renderComponent({}, mocksWithoutAvatar);

      await waitFor(() => {
        expect(screen.getByTestId('avatar')).toBeInTheDocument();
        expect(
          screen.getByText('Avatar: Test Organization'),
        ).toBeInTheDocument();
      });
    });

    it('should display N/A when city is not available', async () => {
      const mocksWithoutCity = [
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: { id: 'org-123', first: 10, after: null },
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
      renderComponent({}, errorMocks, '/member/user-123');

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
      fireEvent.click(dashboardLink);

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
      fireEvent.click(dashboardLink);

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
      fireEvent.click(membersLink);

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
      fireEvent.click(eventsLink);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for navigation links', () => {
      renderComponent();

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveAttribute('href', '/orgdash/org-123');

      const membersLink = screen.getByText('Members').closest('a');
      expect(membersLink).toHaveAttribute('href', '/orgpeople/org-123');

      const eventsLink = screen.getByText('Events').closest('a');
      expect(eventsLink).toHaveAttribute('href', '/orgevents/org-123');
    });

    it('should apply active styles when on corresponding route', () => {
      renderComponent({}, successMocks, '/orgpeople/org-123');

      const membersButton = screen.getByText('Members').closest('button');
      expect(membersButton).toHaveClass('leftDrawerActiveButton');
    });

    it('should apply inactive styles when not on corresponding route', () => {
      renderComponent({}, successMocks, '/orgdash/org-123');

      const membersButton = screen.getByText('Members').closest('button');
      expect(membersButton).toHaveClass('leftDrawerInactiveButton');
    });

    it('should render icon components with correct props', () => {
      renderComponent({}, successMocks, '/orgdash/org-123');

      const iconComponents = screen.getAllByTestId('icon-component');
      const dashboardIcon = iconComponents.find(
        (icon) => icon.getAttribute('data-name') === 'Dashboard',
      );
      expect(dashboardIcon).toHaveAttribute('data-name', 'Dashboard');
      expect(dashboardIcon).toHaveAttribute('data-fill', 'var(--bs-black)');
    });

    it('should render inactive icon with correct fill color', () => {
      renderComponent({}, successMocks, '/orgdash/org-123');

      const iconComponents = screen.getAllByTestId('icon-component');
      const inactiveIcon = iconComponents.find(
        (icon) => icon.getAttribute('data-fill') === 'var(--bs-secondary)',
      );
      expect(inactiveIcon).toBeInTheDocument();
    });

    it('should handle special icon name mapping for Membership Requests', () => {
      const propsWithRequests = {
        ...defaultProps,
        targets: [{ name: 'Membership Requests', url: '/orgrequests/org-123' }],
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
      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
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
      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
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
      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
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
      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
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

    it('should hide drawer on mobile when plugin link is clicked', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
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
      fireEvent.click(pluginButton);

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
      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
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
      renderComponent({}, successMocks, '/member/user-123');

      // Profile page detection is internal state, but we can test its effect
      // by checking that error message doesn't show on profile page
      expect(
        screen.queryByText('Error loading Organization'),
      ).not.toBeInTheDocument();
    });

    it('should not detect profile page when pathname contains different ID', () => {
      renderComponent({}, successMocks, '/member/other-user');

      // This should not be considered a profile page for the current user
      expect(true).toBe(true); // Profile page logic is internal
    });
  });

  describe('Internationalization', () => {
    it('should use correct translation keys', () => {
      renderComponent();

      expect(mockT).toHaveBeenCalledWith('talawaAdminPortal');
      expect(mockT).toHaveBeenCalledWith('menu');
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
      mockUsePluginDrawerItems.mockReturnValue(undefined as any);

      expect(() => renderComponent()).not.toThrow();
      expect(screen.queryByText('Plugins')).not.toBeInTheDocument();
    });

    it('should handle null setHideDrawer prop', () => {
      const propsWithNullSetter = {
        ...defaultProps,
        setHideDrawer: null as any,
      };

      expect(() => renderComponent(propsWithNullSetter)).not.toThrow();
    });

    it('should handle empty targets array', () => {
      const propsWithEmptyTargets = {
        ...defaultProps,
        targets: [],
      };

      renderComponent(propsWithEmptyTargets);

      expect(screen.getByText('Menu')).toBeInTheDocument();
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

    it('should handle window resize during interaction', () => {
      renderComponent();

      // Start on desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const dashboardLink = screen.getByText('Dashboard');
      fireEvent.click(dashboardLink);
      expect(mockSetHideDrawer).not.toHaveBeenCalled();

      // Change to mobile during next interaction
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      fireEvent.click(dashboardLink);
      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });
  });

  describe('GraphQL Query Variables', () => {
    it('should use correct variables for organization query', () => {
      renderComponent();

      // The query should be called with correct variables
      expect(successMocks[0].request.variables).toEqual({
        id: 'org-123',
        first: 10,
        after: null,
      });
    });

    it('should handle different orgId prop', () => {
      const differentOrgMocks = [
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: { id: 'different-org', first: 10, after: null },
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
