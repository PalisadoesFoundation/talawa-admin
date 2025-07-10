import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import UploadPluginModal from './UploadPluginModal';
import { toast } from 'react-toastify';

// Mock external dependencies
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('jszip', () => ({
  default: vi.fn(() => ({
    loadAsync: vi.fn(),
    file: vi.fn(),
  })),
}));

const mockUseCreatePlugin = vi.fn();
vi.mock('../../plugin/graphql-service', () => ({
  useCreatePlugin: () => [mockUseCreatePlugin],
}));

const mockPluginManager = {
  isSystemInitialized: vi.fn(() => true),
  loadPlugin: vi.fn(),
};

vi.mock('../../plugin/manager', () => ({
  getPluginManager: () => mockPluginManager,
}));

// Mock file input
Object.defineProperty(HTMLInputElement.prototype, 'files', {
  get() {
    return this.files;
  },
  set(files) {
    this.files = files;
  },
  configurable: true,
});

// Create mock File objects
const createMockFile = (name: string, content: string) => {
  const blob = new Blob([content], { type: 'application/zip' });
  return new File([blob], name, { type: 'application/zip' });
};

// Create mock FileList
const createMockFileList = (files: File[]): FileList => {
  const fileList = {
    length: files.length,
    item: (index: number) => (index < files.length ? files[index] : null),
    [Symbol.iterator]: function* () {
      for (const file of files) {
        yield file;
      }
    },
  } as any;

  // Add indexed properties
  files.forEach((file, index) => {
    fileList[index] = file;
  });

  return fileList;
};

describe('UploadPluginModal Component', () => {
  const defaultProps = {
    show: true,
    onHide: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPluginManager.isSystemInitialized.mockReturnValue(true);
    mockPluginManager.loadPlugin.mockResolvedValue(true);
    mockUseCreatePlugin.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render modal when show is true', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByText('Upload Plugin')).toBeInTheDocument();
      expect(screen.getByText('Select ZIP File')).toBeInTheDocument();
      expect(screen.getByText('Security Warning')).toBeInTheDocument();
    });

    it('should not render modal when show is false', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} show={false} />
        </MockedProvider>,
      );

      expect(screen.queryByText('Upload Plugin')).not.toBeInTheDocument();
    });

    it('should call onHide when close button is clicked', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(defaultProps.onHide).toHaveBeenCalledTimes(1);
    });
  });

  describe('File Upload Interface', () => {
    it('should trigger file input when upload button is clicked', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const uploadButton = screen.getByRole('button', {
        name: /select zip file/i,
      });
      const fileInput = uploadButton
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const clickSpy = vi.spyOn(fileInput, 'click');

      fireEvent.click(uploadButton);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should accept only ZIP files', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      expect(fileInput).toHaveAttribute('accept', '.zip');
    });

    it('should update button text when file is selected', async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': {
              async: vi
                .fn()
                .mockResolvedValue(
                  '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.ts","pluginId":"test-plugin"}',
                ),
            },
          },
          file: vi.fn().mockReturnValue({
            async: vi
              .fn()
              .mockResolvedValue(
                '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.ts","pluginId":"test-plugin"}',
              ),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const uploadButton = screen.getByRole('button', {
        name: /select zip file/i,
      });
      const fileInput = uploadButton
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('test-plugin.zip')).toBeInTheDocument();
      });
    });
  });

  describe('ZIP File Processing', () => {
    it('should display error when manifest.json is missing', async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {},
          file: vi.fn().mockReturnValue(null),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('invalid-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText(/manifest\.json not found/i),
        ).toBeInTheDocument();
      });
    });

    it('should display error when manifest.json is invalid JSON', async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': true,
          },
          file: vi.fn().mockReturnValue({
            async: vi.fn().mockResolvedValue('invalid json {'),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('invalid-manifest.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/is not valid JSON/i)).toBeInTheDocument();
      });
    });

    it('should display error when required manifest fields are missing', async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': true,
          },
          file: vi.fn().mockReturnValue({
            async: vi.fn().mockResolvedValue('{"name":"Test Plugin"}'),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('incomplete-manifest.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText(/Missing required fields/i),
        ).toBeInTheDocument();
      });
    });

    it('should successfully parse valid manifest and display plugin info', async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': true,
            'index.ts': true,
            'pages/': {},
            'pages/TodoList.tsx': true,
          },
          file: vi.fn().mockReturnValue({
            async: vi
              .fn()
              .mockResolvedValue(
                '{"name":"Test Plugin","version":"1.0.0","description":"A test plugin","author":"Test Author","main":"index.ts","pluginId":"test-plugin"}',
              ),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('valid-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
        expect(screen.getByText('1.0.0')).toBeInTheDocument();
        expect(screen.getByText('A test plugin')).toBeInTheDocument();
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('test-plugin')).toBeInTheDocument();
      });
    });

    it('should display plugin routes when available in manifest', async () => {
      const JSZip = (await import('jszip')).default;
      const manifestWithRoutes = {
        name: 'Test Plugin',
        version: '1.0.0',
        description: 'A test plugin with routes',
        author: 'Test Author',
        main: 'index.ts',
        pluginId: 'test-plugin',
        extensionPoints: {
          routes: [
            {
              pluginId: 'test-plugin',
              path: '/test-route',
              component: 'TestComponent',
              exact: true,
            },
          ],
        },
      };

      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': true,
            'index.ts': true,
          },
          file: vi.fn().mockReturnValue({
            async: vi
              .fn()
              .mockResolvedValue(JSON.stringify(manifestWithRoutes)),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('plugin-with-routes.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Routes:')).toBeInTheDocument();
        expect(
          screen.getByText('/test-route (TestComponent)'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('File Tree Display', () => {
    it('should display formatted file tree structure', async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': true,
            'index.ts': true,
            'pages/': {},
            'pages/TodoList.tsx': true,
            'pages/TodoDetail.tsx': true,
          },
          file: vi.fn().mockReturnValue({
            async: vi
              .fn()
              .mockResolvedValue(
                '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.ts","pluginId":"test-plugin"}',
              ),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('structured-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Files:')).toBeInTheDocument();
        // Check that plugin info is displayed instead of guidelines
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      });
    });

    it('should filter out hidden and system files', async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': true,
            'index.ts': true,
            '.hidden-file': true,
            '__MACOSX/': {},
            '__MACOSX/manifest.json': true,
            '.DS_Store': true,
          },
          file: vi.fn().mockReturnValue({
            async: vi
              .fn()
              .mockResolvedValue(
                '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.ts","pluginId":"test-plugin"}',
              ),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('plugin-with-hidden.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
        // The plugin files should not contain hidden files
        expect(screen.queryByText('.hidden-file')).not.toBeInTheDocument();
        expect(screen.queryByText('__MACOSX')).not.toBeInTheDocument();
        expect(screen.queryByText('.DS_Store')).not.toBeInTheDocument();
      });
    });
  });

  describe('Plugin Installation', () => {
    beforeEach(async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': true,
            'index.ts': true,
          },
          file: vi.fn().mockReturnValue({
            async: vi
              .fn()
              .mockResolvedValue(
                '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.ts","pluginId":"test-plugin"}',
              ),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);
    });

    it('should successfully install plugin', async () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Upload file first
      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });
      fireEvent.change(fileInput);

      // Wait for plugin info to load
      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
      });

      // Click Add Plugin button
      const addButton = screen.getByRole('button', { name: /add plugin/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockUseCreatePlugin).toHaveBeenCalledWith({
          variables: {
            input: {
              pluginId: 'test-plugin',
            },
          },
        });
        expect(mockPluginManager.loadPlugin).toHaveBeenCalledWith(
          'test-plugin',
        );
        expect(toast.success).toHaveBeenCalledWith(
          'Plugin added successfully!',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle GraphQL creation error', async () => {
      mockUseCreatePlugin.mockRejectedValue(new Error('GraphQL Error'));

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Upload file and install
      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add plugin/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to add plugin. Please try again.',
        );
      });
    });

    it('should handle plugin manager load failure', async () => {
      mockPluginManager.loadPlugin.mockResolvedValue(false);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Upload file and install
      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add plugin/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to add plugin. Please try again.',
        );
      });
    });

    it('should handle plugin manager not initialized', async () => {
      mockPluginManager.isSystemInitialized.mockReturnValue(false);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Upload file and install
      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add plugin/i });
      fireEvent.click(addButton);

      // Should still attempt to create and load plugin
      await waitFor(() => {
        expect(mockUseCreatePlugin).toHaveBeenCalled();
      });
    });
  });

  describe('File Management', () => {
    beforeEach(async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockResolvedValue({
          files: {
            'manifest.json': true,
            'index.ts': true,
          },
          file: vi.fn().mockReturnValue({
            async: vi
              .fn()
              .mockResolvedValue(
                '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.ts","pluginId":"test-plugin"}',
              ),
          }),
        }),
      };
      (JSZip as any).mockReturnValue(mockZip);
    });

    it('should show discard button when file is loaded', async () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Upload file first
      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /discard/i }),
        ).toBeInTheDocument();
      });
    });

    it('should not show add plugin button when no manifest is loaded', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(
        screen.queryByRole('button', { name: /add plugin/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText('Plugin Directory Structure'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Required manifest.json Fields'),
      ).toBeInTheDocument();
    });
  });

  describe('UI Guidelines Display', () => {
    it('should show directory structure guidelines when no file is selected', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(
        screen.getByText('Plugin Directory Structure'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Required manifest.json Fields'),
      ).toBeInTheDocument();
      expect(screen.getByText(/plugin-name\//)).toBeInTheDocument();
      expect(screen.getByText(/extensionPoints/)).toBeInTheDocument();
      // Check for the specific structure example
      expect(screen.getByText(/├── manifest\.json/)).toBeInTheDocument();
    });

    it('should display security warning', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByText('Security Warning')).toBeInTheDocument();
      expect(
        screen.getByText(/Only install plugins from trusted sources/),
      ).toBeInTheDocument();
    });

    it('should display plugin information and link to GitHub', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute(
        'href',
        'https://github.com/PalisadoesFoundation/talawa-plugin',
      );
      expect(githubLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('Error Handling', () => {
    it('should handle ZIP loading errors gracefully', async () => {
      const JSZip = (await import('jszip')).default;
      const mockZip = {
        loadAsync: vi.fn().mockRejectedValue(new Error('Corrupted ZIP file')),
      };
      (JSZip as any).mockReturnValue(mockZip);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('corrupted.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Corrupted ZIP file')).toBeInTheDocument();
      });
    });

    it('should handle file input without files', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = screen
        .getByRole('button', { name: /select zip file/i })
        .closest('div')
        ?.querySelector('input[type="file"]') as HTMLInputElement;

      // Simulate change event without files
      fireEvent.change(fileInput);

      // Should not crash or show errors
      expect(screen.getByText('Select ZIP File')).toBeInTheDocument();
    });

    it('should not allow installation without manifest', async () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // No add plugin button should be visible without manifest
      expect(
        screen.queryByRole('button', { name: /add plugin/i }),
      ).not.toBeInTheDocument();
    });
  });
});
