/**
 * The `chat` component provides a user interface for interacting with contacts and chat rooms within an organization.
 * It features a contact list with search functionality and displays the chat room for the selected contact.
 * The component uses GraphQL to fetch and manage contact data, and React state to handle user interactions.
 *
 *
 * ## Features:
 * - **Search Contacts:** Allows users to search for contacts by their first name.
 * - **Contact List:** Displays a list of contacts with their details and a profile image.
 * - **Chat Room:** Shows the chat room for the selected contact.
 *
 * ## GraphQL Queries:
 * - `ORGANIZATIONS_MEMBER_CONNECTION_LIST`: Fetches a list of members within an organization, with optional filtering based on the first name.
 *
 * ## Event Handlers:
 * - `handleSearch`: Updates the filterName state and refetches the contact data based on the search query.
 * - `handleSearchByEnter`: Handles search input when the Enter key is pressed.
 * - `handleSearchByBtnClick`: Handles search input when the search button is clicked.
 *
 * ## Rendering:
 * - Displays a search input field and a search button for filtering contacts.
 * - Shows a list of contacts with their details and profile images.
 * - Renders a chat room component for the selected contact.
 * - Displays a loading indicator while contact data is being fetched.
 *
 * @returns  The rendered `chat` component.
 */
import React, { useState, useCallback } from 'react';
import useLocalStorage from 'utils/useLocalstorage';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DropDownButton from 'shared-components/DropDownButton';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ChatRoom from 'components/UserPortal/ChatRoom/ChatRoom';
import AddIcon from '@mui/icons-material/Add';
import styles from './Chat.module.css';
import { CHATS_LIST, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';
import CreateGroupChat from '../../../components/UserPortal/CreateGroupChat/CreateGroupChat';
import CreateDirectChat from 'components/UserPortal/CreateDirectChat/CreateDirectChat';
import type { Chat as ChatType } from 'types/UserPortal/Chat/interface';

export default function Chat(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userChat' });
  const { t: tCommon } = useTranslation('common');
  const { getItem, setItem } = useLocalStorage();
  const { orgId } = useParams<{ orgId: string }>();

  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedContact, setSelectedContact] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [createDirectChatModalisOpen, setCreateDirectChatModalisOpen] =
    useState(false);

  function openCreateDirectChatModal(): void {
    setCreateDirectChatModalisOpen(true);
  }

  const toggleCreateDirectChatModal = (): void =>
    setCreateDirectChatModalisOpen(!createDirectChatModalisOpen);

  const [createGroupChatModalisOpen, setCreateGroupChatModalisOpen] =
    useState(false);

  function openCreateGroupChatModal(): void {
    setCreateGroupChatModalisOpen(true);
  }

  const toggleCreateGroupChatModal = (): void => {
    setCreateGroupChatModalisOpen(!createGroupChatModalisOpen);
  };

  // Options for the new chat dropdown
  const newChatOptions = [
    { value: 'newDirectChat', label: t('newChat') },
    { value: 'newGroupChat', label: t('newGroupChat') },
  ];

  // Handle dropdown selection for new chat options
  const handleNewChatSelect = useCallback(
    (value: string) => {
      switch (value) {
        case 'newDirectChat':
          openCreateDirectChatModal();
          break;
        case 'newGroupChat':
          openCreateGroupChatModal();
          break;
      }
    },
    [openCreateDirectChatModal, openCreateGroupChatModal],
  );

  const [cursor] = useState<string | null>(null);

  const {
    data: chatsListData,
    loading: chatsListLoading,
    refetch: chatsListRefetch,
  } = useQuery(CHATS_LIST, {
    variables: { first: 10, after: cursor },
  });
  const { refetch: unreadChatListRefetch } = useQuery(UNREAD_CHATS);

  React.useEffect(() => {
    async function getChats(): Promise<void> {
      if (filterType === 'all') {
        const { data } = await chatsListRefetch();
        if (data?.chatsByUser) {
          const filteredChats = orgId
            ? data.chatsByUser.filter(
                (chat: ChatType) => chat.organization?.id === orgId,
              )
            : data.chatsByUser;
          setChats(filteredChats);
        }
      } else if (filterType === 'unread') {
        const { data } = await unreadChatListRefetch();
        if (data?.unreadChats) {
          const filteredChats = orgId
            ? data.unreadChats.filter(
                (chat: ChatType) => chat.organization?.id === orgId,
              )
            : data.unreadChats;
          setChats(filteredChats);
        }
      } else if (filterType === 'group') {
        const { data } = await chatsListRefetch();
        const list: ChatType[] = data?.chatsByUser || [];
        const groups = list.filter(
          (chat: ChatType) => (chat.members?.edges?.length || 0) > 2,
        );
        const filteredGroups = orgId
          ? groups.filter((chat: ChatType) => chat.organization?.id === orgId)
          : groups;
        setChats(filteredGroups);
      }
    }
    getChats();
  }, [filterType, orgId]);

  React.useEffect(() => {
    if (filterType === 'all' && chatsListData?.chatsByUser?.length) {
      const filteredChats = orgId
        ? chatsListData.chatsByUser.filter(
            (chat: ChatType) => chat.organization?.id === orgId,
          )
        : chatsListData.chatsByUser;
      setChats(filteredChats);
    }
  }, [chatsListData, filterType, orgId]);

  React.useEffect(() => {
    if (chats.length === 0) return;
    const stored = getItem('selectedChatId') as string | null;
    if (stored && !selectedContact) {
      const exists = chats.some((c) => c.id === stored);
      if (exists) {
        setSelectedContact(stored);
        return;
      }
    }
    if (!selectedContact) {
      setSelectedContact(chats[0].id);
    }
  }, [chats, selectedContact, getItem]);

  React.useEffect(() => {
    if (selectedContact) {
      setItem('selectedChatId', selectedContact);
    }
  }, [selectedContact, setItem]);

  // Get initials from a name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Avatar color palette
  const AVATAR_COLORS = [
    { bg: 'var(--blue-50)', color: 'var(--blue-600)' },
    { bg: 'var(--purple-50)', color: 'var(--purple-500)' },
    { bg: 'var(--green-50)', color: 'var(--green-700)' },
    { bg: 'var(--orange-50)', color: 'var(--orange-500)' },
    { bg: 'var(--red-50)', color: 'var(--red-500)' },
  ];

  const getAvatarColorIndex = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++)
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % 5;
  };

  return (
    <>
      {/* Three-panel chat layout matching prototype */}
      <div data-testid="chat" className={styles.chatMain}>
        {/* ── Left Panel: Conversation List ─────────────────────── */}
        <aside className={styles.chatSidebar}>
          <div className={styles.chatSidebarHeader}>
            <div className={styles.chatSidebarTitle}>
              <span>{t('messages') || 'Messages'}</span>
              <DropDownButton
                id="newChatDropdown"
                options={newChatOptions}
                onSelect={handleNewChatSelect}
                ariaLabel={t('newChat')}
                dataTestIdPrefix="dropdown"
                icon={
                  <AddIcon
                    data-testid="new-chat-icon"
                    className={styles.iconSm}
                  />
                }
                buttonLabel=" "
                placeholder=""
                btnStyle={styles.newChatBtn}
                showCaret={false}
              />
            </div>
            <div className={styles.chatSearch}>
              <span className={styles.searchIconWrapper}>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className={styles.chatSearchInput}
                placeholder={t('searchContacts') || 'Search conversations...'}
                aria-label="Search conversations"
              />
            </div>
            <div className={styles.chatTabs} role="tablist">
              <button
                className={`${styles.chatTab} ${filterType === 'all' ? styles.chatTabActive : ''}`}
                role="tab"
                aria-selected={filterType === 'all'}
                onClick={() => setFilterType('all')}
                data-testid="allChat"
              >
                Direct
              </button>
              <button
                className={`${styles.chatTab} ${filterType === 'group' ? styles.chatTabActive : ''}`}
                role="tab"
                aria-selected={filterType === 'group'}
                onClick={() => setFilterType('group')}
                data-testid="groupChat"
              >
                Groups
              </button>
            </div>
          </div>

          <div className={styles.chatList} data-testid="contactCardContainer">
            {chatsListLoading ? (
              <div className={styles.loadingContainer}>
                <HourglassBottomIcon className={styles.iconSm} />
                <span>{tCommon('loading')}</span>
              </div>
            ) : chats.length === 0 ? (
              <div className={styles.loadingContainer}>
                <span>{t('noChats') || 'No conversations yet'}</span>
              </div>
            ) : (
              chats.map((chat: ChatType) => {
                const isActive = selectedContact === chat.id;
                const isUnread = (chat.unreadMessagesCount ?? 0) > 0;
                const chatName = chat.name || 'Chat';
                const initials = getInitials(chatName);
                const colorIdx = getAvatarColorIndex(chat.id);

                return (
                  <button
                    key={chat.id}
                    className={`${styles.chatItem} ${isActive ? styles.chatItemActive : ''} ${isUnread ? styles.chatItemUnread : ''}`}
                    onClick={() => setSelectedContact(chat.id)}
                    data-testid={`chat-item-${chat.id}`}
                  >
                    <div
                      className={`${styles.chatItemAvatar} ${
                        styles[`avatarBg${colorIdx}`]
                      }`}
                    >
                      {chat.avatarURL ? (
                        <img
                          src={chat.avatarURL}
                          alt=""
                          className={styles.avatarImage}
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className={styles.chatItemContent}>
                      <div className={styles.chatItemTop}>
                        <span className={styles.chatItemName}>{chatName}</span>
                        <span className={styles.chatItemTime}>
                          {chat.lastMessage?.createdAt
                            ? new Date(
                                chat.lastMessage.createdAt,
                              ).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <div className={styles.chatItemPreview}>
                        {chat.lastMessage?.body || ''}
                      </div>
                    </div>
                    {isUnread && (
                      <div className={styles.unreadBadge}>
                        {chat.unreadMessagesCount}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Right Panel: Chat Area ────────────────────────────── */}
        <section className={styles.chatArea} id="chat-container">
          <ChatRoom
            chatListRefetch={chatsListRefetch}
            selectedContact={selectedContact}
          />
        </section>
      </div>

      {/* Modals */}
      {createGroupChatModalisOpen && (
        <CreateGroupChat
          toggleCreateGroupChatModal={toggleCreateGroupChatModal}
          createGroupChatModalisOpen={createGroupChatModalisOpen}
          chatsListRefetch={chatsListRefetch}
        />
      )}
      {createDirectChatModalisOpen && (
        <CreateDirectChat
          toggleCreateDirectChatModal={toggleCreateDirectChatModal}
          createDirectChatModalisOpen={createDirectChatModalisOpen}
          chatsListRefetch={chatsListRefetch}
          chats={chats}
        />
      )}
    </>
  );
}
