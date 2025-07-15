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

    const uploadButton = screen.getByTestId('uploadPluginBtn');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByTestId('upload-modal')).toBeInTheDocument();
    });
  });

  it('should close upload modal and refetch data', async () => {
    render(<PluginStore />);

    // Open modal
    const uploadButton = screen.getByTestId('uploadPluginBtn');
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

    expect(screen.getByTestId('plugin-name-test-plugin')).toBeInTheDocument();
    expect(
      screen.getByTestId('plugin-description-test-plugin'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('plugin-author-test-plugin')).toBeInTheDocument();
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

    const manageButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });
  });

  it('should handle plugin installation', async () => {
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

    const viewButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const pluginModal = screen.getByTestId('plugin-modal');
    const installButton = pluginModal.querySelectorAll('button')[1];
    fireEvent.click(installButton);

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

    const manageButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const pluginModal = screen.getByTestId('plugin-modal');
    const toggleButton = pluginModal.querySelectorAll('button')[2];
    fireEvent.click(toggleButton);

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

    const manageButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const pluginModal = screen.getByTestId('plugin-modal');
    const uninstallButton = pluginModal.querySelectorAll('button')[3];
    fireEvent.click(uninstallButton);

    await waitFor(() => {
      expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
    });

    const keepDataButton = screen.getByTestId('uninstall-keepdata-btn');
    fireEvent.click(keepDataButton);

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

    const manageButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const pluginModal = screen.getByTestId('plugin-modal');
    const uninstallButton = pluginModal.querySelectorAll('button')[3];
    fireEvent.click(uninstallButton);

    await waitFor(() => {
      expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
    });

    const removeButton = screen.getByTestId('uninstall-remove-btn');
    fireEvent.click(removeButton);

    expect(mockPluginModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: true,
        uninstallPlugin: expect.any(Function),
      }),
    );
  });

  it('should handle pagination changes', () => {
    const mockPlugins = Array.from({ length: 10 }, (_, i) => ({
      id: `plugin-${i}`,
      manifest: {
        name: `Plugin ${i}`,
        description: `Description ${i}`,
        author: 'Test Author',
        icon: '/test-icon.png',
      },
    }));

    mockLoadedPlugins.mockReturnValue(mockPlugins);

    render(<PluginStore />);

    const pagination = screen.getByTestId('pagination');
    const [page2Btn, changeRowsBtn] = pagination.querySelectorAll('button');

    fireEvent.click(page2Btn);
    fireEvent.click(changeRowsBtn);

    expect(pagination).toBeInTheDocument();
  });

  it('should filter plugins based on search term', async () => {
    const mockPlugins = [
      {
        id: 'test-plugin-1',
        manifest: {
          name: 'Test Plugin One',
          description: 'First test plugin',
          author: 'Test Author',
          icon: '/test-icon.png',
        },
      },
      {
        id: 'test-plugin-2',
        manifest: {
          name: 'Another Plugin',
          description: 'Second test plugin',
          author: 'Test Author',
          icon: '/test-icon.png',
        },
      },
    ];

    mockLoadedPlugins.mockReturnValue(mockPlugins);

    render(<PluginStore />);

    // Both plugins should be visible initially
    expect(screen.getByTestId('plugin-name-test-plugin-1')).toBeInTheDocument();
    expect(screen.getByTestId('plugin-name-test-plugin-2')).toBeInTheDocument();

    // Search for specific plugin
    const searchInput = screen.getByTestId('searchPlugins');
    fireEvent.change(searchInput, { target: { value: 'Test Plugin One' } });

    // Wait for debounce and UI update
    await waitFor(() => {
      expect(
        screen.getByTestId('plugin-name-test-plugin-1'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('plugin-name-test-plugin-2'),
      ).not.toBeInTheDocument();
    });
  });

  it('should show no installed plugins message when filter is set to installed', () => {
    render(<PluginStore />);

    const filterSelect = screen.getByTestId('filter');
    fireEvent.change(filterSelect, { target: { value: 'installed' } });

    expect(screen.getByText('noInstalledPlugins')).toBeInTheDocument();
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

    const manageButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const pluginModal = screen.getByTestId('plugin-modal');
    const uninstallButton = pluginModal.querySelectorAll('button')[3];
    fireEvent.click(uninstallButton);

    await waitFor(() => {
      expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId('uninstall-cancel-btn');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('uninstall-modal')).not.toBeInTheDocument();
  });
});

describe('PluginStore Component - Edge Cases and Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadedPlugins.mockReturnValue([]);
    Object.assign(mockPluginData, { getPlugins: [] });
  });

  it('should handle GraphQL error gracefully', () => {
    vi.doMock('plugin/graphql-service', () => ({
      useGetAllPlugins: () => ({
        data: undefined,
        loading: false,
        error: new Error('GraphQL error'),
        refetch: mockRefetch,
      }),
      useCreatePlugin: () => [mockCreatePlugin],
      useUpdatePlugin: () => [mockUpdatePlugin],
      useDeletePlugin: () => [mockDeletePlugin],
    }));

    render(<PluginStore />);

    expect(screen.getByTestId('plugin-store-page')).toBeInTheDocument();
  });

  it('should handle empty pluginData gracefully', () => {
    Object.assign(mockPluginData, { getPlugins: [] });

    render(<PluginStore />);

    expect(screen.getByText('noPluginsAvailable')).toBeInTheDocument();
  });

  it('should handle pagination edge case (last page with no items)', () => {
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

    const pagination = screen.getByTestId('pagination');
    const [page2Btn] = pagination.querySelectorAll('button');
    fireEvent.click(page2Btn);

    expect(pagination).toBeInTheDocument();
  });

  it('should handle plugin uninstall failure', async () => {
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

    // Mock the plugin manager to return false for unloadPlugin
    const originalUnloadPlugin = mockPluginManager.unloadPlugin;
    mockPluginManager.unloadPlugin.mockResolvedValueOnce(false);

    render(<PluginStore />);

    const manageButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const pluginModal = screen.getByTestId('plugin-modal');
    const uninstallButton = pluginModal.querySelectorAll('button')[3];
    fireEvent.click(uninstallButton);

    await waitFor(() => {
      expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
    });

    const removeButton = screen.getByTestId('uninstall-remove-btn');
    fireEvent.click(removeButton);

    expect(mockPluginManager.unloadPlugin).toHaveBeenCalledWith('test-plugin');

    // Restore original mock
    mockPluginManager.unloadPlugin = originalUnloadPlugin;
  });

  it('should handle plugin status toggle failure', async () => {
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

    // Mock the plugin manager to return false for togglePluginStatus
    const originalTogglePluginStatus = mockPluginManager.togglePluginStatus;
    mockPluginManager.togglePluginStatus.mockResolvedValueOnce(false);

    render(<PluginStore />);

    const manageButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const pluginModal = screen.getByTestId('plugin-modal');
    const toggleButton = pluginModal.querySelectorAll('button')[2];
    fireEvent.click(toggleButton);

    expect(mockPluginManager.togglePluginStatus).toHaveBeenCalledWith(
      'test-plugin',
      'active',
    );

    // Restore original mock
    mockPluginManager.togglePluginStatus = originalTogglePluginStatus;
  });

  it('should close plugin modal when close button is clicked', async () => {
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

    const manageButton = screen.getByTestId('plugin-action-btn-test-plugin');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByTestId('plugin-modal')).toBeInTheDocument();
    });

    const pluginModal = screen.getByTestId('plugin-modal');
    const closeButton = pluginModal.querySelectorAll('button')[0];
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('plugin-modal')).not.toBeInTheDocument();
  });

  it('should close upload modal when close button is clicked', async () => {
    render(<PluginStore />);

    const uploadButton = screen.getByTestId('uploadPluginBtn');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByTestId('upload-modal')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close Upload');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('upload-modal')).not.toBeInTheDocument();
  });
});
