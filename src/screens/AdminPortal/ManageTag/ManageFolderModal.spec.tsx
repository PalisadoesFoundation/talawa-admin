import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { vi, beforeEach, afterEach, describe, expect, test } from 'vitest';
import {
  DELETE_TAG_FOLDER,
  UPDATE_TAG_FOLDER,
} from 'GraphQl/Mutations/TagMutations';
import i18n from 'utils/i18nForTest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { StaticMockLink } from 'utils/StaticMockLink';
import ManageFolderModal from './ManageFolderModal';

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe('ManageFolderModal', () => {
  const onClose = vi.fn();
  const onRefetch = vi.fn().mockResolvedValue(undefined);
  const onViewFolder = vi.fn();
  const folder = { id: 'folder-1', name: 'Operations' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderModal = (
    mocks: MockedResponse[] = [],
    open = true,
    customFolder: { id: string; name: string } | null = folder,
  ) => {
    const link = new StaticMockLink(mocks, true);
    return render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18n}>
          <ManageFolderModal
            open={open}
            folder={customFolder}
            onClose={onClose}
            onRefetch={onRefetch}
            onViewFolder={onViewFolder}
            modalTestId="manageFolderModal"
            inputTestId="manageFolderNameInput"
            deleteModalTestId="deleteFolderModal"
          />
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  test('prefills folder name and updates successfully', async () => {
    const user = userEvent.setup();
    renderModal([
      {
        request: {
          query: UPDATE_TAG_FOLDER,
          variables: { id: 'folder-1', name: 'Operations Updated' },
        },
        result: {
          data: {
            updateTagFolder: { id: 'folder-1' },
          },
        },
      },
    ]);

    const input = screen.getByTestId(
      'manageFolderNameInput',
    ) as HTMLInputElement;
    expect(input.value).toBe('Operations');

    await user.clear(input);
    await user.type(input, 'Operations Updated');
    await user.click(screen.getByRole('button', { name: /edit/i }));

    await waitFor(() => {
      expect(onRefetch).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  test('closes without mutation when name is unchanged', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: /edit/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(NotificationToast.success).not.toHaveBeenCalled();
    });
  });

  test('shows required error when folder name is empty', async () => {
    const user = userEvent.setup();
    renderModal();

    const input = screen.getByTestId(
      'manageFolderNameInput',
    ) as HTMLInputElement;
    await user.clear(input);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  test('opens delete confirmation and deletes folder', async () => {
    const user = userEvent.setup();
    renderModal([
      {
        request: {
          query: DELETE_TAG_FOLDER,
          variables: { id: 'folder-1' },
        },
        result: {
          data: {
            deleteTagFolder: { id: 'folder-1' },
          },
        },
      },
    ]);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(screen.getByTestId('deleteFolderModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modal-delete-btn'));

    await waitFor(() => {
      expect(onRefetch).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  test('closes delete confirmation without deleting', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(screen.getByTestId('deleteFolderModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modal-cancel-btn'));

    await waitFor(() => {
      expect(screen.queryByTestId('deleteFolderModal')).not.toBeInTheDocument();
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  test('calls onViewFolder and closes modal', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: /view folder/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(onViewFolder).toHaveBeenCalledWith('folder-1');
    });
  });

  test('resets local state when modal closes and reopens', async () => {
    const user = userEvent.setup();
    const { rerender } = renderModal();

    const input = screen.getByTestId(
      'manageFolderNameInput',
    ) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'Temporary Name');
    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByTestId('deleteFolderModal')).toBeInTheDocument();
    });

    const link = new StaticMockLink([], true);
    rerender(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18n}>
          <ManageFolderModal
            open={false}
            folder={folder}
            onClose={onClose}
            onRefetch={onRefetch}
            onViewFolder={onViewFolder}
            modalTestId="manageFolderModal"
            inputTestId="manageFolderNameInput"
            deleteModalTestId="deleteFolderModal"
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    rerender(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18n}>
          <ManageFolderModal
            open={true}
            folder={folder}
            onClose={onClose}
            onRefetch={onRefetch}
            onViewFolder={onViewFolder}
            modalTestId="manageFolderModal"
            inputTestId="manageFolderNameInput"
            deleteModalTestId="deleteFolderModal"
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('deleteFolderModal')).not.toBeInTheDocument();
      expect(
        (screen.getByTestId('manageFolderNameInput') as HTMLInputElement).value,
      ).toBe('Operations');
    });
  });

  test('returns early when folder is null on submit', async () => {
    const user = userEvent.setup();
    renderModal([], true, null);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
      expect(onRefetch).not.toHaveBeenCalled();
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  test('shows required toast when empty value is submitted directly', async () => {
    const user = userEvent.setup();
    renderModal();

    const input = screen.getByTestId(
      'manageFolderNameInput',
    ) as HTMLInputElement;
    await user.clear(input);

    const form = input.closest('form');
    expect(form).not.toBeNull();
    (form as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('shows error toast when update mutation fails', async () => {
    const user = userEvent.setup();
    renderModal([
      {
        request: {
          query: UPDATE_TAG_FOLDER,
          variables: { id: 'folder-1', name: 'Broken Update' },
        },
        error: new Error('Update failed'),
      },
    ]);

    const input = screen.getByTestId(
      'manageFolderNameInput',
    ) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'Broken Update');
    await user.click(screen.getByRole('button', { name: /edit/i }));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  test('shows error toast when delete mutation fails', async () => {
    const user = userEvent.setup();
    renderModal([
      {
        request: {
          query: DELETE_TAG_FOLDER,
          variables: { id: 'folder-1' },
        },
        error: new Error('Delete failed'),
      },
    ]);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(screen.getByTestId('deleteFolderModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modal-delete-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('Delete failed');
    });
  });
});
