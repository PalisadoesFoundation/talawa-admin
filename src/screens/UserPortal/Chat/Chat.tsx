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
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DropDownButton from 'shared-components/DropDownButton';
import Button from 'shared-components/Button';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ContactCard from 'components/UserPortal/ContactCard/ContactCard';
import ChatRoom from 'components/UserPortal/ChatRoom/ChatRoom';
import AddIcon from '@mui/icons-material/Add';
import styles from './Chat.module.css';
import { CHATS_LIST, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';
import CreateGroupChat from '../../../components/UserPortal/CreateGroupChat/CreateGroupChat';
import CreateDirectChat from 'components/UserPortal/CreateDirectChat/CreateDirectChat';
import type {
  Chat as ChatType,
  InterfaceContactCardProps,
} from 'types/UserPortal/Chat/interface';

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
  } = useQuery<{ chatsByUser: Array<GroupChat | NewChatType> }>(CHATS_LIST, {
    variables: { first: 10, after: cursor },
  });
  const { refetch: unreadChatListRefetch } = useQuery<{
    unreadChats: Array<GroupChat | NewChatType>;
  }>(UNREAD_CHATS);

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

  return (
    <>
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <div data-testid="chat" className={`${styles.mainContainer}`}>
          <div className={styles.contactContainer}>
            <div
              className={`d-flex justify-content-between ${styles.addChatContainer}`}
            >
              <h4>{t('title')}</h4>
              <DropDownButton
                id="newChatDropdown"
                options={newChatOptions}
                onSelect={handleNewChatSelect}
                ariaLabel={t('newChat')}
                dataTestIdPrefix="dropdown"
                icon={<AddIcon data-testid="new-chat-icon" />}
                buttonLabel=" "
                parentContainerStyle={styles.dropdownToggle}
                btnStyle={styles.customToggle}
              />
            </div>
            <div
              className={`${styles.contactListContainer} d-flex flex-column`}
            >
              {chatsListLoading ? (
                <div className={`d-flex flex-row justify-content-center`}>
                  <HourglassBottomIcon /> <span>{tCommon('loading')}</span>
                </div>
              ) : (
                <>
                  <div className={styles.filters}>
                    <Button
                      onClick={() => {
                        setFilterType('all');
                      }}
                      data-testid="allChat"
                      className={[
                        styles.filterButton,
                        filterType === 'all' && styles.selectedBtn,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {t('all')}
                    </Button>
                    <Button
                      data-testid="unreadChat"
                      onClick={() => {
                        setFilterType('unread');
                      }}
                      className={[
                        styles.filterButton,
                        filterType === 'unread' && styles.selectedBtn,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {t('unread')}
                    </Button>
                    <Button
                      onClick={() => {
                        setFilterType('group');
                      }}
                      data-testid="groupChat"
                      className={[
                        styles.filterButton,
                        filterType === 'group' && styles.selectedBtn,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {t('groups')}
                    </Button>
                  </div>

                  <div
                    data-testid="contactCardContainer"
                    className={`${styles.contactCardContainer} ${styles.contactCardList}`}
                  >
                    {!!chats.length &&
                      chats.map((chat: ChatType) => {
                        const cardProps: InterfaceContactCardProps = {
                          id: chat.id,
                          title: chat.name || 'Chat',
                          image: chat.avatarURL || '',
                          setSelectedContact,
                          selectedContact,
                          isGroup: (chat.members?.edges?.length || 0) > 2,
                          unseenMessages: chat.unreadMessagesCount ?? 0,
                          lastMessage: chat.lastMessage?.body ?? '',
                        };
                        return <ContactCard {...cardProps} key={chat.id} />;
                      })}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={styles.chatContainer} id="chat-container">
            <ChatRoom
              chatListRefetch={chatsListRefetch}
              selectedContact={selectedContact}
            />
          </div>
        </div>
      </div>
      {createGroupChatModalisOpen && (
        <CreateGroupChat
          toggleCreateGroupChatModal={toggleCreateGroupChatModal}
          createGroupChatModalisOpen={createGroupChatModalisOpen}
          chatsListRefetch={chatsListRefetch}
        ></CreateGroupChat>
      )}
      {createDirectChatModalisOpen && (
        <CreateDirectChat
          toggleCreateDirectChatModal={toggleCreateDirectChatModal}
          createDirectChatModalisOpen={createDirectChatModalisOpen}
          chatsListRefetch={chatsListRefetch}
          chats={chats}
        ></CreateDirectChat>
      )}
    </>
  );
}
