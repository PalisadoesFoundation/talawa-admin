import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import ManageTag, { getManageTagErrorMessage } from './ManageTag';
import { USER_TAGS_ASSIGNED_MEMBERS } from 'GraphQl/Queries/userTagQueries';
import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import type { ApolloLink } from '@apollo/client';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('components/AdminPortal/AddPeopleToTag/AddPeopleToTag', () => ({
  default: ({
    addPeopleToTagModalIsOpen,
    hideAddPeopleToTagModal,
  }: {
    addPeopleToTagModalIsOpen: boolean;
    hideAddPeopleToTagModal: () => void;
  }) =>
    addPeopleToTagModalIsOpen ? (
      <div data-testid="addPeopleModal">
        <button
          type="button"
          data-testid="closeAddPeopleModal"
          onClick={hideAddPeopleToTagModal}
        >
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock('components/AdminPortal/TagActions/TagActions', () => ({
  default: ({
    tagActionsModalIsOpen,
    hideTagActionsModal,
    tagActionType,
  }: {
    tagActionsModalIsOpen: boolean;
    hideTagActionsModal: () => void;
    tagActionType: 'assignToTags' | 'removeFromTags';
  }) =>
    tagActionsModalIsOpen ? (
      <div data-testid="tagActionsModal">
        <span data-testid="tagActionType">{tagActionType}</span>
        <button
          type="button"
          data-testid="closeTagActionsModal"
          onClick={hideTagActionsModal}
        >
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock('shared-components/CRUDModalTemplate/DeleteModal', () => ({
  DeleteModal: ({
    open,
    onClose,
    onDelete,
  }: {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
  }) =>
    open ? (
      <div data-testid="unassignDeleteModal">
        <button type="button" data-testid="confirmUnassign" onClick={onDelete}>
          Confirm
        </button>
        <button type="button" data-testid="closeUnassign" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

const assignedMembersVariables = {
  id: 'tag-123',
  first: TAGS_QUERY_DATA_CHUNK_SIZE,
};

const assignedMembersResult = {
  getAssignedUsers: {
    id: 'tag-123',
    name: 'Community Leads',
    usersAssignedTo: {
      edges: [
        {
          node: {
            _id: 'user-1',
            name: 'Alice Johnson',
          },
        },
        {
          node: {
            _id: 'user-2',
            name: 'Bob Stone',
          },
        },
      ],
      pageInfo: {
        startCursor: 'user-1',
        endCursor: 'user-2',
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    ancestorTags: [
      {
        _id: 'tag-100',
        name: 'Parent Tag',
      },
    ],
    folder: {
      _id: 'folder-1',
      name: 'Root Folder',
      parentFolder: null,
    },
  },
};

const baseMocks = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: assignedMembersVariables,
    },
    result: {
      data: assignedMembersResult,
    },
  },
];

const successUnassignMocks = [
  ...baseMocks,
  {
    request: {
      query: UNASSIGN_USER_TAG,
      variables: {
        tagId: 'tag-123',
        userId: 'user-1',
      },
    },
    result: {
      data: {
        unassignUserTag: true,
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: assignedMembersVariables,
    },
    result: {
      data: assignedMembersResult,
    },
  },
];

const errorUnassignMocks = [
  ...baseMocks,
  {
    request: {
      query: UNASSIGN_USER_TAG,
      variables: {
        tagId: 'tag-123',
        userId: 'user-1',
      },
    },
    error: new Error('Failed to unassign'),
  },
];

const errorQueryMocks = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: assignedMembersVariables,
    },
    error: new Error('Query failed'),
  },
];

const emptyMocks = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: assignedMembersVariables,
    },
    result: {
      data: {
        getAssignedUsers: {
          ...assignedMembersResult.getAssignedUsers,
          usersAssignedTo: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
];

const renderManageTag = (link: ApolloLink) =>
  render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/admin/orgtags/orgId/manageTag/tag-123']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId"
                element={<div data-testid="orgTagsScreen" />}
              />
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
                element={<ManageTag />}
              />
              <Route
                path="/admin/orgtags/:orgId/manageTag/tag-100"
                element={<div data-testid="ancestorManageTagScreen" />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );

describe('getManageTagErrorMessage', () => {
  test('returns message for Error instances', () => {
    expect(getManageTagErrorMessage(new Error('boom'))).toBe('boom');
  });

  test('stringifies object values', () => {
    expect(getManageTagErrorMessage({ ok: false })).toBe('{"ok":false}');
  });

  test('handles primitives', () => {
    expect(getManageTagErrorMessage('x')).toBe('x');
    expect(getManageTagErrorMessage(42)).toBe('42');
  });
});

describe('ManageTag', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('renders members list and action controls', async () => {
    const link = new StaticMockLink(baseMocks, true);
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('addPeopleToTagBtn')).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Stone')).toBeInTheDocument();
      expect(screen.getByTestId('assignToTags')).toBeInTheDocument();
      expect(screen.getByTestId('removeFromTags')).toBeInTheDocument();
    });
  });

  test('renders error state when query fails', async () => {
    const link = new StaticMockLink(errorQueryMocks, true);
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByText(/loading assigned users/i)).toBeInTheDocument();
    });
  });

  test('renders empty state when no assigned members', async () => {
    const link = new StaticMockLink(emptyMocks, true);
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('manage-tag-empty-state')).toBeInTheDocument();
    });
  });

  test('filters members by search', async () => {
    const link = new StaticMockLink(baseMocks, true);
    const user = userEvent.setup();
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('searchInput')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('searchInput'), 'ali');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Bob Stone')).not.toBeInTheDocument();
    });
  });

  test('opens and closes add people modal', async () => {
    const link = new StaticMockLink(baseMocks, true);
    const user = userEvent.setup();
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('addPeopleToTagBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('addPeopleToTagBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('addPeopleModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('closeAddPeopleModal'));
    await waitFor(() => {
      expect(screen.queryByTestId('addPeopleModal')).not.toBeInTheDocument();
    });
  });

  test('opens tag actions modal with assign action type', async () => {
    const link = new StaticMockLink(baseMocks, true);
    const user = userEvent.setup();
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('assignToTags')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('assignToTags'));

    await waitFor(() => {
      expect(screen.getByTestId('tagActionsModal')).toBeInTheDocument();
      expect(screen.getByTestId('tagActionType')).toHaveTextContent(
        'assignToTags',
      );
    });
  });

  test('opens tag actions modal with remove action type', async () => {
    const link = new StaticMockLink(baseMocks, true);
    const user = userEvent.setup();
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('removeFromTags')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('removeFromTags'));

    await waitFor(() => {
      expect(screen.getByTestId('tagActionsModal')).toBeInTheDocument();
      expect(screen.getByTestId('tagActionType')).toHaveTextContent(
        'removeFromTags',
      );
    });
  });

  test('navigates to organization tags from all tags breadcrumb', async () => {
    const link = new StaticMockLink(baseMocks, true);
    const user = userEvent.setup();
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('allTagsBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('orgTagsScreen')).toBeInTheDocument();
    });
  });

  test('navigates to ancestor manage tag from breadcrumb', async () => {
    const link = new StaticMockLink(baseMocks, true);
    const user = userEvent.setup();
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('redirectToManageTag')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('redirectToManageTag'));

    await waitFor(() => {
      expect(screen.getByTestId('ancestorManageTagScreen')).toBeInTheDocument();
    });
  });

  test('unassigns member successfully', async () => {
    const link = new StaticMockLink(successUnassignMocks, true);
    const user = userEvent.setup();
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('unassignTagBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('unassignDeleteModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('confirmUnassign'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  test('shows error toast when unassign fails', async () => {
    const link = new StaticMockLink(errorUnassignMocks, true);
    const user = userEvent.setup();
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('unassignTagBtn')[0]);
    await user.click(screen.getByTestId('confirmUnassign'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to unassign',
      );
    });
  });
});
