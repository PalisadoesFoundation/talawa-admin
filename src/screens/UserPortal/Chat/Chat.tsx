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
import React, { useEffect, useState } from 'react';
import useLocalStorage from 'utils/useLocalstorage';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Button from 'shared-components/Button';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ContactCard from 'components/UserPortal/ContactCard/ContactCard';
import ChatRoom from 'components/UserPortal/ChatRoom/ChatRoom';
import NewChat from 'assets/svgs/newChat.svg?react';
import styles from './Chat.module.css';
import { CHATS_LIST, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';
import CreateGroupChat from '../../../components/UserPortal/CreateGroupChat/CreateGroupChat';
import CreateDirectChat from 'components/UserPortal/CreateDirectChat/CreateDirectChat';
// TODO: Update markChatMessagesAsRead to match new schema
// import { MARK_CHAT_MESSAGES_AS_READ } from 'GraphQl/Mutations/OrganizationMutations';
import type { GroupChat } from 'types/UserPortal/Chat/type';
import type { NewChatType } from 'types/UserPortal/Chat/interface';

// Type guard to check if chat is NewChatType (new schema with 'id' instead of '_id')
const isNewChatType = (chat: GroupChat | NewChatType): chat is NewChatType => {
  return 'id' in chat && !('_id' in chat);
};
interface InterfaceContactCardProps {
  id: string;
  title: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  isGroup: boolean;
  unseenMessages: number;
  lastMessage: string;
}

export default function chat(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userChat' });
  const { t: tCommon } = useTranslation('common');
  const { getItem, setItem } = useLocalStorage();
  const { orgId } = useParams<{ orgId: string }>();

  const [chats, setChats] = useState<Array<GroupChat | NewChatType>>([]);
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

  const [cursor] = useState<string | null>(null);

  const {
    data: chatsListData,
    loading: chatsListLoading,
    refetch: chatsListRefetch,
  } = useQuery(CHATS_LIST, {
    variables: { first: 10, after: cursor },
  });
  const { refetch: unreadChatListRefetch } = useQuery(UNREAD_CHATS);

  // TODO: Update markChatMessagesAsRead to match new schema
  // const [markChatMessagesAsRead] = useMutation(MARK_CHAT_MESSAGES_AS_READ, {
  //   variables: { chatId: selectedContact, userId: userId },
  // });

  useEffect(() => {
    // TODO: Update markChatMessagesAsRead to match new schema
    // markChatMessagesAsRead().then(() => {
    //   chatsListRefetch({ id: userId });
    // });
  }, [selectedContact]);

  React.useEffect(() => {
    async function getChats(): Promise<void> {
      if (filterType === 'all') {
        const { data } = await chatsListRefetch();
        if (data && data.chatsByUser) {
          const filteredChats = orgId
            ? data.chatsByUser.filter((chat: GroupChat | NewChatType) => {
                if (isNewChatType(chat)) {
                  return chat.organization?.id === orgId;
                }
                const legacy = chat as GroupChat;
                return legacy.organization?._id === orgId;
              })
            : data.chatsByUser;
          setChats(filteredChats);
        }
      } else if (filterType === 'unread') {
        const { data } = await unreadChatListRefetch();
        if (data && data.unreadChats) {
          const filteredChats = orgId
            ? data.unreadChats.filter((chat: GroupChat | NewChatType) => {
                if (isNewChatType(chat)) {
                  return chat.organization?.id === orgId;
                }
                const legacy = chat as GroupChat;
                return legacy.organization?._id === orgId;
              })
            : data.unreadChats;
          setChats(filteredChats);
        }
      } else if (filterType === 'group') {
        const { data } = await chatsListRefetch();
        const list: Array<GroupChat | NewChatType> =
          (data && data.chatsByUser) || [];
        const groups = list.filter((chat: GroupChat | NewChatType) => {
          if (isNewChatType(chat)) {
            return (chat.members?.edges?.length || 0) > 2;
          }
          const legacy = chat as GroupChat;
          return !!legacy.isGroup || (legacy.users?.length || 0) > 2;
        });
        const filteredGroups = orgId
          ? groups.filter((chat: GroupChat | NewChatType) => {
              if (isNewChatType(chat)) {
                return chat.organization?.id === orgId;
              }
              const legacy = chat as GroupChat;
              return legacy.organization?._id === orgId;
            })
          : groups;
        setChats(filteredGroups);
      }
    }
    getChats();
  }, [filterType]);

  React.useEffect(() => {
    if (filterType === 'all' && chatsListData?.chatsByUser?.length) {
      const filteredChats = orgId
        ? chatsListData.chatsByUser.filter((chat: GroupChat | NewChatType) => {
            if (isNewChatType(chat)) {
              return chat.organization?.id === orgId;
            }
            const legacy = chat as GroupChat;
            return legacy.organization?._id === orgId;
          })
        : chatsListData.chatsByUser;
      setChats(filteredChats);
    }
  }, [chatsListData, filterType]);

  React.useEffect(() => {
    if (chats.length === 0) return;
    const stored = getItem('selectedChatId') as string | null;
    if (stored && !selectedContact) {
      const exists = chats.some((c) =>
        isNewChatType(c) ? c.id === stored : c._id === stored,
      );
      if (exists) {
        setSelectedContact(stored);
        return;
      }
    }
    if (!selectedContact) {
      const firstChat = chats[0];
      const firstChatId = isNewChatType(firstChat)
        ? firstChat.id
        : firstChat._id;
      setSelectedContact(firstChatId);
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
              <h4>{t('messages')}</h4>
              <Dropdown className={styles.dropdownToggle}>
                <Dropdown.Toggle
                  className={styles.customToggle}
                  data-testid={'dropdown'}
                >
                  <NewChat />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={openCreateDirectChatModal}
                    data-testid="newDirectChat"
                  >
                    {t('newChat')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={openCreateGroupChatModal}
                    data-testid="newGroupChat"
                  >
                    {t('newGroupChat')}
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    {t('starredMessages')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
                    {/* three buttons to filter unread, all and group chats. All selected by default. */}
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
                      chats.map((chat: GroupChat | NewChatType) => {
                        const unreadCount = isNewChatType(chat)
                          ? (chat.unreadMessagesCount ?? 0)
                          : 0;
                        const lastMsgBody = isNewChatType(chat)
                          ? (chat.lastMessage?.body ?? '')
                          : '';

                        const cardProps: InterfaceContactCardProps = {
                          id: isNewChatType(chat) ? chat.id : chat._id,
                          title: chat.name || 'Chat',
                          image: isNewChatType(chat)
                            ? chat.avatarURL || ''
                            : chat.image || '',
                          setSelectedContact,
                          selectedContact,
                          isGroup: isNewChatType(chat)
                            ? (chat.members?.edges?.length || 0) > 2
                            : (chat as GroupChat).isGroup ||
                              ((chat as GroupChat).users?.length || 0) > 2,
                          unseenMessages: unreadCount,
                          lastMessage: lastMsgBody,
                        };
                        return (
                          <ContactCard
                            {...cardProps}
                            key={isNewChatType(chat) ? chat.id : chat._id}
                          />
                        );
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
          chats={chats.filter((c) => !isNewChatType(c)) as GroupChat[]}
        ></CreateDirectChat>
      )}
    </>
  );
}
