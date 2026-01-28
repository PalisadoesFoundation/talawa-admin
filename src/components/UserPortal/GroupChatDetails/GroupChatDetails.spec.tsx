import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
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
} from './GroupChatDetailsMocks';
import type { NewChatType } from 'types/UserPortal/Chat/interface';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

// Standardized cache configuration for Apollo MockedProvider
const testCache = new InMemoryCache();

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

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('GroupChatDetails', () => {
  beforeEach(() => {
    for (const key in mockLocalStorageStore) {
      delete mockLocalStorageStore[key];
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  type MaybeChat = Partial<NewChatType> & { _id?: string };

  const withSafeChat = (raw: unknown): NewChatType => {
    const chat = (raw as MaybeChat) || {};
    const orgId = chat.organization?.id ?? 'org123';
    const createdAtValue = (chat as { createdAt?: string | Date }).createdAt;
    const updatedAtValue = (chat as { updatedAt?: string | null }).updatedAt;

    return {
      id: (chat as { _id?: string; id?: string })._id ?? chat.id ?? 'chat1',
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

  it('renders correctly without name and image', () => {
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

    userEvent.click(closeButton);
  });

  it('renders correctly', () => {
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

    userEvent.click(closeButton);
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

    await wait();

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

    await wait();

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

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('add user to group chat using first name', async () => {
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

    await wait();
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

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('user')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      userEvent.click(await screen.findByTestId('addUserBtn'));
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

    await wait();
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

    await wait();
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

    await wait();
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

    await wait();

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

    const toggles = await screen.findAllByRole('button');
    const dropdownToggle = toggles.find(
      (btn) => btn.id && btn.id.startsWith('dropdown-'),
    );
    if (dropdownToggle) await act(async () => userEvent.click(dropdownToggle));

    const promoteText = await screen.findByText(
      /Promote to Admin|Demote to Regular/,
    );
    await act(async () => userEvent.click(promoteText));

    // wait for role change toast
    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Role updated successfully'),
    );

    const removeBtn = screen.queryByText(/Remove/);
    if (removeBtn) {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      await act(async () => userEvent.click(removeBtn));
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

    const toggles = screen.getAllByRole('button');
    const dropdownToggle = toggles.find(
      (btn) => btn.id && btn.id.startsWith('dropdown-'),
    );

    if (dropdownToggle) await act(async () => userEvent.click(dropdownToggle));

    const promoteItem = await screen.findByText(/Promote|Demote/i);

    await act(async () => userEvent.click(promoteItem));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to update role');
      expect(consoleError).toHaveBeenCalled();
    });

    toastError.mockRestore();
    consoleError.mockRestore();
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
    const toggles = screen.getAllByRole('button');
    const dropdownToggle = toggles.find(
      (btn) => btn.id && btn.id.startsWith('dropdown-'),
    );

    if (dropdownToggle) await act(async () => userEvent.click(dropdownToggle));

    const removeItem = await screen.findByText(/Remove/i);

    await act(async () => userEvent.click(removeItem));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to remove member');
      expect(consoleError).toHaveBeenCalled();
    });

    toastError.mockRestore();
    consoleError.mockRestore();
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

    await wait(200);

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
    await waitFor(async () => {
      expect(
        await screen.findByRole('button', { name: /trash/i }),
      ).toBeTruthy();
    }).catch(() => {});

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const toastSuccess = vi.spyOn(NotificationToast, 'success');

    const buttons = screen.getAllByRole('button');
    const trashButton = buttons.find((b) => b.querySelector('svg'));
    if (trashButton) await act(async () => userEvent.click(trashButton));

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Chat deleted successfully'),
    );
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
    await waitFor(async () => {
      expect(
        await screen.findByRole('button', { name: /trash/i }),
      ).toBeTruthy();
    }).catch(() => {});

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const buttons = screen.getAllByRole('button');
    const trashButton = buttons.find((b) => b.querySelector('svg'));
    if (trashButton) await act(async () => userEvent.click(trashButton));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to delete chat');
      expect(consoleError).toHaveBeenCalled();
    });
    toastError.mockRestore();
    consoleError.mockRestore();
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
      userEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await act(async () => {
      const chatNameInput = await screen.findByTestId('chatNameInput');
      await userEvent.clear(chatNameInput);
      await userEvent.type(chatNameInput, 'New Name');
    });

    await act(async () => {
      userEvent.click(await screen.findByTestId('updateTitleBtn'));
    });

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to update chat name');
      expect(consoleError).toHaveBeenCalled();
    });

    toastError.mockRestore();
    consoleError.mockRestore();
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
      userEvent.click(await screen.findByTestId('editImageBtn'));
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

    toastError.mockRestore();
    consoleError.mockRestore();
  });

  describe('LoadingState Behavior', () => {
    it('should show LoadingState spinner while chat details are loading', async () => {
      useLocalStorage().setItem('userId', 'user1');

      const delayedMocks = mocks.map((mock) => ({
        ...mock,
        delay: 300,
      }));

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
        userEvent.click(addMembersBtn);
      });

      // Wait for spinner to appear during the ORGANIZATION_MEMBERS query loading
      await waitFor(
        () => {
          const spinner = document.querySelector('[data-testid="spinner"]');
          expect(spinner).toBeInTheDocument();
        },
        { timeout: 2000 },
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
        { timeout: 3000 },
      );

      const spinners = screen.queryAllByTestId('spinner');
      const visibleSpinners = spinners.filter((spinner) => {
        const parent = spinner.closest('[data-testid="loadingContainer"]');
        return parent && !parent.classList.contains('hidden');
      });
      expect(visibleSpinners.length).toBe(0);
    });
  });
});
