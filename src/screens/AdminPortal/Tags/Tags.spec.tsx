import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { vi, describe, test, expect, afterEach } from 'vitest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import Tags from './Tags';
import {
  MOCKS,
  MOCKS_EMPTY,
  MOCKS_ERROR,
  MOCKS_CREATE_TAG_ERROR,
  MOCKS_CREATE_FOLDER_ERROR,
} from './TagsMocks';
import type { ApolloLink } from '@apollo/client';

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('screens/AdminPortal/ManageTag/ManageFolderModal', () => ({
  default: ({
    open,
    folder,
    onClose,
  }: {
    open: boolean;
    folder: { name?: string } | null;
    onClose: () => void;
  }) => (
    <>
      <div data-testid="selectedManagedFolder">{folder?.name ?? 'NONE'}</div>
      {open ? (
        <div data-testid="manageChildFolderModal">
          <button
            type="button"
            data-testid="closeManageChildFolderModal"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      ) : null}
    </>
  ),
}));

vi.mock('screens/AdminPortal/ManageTag/ManageTagModal', () => ({
  default: ({
    open,
    tag,
    onClose,
  }: {
    open: boolean;
    tag: { name?: string } | null;
    onClose: () => void;
  }) => (
    <>
      <div data-testid="selectedManagedTag">{tag?.name ?? 'NONE'}</div>
      {open ? (
        <div data-testid="manageTagModal">
          <button
            type="button"
            data-testid="closeManageTagModal"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      ) : null}
    </>
  ),
}));

const renderTags = (link: ApolloLink) =>
  render(
    <MockedProvider link={link}>
      <MemoryRouter
        initialEntries={['/admin/orgtags/orgId/tags/folder-parent']}
      >
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId"
                element={<div data-testid="orgTagsScreen" />}
              />
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
                element={<div data-testid="manageTagScreen" />}
              />
              <Route
                path="/admin/orgtags/:orgId/tags/folder-child-1"
                element={<div data-testid="childFolderScreen" />}
              />
              <Route
                path="/admin/orgtags/:orgId/tags/:tagId"
                element={<Tags />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );

describe('Tags', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('renders folder and tag rows with create actions', async () => {
    const link = new StaticMockLink(MOCKS, true);
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addFolderBtn')).toBeInTheDocument();
      expect(screen.getByTestId('addTagBtn')).toBeInTheDocument();
      expect(screen.getByText('Community')).toBeInTheDocument();
      expect(screen.getByText('Urgent')).toBeInTheDocument();
    });
  });

  test('renders error container when folder query fails', async () => {
    const link = new StaticMockLink(MOCKS_ERROR, true);
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByText(/errorOccured/i)).toBeInTheDocument();
    });
  });

  test('renders empty state when no child folders or tags exist', async () => {
    const link = new StaticMockLink(MOCKS_EMPTY, true);
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('tags-empty-state')).toBeInTheDocument();
    });
  });

  test('filters rows by search text', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('searchByName'), 'comm');

    await waitFor(() => {
      expect(screen.getByText('Community')).toBeInTheDocument();
      expect(screen.queryByText('Urgent')).not.toBeInTheDocument();
    });
  });

  test('navigates to child folder route when clicking folder name', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByText('Community')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Community'));

    await waitFor(() => {
      expect(screen.getByTestId('childFolderScreen')).toBeInTheDocument();
    });
  });

  test('navigates to manage tag route when clicking a tag row', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByText('Urgent')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Urgent'));

    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });

  test('navigates to root tags page from breadcrumb all tags button', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('allTagsBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('orgTagsScreen')).toBeInTheDocument();
    });
  });

  test('opens and closes manage child folder modal', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByText('Community')).toBeInTheDocument();
    });

    const manageButtons = screen.getAllByRole('button', { name: /manage/i });
    await user.click(manageButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('manageChildFolderModal')).toBeInTheDocument();
      expect(screen.getByTestId('selectedManagedFolder')).toHaveTextContent(
        'Community',
      );
    });

    await user.click(screen.getByTestId('closeManageChildFolderModal'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('manageChildFolderModal'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('selectedManagedFolder')).toHaveTextContent(
        'NONE',
      );
    });
  });

  test('opens and closes manage tag modal', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByText('Urgent')).toBeInTheDocument();
    });

    const manageButtons = screen.getAllByRole('button', { name: /manage/i });
    await user.click(manageButtons[1]);

    await waitFor(() => {
      expect(screen.getByTestId('manageTagModal')).toBeInTheDocument();
      expect(screen.getByTestId('selectedManagedTag')).toHaveTextContent(
        'Urgent',
      );
    });

    await user.click(screen.getByTestId('closeManageTagModal'));

    await waitFor(() => {
      expect(screen.queryByTestId('manageTagModal')).not.toBeInTheDocument();
      expect(screen.getByTestId('selectedManagedTag')).toHaveTextContent(
        'NONE',
      );
    });
  });

  test('creates child folder successfully', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addFolderBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addFolderBtn'));
    await user.type(
      screen.getByTestId('createFolderNameInput'),
      'Growth Folder',
    );
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.stringMatching(/success/i),
      );
    });
  });

  test('creates tag successfully', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addTagBtn'));
    await user.type(screen.getByTestId('createTagNameInput'), 'Urgent Tag');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.stringMatching(/success/i),
      );
    });
  });

  test('resets tag modal state on close', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addTagBtn'));

    const tagInput = screen.getByTestId(
      'createTagNameInput',
    ) as HTMLInputElement;
    await user.type(tagInput, 'Temporary Tag');
    await user.clear(tagInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId('modal-submit-btn')).toBeDisabled();
    });

    await user.click(screen.getByTestId('modal-cancel-btn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createTagNameInput'),
      ).not.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addTagBtn'));

    await waitFor(() => {
      const reopenedInput = screen.getByTestId(
        'createTagNameInput',
      ) as HTMLInputElement;
      expect(reopenedInput.value).toBe('');
      expect(screen.getByTestId('modal-submit-btn')).not.toBeDisabled();
    });
  });

  test('resets folder modal state on close', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addFolderBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addFolderBtn'));

    const folderInput = screen.getByTestId(
      'createFolderNameInput',
    ) as HTMLInputElement;
    await user.type(folderInput, 'Temporary Folder');
    await user.clear(folderInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId('modal-submit-btn')).toBeDisabled();
    });

    await user.click(screen.getByTestId('modal-cancel-btn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createFolderNameInput'),
      ).not.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addFolderBtn'));

    await waitFor(() => {
      const reopenedInput = screen.getByTestId(
        'createFolderNameInput',
      ) as HTMLInputElement;
      expect(reopenedInput.value).toBe('');
      expect(screen.getByTestId('modal-submit-btn')).not.toBeDisabled();
    });
  });

  test('shows error toast when create tag mutation fails', async () => {
    const link = new StaticMockLink(MOCKS_CREATE_TAG_ERROR, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addTagBtn'));
    await user.type(screen.getByTestId('createTagNameInput'), 'Tag Error');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to create tag',
      );
    });
  });

  test('shows error toast when create folder mutation fails', async () => {
    const link = new StaticMockLink(MOCKS_CREATE_FOLDER_ERROR, true);
    const user = userEvent.setup();
    renderTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addFolderBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addFolderBtn'));
    await user.type(
      screen.getByTestId('createFolderNameInput'),
      'Folder Error',
    );
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to create folder',
      );
    });
  });
});
