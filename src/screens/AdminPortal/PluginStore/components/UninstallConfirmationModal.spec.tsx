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
import { vi, type Mock } from 'vitest';
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
  // Define variables in the scope accessible to all tests

  afterEach(() => {
    vi.clearAllMocks();
  });

  let mockOnClose: Mock;
  let mockOnConfirm: Mock;
  let defaultProps: InterfaceUninstallConfirmationModalProps;

  const pluginName = 'Test Plugin';
  const mockPlugin = {
    name: pluginName,
    id: 'test-plugin-id',
  } as unknown as IPluginMeta;

  // Setup fresh mocks before EVERY test to ensure isolation
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnClose = vi.fn();
    mockOnConfirm = vi.fn();

    defaultProps = {
      show: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
      plugin: mockPlugin,
    };
  });

  it('should render the modal with correct title and message', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    expect(screen.getByText('uninstallPlugin.title')).toBeInTheDocument();
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

  it('should call onConfirm when uninstall button is clicked', async () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');
    fireEvent.click(uninstallButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('should show loading state while uninstallation is in progress', async () => {
    // Advanced Async Test: Use a controlled promise to "pause" execution
    // Initialize with a no-op function to satisfy TypeScript (no @ts-ignore needed!)
    let resolvePromise: (value: void | PromiseLike<void>) => void = () => {};

    const confirmPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    // Mock onConfirm to wait for our signal
    mockOnConfirm.mockReturnValue(confirmPromise);

    render(<UninstallConfirmationModal {...defaultProps} />);
    const uninstallButton = screen.getByTestId('uninstall-remove-btn');

    // 1. Trigger the click
    fireEvent.click(uninstallButton);

    // 2. Verify Loading State (Promise is pending)
    // The button should now say "deleting" and be disabled
    expect(await screen.findByText('deleting')).toBeInTheDocument();
    expect(uninstallButton).toBeDisabled();

    // 3. Resolve the promise (Simulate API success)
    resolvePromise();

    // 4. Verify Loading State is gone (Promise resolved)
    await waitFor(() => {
      expect(screen.queryByText('deleting')).not.toBeInTheDocument();
      expect(uninstallButton).not.toBeDisabled();
    });
  });

  it('should handle errors during uninstall and reset loading state', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Uninstall failed');

    mockOnConfirm.mockRejectedValueOnce(testError);

    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');
    fireEvent.click(uninstallButton);

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

  it('should return null (not render) if plugin is null', () => {
    const { container } = render(
      <UninstallConfirmationModal {...defaultProps} plugin={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
