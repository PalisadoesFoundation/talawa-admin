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

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { IPluginMeta } from 'plugin';
import React from 'react';
import {
  vi,
  type Mock,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from 'vitest';
import type { InterfaceUninstallConfirmationModalProps } from 'types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface';
import UninstallConfirmationModal from './UninstallConfirmationModal';

// Mock BaseModal to expose onHide prop
vi.mock('shared-components/BaseModal/BaseModal', () => ({
  default: ({
    show,
    onHide,
    title,
    footer,
    children,
    backdrop,
    keyboard,
  }: {
    show: boolean;
    onHide: () => void;
    title: React.ReactNode;
    footer: React.ReactNode;
    children: React.ReactNode;
    backdrop: boolean | string;
    keyboard: boolean;
  }) => {
    if (!show) return null;
    return (
      <div data-testid="base-modal">
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
        <button
          type="button"
          data-testid="modal-close-trigger"
          onClick={onHide}
        >
          Close
        </button>
        <div data-testid="modal-backdrop">{String(backdrop)}</div>
        <div data-testid="modal-keyboard">{String(keyboard)}</div>
      </div>
    );
  },
}));

// Mock Button component
vi.mock('shared-components/Button/Button', () => ({
  default: ({
    children,
    onClick,
    disabled,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock Translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('UninstallConfirmationModal', () => {
  let mockOnClose: Mock;
  let mockOnConfirm: Mock;
  let defaultProps: InterfaceUninstallConfirmationModalProps;
  let user: ReturnType<typeof userEvent.setup>;

  const pluginName = 'Test Plugin';
  const mockPlugin = {
    name: pluginName,
    id: 'test-plugin-id',
  } as unknown as IPluginMeta;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();

    mockOnClose = vi.fn();
    mockOnConfirm = vi.fn();

    defaultProps = {
      show: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
      plugin: mockPlugin,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal with correct title and message', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    expect(screen.getByText('pluginStore.uninstallPlugin')).toBeInTheDocument();
    expect(
      screen.getByText('pluginStore.uninstallPluginMsg'),
    ).toBeInTheDocument();
  });

  it('should render the warning message', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    expect(
      screen.getByText('pluginStore.uninstallWarning'),
    ).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    const cancelButton = screen.getByTestId('uninstall-cancel-btn');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when uninstall button is clicked', async () => {
    mockOnConfirm.mockResolvedValueOnce(undefined);

    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');
    await user.click(uninstallButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('should show loading state and disable actions while uninstallation is in progress', async () => {
    let resolvePromise: (value: void | PromiseLike<void>) => void = () => {};
    const confirmPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    mockOnConfirm.mockReturnValue(confirmPromise);

    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');
    const cancelButton = screen.getByTestId('uninstall-cancel-btn');

    await user.click(uninstallButton);

    expect(await screen.findByText('loading')).toBeInTheDocument();
    expect(uninstallButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    // Check backdrop is static during loading
    expect(screen.getByTestId('modal-backdrop')).toHaveTextContent('static');
    // Check keyboard is false during loading
    expect(screen.getByTestId('modal-keyboard')).toHaveTextContent('false');

    resolvePromise();

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument();
      expect(uninstallButton).not.toBeDisabled();
      expect(cancelButton).not.toBeDisabled();
    });
  });

  it('should prevent closing via modal onHide when loading', async () => {
    let resolvePromise: (value: void | PromiseLike<void>) => void = () => {};
    const confirmPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    mockOnConfirm.mockReturnValue(confirmPromise);

    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');

    // Click uninstall to start loading
    await user.click(uninstallButton);

    // Wait for loading state
    expect(await screen.findByText('loading')).toBeInTheDocument();

    // Try to close modal via the onHide callback (simulating backdrop click or ESC)
    const closeButton = screen.getByTestId('modal-close-trigger');
    await user.click(closeButton);

    // onClose should NOT be called because isLoading is true (handleClose early return)
    expect(mockOnClose).not.toHaveBeenCalled();

    // Resolve the promise
    resolvePromise();

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument();
    });
  });

  it('should prevent closing when cancel button is clicked during loading', async () => {
    let resolvePromise: (value: void | PromiseLike<void>) => void = () => {};
    const confirmPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    mockOnConfirm.mockReturnValue(confirmPromise);

    render(<UninstallConfirmationModal {...defaultProps} />);

    const uninstallButton = screen.getByTestId('uninstall-remove-btn');
    const cancelButton = screen.getByTestId('uninstall-cancel-btn');

    // Click uninstall to start loading
    await user.click(uninstallButton);

    // Wait for loading state
    expect(await screen.findByText('loading')).toBeInTheDocument();

    // Try to click cancel while loading (button is disabled, but we test the handler)
    await user.click(cancelButton);

    // onClose should NOT be called
    expect(mockOnClose).not.toHaveBeenCalled();

    // Resolve the promise
    resolvePromise();

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument();
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
    await user.click(uninstallButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Uninstall failed',
        testError,
      );
    });

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

  it('should allow closing when not loading', async () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    const closeButton = screen.getByTestId('modal-close-trigger');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should set backdrop to true when not loading', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    expect(screen.getByTestId('modal-backdrop')).toHaveTextContent('true');
  });

  it('should set keyboard to true when not loading', () => {
    render(<UninstallConfirmationModal {...defaultProps} />);

    expect(screen.getByTestId('modal-keyboard')).toHaveTextContent('true');
  });
});
