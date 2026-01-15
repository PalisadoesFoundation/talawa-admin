import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import UserGlobalScreen from './UserGlobalScreen';

// Mock the child components
vi.mock('components/UserPortal/UserSidebar/UserSidebar', () => ({
  default: vi.fn(({ hideDrawer, setHideDrawer }) => (
    <div data-testid="user-sidebar">
      UserSidebar - Hide: {hideDrawer?.toString()}
      <button onClick={() => setHideDrawer?.(!hideDrawer)}>
        Mock Sidebar Toggle
      </button>
    </div>
  )),
}));

vi.mock('components/ProfileDropdown/ProfileDropdown', () => ({
  default: vi.fn(() => (
    <div data-testid="profile-dropdown">ProfileDropdown</div>
  )),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: (namespace?: string, options?: { keyPrefix?: string }) => {
    const keyPrefix = options?.keyPrefix || '';
    return {
      t: (key: string) => {
        const translations: Record<string, string> = {
          globalFeatures: 'Global Features',
        };
        const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;
        return translations[key] || fullKey;
      },
    };
  },
}));

// Mock CSS modules
vi.mock('./UserGlobalScreen.module.css', () => ({
  default: {
    opendrawer: 'opendrawer',
    collapseSidebarButton: 'collapseSidebarButton',
    drawer: 'drawer',
    pageContainer: 'pageContainer',
    expand: 'expand',
    contract: 'contract',
    titleFlex: 'titleFlex',
  },
}));

// Mock react-router Outlet - DO NOT mock useLocation as it needs to work with MemoryRouter
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet Content</div>),
  };
});

// Mock UserPortalNavigationBar to verify correct props and integration
vi.mock(
  'components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBar',
  () => ({
    UserPortalNavigationBar: vi.fn((props) => (
      <nav
        data-testid="user-portal-navbar"
        data-mode={props.mode}
        data-currentpage={props.currentPage || ''}
      >
        UserPortalNavigationBar
      </nav>
    )),
  }),
);

describe('UserGlobalScreen', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.clearAllMocks();
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

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <I18nextProvider i18n={i18nForTest}>
          <UserGlobalScreen />
        </I18nextProvider>
      </MemoryRouter>,
    );
  };

  describe('Component Rendering', () => {
    it('should render all required components', () => {
      renderComponent();

      expect(screen.getByTestId('user-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
      expect(screen.getByTestId('mainpageright')).toBeInTheDocument();
      expect(screen.getByText('Global Features')).toBeInTheDocument();
    });

    it('should render UserSidebar with correct props', () => {
      renderComponent();

      const sidebar = screen.getByTestId('user-sidebar');
      expect(sidebar).toBeInTheDocument();
      // The sidebar should initially show hideDrawer as false for desktop
    });

    it('should render Outlet for nested routes', () => {
      renderComponent();

      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('should render Global Features heading', () => {
      renderComponent();

      expect(
        screen.getByRole('heading', { name: 'Global Features' }),
      ).toBeInTheDocument();
    });

    it('should render UserPortalNavigationBar with correct props for user variant', () => {
      renderComponent();
      const navbar = screen.getByTestId('user-portal-navbar');
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveAttribute('data-mode', 'user');
      expect(navbar).toHaveAttribute('data-currentpage', '/'); // MemoryRouter default location
    });
  });

  describe('Sidebar State Management', () => {
    it('should pass correct hideDrawer state to UserSidebar', () => {
      renderComponent();

      // Initially hideDrawer should be false (first render)
      expect(screen.getByText(/UserSidebar - Hide:/)).toBeInTheDocument();

      const sidebar = screen.getByTestId('user-sidebar');
      expect(sidebar.textContent).toContain('false');
    });

    it('should allow UserSidebar to toggle drawer state', () => {
      renderComponent();

      // Click the mock sidebar toggle button
      const sidebarToggle = screen.getByText('Mock Sidebar Toggle');
      fireEvent.click(sidebarToggle);

      // State should change to true
      const sidebar = screen.getByTestId('user-sidebar');
      expect(sidebar.textContent).toContain('true');
    });
  });

  describe('Event Listener Management', () => {
    it('should add resize event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      renderComponent();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('should remove resize event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderComponent();
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle window resize at exactly 820px (boundary test)', () => {
      // Set initial width to 820px
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 820,
      });

      renderComponent();

      // At exactly 820px - verify component renders successfully
      expect(screen.getByTestId('user-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('mainpageright')).toBeInTheDocument();
    });
  });
});
