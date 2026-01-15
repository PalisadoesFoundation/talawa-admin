import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UninstallConfirmationModal from './UninstallConfirmationModal';
import type { IPluginMeta } from 'plugin';

// 1. 🛠️ Mock react-i18next to handle your specific keys
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      const translations: Record<string, string> = {
        'uninstallPlugin.title': 'Uninstall Plugin',
        'uninstallPlugin.message': `Are you sure you want to uninstall ${options?.name}?`,
        'uninstallPlugin.warning': 'This action will permanently remove the plugin and all its data. This action cannot be undone.',
        'cancel': 'Cancel',
        'uninstallPlugin.removeBtn': 'Remove Permanently',
        'deleting': 'Deleting...',
      };
      return translations[key] || key;
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
    version: '1.0.0',
    created_at: '2023-01-01',
    updated_at: '2023-01-02',
    installUrl: 'http://test.com',
  } as any; // Cast to any if IPluginMeta is strict about missing optional fields

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
      expect(screen.getByText('Uninstall Plugin')).toBeInTheDocument();
    });

    it('should not render modal when show is false', () => {
      render(<UninstallConfirmationModal {...defaultProps} show={false} />);
      expect(screen.queryByText('Uninstall Plugin')).not.toBeInTheDocument();
    });

    it('should display plugin name in confirmation message', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);
      expect(screen.getByText('Are you sure you want to uninstall Test Plugin?')).toBeInTheDocument();
    });

    it('should display warning message', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);
      expect(screen.getByText(/This action will permanently remove the plugin/)).toBeInTheDocument();
    });

    it('should render correct buttons', () => {
      render(<UninstallConfirmationModal {...defaultProps} />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Remove Permanently')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when cancel button is clicked', async () => {
      render(<UninstallConfirmationModal {...defaultProps} />);
      await user.click(screen.getByTestId('uninstall-cancel-btn'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when remove button is clicked', async () => {
      render(<UninstallConfirmationModal {...defaultProps} />);
      await user.click(screen.getByTestId('uninstall-remove-btn'));
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Rapid Click Protection (Critical Fix)', () => {
    it('should prevent multiple submissions (rapid-click protection)', async () => {
      // 1. Fake a slow API call (100ms) so the button stays disabled for a moment
      mockOnConfirm.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<UninstallConfirmationModal {...defaultProps} />);
      const removeButton = screen.getByTestId('uninstall-remove-btn');

      // 2. Click the button ONCE
      fireEvent.click(removeButton);

      // 3. WAIT for the button to become disabled
      await waitFor(() => {
        expect(removeButton).toBeDisabled();
      });

      // 4. Try to Click AGAIN (while it is disabled)
      fireEvent.click(removeButton);

      // 5. Success! The function should still have been called only ONCE
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });
  });