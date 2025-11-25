import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PluginRoutes from '../../routes/PluginRoutes';
import { usePluginRoutes } from '../../hooks';
import { dynamicImportPlugin } from '../../utils';
import React from 'react';

// Mock the hooks
vi.mock('../../hooks', () => ({
  usePluginRoutes: vi.fn(),
}));

// Mock the utils
vi.mock('../../utils', async () => {
  const actual =
    await vi.importActual<typeof import('../../utils')>('../../utils');
  return {
    ...actual,
    dynamicImportPlugin: vi.fn(),
  };
});

// Mock Route component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Route: ({ path, element }: { path: string; element: React.ReactNode }) => (
      <div data-testid={`route-${path}`} data-path={path}>
        {element}
      </div>
    ),
  };
});

const mockUsePluginRoutes = vi.mocked(usePluginRoutes);
const mockDynamicImportPlugin = vi.mocked(dynamicImportPlugin);

// Test wrapper component
// eslint-disable-next-line react/no-multi-comp
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('PluginRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for dynamicImportPlugin to return a promise
    // This prevents "Cannot read properties of undefined (reading 'then')" errors
    mockDynamicImportPlugin.mockResolvedValue({
      default: () => <div>Default Component</div>,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // Should show loading state initially
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

    it('should create lazy components for each route', async () => {
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

      // Should show loading initially
      expect(screen.getByText('Loading plugin...')).toBeInTheDocument();

      // Should eventually render the default component from mockDynamicImportPlugin
      await waitFor(() => {
        expect(screen.getByText('Default Component')).toBeInTheDocument();
      });
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

      // Should render the route structure
      expect(screen.getByTestId('route-/error')).toBeInTheDocument();
      // Should show loading state
      expect(screen.getByText('Loading plugin...')).toBeInTheDocument();
    });

    it('should handle routes with non-existent components', async () => {
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

      // Mock import to return module with NO exports (neither named nor default)
      mockDynamicImportPlugin.mockResolvedValue({});

      // Note: We need to suppress console.error for this test as it will log an error
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // Should still render the route structure
      expect(screen.getByTestId('route-/test')).toBeInTheDocument();

      // Wait for the error to be caught and fallback rendered
      await waitFor(() => {
        expect(screen.getByText('Plugin Error')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
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

    it('should handle routes with undefined pluginId', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockRoutes = [
        {
          pluginId: undefined as unknown as string,
          path: '/undefined-plugin',
          component: 'TestComponent',
          title: 'Undefined Plugin',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      expect(screen.getByTestId('route-/undefined-plugin')).toBeInTheDocument();

      // Should NOT call dynamicImportPlugin as we handle it before calling import
      expect(mockDynamicImportPlugin).not.toHaveBeenCalled();

      // Should render the error message
      await waitFor(() => {
        expect(
          screen.getByText(/Error: Plugin ID is missing for route/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Mocked Dynamic Import Tests for Full Coverage', () => {
    it('should successfully load plugin and render component', async () => {
      const mockRoutes = [
        {
          pluginId: 'success-plugin',
          path: '/success',
          component: 'SuccessComponent',
          title: 'Success Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      // Mock successful import
      mockDynamicImportPlugin.mockResolvedValue({
        // eslint-disable-next-line react/no-multi-comp
        SuccessComponent: () => <div data-testid="success-comp">Success</div>,
      });

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('success-comp')).toBeInTheDocument();
      });
    });

    it('should throw error and render fallback when requested component is not exported by module', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const mockRoutes = [
        {
          pluginId: 'missing-comp-plugin',
          path: '/missing-comp',
          component: 'MissingComponent',
          title: 'Missing Component Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      // Mock successful import but missing the requested component
      mockDynamicImportPlugin.mockResolvedValue({
        // eslint-disable-next-line react/no-multi-comp
        OtherComponent: () => <div>Other</div>,
      });

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      // Should log error and render fallback
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Failed to load plugin component'),
          expect.any(Error),
        );
      });

      // Verify the error message contains the specific text from line 38
      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThan(0);
      const errorArg = consoleErrorSpy.mock.calls[0][1];
      expect(errorArg.message).toContain(
        "Component 'MissingComponent' not found in plugin 'missing-comp-plugin'",
      );
    });

    it('should render styled error fallback when dynamic import fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

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

      // Mock failed import
      mockDynamicImportPlugin.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Plugin Error')).toBeInTheDocument();
      });

      // Find the error container and check for margin style (Line 52)
      // The error container is the parent of the h3 "Plugin Error"
      const errorHeader = screen.getByText('Plugin Error');
      const errorContainer = errorHeader.parentElement;

      expect(errorContainer).toHaveStyle({ margin: '20px' });
    });
  });

  describe('Error Message Sanitization', () => {
    it('should display raw error message in development environment', async () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = 'development';

        vi.spyOn(console, 'error').mockImplementation(() => {});

        const mockRoutes = [
          {
            pluginId: 'dev-error-plugin',
            path: '/dev-error',
            component: 'DevErrorComponent',
            title: 'Dev Error Route',
            permissions: ['user'],
          },
        ];
        mockUsePluginRoutes.mockReturnValue(mockRoutes);

        // Mock failed import
        mockDynamicImportPlugin.mockRejectedValue(
          new Error('Dev Network error'),
        );

        render(
          <TestWrapper>
            <PluginRoutes />
          </TestWrapper>,
        );

        await waitFor(() => {
          expect(screen.getByText('Dev Network error')).toBeInTheDocument();
        });
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should display sanitized error message in non-development environment', async () => {
      // NODE_ENV is 'test' by default in vitest

      vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockRoutes = [
        {
          pluginId: 'prod-error-plugin',
          path: '/prod-error',
          component: 'ProdErrorComponent',
          title: 'Prod Error Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      // Mock failed import
      mockDynamicImportPlugin.mockRejectedValue(
        new Error('Prod Network error'),
      );

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Prod Network error'),
        ).not.toBeInTheDocument();
        expect(
          screen.getByText('Please contact support if this issue persists.'),
        ).toBeInTheDocument();
      });
    });
  });

  it('should handle non-Error objects thrown during import', async () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'development';

      vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockRoutes = [
        {
          pluginId: 'string-error-plugin',
          path: '/string-error',
          component: 'StringErrorComponent',
          title: 'String Error Route',
          permissions: ['user'],
        },
      ];
      mockUsePluginRoutes.mockReturnValue(mockRoutes);

      // Mock failed import with a string
      mockDynamicImportPlugin.mockRejectedValue('String error message');

      render(
        <TestWrapper>
          <PluginRoutes />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('String error message')).toBeInTheDocument();
      });
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});
