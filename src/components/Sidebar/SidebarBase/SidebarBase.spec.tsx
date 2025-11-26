import React from 'react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import SidebarBase from './SidebarBase';
import useLocalStorage from 'utils/useLocalstorage';

// Mock the local storage hook
vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    getStorageKey: vi.fn(() => ''),
  })),
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
      expect(brandingDiv).toHaveStyle({ display: 'none' });
    });

    it('shows branding text when drawer is expanded', () => {
      renderComponent({ hideDrawer: false });
      const brandingDiv = screen.getByTestId('talawa-logo').parentElement;
      expect(brandingDiv).toHaveStyle({ display: 'flex' });
    });
  });

  describe('Toggle Functionality', () => {
    it('calls setHideDrawer when toggle button is clicked', () => {
      renderComponent({ hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      fireEvent.click(toggleBtn);
      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('toggles from hidden to visible when clicked', () => {
      renderComponent({ hideDrawer: true });
      const toggleBtn = screen.getByTestId('toggleBtn');
      fireEvent.click(toggleBtn);
      expect(mockSetHideDrawer).toHaveBeenCalledWith(false);
    });

    it('handles Enter key press to toggle', () => {
      renderComponent({ hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      fireEvent.keyDown(toggleBtn, { key: 'Enter', code: 'Enter' });
      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('handles Space key press to toggle', () => {
      renderComponent({ hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      fireEvent.keyDown(toggleBtn, { key: ' ', code: 'Space' });
      expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    });

    it('does not toggle on other key presses', () => {
      renderComponent({ hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      fireEvent.keyDown(toggleBtn, { key: 'A', code: 'KeyA' });
      expect(mockSetHideDrawer).not.toHaveBeenCalled();
    });

    it('prevents default behavior on Enter key', () => {
      renderComponent({ hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');
      toggleBtn.dispatchEvent(enterEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('prevents default behavior on Space key', () => {
      renderComponent({ hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');
      toggleBtn.dispatchEvent(spaceEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Persist Toggle State', () => {
    it('does not persist state to localStorage when persistToggleState is false', () => {
      const mockSetItem = vi.fn();
      vi.mocked(useLocalStorage).mockReturnValue({
        setItem: mockSetItem,
        getItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
      });

      renderComponent({ persistToggleState: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      fireEvent.click(toggleBtn);
      expect(mockSetItem).not.toHaveBeenCalled();
    });

    it('persists state to localStorage when persistToggleState is true', () => {
      const mockSetItem = vi.fn();
      vi.mocked(useLocalStorage).mockReturnValue({
        setItem: mockSetItem,
        getItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
      });

      renderComponent({ persistToggleState: true, hideDrawer: false });
      const toggleBtn = screen.getByTestId('toggleBtn');
      fireEvent.click(toggleBtn);
      expect(mockSetItem).toHaveBeenCalledWith('sidebar', 'true');
    });

    it('persists correct state when toggling from hidden to visible', () => {
      const mockSetItem = vi.fn();
      vi.mocked(useLocalStorage).mockReturnValue({
        setItem: mockSetItem,
        getItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn(() => ''),
      });

      renderComponent({ persistToggleState: true, hideDrawer: true });
      const toggleBtn = screen.getByTestId('toggleBtn');
      fireEvent.click(toggleBtn);
      expect(mockSetItem).toHaveBeenCalledWith('sidebar', 'false');
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
      renderComponent({ backgroundColor: '#f0f7fb' });
      const container = screen.getByTestId('leftDrawerContainer');
      expect(container).toHaveStyle({ backgroundColor: '#f0f7fb' });
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

    it('has proper tabIndex on toggle button', () => {
      renderComponent();
      const toggleBtn = screen.getByTestId('toggleBtn');
      expect(toggleBtn).toHaveAttribute('tabIndex', '0');
    });

    it('has aria-label on hamburger icon', () => {
      renderComponent();
      const icon = screen
        .getByTestId('leftDrawerContainer')
        .querySelector('[aria-label]');
      expect(icon).toHaveAttribute('aria-label', 'Toggle sidebar');
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
      expect(childrenContainer?.className).toContain('d-flex');
      expect(childrenContainer?.className).toContain('flex-column');
      expect(childrenContainer?.className).toContain('sidebarcompheight');
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
      const icon = screen
        .getByTestId('leftDrawerContainer')
        .querySelector('[aria-label="Toggle sidebar"]');
      expect(icon).toHaveStyle({ marginLeft: '10px' });
    });

    it('positions hamburger icon without margin when drawer is collapsed', () => {
      renderComponent({ hideDrawer: true });
      const icon = screen
        .getByTestId('leftDrawerContainer')
        .querySelector('[aria-label="Toggle sidebar"]');
      expect(icon).toHaveStyle({ marginLeft: '0px' });
    });
  });
});
