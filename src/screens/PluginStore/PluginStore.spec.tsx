import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PluginStore from './PluginStore';

// Simple mocks to avoid memory issues
vi.mock('plugin/hooks', () => ({
  useLoadedPlugins: vi.fn(() => []),
}));

vi.mock('plugin/manager', () => ({
  getPluginManager: vi.fn(() => ({
    loadPlugin: vi.fn(),
    unloadPlugin: vi.fn(),
    togglePluginStatus: vi.fn(),
  })),
}));

vi.mock('plugin/graphql-service', () => ({
  useGetAllPlugins: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useCreatePlugin: vi.fn(() => [vi.fn()]),
  useUpdatePlugin: vi.fn(() => [vi.fn()]),
  useDeletePlugin: vi.fn(() => [vi.fn()]),
}));

vi.mock('subComponents/SearchBar', () => ({
  default: () => <input data-testid="searchPlugins" />,
}));

vi.mock('subComponents/SortingButton', () => ({
  default: () => <select data-testid="sorting-button" />,
}));

vi.mock('./PluginModal', () => ({
  default: () => <div data-testid="plugin-modal" />,
}));

vi.mock('./UploadPluginModal', () => ({
  default: () => <div data-testid="upload-modal" />,
}));

vi.mock('components/Pagination/PaginationList/PaginationList', () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
  })),
}));

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useLocation: () => ({ pathname: '/plugin-store' }),
  useNavigate: () => vi.fn(),
}));

describe('PluginStore Component - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => {
      render(<PluginStore />);
    }).not.toThrow();
  });

  it('should render basic elements', () => {
    render(<PluginStore />);

    expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
    expect(screen.getByText('Upload Plugin')).toBeInTheDocument();
  });

  it('should display no plugins message', () => {
    render(<PluginStore />);

    expect(screen.getByText('noPluginsAvailable')).toBeInTheDocument();
  });
});
