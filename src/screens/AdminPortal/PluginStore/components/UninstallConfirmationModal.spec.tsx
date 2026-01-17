/*
 * Copyright 2025 Palisadoes Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Test Suite for UninstallConfirmationModal
 *
 * This file contains unit tests to verify:
 * 1. Rendering of the confirmation message and buttons.
 * 2. Conditional rendering based on the 'show' and 'plugin' props.
 * 3. Handling of the 'Confirm' and 'Cancel' actions.
 * 4. Loading state behavior (disabling buttons while processing).
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UninstallConfirmationModal from './UninstallConfirmationModal';
import type { IPluginMeta } from 'plugin';
import { InterfaceUninstallConfirmationModalProps } from 'types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface';

// Mock Translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      const translations: Record<string, string> = {
        'uninstallPlugin.title': 'Uninstall Plugin',
        'uninstallPlugin.message': `Are you sure you want to uninstall ${options?.name}?`,
        'uninstallPlugin.warning':
          'This action will permanently remove the plugin and all its data. This action cannot be undone.',
        cancel: 'Cancel',
        'uninstallPlugin.removeBtn': 'Remove Permanently',
        deleting: 'Deleting...',
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

  // 4. State: Loading State
  it('should disable buttons and show "Deleting..." text while processing', async () => {
    mockOnConfirm.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 500)),
    );
    render(<UninstallConfirmationModal {...defaultProps} />);

    const removeBtn = screen.getByTestId('uninstall-remove-btn');
    const cancelBtn = screen.getByTestId('uninstall-cancel-btn');

    await user.click(removeBtn);

    expect(removeBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
    expect(screen.getByText('Deleting...')).toBeInTheDocument();

    await user.click(removeBtn);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  // 5. State: Error Handling
  it('should re-enable buttons if uninstallation fails', async () => {
    mockOnConfirm.mockRejectedValueOnce(new Error('API Failure'));
    render(<UninstallConfirmationModal {...defaultProps} />);

    const removeBtn = screen.getByTestId('uninstall-remove-btn');
    await user.click(removeBtn);

    await waitFor(() => {
      expect(removeBtn).not.toBeDisabled();
      expect(screen.getByText('Remove Permanently')).toBeInTheDocument();
    });
  });

  // 6. Branch: Null Plugin
  it('should not render if plugin is null', () => {
    const { container } = render(
      <UninstallConfirmationModal {...defaultProps} plugin={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  // 7. Branch: Modal Closed
  it('should not render if show is false', () => {
    const { container } = render(
      <UninstallConfirmationModal {...defaultProps} show={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
