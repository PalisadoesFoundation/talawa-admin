import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { ComponentType, ReactNode } from 'react';
import PluginRoutes from './PluginRoutes';
import { usePluginRoutes } from '../hooks';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const lazyImportFunctions: Array<() => Promise<unknown>> = [];

function createStubComponent(testId: string, label: string) {
  const component = () => <div data-testid={testId}>{label}</div>;

  component.displayName = `Stub(${testId})`;
  return component;
}

function createRouteRenderer() {
  const component = ({
    path,
    element,
  }: {
    path: string;
    element: ReactNode;
  }) => (
    <div data-testid={`route-${path}`} data-path={path}>
      {element}
    </div>
  );

  component.displayName = 'MockRoute';
  return component;
}

vi.mock('../hooks', () => ({
  usePluginRoutes: vi.fn(),
}));

// Mock React.lazy and Suspense
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: vi.fn((importFn) => {
      lazyImportFunctions.push(importFn);
      return vi.fn(() => (
        <div data-testid="lazy-component">Lazy Component</div>
      ));
    }),
    Suspense: ({
      children,
      fallback,
    }: {
      children: ReactNode;
      fallback: ReactNode;
    }) => (
      <div data-testid="suspense">
        {fallback}
        {children}
      </div>
    ),
  };
});

vi.mock('/plugins/test-plugin/index.ts', () => ({
  TestComponent: createStubComponent(
    'named-component',
    'Named Export Component',
  ),
}));

vi.mock('/plugins/default-plugin/index.ts', () => ({
  NonExistentComponent: undefined,
  default: createStubComponent('default-component', 'Plugin Default Component'),
}));

vi.mock('/plugins/missing-component/index.ts', () => ({
  MissingComponent: undefined,
  default: undefined,
  AnotherComponent: createStubComponent(
    'another-component',
    'Another Component',
  ),
}));

vi.mock('/plugins/error-plugin/index.ts', () => {
  throw new Error('Import failed from error plugin');
});

vi.mock('/plugins/undefined/index.ts', () => {
  throw new Error('Missing pluginId');
});

// Mock Route component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Route: createRouteRenderer(),
  };
});

const mockUsePluginRoutes = vi.mocked(usePluginRoutes);

describe('PluginRoutes', () => {
  beforeEach(() => {
    lazyImportFunctions.length = 0;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      // Should render the component even with empty routes - just an empty div
      expect(document.body).toBeInTheDocument();
    });

    it('should render with default props', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      expect(mockUsePluginRoutes).toHaveBeenCalledWith([], false);
    });

    it('should render with custom props', () => {
      const userPermissions = ['admin', 'user'];
      const isAdmin = true;
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <BrowserRouter>
          <PluginRoutes userPermissions={userPermissions} isAdmin={isAdmin} />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      expect(screen.getByTestId('route-/plugin1')).toBeInTheDocument();
      expect(screen.getByTestId('route-/plugin2')).toBeInTheDocument();
    });

    it('should handle empty routes array', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      // Should render nothing when no routes are provided
      expect(screen.queryByTestId(/route-/)).not.toBeInTheDocument();
    });

    it('should handle null/undefined routes gracefully', () => {
      mockUsePluginRoutes.mockReturnValue(null as unknown as []);

      render(
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      expect(screen.getByTestId('suspense')).toBeInTheDocument();
      expect(screen.getByText('plugins.loading')).toBeInTheDocument();
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
        <BrowserRouter>
          <PluginRoutes fallback={customFallback} />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      // The lazy component should be created and rendered
      expect(screen.getByTestId('lazy-component')).toBeInTheDocument();
    });
  });

  describe('Module Loading Logic', () => {
    const renderWithRoute = (route: {
      pluginId?: string;
      path: string;
      component: string;
    }) => {
      mockUsePluginRoutes.mockReturnValue([
        {
          pluginId: route.pluginId,
          path: route.path,
          component: route.component,
          permissions: ['user'],
        },
      ]);

      return render(
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );
    };

    const resolveImporter = async (
      importer: () => Promise<unknown>,
    ): Promise<{ default: ComponentType }> =>
      (await importer()) as { default: ComponentType };

    it('loads named export components when available', async () => {
      const initialRender = renderWithRoute({
        pluginId: 'test-plugin',
        path: '/test-plugin',
        component: 'TestComponent',
      });

      expect(lazyImportFunctions).toHaveLength(1);
      const importer = lazyImportFunctions[0];
      const result = await resolveImporter(importer);

      initialRender.unmount();

      const NamedComponent = result.default;
      const { getByText } = render(<NamedComponent />);
      expect(getByText('Named Export Component')).toBeInTheDocument();
    });

    it('falls back to default export when named export is missing', async () => {
      const initialRender = renderWithRoute({
        pluginId: 'default-plugin',
        path: '/default-plugin',
        component: 'NonExistentComponent',
      });

      expect(lazyImportFunctions).toHaveLength(1);
      const importer = lazyImportFunctions[0];
      const result = await resolveImporter(importer);

      initialRender.unmount();

      const DefaultComponent = result.default;
      const { getByText } = render(<DefaultComponent />);
      expect(getByText('Plugin Default Component')).toBeInTheDocument();
    });

    it('returns error component when requested component does not exist', async () => {
      const initialRender = renderWithRoute({
        pluginId: 'missing-component',
        path: '/missing-component',
        component: 'MissingComponent',
      });

      expect(lazyImportFunctions).toHaveLength(1);
      const importer = lazyImportFunctions[0];
      const result = await resolveImporter(importer);

      initialRender.unmount();

      const ErrorComponent = result.default;
      const { getByText } = render(<ErrorComponent />);
      expect(getByText('plugins.errors.pluginError.title')).toBeInTheDocument();
      expect(
        getByText(/plugins.errors.pluginError.failedToLoad/),
      ).toBeInTheDocument();
    });

    it('surfaces error fallback when import throws', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      try {
        const initialRender = renderWithRoute({
          pluginId: 'error-plugin',
          path: '/error-plugin',
          component: 'ErrorComponent',
        });

        expect(lazyImportFunctions).toHaveLength(1);
        const importer = lazyImportFunctions[0];
        const result = await resolveImporter(importer);

        initialRender.unmount();

        const ErrorComponent = result.default;
        const { getByText } = render(<ErrorComponent />);
        expect(
          getByText('plugins.errors.pluginError.title'),
        ).toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to load plugin component 'ErrorComponent' from 'error-plugin':",
          expect.any(Error),
        );
      } finally {
        consoleErrorSpy.mockRestore();
      }
    });

    it('renders error details when pluginId is missing', async () => {
      const initialRender = renderWithRoute({
        pluginId: undefined,
        path: '/missing-plugin',
        component: 'MissingComponent',
      });

      expect(lazyImportFunctions).toHaveLength(1);
      const importer = lazyImportFunctions[0];
      const result = await resolveImporter(importer);

      initialRender.unmount();

      const ErrorComponent = result.default;
      const { getByText } = render(<ErrorComponent />);
      expect(getByText('plugins.errors.pluginError.title')).toBeInTheDocument();
      expect(getByText(/plugins\.plugin/)).toBeInTheDocument();
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      // Should render the route structure with suspense wrapper
      expect(screen.getByTestId('route-/error')).toBeInTheDocument();
      expect(screen.getByTestId('suspense')).toBeInTheDocument();
      expect(screen.getByText('plugins.loading')).toBeInTheDocument();
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      // Should show loading state
      expect(screen.getByText('plugins.loading')).toBeInTheDocument();
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      expect(screen.getByTestId('route-/path1')).toBeInTheDocument();
      expect(screen.getByTestId('route-/path2')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle undefined userPermissions', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <BrowserRouter>
          <PluginRoutes userPermissions={undefined} />
        </BrowserRouter>,
      );

      expect(mockUsePluginRoutes).toHaveBeenCalledWith([], false);
    });

    it('should handle undefined isAdmin', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <BrowserRouter>
          <PluginRoutes isAdmin={undefined} />
        </BrowserRouter>,
      );

      expect(mockUsePluginRoutes).toHaveBeenCalledWith([], false);
    });

    it('should handle empty userPermissions array', () => {
      mockUsePluginRoutes.mockReturnValue([]);

      render(
        <BrowserRouter>
          <PluginRoutes userPermissions={[]} />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
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
        <BrowserRouter>
          <PluginRoutes />
        </BrowserRouter>,
      );

      expect(screen.getByTestId('route-/long')).toBeInTheDocument();
    });
  });
});
