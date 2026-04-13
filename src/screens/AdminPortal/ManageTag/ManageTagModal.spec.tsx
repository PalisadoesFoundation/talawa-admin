import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { MockedResponse } from '@apollo/client/testing';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { vi, beforeEach, afterEach, describe, expect, test } from 'vitest';
import {
  REMOVE_USER_TAG,
  UPDATE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import i18n from 'utils/i18nForTest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { StaticMockLink } from 'utils/StaticMockLink';
import ManageTagModal from './ManageTagModal';

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe('ManageTagModal', () => {
  const onClose = vi.fn();
  const onRefetch = vi.fn().mockResolvedValue(undefined);
  const tag = { id: 'tag-1', name: 'Urgent' };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  const renderModal = (
    mocks: MockedResponse[] = [],
    open = true,
    customTag: { id: string; name: string } | null = tag,
  ) => {
    const link = new StaticMockLink(mocks, true);
    return render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18n}>
          <ManageTagModal
            open={open}
            tag={customTag}
            onClose={onClose}
            onRefetch={onRefetch}
            modalTestId="manageTagModal"
            inputTestId="manageTagNameInput"
            deleteModalTestId="deleteTagModal"
          />
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  test('prefills tag name and updates successfully', async () => {
    const user = userEvent.setup();
    renderModal([
      {
        request: {
          query: UPDATE_USER_TAG,
          variables: { tagId: 'tag-1', name: 'Urgent Updated' },
        },
        result: {
          data: {
            updateTag: { id: 'tag-1' },
          },
        },
      },
    ]);

    const input = screen.getByTestId('manageTagNameInput') as HTMLInputElement;
    expect(input.value).toBe('Urgent');

    await user.clear(input);
    await user.type(input, 'Urgent Updated');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onRefetch).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  test('closes without mutation when tag name is unchanged', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(NotificationToast.success).not.toHaveBeenCalled();
    });
  });

  test('shows required error when tag name is empty', async () => {
    const user = userEvent.setup();
    renderModal();

    const input = screen.getByTestId('manageTagNameInput') as HTMLInputElement;
    await user.clear(input);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  test('opens delete confirmation and deletes tag', async () => {
    const user = userEvent.setup();
    renderModal([
      {
        request: {
          query: REMOVE_USER_TAG,
          variables: { id: 'tag-1' },
        },
        result: {
          data: {
            deleteTag: { id: 'tag-1' },
          },
        },
      },
    ]);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(screen.getByTestId('deleteTagModal')).toBeInTheDocument();
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
      expect(screen.getByTestId('deleteTagModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modal-cancel-btn'));

    await waitFor(() => {
      expect(screen.queryByTestId('deleteTagModal')).not.toBeInTheDocument();
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  test('resets local state when modal closes and reopens', async () => {
    const user = userEvent.setup();
    const { rerender } = renderModal();

    const input = screen.getByTestId('manageTagNameInput') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'Temporary Name');
    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByTestId('deleteTagModal')).toBeInTheDocument();
    });

    const link = new StaticMockLink([], true);
    rerender(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18n}>
          <ManageTagModal
            open={false}
            tag={tag}
            onClose={onClose}
            onRefetch={onRefetch}
            modalTestId="manageTagModal"
            inputTestId="manageTagNameInput"
            deleteModalTestId="deleteTagModal"
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    rerender(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18n}>
          <ManageTagModal
            open={true}
            tag={tag}
            onClose={onClose}
            onRefetch={onRefetch}
            modalTestId="manageTagModal"
            inputTestId="manageTagNameInput"
            deleteModalTestId="deleteTagModal"
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('deleteTagModal')).not.toBeInTheDocument();
      expect(
        (screen.getByTestId('manageTagNameInput') as HTMLInputElement).value,
      ).toBe('Urgent');
    });
  });

  test('returns early when tag is null on submit', async () => {
    const user = userEvent.setup();
    renderModal([], true, null);

    const form = screen.getByTestId('manageTagNameInput').closest('form');
    expect(form).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /save/i }));
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

    const input = screen.getByTestId('manageTagNameInput') as HTMLInputElement;
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
          query: UPDATE_USER_TAG,
          variables: { tagId: 'tag-1', name: 'Broken Update' },
        },
        error: new Error('Update failed'),
      },
    ]);

    const input = screen.getByTestId('manageTagNameInput') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'Broken Update');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  test('shows error toast when delete mutation fails', async () => {
    const user = userEvent.setup();
    renderModal([
      {
        request: {
          query: REMOVE_USER_TAG,
          variables: { id: 'tag-1' },
        },
        error: new Error('Delete failed'),
      },
    ]);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(screen.getByTestId('deleteTagModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modal-delete-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('Delete failed');
    });
  });
});
