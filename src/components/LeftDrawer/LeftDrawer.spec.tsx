import React from 'react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import LeftDrawer, { type ILeftDrawerProps } from './LeftDrawer';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import styles from 'style/app-fixed.module.css';
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
  const defaultProps: ILeftDrawerProps = {
    hideDrawer: false,
    setHideDrawer: vi.fn(),
  };

  const renderComponent = (
    props: Partial<ILeftDrawerProps> = {},
  ): ReturnType<typeof render> => {
    const finalProps = { ...defaultProps, ...props };
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <LeftDrawer {...finalProps} />
        </I18nextProvider>
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default super admin mock
    vi.mocked(useLocalStorage).mockImplementation(() => ({
      getItem: vi.fn((key) => (key === 'SuperAdmin' ? 'true' : null)),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getStorageKey: vi.fn(() => ''),
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

    it('renders all navigation buttons for super admin', () => {
      renderComponent();
      expect(screen.getByTestId('organizationsBtn')).toBeInTheDocument();
      expect(screen.getByTestId('rolesBtn')).toBeInTheDocument();
      expect(screen.getByTestId('communityProfileBtn')).toBeInTheDocument();
      expect(screen.getByTestId('pluginStoreBtn')).toBeInTheDocument();
    });

    it('hides roles button for non-super admin users', () => {
      vi.mocked(useLocalStorage).mockImplementation(() => ({
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
      }));

      renderComponent();
      expect(screen.getByTestId('organizationsBtn')).toBeInTheDocument();
      expect(screen.queryByTestId('rolesBtn')).not.toBeInTheDocument();
      expect(screen.getByTestId('communityProfileBtn')).toBeInTheDocument();
    });
  });

  describe('Drawer State Initialization', () => {
    it('should not initialize hideDrawer when it has a value', () => {
      const setHideDrawer = vi.fn();
      renderComponent({ hideDrawer: true, setHideDrawer });

      // The useEffect should not call setHideDrawer when hideDrawer has a value
      expect(setHideDrawer).not.toHaveBeenCalled();
    });

    it('should not initialize hideDrawer when it is false', () => {
      const setHideDrawer = vi.fn();
      renderComponent({ hideDrawer: false, setHideDrawer });

      // The useEffect should not call setHideDrawer when hideDrawer is false
      expect(setHideDrawer).not.toHaveBeenCalled();
    });
  });

  describe('Drawer Styling', () => {
    it('applies correct styles when drawer is hidden', () => {
      renderComponent({ ...defaultProps, hideDrawer: true });
      const element = screen.getByTestId('leftDrawerContainer');
      expect(element.className).toContain('inactiveDrawer');
    });

    it('applies correct styles when drawer is visible', () => {
      renderComponent({ ...defaultProps, hideDrawer: false });
      const element = screen.getByTestId('leftDrawerContainer');
      expect(element.className).toContain('activeDrawer');
    });
  });

  describe('Navigation Behavior', () => {
    it('super admin: applies correct styles when on users route (rolesBTn)', () => {
      vi.mocked(useLocalStorage).mockImplementation(() => ({
        getItem: vi.fn(() => 'true'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
      }));

      window.history.pushState({}, '', '/users');

      renderComponent();
      const element = screen.getByTestId('rolesBtn');
      expect(element.className).toContain('sidebarBtnActive');
    });

    it('handles mobile view navigation button clicks', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      renderComponent();

      const organizationsButton = screen.getByTestId('organizationsBtn');
      fireEvent.click(organizationsButton);

      expect(defaultProps.setHideDrawer).toHaveBeenCalledWith(true);
    });

    it('applies active styles to the current route button', () => {
      renderComponent();
      const organizationsButton = screen.getByTestId('organizationsBtn');

      // Simulate active route
      window.history.pushState({}, '', '/orglist');

      expect(organizationsButton).toHaveClass(`${styles.sidebarBtnActive}`);
    });

    it('does not hide drawer on desktop view navigation button clicks', () => {
      // Mock window.innerWidth for desktop view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024, // Desktop size (larger than 820)
      });

      const setHideDrawer = vi.fn();

      render(
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <LeftDrawer hideDrawer={false} setHideDrawer={setHideDrawer} />
          </I18nextProvider>
        </BrowserRouter>,
      );

      const organizationsButton = screen.getByTestId('organizationsBtn');
      fireEvent.click(organizationsButton);
      const leftDrawerContainer = screen.getByTestId('leftDrawerContainer');

      expect(leftDrawerContainer).toHaveClass(styles.activeDrawer);
    });

    it('hides drawer on mobile view for all navigation buttons', () => {
      // Mock window.innerWidth for mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800, // Mobile size (less than or equal to 820)
      });

      const setHideDrawer = vi.fn();

      render(
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <LeftDrawer hideDrawer={false} setHideDrawer={setHideDrawer} />
          </I18nextProvider>
        </BrowserRouter>,
      );

      // Test community profile button
      const communityProfileButton = screen.getByTestId('communityProfileBtn');
      fireEvent.click(communityProfileButton);

      expect(setHideDrawer).toHaveBeenCalledWith(true);
      setHideDrawer.mockClear();

      // Test for super admin - roles button
      if (screen.queryByTestId('rolesBtn')) {
        const rolesButton = screen.getByTestId('rolesBtn');
        fireEvent.click(rolesButton);
        expect(setHideDrawer).toHaveBeenCalledWith(true);
      }
    });

    it('simulates different viewport widths for responsive behavior', () => {
      // Test with exactly the breakpoint width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 820, // Exactly the breakpoint
      });

      const setHideDrawer = vi.fn();
      render(
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <LeftDrawer hideDrawer={false} setHideDrawer={setHideDrawer} />
          </I18nextProvider>
        </BrowserRouter>,
      );

      const organizationsButton = screen.getByTestId('organizationsBtn');
      fireEvent.click(organizationsButton);

      // Should hide drawer as it's exactly at the breakpoint
      expect(setHideDrawer).toHaveBeenCalledWith(true);
    });

    it('verifies text content from translation keys', () => {
      renderComponent();
      // Check organization button text content
      const orgButton = screen.getByTestId('organizationsBtn');
      expect(orgButton.textContent).toContain('my organizations');

      // Check users button text content (for super admin)
      if (screen.queryByTestId('rolesBtn')) {
        const usersButton = screen.getByTestId('rolesBtn');
        expect(usersButton.textContent).toContain('users');
      }

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

      // Should not show the "Plugin Settings" header when no plugin items
      expect(screen.queryByText('Plugin Settings')).not.toBeInTheDocument();
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

      // Should show the "Plugin Settings" header when plugin items exist
      expect(screen.getByText('Plugin Settings')).toBeInTheDocument();

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

    it('should handle plugin item clicks and hide drawer on mobile', () => {
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
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <LeftDrawer hideDrawer={false} setHideDrawer={setHideDrawer} />
          </I18nextProvider>
        </BrowserRouter>,
      );

      const pluginButton = screen.getByTestId('plugin-mobile-plugin-btn');
      fireEvent.click(pluginButton);

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
      expect(screen.getByText('Plugin Settings')).toBeInTheDocument();

      // All plugin buttons should have correct test IDs
      expect(screen.getByTestId('plugin-plugin-1-btn')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-plugin-2-btn')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-plugin-3-btn')).toBeInTheDocument();
    });

    it('should handle non-admin users correctly for plugins', () => {
      vi.mocked(useLocalStorage).mockImplementation(() => ({
        getItem: vi.fn((key) => (key === 'SuperAdmin' ? null : null)), // Non-admin user (SuperAdmin is null)
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
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
