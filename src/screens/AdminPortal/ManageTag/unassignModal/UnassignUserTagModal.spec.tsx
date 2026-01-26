import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import UnassignUserTagModal, {
  InterfaceUnassignUserTagModalProps,
} from './UnassignUserTagModal';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock CSS module
vi.mock('./UnassignUserTagModal.module.css', () => ({
  default: {
    modalHeader: 'modalHeader-class',
    removeButton: 'removeButton-class',
    addButton: 'addButton-class',
  },
}));

describe('UnassignUserTagModal Component', () => {
  const defaultProps: InterfaceUnassignUserTagModalProps = {
    unassignUserTagModalIsOpen: true,
    toggleUnassignUserTagModal: vi.fn(),
    handleUnassignUserTag: vi.fn().mockResolvedValue(undefined),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when open', () => {
    render(<UnassignUserTagModal {...defaultProps} />);

    expect(screen.getByTestId('unassign-user-tag-modal')).toBeInTheDocument();

    expect(screen.getByText('unassignUserTag')).toBeInTheDocument();
    expect(screen.getByText('unassignUserTagMessage')).toBeInTheDocument();

    expect(screen.getByTestId('modal-cancel-btn')).toBeInTheDocument();

    expect(screen.getByTestId('modal-delete-btn')).toBeInTheDocument();
  });

  it('does not render the modal when closed', () => {
    render(
      <UnassignUserTagModal
        {...defaultProps}
        unassignUserTagModalIsOpen={false}
      />,
    );

    expect(
      screen.queryByTestId('unassign-user-tag-modal'),
    ).not.toBeInTheDocument();
  });

  it('calls toggleUnassignUserTagModal when No button is clicked', async () => {
    const user = userEvent.setup();
    render(<UnassignUserTagModal {...defaultProps} />);

    const cancelButton = screen.getByTestId('modal-cancel-btn');
    await user.click(cancelButton);

    expect(defaultProps.toggleUnassignUserTagModal).toHaveBeenCalledTimes(1);
  });

  it('calls handleUnassignUserTag when Yes button is clicked', async () => {
    const user = userEvent.setup();
    render(<UnassignUserTagModal {...defaultProps} />);

    const confirmButton = screen.getByTestId('modal-delete-btn');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(defaultProps.handleUnassignUserTag).toHaveBeenCalledTimes(1);
    });
  });

  it('disables the submit button while submitting', async () => {
    const user = userEvent.setup();
    let resolvePromise: (() => void) | undefined;

    const pendingPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    const propsWithPendingSubmit = {
      ...defaultProps,
      handleUnassignUserTag: vi.fn(() => pendingPromise),
    };

    render(<UnassignUserTagModal {...propsWithPendingSubmit} />);

    const confirmButton = screen.getByTestId('modal-delete-btn');

    await user.click(confirmButton);

    expect(confirmButton).toBeDisabled();

    if (resolvePromise) {
      resolvePromise();
    }

    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled();
    });
  });

  it('prevents multiple submissions while already submitting', async () => {
    const user = userEvent.setup();
    let resolvePromise: (() => void) | undefined;

    const pendingPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    const handleUnassignUserTag = vi.fn(() => pendingPromise);

    render(
      <UnassignUserTagModal
        {...defaultProps}
        handleUnassignUserTag={handleUnassignUserTag}
      />,
    );

    const confirmButton = screen.getByTestId('modal-delete-btn');

    await user.click(confirmButton);
    await user.click(confirmButton);

    expect(handleUnassignUserTag).toHaveBeenCalledTimes(1);

    if (resolvePromise) {
      resolvePromise();
    }
  });

  it('applies correct CSS classes to buttons', () => {
    render(<UnassignUserTagModal {...defaultProps} />);

    const cancelButton = screen.getByTestId('modal-cancel-btn');
    const deleteButton = screen.getByTestId('modal-delete-btn');

    expect(cancelButton).toHaveClass('btn-secondary');
    expect(deleteButton).toHaveClass('btn-danger');
  });

  it('handles error when handleUnassignUserTag rejects', async () => {
    const user = userEvent.setup();
    const error = new Error('Unassign failed');

    let rejectFn: ((reason?: unknown) => void) | undefined;

    const promise = new Promise<never>((_resolve, reject) => {
      rejectFn = reject;
    });

    const failingHandler = vi.fn(() => promise);

    promise.catch(() => {});

    render(
      <UnassignUserTagModal
        {...defaultProps}
        handleUnassignUserTag={failingHandler}
      />,
    );

    const confirmButton = screen.getByTestId('modal-delete-btn');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(failingHandler).toHaveBeenCalledTimes(1);
    });

    if (rejectFn) {
      rejectFn(error);
    }

    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled();
    });

    expect(NotificationToast.error).toHaveBeenCalledWith(
      'unassignUserTagError',
    );
  });
});
