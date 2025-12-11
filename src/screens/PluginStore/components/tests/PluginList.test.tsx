// src/screens/PluginStore/components/tests/PluginList.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import PluginList from '../PluginList';
import type { IPluginMeta } from 'plugin';

// Mock the PluginCard component - Fix ESLint errors
vi.mock('../PluginCard', () => ({
  default: ({
    plugin,
    onManage,
  }: {
    plugin: IPluginMeta;
    onManage: (plugin: IPluginMeta) => void;
  }) => {
    return (
      <div data-testid={`plugin-list-item-${plugin.id}`}>
        <div data-testid={`plugin-name-${plugin.id}`}>{plugin.name}</div>
        <div data-testid={`plugin-description-${plugin.id}`}>
          {plugin.description}
        </div>
        <div data-testid={`plugin-author-${plugin.id}`}>{plugin.author}</div>
        <img
          data-testid={`plugin-icon-${plugin.id}`}
          src={plugin.icon}
          alt="Plugin Icon"
        />
        <button
          type="button"
          onClick={() => onManage(plugin)}
          data-testid={`plugin-action-btn-${plugin.id}`}
        >
          Manage
        </button>
      </div>
    );
  },
}));

// Mock react-i18next - Vitest syntax
const mockT = vi.hoisted(() =>
  vi.fn((key: string) => {
    const translations: Record<string, string> = {
      noPluginsFound: 'No plugins found for your search',
      noInstalledPlugins: 'No installed plugins',
      noPluginsAvailable: 'No plugins available',
      installPluginsToSeeHere: 'Install plugins to see them here',
      checkBackLater: 'Check back later for new plugins',
    };
    return translations[key];
  }),
);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

describe('PluginList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Complete mock plugins with all required properties from IPluginMeta
  const mockPlugins: IPluginMeta[] = [
    {
      id: '1',
      name: 'Test Plugin 1',
      description: 'Description 1',
      author: 'Author 1',
      icon: 'icon1.png',
    },
    {
      id: '2',
      name: 'Test Plugin 2',
      description: 'Description 2',
      author: 'Author 2',
      icon: 'icon2.png',
    },
  ];

  const defaultProps = {
    plugins: mockPlugins,
    searchTerm: '',
    filterOption: 'all',
    onManagePlugin: vi.fn(),
  };

  // Test 1: When plugins are available - renders plugin list
  it('renders plugin list container when plugins are available', () => {
    render(<PluginList {...defaultProps} />);

    expect(screen.getByTestId('plugin-list-container')).toBeInTheDocument();
    expect(screen.queryByTestId('plugin-list-empty')).not.toBeInTheDocument();
  });

  // Test 2: When plugins are available - renders all plugin cards
  it('renders all plugin cards when plugins are available', () => {
    render(<PluginList {...defaultProps} />);

    expect(screen.getByTestId('plugin-list-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('plugin-list-item-2')).toBeInTheDocument();
    expect(screen.getByText('Test Plugin 1')).toBeInTheDocument();
    expect(screen.getByText('Test Plugin 2')).toBeInTheDocument();
  });

  // Test 3: When plugins are available - passes correct props to PluginCard
  it('passes correct plugin and onManage function to PluginCard', () => {
    const mockOnManage = vi.fn();
    render(<PluginList {...defaultProps} onManagePlugin={mockOnManage} />);

    const manageButton = screen.getByTestId('plugin-action-btn-1');
    fireEvent.click(manageButton);

    expect(mockOnManage).toHaveBeenCalledWith(mockPlugins[0]);
  });

  // Test 4: When no plugins and no search term - shows "no plugins available"
  it('shows "no plugins available" when no plugins and no search term', () => {
    render(<PluginList {...defaultProps} plugins={[]} searchTerm="" />);

    expect(screen.getByTestId('plugin-list-empty')).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('noPluginsAvailable');
    expect(mockT).toHaveBeenCalledWith('checkBackLater');
    expect(screen.getByText('No plugins available')).toBeInTheDocument();
    expect(
      screen.getByText('Check back later for new plugins'),
    ).toBeInTheDocument();
  });

  // Test 5: When no plugins and has search term - shows "no plugins found"
  it('shows "no plugins found" when no plugins and search term exists', () => {
    render(<PluginList {...defaultProps} plugins={[]} searchTerm="react" />);

    expect(screen.getByTestId('plugin-list-empty')).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('noPluginsFound');
    expect(mockT).toHaveBeenCalledWith('checkBackLater');
    expect(
      screen.getByText('No plugins found for your search'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Check back later for new plugins'),
    ).toBeInTheDocument();
  });

  // Test 6: When no plugins and filter is "installed" - shows "no installed plugins"
  it('shows "no installed plugins" when no plugins and filter is installed', () => {
    render(
      <PluginList {...defaultProps} plugins={[]} filterOption="installed" />,
    );

    expect(screen.getByTestId('plugin-list-empty')).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('noInstalledPlugins');
    expect(mockT).toHaveBeenCalledWith('installPluginsToSeeHere');
    expect(screen.getByText('No installed plugins')).toBeInTheDocument();
    expect(
      screen.getByText('Install plugins to see them here'),
    ).toBeInTheDocument();
  });

  // Test 7: Empty state has correct styles
  it('applies correct styles to empty state container', () => {
    render(<PluginList {...defaultProps} plugins={[]} />);

    const emptyState = screen.getByTestId('plugin-list-empty');

    // Check main container styles
    expect(emptyState).toHaveStyle('text-align: center');
    expect(emptyState).toHaveStyle('padding: 40px 20px');
    expect(emptyState).toHaveStyle('background: #fff');
    expect(emptyState).toHaveStyle('border-radius: 12px');
    expect(emptyState).toHaveStyle('border: 1px solid #e7e7e7');
  });

  // Test 8: Plugin list container has correct styles
  it('applies correct styles to plugin list container', () => {
    render(<PluginList {...defaultProps} />);

    const listContainer = screen.getByTestId('plugin-list-container');

    expect(listContainer).toHaveStyle('display: flex');
    expect(listContainer).toHaveStyle('flex-direction: column');
    expect(listContainer).toHaveStyle('gap: 20px');
  });

  // Test 9: renders one item per plugin id for each PluginCard
  it('renders one item per plugin id for each PluginCard in the list', () => {
    render(<PluginList {...defaultProps} />);

    mockPlugins.forEach((plugin) => {
      expect(
        screen.getByTestId(`plugin-list-item-${plugin.id}`),
      ).toBeInTheDocument();
    });
  });

  // Test 10: All conditional rendering paths are covered
  it('covers all conditional rendering paths for empty states', () => {
    // Test case 1: Empty with search term
    const { rerender } = render(
      <PluginList
        {...defaultProps}
        plugins={[]}
        searchTerm="search"
        filterOption="all"
      />,
    );
    expect(mockT).toHaveBeenCalledWith('noPluginsFound');
    expect(
      screen.getByText('No plugins found for your search'),
    ).toBeInTheDocument();

    // Test case 2: Empty with installed filter
    rerender(
      <PluginList
        {...defaultProps}
        plugins={[]}
        searchTerm=""
        filterOption="installed"
      />,
    );
    expect(mockT).toHaveBeenCalledWith('noInstalledPlugins');
    expect(screen.getByText('No installed plugins')).toBeInTheDocument();

    // Test case 3: Empty with no filters or search
    rerender(
      <PluginList
        {...defaultProps}
        plugins={[]}
        searchTerm=""
        filterOption="all"
      />,
    );
    expect(mockT).toHaveBeenCalledWith('noPluginsAvailable');
    expect(screen.getByText('No plugins available')).toBeInTheDocument();
    expect(
      screen.getByText('Check back later for new plugins'),
    ).toBeInTheDocument();
  });
  // Test 11: Edge case - searchTerm takes precedence over filterOption
  it('shows "no plugins found" when searchTerm exists even with installed filter', () => {
    render(
      <PluginList
        {...defaultProps}
        plugins={[]}
        searchTerm="test"
        filterOption="installed"
      />,
    );

    expect(screen.getByTestId('plugin-list-empty')).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('noPluginsFound');
    expect(mockT).toHaveBeenCalledWith('installPluginsToSeeHere');
    expect(
      screen.getByText('No plugins found for your search'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Install plugins to see them here'),
    ).toBeInTheDocument();
  });
});
