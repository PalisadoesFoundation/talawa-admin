import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PluginRouteRenderer from './PluginRouteRenderer';
import { getPluginComponents, isPluginRegistered } from '../registry';

// Mock the registry
vi.mock('../registry', () => ({
  getPluginComponents: vi.fn(),
  isPluginRegistered: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock React.Suspense
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    Suspense: ({
      children,
      fallback,
    }: {
      children: React.ReactNode;
      fallback: React.ReactNode;
    }) => {
      return (
        <div data-testid="suspense">
          {fallback}
          {children}
        </div>
      );
    },
  };
});

describe('PluginRouteRenderer', () => {
  const MockComponent = vi.fn(() =>
    React.createElement('div', null, 'Mock Component'),
  );
  const MockFallback = vi.fn(() =>
    React.createElement('div', null, 'Mock Fallback'),
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const expectConsoleError = (message: string, ...args: unknown[]) => {
    expect(console.error).toHaveBeenCalledWith(message, ...args);
  };

  it('should render plugin component when plugin is registered', () => {
    const mockComponents = {
      TestComponent: MockComponent,
    };

    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'test-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(mockComponents);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');
  });

  it('should render fallback when plugin is not registered', () => {
    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'unregistered-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(false);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('unregistered-plugin');
    expect(getPluginComponents).not.toHaveBeenCalled();

    // Verify error UI
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('plugins.errors.notRegistered.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/plugins.errors.notRegistered.description/),
    ).toBeInTheDocument();

    // Verify console error
    expectConsoleError(
      "Plugin 'unregistered-plugin' not found in plugin registry",
    );
  });

  it('should render fallback when component is not found', () => {
    const mockComponents = {
      OtherComponent: MockComponent,
    };

    const route = {
      path: '/test',
      component: 'NonExistentComponent',
      pluginId: 'test-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(mockComponents);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');

    // Verify error UI
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('plugins.errors.componentNotFound.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/plugins.errors.componentNotFound.availableComponents/),
    ).toBeInTheDocument();

    // Verify console error
    expectConsoleError(
      "Component 'NonExistentComponent' not found in plugin 'test-plugin'",
    );
  });

  it('should render fallback when plugin components are null', () => {
    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'test-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(null);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');

    // Verify error UI
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('plugins.errors.noComponents.title'),
    ).toBeInTheDocument();

    // Verify console error
    expectConsoleError("No components found for plugin 'test-plugin'");
  });

  it('should render default fallback when no fallback provided', () => {
    const mockComponents = {
      TestComponent: vi.fn(() => <div>Mock Component</div>),
    };

    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'registered-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(mockComponents);

    render(<PluginRouteRenderer route={route} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('registered-plugin');
    expect(screen.getByText('plugins.loading')).toBeInTheDocument();
    expect(screen.getByText('Mock Component')).toBeInTheDocument();
  });

  it('should handle multiple components from same plugin', () => {
    const mockComponents = {
      Component1: MockComponent,
      Component2: MockComponent,
    };

    const route = {
      path: '/test',
      component: 'Component1',
      pluginId: 'test-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(mockComponents);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');
  });

  it('should handle component with props', () => {
    const mockComponents = {
      TestComponent: MockComponent,
    };

    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'test-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(mockComponents);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');
  });

  it('should handle empty plugin ID', () => {
    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: '',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(false);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    // Component returns early when pluginId is empty, so isPluginRegistered is not called
    expect(isPluginRegistered).not.toHaveBeenCalled();

    // Verify error UI
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('plugins.errors.missingPluginId.title'),
    ).toBeInTheDocument();

    // Verify console error
    expectConsoleError('Plugin ID is missing from route');
  });

  it('should handle empty component name', () => {
    const mockComponents = {
      TestComponent: MockComponent,
    };

    const route = {
      path: '/test',
      component: '',
      pluginId: 'test-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(mockComponents);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');
  });

  it('should handle undefined plugin ID', () => {
    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: undefined,
      permissions: ['READ'],
    } as unknown as {
      path: string;
      component: string;
      pluginId: string | undefined;
      permissions: string[];
    };

    vi.mocked(isPluginRegistered).mockReturnValue(false);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    // Component returns early when pluginId is undefined, so isPluginRegistered is not called
    expect(isPluginRegistered).not.toHaveBeenCalled();

    // Verify error UI
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('plugins.errors.missingPluginId.title'),
    ).toBeInTheDocument();

    // Verify console error
    expectConsoleError('Plugin ID is missing from route');
  });

  it('should handle undefined component name', () => {
    const mockComponents = {
      TestComponent: MockComponent,
    };

    const route = {
      path: '/test',
      component: undefined as unknown as string,
      pluginId: 'test-plugin',
      permissions: ['READ'],
    } as unknown as {
      path: string;
      component: string;
      pluginId: string;
      permissions: string[];
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(mockComponents);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');
  });

  it('should handle null plugin components', () => {
    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'test-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(null);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');
  });

  it('should handle undefined plugin components', () => {
    const route = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'test-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(null);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');
  });
});
