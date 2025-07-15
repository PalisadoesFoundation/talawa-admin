import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PluginModal from './PluginModal';
import { AdminPluginFileService } from '../../plugin/services/AdminPluginFileService';
import type { IPluginMeta, IPluginDetails, IInstalledPlugin } from 'plugin';

// Mock AdminPluginFileService
vi.mock('../../plugin/services/AdminPluginFileService', () => ({
  AdminPluginFileService: {
    getPluginDetails: vi.fn(),
  },
}));

describe('PluginModal', () => {
  const mockMeta: IPluginMeta = {
    id: 'test-plugin',
    name: 'Test Plugin',
    author: 'Test Author',
    description: 'A test plugin description',
    icon: 'test-icon.png',
  };

  const mockDetails: IPluginDetails = {
    id: 'test-plugin',
    name: 'Test Plugin',
    author: 'Test Author',
    description: 'A test plugin description',
    icon: 'test-icon.png',
    version: '1.2.3',
    cdnUrl: '', // No longer used
    screenshots: ['screenshot1.png', 'screenshot2.png'],
    readme:
      'Features:\n- Feature 1\n- Feature 2\n\n## Installation\nInstall the plugin...',
    features: ['Feature 1', 'Feature 2'],
    changelog: [
      {
        version: '1.2.3',
        date: '2023-12-01',
        changes: ['Fixed bug X', 'Added feature Y'],
      },
      {
        version: '1.2.2',
        date: '2023-11-01',
        changes: ['Initial release'],
      },
    ],
  };

  const mockInstalledPlugin: IInstalledPlugin = {
    id: 'test-plugin',
    name: 'Test Plugin',
    author: 'Test Author',
    description: 'A test plugin description',
    icon: 'test-icon.png',
    version: '1.2.3',
    cdnUrl: '', // No longer used
    screenshots: ['screenshot1.png', 'screenshot2.png'],
    readme: '',
    changelog: [],
    status: 'active' as const,
  };

  const defaultProps = {
    show: true,
    onHide: vi.fn(),
    pluginId: 'test-plugin',
    meta: mockMeta,
    loading: false,
    isInstalled: vi.fn().mockReturnValue(false),
    getInstalledPlugin: vi.fn().mockReturnValue(undefined),
    installPlugin: vi.fn(),
    togglePluginStatus: vi.fn(),
    uninstallPlugin: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Display', () => {
    it('should render modal when show is true', () => {
      render(<PluginModal {...defaultProps} />);

      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('A test plugin description')).toBeInTheDocument();
    });

    it('should not render modal when show is false', () => {
      render(<PluginModal {...defaultProps} show={false} />);

      expect(screen.queryByText('Test Plugin')).not.toBeInTheDocument();
    });

    it('should call onHide when close button is clicked', () => {
      render(<PluginModal {...defaultProps} />);

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      expect(defaultProps.onHide).toHaveBeenCalled();
    });

    it('should display plugin icon with alt text', () => {
      render(<PluginModal {...defaultProps} />);

      const icon = screen.getByAltText('Plugin Icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', 'test-icon.png');
    });
  });

  describe('Tab Navigation', () => {
    it('should render all tabs (Details, Features, Changelog)', () => {
      render(<PluginModal {...defaultProps} />);

      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Changelog')).toBeInTheDocument();
    });

    it('should default to Details tab', () => {
      render(<PluginModal {...defaultProps} />);

      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should switch to Features tab when clicked', () => {
      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText('Features'));

      expect(
        screen.getByText('No features information available for this plugin.'),
      ).toBeInTheDocument();
    });

    it('should switch to Changelog tab when clicked', () => {
      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText('Changelog'));

      // Should switch to changelog tab - verify content is different from details
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });
  });

  describe('Plugin Details Loading', () => {
    it('should load plugin details when modal opens', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalledWith(
          'test-plugin',
        );
      });
    });

    it('should display detailed plugin information when loaded', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });
    });

    it('should handle loading error gracefully', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockRejectedValueOnce(
        new Error('File not found'),
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalled();
      });

      // Should still show basic plugin info from meta
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });

    it('should handle null response gracefully', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        null,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalled();
      });

      // Should still show basic plugin info from meta
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });

    it('should show loading state while fetching', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockImplementationOnce(
        () => new Promise(() => {}),
      ); // Never resolves

      render(<PluginModal {...defaultProps} />);

      expect(screen.getByText('Loading details...')).toBeInTheDocument();
    });

    it('should clear details when modal closes', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      const { rerender } = render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      rerender(<PluginModal {...defaultProps} show={false} />);
      rerender(<PluginModal {...defaultProps} show={true} />);

      // Should load again when reopened
      expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalledTimes(2);
    });
  });

  describe('Plugin Actions - Not Installed', () => {
    it('should show Install button for non-installed plugin', () => {
      render(<PluginModal {...defaultProps} />);

      expect(screen.getByText('Install')).toBeInTheDocument();
    });

    it('should call installPlugin when Install button is clicked', () => {
      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText('Install'));

      expect(defaultProps.installPlugin).toHaveBeenCalledWith(mockMeta);
    });

    it('should disable Install button when loading', () => {
      render(<PluginModal {...defaultProps} loading={true} />);

      const installButton = screen.getByText('Install');
      expect(installButton).toBeDisabled();
    });
  });

  describe('Plugin Actions - Installed Active', () => {
    const installedActiveProps = {
      ...defaultProps,
      isInstalled: vi.fn(() => true),
      getInstalledPlugin: vi.fn(() => ({
        ...mockInstalledPlugin,
        status: 'active' as const,
      })),
    };

    it('should show Deactivate and Uninstall buttons for active installed plugin', () => {
      render(<PluginModal {...installedActiveProps} />);

      expect(screen.getByText('Deactivate')).toBeInTheDocument();
      expect(screen.getByText('Uninstall')).toBeInTheDocument();
    });

    it('should call togglePluginStatus with inactive when Deactivate is clicked', () => {
      render(<PluginModal {...installedActiveProps} />);

      fireEvent.click(screen.getByText('Deactivate'));

      expect(defaultProps.togglePluginStatus).toHaveBeenCalledWith(
        mockMeta,
        'inactive',
      );
    });

    it('should call uninstallPlugin when Uninstall is clicked', () => {
      render(<PluginModal {...installedActiveProps} />);

      fireEvent.click(screen.getByText('Uninstall'));

      expect(defaultProps.uninstallPlugin).toHaveBeenCalledWith(mockMeta);
    });

    it('should disable buttons when loading', () => {
      render(<PluginModal {...installedActiveProps} loading={true} />);

      expect(screen.getByText('Deactivate')).toBeDisabled();
      expect(screen.getByText('Uninstall')).toBeDisabled();
    });

    it('should show spinner icons when loading', () => {
      render(<PluginModal {...installedActiveProps} loading={true} />);

      const spinners = screen.getAllByText((content, element) => {
        return element?.classList.contains('animate-spin') || false;
      });
      expect(spinners.length).toBeGreaterThan(0);
    });
  });

  describe('Plugin Actions - Installed Inactive', () => {
    const installedInactiveProps = {
      ...defaultProps,
      isInstalled: vi.fn(() => true),
      getInstalledPlugin: vi.fn(() => ({
        ...mockInstalledPlugin,
        status: 'inactive' as const,
      })),
    };

    it('should show Activate and Uninstall buttons for inactive installed plugin', () => {
      render(<PluginModal {...installedInactiveProps} />);

      expect(screen.getByText('Activate')).toBeInTheDocument();
      expect(screen.getByText('Uninstall')).toBeInTheDocument();
    });

    it('should call togglePluginStatus with active when Activate is clicked', () => {
      render(<PluginModal {...installedInactiveProps} />);

      fireEvent.click(screen.getByText('Activate'));

      expect(defaultProps.togglePluginStatus).toHaveBeenCalledWith(
        mockMeta,
        'active',
      );
    });
  });

  describe('Content Display - Details Tab', () => {
    it('should display plugin description in Details tab', () => {
      render(<PluginModal {...defaultProps} />);

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('A test plugin description')).toBeInTheDocument();
    });

    it('should display screenshots when available', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Screenshots')).toBeInTheDocument();
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        expect(screenshots).toHaveLength(2);
      });
    });

    it('should open screenshot viewer when screenshot is clicked', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        expect(screenshots).toHaveLength(2);

        // Click on first screenshot
        fireEvent.click(screenshots[0]);

        // Screenshot viewer should open
        expect(screen.getByAltText('Screenshot 1')).toBeInTheDocument();
      });
    });

    it('should navigate between screenshots in viewer', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);

        // Should show navigation buttons for multiple screenshots
        expect(screen.getByTitle('Next image (→)')).toBeInTheDocument();
        expect(screen.getByTitle('Previous image (←)')).toBeInTheDocument();

        // Should show image counter
        expect(screen.getByText('1 / 2')).toBeInTheDocument();
      });
    });

    it('should close screenshot viewer when escape key is pressed', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);

        // Screenshot viewer should be open
        expect(screen.getByAltText('Screenshot 1')).toBeInTheDocument();

        // Press escape key
        fireEvent.keyDown(window, { key: 'Escape' });

        // Screenshot viewer should close
        expect(screen.queryByAltText('Screenshot 1')).not.toBeInTheDocument();
      });
    });

    it('should navigate screenshots with arrow keys', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);

        // Should show first screenshot
        expect(screen.getByText('1 / 2')).toBeInTheDocument();

        // Press right arrow key
        fireEvent.keyDown(window, { key: 'ArrowRight' });

        // Should show second screenshot
        expect(screen.getByText('2 / 2')).toBeInTheDocument();

        // Press left arrow key
        fireEvent.keyDown(window, { key: 'ArrowLeft' });

        // Should show first screenshot again
        expect(screen.getByText('1 / 2')).toBeInTheDocument();
      });
    });

    it('should not show navigation buttons for single screenshot', async () => {
      const singleScreenshotDetails = {
        ...mockDetails,
        screenshots: ['screenshot1.png'],
      };
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        singleScreenshotDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);

        // Should not show navigation buttons
        expect(screen.queryByTitle('Next image (→)')).not.toBeInTheDocument();
        expect(
          screen.queryByTitle('Previous image (←)'),
        ).not.toBeInTheDocument();

        // Should not show image counter
        expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
      });
    });

    it('should display features in both Details and Features tabs', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      // Check Details tab shows key features
      await waitFor(() => {
        expect(screen.getByText('Key Features')).toBeInTheDocument();
        expect(screen.getByText('Feature 1')).toBeInTheDocument();
        expect(screen.getByText('Feature 2')).toBeInTheDocument();
      });

      // Switch to Features tab
      fireEvent.click(screen.getByText('Features'));

      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('Feature 1')).toBeInTheDocument();
        expect(screen.getByText('Feature 2')).toBeInTheDocument();
      });
    });

    it('should not display readme section', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Readme')).not.toBeInTheDocument();
      });
    });

    it('should handle plugins with no features gracefully', async () => {
      const detailsWithoutFeatures = {
        ...mockDetails,
        features: [],
      };
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        detailsWithoutFeatures,
      );

      render(<PluginModal {...defaultProps} />);

      // Should not show Key Features section in Details tab
      await waitFor(() => {
        expect(screen.queryByText('Key Features')).not.toBeInTheDocument();
      });

      // Switch to Features tab
      fireEvent.click(screen.getByText('Features'));

      await waitFor(() => {
        expect(
          screen.getByText(
            'No features information available for this plugin.',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Content Display - Features Tab', () => {
    it('should display features from info.json', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      // Switch to Features tab
      fireEvent.click(screen.getByText('Features'));

      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('Feature 1')).toBeInTheDocument();
        expect(screen.getByText('Feature 2')).toBeInTheDocument();
      });
    });

    it('should show loading state in Features tab while fetching', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockImplementationOnce(
        () => new Promise(() => {}),
      ); // Never resolves

      render(<PluginModal {...defaultProps} />);

      // Switch to Features tab
      fireEvent.click(screen.getByText('Features'));

      expect(screen.getByText('Loading features...')).toBeInTheDocument();
    });

    it('should show appropriate message when no features are available', async () => {
      const detailsWithoutFeatures = {
        ...mockDetails,
        features: [],
        readme: '',
      };
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        detailsWithoutFeatures,
      );

      render(<PluginModal {...defaultProps} />);

      // Switch to Features tab
      fireEvent.click(screen.getByText('Features'));

      await waitFor(() => {
        expect(
          screen.getByText(
            'No features information available for this plugin.',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Content Display - Changelog Tab', () => {
    it('should display changelog entries when available', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        mockDetails,
      );

      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText('Changelog'));

      await waitFor(() => {
        expect(screen.getByText('v1.2.3 - 2023-12-01')).toBeInTheDocument();
        expect(screen.getByText('Fixed bug X')).toBeInTheDocument();
        expect(screen.getByText('Added feature Y')).toBeInTheDocument();
        expect(screen.getByText('v1.2.2 - 2023-11-01')).toBeInTheDocument();
        expect(screen.getByText('Initial release')).toBeInTheDocument();
      });
    });

    it('should show loading state in Changelog tab while fetching', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockImplementationOnce(
        () => new Promise(() => {}),
      ); // Never resolves

      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText('Changelog'));

      expect(screen.getByText('Loading changelog...')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing pluginId gracefully', () => {
      render(<PluginModal {...defaultProps} pluginId="" />);

      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      expect(AdminPluginFileService.getPluginDetails).not.toHaveBeenCalled();
    });

    it('should handle missing meta gracefully', () => {
      render(<PluginModal {...defaultProps} meta={null} />);

      // Should not crash, may show empty state
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    it('should handle plugin with no icon', () => {
      const metaWithoutIcon = { ...mockMeta, icon: '' };
      render(<PluginModal {...defaultProps} meta={metaWithoutIcon} />);

      const icon = screen.getByAltText('Plugin Icon');
      expect(icon).toBeInTheDocument();
    });

    it('should handle plugin without features in info.json', async () => {
      const detailsWithoutFeatures = {
        ...mockDetails,
        features: [],
      };

      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        detailsWithoutFeatures,
      );

      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText('Features'));

      await waitFor(() => {
        expect(
          screen.getByText(
            'No features information available for this plugin.',
          ),
        ).toBeInTheDocument();
      });
    });

    it('should handle empty changelog array', async () => {
      const detailsWithoutChangelog = {
        ...mockDetails,
        changelog: [],
      };

      (AdminPluginFileService.getPluginDetails as any).mockResolvedValueOnce(
        detailsWithoutChangelog,
      );

      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText('Changelog'));

      await waitFor(() => {
        // Should render changelog tab but with no entries - check for tab content structure
        expect(screen.queryByText('Description')).not.toBeInTheDocument();
      });
    });

    it('should handle plugin actions when meta is null', () => {
      const propsWithNullMeta = {
        ...defaultProps,
        meta: null,
        isInstalled: vi.fn(() => true),
        getInstalledPlugin: vi.fn(() => mockInstalledPlugin),
      };

      render(<PluginModal {...propsWithNullMeta} />);

      // Should not show action buttons when meta is null
      expect(screen.queryByText('Install')).not.toBeInTheDocument();
      expect(screen.queryByText('Activate')).not.toBeInTheDocument();
      expect(screen.queryByText('Uninstall')).not.toBeInTheDocument();
    });

    it('should handle getInstalledPlugin returning null', () => {
      const props = {
        ...defaultProps,
        isInstalled: vi.fn(() => true),
        getInstalledPlugin: vi.fn(() => undefined),
      };

      render(<PluginModal {...props} />);

      // Should not crash and should still show plugin action buttons when installed but getInstalledPlugin returns null
      // This may show activate/uninstall buttons with a null plugin status
      expect(screen.getByText('Activate')).toBeInTheDocument();
      expect(screen.getByText('Uninstall')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should fetch details when pluginId changes', async () => {
      (AdminPluginFileService.getPluginDetails as any).mockResolvedValue(
        mockDetails,
      );

      const { rerender } = render(
        <PluginModal {...defaultProps} pluginId="plugin1" />,
      );

      await waitFor(() => {
        expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalledWith(
          'plugin1',
        );
      });

      rerender(<PluginModal {...defaultProps} pluginId="plugin2" />);

      await waitFor(() => {
        expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalledWith(
          'plugin2',
        );
      });

      expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalledTimes(2);
    });

    it('should reset tab to Details when modal reopens', async () => {
      const { rerender } = render(<PluginModal {...defaultProps} />);

      // Switch to Features tab
      fireEvent.click(screen.getByText('Features'));
      expect(
        screen.getByText('No features information available for this plugin.'),
      ).toBeInTheDocument();

      // Close and reopen modal
      rerender(<PluginModal {...defaultProps} show={false} />);
      rerender(<PluginModal {...defaultProps} show={true} />);

      // Should be back on Details tab
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });
});
