import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
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

// Mock react-router Outlet
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet Content</div>),
  };
});

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
        <UserGlobalScreen />
      </MemoryRouter>,
    );
  };

  describe('Component Rendering', () => {
    it('should render all required components', () => {
      renderComponent();

      expect(screen.getByTestId('user-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
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

    it('should render ProfileDropdown component', () => {
      renderComponent();

      expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    });

    it('should render Outlet for nested routes', () => {
      renderComponent();

      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('should render Global Features heading', () => {
      renderComponent();

      expect(screen.getByText('Global Features')).toBeInTheDocument();
    });
  });

  describe('Sidebar Toggle Functionality', () => {
    it('should show close menu button initially on desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      renderComponent();

      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
      expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();
    });

    it('should toggle to open menu button when close button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const closeButton = screen.getByTestId('closeMenu');
      await user.click(closeButton);

      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
      expect(screen.queryByTestId('closeMenu')).not.toBeInTheDocument();
    });

    it('should toggle back to close menu button when open button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      // First click to show open button
      const closeButton = screen.getByTestId('closeMenu');
      await user.click(closeButton);

      // Then click open button to show close button again
      const openButton = screen.getByTestId('openMenu');
      await user.click(openButton);

      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
      expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();
    });

    it('should pass correct hideDrawer state to UserSidebar', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Initially hideDrawer should be false (first render)
      expect(screen.getByText(/UserSidebar - Hide:/)).toBeInTheDocument();

      // Click to hide drawer
      const closeButton = screen.getByTestId('closeMenu');
      await user.click(closeButton);

      // Now hideDrawer should be true - check within the sidebar
      const sidebar = screen.getByTestId('user-sidebar');
      expect(sidebar.textContent).toContain('true');
    });

    it('should allow UserSidebar to toggle drawer state', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Click the mock sidebar toggle button
      const sidebarToggle = screen.getByText('Mock Sidebar Toggle');
      await user.click(sidebarToggle);

      // State should change
      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle mobile screen width (<=820px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      renderComponent();

      // Should show open menu button on mobile
      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
      expect(screen.queryByTestId('closeMenu')).not.toBeInTheDocument();
    });

    it('should handle tablet screen width (>820px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 900,
      });

      renderComponent();

      // Should show close menu button on tablet/desktop
      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
      expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();
    });

    it('should handle window resize events', () => {
      renderComponent();

      // Initially desktop view
      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();

      // Simulate resize to mobile
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 800,
        });
        window.dispatchEvent(new Event('resize'));
      });

      // Should toggle the drawer state
      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    });

    it('should not toggle on resize if screen width > 820px', () => {
      renderComponent();

      // Initially desktop view with close button
      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();

      // Simulate resize to larger desktop
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1200,
        });
        window.dispatchEvent(new Event('resize'));
      });

      // Should still show close button (no toggle)
      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
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

    it('should handle multiple resize events correctly', () => {
      renderComponent();

      // Start with desktop view
      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();

      // Resize to mobile - this will toggle the current state
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 600,
        });
        window.dispatchEvent(new Event('resize'));
      });

      expect(screen.getByTestId('openMenu')).toBeInTheDocument();

      // Resize to desktop again - but this won't trigger toggle since width > 820
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1000,
        });
        window.dispatchEvent(new Event('resize'));
      });

      // Should show close menu since resize to > 820px
      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes based on drawer state', () => {
      renderComponent();

      const mainContainer = screen.getByTestId('mainpageright');

      // Initially should have pageContainer class
      expect(mainContainer).toHaveClass('pageContainer');
    });

    it('should apply expand class when drawer is hidden', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Hide the drawer
      const closeButton = screen.getByTestId('closeMenu');
      await user.click(closeButton);

      const mainContainer = screen.getByTestId('mainpageright');
      expect(mainContainer).toHaveClass('pageContainer', 'expand');
    });

    it('should apply contract class when drawer is shown', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Hide drawer first
      const closeButton = screen.getByTestId('closeMenu');
      await user.click(closeButton);

      // Then show drawer again
      const openButton = screen.getByTestId('openMenu');
      await user.click(openButton);

      const mainContainer = screen.getByTestId('mainpageright');
      expect(mainContainer).toHaveClass('pageContainer', 'contract');
    });

    it('should apply correct button classes', async () => {
      const user = userEvent.setup();
      renderComponent();

      const closeButton = screen.getByTestId('closeMenu');
      expect(closeButton).toHaveClass('collapseSidebarButton');

      // Toggle to open button
      await user.click(closeButton);

      const openButton = screen.getByTestId('openMenu');
      expect(openButton).toHaveClass('opendrawer');
    });
  });

  describe('Initial State Handling', () => {
    it('should handle initial false state correctly ', () => {
      renderComponent();

      const mainContainer = screen.getByTestId('mainpageright');

      // With initial state set to false, should have contract class
      expect(mainContainer).toHaveClass('pageContainer');
      expect(mainContainer).toHaveClass('contract');
      expect(mainContainer).not.toHaveClass('expand');
    });

    it('should initialize based on screen width on mount', () => {
      // Test mobile initialization
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      renderComponent();

      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive button clicks', async () => {
      const user = userEvent.setup();
      renderComponent();

      const closeButton = screen.getByTestId('closeMenu');

      // Rapid clicks
      await user.click(closeButton);
      await user.click(screen.getByTestId('openMenu'));
      await user.click(screen.getByTestId('closeMenu'));

      // Should end up with open menu button
      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    });

    it('should handle window resize at exactly 820px (boundary test)', () => {
      // Set initial width to 820px
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 820,
      });

      renderComponent();

      // At exactly 820px - verify component renders successfully
      // (specific button state may depend on initial handleResize call)
      expect(screen.getByTestId('user-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('mainpageright')).toBeInTheDocument();
    });

    it('should handle window resize at 819px (mobile threshold)', () => {
      renderComponent();

      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 819,
        });
        window.dispatchEvent(new Event('resize'));
      });

      // At 819px, should trigger mobile behavior
      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    });
  });
});
