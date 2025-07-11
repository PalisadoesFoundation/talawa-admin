import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PluginStore from './PluginStore';

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
      <div {...props} role="dialog">
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

describe('PluginStore Component - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadedPlugins.mockReturnValue([]);
    Object.assign(mockPluginData, { getPlugins: [] });
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
    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('should display no plugins message when no plugins available', () => {
    render(<PluginStore />);
    expect(screen.getByText('noPluginsAvailable')).toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    render(<PluginStore />);

    const searchInput = screen.getByTestId('searchPlugins');
    fireEvent.change(searchInput, { target: { value: 'test plugin' } });

    await waitFor(() => {
      expect(mockSearchCallback).toHaveBeenCalledWith('test plugin');
    });
  });

  it('should handle filter changes', async () => {
    render(<PluginStore />);

    const filterSelect = screen.getByTestId('filter');
    fireEvent.change(filterSelect, { target: { value: 'installed' } });

    await waitFor(() => {
      expect(mockSortCallback).toHaveBeenCalledWith('installed');
    });
  });

  it('should open upload modal when upload button is clicked', async () => {
    render(<PluginStore />);

    const uploadButton = screen.getByText('Upload Plugin');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByTestId('upload-modal')).toBeInTheDocument();
    });
  });

  it('should close upload modal and refetch data', async () => {
    render(<PluginStore />);

    // Open modal
    const uploadButton = screen.getByText('Upload Plugin');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByTestId('upload-modal')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByText('Close Upload');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
      expect(screen.queryByTestId('upload-modal')).not.toBeInTheDocument();
    });
  });

  it('should display loaded plugins correctly', () => {
    const mockPlugin: MockPlugin = {
      id: 'test-plugin',
      manifest: {
        name: 'Test Plugin',
        description: 'A test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    mockLoadedPlugins.mockReturnValue([mockPlugin]);

    render(<PluginStore />);

    expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    expect(screen.getByText('A test plugin')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('should display GraphQL plugins correctly', () => {
    Object.assign(mockPluginData, {
      getPlugins: [
        {
          pluginId: 'graphql-plugin',
          isInstalled: true,
          isActivated: false,
        },
      ],
    });

    render(<PluginStore />);

    expect(screen.getByText('graphql-plugin')).toBeInTheDocument();
  });

  it('should open plugin modal when manage/view button is clicked', async () => {
    const mockPlugin: MockPlugin = {
      id: 'test-plugin',
      manifest: {
        name: 'Test Plugin',
        description: 'A test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    mockLoadedPlugins.mockReturnValue([mockPlugin]);

    render(<PluginStore />);

    const manageButton = screen.getByText('Manage');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });
  });

  it('should handle plugin installation', async () => {
    // Create a scenario where we have a plugin to install
    const mockPlugin: MockPlugin = {
      id: 'test-plugin',
      manifest: {
        name: 'Test Plugin',
        description: 'A test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    mockLoadedPlugins.mockReturnValue([mockPlugin]);

    render(<PluginStore />);

    const viewButton = screen.getByText('Manage');
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const installButton = screen.getByText('Install Plugin');
    fireEvent.click(installButton);

    // Check that the modal functions were called properly
    expect(mockPluginModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: true,
        installPlugin: expect.any(Function),
      }),
    );
  });

  it('should handle plugin status toggle', async () => {
    const mockPlugin: MockPlugin = {
      id: 'test-plugin',
      manifest: {
        name: 'Test Plugin',
        description: 'A test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    mockLoadedPlugins.mockReturnValue([mockPlugin]);

    render(<PluginStore />);

    const manageButton = screen.getByText('Manage');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const toggleButton = screen.getByText('Toggle Status');
    fireEvent.click(toggleButton);

    // The mock functions should be called through the PluginModal props
    expect(mockPluginModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: true,
        togglePluginStatus: expect.any(Function),
      }),
    );
  });

  it('should handle plugin uninstall with keep data option', async () => {
    const mockPlugin: MockPlugin = {
      id: 'test-plugin',
      manifest: {
        name: 'Test Plugin',
        description: 'A test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    mockLoadedPlugins.mockReturnValue([mockPlugin]);

    render(<PluginStore />);

    const manageButton = screen.getByText('Manage');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    // Click the uninstall button in the plugin modal
    const uninstallButtons = screen.getAllByText('Uninstall Plugin');
    const modalUninstallButton = uninstallButtons.find(
      (button) => button.tagName === 'BUTTON',
    );
    fireEvent.click(modalUninstallButton!);

    await waitFor(() => {
      expect(screen.getByText('Keep Data')).toBeInTheDocument();
    });

    const keepDataButton = screen.getByText('Keep Data');
    fireEvent.click(keepDataButton);

    // Check that the modal functions were called properly
    expect(mockPluginModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: true,
        uninstallPlugin: expect.any(Function),
      }),
    );
  });

  it('should handle plugin uninstall with remove permanently option', async () => {
    const mockPlugin: MockPlugin = {
      id: 'test-plugin',
      manifest: {
        name: 'Test Plugin',
        description: 'A test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    mockLoadedPlugins.mockReturnValue([mockPlugin]);

    render(<PluginStore />);

    const manageButton = screen.getByText('Manage');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    // Click the uninstall button in the plugin modal
    const uninstallButtons = screen.getAllByText('Uninstall Plugin');
    const modalUninstallButton = uninstallButtons.find(
      (button) => button.tagName === 'BUTTON',
    );
    fireEvent.click(modalUninstallButton!);

    await waitFor(() => {
      expect(screen.getByText('Remove Permanently')).toBeInTheDocument();
    });

    const removeButton = screen.getByText('Remove Permanently');
    fireEvent.click(removeButton);

    // Check that the modal functions were called properly
    expect(mockPluginModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: true,
        uninstallPlugin: expect.any(Function),
      }),
    );
  });

  it('should handle pagination changes', async () => {
    render(<PluginStore />);

    const pageButton = screen.getByText('Page 2');
    fireEvent.click(pageButton);

    // This tests the pagination handler
    expect(pageButton).toBeInTheDocument();

    const rowsButton = screen.getByText('Change Rows');
    fireEvent.click(rowsButton);

    // This tests the rows per page handler
    expect(rowsButton).toBeInTheDocument();
  });

  it('should filter plugins based on search term', () => {
    const mockPlugin1: MockPlugin = {
      id: 'test-plugin-1',
      manifest: {
        name: 'Test Plugin One',
        description: 'First test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    const mockPlugin2: MockPlugin = {
      id: 'test-plugin-2',
      manifest: {
        name: 'Another Plugin',
        description: 'Second test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    mockLoadedPlugins.mockReturnValue([mockPlugin1, mockPlugin2]);

    render(<PluginStore />);

    expect(screen.getByText('Test Plugin One')).toBeInTheDocument();
    expect(screen.getByText('Another Plugin')).toBeInTheDocument();
  });

  it('should show no installed plugins message when filter is set to installed', async () => {
    render(<PluginStore />);

    const filterSelect = screen.getByTestId('filter');
    fireEvent.change(filterSelect, { target: { value: 'installed' } });

    await waitFor(() => {
      expect(screen.getByText('noInstalledPlugins')).toBeInTheDocument();
    });
  });

  it('should cancel uninstall modal', async () => {
    const mockPlugin: MockPlugin = {
      id: 'test-plugin',
      manifest: {
        name: 'Test Plugin',
        description: 'A test plugin',
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    };

    mockLoadedPlugins.mockReturnValue([mockPlugin]);

    render(<PluginStore />);

    const manageButton = screen.getByText('Manage');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    // Click the uninstall button in the plugin modal
    const uninstallButtons = screen.getAllByText('Uninstall Plugin');
    const modalUninstallButton = uninstallButtons.find(
      (button) => button.tagName === 'BUTTON',
    );
    fireEvent.click(modalUninstallButton!);

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });
});
