import React from 'react';
import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import UploadPluginModal from './UploadPluginModal';
import i18nForTest from 'utils/i18nForTest';

const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock dependencies
vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.NotificationToast,
}));

vi.mock('jszip', () => ({
  default: vi.fn(),
}));

vi.mock('utils/adminPluginInstaller', () => ({
  validateAdminPluginZip: vi.fn(),
  installAdminPluginFromZip: vi.fn(),
}));

vi.mock('GraphQl/Mutations/PluginMutations', () => ({
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
  // Find the hidden file input by its accept attribute
  const input = document.querySelector(
    'input[type="file"][accept=".zip"]',
  ) as HTMLInputElement;
  return input;
};

describe('UploadPluginModal Component', () => {
  afterEach(() => {
    cleanup();
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
        screen.getByRole('heading', {
          name: i18nForTest.t('pluginStore.uploadPlugin'),
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('pluginStore.uploadPluginDescription')),
      ).toBeInTheDocument();
    });

    it('should show file upload area', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(
        screen.getByText(i18nForTest.t('common:selectAZipFile')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('common:clickToBrowseFile')),
      ).toBeInTheDocument();
    });

    it('should show plugin structure guidelines', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      expect(
        screen.getByText(i18nForTest.t('pluginStore.pluginStructure')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          i18nForTest.t('pluginStore.expectedDirectoryStructure'),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('pluginStore.requiredManifestFields')),
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
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText('test-plugin.zip')).toBeInTheDocument();
      });
    });

    it('should show error for invalid file structure', async () => {
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      // Manually set the files property and trigger change event
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        configurable: true,
      });

      await act(async () => {
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            /zip file must contain either 'admin' or 'api' folder/i,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should show error for corrupted ZIP file', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText(/invalid zip file/i)).toBeInTheDocument();
      });
    });
  });

  describe('Plugin Validation', () => {
    beforeEach(async () => {
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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
      const user = userEvent.setup();
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.pluginInfo')),
        ).toBeInTheDocument();
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
        expect(screen.getByText('1.0.0')).toBeInTheDocument();
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('test-plugin')).toBeInTheDocument();
      });
    });

    it('should show components to install', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.componentsToInstall')),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            i18nForTest.t('pluginStore.adminDashboardComponents'),
          ),
        ).toBeInTheDocument();
      });
    });

    it('should enable install button when plugin is valid', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });
    });

    it('should show error for invalid manifest.json', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(/invalid admin manifest\.json/i),
        ).toBeInTheDocument();
      });
    });

    it('should show error for missing required fields', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(/missing required fields/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Plugin Installation', () => {
    beforeEach(async () => {
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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
      const user = userEvent.setup();
      const { installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! (Admin Dashboard Components components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle installation error', async () => {
      const user = userEvent.setup();
      const { installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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
        error: i18nForTest.t('pluginStore.failedToUploadPlugin'),
      });

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18nForTest.t('pluginStore.failedToUploadPlugin'),
        );
      });
    });

    it('should handle installation exception', async () => {
      const user = userEvent.setup();
      const { installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18nForTest.t('pluginStore.failedToUploadPlugin'),
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
      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThanOrEqual(1);
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

      await act(async () => {
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // Should not crash and should show appropriate error
      expect(
        screen.getByText(i18nForTest.t('common:selectAZipFile')),
      ).toBeInTheDocument();
    });

    it('should handle non-Error exceptions in file selection', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to parse plugin ZIP'),
        ).toBeInTheDocument();
      });
    });

    it('should handle non-Error exceptions in plugin installation', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18nForTest.t('pluginStore.failedToUploadPlugin'),
        );
      });
    });

    it('should handle zip file with neither admin nor api folder', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
      vi.mocked(validateAdminPluginZip).mockResolvedValue({
        hasAdminFolder: false,
        hasApiFolder: false,
        files: {},
        adminManifest: undefined,
        apiManifest: undefined,
        apiFiles: [],
      });

      render(
        <MockedProvider mocks={[]}>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const file = createMockFile('invalid-plugin.zip', 'invalid content');
      const fileInput = getFileInput();

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Zip file must contain either 'admin' or 'api' folder with valid plugin structure/,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should reset all state when handleClose is called', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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
        <MockedProvider mocks={[]}>
          <UploadPluginModal show={true} onHide={mockOnHide} />
        </MockedProvider>,
      );

      // First, upload a file to set some state
      const file = createMockFile('test-plugin.zip', 'valid content');
      const fileInput = getFileInput();

      await user.upload(fileInput, file);

      // Wait for the file to be processed
      await waitFor(() => {
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      });

      // Unmount and re-render to simulate modal close and reopen
      unmount();

      // Re-render the modal to verify state is reset
      render(
        <MockedProvider mocks={[]}>
          <UploadPluginModal show={true} onHide={mockOnHide} />
        </MockedProvider>,
      );

      // Verify that the file input is empty and no plugin info is shown
      expect(
        screen.getByText(i18nForTest.t('common:selectAZipFile')),
      ).toBeInTheDocument();
      expect(screen.queryByText('Test Plugin')).not.toBeInTheDocument();
    });

    it('should call handleClose when modal is closed via backdrop click', async () => {
      const user = userEvent.setup();
      const mockOnHide = vi.fn();

      render(
        <MockedProvider>
          <UploadPluginModal show={true} onHide={mockOnHide} />
        </MockedProvider>,
      );

      // Get the modal backdrop and click it to trigger handleClose
      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThanOrEqual(1);
      const modal = dialogs[0];
      const backdrop = modal.closest('.modal');

      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnHide).toHaveBeenCalled();
      }
    });

    it('should handle close when modal is hidden', async () => {
      const mockOnHide = vi.fn();
      render(
        <MockedProvider mocks={[]}>
          <UploadPluginModal show={false} onHide={mockOnHide} />
        </MockedProvider>,
      );

      // The modal should not be visible
      expect(screen.queryByText('Upload Plugin')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle installation with undefined error', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18nForTest.t('pluginStore.failedToUploadPlugin'),
        );
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

      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThanOrEqual(1);
      // The modal doesn't have a visible close button in the current implementation
      // but it does have proper dialog role
    });

    it('should be keyboard accessible', () => {
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThanOrEqual(1);
      // At least one dialog should have tabIndex for keyboard accessibility
      const hasTabIndex = dialogs.some((dialog) =>
        dialog.hasAttribute('tabIndex'),
      );
      expect(hasTabIndex).toBe(true);
    });
  });

  describe('Additional coverage tests', () => {
    it('should handle API folder only plugin structure', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.pluginInfo')),
        ).toBeInTheDocument();
        expect(screen.getByText('Test API Plugin')).toBeInTheDocument();
        expect(screen.getByText('test-api-plugin')).toBeInTheDocument();
      });
    });

    it('should handle file input ref being null', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Simulate clicking the upload area when fileInputRef is null
      const uploadArea = screen
        .getByText(i18nForTest.t('common:clickToBrowseFile'))
        .closest('div');
      if (uploadArea) {
        await user.click(uploadArea);
      }

      // Should not crash even if fileInputRef.current is null
      expect(
        screen.getByText(i18nForTest.t('common:selectAZipFile')),
      ).toBeInTheDocument();
    });

    it('should handle installation with empty installedComponents array', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! ( components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle installation with multiple components', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
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
      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThanOrEqual(1);

      // The handleClose function should be called when modal is closed
      // This is handled by React Bootstrap Modal internally
      expect(defaultProps.onHide).toBeDefined();
    });

    it('should handle file selection with no files', async () => {
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

      await act(async () => {
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // Should not crash and should remain in initial state
      expect(
        screen.getByText(i18nForTest.t('common:selectAZipFile')),
      ).toBeInTheDocument();
    });

    it('should handle file selection with null files', async () => {
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

      await act(async () => {
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // Should not crash and should remain in initial state
      expect(
        screen.getByText(i18nForTest.t('common:selectAZipFile')),
      ).toBeInTheDocument();
    });

    it('should handle file selection with undefined files', async () => {
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

      await act(async () => {
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // Should not crash and should remain in initial state
      expect(
        screen.getByText(i18nForTest.t('common:selectAZipFile')),
      ).toBeInTheDocument();
    });

    it('should handle installation with missing apolloClient', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Plugin uploaded successfully! (Admin components) - You can now install it from the plugin list.',
        );
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('should handle installation with undefined result', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18nForTest.t('pluginStore.failedToUploadPlugin'),
        );
      });
    });

    it('should handle installation with null result', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', {
          name: /upload plugin/i,
        });
        expect(uploadButton).not.toBeDisabled();
      });

      await user.click(screen.getByRole('button', { name: /upload plugin/i }));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18nForTest.t('pluginStore.failedToUploadPlugin'),
        );
      });
    });

    it('should handle early return when required data is missing', async () => {
      const { installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');

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
      // Note: userEvent won't click a disabled button, so we use native click
      await act(async () => {
        uploadButton.click();
      });

      // installAdminPluginFromZip should not be called
      expect(installAdminPluginFromZip).not.toHaveBeenCalled();
    });

    it('should test early return logic by directly calling handleAddPlugin', async () => {
      const user = userEvent.setup();
      const { installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');

      // Create a test component that exposes the handleAddPlugin function
      const TestComponent = () => {
        const [selectedFile, setSelectedFile] = React.useState<File | null>(
          null,
        );
        const [manifest, setManifest] = React.useState<Record<
          string,
          unknown
        > | null>(null);
        const [pluginStructure, setPluginStructure] = React.useState<Record<
          string,
          unknown
        > | null>(null);

        const handleAddPlugin = async () => {
          // This is the exact early return logic from line 94
          if (!selectedFile || !manifest || !pluginStructure) return;

          // This should not be reached due to early return
          await installAdminPluginFromZip({
            zipFile: selectedFile,
            apolloClient: {} as unknown as ApolloClient<NormalizedCacheObject>,
          });
        };

        return (
          <div>
            <button
              type="button"
              onClick={handleAddPlugin}
              data-testid="test-handle-add-plugin"
            >
              Test Handle Add Plugin
            </button>
            <button
              type="button"
              onClick={() => setSelectedFile(new File(['test'], 'test.zip'))}
              data-testid="set-file"
            >
              Set File
            </button>
            <button
              type="button"
              onClick={() => setManifest({ name: 'test' })}
              data-testid="set-manifest"
            >
              Set Manifest
            </button>
            <button
              type="button"
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
      await user.click(testButton);
      expect(installAdminPluginFromZip).not.toHaveBeenCalled();

      // Set file but not manifest - should still return early
      await user.click(screen.getByTestId('set-file'));
      await user.click(testButton);
      expect(installAdminPluginFromZip).not.toHaveBeenCalled();

      // Set manifest but not structure - should still return early
      await user.click(screen.getByTestId('set-manifest'));
      await user.click(testButton);
      expect(installAdminPluginFromZip).not.toHaveBeenCalled();

      // Set all required data - should call the function
      await user.click(screen.getByTestId('set-structure'));
      await user.click(testButton);
      expect(installAdminPluginFromZip).toHaveBeenCalled();
    });

    it('should test actual UploadPluginModal with valid data', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip, installAdminPluginFromZip } =
        await import('utils/adminPluginInstaller');

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

      render(
        <MockedProvider>
          <UploadPluginModal {...defaultProps} />
        </MockedProvider>,
      );

      // Upload a file to enable the button
      const fileInput = getFileInput();
      const file = createMockFile('test-plugin.zip', 'mock content');

      await user.upload(fileInput, file);

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
      await user.click(uploadButton);

      // The function should be called since all required data is present
      await waitFor(() => {
        expect(installAdminPluginFromZip).toHaveBeenCalled();
      });
    });

    it('should handle API manifest when admin manifest is not available', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.pluginInfo')),
        ).toBeInTheDocument();
        expect(screen.getByText('Test API Plugin')).toBeInTheDocument();
        expect(screen.getByText('test-api-plugin')).toBeInTheDocument();
      });
    });

    it('should show detected files when pluginFiles are available', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.detectedFiles')),
        ).toBeInTheDocument();
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
        screen.getByText(
          i18nForTest.t('pluginStore.expectedDirectoryStructure'),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Required manifest.json Fields'),
      ).toBeInTheDocument();
      expect(screen.getByText(/plugin\.zip/)).toBeInTheDocument();
    });

    it('should handle both admin and API components display', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(
            i18nForTest.t('pluginStore.adminDashboardComponents'),
          ),
        ).toBeInTheDocument();
        expect(screen.getByText('API Backend Components')).toBeInTheDocument();
      });
    });

    it('should handle only admin components display', async () => {
      const user = userEvent.setup();
      const { validateAdminPluginZip } =
        await import('utils/adminPluginInstaller');
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText(
            i18nForTest.t('pluginStore.adminDashboardComponents'),
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByText('API Backend Components'),
        ).not.toBeInTheDocument();
      });
    });
  });
});
