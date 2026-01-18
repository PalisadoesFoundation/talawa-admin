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

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { IPluginMeta } from 'plugin';
import React from 'react';
import { vi } from 'vitest';
import type { InterfaceUninstallConfirmationModalProps } from 'types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface';
import UninstallConfirmationModal from './UninstallConfirmationModal';

// Mock Translations
const mockT = vi.fn((key, options) => {
  if (options && options.name) return `uninstallPlugin.message ${options.name}`;
  return key;
});
const mockTCommon = vi.fn((key) => key);

vi.mock('react-i18next', () => ({
  useTranslation: (ns: string) => {
    return {
      t: ns === 'translation' ? mockTCommon : mockT,
    };
  },
}));

describe('UninstallConfirmationModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const pluginName = 'Test Plugin';

  // We partially mock the IPluginMeta interface for testing purposes
  const mockPlugin = {
    name: pluginName,
    id: 'test-plugin-id',
  } as unknown as IPluginMeta;

  const defaultProps: InterfaceUninstallConfirmationModalProps = {
    show: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    plugin: mockPlugin,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal with correct title and message', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    // Assert Title
    expect(screen.getByText('uninstallPlugin.title')).toBeInTheDocument();
    // Assert Message (matches the mock translation logic)
    expect(
      screen.getByText(`uninstallPlugin.message ${pluginName}`),
    ).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    const cancelButton = screen.getByTestId('uninstall-cancel-btn');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when uninstall button is clicked', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');
    fireEvent.click(uninstallButton);

    // The component wraps onConfirm in an async function, so we expect it to be called
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should return null (not render) if plugin is null', () => {
    const { container } = render(
      <UninstallConfirmationModal {...defaultProps} plugin={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  // NEW TEST: Cover the error handling (lines 57-58)
  it('should handle errors during uninstall and reset loading state', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Uninstall failed');

    // Mock onConfirm to reject with an error
    mockOnConfirm.mockRejectedValueOnce(testError);

    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');
    fireEvent.click(uninstallButton);

    // Wait for the error to be caught and logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Uninstall failed',
        testError,
      );
    });

    // Verify that loading state was reset (button should be enabled again)
    await waitFor(() => {
      expect(uninstallButton).not.toBeDisabled();
    });

    consoleErrorSpy.mockRestore();
  });

  // OPTIONAL: Test loading state during uninstall
  it('should show loading state during uninstall', async () => {
    let resolveConfirm: (() => void) | undefined;
    const confirmPromise = new Promise<void>((resolve) => {
      resolveConfirm = resolve;
    });
    mockOnConfirm.mockReturnValueOnce(confirmPromise);

    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');
    const cancelButton = screen.getByTestId('uninstall-cancel-btn');

    fireEvent.click(uninstallButton);

    // Verify buttons are disabled during loading
    await waitFor(() => {
      expect(uninstallButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    // Verify loading text is shown
    expect(mockTCommon).toHaveBeenCalledWith('deleting');
    // Resolve the promise to complete the test
    if (resolveConfirm) {
      resolveConfirm();
    }
  });
});
