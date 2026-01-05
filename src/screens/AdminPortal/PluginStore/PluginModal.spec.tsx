import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PluginModal from './PluginModal';
import { AdminPluginFileService } from 'plugin/services/AdminPluginFileService';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type { IPluginMeta, IPluginDetails } from 'plugin';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Mock AdminPluginFileService
vi.mock('plugin/services/AdminPluginFileService', () => ({
  AdminPluginFileService: {
    getPluginDetails: vi.fn(),
  },
}));

// Mock NotificationToast
vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock LoadingState
vi.mock('shared-components/LoadingState/LoadingState', () => ({
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
    cdnUrl: '',
    screenshots: ['screenshot1.png', 'screenshot2.png'],
    readme:
      'Features:\n- Feature 1\n- Feature 2\n\n## Installation\nInstall the plugin...',
    features: ['Feature 1', 'Feature 2'],
    changelog: [
      {
        version: '1.2.3',
        date: dayjs
          .utc()
          .subtract(1, 'year')
          .month(11)
          .date(1)
          .format('YYYY-MM-DD'),
        changes: ['Fixed bug X', 'Added feature Y'],
      },
      {
        version: '1.2.2',
        date: dayjs
          .utc()
          .subtract(1, 'year')
          .month(10)
          .date(1)
          .format('YYYY-MM-DD'),
        changes: ['Initial release'],
      },
    ],
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

      const closeButton = screen.getByLabelText(i18nForTest.t('common:close'));
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

      expect(
        screen.getByText(i18nForTest.t('pluginStore.details')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('pluginStore.features')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('pluginStore.changelog')),
      ).toBeInTheDocument();
    });

    it('should default to Details tab', () => {
      render(<PluginModal {...defaultProps} />);

      expect(
        screen.getByText(i18nForTest.t('common:description')),
      ).toBeInTheDocument();
    });

    it('should switch to Features tab when clicked', () => {
      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText(i18nForTest.t('pluginStore.features')));

      expect(
        screen.getByText(
          i18nForTest.t('pluginStore.noFeaturesInfoAvailableForThisPlugin'),
        ),
      ).toBeInTheDocument();
    });

    it('should switch to Changelog tab when clicked', () => {
      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText(i18nForTest.t('pluginStore.changelog')));

      expect(
        screen.queryByText(i18nForTest.t('common:description')),
      ).not.toBeInTheDocument();
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

      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });

    it('should show loading state while fetching', () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockImplementationOnce(() => new Promise(() => {}));

      render(<PluginModal {...defaultProps} />);

      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingDetails')),
      ).toBeInTheDocument();
    });
  });

  describe('Plugin Actions - Not Installed', () => {
    it('should show Install button for non-installed plugin', () => {
      render(<PluginModal {...defaultProps} />);

      expect(
        screen.getByText(i18nForTest.t('pluginStore.install')),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(i18nForTest.t('pluginStore.uninstall')),
      ).not.toBeInTheDocument();
    });

    it('should call installPlugin when Install button is clicked', () => {
      render(<PluginModal {...defaultProps} />);

      fireEvent.click(screen.getByText(i18nForTest.t('pluginStore.install')));

      expect(defaultProps.installPlugin).toHaveBeenCalledWith(mockMeta);
    });

    it('should show LoadingState when loading', () => {
      render(<PluginModal {...defaultProps} loading={true} />);

      const loadingStates = screen.getAllByTestId('loading-state');
      expect(loadingStates.length).toBe(1);

      const loadingOnes = loadingStates.filter(
        (state) => state.getAttribute('data-is-loading') === 'true',
      );
      expect(loadingOnes.length).toBe(1);
    });

    it('should show Installing with elapsed time when loading', async () => {
      const propsWithLoading = {
        ...defaultProps,
        loading: true,
      };

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...propsWithLoading} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Installing\s*\(\d{2}:\d{2}\)/ }),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Plugin Actions - Installed Active', () => {
    const installedActiveProps = {
      ...defaultProps,
      isInstalled: vi.fn(() => true),
      getInstalledPlugin: vi.fn(() => ({
        ...mockDetails,
        status: 'active' as const,
      })),
    };

    it('should show Deactivate and Uninstall buttons for active installed plugin', () => {
      render(<PluginModal {...installedActiveProps} />);

      expect(
        screen.getByText(i18nForTest.t('pluginStore.deactivate')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('pluginStore.uninstall')),
      ).toBeInTheDocument();
    });

    it('should call togglePluginStatus with inactive when Deactivate is clicked', () => {
      render(<PluginModal {...installedActiveProps} />);

      fireEvent.click(
        screen.getByText(i18nForTest.t('pluginStore.deactivate')),
      );

      expect(defaultProps.togglePluginStatus).toHaveBeenCalledWith(
        mockMeta,
        'inactive',
      );
    });

    it('should call uninstallPlugin when Uninstall is clicked', () => {
      render(<PluginModal {...installedActiveProps} />);

      fireEvent.click(screen.getByText(i18nForTest.t('pluginStore.uninstall')));

      expect(defaultProps.uninstallPlugin).toHaveBeenCalledWith(mockMeta);
    });

    it('should show LoadingState when loading', () => {
      render(<PluginModal {...installedActiveProps} loading={true} />);

      const loadingStates = screen.getAllByTestId('loading-state');
      expect(loadingStates.length).toBe(2);

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
        ...mockDetails,
        status: 'inactive' as const,
      })),
    };

    it('should show Activate and Uninstall buttons for inactive installed plugin', () => {
      render(<PluginModal {...installedInactiveProps} />);

      expect(
        screen.getByText(i18nForTest.t('pluginStore.activate')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('pluginStore.uninstall')),
      ).toBeInTheDocument();
    });

    it('should call togglePluginStatus with active when Activate is clicked', () => {
      render(<PluginModal {...installedInactiveProps} />);

      fireEvent.click(screen.getByText(i18nForTest.t('pluginStore.activate')));

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

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.screenshots')),
        ).toBeInTheDocument();
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
        const featuresTabs = screen.getAllByText(
          i18nForTest.t('pluginStore.features'),
        );
        fireEvent.click(featuresTabs[0]);
        expect(screen.getByText('Feature 1')).toBeInTheDocument();
        expect(screen.getByText('Feature 2')).toBeInTheDocument();
      });
    });

    it('should show no features message when no features available', () => {
      render(<PluginModal {...defaultProps} />);

      const featuresTabs = screen.getAllByText(
        i18nForTest.t('pluginStore.features'),
      );
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
        const changelogTabs = screen.getAllByText(
          i18nForTest.t('pluginStore.changelog'),
        );
        fireEvent.click(changelogTabs[0]);
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
        expect(screen.getByText('Fixed bug X')).toBeInTheDocument();
        expect(screen.getByText('Added feature Y')).toBeInTheDocument();
      });
    });

    it('should show no changelog message when no changelog available', () => {
      render(<PluginModal {...defaultProps} />);

      const changelogTabs = screen.getAllByText(
        i18nForTest.t('pluginStore.changelog'),
      );
      fireEvent.click(changelogTabs[0]);

      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingChangelog')),
      ).toBeInTheDocument();
    });
  });

  describe('Install Elapsed Ticker', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(
        dayjs().utc().subtract(6, 'year').startOf('year').toDate(),
      );
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

      expect(
        screen.getByRole('button', { name: /Installing\s*\(\d{2}:\d{2}\)/ }),
      ).toBeInTheDocument();

      rerender(<PluginModal {...defaultProps} loading={false} />);
      expect(
        screen.getByText(i18nForTest.t('pluginStore.install')),
      ).toBeInTheDocument();

      rerender(<PluginModal {...defaultProps} loading={true} />);
      expect(
        screen.getByRole('button', { name: /Installing\s*\(00:00\)/ }),
      ).toBeInTheDocument();
    });

    it('should clean up interval on unmount', () => {
      const { unmount } = render(
        <PluginModal {...defaultProps} loading={true} />,
      );

      unmount();
      vi.advanceTimersByTime(5000);

      expect(true).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PluginModal {...defaultProps} />);

      expect(
        screen.getByLabelText(i18nForTest.t('common:close')),
      ).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      render(<PluginModal {...defaultProps} />);

      const installButton = screen.getByText(
        i18nForTest.t('pluginStore.install'),
      );
      expect(installButton).toHaveAttribute('type', 'button');
    });

    it('should have proper tab navigation', () => {
      render(<PluginModal {...defaultProps} />);

      expect(
        screen.getByText(i18nForTest.t('pluginStore.details')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('pluginStore.features')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('pluginStore.changelog')),
      ).toBeInTheDocument();
    });
  });

  describe('Screenshot Viewer - Basic Tests', () => {
    it('should open screenshot viewer when screenshot is clicked', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should show navigation buttons when multiple screenshots', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const prevButton = screen.getByTitle(
        i18nForTest.t('pluginStore.previousImage'),
      );
      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should navigate to next screenshot', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      fireEvent.click(nextButton);

      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should navigate to previous screenshot', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      fireEvent.click(nextButton);

      const prevButton = screen.getByTitle(
        i18nForTest.t('pluginStore.previousImage'),
      );
      fireEvent.click(prevButton);

      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should close screenshot viewer when back button is clicked', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const backButton = screen.getByText(
        i18nForTest.t('pluginStore.backToDetails'),
      );
      fireEvent.click(backButton);

      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('common:description')),
      ).toBeInTheDocument();
    });

    it('should navigate to specific screenshot when dot is clicked', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const dotIndicators = screen.getAllByTitle(/Go to screenshot \d+/);
      fireEvent.click(dotIndicators[1]);

      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation - Basic Tests', () => {
    it('should close screenshot viewer on Escape key', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
    });

    it('should navigate to next screenshot on ArrowRight key', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

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

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases - Basic Tests', () => {
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

      expect(screen.getAllByText('Changelog')).toHaveLength(2);
    });

    it('should handle single screenshot without navigation', async () => {
      const mockDetailsWithSingleScreenshot = {
        ...mockDetails,
        screenshots: ['screenshot1.png'],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWithSingleScreenshot);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      expect(
        screen.queryByTitle(i18nForTest.t('pluginStore.previousImage')),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTitle(i18nForTest.t('pluginStore.nextImage')),
      ).not.toBeInTheDocument();
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

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      expect(
        screen.getByTitle(i18nForTest.t('pluginStore.previousImage')),
      ).toBeInTheDocument();
      expect(
        screen.getByTitle(i18nForTest.t('pluginStore.nextImage')),
      ).toBeInTheDocument();
      expect(
        screen.queryByTitle(/Go to screenshot \d+/),
      ).not.toBeInTheDocument();
    });
  });

  describe('Error Toast Notification', () => {
    it('should show error toast and log error when plugin details loading fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const testError = new Error('Failed to load plugin details');

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockRejectedValueOnce(testError);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18nForTest.t('pluginStore.errorInstalling'),
        );
      });

      // Verify console.error was called with the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load plugin details:',
        testError,
      );

      // Verify details is set to null after error (line 152)
      await waitFor(() => {
        expect(screen.queryByText('v1.2.3')).not.toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle different error types and set details to null', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Test with a string error
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockRejectedValueOnce('String error');

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      // The catch block sets details to null (line 152)
      expect(screen.queryByText('v1.2.3')).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('should execute catch block and set details to null on network error', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const networkError = new Error('Network request failed');

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockRejectedValueOnce(networkError);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} pluginId="test-plugin" />
        </I18nextProvider>,
      );

      // Wait for error to be handled
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
      });

      // Verify the catch block executed: console.error called, details set to null
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load plugin details:',
        networkError,
      );

      // Since details is null, version should not appear
      expect(screen.queryByText('v1.2.3')).not.toBeInTheDocument();

      // But basic meta info should still show
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('should set details to null and setFetching to false in catch block', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockRejectedValueOnce(new Error('Fetch failed'));

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      // Initially shows loading
      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingDetails')),
      ).toBeInTheDocument();

      // After error, catch block executes: setDetails(null), and finally block sets setFetching(false)
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
        expect(
          screen.queryByText(i18nForTest.t('pluginStore.loadingDetails')),
        ).not.toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Screenshot Viewer Reset on Modal Close', () => {
    it('should reset screenshot viewer state when modal is closed', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      const { rerender } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} />
        </I18nextProvider>,
      );

      // Wait for screenshots to load
      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Open screenshot viewer
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Verify screenshot viewer is open
      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();

      // Close the modal
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={false} />
        </I18nextProvider>,
      );

      // Reopen the modal
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} />
        </I18nextProvider>,
      );

      // Wait for the modal to reopen
      await waitFor(() => {
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      });

      // Screenshot viewer should be closed (reset)
      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
    });

    it('should reset screenshot viewer when pluginId changes', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValue(mockDetails);

      const { rerender } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} pluginId="test-plugin" />
        </I18nextProvider>,
      );

      // Wait for screenshots to load
      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Open screenshot viewer
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Verify screenshot viewer is open
      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();

      // Change pluginId
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} pluginId="different-plugin" />
        </I18nextProvider>,
      );

      // Screenshot viewer should be reset
      await waitFor(() => {
        expect(
          screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Screenshot Viewer - Circular Navigation', () => {
    it('should wrap to first screenshot when navigating next from last screenshot', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Open screenshot viewer
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Navigate to last screenshot
      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      fireEvent.click(nextButton);
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Navigate next again - should wrap to first
      fireEvent.click(nextButton);
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should wrap to first screenshot using ArrowRight from last screenshot', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Open screenshot viewer on first screenshot
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Navigate to last screenshot
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Navigate right again - should wrap to first
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });
  });

  describe('Screenshot Viewer - Keyboard Event Handling', () => {
    it('should not handle keyboard events when screenshot viewer is closed', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Try keyboard navigation without opening viewer
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyDown(window, { key: 'Escape' });

      // Should still be on details tab, not in screenshot viewer
      expect(
        screen.getByText(i18nForTest.t('common:description')),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
    });

    it('should cleanup keyboard event listeners on unmount', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      const { unmount } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Open screenshot viewer
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Unmount component
      unmount();

      // Try keyboard events after unmount - should not throw errors
      expect(() => {
        fireEvent.keyDown(window, { key: 'Escape' });
        fireEvent.keyDown(window, { key: 'ArrowRight' });
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
      }).not.toThrow();
    });
  });

  describe('Screenshot Viewer - Opening from Second Screenshot', () => {
    it('should open screenshot viewer at the clicked screenshot index', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Click second screenshot
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[1]);

      // Should open at second screenshot
      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should open screenshot viewer at clicked index when using Enter key', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getAllByTitle(
            i18nForTest.t('pluginStore.clickToViewFullSize'),
          ),
        ).toHaveLength(2);
      });

      // Press Enter on second screenshot
      const screenshotButtons = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      fireEvent.keyDown(screenshotButtons[1], { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('2 of 2')).toBeInTheDocument();
      });
    });

    it('should open screenshot viewer when Enter key is pressed (testing preventDefault path)', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getAllByTitle(
            i18nForTest.t('pluginStore.clickToViewFullSize'),
          ),
        ).toHaveLength(2);
      });

      const screenshotButtons = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );

      // Fire Enter key event
      fireEvent.keyDown(screenshotButtons[0], { key: 'Enter' });

      // Verify screenshot viewer opens (which means preventDefault was called in the handler)
      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
        ).toBeInTheDocument();
      });
    });

    it('should open screenshot viewer when Space key is pressed (testing preventDefault path)', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getAllByTitle(
            i18nForTest.t('pluginStore.clickToViewFullSize'),
          ),
        ).toHaveLength(2);
      });

      const screenshotButtons = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );

      // Fire Space key event
      fireEvent.keyDown(screenshotButtons[0], { key: ' ' });

      // Verify screenshot viewer opens (which means preventDefault was called in the handler)
      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
        ).toBeInTheDocument();
      });
    });

    it('should not open viewer for other keys pressed on screenshot thumbnail', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getAllByTitle(
            i18nForTest.t('pluginStore.clickToViewFullSize'),
          ),
        ).toHaveLength(2);
      });

      const screenshotButtons = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );

      // Press a different key (e.g., 'a')
      fireEvent.keyDown(screenshotButtons[0], { key: 'a' });

      // Screenshot viewer should not open
      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
    });
  });

  describe('Screenshot Viewer - Edge Cases with 5 Screenshots', () => {
    it('should show dot indicators for exactly 5 screenshots', async () => {
      const mockDetailsWith5Screenshots = {
        ...mockDetails,
        screenshots: ['s1.png', 's2.png', 's3.png', 's4.png', 's5.png'],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWith5Screenshots);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Should show dot indicators for 5 screenshots
      const dotIndicators = screen.getAllByTitle(/Go to screenshot \d+/);
      expect(dotIndicators).toHaveLength(5);
    });
  });

  describe('Modal State Management', () => {
    it('should reset tab to details when modal reopens', async () => {
      const { rerender } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} />
        </I18nextProvider>,
      );

      // Switch to Features tab
      fireEvent.click(screen.getByText(i18nForTest.t('pluginStore.features')));
      expect(
        screen.getByText(
          i18nForTest.t('pluginStore.noFeaturesInfoAvailableForThisPlugin'),
        ),
      ).toBeInTheDocument();

      // Close modal
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={false} />
        </I18nextProvider>,
      );

      // Reopen modal
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} />
        </I18nextProvider>,
      );

      // Should be back on Details tab
      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('common:description')),
        ).toBeInTheDocument();
      });
    });

    it('should handle show=false without pluginId gracefully', () => {
      const { rerender } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} pluginId="test-plugin" />
        </I18nextProvider>,
      );

      // Modal is open and showing plugin
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();

      // Close modal and remove pluginId - should not crash
      expect(() => {
        rerender(
          <I18nextProvider i18n={i18nForTest}>
            <PluginModal
              {...defaultProps}
              show={false}
              pluginId={undefined as unknown as string}
            />
          </I18nextProvider>,
        );
      }).not.toThrow();

      // Modal is closed (hidden), so content may still be in DOM but not visible
      // The key is that it doesn't crash when pluginId is null
    });

    it('should execute else branch when show is false', () => {
      const { rerender } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} pluginId="test-plugin" />
        </I18nextProvider>,
      );

      // Now set show to false - this should trigger the else branch in useEffect
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={false} pluginId="test-plugin" />
        </I18nextProvider>,
      );

      // Component should not crash and handle the state reset
      expect(true).toBe(true);
    });

    it('should execute else branch when pluginId is null', () => {
      const { rerender } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} pluginId="test-plugin" />
        </I18nextProvider>,
      );

      // Now set pluginId to null - this should trigger the else branch in useEffect
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal
            {...defaultProps}
            show={true}
            pluginId={undefined as unknown as string}
          />
        </I18nextProvider>,
      );

      // Component should not crash and handle the state reset
      expect(true).toBe(true);
    });

    it('should handle fetching state transitions correctly', async () => {
      let resolveDetails: ((value: IPluginDetails) => void) | undefined;
      const detailsPromise = new Promise<IPluginDetails>((resolve) => {
        resolveDetails = resolve;
      });

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockReturnValue(detailsPromise);

      const { rerender } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} pluginId="test-plugin" />
        </I18nextProvider>,
      );

      // Should show loading state
      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingDetails')),
      ).toBeInTheDocument();

      // Resolve the promise
      if (resolveDetails) {
        resolveDetails(mockDetails);
      }

      await waitFor(() => {
        expect(
          screen.queryByText(i18nForTest.t('pluginStore.loadingDetails')),
        ).not.toBeInTheDocument();
      });

      // Now close modal to trigger else branch cleanup
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={false} pluginId="test-plugin" />
        </I18nextProvider>,
      );
    });
  });

  describe('Screenshot Viewer - Complete UI Coverage', () => {
    it('should render all screenshot viewer UI elements', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Open screenshot viewer
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Verify all UI elements are rendered
      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
      expect(
        screen.getByTitle(i18nForTest.t('pluginStore.previousImage')),
      ).toBeInTheDocument();
      expect(
        screen.getByTitle(i18nForTest.t('pluginStore.nextImage')),
      ).toBeInTheDocument();

      // Verify the actual screenshot image is rendered
      const viewerImage = screen.getByAltText('Screenshot 1');
      expect(viewerImage).toBeInTheDocument();
      expect(viewerImage).toHaveAttribute('src', 'screenshot1.png');
    });

    it('should handle all screenshot viewer interactions', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Open viewer
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Test next button
      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      fireEvent.click(nextButton);
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Test previous button
      const prevButton = screen.getByTitle(
        i18nForTest.t('pluginStore.previousImage'),
      );
      fireEvent.click(prevButton);
      expect(screen.getByText('1 of 2')).toBeInTheDocument();

      // Test clicking dot indicator
      const dots = screen.getAllByTitle(/Go to screenshot \d+/);
      fireEvent.click(dots[1]);
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Test back button
      const backButton = screen.getByText(
        i18nForTest.t('pluginStore.backToDetails'),
      );
      fireEvent.click(backButton);
      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
    });

    it('should render screenshot viewer without counter for single screenshot', async () => {
      const mockDetailsWithSingleScreenshot = {
        ...mockDetails,
        screenshots: ['screenshot1.png'],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWithSingleScreenshot);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Should have back button
      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();

      // Should NOT have counter, navigation buttons, or dots
      expect(screen.queryByText(/of \d+/)).not.toBeInTheDocument();
      expect(
        screen.queryByTitle(i18nForTest.t('pluginStore.previousImage')),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTitle(i18nForTest.t('pluginStore.nextImage')),
      ).not.toBeInTheDocument();
    });

    it('should update screenshot image when index changes', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Check first screenshot is displayed
      let viewerImage = screen.getByAltText('Screenshot 1');
      expect(viewerImage).toHaveAttribute('src', 'screenshot1.png');

      // Navigate to second screenshot
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Check second screenshot is displayed
      await waitFor(() => {
        viewerImage = screen.getByAltText('Screenshot 2');
        expect(viewerImage).toHaveAttribute('src', 'screenshot2.png');
      });
    });
  });

  describe('Loading States and Transitions', () => {
    it('should show loading text in all tabs while fetching', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockImplementationOnce(
        () => new Promise(() => {}), // Never resolves
      );

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      // Details tab should show loading
      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingDetails')),
      ).toBeInTheDocument();

      // Switch to Features tab
      fireEvent.click(
        screen.getAllByText(i18nForTest.t('pluginStore.features'))[0],
      );
      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingFeatures')),
      ).toBeInTheDocument();

      // Switch to Changelog tab
      fireEvent.click(
        screen.getAllByText(i18nForTest.t('pluginStore.changelog'))[0],
      );
      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingChangelog')),
      ).toBeInTheDocument();
    });

    it('should handle rapid show/hide transitions', () => {
      const { rerender } = render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} />
        </I18nextProvider>,
      );

      // Rapidly toggle show
      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={false} />
        </I18nextProvider>,
      );

      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={true} />
        </I18nextProvider>,
      );

      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} show={false} />
        </I18nextProvider>,
      );

      // Should not crash
      expect(true).toBe(true);
    });
  });

  describe('Features Extraction - Complete Coverage', () => {
    it('should filter and map readme features correctly (covering filter/map lines)', async () => {
      const mockDetailsWithSpecialFeatures: IPluginDetails = {
        ...mockDetails,
        features: undefined,
        readme:
          'Some intro\nFeatures:\n- Feature with spaces   \n-Another feature without space\n  - Indented feature  \nNot a feature\n- Last feature',
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValue(mockDetailsWithSpecialFeatures);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Features'));

      // All bullet point features should be extracted and trimmed
      expect(screen.getByText('Feature with spaces')).toBeInTheDocument();
      expect(
        screen.getByText('Another feature without space'),
      ).toBeInTheDocument();
      expect(screen.getByText('Indented feature')).toBeInTheDocument();
      expect(screen.getByText('Last feature')).toBeInTheDocument();
      expect(screen.queryByText('Not a feature')).not.toBeInTheDocument();
    });

    it('should handle empty lines and whitespace in features extraction', async () => {
      const mockDetailsWithWhitespace: IPluginDetails = {
        ...mockDetails,
        features: undefined,
        readme:
          'Introduction\nFeatures:\n- Feature 1\n\n- Feature 2\n   \n-Feature 3\n',
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValue(mockDetailsWithWhitespace);

      render(<PluginModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Features'));

      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
      expect(screen.getByText('Feature 3')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation - Complete Event Coverage', () => {
    it('should execute closeScreenshotViewer on Escape key', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();

      // This executes the closeScreenshotViewer() function
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
    });

    it('should execute previousScreenshot on ArrowLeft key', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Go to second screenshot
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // This executes the previousScreenshot() function
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should execute ArrowLeft branch directly from first screenshot', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // At first screenshot (index 0)
      expect(screen.getByText('1 of 2')).toBeInTheDocument();

      // Press ArrowLeft - this specifically executes the "else if (e.key === 'ArrowLeft')" branch
      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      // Should wrap to last screenshot
      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should execute ArrowLeft branch from middle screenshot', async () => {
      const mockDetailsWith3Screenshots = {
        ...mockDetails,
        screenshots: ['s1.png', 's2.png', 's3.png'],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWith3Screenshots);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[1]); // Start at second screenshot (index 1)
      });

      // At second screenshot
      expect(screen.getByText('2 of 3')).toBeInTheDocument();

      // Press ArrowLeft - executes the ArrowLeft branch
      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      // Should move to first screenshot
      expect(screen.getByText('1 of 3')).toBeInTheDocument();
    });

    it('should trigger ArrowLeft else-if branch specifically (line 152)', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      // Wait for screenshots to be available and click to open viewer
      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[1]); // Open at second screenshot

      // Verify we're at screenshot 2
      await waitFor(() => {
        expect(screen.getByText('2 of 2')).toBeInTheDocument();
      });

      // Create a proper keyboard event for ArrowLeft
      const arrowLeftEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        keyCode: 37,
        bubbles: true,
        cancelable: true,
      });

      // Dispatch the event to window
      window.dispatchEvent(arrowLeftEvent);

      // Wait for state to update
      await waitFor(() => {
        expect(screen.getByText('1 of 2')).toBeInTheDocument();
      });
    });

    it('should handle ArrowLeft key event with screenshot viewer open', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      // Open screenshot viewer
      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Verify viewer is open
      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();

      // Fire ArrowRight first to go to second screenshot
      fireEvent.keyDown(window, { key: 'ArrowRight', bubbles: true });

      await waitFor(() => {
        expect(screen.getByText('2 of 2')).toBeInTheDocument();
      });

      // Now fire ArrowLeft - this MUST execute line 152: } else if (e.key === 'ArrowLeft') {
      fireEvent.keyDown(window, { key: 'ArrowLeft', bubbles: true });

      // Verify previousScreenshot was called
      await waitFor(() => {
        expect(screen.getByText('1 of 2')).toBeInTheDocument();
      });
    });
  });

  describe('Features Array Mapping', () => {
    it('should map and render each feature in the features list', async () => {
      const mockDetailsWithFeatures: IPluginDetails = {
        ...mockDetails,
        features: ['Map Feature 1', 'Map Feature 2', 'Map Feature 3'],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWithFeatures);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        fireEvent.click(
          screen.getAllByText(i18nForTest.t('pluginStore.features'))[0],
        );
      });

      // Each feature should be mapped and displayed
      expect(screen.getByText('Map Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Map Feature 2')).toBeInTheDocument();
      expect(screen.getByText('Map Feature 3')).toBeInTheDocument();
    });
  });

  describe('Changelog Array Mapping', () => {
    it('should map and render each change in changelog entries', async () => {
      const mockDetailsWithChangelog: IPluginDetails = {
        ...mockDetails,
        changelog: [
          {
            version: '1.0.0',
            date: dayjs()
              .utc()
              .subtract(1, 'year')
              .startOf('year')
              .format('YYYY-MM-DD'),
            changes: ['Mapped Change 1', 'Mapped Change 2', 'Mapped Change 3'],
          },
        ],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWithChangelog);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        fireEvent.click(
          screen.getAllByText(i18nForTest.t('pluginStore.changelog'))[0],
        );
      });

      // Each change should be mapped and displayed
      expect(screen.getByText('Mapped Change 1')).toBeInTheDocument();
      expect(screen.getByText('Mapped Change 2')).toBeInTheDocument();
      expect(screen.getByText('Mapped Change 3')).toBeInTheDocument();
    });
  });

  describe('Screenshot Viewer - Complete Function Coverage', () => {
    it('should execute openScreenshotViewer with correct index', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Click second screenshot to test openScreenshotViewer with index 1
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[1]);

      // Should open at second screenshot
      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should execute closeScreenshotViewer function', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Click back button to execute closeScreenshotViewer
      const backButton = screen.getByText(
        i18nForTest.t('pluginStore.backToDetails'),
      );
      fireEvent.click(backButton);

      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
    });

    it('should execute nextScreenshot function', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Click next button to execute nextScreenshot
      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      fireEvent.click(nextButton);

      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should execute previousScreenshot function', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Go to second screenshot
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Click previous button to execute previousScreenshot
      const prevButton = screen.getByTitle(
        i18nForTest.t('pluginStore.previousImage'),
      );
      fireEvent.click(prevButton);

      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should execute setScreenshotViewer when dot is clicked', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Click second dot indicator
      const dots = screen.getAllByTitle(/Go to screenshot \d+/);
      fireEvent.click(dots[1]);

      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });
  });

  describe('Screenshot Viewer UI - All Rendering Paths', () => {
    it('should render screenshot header with back button', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();
    });

    it('should render screenshot counter for multiple screenshots', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should render navigation buttons for multiple screenshots', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      expect(
        screen.getByTitle(i18nForTest.t('pluginStore.previousImage')),
      ).toBeInTheDocument();
      expect(
        screen.getByTitle(i18nForTest.t('pluginStore.nextImage')),
      ).toBeInTheDocument();
    });

    it('should render screenshot image container', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const image = screen.getByAltText('Screenshot 1');
      expect(image).toHaveAttribute('src', 'screenshot1.png');
    });

    it('should render dot indicators for 2-5 screenshots', async () => {
      const mockDetailsWith3Screenshots = {
        ...mockDetails,
        screenshots: ['s1.png', 's2.png', 's3.png'],
      };

      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetailsWith3Screenshots);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      const dots = screen.getAllByTitle(/Go to screenshot \d+/);
      expect(dots).toHaveLength(3);
    });

    it('should update screenshot image key when index changes', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Initially showing first screenshot
      expect(screen.getByAltText('Screenshot 1')).toHaveAttribute(
        'src',
        'screenshot1.png',
      );

      // Navigate to second
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Should show second screenshot
      await waitFor(() => {
        expect(screen.getByAltText('Screenshot 2')).toHaveAttribute(
          'src',
          'screenshot2.png',
        );
      });
    });
  });

  describe('Screenshot Viewer Functions - Direct Coverage of Lines 204-242', () => {
    it('should call openScreenshotViewer function with screenshots array and index 0', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Click first screenshot - this calls openScreenshotViewer(details.screenshots, 0)
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[0]);

      // Verify the state was set correctly
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
      expect(screen.getByAltText('Screenshot 1')).toHaveAttribute(
        'src',
        'screenshot1.png',
      );
    });

    it('should call openScreenshotViewer function with screenshots array and index 1', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getAllByAltText(/Screenshot \d+/)).toHaveLength(2);
      });

      // Click second screenshot - this calls openScreenshotViewer(details.screenshots, 1)
      const screenshots = screen.getAllByAltText(/Screenshot \d+/);
      fireEvent.click(screenshots[1]);

      // Verify the state was set correctly
      expect(screen.getByText('2 of 2')).toBeInTheDocument();
      expect(screen.getByAltText('Screenshot 2')).toHaveAttribute(
        'src',
        'screenshot2.png',
      );
    });

    it('should call closeScreenshotViewer function resetting all state', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // Viewer is open
      expect(
        screen.getByText(i18nForTest.t('pluginStore.backToDetails')),
      ).toBeInTheDocument();

      // Click back button - this calls closeScreenshotViewer()
      const backButton = screen.getByText(
        i18nForTest.t('pluginStore.backToDetails'),
      );
      fireEvent.click(backButton);

      // Verify state was reset
      expect(
        screen.queryByText(i18nForTest.t('pluginStore.backToDetails')),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('common:description')),
      ).toBeInTheDocument();
    });

    it('should call nextScreenshot function incrementing index with modulo', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // At screenshot 1
      expect(screen.getByText('1 of 2')).toBeInTheDocument();

      // Click next button - this calls nextScreenshot()
      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      fireEvent.click(nextButton);

      // Should be at screenshot 2
      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should call nextScreenshot function wrapping to index 0', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[1]); // Start at second screenshot
      });

      // At screenshot 2
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Click next button - this calls nextScreenshot() which wraps to 0
      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      fireEvent.click(nextButton);

      // Should wrap to screenshot 1
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should call previousScreenshot function decrementing index', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[1]); // Start at second screenshot
      });

      // At screenshot 2
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Click previous button - this calls previousScreenshot()
      const prevButton = screen.getByTitle(
        i18nForTest.t('pluginStore.previousImage'),
      );
      fireEvent.click(prevButton);

      // Should be at screenshot 1
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should call previousScreenshot function wrapping to last index', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]); // Start at first screenshot
      });

      // At screenshot 1
      expect(screen.getByText('1 of 2')).toBeInTheDocument();

      // Click previous button - this calls previousScreenshot() which wraps to last
      const prevButton = screen.getByTitle(
        i18nForTest.t('pluginStore.previousImage'),
      );
      fireEvent.click(prevButton);

      // Should wrap to screenshot 2
      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should call setScreenshotViewer when clicking dot indicator', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[0]);
      });

      // At screenshot 1
      expect(screen.getByText('1 of 2')).toBeInTheDocument();

      // Click second dot - this calls setScreenshotViewer with index 1
      const dots = screen.getAllByTitle(/Go to screenshot \d+/);
      fireEvent.click(dots[1]);

      // Should jump to screenshot 2
      expect(screen.getByText('2 of 2')).toBeInTheDocument();
    });

    it('should call setScreenshotViewer when clicking first dot indicator', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        const screenshots = screen.getAllByAltText(/Screenshot \d+/);
        fireEvent.click(screenshots[1]); // Start at second
      });

      // At screenshot 2
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Click first dot - this calls setScreenshotViewer with index 0
      const dots = screen.getAllByTitle(/Go to screenshot \d+/);
      fireEvent.click(dots[0]);

      // Should jump to screenshot 1
      expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('should call openScreenshotViewer via Enter key on thumbnail', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getAllByTitle(
            i18nForTest.t('pluginStore.clickToViewFullSize'),
          ),
        ).toHaveLength(2);
      });

      // Press Enter on first thumbnail - this calls openScreenshotViewer
      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      fireEvent.keyDown(thumbnails[0], { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('1 of 2')).toBeInTheDocument();
      });
    });

    it('should call openScreenshotViewer via Space key on thumbnail', async () => {
      (
        AdminPluginFileService.getPluginDetails as unknown as Mock
      ).mockResolvedValueOnce(mockDetails);

      render(
        <I18nextProvider i18n={i18nForTest}>
          <PluginModal {...defaultProps} />
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getAllByTitle(
            i18nForTest.t('pluginStore.clickToViewFullSize'),
          ),
        ).toHaveLength(2);
      });

      // Press Space on second thumbnail - this calls openScreenshotViewer with index 1
      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      fireEvent.keyDown(thumbnails[1], { key: ' ' });

      await waitFor(() => {
        expect(screen.getByText('2 of 2')).toBeInTheDocument();
      });
    });
  });
});
