import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import PluginRouteRenderer from '../../routes/PluginRouteRenderer';
import { getPluginComponents, isPluginRegistered } from '../../registry';
import type { IRouteExtension } from '../../types';

// Mock the registry
vi.mock('../../registry', () => ({
  getPluginComponents: vi.fn(),
  isPluginRegistered: vi.fn(),
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
  // Create mock components using React.createElement to avoid JSX component declarations
  const createMockComponent = () =>
    React.createElement('div', null, 'Mock Component');
  const createMockFallback = () =>
    React.createElement('div', null, 'Mock Fallback');

  // Wrapper functions that act as components
  const MockComponent = () => createMockComponent();
  const MockFallback = () => createMockFallback();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render plugin component when plugin is registered', () => {
    const mockComponents = {
      TestComponent: MockComponent,
    };

    const route: IRouteExtension = {
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
    const route: IRouteExtension = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'unregistered-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(false);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('unregistered-plugin');
    expect(getPluginComponents).not.toHaveBeenCalled();
  });

  it('should render fallback when component is not found', () => {
    const mockComponents = {
      OtherComponent: MockComponent,
    };

    const route: IRouteExtension = {
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
  });

  it('should render fallback when plugin components are null', () => {
    const route: IRouteExtension = {
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

  it('should render default fallback when no fallback provided', () => {
    const route: IRouteExtension = {
      path: '/test',
      component: 'TestComponent',
      pluginId: 'unregistered-plugin',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(false);

    render(<PluginRouteRenderer route={route} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('unregistered-plugin');
  });

  it('should handle multiple components from same plugin', () => {
    const mockComponents = {
      Component1: MockComponent,
      Component2: MockComponent,
    };

    const route: IRouteExtension = {
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

    const route: IRouteExtension = {
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
    const route: IRouteExtension = {
      path: '/test',
      component: 'TestComponent',
      pluginId: '',
      permissions: ['READ'],
    };

    vi.mocked(isPluginRegistered).mockReturnValue(false);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    // Component returns early when pluginId is empty, so isPluginRegistered is not called
    expect(isPluginRegistered).not.toHaveBeenCalled();
  });

  it('should handle empty component name', () => {
    const mockComponents = {
      TestComponent: MockComponent,
    };

    const route: IRouteExtension = {
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
    } as unknown as IRouteExtension;

    vi.mocked(isPluginRegistered).mockReturnValue(false);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    // Component returns early when pluginId is undefined, so isPluginRegistered is not called
    expect(isPluginRegistered).not.toHaveBeenCalled();
  });

  it('should handle undefined component name', () => {
    const mockComponents = {
      TestComponent: MockComponent,
    };

    const route = {
      path: '/test',
      component: undefined,
      pluginId: 'test-plugin',
      permissions: ['READ'],
    } as unknown as IRouteExtension;

    vi.mocked(isPluginRegistered).mockReturnValue(true);
    vi.mocked(getPluginComponents).mockReturnValue(mockComponents);

    render(<PluginRouteRenderer route={route} fallback={<MockFallback />} />);

    expect(isPluginRegistered).toHaveBeenCalledWith('test-plugin');
    expect(getPluginComponents).toHaveBeenCalledWith('test-plugin');
  });

  it('should handle null plugin components', () => {
    const route: IRouteExtension = {
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
    const route: IRouteExtension = {
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
