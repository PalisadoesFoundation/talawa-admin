import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
import { useMinioUpload } from 'utils/MinioUpload';
import CreateGroupChat from './CreateGroupChat';
import {
  CREATE_CHAT,
  CREATE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import userEvent from '@testing-library/user-event';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({
      orgId: 'test-org-id',
    }),
  };
});

const mockUploadFileToMinio = vi
  .fn()
  .mockResolvedValue({ objectName: 'https://minio-test.com/test-image.jpg' });

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: vi.fn(() => ({ uploadFileToMinio: mockUploadFileToMinio })),
}));

vi.mock('shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay', () => ({
  ProfileAvatarDisplay: vi.fn(({ imageUrl, fallbackName, className }) => (
    <div
      data-testid="profileAvatar"
      data-image-url={imageUrl || ''}
      data-fallback-name={fallbackName}
      className={className}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={fallbackName || ''} />
      ) : (
        <div>{fallbackName}</div>
      )}
    </div>
  )),
}));

const { mockLocalStorageStore } = vi.hoisted(() => ({
  mockLocalStorageStore: {} as Record<string, unknown>,
}));

vi.mock('utils/useLocalstorage', () => {
  return {
    default: () => ({
      getItem: (key: string) => mockLocalStorageStore[key] || null,
      setItem: (key: string, value: unknown) => {
        mockLocalStorageStore[key] =
          typeof value === 'string' ? value : JSON.stringify(value);
      },
      removeItem: (key: string) => {
        delete mockLocalStorageStore[key];
      },
      clear: () => {
        for (const key in mockLocalStorageStore)
          delete mockLocalStorageStore[key];
      },
    }),
  };
});

const ORGANIZATION_MEMBERS_MOCK = {
  request: {
    query: ORGANIZATION_MEMBERS,
    variables: {
      input: { id: 'test-org-id' },
      first: 20,
      after: null,
      where: {},
    },
  },
  result: {
    data: {
      organization: {
        __typename: 'Organization',
        members: {
          __typename: 'OrganizationMemberConnection',
          edges: [
            {
              __typename: 'OrganizationMemberEdge',
              cursor: 'dGVzdC11c2VyLTE=',
              node: {
                __typename: 'User',
                id: 'user-1',
                name: 'Test User 1',
                avatarURL: '',
                role: 'Member',
              },
            },
            {
              __typename: 'OrganizationMemberEdge',
              cursor: 'dGVzdC11c2VyLTI=',
              node: {
                __typename: 'User',
                id: 'user-2',
                name: 'Test User 2',
                avatarURL: '',
                role: 'Admin',
              },
            },
          ],
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'dGVzdC11c2VyLTE=',
            endCursor: 'dGVzdC11c2VyLTI=',
          },
        },
      },
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
};

const ORGANIZATION_MEMBERS_SEARCH_MOCK = {
  request: {
    query: ORGANIZATION_MEMBERS,
    variables: {
      input: { id: 'test-org-id' },
      first: 20,
      after: null,
      where: { name_contains: 'Test User 1' },
    },
  },
  result: {
    data: {
      organization: {
        __typename: 'Organization',
        members: {
          __typename: 'OrganizationMemberConnection',
          edges: [
            {
              __typename: 'OrganizationMemberEdge',
              cursor: 'dGVzdC11c2VyLTE=',
              node: {
                __typename: 'User',
                id: 'user-1',
                name: 'Test User 1',
                avatarURL: '',
                role: 'Member',
              },
            },
          ],
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'dGVzdC11c2VyLTE=',
            endCursor: 'dGVzdC11c2VyLTE=',
          },
        },
      },
    },
  },
};

const CREATE_CHAT_MOCK = {
  request: {
    query: CREATE_CHAT,
    variables: {
      input: {
        organizationId: 'test-org-id',
        name: 'Test Group',
        description: 'Test Description',
        avatar: 'https://minio-test.com/test-image.jpg',
      },
    },
  },
  result: {
    data: {
      createChat: {
        __typename: 'Chat',
        id: 'new-chat-id',
        name: 'Test Group',
        description: 'Test Description',
        organization: {
          __typename: 'Organization',
          id: 'test-org-id',
          name: 'Test Org Name',
        },
      },
    },
  },
};

const CREATE_CHAT_MOCK_NO_AVATAR = {
  request: {
    query: CREATE_CHAT,
    variables: {
      input: {
        organizationId: 'test-org-id',
        name: 'Test Group',
        description: 'Test Description',
        avatar: null,
      },
    },
  },
  result: {
    data: {
      createChat: {
        __typename: 'Chat',
        id: 'new-chat-id-no-avatar',
        name: 'Test Group',
        description: 'Test Description',
        organization: {
          __typename: 'Organization',
          id: 'test-org-id',
          name: 'Test Org Name',
        },
      },
    },
  },
};

const CREATE_CHAT_MEMBERSHIP_ADMIN_MOCK = {
  request: {
    query: CREATE_CHAT_MEMBERSHIP,
    variables: {
      input: {
        memberId: '1',
        chatId: 'new-chat-id',
        role: 'administrator',
      },
    },
  },
  result: {
    data: {
      createChatMembership: {
        __typename: 'ChatMembership',
        id: 'membership-admin',
        name: 'Test Group',
        description: 'Test Description',
      },
    },
  },
};

const CREATE_CHAT_MEMBERSHIP_MEMBER_MOCK = {
  request: {
    query: CREATE_CHAT_MEMBERSHIP,
    variables: {
      input: {
        memberId: 'user-1',
        chatId: 'new-chat-id',
        role: 'regular',
      },
    },
  },
  result: {
    data: {
      createChatMembership: {
        __typename: 'ChatMembership',
        id: 'membership-member-1',
        name: 'Test Group',
        description: 'Test Description',
      },
    },
  },
};

const CREATE_CHAT_MEMBERSHIP_ADMIN_MOCK_NO_AVATAR = {
  request: {
    query: CREATE_CHAT_MEMBERSHIP,
    variables: {
      input: {
        memberId: '1',
        chatId: 'new-chat-id-no-avatar',
        role: 'administrator',
      },
    },
  },
  result: {
    data: {
      createChatMembership: {
        __typename: 'ChatMembership',
        id: 'membership-admin-no-avatar',
        name: 'Test Group',
        description: 'Test Description',
      },
    },
  },
};

const mocks = [
  ORGANIZATION_MEMBERS_MOCK,
  ORGANIZATION_MEMBERS_SEARCH_MOCK,
  CREATE_CHAT_MOCK,
  CREATE_CHAT_MEMBERSHIP_ADMIN_MOCK,
  CREATE_CHAT_MEMBERSHIP_MEMBER_MOCK,
];

const mocksNoAvatar = [
  ORGANIZATION_MEMBERS_MOCK,
  ORGANIZATION_MEMBERS_SEARCH_MOCK,
  CREATE_CHAT_MOCK_NO_AVATAR,
  CREATE_CHAT_MEMBERSHIP_ADMIN_MOCK_NO_AVATAR,
];

describe('CreateGroupChat', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  const { setItem } = useLocalStorage();
  const toggleCreateGroupChatModal = vi.fn();
  const chatsListRefetch = vi.fn();

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    for (const key in mockLocalStorageStore) {
      delete mockLocalStorageStore[key];
    }
    setItem('userId', '1');
    user = userEvent.setup();
  });

  test('should create a group chat successfully, allowing adding/removing members', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Modal 1: Create Group
    expect(screen.getByTestId('createGroupChatModal')).toBeInTheDocument();
    expect(screen.getByText('New Group')).toBeInTheDocument();

    // Fill form
    const groupTitleInput = screen.getByTestId('groupTitleInput');
    await user.clear(groupTitleInput);
    await user.type(groupTitleInput, 'Test Group');

    const groupDescriptionInput = screen.getByTestId('groupDescriptionInput');
    await user.clear(groupDescriptionInput);
    await user.type(groupDescriptionInput, 'Test Description');

    // Upload image
    const fileInput = screen.getByTestId('fileInput');
    const file = new File(['(⌐□_□)'], 'chucknorris.png', {
      type: 'image/png',
    });
    await user.upload(fileInput, file);

    // Wait for the async state update to be reflected in the DOM
    await waitFor(() => {
      const profileAvatar = screen.getByTestId('profileAvatar');
      expect(profileAvatar).toHaveAttribute(
        'data-image-url',
        'https://minio-test.com/test-image.jpg',
      );
      const image = screen.getByAltText(/Test Group/i);
      expect(image).toHaveAttribute(
        'src',
        'https://minio-test.com/test-image.jpg',
      );
    });

    // Go to next modal
    await user.click(screen.getByTestId('nextBtn'));

    // Modal 2: Add users
    await waitFor(() => {
      expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();
    });

    // Wait for users to load
    await waitFor(async () => {
      const userRows = await screen.findAllByTestId('user');
      expect(userRows.length).toBe(2);
      expect(userRows[0]).toHaveTextContent('Test User 1');
      expect(userRows[1]).toHaveTextContent('Test User 2');
    });

    // Add a user
    const addButtons = await screen.findAllByTestId('addBtn');
    await user.click(addButtons[0]);

    // Verify user is added
    const removeBtn = await screen.findByTestId('removeBtn');
    expect(removeBtn).toBeInTheDocument();

    // Remove user
    await user.click(removeBtn);

    // Verify user is removed
    const addButtonAgain = await screen.findAllByTestId('addBtn');
    expect(addButtonAgain[0]).toBeInTheDocument();

    // Add user back
    await user.click(addButtonAgain[0]);
    await screen.findByTestId('removeBtn');

    // Create group
    await user.click(screen.getByTestId('createBtn'));

    // Final assertions
    await waitFor(() => {
      expect(chatsListRefetch).toHaveBeenCalled();
    });
    expect(toggleCreateGroupChatModal).toHaveBeenCalled();
  });

  test('should clear selectedImage and description after successful group creation', async () => {
    const { rerender } = render(
      <MockedProvider mocks={mocksNoAvatar}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Fill in form with description
    const groupTitleInput = screen.getByTestId('groupTitleInput');
    await user.clear(groupTitleInput);
    await user.type(groupTitleInput, 'Test Group');

    const groupDescriptionInput = screen.getByTestId('groupDescriptionInput');
    await user.clear(groupDescriptionInput);
    await user.type(groupDescriptionInput, 'Test Description');

    // Go to next modal
    await user.click(screen.getByTestId('nextBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();
    });

    // Create the group
    await user.click(screen.getByTestId('createBtn'));

    await waitFor(() => {
      expect(chatsListRefetch).toHaveBeenCalled();
    });

    // Reopen modal to verify state was cleared
    rerender(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Verify description is cleared
    const freshGroupDescriptionInput = screen.getByTestId(
      'groupDescriptionInput',
    );
    expect(freshGroupDescriptionInput).toHaveValue('');
  });

  test('should clear selectedImage and description when modal is cancelled', async () => {
    const { rerender } = render(
      <MockedProvider mocks={mocksNoAvatar}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Fill in form with description
    const groupTitleInput = screen.getByTestId('groupTitleInput');
    await user.clear(groupTitleInput);
    await user.type(groupTitleInput, 'Test Group');

    const groupDescriptionInput = screen.getByTestId('groupDescriptionInput');
    await user.clear(groupDescriptionInput);
    await user.type(groupDescriptionInput, 'Test Description');

    // Close the modal (cancel)
    const closeButton = screen.getByTestId('modalCloseBtn');
    await user.click(closeButton);

    await waitFor(() => {
      expect(toggleCreateGroupChatModal).toHaveBeenCalled();
    });

    // Reopen modal to verify state was cleared
    rerender(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Verify description is cleared
    const freshGroupDescriptionInput = screen.getByTestId(
      'groupDescriptionInput',
    );
    expect(freshGroupDescriptionInput).toHaveValue('');
  });

  test('should allow searching for users', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Go to add users modal
    await user.click(screen.getByTestId('nextBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();
    });

    await waitFor(async () => {
      const userRows = await screen.findAllByTestId('user');
      expect(userRows.length).toBe(2);
    });

    // Search for a user
    const searchInput = screen.getByTestId('searchUser');
    const searchButton = screen.getByTestId('submitBtn');
    await user.clear(searchInput);
    await user.type(searchInput, 'Test User 1');
    await user.click(searchButton);

    // Assert search results
    await waitFor(async () => {
      const userRows = await screen.findAllByTestId('user');
      expect(userRows.length).toBe(1);
      expect(userRows[0]).toHaveTextContent('Test User 1');
      expect(screen.queryByText('Test User 2')).not.toBeInTheDocument();
    });
  });

  test('should create a group chat without an image', async () => {
    const CREATE_CHAT_NO_AVATAR_MOCK = {
      request: {
        query: CREATE_CHAT,
        variables: {
          input: {
            organizationId: 'test-org-id',
            name: 'No Avatar Group',
            description: '',
            avatar: null,
          },
        },
      },
      result: {
        data: {
          createChat: {
            __typename: 'Chat',
            id: 'no-avatar-chat-id',
            name: 'No Avatar Group',
            description: '',
            organization: {
              __typename: 'Organization',
              id: 'test-org-id',
              name: 'Test Org Name',
            },
          },
        },
      },
    };
    const CREATE_CHAT_MEMBERSHIP_ADMIN_NO_AVATAR_MOCK = {
      request: {
        query: CREATE_CHAT_MEMBERSHIP,
        variables: {
          input: {
            memberId: '1',
            chatId: 'no-avatar-chat-id',
            role: 'administrator',
          },
        },
      },
      result: {
        data: {
          createChatMembership: {
            __typename: 'ChatMembership',
            id: 'membership-admin-no-avatar',
            role: 'administrator',
            user: { __typename: 'User', id: '1' },
          },
        },
      },
    };

    const localMocks = [
      ORGANIZATION_MEMBERS_MOCK,
      CREATE_CHAT_NO_AVATAR_MOCK,
      CREATE_CHAT_MEMBERSHIP_ADMIN_NO_AVATAR_MOCK,
    ];

    render(
      <MockedProvider mocks={localMocks}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    const groupTitleInput = screen.getByTestId('groupTitleInput');
    await user.clear(groupTitleInput);
    await user.type(groupTitleInput, 'No Avatar Group');

    await user.click(screen.getByTestId('nextBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('createBtn'));

    await waitFor(() => {
      expect(chatsListRefetch).toHaveBeenCalled();
    });
    expect(toggleCreateGroupChatModal).toHaveBeenCalled();
  });

  test('should handle image upload failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockUploadFileToMinioFailure = vi
      .fn()
      .mockRejectedValue(new Error('Upload failed'));

    vi.mocked(useMinioUpload).mockReturnValue({
      uploadFileToMinio: mockUploadFileToMinioFailure,
    });

    try {
      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <Provider store={store}>
              <CreateGroupChat
                createGroupChatModalisOpen={true}
                toggleCreateGroupChatModal={toggleCreateGroupChatModal}
                chatsListRefetch={chatsListRefetch}
              />
            </Provider>
          </I18nextProvider>
        </MockedProvider>,
      );

      const fileInput = screen.getByTestId('fileInput');
      const file = new File(['(⌐□_□)'], 'chucknorris.png', {
        type: 'image/png',
      });
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error uploading image to MinIO:',
          expect.any(Error),
        );
      });
    } finally {
      consoleSpy.mockRestore();

      // Restore the original mock implementation
      vi.mocked(useMinioUpload).mockReturnValue({
        uploadFileToMinio: mockUploadFileToMinio,
      });
    }
  });

  test('should handle edit image button click', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    const editBtn = screen.getByTestId('editImageBtn');
    const fileInput = screen.getByTestId('fileInput');
    const clickSpy = vi.spyOn(fileInput, 'click');

    await user.click(editBtn);
    expect(clickSpy).toHaveBeenCalled();
  });

  test('should clear search input', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateGroupChat
              createGroupChatModalisOpen={true}
              toggleCreateGroupChatModal={toggleCreateGroupChatModal}
              chatsListRefetch={chatsListRefetch}
            />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('nextBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchUser');
    await user.clear(searchInput);
    await user.type(searchInput, 'Test User');
    expect(searchInput).toHaveValue('Test User');

    const clearBtn = screen.getByLabelText('Clear');
    await user.click(clearBtn);

    expect(searchInput).toHaveValue('');
  });
});
