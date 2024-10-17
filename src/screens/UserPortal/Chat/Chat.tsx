import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'react-bootstrap';
import { SearchOutlined, Search } from '@mui/icons-material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ContactCard from 'components/UserPortal/ContactCard/ContactCard';
import ChatRoom from 'components/UserPortal/ChatRoom/ChatRoom';
import useLocalStorage from 'utils/useLocalstorage';
import NewChat from 'assets/svgs/newChat.svg?react';
import styles from './Chat.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { CHATS_LIST } from 'GraphQl/Queries/PlugInQueries';
import CreateGroupChat from '../../../components/UserPortal/CreateGroupChat/CreateGroupChat';
import CreateDirectChat from 'components/UserPortal/CreateDirectChat/CreateDirectChat';

interface InterfaceContactCardProps {
  id: string;
  title: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  isGroup: boolean;
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
export default function chat(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'chat',
  });
  const { t: tCommon } = useTranslation('common');

  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);
  const [chats, setChats] = useState<any>([]);
  const [selectedContact, setSelectedContact] = useState('');
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(!hideDrawer);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [createDirectChatModalisOpen, setCreateDirectChatModalisOpen] =
    useState(false);

  function openCreateDirectChatModal(): void {
    setCreateDirectChatModalisOpen(true);
  }

  const toggleCreateDirectChatModal = /* istanbul ignore next */ (): void =>
    setCreateDirectChatModalisOpen(!createDirectChatModalisOpen);

  const [createGroupChatModalisOpen, setCreateGroupChatModalisOpen] =
    useState(false);

  function openCreateGroupChatModal(): void {
    setCreateGroupChatModalisOpen(true);
  }

  const toggleCreateGroupChatModal = /* istanbul ignore next */ (): void => {
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

  React.useEffect(() => {
    if (chatsListData) {
      setChats(chatsListData.chatsByUserId);
    }
  }, [chatsListData]);

  // const handleSearch = (value: string): void => {
  //   setFilterName(value);

  //   contactRefetch();
  // };
  // const handleSearchByEnter = (e: any): void => {
  //   if (e.key === 'Enter') {
  //     const { value } = e.target;
  //     handleSearch(value);
  //   }
  // };
  // const handleSearchByBtnClick = (): void => {
  //   const value =
  //     (document.getElementById('searchChats') as HTMLInputElement)?.value || '';
  //   handleSearch(value);
  // };

  return (
    <>
      {hideDrawer ? (
        <Button
          className={styles.opendrawer}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="openMenu"
        >
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      ) : (
        <Button
          className={styles.collapseSidebarButton}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="closeMenu"
        >
          <i className="fa fa-angle-double-left" aria-hidden="true"></i>
        </Button>
      )}
      <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <div data-testid="chat" className={`${styles.mainContainer}`}>
          <div className={styles.contactContainer}>
            <div
              className={`d-flex justify-content-between ${styles.addChatContainer}`}
            >
              <h4>Messages</h4>
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
                    New Chat
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={openCreateGroupChatModal}
                    data-testid="newGroupChat"
                  >
                    New Group Chat
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
                  <HourglassBottomIcon /> <span>Loading...</span>
                </div>
              ) : (
                <div
                  data-testid="contactCardContainer"
                  className={styles.contactCardContainer}
                >
                  {!!chats.length &&
                    chats.map((chat: any) => {
                      const cardProps: InterfaceContactCardProps = {
                        id: chat._id,
                        title: !chat.isGroup
                          ? chat.users[0]?._id === userId
                            ? `${chat.users[1]?.firstName} ${chat.users[1]?.lastName}`
                            : `${chat.users[0]?.firstName} ${chat.users[0]?.lastName}`
                          : chat.name,
                        image: chat.isGroup
                          ? userId
                            ? chat.users[1]?.image
                            : chat.users[0]?.image
                          : chat.image,
                        setSelectedContact,
                        selectedContact,
                        isGroup: chat.isGroup,
                      };
                      return (
                        <ContactCard
                          data-testid="chatContact"
                          {...cardProps}
                          key={chat._id}
                        />
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className={styles.chatContainer} id="chat-container">
            <ChatRoom selectedContact={selectedContact} />
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
