import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PluginRoutes from '../../routes/PluginRoutes';
import { usePluginRoutes } from '../../hooks';
import TestWrapper from '../components/TestWrapper';

// Mock the hooks
vi.mock('../../hooks', () => ({
  usePluginRoutes: vi.fn(),
}));

// Mock React.lazy and Suspense
const mockLazyComponent = vi.fn();
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  const { default: MockLazyComponent } = await import(
    '../components/MockLazyComponent'
  );
  const { default: MockSuspense } = await import('../components/MockSuspense');

  return {
    ...actual,
    lazy: vi.fn((importFn) => {
      mockLazyComponent.mockImplementation(importFn);
      return vi.fn(() => <MockLazyComponent />);
    }),
    Suspense: MockSuspense,
  };
});

// Mock Route component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const { default: MockRoute } = await import('../components/MockRoute');
  return {
    ...actual,
    Route: MockRoute,
  };
});

const mockUsePluginRoutes = vi.mocked(usePluginRoutes);

describe('PluginRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // Should render the component even with empty routes - just an empty div
      expect(document.body).toBeInTheDocument();
    });

    it('should render with default props', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(mockUsePluginRoutes).toHaveBeenCalledWith([], false);
    });

    it('should render with custom props', () => {
      const userPermissions = ['admin', 'user'];
      const isAdmin = true;
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <TestWrapper>
          <PluginRoutes userPermissions={userPermissions} isAdmin={isAdmin} />
        </TestWrapper>,
      );

      expect(mockUsePluginRoutes).toHaveBeenCalledWith(
        userPermissions,
        isAdmin,
      );
    });
  });

  describe('Route Rendering', () => {
    it('should render single plugin route', () => {
      const mockRoutes = [
        {
          pluginId: 'test-plugin',
          path: '/test',
          component: 'TestComponent',
          title: 'Test Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(screen.getByTestId('route-/test')).toBeInTheDocument();
      expect(screen.getByTestId('route-/test')).toHaveAttribute(
        'data-path',
        '/test',
      );
    });

    it('should render multiple plugin routes', () => {
      const mockRoutes = [
        {
          pluginId: 'plugin1',
          path: '/plugin1',
          component: 'Component1',
          title: 'Plugin 1',
          permissions: ['user'],
        },
        {
          pluginId: 'plugin2',
          path: '/plugin2',
          component: 'Component2',
          title: 'Plugin 2',
          permissions: ['admin'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(screen.getByTestId('route-/plugin1')).toBeInTheDocument();
      expect(screen.getByTestId('route-/plugin2')).toBeInTheDocument();
    });

    it('should handle empty routes array', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // Should render nothing when no routes are provided
      expect(screen.queryByTestId(/route-/)).not.toBeInTheDocument();
    });

    it('should handle null/undefined routes gracefully', () => {
      mockUsePluginRoutes.mockReturnValue(null as any);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // Should render nothing when routes are null/undefined
      expect(screen.queryByTestId(/route-/)).not.toBeInTheDocument();
    });
  });

  describe('Suspense and Lazy Loading', () => {
    it('should wrap routes in Suspense with default fallback', () => {
      const mockRoutes = [
        {
          pluginId: 'test-plugin',
          path: '/test',
          component: 'TestComponent',
          title: 'Test Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(screen.getByTestId('suspense')).toBeInTheDocument();
      expect(screen.getByText('Loading plugin...')).toBeInTheDocument();
    });

    it('should use custom fallback when provided', () => {
      const customFallback = (
        <div data-testid="custom-fallback">Custom Loading...</div>
      );
      const mockRoutes = [
        {
          pluginId: 'test-plugin',
          path: '/test',
          component: 'TestComponent',
          title: 'Test Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes fallback={customFallback} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    it('should create lazy components for each route', () => {
      const mockRoutes = [
        {
          pluginId: 'test-plugin',
          path: '/test',
          component: 'TestComponent',
          title: 'Test Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // The lazy component should be created and rendered
      expect(screen.getByTestId('lazy-component')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should render routes with error handling structure', () => {
      const mockRoutes = [
        {
          pluginId: 'error-plugin',
          path: '/error',
          component: 'ErrorComponent',
          title: 'Error Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // Should render the route structure with suspense wrapper
      expect(screen.getByTestId('route-/error')).toBeInTheDocument();
      expect(screen.getByTestId('suspense')).toBeInTheDocument();
      expect(screen.getByText('Loading plugin...')).toBeInTheDocument();
    });

    it('should handle routes with non-existent components', () => {
      const mockRoutes = [
        {
          pluginId: 'test-plugin',
          path: '/test',
          component: 'NonExistentComponent',
          title: 'Test Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // Should still render the route structure
      expect(screen.getByTestId('route-/test')).toBeInTheDocument();
      expect(screen.getByTestId('suspense')).toBeInTheDocument();
    });

    it('should render fallback loading state', () => {
      const mockRoutes = [
        {
          pluginId: 'loading-plugin',
          path: '/loading',
          component: 'LoadingComponent',
          title: 'Loading Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // Should show loading state
      expect(screen.getByText('Loading plugin...')).toBeInTheDocument();
    });
  });

  describe('Route Key Generation', () => {
    it('should generate unique keys for routes', () => {
      const mockRoutes = [
        {
          pluginId: 'plugin1',
          path: '/path1',
          component: 'Component1',
          title: 'Route 1',
          permissions: ['user'],
        },
        {
          pluginId: 'plugin2',
          path: '/path2',
          component: 'Component2',
          title: 'Route 2',
          permissions: ['admin'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      const route1 = screen.getByTestId('route-/path1');
      const route2 = screen.getByTestId('route-/path2');

      expect(route1).toBeInTheDocument();
      expect(route2).toBeInTheDocument();
      expect(route1).not.toEqual(route2);
    });

    it('should handle routes with same plugin but different paths', () => {
      const mockRoutes = [
        {
          pluginId: 'same-plugin',
          path: '/path1',
          component: 'Component1',
          title: 'Route 1',
          permissions: ['user'],
        },
        {
          pluginId: 'same-plugin',
          path: '/path2',
          component: 'Component2',
          title: 'Route 2',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(screen.getByTestId('route-/path1')).toBeInTheDocument();
      expect(screen.getByTestId('route-/path2')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle undefined userPermissions', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <TestWrapper>
          <PluginRoutes userPermissions={undefined} />
        </TestWrapper>,
      );

      expect(mockUsePluginRoutes).toHaveBeenCalledWith([], false);
    });

    it('should handle undefined isAdmin', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <TestWrapper>
          <PluginRoutes isAdmin={undefined} />
        </TestWrapper>,
      );

      expect(mockUsePluginRoutes).toHaveBeenCalledWith([], false);
    });

    it('should handle empty userPermissions array', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <TestWrapper>
          <PluginRoutes userPermissions={[]} />
        </TestWrapper>,
      );

      expect(mockUsePluginRoutes).toHaveBeenCalledWith([], false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle routes with special characters in path', () => {
      const mockRoutes = [
        {
          pluginId: 'special-plugin',
          path: '/path/with-special_chars.and+symbols',
          component: 'SpecialComponent',
          title: 'Special Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(
        screen.getByTestId('route-/path/with-special_chars.and+symbols'),
      ).toBeInTheDocument();
    });

    it('should handle routes with empty component name', () => {
      const mockRoutes = [
        {
          pluginId: 'empty-component-plugin',
          path: '/empty',
          component: '',
          title: 'Empty Component Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(screen.getByTestId('route-/empty')).toBeInTheDocument();
    });

    it('should handle routes with very long plugin IDs', () => {
      const longPluginId = 'a'.repeat(100);
      const mockRoutes = [
        {
          pluginId: longPluginId,
          path: '/long',
          component: 'LongComponent',
          title: 'Long Plugin Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(screen.getByTestId('route-/long')).toBeInTheDocument();
    });
  });
});
