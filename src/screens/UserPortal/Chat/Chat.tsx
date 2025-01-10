import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'react-bootstrap';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ContactCard from 'components/UserPortal/ContactCard/ContactCard';
import ChatRoom from 'components/UserPortal/ChatRoom/ChatRoom';
import useLocalStorage from 'utils/useLocalstorage';
import NewChat from 'assets/svgs/newChat.svg?react';
import styles from './Chat.module.css';
import {
  CHATS_LIST,
  GROUP_CHAT_LIST,
  UNREAD_CHAT_LIST,
} from 'GraphQl/Queries/PlugInQueries';
import CreateGroupChat from '../../../components/UserPortal/CreateGroupChat/CreateGroupChat';
import CreateDirectChat from 'components/UserPortal/CreateDirectChat/CreateDirectChat';
import { MARK_CHAT_MESSAGES_AS_READ } from 'GraphQl/Mutations/OrganizationMutations';

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
/**
 * The `chat` component provides a user interface for interacting with contacts and chat rooms within an organization.
 * It features a contact list with search functionality and displays the chat room for the selected contact.
 * The component uses GraphQL to fetch and manage contact data, and React state to handle user interactions.
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

type DirectMessage = {
  _id: string;
  createdAt: Date;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  replyTo:
    | {
        _id: string;
        createdAt: Date;
        sender: {
          _id: string;
          firstName: string;
          lastName: string;
          image: string;
        };
        messageContent: string;
        receiver: {
          _id: string;
          firstName: string;
          lastName: string;
        };
      }
    | undefined;
  messageContent: string;
};

type Chat = {
  _id: string;
  isGroup: boolean;
  name: string;
  image: string;
  messages: DirectMessage[];
  users: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
  }[];
  unseenMessagesByUsers: string;
};
export default function chat(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });
  const { t: tCommon } = useTranslation('common');

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedContact, setSelectedContact] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  React.useEffect(() => {
    if (filterType === 'all') {
      chatsListRefetch();
      if (chatsListData && chatsListData.chatsByUserId) {
        setChats(chatsListData.chatsByUserId);
      }
    } else if (filterType === 'unread') {
      unreadChatListRefetch();
      if (unreadChatListData && unreadChatListData.getUnreadChatsByUserId) {
        setChats(unreadChatListData.getUnreadChatsByUserId);
      }
    } else if (filterType === 'group') {
      groupChatListRefetch();
      if (groupChatListData && groupChatListData.getGroupChatsByUserId) {
        setChats(groupChatListData.getGroupChatsByUserId);
      }
    }
  }, [filterType]);

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

  const {
    data: chatsListData,
    loading: chatsListLoading,
    refetch: chatsListRefetch,
  } = useQuery(CHATS_LIST, {
    variables: {
      id: userId,
    },
  });

  const { data: groupChatListData, refetch: groupChatListRefetch } =
    useQuery(GROUP_CHAT_LIST);

  const { data: unreadChatListData, refetch: unreadChatListRefetch } =
    useQuery(UNREAD_CHAT_LIST);

  const [markChatMessagesAsRead] = useMutation(MARK_CHAT_MESSAGES_AS_READ, {
    variables: {
      chatId: selectedContact,
      userId: userId,
    },
  });

  useEffect(() => {
    markChatMessagesAsRead().then(() => {
      chatsListRefetch({ id: userId });
    });
  }, [selectedContact]);

  React.useEffect(() => {
    if (chatsListData && chatsListData?.chatsByUserId.length) {
      setChats(chatsListData.chatsByUserId);
    }
  }, [chatsListData]);

  return (
    <>
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <div data-testid="chat" className={`${styles.mainContainer}`}>
          <div className={styles.contactContainer}>
            <div
              className={`d-flex justify-content-between ${styles.addChatContainer}`}
            >
              <h4>{t('messages')}</h4>
              <Dropdown style={{ cursor: 'pointer' }}>
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
                    Starred Messages
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className={styles.contactListContainer}>
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
                      All
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
                      Unread
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
                      Groups
                    </Button>
                  </div>

                  <div
                    data-testid="contactCardContainer"
                    className={styles.contactCardContainer}
                  >
                    {!!chats.length &&
                      chats.map((chat: Chat) => {
                        const cardProps: InterfaceContactCardProps = {
                          id: chat._id,
                          title: !chat.isGroup
                            ? chat.users[0]?._id === userId
                              ? `${chat.users[1]?.firstName} ${chat.users[1]?.lastName}`
                              : `${chat.users[0]?.firstName} ${chat.users[0]?.lastName}`
                            : chat.name,
                          image: chat.isGroup
                            ? chat.image
                            : userId
                              ? chat.users[1]?.image
                              : chat.users[0]?.image,
                          setSelectedContact,
                          selectedContact,
                          isGroup: chat.isGroup,
                          unseenMessages: JSON.parse(
                            chat.unseenMessagesByUsers,
                          )[userId],
                          lastMessage:
                            chat.messages[chat.messages.length - 1]
                              ?.messageContent,
                        };
                        return <ContactCard {...cardProps} key={chat._id} />;
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
        ></CreateDirectChat>
      )}
    </>
  );
}
