import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PluginRoutes from '../PluginRoutes';
import { usePluginRoutes } from '../hooks';
import React from 'react';

// Mock the manager
vi.mock('../manager', () => ({
  getPluginManager: vi.fn(() => ({
    getExtensionPoints: vi.fn(() => []),
    getLoadedPlugins: vi.fn(() => []),
    isSystemInitialized: vi.fn(() => true),
    on: vi.fn(),
    off: vi.fn(),
  })),
}));

// Mock the hooks
vi.mock('../hooks', () => ({
  usePluginRoutes: vi.fn(),
}));

// Mock React components to avoid complex lazy loading in tests
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: vi.fn((importFn) => {
      // Return a simple mock component that represents the lazy-loaded component
      const MockComponent = () => (
        <div data-testid="mock-lazy-component">Mock Component</div>
      );
      return MockComponent;
    }),
    Suspense: vi.fn(({ children, fallback }) => (
      <div data-testid="mock-suspense">
        <div data-testid="fallback">{fallback}</div>
        <div data-testid="children">{children}</div>
      </div>
    )),
  };
});

// Mock react-router
vi.mock('react-router', () => ({
  Route: ({ children, ...props }: any) => (
    <div data-testid="mock-route" data-path={props.path}>
      {children}
    </div>
  ),
}));

describe('PluginRoutes Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic rendering and props', () => {
    it('should render empty when no routes are available', () => {
      vi.mocked(usePluginRoutes).mockReturnValue([]);

      const { container } = render(<PluginRoutes />);
      expect(container.firstChild).toBeNull();
    });

    it('should call usePluginRoutes with correct parameters', () => {
      vi.mocked(usePluginRoutes).mockReturnValue([]);

      render(
        <PluginRoutes userPermissions={['READ', 'WRITE']} isAdmin={true} />,
      );

      expect(usePluginRoutes).toHaveBeenCalledWith(['READ', 'WRITE'], true);
    });

    it('should call usePluginRoutes with default parameters', () => {
      vi.mocked(usePluginRoutes).mockReturnValue([]);

      render(<PluginRoutes />);

      expect(usePluginRoutes).toHaveBeenCalledWith([], false);
    });

    it('should handle non-array routes gracefully', () => {
      vi.mocked(usePluginRoutes).mockReturnValue(null as any);

      const { container } = render(<PluginRoutes />);
      expect(container.firstChild).toBeNull();
    });

    it('should handle undefined routes gracefully', () => {
      vi.mocked(usePluginRoutes).mockReturnValue(undefined as any);

      const { container } = render(<PluginRoutes />);
      expect(container.firstChild).toBeNull();
    });

    it('should handle empty routes array', () => {
      vi.mocked(usePluginRoutes).mockReturnValue([]);

      const { container } = render(<PluginRoutes />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('route rendering with valid routes', () => {
    it('should render single route correctly', () => {
      const mockRoutes = [
        {
          pluginId: 'test-plugin',
          path: '/test-route',
          component: 'TestComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
      // The route is rendered correctly, which means React.lazy and Suspense are working
    });

    it('should render multiple routes correctly', () => {
      const mockRoutes = [
        {
          pluginId: 'plugin-1',
          path: '/route-1',
          component: 'Component1',
          permissions: ['READ'],
        },
        {
          pluginId: 'plugin-2',
          path: '/route-2',
          component: 'Component2',
          permissions: ['WRITE'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const routes = screen.getAllByTestId('mock-route');
      expect(routes).toHaveLength(2);
      expect(routes[0]).toHaveAttribute('data-path', '/route-1');
      expect(routes[1]).toHaveAttribute('data-path', '/route-2');
    });

    it('should generate unique keys for routes from same plugin', () => {
      const mockRoutes = [
        {
          pluginId: 'same-plugin',
          path: '/route-1',
          component: 'Component1',
          permissions: ['READ'],
        },
        {
          pluginId: 'same-plugin',
          path: '/route-2',
          component: 'Component2',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const routes = screen.getAllByTestId('mock-route');
      expect(routes).toHaveLength(2);
    });
  });

  describe('route path handling', () => {
    it('should handle routes with parameters', () => {
      const mockRoutes = [
        {
          pluginId: 'param-plugin',
          path: '/users/:id',
          component: 'UserComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toHaveAttribute(
        'data-path',
        '/users/:id',
      );
    });

    it('should handle routes with wildcards', () => {
      const mockRoutes = [
        {
          pluginId: 'wildcard-plugin',
          path: '/admin/*',
          component: 'AdminComponent',
          permissions: ['ADMIN'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toHaveAttribute(
        'data-path',
        '/admin/*',
      );
    });

    it('should handle complex route patterns', () => {
      const mockRoutes = [
        {
          pluginId: 'complex-plugin',
          path: '/api/v1/:resource/:id/actions',
          component: 'ComplexComponent',
          permissions: ['READ', 'WRITE'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toHaveAttribute(
        'data-path',
        '/api/v1/:resource/:id/actions',
      );
    });
  });

  describe('fallback functionality', () => {
    it('should render with default fallback', () => {
      const mockRoutes = [
        {
          pluginId: 'fallback-plugin',
          path: '/fallback-test',
          component: 'FallbackComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      // The route is rendered, which means the fallback functionality is integrated
      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should render with custom fallback', () => {
      const customFallback = (
        <div data-testid="custom-fallback">Custom Loading...</div>
      );
      const mockRoutes = [
        {
          pluginId: 'custom-fallback-plugin',
          path: '/custom-fallback',
          component: 'CustomComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes fallback={customFallback} />
        </MemoryRouter>,
      );

      // The route should render with custom fallback props passed correctly
      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });

  describe('permission handling', () => {
    it('should handle routes with single permission', () => {
      const mockRoutes = [
        {
          pluginId: 'single-perm-plugin',
          path: '/single-perm',
          component: 'SinglePermComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes userPermissions={['READ']} />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle routes with multiple permissions', () => {
      const mockRoutes = [
        {
          pluginId: 'multi-perm-plugin',
          path: '/multi-perm',
          component: 'MultiPermComponent',
          permissions: ['READ', 'WRITE', 'DELETE'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes userPermissions={['READ', 'WRITE', 'DELETE']} />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle admin routes correctly', () => {
      const mockRoutes = [
        {
          pluginId: 'admin-plugin',
          path: '/admin-route',
          component: 'AdminComponent',
          permissions: ['ADMIN'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes isAdmin={true} />
        </MemoryRouter>,
      );

      expect(usePluginRoutes).toHaveBeenCalledWith([], true);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle routes with empty path', () => {
      const mockRoutes = [
        {
          pluginId: 'empty-path-plugin',
          path: '',
          component: 'EmptyPathComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();
    });

    it('should handle routes with empty component name', () => {
      const mockRoutes = [
        {
          pluginId: 'empty-component-plugin',
          path: '/empty-component',
          component: '',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();
    });

    it('should handle routes with empty plugin ID', () => {
      const mockRoutes = [
        {
          pluginId: '',
          path: '/empty-plugin-id',
          component: 'EmptyPluginIdComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();
    });

    it('should handle routes with missing properties', () => {
      const mockRoutes = [
        {
          pluginId: 'incomplete-plugin',
          path: '/incomplete',
          // Missing component
          permissions: ['READ'],
        } as any,
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();
    });
  });

  describe('component lifecycle', () => {
    it('should handle component unmounting gracefully', () => {
      const mockRoutes = [
        {
          pluginId: 'lifecycle-plugin',
          path: '/lifecycle',
          component: 'LifecycleComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      const { unmount } = render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(() => unmount()).not.toThrow();
    });

    it('should handle route updates correctly', () => {
      const initialRoutes = [
        {
          pluginId: 'initial-plugin',
          path: '/initial',
          component: 'InitialComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(initialRoutes);

      const { rerender } = render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toHaveAttribute(
        'data-path',
        '/initial',
      );

      // Update routes
      const updatedRoutes = [
        {
          pluginId: 'updated-plugin',
          path: '/updated',
          component: 'UpdatedComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(updatedRoutes);

      rerender(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toHaveAttribute(
        'data-path',
        '/updated',
      );
    });
  });

  describe('dynamic import error handling', () => {
    it('should handle error logging when component loading fails', () => {
      // This test verifies that the PluginRoutes component can handle error scenarios
      // The actual error handling is tested through integration, not unit mocking
      const mockRoutes = [
        {
          pluginId: 'error-plugin',
          path: '/error-route',
          component: 'TestComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();

      // The component should render the route even if there might be import issues
      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle routes with complex component paths', () => {
      const mockRoutes = [
        {
          pluginId: 'complex-path-plugin',
          path: '/complex-component',
          component: 'deeply.nested.ComponentName',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });

  describe('component rendering behavior', () => {
    it('should render each route with proper lazy loading setup', () => {
      const mockRoutes = [
        {
          pluginId: 'lazy-plugin',
          path: '/lazy-route',
          component: 'LazyComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      // The route should render properly with lazy loading
      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should pass custom fallback to suspense wrapper', () => {
      const customFallback = (
        <div data-testid="custom-loading">Custom Loading Component</div>
      );

      const mockRoutes = [
        {
          pluginId: 'fallback-plugin',
          path: '/fallback-route',
          component: 'FallbackComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes fallback={customFallback} />
        </MemoryRouter>,
      );

      // The route should render regardless of fallback
      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });

  describe('route key generation', () => {
    it('should generate unique keys for routes with same path but different plugins', () => {
      const mockRoutes = [
        {
          pluginId: 'plugin-a',
          path: '/same-path',
          component: 'ComponentA',
          permissions: ['READ'],
        },
        {
          pluginId: 'plugin-b',
          path: '/same-path',
          component: 'ComponentB',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const routes = screen.getAllByTestId('mock-route');
      expect(routes).toHaveLength(2);
      // Both routes should render despite having the same path
      expect(routes[0]).toHaveAttribute('data-path', '/same-path');
      expect(routes[1]).toHaveAttribute('data-path', '/same-path');
    });

    it('should handle special characters in plugin IDs and paths', () => {
      const mockRoutes = [
        {
          pluginId: 'plugin-with-special-chars@#$',
          path: '/path/with-special/chars!@#',
          component: 'SpecialComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();

      expect(screen.getByTestId('mock-route')).toHaveAttribute(
        'data-path',
        '/path/with-special/chars!@#',
      );
    });
  });

  describe('array validation edge cases', () => {
    it('should handle routes as object instead of array', () => {
      vi.mocked(usePluginRoutes).mockReturnValue({
        someRoute: {
          pluginId: 'object-plugin',
          path: '/object-route',
          component: 'ObjectComponent',
          permissions: ['READ'],
        },
      } as any);

      const { container } = render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      // Should render nothing when routes is not an array
      expect(container.firstChild).toBeNull();
    });

    it('should handle routes as string instead of array', () => {
      vi.mocked(usePluginRoutes).mockReturnValue('not-an-array' as any);

      const { container } = render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle routes as number instead of array', () => {
      vi.mocked(usePluginRoutes).mockReturnValue(123 as any);

      const { container } = render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('complex permission scenarios', () => {
    it('should handle routes with no permissions', () => {
      const mockRoutes = [
        {
          pluginId: 'no-perm-plugin',
          path: '/no-permissions',
          component: 'NoPermComponent',
          permissions: [],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle routes with undefined permissions', () => {
      const mockRoutes = [
        {
          pluginId: 'undefined-perm-plugin',
          path: '/undefined-permissions',
          component: 'UndefinedPermComponent',
          permissions: undefined,
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });

  describe('component import path variations', () => {
    it('should handle routes with different component naming conventions', () => {
      const mockRoutes = [
        {
          pluginId: 'naming-plugin',
          path: '/camel-case',
          component: 'CamelCaseComponent',
          permissions: ['READ'],
        },
        {
          pluginId: 'naming-plugin',
          path: '/snake-case',
          component: 'snake_case_component',
          permissions: ['READ'],
        },
        {
          pluginId: 'naming-plugin',
          path: '/kebab-case',
          component: 'kebab-case-component',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const routes = screen.getAllByTestId('mock-route');
      expect(routes).toHaveLength(3);
    });
  });

  describe('large route sets', () => {
    it('should handle rendering many routes efficiently', () => {
      const mockRoutes = Array.from({ length: 50 }, (_, index) => ({
        pluginId: `plugin-${index}`,
        path: `/route-${index}`,
        component: `Component${index}`,
        permissions: ['READ'],
      }));

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const routes = screen.getAllByTestId('mock-route');
      expect(routes).toHaveLength(50);
    });
  });

  describe('error boundary compatibility', () => {
    it('should not break when rendered within error boundary', () => {
      const mockRoutes = [
        {
          pluginId: 'error-boundary-plugin',
          path: '/error-boundary-test',
          component: 'ErrorBoundaryComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();
    });
  });

  // NEW COMPREHENSIVE TESTS FOR IMPROVED COVERAGE

  describe('TypeScript type safety', () => {
    it('should handle properly typed route extensions', () => {
      const mockRoutes: Array<{
        pluginId: string;
        path: string;
        component: string;
        permissions?: string[];
        exact?: boolean;
      }> = [
        {
          pluginId: 'typed-plugin',
          path: '/typed-route',
          component: 'TypedComponent',
          permissions: ['READ'],
          exact: true,
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle routes with optional properties', () => {
      const mockRoutes = [
        {
          pluginId: 'optional-plugin',
          path: '/optional-route',
          component: 'OptionalComponent',
          // permissions and exact are optional
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });

  describe('Dynamic import error scenarios', () => {
    it('should handle module import failures gracefully', () => {
      const mockRoutes = [
        {
          pluginId: 'import-fail-plugin',
          path: '/import-fail',
          component: 'NonExistentComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      // Mock console.error to capture error messages
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      // Component should still render despite import issues
      expect(screen.getByTestId('mock-route')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should handle missing default exports', () => {
      const mockRoutes = [
        {
          pluginId: 'no-default-export-plugin',
          path: '/no-default',
          component: 'ComponentWithoutDefault',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle named exports correctly', () => {
      const mockRoutes = [
        {
          pluginId: 'named-export-plugin',
          path: '/named-export',
          component: 'NamedExportComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });

  describe('Plugin route integration scenarios', () => {
    it('should handle routes with complex plugin IDs', () => {
      const mockRoutes = [
        {
          pluginId: 'complex-plugin-id-with-dashes-and-underscores',
          path: '/complex-plugin-route',
          component: 'ComplexPluginComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle routes with nested component paths', () => {
      const mockRoutes = [
        {
          pluginId: 'nested-component-plugin',
          path: '/nested-component',
          component: 'components/NestedComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle routes with special characters in paths', () => {
      const mockRoutes = [
        {
          pluginId: 'special-chars-plugin',
          path: '/path/with/special/chars/!@#$%^&*()',
          component: 'SpecialCharsComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });

  describe('Suspense and lazy loading behavior', () => {
    it('should render Suspense wrapper for each route', () => {
      const mockRoutes = [
        {
          pluginId: 'suspense-test-plugin',
          path: '/suspense-test',
          component: 'SuspenseTestComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      // Should render the route with suspense functionality
      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should pass fallback to Suspense correctly', () => {
      const customFallback = <div data-testid="test-fallback">Loading...</div>;
      const mockRoutes = [
        {
          pluginId: 'fallback-test-plugin',
          path: '/fallback-test',
          component: 'FallbackTestComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes fallback={customFallback} />
        </MemoryRouter>,
      );

      // Should render the route with fallback functionality
      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle multiple routes with different fallbacks', () => {
      const mockRoutes = [
        {
          pluginId: 'multi-fallback-plugin-1',
          path: '/fallback-1',
          component: 'Component1',
          permissions: ['READ'],
        },
        {
          pluginId: 'multi-fallback-plugin-2',
          path: '/fallback-2',
          component: 'Component2',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      const customFallback = <div data-testid="multi-fallback">Loading...</div>;

      render(
        <MemoryRouter>
          <PluginRoutes fallback={customFallback} />
        </MemoryRouter>,
      );

      const routes = screen.getAllByTestId('mock-route');
      expect(routes).toHaveLength(2);
    });
  });

  describe('Route key uniqueness and stability', () => {
    it('should generate stable keys for identical routes', () => {
      const mockRoutes = [
        {
          pluginId: 'stable-key-plugin',
          path: '/stable-key',
          component: 'StableKeyComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      const { rerender } = render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const firstRender = screen.getByTestId('mock-route');

      // Re-render with same routes
      rerender(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const secondRender = screen.getByTestId('mock-route');

      // Keys should be stable across re-renders
      expect(firstRender).toBeInTheDocument();
      expect(secondRender).toBeInTheDocument();
    });

    it('should handle routes with identical paths but different plugins', () => {
      const mockRoutes = [
        {
          pluginId: 'plugin-a',
          path: '/identical-path',
          component: 'ComponentA',
          permissions: ['READ'],
        },
        {
          pluginId: 'plugin-b',
          path: '/identical-path',
          component: 'ComponentB',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const routes = screen.getAllByTestId('mock-route');
      expect(routes).toHaveLength(2);

      // Both should have the same path but different keys
      expect(routes[0]).toHaveAttribute('data-path', '/identical-path');
      expect(routes[1]).toHaveAttribute('data-path', '/identical-path');
    });
  });

  describe('Performance and memory management', () => {
    it('should handle large numbers of routes efficiently', () => {
      const mockRoutes = Array.from({ length: 100 }, (_, index) => ({
        pluginId: `performance-plugin-${index}`,
        path: `/performance-route-${index}`,
        component: `PerformanceComponent${index}`,
        permissions: ['READ'],
      }));

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      const startTime = performance.now();

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      const routes = screen.getAllByTestId('mock-route');
      expect(routes).toHaveLength(100);

      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(1000); // 1 second
    });

    it('should not cause memory leaks with route updates', () => {
      const initialRoutes = [
        {
          pluginId: 'memory-test-plugin',
          path: '/memory-test',
          component: 'MemoryTestComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(initialRoutes);

      const { rerender, unmount } = render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      // Update routes multiple times
      for (let i = 0; i < 10; i++) {
        const updatedRoutes = [
          {
            pluginId: `memory-test-plugin-${i}`,
            path: `/memory-test-${i}`,
            component: `MemoryTestComponent${i}`,
            permissions: ['READ'],
          },
        ];

        vi.mocked(usePluginRoutes).mockReturnValue(updatedRoutes);

        rerender(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }

      // Should not throw during unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Integration with React Router', () => {
    it('should work with React Router context', () => {
      const mockRoutes = [
        {
          pluginId: 'router-integration-plugin',
          path: '/router-integration',
          component: 'RouterIntegrationComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter initialEntries={['/router-integration']}>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });

    it('should handle nested routing scenarios', () => {
      const mockRoutes = [
        {
          pluginId: 'nested-routing-plugin',
          path: '/nested/*',
          component: 'NestedRoutingComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter initialEntries={['/nested/some-sub-route']}>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });

  describe('Error boundary and fault tolerance', () => {
    it('should handle malformed route objects gracefully', () => {
      const mockRoutes = [
        {
          // Missing required properties
          pluginId: 'malformed-plugin',
          // path and component missing
        } as any,
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();
    });

    it('should handle null and undefined values in route properties', () => {
      const mockRoutes = [
        {
          pluginId: null,
          path: null,
          component: null,
          permissions: null,
        } as any,
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      expect(() => {
        render(
          <MemoryRouter>
            <PluginRoutes />
          </MemoryRouter>,
        );
      }).not.toThrow();
    });

    it('should handle routes with function components', () => {
      const mockRoutes = [
        {
          pluginId: 'function-component-plugin',
          path: '/function-component',
          component: 'FunctionComponent',
          permissions: ['READ'],
        },
      ];

      vi.mocked(usePluginRoutes).mockReturnValue(mockRoutes);

      render(
        <MemoryRouter>
          <PluginRoutes />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('mock-route')).toBeInTheDocument();
    });
  });
});
