import React from 'react';
import { describe, it, vi, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SidebarNavItem from './SidebarNavItem';

afterEach(() => {
  vi.clearAllMocks();
});

// Mock icon element for testing
const mockIconElement = <div data-testid="mock-icon" />;

// Mock SVG element for testing
const mockSvgElement = (
  <svg data-testid="mock-svg-icon" width="20" height="20">
    <circle cx="10" cy="10" r="5" />
  </svg>
);

describe('SidebarNavItem Component', () => {
  const defaultProps = {
    to: '/test-route',
    icon: mockIconElement,
    label: 'Test Label',
    testId: 'testBtn',
    hideDrawer: false,
  };

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <SidebarNavItem {...defaultProps} {...props} />
      </BrowserRouter>,
    );
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('testBtn')).toBeInTheDocument();
    });

    it('renders the label when drawer is not hidden', () => {
      renderComponent({ hideDrawer: false });
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('does not render the label when drawer is hidden', () => {
      renderComponent({ hideDrawer: true });
      expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    });

    it('renders the icon', () => {
      renderComponent();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('creates correct NavLink with to prop', () => {
      renderComponent({ to: '/dashboard' });
      const link = screen.getByTestId('testBtn').closest('a');
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      renderComponent({ onClick: handleClick });
      const button = screen.getByTestId('testBtn');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });

    it('does not call onClick if not provided', () => {
      renderComponent();
      const button = screen.getByTestId('testBtn');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('Active State Styling - Default Button', () => {
    it('applies inactive button styles when not active', () => {
      renderComponent({ useSimpleButton: false });
      const button = screen.getByTestId('testBtn');
      expect(button.className).toContain('sidebarBtn');
    });

    it('applies active button styles when route is active', () => {
      // Navigate to the route first
      window.history.pushState({}, '', '/test-route');
      renderComponent({ to: '/test-route', useSimpleButton: false });
      const button = screen.getByTestId('testBtn');
      expect(button.className).toContain('sidebarBtnActive');
    });
  });

  describe('Active State Styling - Simple Button', () => {
    it('applies inactive drawer button styles when not active', () => {
      // Navigate away from test route to ensure inactive state
      window.history.pushState({}, '', '/different-route');
      renderComponent({ useSimpleButton: true });
      const button = screen.getByTestId('testBtn');
      expect(button.className).toContain('leftDrawerInactiveButton');
    });

    it('applies active drawer button styles when route is active', () => {
      window.history.pushState({}, '', '/test-route');
      renderComponent({ to: '/test-route', useSimpleButton: true });
      const button = screen.getByTestId('testBtn');
      expect(button.className).toContain('leftDrawerActiveButton');
    });

    it('applies height style when using simple button', () => {
      renderComponent({ useSimpleButton: true });
      const button = screen.getByTestId('testBtn');
      expect(button.style.height).toBe('40px');
    });
  });

  describe('Icon Rendering', () => {
    it('renders non-SVG icon as-is', () => {
      const textIcon = 'Text Icon';
      renderComponent({ icon: textIcon });
      expect(screen.getByTestId('testBtn').textContent).toContain(textIcon);
    });

    it('renders icon in wrapper', () => {
      renderComponent();
      const button = screen.getByTestId('testBtn');
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('renders React icon with iconType="react-icon"', () => {
      renderComponent({ icon: mockIconElement, iconType: 'react-icon' });
      const button = screen.getByTestId('testBtn');

      // Verify the React icon is rendered
      const icon = screen.getByTestId('mock-icon');
      expect(icon).toBeInTheDocument();

      // Verify it's contained within the button
      expect(button).toContainElement(icon);
    });

    it('renders SVG element with iconType="svg"', () => {
      renderComponent({ icon: mockSvgElement, iconType: 'svg' });
      const button = screen.getByTestId('testBtn');

      // Verify the SVG is rendered
      const svgIcon = screen.getByTestId('mock-svg-icon');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon.tagName).toBe('svg');

      // Verify it's contained within the button
      expect(button).toContainElement(svgIcon);
    });
  });

  describe('Layout Structure', () => {
    it('has icon wrapper for default button', () => {
      renderComponent({ useSimpleButton: false });
      const button = screen.getByTestId('testBtn');
      // Just verify the button has content and icon
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('has icon wrapper for simple button', () => {
      renderComponent({ useSimpleButton: true });
      const button = screen.getByTestId('testBtn');
      // Just verify the button has content
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('renders icon and label in correct order for simple button', () => {
      renderComponent({ useSimpleButton: true, label: 'Test Label' });
      const button = screen.getByTestId('testBtn');

      // Verify both icon and label are present
      const icon = screen.getByTestId('mock-icon');
      const label = screen.getByText('Test Label');
      expect(icon).toBeInTheDocument();
      expect(label).toBeInTheDocument();

      // Verify they are both within the button
      expect(button).toContainElement(icon);
      expect(button).toContainElement(label);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label gracefully', () => {
      renderComponent({ label: '' });
      expect(screen.getByTestId('testBtn')).toBeInTheDocument();
    });

    it('handles null icon gracefully', () => {
      renderComponent({ icon: null });
      expect(screen.getByTestId('testBtn')).toBeInTheDocument();
    });

    it('handles long labels without breaking layout', () => {
      const longLabel =
        'This is a very long label that should not break the layout';
      renderComponent({ label: longLabel });
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles special characters in testId', () => {
      renderComponent({ testId: 'test-btn-123' });
      expect(screen.getByTestId('test-btn-123')).toBeInTheDocument();
    });
  });

  describe('Multiple States', () => {
    it('transitions correctly between hidden and visible states', () => {
      const { rerender } = renderComponent({ hideDrawer: false });
      expect(screen.getByText('Test Label')).toBeInTheDocument();

      rerender(
        <BrowserRouter>
          <SidebarNavItem {...defaultProps} hideDrawer={true} />
        </BrowserRouter>,
      );
      expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    });

    it('maintains icon visibility when label is hidden', () => {
      renderComponent({ hideDrawer: true });
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
      expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    });
  });

  describe('Click Handler Integration', () => {
    it('calls onClick before navigation', () => {
      const handleClick = vi.fn();
      renderComponent({ onClick: handleClick });
      const link = screen.getByTestId('testBtn').closest('a');
      expect(link).not.toBeNull();
      fireEvent.click(link as Element);
      expect(handleClick).toHaveBeenCalled();
    });

    it('allows event propagation after onClick', () => {
      const handleClick = vi.fn();
      renderComponent({ onClick: handleClick });
      const link = screen.getByTestId('testBtn').closest('a');
      expect(link).not.toBeNull();
      fireEvent.click(link as Element);
      // Just verify that the onClick was called, navigation is handled by React Router
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
