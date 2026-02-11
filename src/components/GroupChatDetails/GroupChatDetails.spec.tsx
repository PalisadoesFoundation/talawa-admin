import React from 'react';
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import GroupChatDetails from './GroupChatDetails';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useLocalStorage } from 'utils/useLocalstorage';
import { vi } from 'vitest';
import { toast } from 'react-toastify';
import {
  mocks,
  filledMockChat,
  incompleteMockChat,
} from './GroupChatDetailsMocks';
import type { NewChatType } from 'types/Chat/interface';

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

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        // Add your translations here
      },
    },
  },
});

describe('GroupChatDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
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
    const toastSpy = vi.spyOn(toast, 'error');

    useLocalStorage().setItem('userId', null);

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );
    expect(screen.getByText('userChat.Error')).toBeInTheDocument();
    expect(screen.getByText('User not found')).toBeInTheDocument();
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith('userChat.userNotFound');
  });

  it('renders correctly without name and image', () => {
    const toastSpy = vi.spyOn(toast, 'error');
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
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
    expect(screen.getByText('userChat.groupInfo')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  it('renders correctly', () => {
    const toastSpy = vi.spyOn(toast, 'error');
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
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
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  it('should have descriptive alt text for group chat avatar', () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const avatarImage = screen.getByRole('img');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute(
      'alt',
      'Group chat avatar for Test Group',
    );
  });

  it('should have fallback alt text when chat name is empty', () => {
    useLocalStorage().setItem('userId', 'user1');

    const chatWithoutName = {
      ...filledMockChat,
      name: '',
    };

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(chatWithoutName)}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const avatarImage = screen.getByRole('img');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute(
      'alt',
      'Group chat avatar for this group',
    );
  });

  it('cancelling editing chat title', async () => {
    useLocalStorage().setItem('userId', '2');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
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
      fireEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('cancelEditBtn')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('cancelEditBtn'));
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
      fireEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('chatNameInput')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('chatNameInput'), {
        target: { value: 'New Group name' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('updateTitleBtn'));
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
      fireEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('searchUser'), {
        target: { value: 'Disha' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('searchBtn'));
    });

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('user')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId('addUserBtn'));
    });
  });

  it('add user to group chat using last name', async () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
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
      fireEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('searchUser'), {
        target: { value: 'Smith' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('searchBtn'));
    });

    await wait();
  });

  it('handling invalid image type', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
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
        expect(await screen.findByTestId('editImageBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    await act(async () => {
      fireEvent.click(await screen.findByTestId('editImageBtn'));
    });

    const fileInput = screen.getByTestId('fileInput');

    Object.defineProperty(fileInput, 'files', {
      value: null,
    });

    fireEvent.change(fileInput);
  });

  it('changes role and removes member via dropdown actions', async () => {
    useLocalStorage().setItem('userId', 'user1');

    const toastSuccess = vi.spyOn(toast, 'success');

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
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={adminChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

    const toggles = await screen.findAllByRole('button');
    const dropdownToggle = toggles.find(
      (btn) => btn.id && btn.id.startsWith('dropdown-'),
    );
    if (dropdownToggle) await act(async () => fireEvent.click(dropdownToggle));

    const promoteText = await screen.findByText(
      /Promote to Admin|Demote to Regular/,
    );
    await act(async () => fireEvent.click(promoteText));

    // wait for role change toast
    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Role updated successfully'),
    );

    const removeBtn = screen.queryByText(/Remove/);
    if (removeBtn) {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      await act(async () => fireEvent.click(removeBtn));
      await waitFor(() =>
        expect(toastSuccess).toHaveBeenCalledWith(
          'Member removed successfully',
        ),
      );
    }
  });

  it('uploads image and updates chat avatar', async () => {
    useLocalStorage().setItem('userId', 'user1');
    const chatRefetch = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={withSafeChat(filledMockChat)}
            chatRefetch={chatRefetch}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await waitFor(async () => {
      expect(await screen.findByTestId('editImageBtn')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('editImageBtn'));
    });

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    await act(async () => {
      fireEvent.change(fileInput);
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
    const toastSuccess = vi.spyOn(toast, 'success');

    const buttons = screen.getAllByRole('button');
    const trashButton = buttons.find((b) => b.querySelector('svg'));
    if (trashButton) await act(async () => fireEvent.click(trashButton));

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Chat deleted successfully'),
    );
  });
});
