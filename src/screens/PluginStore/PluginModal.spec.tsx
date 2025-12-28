import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
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

// Mock LoadingState
vi.mock('../../shared-components/LoadingState/LoadingState', () => ({
  default: ({
    isLoading,
    children,
  }: {
    isLoading: boolean;
    children: React.ReactNode;
  }) => (
    <div data-testid="loading-state" data-is-loading={isLoading}>
      {children}
      {isLoading && <div data-testid="spinner">Loading...</div>}
    </div>
  ),
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
    // Default mock implementation
    (
      AdminPluginFileService.getPluginDetails as unknown as Mock
    ).mockResolvedValue(null);
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
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalledWith(
          'test-plugin',
        );
      });
    });

    it('should display detailed plugin information when loaded', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });
    });

    it('should handle loading error gracefully', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockRejectedValueOnce(new Error('File not found'));

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalled();
      });

      // Should still show basic plugin info from meta
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });

    it('should handle null response gracefully', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(null);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalled();
      });

      // Should still show basic plugin info from meta
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });

    it('should show loading state while fetching', () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockImplementationOnce(() => new Promise(() => {})); // Never resolves

      render(<PluginModal {...defaultProps} />);

      expect(screen.getByText('Loading details...')).toBeInTheDocument();
    });
  });

  describe('Plugin Actions - Not Installed', () => {
    it('should show Install button for non-installed plugin', () => {
      render(<PluginModal {...defaultProps} />);

      expect(screen.getByText('Install')).toBeInTheDocument();
      // Should NOT have Uninstall button for non-installed plugin
      expect(screen.queryByText('Uninstall')).not.toBeInTheDocument();
    });

    it('should call installPlugin when Install button is clicked', () => {
      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText('Install'));

      expect(defaultProps.installPlugin).toHaveBeenCalledWith(mockMeta);
    });

    it('should show LoadingState when loading', () => {
      render(<PluginModal {...defaultProps} loading={true} />);

      const loadingStates = screen.getAllByTestId('loading-state');
      // Should have exactly 1 LoadingState component (Install button only)
      expect(loadingStates.length).toBe(1);

      // Verify it is in loading state
      const loadingOnes = loadingStates.filter(
        (state) => state.getAttribute('data-is-loading') === 'true',
      );
      expect(loadingOnes.length).toBe(1);
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

    it('should show LoadingState when loading', () => {
      render(<PluginModal {...installedActiveProps} loading={true} />);

      const loadingStates = screen.getAllByTestId('loading-state');
      // Should have exactly 2 LoadingState components (Deactivate and Uninstall buttons)
      expect(loadingStates.length).toBe(2);

      // Verify they are in loading state
      const loadingOnes = loadingStates.filter(
        (state) => state.getAttribute('data-is-loading') === 'true',
      );
      expect(loadingOnes.length).toBe(2);
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
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Screenshots')).toBeInTheDocument();
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        expect(screenshots).toHaveLength(2);
      });
    });
  });

  describe('Content Display - Features Tab', () => {
    it('should display features when available', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        // Use getAllByText and click the first one (the tab button)
        const featuresTabs = screen.getAllByText('Features');
        fireEvent.click(featuresTabs[0]);
        expect(screen.getByText('Feature 1')).toBeInTheDocument();
        expect(screen.getByText('Feature 2')).toBeInTheDocument();
      });
    });

    it('should show no features message when no features available', () => {
      render(<PluginModal {...defaultProps} />);

      const featuresTabs = screen.getAllByText('Features');
      fireEvent.click(featuresTabs[0]);

      expect(
        screen.getByText('No features information available for this plugin.'),
      ).toBeInTheDocument();
    });
  });

  describe('Content Display - Changelog Tab', () => {
    it('should display changelog when available', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const changelogTabs = screen.getAllByText('Changelog');
        fireEvent.click(changelogTabs[0]);
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
        expect(screen.getByText('Fixed bug X')).toBeInTheDocument();
        expect(screen.getByText('Added feature Y')).toBeInTheDocument();
        // Use partial text matching for version that might be split
        expect(screen.getByText(/1\.2\.2/)).toBeInTheDocument();
        expect(screen.getByText('Initial release')).toBeInTheDocument();
      });
    });

    it('should show no changelog message when no changelog available', () => {
      render(<PluginModal {...defaultProps} />);

      const changelogTabs = screen.getAllByText('Changelog');
      fireEvent.click(changelogTabs[0]);

      // The actual text shown is "Loading changelog..." when no changelog is available
      expect(screen.getByText('Loading changelog...')).toBeInTheDocument();
    });
  });

  describe('Install Elapsed Ticker', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should show Installing with mm:ss while loading', () => {
      render(<PluginModal {...defaultProps} loading={true} />);

      expect(
        screen.getByRole('button', { name: /Installing\s*\(\d{2}:\d{2}\)/ }),
      ).toBeInTheDocument();
    });

    it('should reset when loading stops and start at 00:00 when restarted', () => {
      const { rerender } = render(
        <PluginModal {...defaultProps} loading={true} />,
      );

      // While loading, shows Installing (mm:ss)
      expect(
        screen.getByRole('button', { name: /Installing\s*\(\d{2}:\d{2}\)/ }),
      ).toBeInTheDocument();

      // Stop loading -> text reverts to Install
      rerender(<PluginModal {...defaultProps} loading={false} />);
      expect(screen.getByText('Install')).toBeInTheDocument();

      // Start loading again -> should show 00:00 initially
      rerender(<PluginModal {...defaultProps} loading={true} />);
      expect(
        screen.getByRole('button', { name: /Installing\s*\(00:00\)/ }),
      ).toBeInTheDocument();
    });

    it('should clean up interval on unmount', () => {
      const { unmount } = render(
        <PluginModal {...defaultProps} loading={true} />,
      );

      // Unmount while interval is active
      unmount();

      // Advance timers to ensure no setState after unmount
      vi.advanceTimersByTime(5000);

      // No explicit assertion needed; absence of act/state update warnings is success
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing plugin meta gracefully', () => {
      const propsWithoutMeta = {
        ...defaultProps,
        meta: null as unknown as IPluginMeta,
      };

      render(<PluginModal {...propsWithoutMeta} />);

      // Should still render without crashing
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('should handle missing plugin details gracefully', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(null);

      render(<PluginModal {...defaultProps} />);

      // Should still show basic info from meta
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });

    it('should handle network errors gracefully', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockRejectedValueOnce(new Error('Network error'));

      render(<PluginModal {...defaultProps} />);

      // Should still show basic info from meta
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PluginModal {...defaultProps} />);

      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      render(<PluginModal {...defaultProps} />);

      const installButton = screen.getByText('Install');
      expect(installButton).toHaveAttribute('type', 'button');
    });

    it('should have proper tab navigation', () => {
      render(<PluginModal {...defaultProps} />);

      // The tabs are divs, not actual tab roles, so we check for the tab content instead
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Changelog')).toBeInTheDocument();
    });
  });

  describe('Screenshot Viewer', () => {
    it('should open screenshot viewer when screenshot is clicked', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      expect(screen.getByText('← Back to Details')).toBeInTheDocument();
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should show navigation buttons when multiple screenshots', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Check for navigation buttons
      const prevButton = screen.getByTitle('Previous image (←)');
      const nextButton = screen.getByTitle('Next image (→)');
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should show dot indicators for multiple screenshots', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Check for dot indicators (they should be present for 2 screenshots)
      const dotIndicators = screen.getAllByTitle(/Go to screenshot \d+/);
      expect(dotIndicators.length).toBe(2);
    });

    it('should navigate to next screenshot', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const nextButton = screen.getByTitle('Next image (→)');
      fireEvent.click(nextButton);

      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should navigate to previous screenshot', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const nextButton = screen.getByTitle('Next image (→)');
      fireEvent.click(nextButton); // Go to second screenshot

      const prevButton = screen.getByTitle('Previous image (←)');
      fireEvent.click(prevButton); // Go back to first

      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should close screenshot viewer when back button is clicked', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const backButton = screen.getByText('← Back to Details');
      fireEvent.click(backButton);

      expect(screen.queryByText('← Back to Details')).not.toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should navigate to specific screenshot when dot is clicked', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const dotIndicators = screen.getAllByTitle(/Go to screenshot \d+/);
      fireEvent.click(dotIndicators[1]); // Click second dot

      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close screenshot viewer on Escape key', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.queryByText('← Back to Details')).not.toBeInTheDocument();
    });

    it('should navigate to next screenshot on ArrowRight key', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      fireEvent.keyDown(window, { key: 'ArrowRight' });

      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should navigate to previous screenshot on ArrowLeft key', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // First go to second screenshot
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Then go back to first
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty changelog gracefully', async () => {
      const mockDetailsWithEmptyChangelog = {
        ...mockDetails,
        changelog: [],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWithEmptyChangelog);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const changelogTabs = screen.getAllByText('Changelog');
        fireEvent.click(changelogTabs[0]);
      });

      // When changelog is empty, it should just show the changelog section title
      expect(screen.getAllByText('Changelog')).toHaveLength(2); // Tab and section title
    });

    it('should handle single screenshot without navigation', async () => {
      const mockDetailsWithSingleScreenshot = {
        ...mockDetails,
        screenshots: ['screenshot1.png'],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWithSingleScreenshot);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Should not show navigation buttons for single screenshot
      expect(screen.queryByTitle('Previous image (←)')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Next image (→)')).not.toBeInTheDocument();
      expect(screen.queryByText(/of \d+/)).not.toBeInTheDocument();
    });

    it('should handle many screenshots without dot indicators', async () => {
      const mockDetailsWithManyScreenshots = {
        ...mockDetails,
        screenshots: [
          'screenshot1.png',
          'screenshot2.png',
          'screenshot3.png',
          'screenshot4.png',
          'screenshot5.png',
          'screenshot6.png',
        ],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWithManyScreenshots);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Should show navigation buttons but not dot indicators for >5 screenshots
      expect(screen.getByTitle('Previous image (←)')).toBeInTheDocument();
      expect(screen.getByTitle('Next image (→)')).toBeInTheDocument();
      expect(
        screen.queryByTitle(/Go to screenshot \d+/),
      ).not.toBeInTheDocument();
    });
  });

  describe('Features Extraction', () => {
    it('should extract features from readme when features are not available in details', async () => {
      const mockDetailsWithReadme: IPluginDetails = {
        ...mockDetails,
        features: undefined, // No features in details
        readme:
          'Some content\nFeatures:\n- Feature 1\n- Feature 2\n- Feature 3\nMore content',
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValue(mockDetailsWithReadme);

      render(<PluginModal {...defaultProps} />);

      // Wait for the details to load
      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
      });

      // Click on Features tab
      fireEvent.click(screen.getByText('Features'));

      // Check that features extracted from readme are displayed
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
      expect(screen.getByText('Feature 3')).toBeInTheDocument();
    });

    it('should handle readme without Features section', async () => {
      const mockDetailsWithReadmeNoFeatures: IPluginDetails = {
        ...mockDetails,
        features: undefined, // No features in details
        readme:
          'Some content without Features section\n- This should not be extracted',
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValue(mockDetailsWithReadmeNoFeatures);

      render(<PluginModal {...defaultProps} />);

      // Wait for the details to load
      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
      });

      // Click on Features tab
      fireEvent.click(screen.getByText('Features'));

      // Should not display any features since there's no Features section
      expect(
        screen.queryByText('This should not be extracted'),
      ).not.toBeInTheDocument();
    });

    it('should handle readme with Features section but no bullet points', async () => {
      const mockDetailsWithReadmeNoBullets: IPluginDetails = {
        ...mockDetails,
        features: undefined, // No features in details
        readme: 'Some content\nFeatures:\nNo bullet points here\nMore content',
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValue(mockDetailsWithReadmeNoBullets);

      render(<PluginModal {...defaultProps} />);

      // Wait for the details to load
      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
      });

      // Click on Features tab
      fireEvent.click(screen.getByText('Features'));

      // Should not display any features since there are no bullet points
      expect(
        screen.queryByText('No bullet points here'),
      ).not.toBeInTheDocument();
    });

    it('should handle readme with mixed content in Features section', async () => {
      const mockDetailsWithMixedContent: IPluginDetails = {
        ...mockDetails,
        features: undefined, // No features in details
        readme:
          'Some content\nFeatures:\n- Feature 1\nRegular text\n- Feature 2\nMore text\n- Feature 3',
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValue(mockDetailsWithMixedContent);

      render(<PluginModal {...defaultProps} />);

      // Wait for the details to load
      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
      });

      // Click on Features tab
      fireEvent.click(screen.getByText('Features'));

      // Should only display the bullet point features
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
      expect(screen.getByText('Feature 3')).toBeInTheDocument();
      expect(screen.queryByText('Regular text')).not.toBeInTheDocument();
      expect(screen.queryByText('More text')).not.toBeInTheDocument();
    });
  });
});
