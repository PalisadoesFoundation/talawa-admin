import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    readme: 'Features:\n- Feature from readme\n- Another feature\n\n## Other',
    features: ['Feature 1', 'Feature 2'],
    changelog: [
      {
        version: '1.2.3',
        date: dayjs.utc().subtract(1, 'year').format('YYYY-MM-DD'),
        changes: ['Fixed bug X', 'Added feature Y'],
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

  const renderModal = (props = {}) =>
    render(
      <I18nextProvider i18n={i18nForTest}>
        <PluginModal {...defaultProps} {...props} />
      </I18nextProvider>,
    );

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Display and Basic Interactions', () => {
    it('renders modal with plugin info and handles close', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      });

      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(
        screen.getByAltText(i18nForTest.t('pluginStore.pluginIcon')),
      ).toBeInTheDocument();

      // Close button (from CRUDModalTemplate)
      const closeButton = screen.getByTestId('modalCloseBtn');
      await user.click(closeButton);
      expect(defaultProps.onHide).toHaveBeenCalled();
    });

    it('does not render when show is false', () => {
      renderModal({ show: false });
      expect(screen.queryByText('Test Plugin')).not.toBeInTheDocument();
    });

    it('resets state when modal closes (show=false, no pluginId)', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const { rerender } = renderModal();

      await waitFor(() => {
        expect(screen.getByText('Test Plugin')).toBeInTheDocument();
      });

      await act(async () => {
        rerender(
          <I18nextProvider i18n={i18nForTest}>
            <PluginModal {...defaultProps} show={false} pluginId={null} />
          </I18nextProvider>,
        );
      });

      expect(screen.queryByText('v1.2.3')).not.toBeInTheDocument();
    });
  });

  describe('Plugin Details Loading', () => {
    it('loads and displays plugin details with version', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      expect(AdminPluginFileService.getPluginDetails).toHaveBeenCalledWith(
        'test-plugin',
      );
    });

    it('handles loading error with toast notification', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockRejectedValue(new Error('Network error'));

      renderModal();

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Tab Navigation', () => {
    it('switches between all tabs and displays correct content', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      // Default: Details tab
      expect(screen.getByText('Description')).toBeInTheDocument();

      // Features tab
      await user.click(screen.getByText(i18nForTest.t('pluginStore.features')));
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();

      // Changelog tab
      await user.click(screen.getByRole('tab', { name: 'Changelog' }));
      expect(screen.getByText('Fixed bug X')).toBeInTheDocument();
      expect(screen.getByText('Added feature Y')).toBeInTheDocument();
    });

    it('shows no features message when features array is empty', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        ...mockDetails,
        features: [],
        readme: '',
      });
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      await user.click(screen.getByText(i18nForTest.t('pluginStore.features')));
      expect(
        screen.getByText(
          i18nForTest.t('pluginStore.noFeaturesInfoAvailableForThisPlugin'),
        ),
      ).toBeInTheDocument();
    });

    it('extracts features from readme when features array is not provided', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        ...mockDetails,
        features: undefined,
        readme:
          'Features:\n- Readme Feature 1\n- Readme Feature 2\nOther content',
      });
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      await user.click(screen.getByText(i18nForTest.t('pluginStore.features')));
      expect(screen.getByText('Readme Feature 1')).toBeInTheDocument();
    });
  });

  describe('Plugin Actions', () => {
    it('shows Install button and calls installPlugin for non-installed plugin', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.install')),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByText(i18nForTest.t('pluginStore.install')));
      expect(defaultProps.installPlugin).toHaveBeenCalledWith(mockMeta);
    });

    it('shows installing text with elapsed time when loading', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      renderModal({ loading: true });

      await waitFor(() => {
        expect(screen.getByText(/Installing/i)).toBeInTheDocument();
      });
    });

    it('shows Deactivate/Uninstall for active installed plugin', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      const installedProps = {
        isInstalled: vi.fn().mockReturnValue(true),
        getInstalledPlugin: vi.fn().mockReturnValue({ status: 'active' }),
      };

      renderModal(installedProps);

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.deactivate')),
        ).toBeInTheDocument();
      });

      // StatusBadge should show active
      expect(screen.getByTestId('plugin-status-badge')).toBeInTheDocument();

      // Toggle to inactive
      await user.click(
        screen.getByText(i18nForTest.t('pluginStore.deactivate')),
      );
      expect(defaultProps.togglePluginStatus).toHaveBeenCalledWith(
        mockMeta,
        'inactive',
      );

      // Uninstall
      await user.click(
        screen.getByText(i18nForTest.t('pluginStore.uninstall')),
      );
      expect(defaultProps.uninstallPlugin).toHaveBeenCalledWith(mockMeta);
    });

    it('shows Activate for inactive installed plugin', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      const installedProps = {
        isInstalled: vi.fn().mockReturnValue(true),
        getInstalledPlugin: vi.fn().mockReturnValue({ status: 'inactive' }),
      };

      renderModal(installedProps);

      await waitFor(() => {
        expect(
          screen.getByText(i18nForTest.t('pluginStore.activate')),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByText(i18nForTest.t('pluginStore.activate')));
      expect(defaultProps.togglePluginStatus).toHaveBeenCalledWith(
        mockMeta,
        'active',
      );
    });
  });

  describe('Screenshot Viewer', () => {
    it('opens viewer, navigates with buttons and dots, and closes', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      // Click first screenshot thumbnail
      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      await user.click(thumbnails[0]);

      // Viewer should open
      expect(screen.getByText(/Back to Details/)).toBeInTheDocument();
      expect(screen.getByText('1 of 2')).toBeInTheDocument(); // Counter shows 1 of 2

      // Navigate next
      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      await user.click(nextButton);
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Navigate previous (wraps to first)
      const prevButton = screen.getByTitle(
        i18nForTest.t('pluginStore.previousImage'),
      );
      await user.click(prevButton);
      expect(screen.getByText('1 of 2')).toBeInTheDocument();

      // Click dot indicator
      const dots = screen.getAllByTitle(/Go to screenshot/i);
      await user.click(dots[1]);
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Close viewer
      await user.click(screen.getByText(/Back to Details/));
      expect(screen.queryByText(/Back to Details/)).not.toBeInTheDocument();
    });

    it('opens viewer at specific index when clicking second screenshot', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      await user.click(thumbnails[1]); // Click second thumbnail

      expect(screen.getByText('2 of 2')).toBeInTheDocument(); // Should start at index 2
    });

    it('handles keyboard navigation in viewer (Escape, ArrowRight, ArrowLeft)', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      await user.click(thumbnails[0]);

      // ArrowRight
      await user.keyboard('{ArrowRight}');
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // ArrowLeft
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByText('1 of 2')).toBeInTheDocument();

      // ArrowLeft from first (wraps to last)
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByText('2 of 2')).toBeInTheDocument();

      // Escape closes
      await user.keyboard('{Escape}');
      expect(screen.queryByText(/Back to Details/)).not.toBeInTheDocument();
    });

    it('does not handle keyboard events when viewer is closed', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      // Press keys without opening viewer - should not crash
      await user.keyboard('{Escape}');
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowLeft}');

      // Modal should still be there
      expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single screenshot without navigation controls', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        ...mockDetails,
        screenshots: ['single.png'],
      });
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      await user.click(thumbnails[0]);

      // No navigation buttons or counter for single screenshot
      expect(
        screen.queryByTitle(i18nForTest.t('pluginStore.nextImage')),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/1.*1/)).not.toBeInTheDocument();
    });

    it('hides dot indicators for more than 5 screenshots', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        ...mockDetails,
        screenshots: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png'],
      });
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      await user.click(thumbnails[0]);

      // Navigation buttons should exist but no dots
      expect(
        screen.getByTitle(i18nForTest.t('pluginStore.nextImage')),
      ).toBeInTheDocument();
      expect(screen.queryAllByTitle(/Screenshot \d/)).toHaveLength(0);
    });

    it('shows exactly 5 dot indicators for 5 screenshots', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        ...mockDetails,
        screenshots: ['1.png', '2.png', '3.png', '4.png', '5.png'],
      });
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      await user.click(thumbnails[0]);

      const dots = screen.getAllByTitle(/Go to screenshot \d/);
      expect(dots).toHaveLength(5);
    });

    it('wraps to first screenshot when navigating next from last', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      await user.click(thumbnails[1]); // Start at last (index 1 of 2)

      const nextButton = screen.getByTitle(
        i18nForTest.t('pluginStore.nextImage'),
      );
      await user.click(nextButton);

      expect(screen.getByText('1 of 2')).toBeInTheDocument(); // Wrapped to first
    });

    it('resets tab to details when modal reopens', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      const { rerender } = renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      // Switch to Features tab
      await user.click(screen.getByText(i18nForTest.t('pluginStore.features')));
      expect(screen.getByText('Feature 1')).toBeInTheDocument();

      // Close and reopen
      await act(async () => {
        rerender(
          <I18nextProvider i18n={i18nForTest}>
            <PluginModal {...defaultProps} show={false} />
          </I18nextProvider>,
        );
      });

      await act(async () => {
        rerender(
          <I18nextProvider i18n={i18nForTest}>
            <PluginModal {...defaultProps} show={true} />
          </I18nextProvider>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Description')).toBeInTheDocument();
      });
    });

    it('handles empty changelog gracefully', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue({
        ...mockDetails,
        changelog: [],
      });
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('tab', { name: 'Changelog' }));
      // Should not crash, changelog tab should be active
      expect(
        screen.getByRole('tab', { name: 'Changelog' }),
      ).toBeInTheDocument();
    });

    it('does not open viewer for other keys pressed on screenshot thumbnail', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      thumbnails[0].focus();
      await user.keyboard('a');

      // Viewer should not open
      expect(screen.queryByText(/Back to Details/)).not.toBeInTheDocument();
    });

    it('opens viewer via Enter key on screenshot thumbnail', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      thumbnails[0].focus();
      await user.keyboard('{Enter}');

      // Viewer should open
      expect(screen.getByText(/Back to Details/)).toBeInTheDocument();
    });

    it('opens viewer via Space key on screenshot thumbnail', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      const user = userEvent.setup();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      const thumbnails = screen.getAllByTitle(
        i18nForTest.t('pluginStore.clickToViewFullSize'),
      );
      thumbnails[0].focus();
      await user.keyboard(' ');

      // Viewer should open
      expect(screen.getByText(/Back to Details/)).toBeInTheDocument();
    });

    it('shows loading text while fetching features', async () => {
      let resolveDetails: ((value: IPluginDetails) => void) | null = null;
      const detailsPromise = new Promise<IPluginDetails>((resolve) => {
        resolveDetails = resolve;
      });
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockReturnValue(detailsPromise);

      const user = userEvent.setup();
      renderModal();

      // Switch to features tab while still fetching
      await user.click(screen.getByText(i18nForTest.t('pluginStore.features')));

      // Should show loading text
      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingFeatures')),
      ).toBeInTheDocument();

      // Resolve the promise
      await act(async () => {
        if (resolveDetails) {
          resolveDetails(mockDetails);
        }
      });

      await waitFor(() => {
        expect(
          screen.queryByText(i18nForTest.t('pluginStore.loadingFeatures')),
        ).not.toBeInTheDocument();
      });
    });

    it('shows loading text while fetching changelog', async () => {
      let resolveDetails: ((value: IPluginDetails) => void) | null = null;
      const detailsPromise = new Promise<IPluginDetails>((resolve) => {
        resolveDetails = resolve;
      });
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockReturnValue(detailsPromise);

      const user = userEvent.setup();
      renderModal();

      // Switch to changelog tab while still fetching
      await user.click(screen.getByRole('tab', { name: 'Changelog' }));

      // Should show loading text
      expect(
        screen.getByText(i18nForTest.t('pluginStore.loadingChangelog')),
      ).toBeInTheDocument();

      // Resolve the promise
      await act(async () => {
        if (resolveDetails) {
          resolveDetails(mockDetails);
        }
      });

      await waitFor(() => {
        expect(
          screen.queryByText(i18nForTest.t('pluginStore.loadingChangelog')),
        ).not.toBeInTheDocument();
      });
    });

    it('renders tabpanels with correct ARIA attributes', async () => {
      (
        AdminPluginFileService.getPluginDetails as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockDetails);
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
      });

      // Check tablist and tabs have correct ARIA attributes
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();

      const detailsTab = screen.getByRole('tab', { name: 'Details' });
      expect(detailsTab).toHaveAttribute('aria-selected', 'true');
      expect(detailsTab).toHaveAttribute('aria-controls', 'panel-details');

      const featuresTab = screen.getByRole('tab', { name: 'Features' });
      expect(featuresTab).toHaveAttribute('aria-selected', 'false');
      expect(featuresTab).toHaveAttribute('aria-controls', 'panel-features');

      // Check tabpanels exist
      expect(document.getElementById('panel-details')).toBeInTheDocument();
      expect(document.getElementById('panel-features')).toBeInTheDocument();
      expect(document.getElementById('panel-changelog')).toBeInTheDocument();
    });
  });
});
