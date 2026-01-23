import React from 'react';
import { describe, it, vi, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import SidebarPluginSection from './SidebarPluginSection';
import type { IDrawerExtension } from 'plugin';

afterEach(() => {
  vi.clearAllMocks();
});

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

// Mock PluginLogo SVG
vi.mock('assets/svgs/plugins.svg?react', () => ({
  default: ({
    fill,
    fontSize,
    stroke,
  }: {
    fill: string;
    fontSize: number;
    stroke: string;
  }) => (
    <div
      data-testid="plugin-logo"
      data-fill={fill}
      data-fontsize={fontSize}
      data-stroke={stroke}
    />
  ),
}));

describe('SidebarPluginSection Component', () => {
  const mockPluginItems: IDrawerExtension[] = [
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
      path: '/plugin/:orgId/three',
      label: 'Plugin Three',
      icon: '',
    },
  ];

  const defaultProps = {
    pluginItems: mockPluginItems,
    hideDrawer: false,
  };

  const renderComponent = (props = {}, initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <I18nextProvider i18n={i18n}>
          <SidebarPluginSection {...defaultProps} {...props} />
        </I18nextProvider>
      </MemoryRouter>,
    );
  };

  describe('Visibility', () => {
    it('returns null when pluginItems is empty array', () => {
      const { container } = renderComponent({ pluginItems: [] });
      expect(container.firstChild).toBeNull();
    });

    it('returns null when pluginItems is null', () => {
      const { container } = renderComponent({ pluginItems: null });
      expect(container.firstChild).toBeNull();
    });

    it('returns null when pluginItems is undefined', () => {
      const { container } = renderComponent({ pluginItems: undefined });
      expect(container.firstChild).toBeNull();
    });

    it('renders when pluginItems has items', () => {
      renderComponent();
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
    });
  });

  describe('Plugin Items Rendering', () => {
    it('renders all plugin items', () => {
      renderComponent();
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.getByText('Plugin Two')).toBeInTheDocument();
      expect(screen.getByText('Plugin Three')).toBeInTheDocument();
    });

    it('creates correct test IDs for plugin buttons', () => {
      renderComponent();
      expect(screen.getByTestId('plugin-plugin-1-btn')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-plugin-2-btn')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-plugin-3-btn')).toBeInTheDocument();
    });

    it('renders plugin with custom icon', () => {
      renderComponent();
      const customIcon = screen.getByAltText('Plugin Two');
      expect(customIcon).toBeInTheDocument();
      expect(customIcon).toHaveAttribute(
        'src',
        'https://example.com/icon2.png',
      );
    });

    it('renders plugin with default PluginLogo when no icon', () => {
      renderComponent();
      const pluginLogos = screen.getAllByTestId('plugin-logo');
      expect(pluginLogos.length).toBeGreaterThan(0);
    });

    it('sets correct size for custom icon', () => {
      renderComponent();
      const customIcon = screen.getByAltText('Plugin Two');
      expect(customIcon.className).toContain('pluginIcon');
    });
  });

  describe('Organization ID Handling', () => {
    it('replaces :orgId in path when orgId is provided', () => {
      renderComponent({ orgId: 'org123' });
      const link = screen.getByTestId('plugin-plugin-3-btn').closest('a');
      expect(link).toHaveAttribute('href', '/plugin/org123/three');
    });

    it('uses path as-is when no orgId provided', () => {
      renderComponent({ orgId: undefined });
      const link = screen.getByTestId('plugin-plugin-1-btn').closest('a');
      expect(link).toHaveAttribute('href', '/plugin/one');
    });

    it('does not modify paths without :orgId placeholder', () => {
      renderComponent({ orgId: 'org123' });
      const link = screen.getByTestId('plugin-plugin-1-btn').closest('a');
      expect(link).toHaveAttribute('href', '/plugin/one');
    });
  });

  describe('Click Handling', () => {
    it('calls onItemClick when plugin item is clicked', async () => {
      const handleItemClick = vi.fn();
      renderComponent({ onItemClick: handleItemClick });
      const link = screen.getByTestId('plugin-plugin-1-btn').closest('a');
      expect(link).not.toBeNull();
      await userEvent.click(link as HTMLAnchorElement);
      expect(handleItemClick).toHaveBeenCalled();
    });

    it('does not error when onItemClick is not provided', async () => {
      renderComponent({ onItemClick: undefined });
      const link = screen.getByTestId('plugin-plugin-1-btn').closest('a');
      expect(link).not.toBeNull();
      await userEvent.click(link as HTMLAnchorElement);
    });
  });

  describe('Button Styling - Default Button', () => {
    it('uses default button styles when useSimpleButton is false', () => {
      renderComponent({ useSimpleButton: false });
      const button = screen.getByTestId('plugin-plugin-1-btn');
      expect(button.className).toContain('sidebarBtn');
    });

    it('applies active styles when on plugin route (default button)', () => {
      renderComponent({ useSimpleButton: false }, '/plugin/one');
      const button = screen.getByTestId('plugin-plugin-1-btn');
      expect(button.className).toContain('sidebarBtnActive');
    });
  });

  describe('Button Styling - Simple Button', () => {
    it('uses simple button styles when useSimpleButton is true', () => {
      // Navigate away from plugin routes to ensure inactive state
      renderComponent({ useSimpleButton: true }, '/some-other-route');
      const button = screen.getByTestId('plugin-plugin-1-btn');
      expect(button.className).toContain('leftDrawerInactiveButton');
    });

    it('applies active drawer button styles when on plugin route', () => {
      renderComponent({ useSimpleButton: true }, '/plugin/one');
      const button = screen.getByTestId('plugin-plugin-1-btn');
      expect(button.className).toContain('leftDrawerActiveButton');
    });

    it('applies flex layout for simple button', () => {
      renderComponent({ useSimpleButton: true });
      const button = screen.getByTestId('plugin-plugin-1-btn');
      const wrapper = button.querySelector('div');
      expect(wrapper).toHaveStyle({ display: 'flex', alignItems: 'center' });
    });
  });

  describe('Header Section', () => {
    it('renders "pluginSettings" header for default button', () => {
      renderComponent({ useSimpleButton: false });
      expect(screen.getByText('pluginSettings')).toBeInTheDocument();
    });

    it('renders "plugins" header for simple button when drawer is visible', () => {
      renderComponent({ useSimpleButton: true, hideDrawer: false });
      expect(screen.getByText('plugins')).toBeInTheDocument();
    });

    it('does not render plugin text when drawer is hidden and using simple button', () => {
      renderComponent({ useSimpleButton: true, hideDrawer: true });
      expect(screen.queryByText('plugins')).not.toBeInTheDocument();
    });

    it('has correct header styling', () => {
      renderComponent();
      const header = screen.getByText('pluginSettings').closest('h4');
      expect(header?.className).toContain('regularHeader');
    });
  });

  describe('Label Visibility', () => {
    it('shows labels when drawer is not hidden', () => {
      renderComponent({ hideDrawer: false });
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.getByText('Plugin Two')).toBeInTheDocument();
    });

    it('hides labels when drawer is hidden', () => {
      renderComponent({ hideDrawer: true });
      expect(screen.queryByText('Plugin One')).not.toBeInTheDocument();
      expect(screen.queryByText('Plugin Two')).not.toBeInTheDocument();
    });

    it('still renders buttons when labels are hidden', () => {
      renderComponent({ hideDrawer: true });
      expect(screen.getByTestId('plugin-plugin-1-btn')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-plugin-2-btn')).toBeInTheDocument();
    });
  });

  describe('Icon Wrapper', () => {
    it('has icon wrapper for each plugin item', () => {
      renderComponent();
      // Verify the plugin logo or custom icon is present
      const pluginLogos = screen.getAllByTestId('plugin-logo');
      expect(pluginLogos.length).toBe(2);
    });

    it('each icon wrapper contains an actual icon element', () => {
      renderComponent();
      // Verify each plugin link has an icon (either custom img or default plugin-logo)
      const links = [
        screen.getByTestId('plugin-plugin-1-btn'),
        screen.getByTestId('plugin-plugin-2-btn'),
        screen.getByTestId('plugin-plugin-3-btn'),
      ];
      links.forEach((link) => {
        // Check if link contains either a custom image or the default plugin logo
        const hasCustomIcon = link.querySelector('img') !== null;
        const hasDefaultIcon =
          link.querySelector('[data-testid="plugin-logo"]') !== null;
        expect(hasCustomIcon || hasDefaultIcon).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles single plugin item', () => {
      const singlePlugin: IDrawerExtension[] = [
        {
          pluginId: 'single-plugin',
          path: '/plugin/single',
          label: 'Single Plugin',
          icon: '',
        },
      ];
      renderComponent({ pluginItems: singlePlugin });
      expect(screen.getByText('Single Plugin')).toBeInTheDocument();
      expect(
        screen.getByTestId('plugin-single-plugin-btn'),
      ).toBeInTheDocument();
    });

    it('handles plugin with empty string icon', () => {
      const pluginWithEmptyIcon: IDrawerExtension[] = [
        {
          pluginId: 'empty-icon',
          path: '/plugin/empty',
          label: 'Empty Icon Plugin',
          icon: '',
        },
      ];
      renderComponent({ pluginItems: pluginWithEmptyIcon });
      expect(screen.getByTestId('plugin-logo')).toBeInTheDocument();
    });

    it('handles plugin with long label', () => {
      const longLabelPlugin: IDrawerExtension[] = [
        {
          pluginId: 'long-label',
          path: '/plugin/long',
          label: 'This is a very long plugin label that might wrap',
          icon: '',
        },
      ];
      renderComponent({ pluginItems: longLabelPlugin, hideDrawer: false });
      expect(
        screen.getByText('This is a very long plugin label that might wrap'),
      ).toBeInTheDocument();
    });

    it('handles special characters in plugin ID', () => {
      const specialPlugin: IDrawerExtension[] = [
        {
          pluginId: 'plugin-with-special-chars_123',
          path: '/plugin/special',
          label: 'Special Plugin',
          icon: '',
        },
      ];
      renderComponent({ pluginItems: specialPlugin });
      expect(
        screen.getByTestId('plugin-plugin-with-special-chars_123-btn'),
      ).toBeInTheDocument();
    });
  });

  describe('Multiple States', () => {
    it('correctly updates when plugin items change', () => {
      const { rerender } = renderComponent();
      expect(screen.getByText('Plugin One')).toBeInTheDocument();

      const newPluginItems: IDrawerExtension[] = [
        {
          pluginId: 'new-plugin',
          path: '/plugin/new',
          label: 'New Plugin',
          icon: '',
        },
      ];

      rerender(
        <MemoryRouter initialEntries={['/']}>
          <I18nextProvider i18n={i18n}>
            <SidebarPluginSection
              {...defaultProps}
              pluginItems={newPluginItems}
            />
          </I18nextProvider>
        </MemoryRouter>,
      );

      expect(screen.queryByText('Plugin One')).not.toBeInTheDocument();
      expect(screen.getByText('New Plugin')).toBeInTheDocument();
    });
  });
});
