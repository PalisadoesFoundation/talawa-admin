import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { MockedResponse } from '@apollo/client/testing';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, test, expect, afterEach } from 'vitest';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import type { InterfaceTagActionsProps } from 'types/AdminPortal/TagActions/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  ORGANIZATION_TAGS_AND_FOLDERS,
  ORGANIZATION_TAGS_WITH_FOLDER,
  TAG_FOLDER_TREE_NODE,
} from 'GraphQl/Queries/userTagQueries';
import {
  ADD_PEOPLE_TO_TAG,
  UNASSIGN_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import TagActions from './TagActions';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const baseProps: InterfaceTagActionsProps = {
  tagActionsModalIsOpen: true,
  hideTagActionsModal: vi.fn(),
  tagActionType: 'assignToTags',
};

const baseRootFoldersMock = {
  request: {
    query: ORGANIZATION_TAGS_AND_FOLDERS,
    variables: {
      id: '123',
      tagFoldersFirst: 32,
    },
  },
  result: {
    data: {
      organization: {
        id: '123',
        tagFolders: {
          edges: [
            {
              node: {
                id: 'folder-1',
                name: 'Operations',
                parentFolder: null,
              },
            },
          ],
          pageInfo: {
            endCursor: 'folder-1',
            hasNextPage: false,
          },
        },
      },
    },
  },
};

const baseTagsMock = {
  request: {
    query: ORGANIZATION_TAGS_WITH_FOLDER,
    variables: {
      id: '123',
      first: 32,
    },
  },
  result: {
    data: {
      organization: {
        id: '123',
        tags: {
          edges: [
            {
              node: {
                id: '1',
                name: 'Current Tag',
                folder: { id: 'folder-1' },
              },
            },
            { node: { id: '2', name: 'Tag Two', folder: { id: 'folder-1' } } },
            {
              node: { id: '3', name: 'Tag Three', folder: { id: 'folder-1' } },
            },
          ],
          pageInfo: {
            endCursor: '3',
            hasNextPage: false,
          },
        },
      },
    },
  },
};

const baseFolderNodeMock = {
  request: {
    query: TAG_FOLDER_TREE_NODE,
    variables: {
      input: { id: 'folder-1' },
      childFoldersAfter: null,
      childFoldersFirst: 32,
    },
  },
  result: {
    data: {
      tagFolder: {
        id: 'folder-1',
        name: 'Operations',
        parentFolder: null,
        childFolders: {
          edges: [],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
        },
      },
    },
  },
};

const createBaseMocks = (): MockedResponse[] =>
  [baseRootFoldersMock, baseTagsMock, baseFolderNodeMock] as MockedResponse[];

const renderTagActionsModal = (
  props: InterfaceTagActionsProps,
  mocks: MockedResponse[],
) => {
  const link = new StaticMockLink(mocks, true);
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/admin/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
                element={<TagActions {...props} />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('TagActions', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('renders assign modal and can close it', async () => {
    const hideTagActionsModal = vi.fn();
    const user = userEvent.setup();

    renderTagActionsModal(
      { ...baseProps, hideTagActionsModal },
      createBaseMocks(),
    );

    await waitFor(() => {
      expect(screen.getByText(/assign to tags/i)).toBeInTheDocument();
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('closeTagActionsModalBtn'));
    expect(hideTagActionsModal).toHaveBeenCalled();
  });

  test('shows error toast when submitting without selecting tags', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(
      { ...baseProps, assigneeIds: ['member-1'] },
      createBaseMocks(),
    );

    await waitFor(() => {
      expect(screen.getByTestId('tagActionSubmitBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        expect.stringMatching(/no tag selected/i),
      );
    });
  });

  test('shows error toast when no assignees are provided', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(baseProps, createBaseMocks());

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('checkTag2'));
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        expect.stringMatching(/no one assigned/i),
      );
    });
  });

  test('successfully assigns selected tags', async () => {
    const user = userEvent.setup();
    const hideTagActionsModal = vi.fn();

    renderTagActionsModal(
      {
        ...baseProps,
        hideTagActionsModal,
        assigneeIds: ['member-1'],
      },
      [
        ...createBaseMocks(),
        {
          request: {
            query: ADD_PEOPLE_TO_TAG,
            variables: { tagId: '2', userId: 'member-1' },
          },
          result: { data: { assignUserTag: true } },
        },
      ] as MockedResponse[],
    );

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('checkTag2'));
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.stringMatching(/successfully assigned/i),
      );
      expect(hideTagActionsModal).toHaveBeenCalled();
    });
  });

  test('shows mutation error message when assign action fails', async () => {
    const user = userEvent.setup();

    renderTagActionsModal(
      {
        ...baseProps,
        assigneeIds: ['member-1'],
      },
      [
        ...createBaseMocks(),
        {
          request: {
            query: ADD_PEOPLE_TO_TAG,
            variables: { tagId: '2', userId: 'member-1' },
          },
          error: new Error('Assign failed from API'),
        },
      ] as MockedResponse[],
    );

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('checkTag2'));
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Assign failed from API',
      );
    });
  });

  test('successfully removes selected tags', async () => {
    const user = userEvent.setup();

    renderTagActionsModal(
      {
        ...baseProps,
        tagActionType: 'removeFromTags',
        assigneeIds: ['member-1'],
      },
      [
        ...createBaseMocks(),
        {
          request: {
            query: UNASSIGN_USER_TAG,
            variables: { tagId: '2', userId: 'member-1' },
          },
          result: { data: { unassignUserTag: true } },
        },
      ] as MockedResponse[],
    );

    await waitFor(() => {
      expect(screen.getByText(/remove from tags/i)).toBeInTheDocument();
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('checkTag2'));
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.stringMatching(/successfully removed/i),
      );
    });
  });

  test('deselects a previously selected tag from selected list', async () => {
    const user = userEvent.setup();

    renderTagActionsModal(baseProps, createBaseMocks());

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('checkTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('clearSelectedTag2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('clearSelectedTag2'));

    await waitFor(() => {
      expect(screen.queryByTestId('clearSelectedTag2')).not.toBeInTheDocument();
      expect(screen.getByText(/no tag selected/i)).toBeInTheDocument();
    });
  });

  test('renders root folder query error', async () => {
    renderTagActionsModal(baseProps, [
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersFirst: 32,
          },
        },
        error: new Error('Root folders failed'),
      },
      baseTagsMock,
    ] as MockedResponse[]);

    await waitFor(() => {
      expect(screen.getByTestId('tagsQueryErrorMessage')).toHaveTextContent(
        'Root folders failed',
      );
    });
  });

  test('keeps loaded-empty folder stable across collapse and re-expand', async () => {
    const user = userEvent.setup();

    renderTagActionsModal(baseProps, [
      baseRootFoldersMock,
      {
        request: {
          query: ORGANIZATION_TAGS_WITH_FOLDER,
          variables: {
            id: '123',
            first: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tags: {
                edges: [],
                pageInfo: {
                  endCursor: null,
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: TAG_FOLDER_TREE_NODE,
          variables: {
            input: { id: 'folder-1' },
            childFoldersAfter: null,
            childFoldersFirst: 32,
          },
        },
        result: {
          data: {
            tagFolder: {
              id: 'folder-1',
              name: 'Operations',
              parentFolder: null,
              childFolders: {
                edges: [],
                pageInfo: {
                  endCursor: null,
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: TAG_FOLDER_TREE_NODE,
          variables: {
            input: { id: 'folder-1' },
            childFoldersAfter: null,
            childFoldersFirst: 32,
          },
        },
        result: {
          data: {
            tagFolder: {
              id: 'folder-1',
              name: 'Operations',
              parentFolder: null,
              childFolders: {
                edges: [],
                pageInfo: {
                  endCursor: null,
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
    ] as MockedResponse[]);

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByText('No tags found')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.queryByText('No tags found')).not.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByText('No tags found')).toBeInTheDocument();
    });
  });

  test('auto-paginates root folders and merges previous and next edges by id', async () => {
    renderTagActionsModal(baseProps, [
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersFirst: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tagFolders: {
                edges: [
                  {
                    node: {
                      id: 'folder-1',
                      name: 'Operations',
                      parentFolder: null,
                    },
                  },
                ],
                pageInfo: {
                  endCursor: 'folder-1',
                  hasNextPage: true,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersAfter: 'folder-1',
            tagFoldersFirst: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tagFolders: {
                edges: [
                  {
                    node: {
                      id: 'folder-1',
                      name: 'Operations (Updated)',
                      parentFolder: null,
                    },
                  },
                  {
                    node: {
                      id: 'folder-2',
                      name: 'Engineering',
                      parentFolder: null,
                    },
                  },
                ],
                pageInfo: {
                  endCursor: 'folder-2',
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_WITH_FOLDER,
          variables: {
            id: '123',
            first: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tags: {
                edges: [
                  {
                    node: {
                      id: '2',
                      name: 'Tag Two',
                      folder: { id: 'folder-1' },
                    },
                  },
                ],
                pageInfo: {
                  endCursor: '2',
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
    ] as MockedResponse[]);

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
      expect(screen.getByTestId('expandFolderfolder-2')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Engineering')).toHaveLength(1);
  });

  test('keeps previous root folders when fetchMore returns no organization', async () => {
    renderTagActionsModal(baseProps, [
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersFirst: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tagFolders: {
                edges: [
                  {
                    node: {
                      id: 'folder-1',
                      name: 'Operations',
                      parentFolder: null,
                    },
                  },
                ],
                pageInfo: {
                  endCursor: 'folder-1',
                  hasNextPage: true,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersAfter: 'folder-1',
            tagFoldersFirst: 32,
          },
        },
        result: {
          data: {},
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_WITH_FOLDER,
          variables: {
            id: '123',
            first: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tags: {
                edges: [],
                pageInfo: {
                  endCursor: null,
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
    ] as MockedResponse[]);

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('expandFolderfolder-2'),
    ).not.toBeInTheDocument();
  });

  test('skips tag fetchMore while auto pagination is already in progress', async () => {
    const user = userEvent.setup();

    renderTagActionsModal(baseProps, [
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersFirst: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tagFolders: {
                edges: [
                  {
                    node: {
                      id: 'folder-1',
                      name: 'Operations',
                      parentFolder: null,
                    },
                  },
                ],
                pageInfo: {
                  endCursor: 'folder-1',
                  hasNextPage: true,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersAfter: 'folder-1',
            tagFoldersFirst: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tagFolders: {
                edges: [
                  {
                    node: {
                      id: 'folder-2',
                      name: 'Engineering',
                      parentFolder: null,
                    },
                  },
                ],
                pageInfo: {
                  endCursor: 'folder-2',
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_WITH_FOLDER,
          variables: {
            id: '123',
            first: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tags: {
                edges: [
                  {
                    node: {
                      id: '2',
                      name: 'Tag Two',
                      folder: { id: 'folder-1' },
                    },
                  },
                ],
                pageInfo: {
                  endCursor: '2',
                  hasNextPage: true,
                },
              },
            },
          },
        },
      },
    ] as MockedResponse[]);

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
  });

  test('keeps previous tags when tag fetchMore returns no organization', async () => {
    const user = userEvent.setup();

    renderTagActionsModal(baseProps, [
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersFirst: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tagFolders: {
                edges: [
                  {
                    node: {
                      id: 'folder-1',
                      name: 'Operations',
                      parentFolder: null,
                    },
                  },
                ],
                pageInfo: {
                  endCursor: 'folder-1',
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_WITH_FOLDER,
          variables: {
            id: '123',
            first: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tags: {
                edges: [
                  {
                    node: {
                      id: '2',
                      name: 'Tag Two',
                      folder: { id: 'folder-1' },
                    },
                  },
                ],
                pageInfo: {
                  endCursor: '2',
                  hasNextPage: true,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_WITH_FOLDER,
          variables: {
            id: '123',
            after: '2',
            first: 32,
          },
        },
        result: {
          data: {},
        },
      },
    ] as MockedResponse[]);

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
      expect(screen.queryByTestId('checkTag3')).not.toBeInTheDocument();
    });
  });

  test('merges previous and next tags by id during tag fetchMore', async () => {
    const user = userEvent.setup();
    const isoDate = new Date().toISOString();

    renderTagActionsModal(baseProps, [
      {
        request: {
          query: ORGANIZATION_TAGS_AND_FOLDERS,
          variables: {
            id: '123',
            tagFoldersFirst: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tagFolders: {
                edges: [
                  {
                    node: {
                      id: 'folder-1',
                      name: 'Operations',
                      parentFolder: null,
                    },
                  },
                ],
                pageInfo: {
                  endCursor: 'folder-1',
                  hasNextPage: false,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_WITH_FOLDER,
          variables: {
            id: '123',
            first: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tags: {
                edges: [
                  {
                    node: {
                      id: '2',
                      name: 'Tag Two',
                      createdAt: isoDate,
                      creator: { id: 'user-1', name: 'User One' },
                      folder: { id: 'folder-1' },
                    },
                  },
                ],
                pageInfo: {
                  startCursor: '2',
                  endCursor: '2',
                  hasNextPage: true,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_TAGS_WITH_FOLDER,
          variables: {
            id: '123',
            after: '2',
            first: 32,
          },
        },
        result: {
          data: {
            organization: {
              id: '123',
              tags: {
                edges: [
                  {
                    node: {
                      id: '2',
                      name: 'Tag Two Updated',
                      createdAt: isoDate,
                      creator: { id: 'user-1', name: 'User One' },
                      folder: { id: 'folder-1' },
                    },
                  },
                  {
                    node: {
                      id: '3',
                      name: 'Tag Three',
                      createdAt: isoDate,
                      creator: { id: 'user-2', name: 'User Two' },
                      folder: { id: 'folder-1' },
                    },
                  },
                ],
                pageInfo: {
                  startCursor: '2',
                  endCursor: '3',
                  hasNextPage: false,
                  hasPreviousPage: true,
                },
              },
            },
          },
        },
      },
    ] as MockedResponse[]);

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByText('Tag Two Updated')).toBeInTheDocument();
      expect(screen.getByText('Tag Three')).toBeInTheDocument();
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('checkTag2')).toHaveLength(1);
  });

  test('resets local selection and search state when modal closes and reopens', async () => {
    const user = userEvent.setup();

    const Harness = (): JSX.Element => {
      const [open, setOpen] = React.useState(true);

      return (
        <>
          <button
            type="button"
            data-testid="reopenTagActionsModalBtn"
            onClick={() => setOpen(true)}
          >
            reopen
          </button>
          <TagActions
            tagActionsModalIsOpen={open}
            hideTagActionsModal={() => setOpen(false)}
            tagActionType="assignToTags"
            assigneeIds={['member-1']}
          />
        </>
      );
    };

    const link = new StaticMockLink(
      [...createBaseMocks(), ...createBaseMocks()] as MockedResponse[],
      true,
    );

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgtags/123/manageTag/1']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/admin/orgtags/:orgId/manageTag/:tagId"
                  element={<Harness />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('checkTag2'));
    await user.type(screen.getByTestId('searchByName'), 'Tag');

    await waitFor(() => {
      expect(screen.getAllByText('Tag Two').length).toBeGreaterThan(0);
      expect(screen.getByTestId('searchByName')).toHaveValue('Tag');
    });

    await user.click(screen.getByTestId('closeTagActionsModalBtn'));

    await waitFor(() => {
      expect(screen.queryByText(/assign to tags/i)).not.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('reopenTagActionsModalBtn'));

    await waitFor(() => {
      expect(screen.getByText(/assign to tags/i)).toBeInTheDocument();
      expect(screen.getByTestId('searchByName')).toHaveValue('');
      expect(screen.queryByTestId('checkTag2')).not.toBeInTheDocument();
    });
  });

  test('filters out non-matching tags when search term is provided', async () => {
    const user = userEvent.setup();

    renderTagActionsModal(baseProps, createBaseMocks());

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
      expect(screen.getByTestId('expandFolderfolder-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('expandFolderfolder-1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
    });

    await user.clear(screen.getByTestId('searchByName'));
    await user.type(screen.getByTestId('searchByName'), 'Three');
    await new Promise((resolve) => setTimeout(resolve, 400));

    await waitFor(() => {
      expect(screen.getByText('Tag Three')).toBeInTheDocument();
      expect(screen.queryByText('Tag Two')).not.toBeInTheDocument();
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
      expect(screen.queryByTestId('checkTag2')).not.toBeInTheDocument();
    });
  });
});
