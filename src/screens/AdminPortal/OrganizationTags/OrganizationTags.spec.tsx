import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import OrganizationTags from './OrganizationTags';
import {
  MOCKS,
  MOCKS_EMPTY,
  MOCKS_ERROR,
  MOCKS_CREATE_ERROR,
  MOCKS_CREATE_NO_DATA,
  MOCKS_CREATE_DELAYED,
} from './OrganizationTagsMocks';
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
    onClose,
    folder,
  }: {
    open: boolean;
    onClose: () => void;
    folder: { name?: string } | null;
  }) => (
    <>
      <div data-testid="selectedFolderName">{folder?.name ?? 'NONE'}</div>
      {open ? (
        <div data-testid="manageTagFolderModal">
          <button
            type="button"
            data-testid="closeManageFolderModal"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      ) : null}
    </>
  ),
}));

const renderOrganizationTags = (link: ApolloLink) =>
  render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/admin/orgtags/orgId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId"
                element={<OrganizationTags />}
              />
              <Route
                path="/admin/orgtags/:orgId/tags/:tagId"
                element={<div data-testid="tagsScreen" />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );

describe('OrganizationTags', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('renders folder list with create action', async () => {
    const link = new StaticMockLink(MOCKS, true);
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.getByText('Community')).toBeInTheDocument();
    });
  });

  test('renders error container on query failure', async () => {
    const link = new StaticMockLink(MOCKS_ERROR, true);
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByText(/Error occurred/i)).toBeInTheDocument();
      expect(screen.getByText(/Mock Graphql Error/i)).toBeInTheDocument();
    });
  });

  test('renders empty state when no folders exist', async () => {
    const link = new StaticMockLink(MOCKS_EMPTY, true);
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(
        screen.getByTestId('organization-tags-empty-state'),
      ).toBeInTheDocument();
    });
  });

  test('filters folders by search input', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('searchByName'), 'oper');

    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.queryByText('Community')).not.toBeInTheDocument();
    });
  });

  test('navigates to tags route when clicking folder name', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('tagName')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('tagsScreen')).toBeInTheDocument();
    });
  });

  test('opens manage modal from actions button', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('manageTagBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('manageTagFolderModal')).toBeInTheDocument();
    });
  });

  test('closes manage modal when onClose is triggered', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('manageTagBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('manageTagFolderModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('closeManageFolderModal'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('manageTagFolderModal'),
      ).not.toBeInTheDocument();
    });
  });

  test('resets selected folder after closing manage modal', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('manageTagBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('selectedFolderName')).toHaveTextContent(
        'Operations',
      );
    });

    await user.click(screen.getByTestId('closeManageFolderModal'));

    await waitFor(() => {
      expect(screen.getByTestId('selectedFolderName')).toHaveTextContent(
        'NONE',
      );
    });
  });

  test('creates tag folder successfully', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('createTagBtn'));
    await user.type(screen.getByTestId('tagNameInput'), 'Growth');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  test('shows error toast when create folder mutation fails', async () => {
    const link = new StaticMockLink(MOCKS_CREATE_ERROR, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('createTagBtn'));
    await user.type(screen.getByTestId('tagNameInput'), 'Growth Error');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock Graphql Error',
      );
    });
  });

  test('shows validation error when folder name is empty', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('createTagBtn'));
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        expect.stringMatching(/Enter/i),
      );
    });
  });

  test('resets create modal touched state on close and reopen', async () => {
    const link = new StaticMockLink(MOCKS, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('createTagBtn'));

    const tagNameInput = screen.getByTestId('tagNameInput');
    await user.click(tagNameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId('modal-submit-btn')).toBeDisabled();
    });

    await user.click(screen.getByTestId('modal-cancel-btn'));

    await waitFor(() => {
      expect(screen.queryByTestId('tagNameInput')).not.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('createTagBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('tagNameInput')).toBeInTheDocument();
      expect(screen.getByTestId('modal-submit-btn')).not.toBeDisabled();
    });
  });

  test('shows tagCreationFailed when mutation returns no data', async () => {
    const link = new StaticMockLink(MOCKS_CREATE_NO_DATA, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('createTagBtn'));
    await user.type(screen.getByTestId('tagNameInput'), 'Growth NoData');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        expect.stringMatching(/failed/i),
      );
    });
  });

  test('ignores second submit while request is in progress', async () => {
    const link = new StaticMockLink(MOCKS_CREATE_DELAYED, true);
    const user = userEvent.setup();
    renderOrganizationTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('createTagBtn'));
    const tagNameInput = screen.getByTestId('tagNameInput');
    await user.type(tagNameInput, 'Growth Delayed');

    const form = tagNameInput.closest('form');
    expect(form).not.toBeNull();

    await act(async () => {
      (form as HTMLFormElement).dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal-submit-btn')).toBeDisabled();
    });

    await act(async () => {
      (form as HTMLFormElement).dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      );
    });

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledTimes(1);
    });
  });
});
