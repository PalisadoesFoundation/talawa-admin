import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import RemoveUserTagModal, {
  InterfaceRemoveUserTagModalProps,
} from './RemoveUserTagModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock CSS module
vi.mock('./RemoveUserTagModal.module.css', () => ({
  default: {
    modalHeader: 'modalHeader-class',
    removeButton: 'removeButton-class',
    addButton: 'addButton-class',
  },
}));

describe('RemoveUserTagModal Component', () => {
  const defaultProps: InterfaceRemoveUserTagModalProps = {
    removeUserTagModalIsOpen: true,
    toggleRemoveUserTagModal: vi.fn(),
    handleRemoveUserTag: vi.fn().mockResolvedValue(undefined),
  };
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when open', () => {
    render(<RemoveUserTagModal {...defaultProps} />);

    expect(screen.getByTestId('remove-user-tag-modal')).toBeInTheDocument();
    expect(screen.getByText('removeUserTag')).toBeInTheDocument();
    expect(screen.getByText('removeUserTagMessage')).toBeInTheDocument();
    expect(
      screen.getByTestId('removeUserTagModalCloseBtn'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('removeUserTagSubmitBtn')).toBeInTheDocument();
  });

  it('does not render the modal when closed', () => {
    render(
      <RemoveUserTagModal {...defaultProps} removeUserTagModalIsOpen={false} />,
    );

    expect(
      screen.queryByTestId('remove-user-tag-modal'),
    ).not.toBeInTheDocument();
  });

  it('calls toggleRemoveUserTagModal when No button is clicked', () => {
    render(<RemoveUserTagModal {...defaultProps} />);

    const cancelButton = screen.getByTestId('removeUserTagModalCloseBtn');
    fireEvent.click(cancelButton);

    expect(defaultProps.toggleRemoveUserTagModal).toHaveBeenCalledTimes(1);
  });

  it('calls handleRemoveUserTag when Yes button is clicked', async () => {
    render(<RemoveUserTagModal {...defaultProps} />);

    const confirmButton = screen.getByTestId('removeUserTagSubmitBtn');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(defaultProps.handleRemoveUserTag).toHaveBeenCalledTimes(1);
    });
  });

  it('disables the submit button while submitting', async () => {
    let resolvePromise: (() => void) | undefined;
    const pendingPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    const propsWithPendingSubmit = {
      ...defaultProps,
      handleRemoveUserTag: vi.fn(() => pendingPromise),
    };

    render(<RemoveUserTagModal {...propsWithPendingSubmit} />);

    const confirmButton = screen.getByTestId('removeUserTagSubmitBtn');

    fireEvent.click(confirmButton);

    expect(confirmButton).toBeDisabled();

    if (resolvePromise) {
      resolvePromise();
    }

    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled();
    });
  });

  it('prevents multiple submissions while already submitting', async () => {
    let resolvePromise: (() => void) | undefined;
    const pendingPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    const handleRemoveUserTag = vi.fn(() => pendingPromise);

    render(
      <RemoveUserTagModal
        {...defaultProps}
        handleRemoveUserTag={handleRemoveUserTag}
      />,
    );

    const confirmButton = screen.getByTestId('removeUserTagSubmitBtn');

    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    expect(handleRemoveUserTag).toHaveBeenCalledTimes(1);

    if (resolvePromise) {
      resolvePromise();
    }
  });

  it('applies correct CSS classes to buttons', () => {
    render(<RemoveUserTagModal {...defaultProps} />);

    expect(screen.getByTestId('removeUserTagModalCloseBtn')).toHaveClass(
      'removeButton-class',
    );

    expect(screen.getByTestId('removeUserTagSubmitBtn')).toHaveClass(
      'addButton-class',
    );
  });
  it('handles error when handleRemoveUserTag rejects', async () => {
    const error = new Error('Remove failed');

    const failingHandler = vi.fn().mockRejectedValue(error);
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    render(
      <RemoveUserTagModal
        {...defaultProps}
        handleRemoveUserTag={failingHandler}
      />,
    );

    const confirmButton = screen.getByTestId('removeUserTagSubmitBtn');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(failingHandler).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(toastErrorSpy).toHaveBeenCalledWith('removeUserTagError');

    consoleErrorSpy.mockRestore();
    toastErrorSpy.mockRestore();
  });
});
