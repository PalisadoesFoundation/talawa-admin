import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UninstallConfirmationModal from './UninstallConfirmationModal';
import type { IPluginMeta } from 'plugin';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      const translations: Record<string, string> = {
        uninstallPluginTitle: 'Uninstall Plugin',
        uninstallConfirmationTitle: 'Are you sure you want to uninstall {{name}}?',
        uninstallConfirmationDescription:
          'This action will permanently remove the plugin and all its data. This cannot be undone.',
        cancelButton: 'Cancel',
        removePermanentlyButton: 'Remove Permanently',
      };
      let translation = translations[key] || key;
      if (options?.name) {
        translation = translation.replace('{{name}}', options.name);
      }
      return translation;
    },
  }),
}));

describe('UninstallConfirmationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const user = userEvent.setup();

  const mockPlugin: IPluginMeta = {
    id: 'test-plugin',
    name: 'Test Plugin',
    author: 'Test Author',
    description: 'A test plugin description',
    icon: 'test-icon.png',
  };

  const defaultProps = {
    show: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    plugin: mockPlugin,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when show is true', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
      expect(screen.getByText('Uninstall Plugin')).toBeInTheDocument();
    });

    it('should not render modal when show is false', () => {
      render(<UninstallConfirmationModal {...defaultProps} show={false} />);

      expect(screen.queryByTestId('uninstall-modal')).not.toBeInTheDocument();
    });

    it('should display plugin name in confirmation message', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      expect(
        screen.getByText(/Are you sure you want to uninstall Test Plugin\?/),
      ).toBeInTheDocument();
    });

    it('should display warning message about permanent removal', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      expect(
        screen.getByText(
          /This action will permanently remove the plugin and all its data/,
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(/cannot be undone/)).toBeInTheDocument();
    });

    it('should render cancel and confirm buttons', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      expect(screen.getByTestId('uninstall-cancel-btn')).toBeInTheDocument();
      expect(screen.getByTestId('uninstall-remove-btn')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Remove Permanently')).toBeInTheDocument();
    });

    it('should handle null plugin gracefully', () => {
      render(<UninstallConfirmationModal {...defaultProps} plugin={null} />);

      expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to uninstall/),
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when cancel button is clicked', async () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      const cancelButton = screen.getByTestId('uninstall-cancel-btn');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when remove button is clicked', async () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      const removeButton = screen.getByTestId('uninstall-remove-btn');
      await user.click(removeButton);

      await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose when close button (header) is clicked', async () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      // BaseModal (Bootstrap) renders a close button in the header with label "Close"
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      const cancelButton = screen.getByTestId('uninstall-cancel-btn');
      const removeButton = screen.getByTestId('uninstall-remove-btn');

      expect(cancelButton).toHaveAccessibleName('Cancel');
      expect(removeButton).toHaveAccessibleName('Remove Permanently');
    });

    it('should have dialog role', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Modal State Transitions', () => {
    it('should handle modal state transitions correctly', async () => {
      const { rerender } = render(
        <UninstallConfirmationModal {...defaultProps} show={true} />,
      );

      expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();

      rerender(<UninstallConfirmationModal {...defaultProps} show={false} />);

      await waitFor(() => {
        expect(screen.queryByTestId('uninstall-modal')).not.toBeInTheDocument();
      });
    });

    it('should display updated plugin name when plugin changes', () => {
      const { rerender } = render(
        <UninstallConfirmationModal {...defaultProps} />,
      );

      expect(
        screen.getByText(/Are you sure you want to uninstall Test Plugin\?/),
      ).toBeInTheDocument();

      const newPlugin: IPluginMeta = {
        ...mockPlugin,
        name: 'Another Plugin',
      };

      rerender(
        <UninstallConfirmationModal {...defaultProps} plugin={newPlugin} />,
      );

      expect(
        screen.getByText(/Are you sure you want to uninstall Another Plugin\?/),
      ).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should handle rapid button clicks correctly', async () => {
      render(<UninstallConfirmationModal {...defaultProps} />);

      const cancelButton = screen.getByTestId('uninstall-cancel-btn');
      const removeButton = screen.getByTestId('uninstall-remove-btn');

      // Simulate rapid clicks
      await user.click(removeButton);
      await user.click(cancelButton);
      await user.click(removeButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(2);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
