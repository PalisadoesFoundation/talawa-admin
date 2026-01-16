import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UninstallConfirmationModal from './UninstallConfirmationModal';
import type { IPluginMeta } from 'plugin';

// 1. Mock Translations
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

  const defaultProps = {
    show: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    plugin: mockPlugin,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- RENDERING TESTS ---
  it('should render modal correctly', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);
    expect(screen.getByText('Uninstall Plugin')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to uninstall Test Plugin?')).toBeInTheDocument();
  });

  // --- INTERACTION TESTS ---
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

  // --- CRITICAL FIX: RAPID CLICK TEST ---
  it('should prevent multiple submissions (rapid-click protection)', async () => {
    mockOnConfirm.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<UninstallConfirmationModal {...defaultProps} />);

    const removeButton = screen.getByTestId('uninstall-remove-btn');
    fireEvent.click(removeButton);

    // Wait for disable
    await waitFor(() => {
      expect(removeButton).toBeDisabled();
    });

    // Try second click
    fireEvent.click(removeButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  // --- CRITICAL FIX: ERROR HANDLING TEST (Requested by CoderRabbit) ---
  it('should unlock the button if uninstallation fails', async () => {
    // Simulate an error
    mockOnConfirm.mockRejectedValue(new Error('API Failed'));
    
    render(<UninstallConfirmationModal {...defaultProps} />);
    const removeButton = screen.getByTestId('uninstall-remove-btn');

    // Click to start
    fireEvent.click(removeButton);

    // Should be disabled initially
    await waitFor(() => {
      expect(removeButton).toBeDisabled();
    });

    // Wait for the error handling to finish and button to re-enable
    await waitFor(() => {
      expect(removeButton).not.toBeDisabled();
    });
  });

}); 
// End of file - ensure no extra braces below here!