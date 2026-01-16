import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UninstallConfirmationModal from './UninstallConfirmationModal';
import type { IPluginMeta } from 'plugin';
// 👇 Updated Import
import { InterfaceUninstallConfirmationModalProps } from 'types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface';

// Mock Translations
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
  } as any;

  const defaultProps: InterfaceUninstallConfirmationModalProps = {
    show: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    plugin: mockPlugin,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Basic Rendering
  it('should render modal correctly with plugin name', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);
    expect(screen.getByText('Uninstall Plugin')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to uninstall Test Plugin?')).toBeInTheDocument();
    expect(screen.getByText('Remove Permanently')).toBeInTheDocument();
  });

  // 2. Interaction: Close
  it('should call onClose when cancel button is clicked', async () => {
    render(<UninstallConfirmationModal {...defaultProps} />);
    const cancelBtn = screen.getByTestId('uninstall-cancel-btn');
    await user.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // 3. Interaction: Confirm Success
  it('should call onConfirm when remove button is clicked', async () => {
    render(<UninstallConfirmationModal {...defaultProps} />);
    const removeBtn = screen.getByTestId('uninstall-remove-btn');
    await user.click(removeBtn);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  // 4. State: Loading State (Rapid Click Protection)
  it('should disable buttons and show "Deleting..." text while processing', async () => {
    // Mock a slow promise to simulate API call
    mockOnConfirm.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 500)));
    render(<UninstallConfirmationModal {...defaultProps} />);

    const removeBtn = screen.getByTestId('uninstall-remove-btn');
    const cancelBtn = screen.getByTestId('uninstall-cancel-btn');

    // Click to start process
    await user.click(removeBtn);

    // Assert Loading State
    expect(removeBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
    expect(screen.getByText('Deleting...')).toBeInTheDocument();

    // Ensure it cannot be clicked again
    await user.click(removeBtn);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1); // Still 1 call
  });

  // 5. State: Error Handling (The Missing Test Case)
  it('should re-enable buttons if uninstallation fails', async () => {
    // Mock an error
    mockOnConfirm.mockRejectedValueOnce(new Error('API Failure'));
    render(<UninstallConfirmationModal {...defaultProps} />);

    const removeBtn = screen.getByTestId('uninstall-remove-btn');

    // Click to trigger error flow
    await user.click(removeBtn);

    // Wait for button to be re-enabled
    await waitFor(() => {
      expect(removeBtn).not.toBeDisabled();
      expect(screen.getByText('Remove Permanently')).toBeInTheDocument();
    });
  });
});