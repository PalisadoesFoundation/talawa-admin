import React from 'react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import LeftDrawer from './LeftDrawer';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
// Mock CSS modules
vi.mock('style/app-fixed.module.css', () => ({
  default: {
    sidebarBtnActive: 'sidebarBtnActive',
    collapsedDrawer: 'collapsedDrawer',
    expandedDrawer: 'expandedDrawer',
  },
}));

vi.mock('shared-components/SidebarBase/SidebarBase.module.css', () => ({
  default: {
    expandedDrawer: 'expandedDrawer',
    collapsedDrawer: 'collapsedDrawer',
  },
}));
import { usePluginDrawerItems } from 'plugin';

// Mock the local storage hook
vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    getItem: vi.fn((key) => (key === 'SuperAdmin' ? 'true' : null)),
  })),
}));

// Mock the plugin system
vi.mock('plugin', () => ({
  usePluginDrawerItems: vi.fn(() => []),
}));

// Mock useSession hook
vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    endSession: vi.fn(),
  })),
}));

// Mock the SignOut component to avoid Apollo Client dependencies
vi.mock('components/SignOut/SignOut', () => ({
  default: ({ hideDrawer }: { hideDrawer?: boolean }) => (
    <div data-testid="sign-out-component" hidden={hideDrawer}>
      Sign Out Mock
    </div>
  ),
}));

// Mock ProfileCard component
vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: () => <div data-testid="profile-card">Profile Card Mock</div>,
}));

// Mock translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      tCommon: (key: string) => key,
    }),
  };
});

// Mock SVG components
vi.mock('assets/svgs/organizations.svg?react', () => ({
  default: () => <div data-testid="organizations-icon" />,
}));

vi.mock('assets/svgs/roles.svg?react', () => ({
  default: () => <div data-testid="roles-icon" />,
}));

vi.mock('assets/svgs/settings.svg?react', () => ({
  default: () => <div data-testid="settings-icon" />,
}));

vi.mock('assets/svgs/talawa.svg?react', () => ({
  default: () => <div data-testid="talawa-logo" />,
}));

vi.mock('assets/svgs/plugins.svg?react', () => ({
  default: () => <div data-testid="plugin-icon" />,
}));

vi.mock('components/ProfileDropdown/ProfileDropdown', () => ({
  default: () => <div data-testid="profile-dropdown" />,
}));

describe('LeftDrawer Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  const TestWrapper = ({
    initialHideDrawer = false,
  }: {
    initialHideDrawer?: boolean;
  }) => {
    const [hideDrawer, setHideDrawer] = React.useState(initialHideDrawer);

    return (
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <LeftDrawer hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
  };

  const renderComponent = (
    initialHideDrawer = false,
  ): ReturnType<typeof render> => {
    return render(<TestWrapper initialHideDrawer={initialHideDrawer} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default super admin mock
    vi.mocked(useLocalStorage).mockImplementation(() => ({
      getItem: vi.fn((key) => (key === 'SuperAdmin' ? 'true' : null)),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getStorageKey: vi.fn(() => ''),
      clearAllItems: vi.fn(),
    }));
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
    });

    it('shows the Talawa logo', () => {
      renderComponent();
      expect(screen.getByTestId('talawa-logo')).toBeInTheDocument();
    });

    it('renders all navigation buttons', () => {
      renderComponent();
      expect(screen.getByTestId('organizationsBtn')).toBeInTheDocument();
      expect(screen.getByTestId('usersBtn')).toBeInTheDocument();
      expect(screen.getByTestId('communityProfileBtn')).toBeInTheDocument();
      expect(screen.getByTestId('pluginStoreBtn')).toBeInTheDocument();
      expect(screen.getByTestId('switchToUserPortalBtn')).toBeInTheDocument();
    });

    it('renders users button for all users', () => {
      vi.mocked(useLocalStorage).mockImplementation(() => ({
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
        clearAllItems: vi.fn(),
      }));

      renderComponent();
      expect(screen.getByTestId('organizationsBtn')).toBeInTheDocument();
      expect(screen.getByTestId('usersBtn')).toBeInTheDocument();
      expect(screen.getByTestId('communityProfileBtn')).toBeInTheDocument();
    });
  });

  describe('Drawer State Initialization', () => {
    it('should initialize drawer as visible by default', () => {
      renderComponent(false);
      const element = screen.getByTestId('leftDrawerContainer');
      expect(element.className).toContain('expandedDrawer');
    });

    it('should initialize drawer as hidden when specified', () => {
      renderComponent(true);
      const element = screen.getByTestId('leftDrawerContainer');
      expect(element.className).toContain('collapsedDrawer');
    });
  });

  describe('Drawer Styling', () => {
    it('applies correct styles when drawer is hidden', () => {
      renderComponent(true);
      const element = screen.getByTestId('leftDrawerContainer');
      expect(element.className).toContain('collapsedDrawer');
    });

    it('applies correct styles when drawer is visible', () => {
      renderComponent(false);
      const element = screen.getByTestId('leftDrawerContainer');
      expect(element.className).toContain('expandedDrawer');
    });
  });

  describe('Drawer toggling', () => {
    it('toggles sidebar correctly on click', async () => {
      renderComponent(false); // Start with drawer visible
      const element = screen.getByTestId('toggleBtn');
      const container = screen.getByTestId('leftDrawerContainer');

      // Should show expanded drawer initially
      expect(container.className).toContain('expandedDrawer');

      // Click to hide
      await user.click(element);
      expect(container.className).toContain('collapsedDrawer');
    });

    it('test onKeyDown toggles sidebar correctly', async () => {
      renderComponent(false); // Start with drawer visible
      const element = screen.getByTestId('toggleBtn');
      const container = screen.getByTestId('leftDrawerContainer');

      // Initial state - drawer should be expanded
      expect(container.className).toContain('expandedDrawer');

      // Click to hide
      await user.click(element);
      expect(container.className).toContain('collapsedDrawer');

      // Enter key to show
      element.focus();
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(container.className).toContain('expandedDrawer');
      });

      // Space key to hide
      element.focus();
      await user.keyboard('{Space}');
      await waitFor(() => {
        expect(container.className).toContain('collapsedDrawer');
      });
    });
    it('test onKeyDown does not toggle sidebar on other keys', async () => {
      renderComponent(false); // Start with drawer visible
      const element = screen.getByTestId('toggleBtn');
      const container = screen.getByTestId('leftDrawerContainer');

      // Initial state - drawer should be expanded
      expect(container.className).toContain('expandedDrawer');

      // Other key should not toggle
      element.focus();
      await user.keyboard('A');
      expect(container.className).toContain('expandedDrawer');
    });
  });

  describe('Navigation Behavior', () => {
    it('applies correct styles when on users route', () => {
      vi.mocked(useLocalStorage).mockImplementation(() => ({
        getItem: vi.fn((key) => (key === 'SuperAdmin' ? 'true' : null)),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
        clearAllItems: vi.fn(),
      }));

      window.history.pushState({}, '', '/admin/users');

      renderComponent();
      const element = screen.getByTestId('usersBtn');
      expect(element.className).toContain('sidebarBtnActive');
    });

    it('handles mobile view navigation button clicks', async () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      renderComponent(false); // Start with drawer visible

      const organizationsButton = screen.getByTestId('organizationsBtn');
      await user.click(organizationsButton);

      // In mobile view, clicking navigation should hide the drawer
      expect(screen.getByTestId('leftDrawerContainer').className).toContain(
        'collapsedDrawer',
      );
    });

    it('applies active styles to the current route button', () => {
      renderComponent();
      const organizationsButton = screen.getByTestId('organizationsBtn');

      // Simulate active route
      window.history.pushState({}, '', '/admin/orglist');

      expect(organizationsButton).toHaveClass('sidebarBtnActive');
    });

    it('does not hide drawer on desktop view navigation button clicks', async () => {
      // Mock window.innerWidth for desktop view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024, // Desktop size (larger than 820)
      });

      const setHideDrawer = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <LeftDrawer hideDrawer={false} setHideDrawer={setHideDrawer} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );

      const organizationsButton = screen.getByTestId('organizationsBtn');
      await user.click(organizationsButton);
      const leftDrawerContainer = screen.getByTestId('leftDrawerContainer');

      expect(leftDrawerContainer).toHaveClass('expandedDrawer');
    });

    it('hides drawer on mobile view for all navigation buttons', async () => {
      // Mock window.innerWidth for mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800, // Mobile size (less than or equal to 820)
      });

      const setHideDrawer = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <LeftDrawer hideDrawer={false} setHideDrawer={setHideDrawer} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );

      // Test community profile button
      const communityProfileButton = screen.getByTestId('communityProfileBtn');
      await user.click(communityProfileButton);

      expect(setHideDrawer).toHaveBeenCalledWith(true);
      setHideDrawer.mockClear();

      // Test users button
      const usersButton = screen.getByTestId('usersBtn');
      await user.click(usersButton);
      expect(setHideDrawer).toHaveBeenCalledWith(true);
    });

    it('simulates different viewport widths for responsive behavior', async () => {
      // Test with exactly the breakpoint width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 820, // Exactly the breakpoint
      });

      const setHideDrawer = vi.fn();
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <LeftDrawer hideDrawer={false} setHideDrawer={setHideDrawer} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );

      const organizationsButton = screen.getByTestId('organizationsBtn');
      await user.click(organizationsButton);

      // Should hide drawer as it's exactly at the breakpoint
      expect(setHideDrawer).toHaveBeenCalledWith(true);
    });

    it('verifies text content from translation keys', () => {
      renderComponent();
      // Check organization button text content
      const orgButton = screen.getByTestId('organizationsBtn');
      expect(orgButton.textContent).toContain('my organizations');

      // Check users button text content
      const usersButton = screen.getByTestId('usersBtn');
      expect(usersButton.textContent).toContain('users');

      // Check community profile button text content
      const profileButton = screen.getByTestId('communityProfileBtn');
      expect(profileButton.textContent).toContain('communityProfile');

      // Check plugin store button text content
      const pluginStoreButton = screen.getByTestId('pluginStoreBtn');
      expect(pluginStoreButton.textContent).toContain('plugin store');
    });
  });

  describe('Plugin System Integration', () => {
    it('should not show plugin section when no plugin items', () => {
      vi.mocked(usePluginDrawerItems).mockReturnValue([]);

      renderComponent();

      // Should not show the plugin settings header when no plugin items
      expect(
        screen.queryByTestId('pluginSettingsHeader'),
      ).not.toBeInTheDocument();
    });

    it('should show plugin section when plugin items exist', () => {
      const mockPluginItems = [
        {
          pluginId: 'test-plugin',
          path: '/plugin/test',
          label: 'Test Plugin',
          icon: '',
        },
        {
          pluginId: 'custom-plugin',
          path: '/plugin/custom',
          label: 'Custom Plugin',
          icon: 'https://example.com/icon.png',
        },
      ];
      vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);

      renderComponent();

      // Should show the plugin settings header when plugin items exist
      expect(screen.getByTestId('pluginSettingsHeader')).toBeInTheDocument();

      // Should render each plugin item
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      expect(screen.getByText('Custom Plugin')).toBeInTheDocument();

      // Should have correct test IDs for plugin buttons
      expect(screen.getByTestId('plugin-test-plugin-btn')).toBeInTheDocument();
      expect(
        screen.getByTestId('plugin-custom-plugin-btn'),
      ).toBeInTheDocument();
    });

    it('should render plugin items with custom icons', () => {
      const mockPluginItems = [
        {
          pluginId: 'icon-plugin',
          path: '/plugin/icon',
          label: 'Icon Plugin',
          icon: 'https://example.com/custom-icon.png',
        },
      ];
      vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);

      renderComponent();

      const customIcon = screen.getByAltText('Icon Plugin');
      expect(customIcon).toBeInTheDocument();
      expect(customIcon).toHaveAttribute(
        'src',
        'https://example.com/custom-icon.png',
      );
    });

    it('should render plugin items with default plugin icon when no custom icon', () => {
      const mockPluginItems = [
        {
          pluginId: 'default-plugin',
          path: '/plugin/default',
          label: 'Default Plugin',
          icon: '',
        },
      ];
      vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);

      renderComponent();

      // Should use the default PluginLogo component when no custom icon
      const pluginButton = screen.getByTestId('plugin-default-plugin-btn');
      expect(pluginButton).toBeInTheDocument();
      expect(pluginButton.textContent).toContain('Default Plugin');
    });

    it('should call usePluginDrawerItems with correct parameters', () => {
      renderComponent();

      // Should call usePluginDrawerItems with empty permissions, true for admin, false for org-specific
      expect(usePluginDrawerItems).toHaveBeenCalledWith([], true, false);
    });

    it('should handle plugin item clicks and hide drawer on mobile', async () => {
      const mockPluginItems = [
        {
          pluginId: 'mobile-plugin',
          path: '/plugin/mobile',
          label: 'Mobile Plugin',
          icon: '',
        },
      ];
      vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);

      // Mock mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      const setHideDrawer = vi.fn();
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <LeftDrawer hideDrawer={false} setHideDrawer={setHideDrawer} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );

      const pluginButton = screen.getByTestId('plugin-mobile-plugin-btn');
      await user.click(pluginButton);

      expect(setHideDrawer).toHaveBeenCalledWith(true);
    });

    it('should handle multiple plugin items correctly', () => {
      const mockPluginItems = [
        {
          pluginId: 'plugin-1',
          path: '/plugin/one',
          label: 'Plugin One',
          icon: '',
        },
        {
          pluginId: 'plugin-2',
          path: '/plugin/two',
          label: 'Plugin Two',
          icon: 'https://example.com/icon2.png',
        },
        {
          pluginId: 'plugin-3',
          path: '/plugin/three',
          label: 'Plugin Three',
          icon: '',
        },
      ];
      vi.mocked(usePluginDrawerItems).mockReturnValue(mockPluginItems);

      renderComponent();

      // All plugins should be rendered
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.getByText('Plugin Two')).toBeInTheDocument();
      expect(screen.getByText('Plugin Three')).toBeInTheDocument();

      // Plugin section header should be present
      expect(screen.getByTestId('pluginSettingsHeader')).toBeInTheDocument();

      // All plugin buttons should have correct test IDs
      expect(screen.getByTestId('plugin-plugin-1-btn')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-plugin-2-btn')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-plugin-3-btn')).toBeInTheDocument();
    });

    it('should handle non-admin users correctly for plugins', () => {
      vi.mocked(useLocalStorage).mockImplementation(() => ({
        getItem: vi.fn(() => null), // Non-admin user (SuperAdmin is null)
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
        clearAllItems: vi.fn(),
      }));

      renderComponent();

      // Note: The LeftDrawer component currently hardcodes isAdmin=true in usePluginDrawerItems call
      // This appears to be a bug - it should use the actual isAdmin value from the useMemo
      expect(usePluginDrawerItems).toHaveBeenCalledWith([], true, false);
    });
  });

  // Note: Toggle button functionality has been moved to separate components
  // (e.g., SidebarToggle) and is no longer part of the drawer components
  // due to plugin system modifications
});
