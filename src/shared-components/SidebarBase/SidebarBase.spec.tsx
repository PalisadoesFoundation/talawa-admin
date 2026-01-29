import React from 'react';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import SidebarBase from './SidebarBase';
import { useLocalStorage } from 'utils/useLocalstorage';
import { SIDEBAR_TEST_BG_COLOR } from 'utils/testConstants';

// Mock the local storage hook
const { mockUseLocalStorage } = vi.hoisted(() => ({
  mockUseLocalStorage: vi.fn(() => ({
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    getStorageKey: vi.fn(() => ''),
  })),
}));

vi.mock('utils/useLocalstorage', () => ({
  useLocalStorage: mockUseLocalStorage,
  default: mockUseLocalStorage,
}));

// Mock translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

// Mock SVG components
vi.mock('assets/svgs/talawa.svg?react', () => ({
  default: () => <div data-testid="talawa-logo" />,
}));

describe('SidebarBase Component', () => {
  const mockSetHideDrawer = vi.fn();

  const defaultProps = {
    hideDrawer: false,
    setHideDrawer: mockSetHideDrawer,
    portalType: 'admin' as const,
    children: <div data-testid="children-content">Test Content</div>,
  };

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <SidebarBase {...defaultProps} {...props} />
        </I18nextProvider>
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
    });

    it('renders children content', () => {
      renderComponent();
      expect(screen.getByTestId('children-content')).toBeInTheDocument();
    });

    it('renders Talawa logo', () => {
      renderComponent();
      expect(screen.getByTestId('talawa-logo')).toBeInTheDocument();
    });

    it('renders toggle button', () => {
      renderComponent();
      expect(screen.getByTestId('toggleBtn')).toBeInTheDocument();
    });
  });

  describe('Portal Type', () => {
    it('displays admin portal text when portalType is admin', () => {
      renderComponent({ portalType: 'admin' });
      const container = screen.getByTestId('leftDrawerContainer');
      expect(container.textContent).toContain('adminPortal');
    });

    it('displays user portal text when portalType is user', () => {
      renderComponent({ portalType: 'user' });
      const container = screen.getByTestId('leftDrawerContainer');
      expect(container.textContent).toContain('userPortal');
    });
  });

  describe('Drawer State', () => {
    it('applies expanded drawer class when hideDrawer is false', () => {
      renderComponent({ hideDrawer: false });
      const container = screen.getByTestId('leftDrawerContainer');
      expect(container.className).toContain('expandedDrawer');
    });

    it('applies collapsed drawer class when hideDrawer is true', () => {
      renderComponent({ hideDrawer: true });
      const container = screen.getByTestId('leftDrawerContainer');
      expect(container.className).toContain('collapsedDrawer');
    });

    it('hides branding text when drawer is collapsed', () => {
      renderComponent({ hideDrawer: true });
      // The branding div should have display: none
      const brandingDiv = screen.getByTestId('talawa-logo').parentElement;
      expect(brandingDiv?.className).toMatch(/sidebarBrandingContainerHidden/);
    });

    it('shows branding text when drawer is expanded', () => {
      renderComponent({ hideDrawer: false });
      const brandingDiv = screen.getByTestId('talawa-logo').parentElement;
      expect(brandingDiv?.className).toMatch(/sidebarBrandingContainer/);
    });
  });

  describe('Toggle Functionality', () => {
    it('calls setHideDrawer when toggle button is clicked', async () => {
      renderComponent({ hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      await userEvent.click(toggleBtn);
      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('toggles from hidden to visible when clicked', async () => {
      renderComponent({ hideDrawer: true });
      const toggleBtn = screen.getByTestId('toggleBtn');
      await userEvent.click(toggleBtn);
      expect(mockSetHideDrawer).toHaveBeenCalledWith(false);
    });
  });

  describe('Persist Toggle State', () => {
    it('does not persist state to localStorage when persistToggleState is false', async () => {
      const mockSetItem = vi.fn();
      vi.mocked(useLocalStorage).mockReturnValue({
        setItem: mockSetItem,
        getItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
        clearAllItems: vi.fn(),
      });

      renderComponent({ persistToggleState: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      await userEvent.click(toggleBtn);
      expect(mockSetItem).not.toHaveBeenCalled();
    });

    it('persists state to localStorage when persistToggleState is true', async () => {
      const mockSetItem = vi.fn();
      vi.mocked(useLocalStorage).mockReturnValue({
        setItem: mockSetItem,
        getItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
        clearAllItems: vi.fn(),
      });

      renderComponent({ persistToggleState: true, hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      await userEvent.click(toggleBtn);
      expect(mockSetItem).toHaveBeenCalledWith('sidebar', true);
    });

    it('persists correct state when toggling from hidden to visible', async () => {
      const mockSetItem = vi.fn();
      vi.mocked(useLocalStorage).mockReturnValue({
        setItem: mockSetItem,
        getItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
        clearAllItems: vi.fn(),
      });

      renderComponent({ persistToggleState: true, hideDrawer: true });
      const toggleBtn = screen.getByTestId('toggleBtn');
      await userEvent.click(toggleBtn);
      expect(mockSetItem).toHaveBeenCalledWith('sidebar', false);
    });
  });

  describe('Optional Content', () => {
    it('renders header content when provided', () => {
      const headerContent = (
        <div data-testid="header-content">Header Content</div>
      );
      renderComponent({ headerContent });
      expect(screen.getByTestId('header-content')).toBeInTheDocument();
    });

    it('does not render header content when not provided', () => {
      renderComponent();
      expect(screen.queryByTestId('header-content')).not.toBeInTheDocument();
    });

    it('renders footer content when provided', () => {
      const footerContent = (
        <div data-testid="footer-content">Footer Content</div>
      );
      renderComponent({ footerContent });
      expect(screen.getByTestId('footer-content')).toBeInTheDocument();
    });

    it('does not render footer content when not provided', () => {
      renderComponent();
      expect(screen.queryByTestId('footer-content')).not.toBeInTheDocument();
    });

    it('renders both header and footer content together', () => {
      const headerContent = <div data-testid="header-content">Header</div>;
      const footerContent = <div data-testid="footer-content">Footer</div>;
      renderComponent({ headerContent, footerContent });
      expect(screen.getByTestId('header-content')).toBeInTheDocument();
      expect(screen.getByTestId('footer-content')).toBeInTheDocument();
    });
  });

  describe('Background Color', () => {
    it('applies custom background color when provided', () => {
      const bgProp = 'backgroundColor';
      renderComponent({ [bgProp]: SIDEBAR_TEST_BG_COLOR });
      const container = screen.getByTestId('leftDrawerContainer');
      expect(container).toHaveStyle({ [bgProp]: SIDEBAR_TEST_BG_COLOR });
    });

    it('does not apply background color when not provided', () => {
      renderComponent();
      const container = screen.getByTestId('leftDrawerContainer');
      expect(container.style.backgroundColor).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('has native button semantics on toggle button', () => {
      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');
      // Verify it's a native button element (has implicit button role)
      expect(toggleBtn.tagName).toBe('BUTTON');
    });

    it('has aria-label on toggle button', () => {
      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');
      expect(toggleBtn).toHaveAttribute('aria-label', 'toggleSidebar');
    });

    it('has button type attribute', () => {
      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');
      expect(toggleBtn).toHaveAttribute('type', 'button');
    });
  });

  describe('Layout Structure', () => {
    it('maintains correct class structure for children', () => {
      renderComponent();
      const childrenContainer =
        screen.getByTestId('children-content').parentElement;
      expect(childrenContainer?.className).toContain('optionList');

      const mainContainer = childrenContainer?.parentElement;
      expect(mainContainer?.className).toContain('d-flex');
      expect(mainContainer?.className).toContain('flex-column');
      expect(mainContainer?.className).toContain('sidebarcompheight');
    });

    it('has correct footer class when footer content provided', () => {
      const footerContent = <div data-testid="footer-content">Footer</div>;
      renderComponent({ footerContent });
      const footerContainer =
        screen.getByTestId('footer-content').parentElement;
      expect(footerContainer?.className).toContain('userSidebarOrgFooter');
    });
  });

  describe('Hamburger Icon Positioning', () => {
    it('positions hamburger icon with margin when drawer is expanded', () => {
      renderComponent({ hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      const icon = toggleBtn.querySelector('svg');
      expect(icon?.className.baseVal).toMatch(/hamburgerIconExpanded/);
    });

    it('positions hamburger icon without margin when drawer is collapsed', () => {
      renderComponent({ hideDrawer: true });
      const toggleBtn = screen.getByTestId('toggleBtn');
      const icon = toggleBtn.querySelector('svg');
      expect(icon?.className.baseVal).toMatch(/hamburgerIconCollapsed/);
    });
  });
});
