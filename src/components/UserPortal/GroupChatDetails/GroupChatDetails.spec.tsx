import React from 'react';
import { render, screen, act, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupChatDetails from './GroupChatDetails';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useLocalStorage } from 'utils/useLocalstorage';
import { vi } from 'vitest';
import {
  mocks,
  filledMockChat,
  incompleteMockChat,
  failingMocks,
  delayedMocks,
} from './GroupChatDetailsMocks';
import type { Chat as ChatType } from 'types/UserPortal/Chat/interface';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

// Mock MinIO hooks used for uploading/downloading files
vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({
    uploadFileToMinio: vi.fn().mockResolvedValue({ objectName: 'object1' }),
  }),
}));

vi.mock('utils/MinioDownload', () => ({
  useMinioDownload: () => ({
    getFileFromMinio: vi.fn().mockResolvedValue('https://minio/object1'),
  }),
}));

vi.mock('shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay', () => ({
  ProfileAvatarDisplay: ({
    imageUrl,
    fallbackName,
  }: {
    imageUrl?: string;
    fallbackName: string;
  }) => (
    <div data-testid="mock-profile-avatar-display">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={fallbackName}
          data-testid="mock-profile-image"
        />
      ) : (
        <div data-testid="mock-profile-fallback">{fallbackName}</div>
      )}
    </div>
  ),
}));

const { mockLocalStorageStore } = vi.hoisted(() => ({
  mockLocalStorageStore: {} as Record<string, unknown>,
}));

vi.mock('utils/useLocalstorage', () => {
  const useLocalStorageMock = () => ({
    getItem: (key: string) => mockLocalStorageStore[key] || null,
    setItem: (key: string, value: unknown) => {
      mockLocalStorageStore[key] = value;
    },
    removeItem: (key: string) => {
      delete mockLocalStorageStore[key];
    },
    getStorageKey: (key: string) => key,
    clear: () => {
      for (const key in mockLocalStorageStore)
        delete mockLocalStorageStore[key];
    },
  });
  return {
    useLocalStorage: useLocalStorageMock,
    default: useLocalStorageMock,
  };
});

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  ns: ['translation', 'common'],
  defaultNS: 'translation',

  resources: {
    en: {
      translation: {
        userChat: {
          // Keys (for checking title/toast keys)
          Error: 'Error',
          groupInfo: 'Group Info',
          failedToUpdateChatName: 'Failed to update chat name',
          failedToUpdateChatImage: 'Failed to update chat image',
          userNotFound: 'User not found',
          members: 'members',
          addMembers: 'Add Members',
          promoteToAdmin: 'Promote to Admin',
          demoteToRegular: 'Demote to Regular',
          remove: 'Remove',
          roleUpdatedSuccessfully: 'Role updated successfully',
          failedToUpdateRole: 'Failed to update role',
          memberRemovedSuccessfully: 'Member removed successfully',
          failedToRemoveMember: 'Failed to remove member',
          chatDeletedSuccessfully: 'Chat deleted successfully',
          failedToDeleteChat: 'Failed to delete chat',
          chatNameUpdatedSuccessfully: 'Chat name updated successfully',
          failedToAddUser: 'Failed to add user',
          userAddedSuccessfully: 'User added successfully',
        },
      },
      common: {
        // This maps the lowercase key 'clear' to the Uppercase label the test expects
        clear: 'Clear',
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

describe('GroupChatDetails', () => {
  let testCache: InMemoryCache;

  beforeEach(() => {
    testCache = new InMemoryCache();

    for (const key in mockLocalStorageStore) {
      delete mockLocalStorageStore[key];
    }
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  type MaybeChat = Partial<ChatType>;

  const withSafeChat = (raw: unknown): ChatType => {
    const chat = (raw as MaybeChat) || {};
    const orgId = chat.organization?.id ?? 'org123';
    const createdAtValue = (chat as { createdAt?: string | Date }).createdAt;
    const updatedAtValue = (chat as { updatedAt?: string | null }).updatedAt;

    return {
      id: chat.id ?? 'chat1',
      name: chat.name ?? '',
      description: chat.description,
      avatarMimeType: chat.avatarMimeType,
      avatarURL: chat.avatarURL,
      isGroup: chat.isGroup ?? true,
      createdAt:
        typeof createdAtValue === 'string'
          ? createdAtValue
          : createdAtValue instanceof Date
            ? createdAtValue.toISOString()
            : new Date(0).toISOString(),
      updatedAt:
        typeof updatedAtValue === 'string' || updatedAtValue === null
          ? updatedAtValue
          : null,
      unreadMessagesCount: chat.unreadMessagesCount,
      hasUnread: chat.hasUnread,
      firstUnreadMessageId: chat.firstUnreadMessageId,
      lastMessage: chat.lastMessage,
      organization: {
        id: orgId,
        name: chat.organization?.name ?? '',
        countryCode: chat.organization?.countryCode,
      },
      creator: chat.creator,
      updater: chat.updater,
      members: chat.members ?? { edges: [] },
      messages: chat.messages ?? { edges: [] },
    };
  };

  it('renders Error modal if userId is not in localStorage', () => {
    const toastSpy = vi.spyOn(NotificationToast, 'error');

    useLocalStorage().setItem('userId', null);

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(incompleteMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('User not found')).toBeInTheDocument();
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith('User not found');
  });

  it('renders correctly without name and image', async () => {
    const toastSpy = vi.spyOn(NotificationToast, 'error');
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(incompleteMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(toastSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByText('Group Info')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    await userEvent.click(closeButton);
  });

  it('renders correctly', async () => {
    const toastSpy = vi.spyOn(NotificationToast, 'error');
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(toastSpy).toHaveBeenCalledTimes(0);
    const testGroupElements = screen.getAllByText('Test Group');
    expect(testGroupElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    await userEvent.click(closeButton);
  });

  it('renders ProfileAvatarDisplay for group and members', () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    // Group Avatar (Main)
    const avatars = screen.getAllByTestId('mock-profile-avatar-display');
    expect(avatars.length).toBeGreaterThan(0);
    // filledMockChat has avatarURL? We verify at least one image/fallback shows up.
    // filledMockChat in GroupChatDetailsMocks likely has an image or at least a name.
    const images = screen.queryAllByTestId('mock-profile-image');
    const fallbacks = screen.queryAllByTestId('mock-profile-fallback');
    expect(images.length + fallbacks.length).toBeGreaterThan(0);
  });

  it('cancelling editing chat title', async () => {
    useLocalStorage().setItem('userId', '2');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(incompleteMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('cancelEditBtn')).toBeInTheDocument();
    });

    act(() => {
      userEvent.click(screen.getByTestId('cancelEditBtn'));
    });

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('edit chat title', async () => {
    useLocalStorage().setItem('userId', '2');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('chatNameInput')).toBeInTheDocument();
    });

    await act(async () => {
      const chatNameInput = await screen.findByTestId('chatNameInput');
      await userEvent.clear(chatNameInput);
      await userEvent.type(chatNameInput, 'New Group name');
    });

    await act(async () => {
      userEvent.click(await screen.findByTestId('updateTitleBtn'));
    });

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('add user to group chat using first name', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const toastSuccess = vi.spyOn(NotificationToast, 'success');
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      const searchUserInput = await screen.findByTestId('searchUser');
      await userEvent.type(searchUserInput, 'Disha');
    });

    await act(async () => {
      userEvent.click(await screen.findByTestId('searchBtn'));
    });

    await waitFor(
      async () => {
        expect(await screen.findByTestId('user')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('addUserBtn'));
    });
    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('User added successfully');
    });
  });

  it('add user to group chat using last name', async () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      const searchUserInput = await screen.findByTestId('searchUser');
      await userEvent.type(searchUserInput, 'Smith');
    });

    await act(async () => {
      userEvent.click(await screen.findByTestId('searchBtn'));
    });
  });

  it('clears user search input', async () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId('searchUser');
    await act(async () => {
      await userEvent.type(searchInput, 'Smith');
    });

    expect(searchInput).toHaveValue('Smith');

    // Find clear button (rendered by SearchBar when value is not empty)
    // SearchBar renders a button with aria-label='Clear'
    const clearBtn = await screen.findByLabelText('Clear');
    await act(async () => {
      userEvent.click(clearBtn);
    });

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });
  });

  it('handling invalid image type', async () => {
    useLocalStorage().setItem('userId', 'user1');
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editImageBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    await act(async () => {
      userEvent.click(await screen.findByTestId('editImageBtn'));
    });

    const fileInput = screen.getByTestId('fileInput');

    Object.defineProperty(fileInput, 'files', {
      value: null,
    });

    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  });

  it('changes role and removes member via dropdown actions', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const toastSuccess = vi.spyOn(NotificationToast, 'success');

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
          { node: { user: { id: 'user2', name: 'Bob' }, role: 'regular' } },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const aliceElements = screen.getAllByText('Alice');
      expect(aliceElements.length).toBeGreaterThan(0);
    });

    const dropdownToggle = await screen.findByTestId(
      'member-actions-user2-toggle',
    );
    if (!dropdownToggle) throw new Error('Dropdown not found');
    await act(async () => await userEvent.click(dropdownToggle));

    const promoteItem = await screen.findByTestId(
      'member-actions-user2-item-roleChange',
    );
    await act(async () => await userEvent.click(promoteItem));

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Role updated successfully'),
    );

    const removeBtn = screen.queryByText(/Remove/);
    if (removeBtn) {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      await act(async () => await userEvent.click(removeBtn));
      await waitFor(() =>
        expect(toastSuccess).toHaveBeenCalledWith(
          'Member removed successfully',
        ),
      );
    }
  });

  it('shows error toast when role update fails', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const toastError = vi.spyOn(NotificationToast, 'error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
          { node: { user: { id: 'user2', name: 'Bob' }, role: 'regular' } },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={failingMocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const aliceElements = screen.getAllByText('Alice');
      expect(aliceElements.length).toBeGreaterThan(0);
    });

    const dropdownToggle = await screen.findByTestId(
      'member-actions-user2-toggle',
    );
    await act(async () => {
      userEvent.click(dropdownToggle);
    });

    if (!dropdownToggle) throw new Error('Dropdown not found');
    await act(async () => await userEvent.click(dropdownToggle));

    const promoteItem = await screen.findByText(/Promote|Demote/i);

    await act(async () => await userEvent.click(promoteItem));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to update role');
      expect(consoleError).toHaveBeenCalled();
    });
  });

  it('shows error toast when removing member fails', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const toastError = vi.spyOn(NotificationToast, 'error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
          { node: { user: { id: 'user2', name: 'Bob' }, role: 'regular' } },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={failingMocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const aliceElements = screen.getAllByText('Alice');
      expect(aliceElements.length).toBeGreaterThan(0);
    });
    const dropdownToggle = await screen.findByTestId(
      'member-actions-user2-toggle',
    );
    await act(async () => {
      userEvent.click(dropdownToggle);
    });

    if (!dropdownToggle) throw new Error('Dropdown not found');
    await act(async () => await userEvent.click(dropdownToggle));

    const removeItem = await screen.findByText(/Remove/i);

    await act(async () => await userEvent.click(removeItem));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to remove member');
      expect(consoleError).toHaveBeenCalled();
    });
  });

  it('uploads image and updates chat avatar', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const chatRefetch = vi.fn();

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={chatRefetch}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(async () => {
      expect(await screen.findByTestId('editImageBtn')).toBeInTheDocument();
    });

    await act(async () => {
      userEvent.click(await screen.findByTestId('editImageBtn'));
    });

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    await act(async () => {
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // ensure chatRefetch was called after upload
    await waitFor(() => expect(chatRefetch).toHaveBeenCalled());
  });

  it('deletes chat when current user is administrator and confirms', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    // Wait for delete (trash) button to be present
    // Wait for delete (trash) button to be present
    expect(
      await screen.findByRole('button', { name: /delete/i }, { timeout: 3000 }),
    ).toBeTruthy();

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const toastSuccess = vi.spyOn(NotificationToast, 'success');

    const trashButton = screen.getByRole('button', { name: /delete/i });
    await act(async () => await userEvent.click(trashButton));

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Chat deleted successfully'),
    );
  });

  it('does not delete chat if user cancels confirmation', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const toastSuccess = vi.spyOn(NotificationToast, 'success');

    await act(async () => {
      await userEvent.click(deleteBtn);
    });

    expect(confirmSpy).toHaveBeenCalled();
    expect(toastSuccess).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('does not remove member if user cancels confirmation', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const toastSuccess = vi.spyOn(NotificationToast, 'success');

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
          { node: { user: { id: 'user2', name: 'Bob' }, role: 'regular' } },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const aliceElements = screen.getAllByText('Alice');
      expect(aliceElements.length).toBeGreaterThan(0);
    });

    const toggles = await screen.findAllByRole('button');
    const dropdownToggle = toggles.find(
      (btn) => btn.id && btn.id.startsWith('dropdown-'),
    );
    if (!dropdownToggle) throw new Error('Dropdown not found');

    await act(async () => await userEvent.click(dropdownToggle));

    const removeBtn = screen.queryByText(/Remove/);
    if (!removeBtn) throw new Error('Remove button not found');

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await act(async () => await userEvent.click(removeBtn));

    expect(confirmSpy).toHaveBeenCalled();
    expect(toastSuccess).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('show error toast while deleting chat when current user is administrator and confirms', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const toastError = vi.spyOn(NotificationToast, 'error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={failingMocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    // Wait for delete (trash) button to be present
    // Wait for delete (trash) button to be present
    expect(
      await screen.findByRole('button', { name: /delete/i }, { timeout: 3000 }),
    ).toBeTruthy();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const trashButton = screen.getByRole('button', { name: /delete/i });
    await act(async () => await userEvent.click(trashButton));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to delete chat');
      expect(consoleError).toHaveBeenCalled();
    });
  });
  it('shows error toast when title update fails', async () => {
    useLocalStorage().setItem('userId', '2');
    const toastError = vi.spyOn(NotificationToast, 'error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user2', name: 'Alice' },
              role: 'administrator',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={failingMocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await act(async () => {
      await userEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await act(async () => {
      const chatNameInput = await screen.findByTestId('chatNameInput');
      await userEvent.clear(chatNameInput);
      await userEvent.type(chatNameInput, 'New Name');
    });

    await act(async () => {
      await userEvent.click(await screen.findByTestId('updateTitleBtn'));
    });

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to update chat name');
      expect(consoleError).toHaveBeenCalled();
    });
  });

  it('shows error toast when image upload fails', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const toastError = vi.spyOn(NotificationToast, 'error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={failingMocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(async () => {
      expect(await screen.findByTestId('editImageBtn')).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(await screen.findByTestId('editImageBtn'));
    });

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    const file = new File(['content'], 'test.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    await act(async () => {
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to update chat image');
      expect(consoleError).toHaveBeenCalled();
    });
  });

  it('demotes administrator to regular member', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const toastSuccess = vi.spyOn(NotificationToast, 'success');

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
          {
            node: {
              user: { id: 'user2', name: 'Charlie' },
              role: 'administrator',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const charlieElements = screen.getAllByText('Charlie');
      expect(charlieElements.length).toBeGreaterThan(0);
    });

    const dropdownToggle = await screen.findByTestId(
      'member-actions-user2-toggle',
    );
    await act(async () => {
      userEvent.click(dropdownToggle);
    });

    await waitFor(async () => {
      expect(
        await screen.findByTestId('member-actions-user2-item-roleChange'),
      ).toBeInTheDocument();
    });

    const demoteItem = await screen.findByTestId(
      'member-actions-user2-item-roleChange',
    );
    await act(async () => {
      userEvent.click(demoteItem);
    });

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Role updated successfully'),
    );
  });
  it('does not show remove option for administrator members', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
          {
            node: {
              user: { id: 'user2', name: 'Dave' },
              role: 'administrator',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const daveElements = screen.getAllByText('Dave');
      expect(daveElements.length).toBeGreaterThan(0);
    });

    const dropdownToggle = await screen.findByTestId(
      'member-actions-user2-toggle',
    );
    await act(async () => {
      userEvent.click(dropdownToggle);
    });

    const removeItem = screen.queryByTestId(
      'member-actions-user2-item-removeMember',
    );
    expect(removeItem).not.toBeInTheDocument();
  });

  it('removes a regular member with confirmation', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const toastSuccess = vi.spyOn(NotificationToast, 'success');

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
          {
            node: {
              user: { id: 'user2', name: 'Eve' },
              role: 'regular',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const eveElements = screen.getAllByText('Eve');
      expect(eveElements.length).toBeGreaterThan(0);
    });

    const dropdownToggle = await screen.findByTestId(
      'member-actions-user2-toggle',
    );
    await act(async () => {
      userEvent.click(dropdownToggle);
    });

    const removeItem = await screen.findByTestId(
      'member-actions-user2-item-removeMember',
    );
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await act(async () => {
      userEvent.click(removeItem);
    });

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Member removed successfully'),
    );
  });

  it('cancels member removal when user declines confirmation', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const toastSuccess = vi.spyOn(NotificationToast, 'success');

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
          {
            node: {
              user: { id: 'user2', name: 'Frank' },
              role: 'regular',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const frankElements = screen.getAllByText('Frank');
      expect(frankElements.length).toBeGreaterThan(0);
    });

    const dropdownToggle = await screen.findByTestId(
      'member-actions-user2-toggle',
    );
    await act(async () => {
      userEvent.click(dropdownToggle);
    });

    const removeItem = await screen.findByTestId(
      'member-actions-user2-item-removeMember',
    );
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await act(async () => {
      userEvent.click(removeItem);
    });

    expect(toastSuccess).not.toHaveBeenCalled();
  });

  it('shows error toast when adding user fails', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const toastError = vi.spyOn(NotificationToast, 'error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={failingMocks} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      const searchUserInput = await screen.findByTestId('searchUser');
      await userEvent.type(searchUserInput, 'Disha');
    });

    await act(async () => {
      userEvent.click(await screen.findByTestId('searchBtn'));
    });

    await waitFor(
      async () => {
        expect(await screen.findByTestId('user')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('addUserBtn'));
    });

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to add user');
      expect(consoleError).toHaveBeenCalled();
    });
  });

  describe('LoadingState Behavior', () => {
    it('should show LoadingState spinner while chat details are loading', async () => {
      useLocalStorage().setItem('userId', 'user1');

      render(
        <I18nextProvider i18n={i18n}>
          <MockedProvider mocks={delayedMocks} cache={testCache}>
            <GroupChatDetails
              toggleGroupChatDetailsModal={vi.fn()}
              groupChatDetailsModalisOpen={true}
              chat={withSafeChat(filledMockChat)}
              chatRefetch={vi.fn()}
            />
          </MockedProvider>
        </I18nextProvider>,
      );

      // Click "Add Members" to open the modal that triggers ORGANIZATION_MEMBERS query
      const addMembersBtn = screen.getByTestId('addMembers');
      await act(async () => {
        await userEvent.click(addMembersBtn);
      });

      // Wait for spinner to appear during the ORGANIZATION_MEMBERS query loading
      await waitFor(
        () => {
          const spinner = document.querySelector('[data-testid="spinner"]');
          expect(spinner).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it('should hide spinner and render chat details after LoadingState completes', async () => {
      useLocalStorage().setItem('userId', 'user1');

      render(
        <I18nextProvider i18n={i18n}>
          <MockedProvider mocks={mocks} cache={testCache}>
            <GroupChatDetails
              toggleGroupChatDetailsModal={vi.fn()}
              groupChatDetailsModalisOpen={true}
              chat={withSafeChat(filledMockChat)}
              chatRefetch={vi.fn()}
            />
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('editImageBtn')).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      const spinners = screen.queryAllByTestId('spinner');
      const visibleSpinners = spinners.filter((spinner) => {
        const parent = spinner.closest('[data-testid="loadingContainer"]');
        return parent && !parent.classList.contains('hidden');
      });
      expect(visibleSpinners.length).toBe(0);
    });
  });

  it('shows error toast when chat name update fails', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const toastError = vi.spyOn(NotificationToast, 'error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={[...failingMocks, ...mocks]} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const editBtn = await screen.findByTestId('editTitleBtn');
    await userEvent.click(editBtn);

    const input = await screen.findByTestId('chatNameInput');
    await userEvent.clear(input);
    await userEvent.type(input, 'New Name');

    const updateBtn = await screen.findByTestId('updateTitleBtn');
    await userEvent.click(updateBtn);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to update chat name');
      expect(consoleError).toHaveBeenCalled();
    });

    toastError.mockRestore();
    consoleError.mockRestore();
  });

  it('shows error toast when chat deletion fails', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const toastError = vi.spyOn(NotificationToast, 'error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const adminChat = withSafeChat({
      ...filledMockChat,
      members: {
        edges: [
          {
            node: {
              user: { id: 'user1', name: 'Alice' },
              role: 'administrator',
            },
          },
        ],
      },
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={[...failingMocks, ...mocks]} cache={testCache}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to delete chat');
      expect(consoleError).toHaveBeenCalled();
    });

    toastError.mockRestore();
    consoleError.mockRestore();
  });
});
