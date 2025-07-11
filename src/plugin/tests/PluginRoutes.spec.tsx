import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import PluginRoutes from '../PluginRoutes';
import { usePluginRoutes } from '../hooks';

// Create a singleton mockPluginManager
const mockPluginManager = {
  getExtensionPoints: vi.fn(() => []),
  getLoadedPlugins: vi.fn(() => []),
  isSystemInitialized: vi.fn(() => true),
  on: vi.fn(),
  off: vi.fn(),
};

// Mock the manager to always return the singleton
vi.mock('../manager', () => ({
  getPluginManager: vi.fn(() => mockPluginManager),
}));

// Mock the hooks
vi.mock('../hooks', () => ({
  usePluginRoutes: vi.fn(),
}));

// Mock React.lazy
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: vi.fn((importFn) => {
      return {
        __viteIgnore: true,
        default: () => <div>Mocked Plugin Component</div>,
      };
    }),
    Suspense: ({ children, fallback }: any) => {
      return (
        <div data-testid="suspense">
          {fallback}
          {children}
        </div>
      );
    },
  };
});

// Mock dynamic imports
vi.mock('/plugins/test-plugin/index.ts', () => ({
  TestComponent: () => <div>Test Component</div>,
  default: () => <div>Default Component</div>,
}));

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('PluginRoutes Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock return values to ensure clean state
    mockPluginManager.getExtensionPoints.mockReturnValue([]);
    mockPluginManager.getLoadedPlugins.mockReturnValue([]);
    mockPluginManager.isSystemInitialized.mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty when no routes are available', () => {
    vi.mocked(usePluginRoutes).mockReturnValue([]);

    const { container } = render(<PluginRoutes />);
    expect(container.firstChild).toBeNull();
  });

  it('should call usePluginRoutes with correct parameters', () => {
    render(<PluginRoutes userPermissions={['READ', 'WRITE']} isAdmin={true} />);

    expect(usePluginRoutes).toHaveBeenCalledWith(['READ', 'WRITE'], true);
  });

  it('should call usePluginRoutes with default parameters', () => {
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
