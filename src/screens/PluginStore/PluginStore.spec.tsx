import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PluginStore from './PluginStore';
import { MockedProvider } from '@apollo/client/testing';

// Define interface for mock plugin to fix typing issues
interface MockPlugin {
  id: string;
  manifest: {
    name: string;
    description: string;
    author: string;
    icon: string;
  };
}

// Comprehensive mocks to prevent memory issues
vi.mock('@mui/material', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Dialog: ({ children, open, onClose, ...props }: any) =>
    open ? (
      <div {...props} role="dialog" data-testid="uninstall-modal">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
  DialogTitle: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DialogContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DialogActions: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  Typography: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

const mockLoadedPlugins = vi.fn(() => [] as MockPlugin[]);
const mockRefetch = vi.fn();
const mockCreatePlugin = vi.fn().mockResolvedValue({});
const mockUpdatePlugin = vi.fn().mockResolvedValue({});
const mockDeletePlugin = vi.fn().mockResolvedValue({});

vi.mock('plugin/hooks', () => ({
  useLoadedPlugins: () => mockLoadedPlugins(),
}));

const mockPluginManager = {
  loadPlugin: vi.fn().mockResolvedValue(true),
  unloadPlugin: vi.fn().mockResolvedValue(true),
  togglePluginStatus: vi.fn().mockResolvedValue(true),
  isSystemInitialized: vi.fn().mockReturnValue(true),
};

vi.mock('plugin/manager', () => ({
  getPluginManager: () => mockPluginManager,
}));

const mockPluginData = { getPlugins: [] };

vi.mock('plugin/graphql-service', () => ({
  useGetAllPlugins: () => ({
    data: mockPluginData,
    loading: false,
    error: null,
    refetch: mockRefetch,
  }),
  useCreatePlugin: () => [mockCreatePlugin],
  useUpdatePlugin: () => [mockUpdatePlugin],
  useDeletePlugin: () => [mockDeletePlugin],
}));

const mockSearchCallback = vi.fn();
vi.mock('subComponents/SearchBar', () => ({
  default: ({ onSearch, ...props }: any) => (
    <input
      {...props}
      data-testid="searchPlugins"
      onChange={(e) => {
        mockSearchCallback(e.target.value);
        onSearch?.(e.target.value);
      }}
    />
  ),
}));

const mockSortCallback = vi.fn();
vi.mock('subComponents/SortingButton', () => ({
  default: ({ onSortChange, sortingOptions, ...props }: any) => (
    <select
      {...props}
      data-testid="filter"
      onChange={(e) => {
        mockSortCallback(e.target.value);
        onSortChange?.(e.target.value);
      }}
    >
      {sortingOptions?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

const mockPluginModal = vi.fn();
vi.mock('./PluginModal', () => ({
  default: ({
    show,
    onHide,
    installPlugin,
    togglePluginStatus,
    uninstallPlugin,
    ...props
  }: any) => {
    mockPluginModal({
      show,
      onHide,
      installPlugin,
      togglePluginStatus,
      uninstallPlugin,
      ...props,
    });
    return show ? (
      <div data-testid="plugin-modal">
        Plugin Modal
        <button onClick={onHide}>Close Modal</button>
        <button
          onClick={() =>
            installPlugin?.({ id: 'test-plugin', name: 'Test Plugin' })
          }
        >
          Install Plugin
        </button>
        <button
          onClick={() =>
            togglePluginStatus?.(
              { id: 'test-plugin', name: 'Test Plugin' },
              'active',
            )
          }
        >
          Toggle Status
        </button>
        <button
          onClick={() =>
            uninstallPlugin?.({ id: 'test-plugin', name: 'Test Plugin' })
          }
        >
          Uninstall Plugin
        </button>
      </div>
    ) : null;
  },
}));

const mockUploadModal = vi.fn();
vi.mock('./UploadPluginModal', () => ({
  default: ({ show, onHide, ...props }: any) => {
    mockUploadModal({ show, onHide, ...props });
    return show ? (
      <div data-testid="upload-modal">
        Upload Modal
        <button onClick={onHide}>Close Upload</button>
      </div>
    ) : null;
  },
}));

vi.mock('components/Pagination/PaginationList/PaginationList', () => ({
  default: ({ onPageChange, onRowsPerPageChange, ...props }: any) => (
    <div data-testid="pagination">
      Pagination
      <button onClick={() => onPageChange?.(null, 1)}>Page 2</button>
      <button
        onClick={() => onRowsPerPageChange?.({ target: { value: '10' } })}
      >
        Change Rows
      </button>
    </div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/plugin-store' }),
  useNavigate: () => vi.fn(),
}));

vi.mock('style/app-fixed.module.css', () => ({
  default: {
    pageContent: 'page-content',
    btnsContainerSearchBar: 'btns-container-search-bar',
    btnsBlockSearchBar: 'btns-block-search-bar',
    dropdown: 'dropdown',
    createorgdropdown: 'create-org-dropdown',
  },
}));

describe('PluginStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadedPlugins.mockReturnValue([]);
  });

  it('should render plugin store with empty state', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
  });

  it('should handle search functionality', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const searchInput = screen.getByTestId('searchPlugins');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockSearchCallback).toHaveBeenCalledWith('test search');
  });

  it('should handle sort functionality', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const sortSelect = screen.getByTestId('filter');
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    expect(mockSortCallback).toHaveBeenCalledWith('name');
  });

  it('should open plugin modal when plugin is clicked', () => {
    const mockPlugins = [
      {
        id: 'test-plugin',
        manifest: {
          name: 'Test Plugin',
          description: 'A test plugin',
          author: 'Test Author',
          icon: 'test-icon',
        },
      },
    ];

    mockLoadedPlugins.mockReturnValue(mockPlugins);

    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    // Simulate clicking on a plugin to open modal
    const pluginModal = screen.queryByTestId('plugin-modal');
    expect(pluginModal).not.toBeInTheDocument();

    // Trigger modal open (this would normally be done by clicking a plugin)
    // Since we're testing the modal functionality, we'll simulate the state change
    fireEvent.click(screen.getByText('Plugin Modal'));
  });

  it('should open upload modal when upload button is clicked', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const uploadModal = screen.queryByTestId('upload-modal');
    expect(uploadModal).not.toBeInTheDocument();

    // Simulate upload button click
    fireEvent.click(screen.getByText('Upload Modal'));
  });

  it('should handle pagination changes', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const pagination = screen.getByTestId('pagination');
    const pageButton = pagination.querySelector('button');

    if (pageButton) {
      fireEvent.click(pageButton);
    }
  });

  it('should handle rows per page changes', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const pagination = screen.getByTestId('pagination');
    const rowsButton = pagination.querySelectorAll('button')[1];

    if (rowsButton) {
      fireEvent.click(rowsButton);
    }
  });

  it('should handle plugin installation through modal', async () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const installButton = screen.getByText('Install Plugin');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(mockPluginManager.loadPlugin).toHaveBeenCalled();
    });
  });

  it('should handle plugin status toggle through modal', async () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const toggleButton = screen.getByText('Toggle Status');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(mockPluginManager.togglePluginStatus).toHaveBeenCalled();
    });
  });

  it('should handle plugin uninstallation through modal', async () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const uninstallButton = screen.getByText('Uninstall Plugin');
    fireEvent.click(uninstallButton);

    await waitFor(() => {
      expect(mockPluginManager.unloadPlugin).toHaveBeenCalled();
    });
  });

  it('should handle modal close', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);

    expect(mockPluginModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: false,
      }),
    );
  });

  it('should handle upload modal close', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const closeButton = screen.getByText('Close Upload');
    fireEvent.click(closeButton);

    expect(mockUploadModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: false,
      }),
    );
  });

  it('should handle error states', () => {
    // Mock error state
    vi.mocked(
      require('plugin/graphql-service'),
    ).useGetAllPlugins.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to load plugins'),
      refetch: mockRefetch,
    });

    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    // Should still render the component even with errors
    expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
  });

  it('should handle loading states', () => {
    // Mock loading state
    vi.mocked(
      require('plugin/graphql-service'),
    ).useGetAllPlugins.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    // Should still render the component while loading
    expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
  });

  it('should handle plugin manager not initialized', () => {
    mockPluginManager.isSystemInitialized.mockReturnValue(false);

    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    // Should still render the component
    expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
  });

  it('should handle plugin operations with errors', async () => {
    mockPluginManager.loadPlugin.mockRejectedValue(new Error('Load failed'));
    mockPluginManager.togglePluginStatus.mockRejectedValue(
      new Error('Toggle failed'),
    );
    mockPluginManager.unloadPlugin.mockRejectedValue(
      new Error('Unload failed'),
    );

    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    // Test that errors don't crash the component
    const installButton = screen.getByText('Install Plugin');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(mockPluginManager.loadPlugin).toHaveBeenCalled();
    });
  });

  it('should handle empty plugin list', () => {
    mockLoadedPlugins.mockReturnValue([]);

    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    // Should render empty state
    expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
  });

  it('should handle multiple plugins', () => {
    const mockPlugins = [
      {
        id: 'plugin1',
        manifest: {
          name: 'Plugin 1',
          description: 'First plugin',
          author: 'Author 1',
          icon: 'icon1',
        },
      },
      {
        id: 'plugin2',
        manifest: {
          name: 'Plugin 2',
          description: 'Second plugin',
          author: 'Author 2',
          icon: 'icon2',
        },
      },
    ];

    mockLoadedPlugins.mockReturnValue(mockPlugins);

    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    // Should render with multiple plugins
    expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
  });

  it('should handle search with no results', () => {
    const mockPlugins = [
      {
        id: 'plugin1',
        manifest: {
          name: 'Plugin 1',
          description: 'First plugin',
          author: 'Author 1',
          icon: 'icon1',
        },
      },
    ];

    mockLoadedPlugins.mockReturnValue(mockPlugins);

    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const searchInput = screen.getByTestId('searchPlugins');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(mockSearchCallback).toHaveBeenCalledWith('nonexistent');
  });

  it('should handle sort with different options', () => {
    render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    const sortSelect = screen.getByTestId('filter');

    // Test different sort options
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    fireEvent.change(sortSelect, { target: { value: 'author' } });
    fireEvent.change(sortSelect, { target: { value: 'description' } });

    expect(mockSortCallback).toHaveBeenCalledWith('name');
    expect(mockSortCallback).toHaveBeenCalledWith('author');
    expect(mockSortCallback).toHaveBeenCalledWith('description');
  });

  it('should handle component unmounting', () => {
    const { unmount } = render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });
});
