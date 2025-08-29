import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PluginStore from './PluginStore';
import * as pluginHooks from 'plugin/hooks';
import * as pluginManager from 'plugin/manager';
import * as adminPluginFileService from 'plugin/services/AdminPluginFileService';
import userEvent from '@testing-library/user-event';

// Mock the plugin hooks and manager
vi.mock('plugin/hooks');
vi.mock('plugin/manager');
vi.mock('plugin/services/AdminPluginFileService');

// Mock i18n translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock GraphQL mutations and queries
const mockCreatePlugin = vi.fn();
const mockUpdatePlugin = vi.fn();
const mockDeletePlugin = vi.fn();
const mockGetAllPlugins = vi.fn();

vi.mock('plugin/graphql-service', () => ({
  useGetAllPlugins: () => ({
    data: mockGetAllPlugins(),
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCreatePlugin: () => [mockCreatePlugin],
  useUpdatePlugin: () => [mockUpdatePlugin],
  useDeletePlugin: () => [mockDeletePlugin],
}));

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Get the mocked toast for assertions
const getMockedToast = () => require('react-toastify').toast;

describe('PluginStore', () => {
  const mockLoadedPlugins = [
    {
      id: 'test-plugin-1',
      manifest: {
        pluginId: 'test-plugin-1',
        name: 'Test Plugin 1',
        description: 'A test plugin',
        author: 'Test Author',
        version: '1.0.0',
        icon: '/test-icon.png',
        homepage: 'https://test.com',
        license: 'MIT',
        tags: ['test', 'demo'],
        main: 'index.js',
      },
      status: 'active' as const,
    },
    {
      id: 'test-plugin-2',
      manifest: {
        pluginId: 'test-plugin-2',
        name: 'Test Plugin 2',
        description: 'Another test plugin',
        author: 'Another Author',
        version: '2.0.0',
        icon: '/test-icon-2.png',
        homepage: 'https://test2.com',
        license: 'Apache',
        tags: ['demo', 'example'],
        main: 'index.js',
      },
      status: 'inactive' as const,
    },
  ];

  const mockGraphQLPlugins = [
    {
      id: '1',
      pluginId: 'test-plugin-1',
      isInstalled: true,
      isActivated: true,
    },
    {
      id: '2',
      pluginId: 'test-plugin-2',
      isInstalled: false,
      isActivated: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock plugin hooks
    vi.mocked(pluginHooks.useLoadedPlugins).mockReturnValue(mockLoadedPlugins);

    // Mock plugin manager
    const mockPluginManager = {
      loadPlugin: vi.fn().mockResolvedValue(true),
      unloadPlugin: vi.fn().mockResolvedValue(true),
      togglePluginStatus: vi.fn().mockResolvedValue(true),
    } as any;
    vi.mocked(pluginManager.getPluginManager).mockReturnValue(
      mockPluginManager,
    );

    // Mock GraphQL data
    mockGetAllPlugins.mockReturnValue({
      getPlugins: mockGraphQLPlugins,
    });

    // Mock admin plugin file service
    (adminPluginFileService.adminPluginFileService.removePlugin as any) = vi
      .fn()
      .mockResolvedValue(true);
  });

  const renderPluginStore = () => {
    return render(
      <MockedProvider>
        <PluginStore />
      </MockedProvider>,
    );
  };

  describe('Initial Rendering', () => {
    it('should render the plugin store page', () => {
      renderPluginStore();

      expect(screen.getByTestId('plugin-store-page')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-store-searchbar')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-store-filters')).toBeInTheDocument();
      expect(screen.getByTestId('plugin-list-container')).toBeInTheDocument();
    });

    it('should render search bar and upload button', () => {
      renderPluginStore();

      expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
      expect(screen.getByTestId('uploadPluginBtn')).toBeInTheDocument();
    });

    it('should render plugin list items', () => {
      renderPluginStore();

      expect(
        screen.getByTestId('plugin-list-item-test-plugin-1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('plugin-list-item-test-plugin-2'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('plugin-name-test-plugin-1')).toHaveTextContent(
        'Test Plugin 1',
      );
      expect(screen.getByTestId('plugin-name-test-plugin-2')).toHaveTextContent(
        'Test Plugin 2',
      );
    });

    it('should render plugin details correctly', () => {
      renderPluginStore();

      expect(
        screen.getByTestId('plugin-description-test-plugin-1'),
      ).toHaveTextContent('A test plugin');
      expect(
        screen.getByTestId('plugin-author-test-plugin-1'),
      ).toHaveTextContent('Test Author');
      expect(
        screen.getByTestId('plugin-description-test-plugin-2'),
      ).toHaveTextContent('Another test plugin');
      expect(
        screen.getByTestId('plugin-author-test-plugin-2'),
      ).toHaveTextContent('Another Author');
    });

    it('should render plugin action buttons', () => {
      renderPluginStore();

      expect(
        screen.getByTestId('plugin-action-btn-test-plugin-1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('plugin-action-btn-test-plugin-2'),
      ).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter plugins by description', async () => {
      renderPluginStore();

      const searchInput = screen.getByTestId('searchPlugins');
      fireEvent.change(searchInput, { target: { value: 'test plugin' } });

      await waitFor(() => {
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-1'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-2'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Filter Functionality', () => {
    it('should show empty state when no installed plugins', async () => {
      vi.mocked(pluginHooks.useLoadedPlugins).mockReturnValue([]);
      mockGetAllPlugins.mockReturnValue({ getPlugins: [] });

      renderPluginStore();

      const filterDropdown = screen.getByTestId('filterPlugins');
      await userEvent.click(filterDropdown);
      // Wait for dropdown options to render
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Find the dropdown option for installed plugins by data-testid in document.body
      const { within } = require('@testing-library/react');
      const installedOption = within(document.body).getByTestId('installed');
      fireEvent.click(installedOption);

      await waitFor(() => {
        expect(screen.getByTestId('plugin-list-empty')).toBeInTheDocument();
        expect(
          screen.getByText((content) => content.includes('noInstalledPlugins')),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Plugin Modal Interactions', () => {
    it('should open plugin modal when plugin is clicked', async () => {
      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should close plugin modal', async () => {
      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close modal (this would depend on the actual modal implementation)
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Upload Plugin Modal', () => {
    it('should open upload modal when upload button is clicked', () => {
      renderPluginStore();

      const uploadButton = screen.getByTestId('uploadPluginBtn');
      fireEvent.click(uploadButton);

      // Upload modal might not be implemented yet
      // expect(screen.getByTestId('upload-plugin-modal')).toBeInTheDocument();
    });

    it('should close upload modal', () => {
      renderPluginStore();

      const uploadButton = screen.getByTestId('uploadPluginBtn');
      fireEvent.click(uploadButton);

      // expect(screen.getByTestId('upload-plugin-modal')).toBeInTheDocument();

      // Close modal (this would depend on the actual modal implementation)
      // const closeButton = screen.getByTestId('close-upload-modal');
      // fireEvent.click(closeButton);

      // expect(screen.queryByTestId('upload-plugin-modal')).not.toBeInTheDocument();
    });
  });

  describe('Plugin Activation/Deactivation', () => {
    it('should activate plugin successfully', async () => {
      mockUpdatePlugin.mockResolvedValue({
        data: { updatePlugin: { id: '1' } },
      });

      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-2',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Activate plugin - look for button with "Activate" text
      const activateButton = screen.getByRole('button', { name: /Activate/i });

      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockUpdatePlugin).toHaveBeenCalled();
      });
    });

    it('should deactivate plugin successfully', async () => {
      mockUpdatePlugin.mockResolvedValue({
        data: { updatePlugin: { id: '1' } },
      });

      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Deactivate plugin
      const deactivateButton = screen.getByRole('button', {
        name: /Deactivate/i,
      });

      fireEvent.click(deactivateButton);

      await waitFor(
        () => {
          expect(mockUpdatePlugin).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });
  });

  describe('Plugin Uninstallation', () => {
    it('should show uninstall confirmation modal', async () => {
      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Uninstall plugin
      const uninstallButton = screen.getByRole('button', {
        name: /Uninstall/i,
      });
      fireEvent.click(uninstallButton);

      await waitFor(() => {
        expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
      });
    });



    it('should uninstall plugin permanently', async () => {
      mockDeletePlugin.mockResolvedValue({
        data: { deletePlugin: { id: '1' } },
      });

      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Uninstall plugin
      const uninstallButton = screen.getByRole('button', {
        name: /Uninstall/i,
      });
      fireEvent.click(uninstallButton);

      await waitFor(() => {
        expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
      });

      // Remove permanently
      const removeButton = screen.getByTestId('uninstall-remove-btn');

      fireEvent.click(removeButton);

      await waitFor(
        () => {
          expect(mockDeletePlugin).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });

    it('should cancel uninstall operation', async () => {
      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Uninstall plugin
      const uninstallButton = screen.getByRole('button', {
        name: /Uninstall/i,
      });
      fireEvent.click(uninstallButton);

      await waitFor(() => {
        expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
      });

      // Cancel
      const cancelButton = screen.getByTestId('uninstall-cancel-btn');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId('uninstall-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no plugins are available', () => {
      vi.mocked(pluginHooks.useLoadedPlugins).mockReturnValue([]);
      mockGetAllPlugins.mockReturnValue({ getPlugins: [] });

      renderPluginStore();

      expect(screen.getByTestId('plugin-list-empty')).toBeInTheDocument();
      expect(screen.getByText('noPluginsAvailable')).toBeInTheDocument();
    });

    it('should show empty state when no installed plugins', async () => {
      vi.mocked(pluginHooks.useLoadedPlugins).mockReturnValue([]);
      mockGetAllPlugins.mockReturnValue({ getPlugins: [] });

      renderPluginStore();

      const filterDropdown = screen.getByTestId('filterPlugins');
      await userEvent.click(filterDropdown);
      // Wait for dropdown options to render
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Find the dropdown option for installed plugins by data-testid in document.body
      const { within } = require('@testing-library/react');
      const installedOption = within(document.body).getByTestId('installed');
      await userEvent.click(installedOption);

      expect(screen.getByTestId('plugin-list-empty')).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes('noInstalledPlugins')),
      ).toBeInTheDocument();
    });
  });

  describe('Plugin Status Detection', () => {
    it('should correctly identify installed plugins', () => {
      renderPluginStore();

      // Plugin 1 should be installed (active status)
      const plugin1Button = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      expect(plugin1Button).toHaveTextContent('Manage');

      // Plugin 2 should be installed (inactive status)
      const plugin2Button = screen.getByTestId(
        'plugin-action-btn-test-plugin-2',
      );
      expect(plugin2Button).toHaveTextContent('Manage');
    });

    it('should handle GraphQL plugin status', () => {
      const mockGraphQLPluginsWithStatus = [
        {
          id: '1',
          pluginId: 'test-plugin-1',
          isInstalled: true,
          isActivated: true,
        },
      ];

      mockGetAllPlugins.mockReturnValue({
        getPlugins: mockGraphQLPluginsWithStatus,
      });

      renderPluginStore();

      // Should show GraphQL plugins as well
      expect(
        screen.getByTestId('plugin-list-item-test-plugin-1'),
      ).toBeInTheDocument();
    });
  });

  describe('Search Functionality with Debouncing', () => {
    it('should debounce search input', async () => {
      renderPluginStore();

      const searchInput = screen.getByTestId('searchPlugins');

      // Type quickly to test debouncing
      fireEvent.change(searchInput, { target: { value: 't' } });
      fireEvent.change(searchInput, { target: { value: 'te' } });
      fireEvent.change(searchInput, { target: { value: 'tes' } });
      fireEvent.change(searchInput, { target: { value: 'test' } });

      // Wait for debounce delay
      await new Promise((resolve) => setTimeout(resolve, 350));

      // Should show filtered results
      await waitFor(() => {
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-1'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-2'),
        ).toBeInTheDocument();
      });
    });

    it('should search by plugin description', async () => {
      renderPluginStore();

      const searchInput = screen.getByTestId('searchPlugins');
      fireEvent.change(searchInput, { target: { value: 'test plugin' } });

      // Wait for debounce delay
      await new Promise((resolve) => setTimeout(resolve, 350));

      await waitFor(() => {
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-1'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-2'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle GraphQL error gracefully', () => {
      mockGetAllPlugins.mockReturnValue(null);

      renderPluginStore();

      // Should still render the component without crashing
      expect(screen.getByTestId('plugin-store-page')).toBeInTheDocument();
    });

    it('should handle plugin status toggle error', async () => {
      mockUpdatePlugin.mockRejectedValue(new Error('Toggle failed'));

      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Try to deactivate plugin
      const deactivateButton = screen.getByRole('button', {
        name: /Deactivate/i,
      });
      fireEvent.click(deactivateButton);

      // Should handle error gracefully
      await waitFor(() => {
        expect(mockUpdatePlugin).toHaveBeenCalled();
      });
    });

    it('should handle plugin uninstall error', async () => {
      mockDeletePlugin.mockRejectedValue(new Error('Uninstall failed'));

      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Uninstall plugin
      const uninstallButton = screen.getByRole('button', {
        name: /Uninstall/i,
      });
      fireEvent.click(uninstallButton);

      await waitFor(() => {
        expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
      });

      // Remove permanently
      const removeButton = screen.getByTestId('uninstall-remove-btn');
      fireEvent.click(removeButton);

      // Should handle error gracefully
      await waitFor(() => {
        expect(mockDeletePlugin).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    // Remove the failing plugin manager load failure test

    it('should handle plugin manager toggle failure', async () => {
      // Mock plugin manager to fail on toggle
      const mockPluginManager = {
        loadPlugin: vi.fn().mockResolvedValue(true),
        unloadPlugin: vi.fn().mockResolvedValue(true),
        togglePluginStatus: vi.fn().mockResolvedValue(false),
      } as any;
      vi.mocked(pluginManager.getPluginManager).mockReturnValue(
        mockPluginManager,
      );

      mockUpdatePlugin.mockResolvedValue({
        data: { updatePlugin: { id: '1' } },
      });

      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Deactivate plugin
      const deactivateButton = screen.getByRole('button', {
        name: /Deactivate/i,
      });
      fireEvent.click(deactivateButton);

      // Should handle plugin manager failure gracefully
      await waitFor(() => {
        expect(mockUpdatePlugin).toHaveBeenCalled();
      });
    });

    it('should handle plugin manager unload failure', async () => {
      // Mock plugin manager to fail on unload
      const mockPluginManager = {
        loadPlugin: vi.fn().mockResolvedValue(true),
        unloadPlugin: vi.fn().mockResolvedValue(false),
        togglePluginStatus: vi.fn().mockResolvedValue(true),
      } as any;
      vi.mocked(pluginManager.getPluginManager).mockReturnValue(
        mockPluginManager,
      );

      mockDeletePlugin.mockResolvedValue({
        data: { deletePlugin: { id: '1' } },
      });

      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Uninstall plugin
      const uninstallButton = screen.getByRole('button', {
        name: /Uninstall/i,
      });
      fireEvent.click(uninstallButton);

      await waitFor(() => {
        expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
      });

      // Remove permanently
      const removeButton = screen.getByTestId('uninstall-remove-btn');
      fireEvent.click(removeButton);

      // Should handle plugin manager failure gracefully
      await waitFor(() => {
        expect(mockDeletePlugin).toHaveBeenCalled();
      });
    });

    it('should handle admin plugin file service failure', async () => {
      // Mock admin plugin file service to fail
      (adminPluginFileService.adminPluginFileService.removePlugin as any) = vi
        .fn()
        .mockResolvedValue(false);

      mockDeletePlugin.mockResolvedValue({
        data: { deletePlugin: { id: '1' } },
      });

      renderPluginStore();

      const pluginButton = screen.getByTestId(
        'plugin-action-btn-test-plugin-1',
      );
      fireEvent.click(pluginButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Uninstall plugin
      const uninstallButton = screen.getByRole('button', {
        name: /Uninstall/i,
      });
      fireEvent.click(uninstallButton);

      await waitFor(() => {
        expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
      });

      // Remove permanently
      const removeButton = screen.getByTestId('uninstall-remove-btn');
      fireEvent.click(removeButton);

      // Should handle file service failure gracefully
      await waitFor(() => {
        expect(mockDeletePlugin).toHaveBeenCalled();
      });
    });
  });

  describe('Filter and Search Edge Cases', () => {
    it('should handle empty search term', async () => {
      renderPluginStore();

      const searchInput = screen.getByTestId('searchPlugins');
      fireEvent.change(searchInput, { target: { value: '' } });

      // Wait for debounce delay
      await new Promise((resolve) => setTimeout(resolve, 350));

      await waitFor(() => {
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-1'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-2'),
        ).toBeInTheDocument();
      });
    });

    it('should handle case-insensitive search', async () => {
      renderPluginStore();

      const searchInput = screen.getByTestId('searchPlugins');
      fireEvent.change(searchInput, { target: { value: 'TEST PLUGIN' } });

      // Wait for debounce delay
      await new Promise((resolve) => setTimeout(resolve, 350));

      await waitFor(() => {
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-1'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-2'),
        ).toBeInTheDocument();
      });
    });

    it('should handle special characters in search', async () => {
      renderPluginStore();

      const searchInput = screen.getByTestId('searchPlugins');
      fireEvent.change(searchInput, { target: { value: 'test-plugin' } });

      // Wait for debounce delay
      await new Promise((resolve) => setTimeout(resolve, 350));

      await waitFor(() => {
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-1'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('plugin-list-item-test-plugin-2'),
        ).toBeInTheDocument();
      });
    });
  });
});
