import React, { useEffect, useState } from 'react';
import { DIRECT_CHATS_LIST } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'react-bootstrap';
import { SearchOutlined, Search } from '@mui/icons-material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ContactCard from 'components/UserPortal/ContactCard/ContactCard';
import ChatRoom from 'components/UserPortal/ChatRoom/ChatRoom';
import useLocalStorage from 'utils/useLocalstorage';
import { ReactComponent as NewChat } from 'assets/svgs/newChat.svg';
import Accordion from 'react-bootstrap/Accordion';
import styles from './Chat.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { GROUP_CHAT_LIST } from 'GraphQl/Queries/PlugInQueries';
import CreateGroupChat from '../../../components/UserPortal/CreateGroupChat/CreateGroupChat';
import CreateDirectChat from 'components/UserPortal/CreateDirectChat/CreateDirectChat';

interface InterfaceContactCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setSelectedChatType: React.Dispatch<React.SetStateAction<string>>;
}

export default function chat(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'chat',
  });
  const { t: tCommon } = useTranslation('common');

  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

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

  const [selectedContact, setSelectedContact] = useState('');
  const [contacts, setContacts] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [selectChatType, setSelectedChatType] = useState('');
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

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
    data: contactData,
    loading: contactLoading,
    refetch: contactRefetch,
  } = useQuery(DIRECT_CHATS_LIST, {
    variables: {
      id: userId,
    },
  });

  const {
    data: groupChatList,
    loading: groupChatListLoading,
    refetch: groupChatListRefetch,
  } = useQuery(GROUP_CHAT_LIST, {
    variables: {
      id: userId,
    },
  });

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

  React.useEffect(() => {
    if (contactData) {
      setContacts(contactData.directChatsByUserID);
    }
  }, [contactData]);

  React.useEffect(() => {
    if (groupChatList) {
      setGroupChats(groupChatList.groupChatsByUserId);
    }
  }, [groupChatList]);

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
              {contactLoading || groupChatListLoading ? (
                <div className={`d-flex flex-row justify-content-center`}>
                  <HourglassBottomIcon /> <span>Loading...</span>
                </div>
              ) : (
                <div>
                  <Accordion flush defaultActiveKey={['0', '1']} alwaysOpen>
                    {!!contacts.length && (
                      <Accordion.Item eventKey="0">
                        <Accordion.Header
                          data-testid="chatContact"
                          className={styles.chatType}
                        >
                          DIRECT CHATS
                        </Accordion.Header>
                        <Accordion.Body className={styles.accordionBody}>
                          {contacts.map((contact: any) => {
                            const cardProps: InterfaceContactCardProps = {
                              id: contact._id,
                              title:
                                contact.users[0]?._id === userId
                                  ? `${contact.users[1]?.firstName} ${contact.users[1]?.lastName}`
                                  : `${contact.users[0]?.firstName} ${contact.users[0]?.lastName}`,
                              subtitle: userId
                                ? contact.users[1]?.email
                                : contact.users[0]?.email,
                              image: userId
                                ? contact.users[1]?.image
                                : contact.users[0]?.image,
                              setSelectedContact,
                              selectedContact,
                              type: 'direct',
                              setSelectedChatType,
                            };
                            return (
                              <ContactCard
                                data-testid="contact-card"
                                {...cardProps}
                                key={contact._id}
                              />
                            );
                          })}
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                    {!!groupChats.length && (
                      <Accordion.Item eventKey="1">
                        <Accordion.Header className={styles.chatType}>
                          GROUP CHATS
                        </Accordion.Header>
                        <Accordion.Body className={styles.accordionBody}>
                          {groupChats.map((chat: any) => {
                            const cardProps: InterfaceContactCardProps = {
                              id: chat._id,
                              title: chat.title,
                              subtitle: `${chat.users.length} ${chat.users.length > 1 ? 'members' : 'member'}`,
                              image: '',
                              setSelectedContact,
                              selectedContact,
                              type: 'group',
                              setSelectedChatType,
                            };
                            return (
                              <ContactCard
                                {...cardProps}
                                key={chat._id}
                              ></ContactCard>
                            );
                          })}
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                  </Accordion>
                </div>
              )}
            </div>
          </div>
          <div className={styles.chatContainer} id="chat-container">
            <ChatRoom
              selectedContact={selectedContact}
              selectedChatType={selectChatType}
            />
          </div>
        </div>
      </div>
      {createGroupChatModalisOpen && (
        <CreateGroupChat
          toggleCreateGroupChatModal={toggleCreateGroupChatModal}
          createGroupChatModalisOpen={createGroupChatModalisOpen}
          groupChatListRefetch={groupChatListRefetch}
        ></CreateGroupChat>
      )}
      {createDirectChatModalisOpen && (
        <CreateDirectChat
          toggleCreateDirectChatModal={toggleCreateDirectChatModal}
          createDirectChatModalisOpen={createDirectChatModalisOpen}
          contactRefetch={contactRefetch}
        ></CreateDirectChat>
      )}
    </>
  );
}
