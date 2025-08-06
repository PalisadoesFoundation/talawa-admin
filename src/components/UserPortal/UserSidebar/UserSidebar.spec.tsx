import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing';
import UserSidebar from './UserSidebar';
import type { InterfaceUserSidebarProps } from './UserSidebar';

// Mock the dependencies
const mockT = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    talawaUserPortal: 'Talawa User Portal',
    'my organizations': 'My Organizations',
    menu: 'Menu',
    Settings: 'Settings', // Capital S for common namespace
  };
  return translations[key] || key;
});

const mockTCommon = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    menu: 'Menu',
    Settings: 'Settings',
  };
  return translations[key] || key;
});

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn((namespace: string) => {
    if (namespace === 'common') {
      return { t: mockTCommon };
    }
    return { t: mockT };
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: vi.fn(() => (
    <div data-testid="profile-dropdown">
      <div data-testid="display-name">Test User</div>
      <div data-testid="display-type">Admin</div>
      <button data-testid="profileBtn">Profile Button</button>
    </div>
  )),
}));

vi.mock('components/UserPortal/SignOut/SignOut', () => ({
  default: vi.fn(() => <button data-testid="signOutBtn">Sign Out</button>),
}));

const { mockUsePluginDrawerItems } = vi.hoisted(() => ({
  mockUsePluginDrawerItems: vi.fn(
    (): import('plugin/types').IDrawerExtension[] => [],
  ),
}));

const { mockUseLocalStorage } = vi.hoisted(() => ({
  mockUseLocalStorage: vi.fn(() => ({ setItem: vi.fn() })),
}));

vi.mock('plugin', () => ({
  usePluginDrawerItems: mockUsePluginDrawerItems,
}));

vi.mock('utils/useLocalstorage', () => ({
  default: mockUseLocalStorage,
  setItem: vi.fn(),
}));

// Mock SVG imports
vi.mock('assets/svgs/organizations.svg?react', () => ({
  default: vi.fn(({ stroke }) => (
    <div data-testid="organizations-icon" data-stroke={stroke}>
      OrganizationsIcon
    </div>
  )),
}));

vi.mock('assets/svgs/settings.svg?react', () => ({
  default: vi.fn(({ stroke }) => (
    <div data-testid="settings-icon" data-stroke={stroke}>
      SettingsIcon
    </div>
  )),
}));

vi.mock('assets/svgs/talawa.svg?react', () => ({
  default: vi.fn(() => <div data-testid="talawa-logo">TalawaLogo</div>),
}));

vi.mock('assets/svgs/plugins.svg?react', () => ({
  default: vi.fn(({ stroke }) => (
    <div data-testid="plugin-icon" data-stroke={stroke}>
      PluginLogo
    </div>
  )),
}));

// Mock CSS modules
vi.mock('../../../style/app-fixed.module.css', () => ({
  default: {
    leftDrawer: 'leftDrawer',
    hideElemByDefault: 'hideElemByDefault',
    collapsedDrawer: 'collapsedDrawer',
    expandedDrawer: 'expandedDrawer',
    talawaLogo: 'talawaLogo',
    talawaText: 'talawaText',
    titleHeader: 'titleHeader',
    leftbarcompheight: 'leftbarcompheight',
    optionList: 'optionList',
    iconWrapper: 'iconWrapper',
  },
}));

describe('UserSidebar', () => {
  const originalInnerWidth = window.innerWidth;
  const mockSetHideDrawer = vi.fn();

  const defaultProps: InterfaceUserSidebarProps = {
    hideDrawer: false,
    setHideDrawer: mockSetHideDrawer,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockT.mockClear();
    mockTCommon.mockClear();
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

  const renderComponent = (props: Partial<InterfaceUserSidebarProps> = {}) => {
    return render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <UserSidebar {...defaultProps} {...props} />
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  describe('Component Rendering', () => {
    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
      expect(screen.getByTestId('talawa-logo')).toBeInTheDocument();
      expect(screen.getByText('Talawa User Portal')).toBeInTheDocument();
      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByTestId('orgsBtn')).toBeInTheDocument();
      expect(screen.getByTestId('settingsBtn')).toBeInTheDocument();
      expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    });

    it('should render navigation links with correct text', () => {
      renderComponent();

      expect(screen.getByText('My Organizations')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render icons for navigation items', () => {
      renderComponent();

      expect(screen.getByTestId('organizations-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
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

  describe('Responsive Behavior', () => {
    it('should hide drawer on mobile when organization link is clicked', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800, // Mobile width
      });

      renderComponent();

      const orgsButton = screen.getByTestId('orgsBtn');
      fireEvent.click(orgsButton);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('should hide drawer on mobile when settings link is clicked', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600, // Mobile width
      });

      renderComponent();

      const settingsButton = screen.getByTestId('settingsBtn');
      fireEvent.click(settingsButton);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('should not hide drawer on desktop when links are clicked', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200, // Desktop width
      });

      renderComponent();

      const orgsButton = screen.getByTestId('orgsBtn');
      fireEvent.click(orgsButton);

      expect(mockSetHideDrawer).not.toHaveBeenCalled();
    });

    it('should check mobile breakpoint at exactly 820px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 820, // Exact breakpoint - should trigger mobile behavior (<=820)
      });

      renderComponent();

      const orgsButton = screen.getByTestId('orgsBtn');
      fireEvent.click(orgsButton);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('should trigger mobile behavior at 819px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 819, // Just below breakpoint
      });

      renderComponent();

      const settingsButton = screen.getByTestId('settingsBtn');
      fireEvent.click(settingsButton);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('should not trigger mobile behavior at 821px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 821, // Just above breakpoint
      });

      renderComponent();

      const orgsButton = screen.getByTestId('orgsBtn');
      fireEvent.click(orgsButton);

      expect(mockSetHideDrawer).not.toHaveBeenCalled();
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for organizations link', () => {
      renderComponent();

      const orgsLink = screen.getByTestId('orgsBtn').closest('a');
      expect(orgsLink).toHaveAttribute('href', '/user/organizations');
    });

    it('should have correct href for settings link', () => {
      renderComponent();

      const settingsLink = screen.getByTestId('settingsBtn').closest('a');
      expect(settingsLink).toHaveAttribute('href', '/user/settings');
    });
  });

  describe('Plugin Integration', () => {
    it('should not show plugin section when no plugin items', () => {
      mockUsePluginDrawerItems.mockReturnValue([]);

      renderComponent();

      expect(screen.queryByText('Plugin Settings')).not.toBeInTheDocument();
    });

    it('should show plugin section when plugin items exist', () => {
      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
        {
          pluginId: 'test-plugin',
          path: '/user/plugin/test',
          label: 'Test Plugin',
          icon: 'test-icon.png',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      expect(screen.getByText('Plugin Settings')).toBeInTheDocument();
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });

    it('should render plugin item with custom icon', () => {
      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
        {
          pluginId: 'test-plugin',
          path: '/user/plugin/test',
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
          path: '/user/plugin/test',
          label: 'Test Plugin',
          icon: '',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      expect(screen.getByTestId('plugin-icon')).toBeInTheDocument();
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
          path: '/user/plugin/test',
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
        false, // isAdmin
        false, // isOrg
      );
    });

    it('should render multiple plugin items', () => {
      const mockPluginItems: import('plugin/types').IDrawerExtension[] = [
        {
          pluginId: 'plugin-1',
          path: '/user/plugin/1',
          label: 'Plugin One',
          icon: 'icon1.png',
        },
        {
          pluginId: 'plugin-2',
          path: '/user/plugin/2',
          label: 'Plugin Two',
          icon: '',
        },
      ];
      mockUsePluginDrawerItems.mockReturnValue(mockPluginItems);

      renderComponent();

      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.getByText('Plugin Two')).toBeInTheDocument();
      expect(screen.getByAltText('Plugin One')).toBeInTheDocument();
      expect(screen.getAllByTestId('plugin-icon')).toHaveLength(1);
    });
  });

  describe('Internationalization', () => {
    it('should use correct translation keys', () => {
      renderComponent();

      expect(mockT).toHaveBeenCalledWith('talawaUserPortal');
      expect(mockT).toHaveBeenCalledWith('my organizations');
      expect(mockTCommon).toHaveBeenCalledWith('menu');
      expect(mockTCommon).toHaveBeenCalledWith('Settings');
    });
  });

  describe('Component Structure', () => {
    it('should have ProfileDropdown in the bottom section', () => {
      renderComponent();

      const profileDropdown = screen.getByTestId('profile-dropdown');
      expect(profileDropdown).toBeInTheDocument();
    });

    it('should apply correct structure classes', () => {
      renderComponent();

      const container = screen.getByTestId('leftDrawerContainer');
      expect(container).toHaveClass('leftDrawer');

      // Check for the main content structure
      const mainContent = container.querySelector('.leftbarcompheight');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveClass(
        'd-flex',
        'flex-column',
        'leftbarcompheight',
      );
    });
  });

  describe('Active State Styling', () => {
    it('should apply active styles when on organizations route', () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter initialEntries={['/user/organizations']}>
            <UserSidebar {...defaultProps} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const orgsButton = screen.getByTestId('orgsBtn');
      expect(orgsButton).toHaveClass('btn-success');
    });

    it('should apply active styles when on settings route', () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter initialEntries={['/user/settings']}>
            <UserSidebar {...defaultProps} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const settingsButton = screen.getByTestId('settingsBtn');
      expect(settingsButton).toHaveClass('btn-success');
    });

    it('should apply active stroke color to icons when route is active', () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter initialEntries={['/user/organizations']}>
            <UserSidebar {...defaultProps} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const orgIcon = screen.getByTestId('organizations-icon');
      expect(orgIcon).toHaveAttribute('data-stroke', '#000000');
    });

    it('should apply inactive stroke color to icons when route is not active', () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter initialEntries={['/user/other']}>
            <UserSidebar {...defaultProps} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const orgIcon = screen.getByTestId('organizations-icon');
      expect(orgIcon).toHaveAttribute('data-stroke', 'var(--bs-secondary)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined plugin items gracefully', () => {
      mockUsePluginDrawerItems.mockReturnValue(undefined as any);

      expect(() => renderComponent()).not.toThrow();
      expect(screen.queryByText('Plugin Settings')).not.toBeInTheDocument();
    });

    it('should handle null setHideDrawer prop', () => {
      const propsWithNullSetter = {
        hideDrawer: false,
        setHideDrawer: null as any,
      };

      expect(() => renderComponent(propsWithNullSetter)).not.toThrow();
    });

    it('should handle window resize during interaction', () => {
      renderComponent();

      // Start on desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const orgsButton = screen.getByTestId('orgsBtn');
      fireEvent.click(orgsButton);
      expect(mockSetHideDrawer).not.toHaveBeenCalled();

      // Change to mobile during next interaction
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      fireEvent.click(orgsButton);
      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });
  });

  describe('Toggle Button Functionality', () => {
    it('should render toggle button with correct attributes', () => {
      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');

      expect(toggleBtn).toBeInTheDocument();
      expect(toggleBtn).toHaveAttribute('tabIndex', '0');
      expect(toggleBtn).toHaveAttribute('role', 'button');
      // The aria-label is on the FaBars icon inside the toggle button
      expect(
        toggleBtn.querySelector('[aria-label="Toggle sidebar"]'),
      ).toBeInTheDocument();
    });

    it('should toggle drawer when toggle button is clicked', () => {
      const mockSetItem = vi.fn();
      mockUseLocalStorage.mockReturnValue({ setItem: mockSetItem });

      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');

      fireEvent.click(toggleBtn);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
      expect(mockSetItem).toHaveBeenCalledWith('sidebar', 'true');
    });

    it('should toggle drawer when Enter key is pressed on toggle button', () => {
      const mockSetItem = vi.fn();
      mockUseLocalStorage.mockReturnValue({ setItem: mockSetItem });

      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');

      fireEvent.keyDown(toggleBtn, { key: 'Enter' });

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
      expect(mockSetItem).toHaveBeenCalledWith('sidebar', 'true');
    });

    it('should toggle drawer when Space key is pressed on toggle button', () => {
      const mockSetItem = vi.fn();
      mockUseLocalStorage.mockReturnValue({ setItem: mockSetItem });

      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');

      fireEvent.keyDown(toggleBtn, { key: ' ' });

      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
      expect(mockSetItem).toHaveBeenCalledWith('sidebar', 'true');
    });

    it('should not toggle drawer when other keys are pressed on toggle button', () => {
      const mockSetItem = vi.fn();
      mockUseLocalStorage.mockReturnValue({ setItem: mockSetItem });

      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');

      fireEvent.keyDown(toggleBtn, { key: 'Tab' });
      fireEvent.keyDown(toggleBtn, { key: 'Escape' });
      fireEvent.keyDown(toggleBtn, { key: 'ArrowDown' });

      expect(mockSetHideDrawer).not.toHaveBeenCalled();
      expect(mockSetItem).not.toHaveBeenCalled();
    });

    it('should toggle from expanded to collapsed state', () => {
      const mockSetItem = vi.fn();
      mockUseLocalStorage.mockReturnValue({ setItem: mockSetItem });

      renderComponent({ hideDrawer: true });
      const toggleBtn = screen.getByTestId('toggleBtn');

      fireEvent.click(toggleBtn);

      expect(mockSetHideDrawer).toHaveBeenCalledWith(false);
      expect(mockSetItem).toHaveBeenCalledWith('sidebar', 'false');
    });
  });
});
