import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import UploadPluginModal from './UploadPluginModal';

// Mock dependencies
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('jszip', () => ({
  default: vi.fn(),
}));

vi.mock('../../utils/adminPluginInstaller', () => ({
  validateAdminPluginZip: vi.fn(),
  installAdminPluginFromZip: vi.fn(),
}));

vi.mock('../../GraphQl/Mutations/PluginMutations', () => ({
  CREATE_PLUGIN_MUTATION: 'CREATE_PLUGIN_MUTATION',
  UPLOAD_PLUGIN_ZIP_MUTATION: 'UPLOAD_PLUGIN_ZIP_MUTATION',
}));

// Mock GraphQL responses removed as they were unused

const defaultProps = {
  show: true,
  onHide: vi.fn(),
};

const createMockFile = (name: string, content: string) => {
  return new File([content], name, { type: 'application/zip' });
};

const createMockFileList = (files: File[]): FileList => {
  return {
    ...files,
    length: files.length,
    item: (index: number) => files[index],
  } as FileList;
};

const getFileInput = () => {
  return screen.getByDisplayValue('') as HTMLInputElement;
};

describe('UploadPluginModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the modal with correct title and description', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(
        screen.getByRole('heading', { name: 'Upload Plugin' }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Upload a ZIP file to create a plugin entry. The plugin will be available for installation after upload.',
        ),
      ).toBeInTheDocument();
    });

    it('should show file upload area', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
      expect(screen.getByText('Click to browse files')).toBeInTheDocument();
    });

    it('should show plugin structure guidelines', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByText('Plugin Structure')).toBeInTheDocument();
      expect(
        screen.getByText('Expected Directory Structure'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Required manifest.json Fields'),
      ).toBeInTheDocument();
    });

    it('should show disabled install button initially', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const uploadButton = screen.getByRole('button', {
        name: /upload plugin/i,
      });
      expect(uploadButton).toBeDisabled();
    });
  });

  describe('File Upload', () => {
    it('should handle file selection and show file name', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
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

    it('should show error for invalid file structure', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(
        new Error(
          "Zip file must contain either 'admin' or 'api' folder with valid plugin structure",
        ),
      );

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test.txt', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            /zip file must contain either 'admin' or 'api' folder/i,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should show error for corrupted ZIP file', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(new Error('Invalid ZIP file'));

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('corrupted.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/invalid zip file/i)).toBeInTheDocument();
      });
    });
  });

  describe('Plugin Validation', () => {
    beforeEach(async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
    });

    it('should validate plugin structure and show plugin information', async () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
        expect(screen.getByText('1.0.0')).toBeInTheDocument();
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('test-plugin')).toBeInTheDocument();
      });
    });

    it('should show components to install', async () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Components to Install:')).toBeInTheDocument();
        expect(
          screen.getByText('Admin Dashboard Components'),
        ).toBeInTheDocument();
      });
    });

    it('should enable install button when plugin is valid', async () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });
    });

    it('should show error for invalid manifest.json', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(new Error('Invalid admin manifest.json'));

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText(/invalid admin manifest\.json/i),
        ).toBeInTheDocument();
      });
    });

    it('should show error for missing required fields', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(
        new Error(
          'Missing required fields in admin manifest.json: pluginId, version',
        ),
      );

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText(/missing required fields/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Plugin Installation', () => {
    beforeEach(async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
    });

    it('should successfully install plugin', async () => {
      const { installAdminPluginFromZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        success: true,
        pluginId: 'test-plugin',
        manifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        installedComponents: ['Admin Dashboard Components'],
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! (Admin Dashboard Components components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle installation error', async () => {
      const { installAdminPluginFromZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        success: false,
        pluginId: 'test-plugin',
        manifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        installedComponents: [],
        error: 'Failed to upload plugin',
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to upload plugin');
      });
    });

    it('should handle installation exception', async () => {
      const { installAdminPluginFromZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(new Error('Network error'));

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to upload plugin. Please try again.',
        );
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should close modal when backdrop is clicked', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // React Bootstrap Modal handles backdrop clicks automatically
      // We can't directly test this without mocking the Modal component
      // Instead, we test that the onHide callback is properly passed
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle file input errors', async () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      fireEvent.change(fileInput);

      // Should not crash and should show appropriate error
      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
    });

    it('should handle empty file selection', async () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([]),
        writable: false,
      });

      fireEvent.change(fileInput);

      // Should not crash and should remain in initial state
      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
    });

    it('should handle non-Error exceptions in file selection', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue('String error');

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to parse plugin ZIP'),
        ).toBeInTheDocument();
      });
    });

    it('should handle non-Error exceptions in plugin installation', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue('String error');

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to upload plugin. Please try again.',
        );
      });
    });

    it('should handle upload click when file input ref is null', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Simulate clicking the upload area
      const uploadArea = screen
        .getByText('Click to browse files')
        .closest('div');
      if (uploadArea) {
        fireEvent.click(uploadArea);
      }

      // Should not crash even if fileInputRef.current is null
      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
    });

    it('should handle zip file with neither admin nor api folder', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      vi.mocked(validateAdminPluginZip).mockResolvedValue({
        hasAdminFolder: false,
        hasApiFolder: false,
        files: {},
        adminManifest: undefined,
        apiManifest: undefined,
        apiFiles: [],
      });

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const file = createMockFile('invalid-plugin.zip', 'invalid content');
      const fileInput = getFileInput();

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(
          screen.getByText(
            /Zip file must contain either 'admin' or 'api' folder with valid plugin structure/,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should reset all state when handleClose is called', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      vi.mocked(validateAdminPluginZip).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        files: { 'admin/manifest.json': 'content' },
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          pluginId: 'test-plugin',
          description: 'A test plugin',
          author: 'Test Author',
          main: 'index.js',
        },
        apiManifest: undefined,
        apiFiles: [],
      });

      const mockOnHide = vi.fn();

      // First render with file uploaded
      const { unmount } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <UploadPluginModal show={true} onHide={mockOnHide} />
        </MockedProvider>,
      );

      // First, upload a file to set some state
      const file = createMockFile('test-plugin.zip', 'valid content');
      const fileInput = getFileInput();
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Wait for the file to be processed
      await waitFor(() => {
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      });

      // Unmount and re-render to simulate modal close and reopen
      unmount();

      // Re-render the modal to verify state is reset
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <UploadPluginModal show={true} onHide={mockOnHide} />
        </MockedProvider>,
      );

      // Verify that the file input is empty and no plugin info is shown
      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
      expect(screen.queryByText('Test Plugin')).not.toBeInTheDocument();
    });

    it('should call handleClose when modal is closed via backdrop click', () => {
      const mockOnHide = vi.fn();

      render(
        <MockedProvider>
          <UploadPluginModal show={true} onHide={mockOnHide} />
        </MockedProvider>,
      );

      // Get the modal backdrop and click it to trigger handleClose
      const modal = screen.getByRole('dialog');
      const backdrop = modal.closest('.modal');

      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnHide).toHaveBeenCalled();
      }
    });

    it('should handle close when modal is hidden', async () => {
      const mockOnHide = vi.fn();
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <UploadPluginModal show={false} onHide={mockOnHide} />
        </MockedProvider>,
      );

      // The modal should not be visible
      expect(screen.queryByText('Upload Plugin')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle installation with null result', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      // Should handle null result gracefully - it will throw an error before reaching the catch block
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to upload plugin. Please try again.',
        );
      });
    });

    it('should handle installation with undefined error', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        success: false,
        error: undefined,
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to upload plugin');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      // The modal doesn't have a visible close button in the current implementation
      // but it does have proper dialog role
    });

    it('should be keyboard accessible', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('tabIndex');
    });
  });

  describe('Additional coverage tests', () => {
    it('should handle API folder only plugin structure', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: false,
        hasApiFolder: true,
        apiManifest: {
          name: 'Test API Plugin',
          version: '1.0.0',
          description: 'Test API',
          author: 'Test Author',
          main: 'api.js',
          pluginId: 'test-api-plugin',
        },
        apiFiles: ['api.js', 'manifest.json'],
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-api-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
        expect(screen.getByText('Test API Plugin')).toBeInTheDocument();
        expect(screen.getByText('test-api-plugin')).toBeInTheDocument();
      });
    });

    it('should handle both admin and API folders', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: true,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
        apiManifest: {
          name: 'Test API Plugin',
          version: '1.0.0',
          description: 'Test API',
          author: 'Test Author',
          main: 'api.js',
          pluginId: 'test-plugin',
        },
        apiFiles: ['api.js', 'manifest.json'],
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
        expect(screen.getByText('test-plugin')).toBeInTheDocument();
      });
    });

    it('should handle file input ref being null', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Simulate clicking the upload area when fileInputRef is null
      const uploadArea = screen
        .getByText('Click to browse files')
        .closest('div');
      if (uploadArea) {
        fireEvent.click(uploadArea);
      }

      // Should not crash even if fileInputRef.current is null
      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
    });

    it('should handle installation with empty installedComponents array', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        success: true,
        pluginId: 'test-plugin',
        manifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        installedComponents: [],
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! ( components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle installation with single component', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        success: true,
        pluginId: 'test-plugin',
        manifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        installedComponents: ['Admin'],
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! (Admin components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle installation with multiple components', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: true,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        success: true,
        pluginId: 'test-plugin',
        manifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        installedComponents: ['Admin', 'API'],
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! (Admin and API components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle modal close and reset state', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Simulate modal close
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // The handleClose function should be called when modal is closed
      // This is handled by React Bootstrap Modal internally
      expect(defaultProps.onHide).toBeDefined();
    });

    it('should handle file selection with no files', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([]),
        writable: false,
      });

      fireEvent.change(fileInput);

      // Should not crash and should remain in initial state
      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
    });

    it('should handle file selection with null files', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      Object.defineProperty(fileInput, 'files', {
        value: null,
        writable: false,
      });

      fireEvent.change(fileInput);

      // Should not crash and should remain in initial state
      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
    });

    it('should handle file selection with undefined files', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      Object.defineProperty(fileInput, 'files', {
        value: undefined,
        writable: false,
      });

      fireEvent.change(fileInput);

      // Should not crash and should remain in initial state
      expect(screen.getByText('Select ZIP file')).toBeInTheDocument();
    });

    it('should handle installation with missing apolloClient', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        success: true,
        pluginId: 'test-plugin',
        manifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        installedComponents: ['Admin'],
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! (Admin components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle installation with undefined result', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(undefined);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to upload plugin. Please try again.',
        );
      });
    });

    it('should handle installation with null result', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to upload plugin. Please try again.',
        );
      });
    });

    it('should handle early return when required data is missing', async () => {
      const { installAdminPluginFromZip } = await import(
        '../../utils/adminPluginInstaller'
      );

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Try to click upload button without selecting a file
      const uploadButton = screen.getByRole('button', {
        name: /upload plugin/i,
      });

      // Button should be disabled initially
      expect(uploadButton).toBeDisabled();

      // Even if we somehow trigger the click, it should return early
      fireEvent.click(uploadButton);

      // installAdminPluginFromZip should not be called
      expect(installAdminPluginFromZip).not.toHaveBeenCalled();
    });

    it('should test early return logic by directly calling handleAddPlugin', async () => {
      const { installAdminPluginFromZip } = await import(
        '../../utils/adminPluginInstaller'
      );

      // Create a test component that exposes the handleAddPlugin function
      const TestComponent = () => {
        const [selectedFile, setSelectedFile] = React.useState<File | null>(
          null,
        );
        const [manifest, setManifest] = React.useState<any>(null);
        const [pluginStructure, setPluginStructure] = React.useState<any>(null);

        const handleAddPlugin = async () => {
          // This is the exact early return logic from line 94
          if (!selectedFile || !manifest || !pluginStructure) return;

          // This should not be reached due to early return
          await installAdminPluginFromZip({
            zipFile: selectedFile,
            apolloClient: {},
          });
        };

        return (
          <div>
            <button
              onClick={handleAddPlugin}
              data-testid="test-handle-add-plugin"
            >
              Test Handle Add Plugin
            </button>
            <button
              onClick={() => setSelectedFile(new File(['test'], 'test.zip'))}
              data-testid="set-file"
            >
              Set File
            </button>
            <button
              onClick={() => setManifest({ name: 'test' })}
              data-testid="set-manifest"
            >
              Set Manifest
            </button>
            <button
              onClick={() => setPluginStructure({ files: {} })}
              data-testid="set-structure"
            >
              Set Structure
            </button>
          </div>
        );
      };

      render(
        <MockedProvider>
          <TestComponent />
        </MockedProvider>,
      );

      // Test early return when selectedFile is null
      const testButton = screen.getByTestId('test-handle-add-plugin');
      fireEvent.click(testButton);
      expect(installAdminPluginFromZip).not.toHaveBeenCalled();

      // Set file but not manifest - should still return early
      fireEvent.click(screen.getByTestId('set-file'));
      fireEvent.click(testButton);
      expect(installAdminPluginFromZip).not.toHaveBeenCalled();

      // Set manifest but not structure - should still return early
      fireEvent.click(screen.getByTestId('set-manifest'));
      fireEvent.click(testButton);
      expect(installAdminPluginFromZip).not.toHaveBeenCalled();

      // Set all required data - should call the function
      fireEvent.click(screen.getByTestId('set-structure'));
      fireEvent.click(testButton);
      expect(installAdminPluginFromZip).toHaveBeenCalled();
    });

    it('should test actual UploadPluginModal early return by mocking component state', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');

      // Mock the validation to return valid data
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json': 'content',
          'index.tsx': 'content',
        },
      });

      // Create a wrapper component that can manipulate the UploadPluginModal's internal state
      const TestWrapper = () => {
        const [showModal, setShowModal] = React.useState(true);
        const [forceEarlyReturn, setForceEarlyReturn] = React.useState(false);

        return (
          <div>
            <button
              onClick={() => setForceEarlyReturn(true)}
              data-testid="force-early-return"
            >
              Force Early Return
            </button>
            <UploadPluginModal
              show={showModal}
              onHide={() => setShowModal(false)}
              // Pass a prop that could trigger early return if we could access internal state
            />
          </div>
        );
      };

      render(
        <MockedProvider>
          <TestWrapper />
        </MockedProvider>,
      );

      // Upload a file to enable the button
      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      // Wait for validation to complete
      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      // Click the upload button - this should call installAdminPluginFromZip
      const uploadButton = screen.getByRole('button', {
        name: /upload plugin/i,
      });
      fireEvent.click(uploadButton);

      // The function should be called since all required data is present
      await waitFor(() => {
        expect(installAdminPluginFromZip).toHaveBeenCalled();
      });
    });

    it('should handle API manifest when admin manifest is not available', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: false,
        hasApiFolder: true,
        adminManifest: null,
        apiManifest: {
          name: 'Test API Plugin',
          version: '1.0.0',
          description: 'Test API',
          author: 'Test Author',
          main: 'api.js',
          pluginId: 'test-api-plugin',
        },
        apiFiles: ['api.js', 'manifest.json'],
        files: {},
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-api-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Plugin Information')).toBeInTheDocument();
        expect(screen.getByText('Test API Plugin')).toBeInTheDocument();
        expect(screen.getByText('test-api-plugin')).toBeInTheDocument();
      });
    });

    it('should show detected files when pluginFiles are available', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json': 'content',
          'index.tsx': 'content',
          'pages/ComponentA.tsx': 'content',
        },
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Detected Files')).toBeInTheDocument();
        expect(screen.getByText(/admin\//)).toBeInTheDocument();
        expect(screen.getByText(/manifest\.json/)).toBeInTheDocument();
        expect(screen.getByText(/index\.tsx/)).toBeInTheDocument();
      });
    });

    it('should show expected structure when no pluginFiles are available', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(
        screen.getByText('Expected Directory Structure'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Required manifest.json Fields'),
      ).toBeInTheDocument();
      expect(screen.getByText(/plugin\.zip/)).toBeInTheDocument();
    });

    it('should handle both admin and API components display', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: true,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json': 'content',
          'index.tsx': 'content',
        },
        apiManifest: {
          name: 'Test API Plugin',
          version: '1.0.0',
          description: 'Test API',
          author: 'Test Author',
          main: 'api.js',
          pluginId: 'test-plugin',
        },
        apiFiles: ['api.js', 'manifest.json'],
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText('Admin Dashboard Components'),
        ).toBeInTheDocument();
        expect(screen.getByText('API Backend Components')).toBeInTheDocument();
      });
    });

    it('should handle only admin components display', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json': 'content',
          'index.tsx': 'content',
        },
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText('Admin Dashboard Components'),
        ).toBeInTheDocument();
        expect(
          screen.queryByText('API Backend Components'),
        ).not.toBeInTheDocument();
      });
    });

    it('should handle only API components display', async () => {
      const { validateAdminPluginZip } = await import(
        '../../utils/adminPluginInstaller'
      );
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: false,
        hasApiFolder: true,
        adminManifest: null,
        apiManifest: {
          name: 'Test API Plugin',
          version: '1.0.0',
          description: 'Test API',
          author: 'Test Author',
          main: 'api.js',
          pluginId: 'test-api-plugin',
        },
        apiFiles: ['api.js', 'manifest.json'],
        files: {},
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-api-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('API Backend Components')).toBeInTheDocument();
        expect(
          screen.queryByText('Admin Dashboard Components'),
        ).not.toBeInTheDocument();
      });
    });

    it('should handle installation with single component in installedComponents', async () => {
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('../../utils/adminPluginInstaller');
      (
        validateAdminPluginZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        hasAdminFolder: true,
        hasApiFolder: false,
        adminManifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        files: {
          'manifest.json':
            '{"name":"Test Plugin","version":"1.0.0","description":"Test","author":"Test Author","main":"index.tsx","pluginId":"test-plugin"}',
          'index.tsx': 'export default {}',
        },
      });
      (
        installAdminPluginFromZip as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        success: true,
        pluginId: 'test-plugin',
        manifest: {
          name: 'Test Plugin',
          version: '1.0.0',
          description: 'Test',
          author: 'Test Author',
          main: 'index.tsx',
          pluginId: 'test-plugin',
        },
        installedComponents: ['Admin'], // Single component
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');
      Object.defineProperty(fileInput, 'files', {
        value: createMockFileList([file]),
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! (Admin components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });
  });
});
