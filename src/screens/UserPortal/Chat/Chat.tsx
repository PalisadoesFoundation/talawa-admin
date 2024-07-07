import React, { useEffect, useState } from 'react';
// import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import {
  DIRECT_CHATS_LIST,
  USERS_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Form, InputGroup, Modal } from 'react-bootstrap';
import { SearchOutlined, Search } from '@mui/icons-material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ContactCard from 'components/UserPortal/ContactCard/ContactCard';
import ChatRoom from 'components/UserPortal/ChatRoom/ChatRoom';
import { Link, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import { CREATE_DIRECT_CHAT } from 'GraphQl/Mutations/OrganizationMutations';
import Loader from 'components/Loader/Loader';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { ReactComponent as NewChat } from 'assets/svgs/newChat.svg';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import Accordion from 'react-bootstrap/Accordion';
import styles from './Chat.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import CreateGroupChat from './core/CreateGroupChat/CreateGroupChat';
import { GROUP_CHAT_LIST } from 'GraphQl/Queries/PlugInQueries';

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

type GroupChatMessage = {
  _id: string;
  createdAt: string;
  messageContent: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ['#31bb6b', '!important'],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function chat(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });

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

  const { orgId: organizationId } = useParams();

  const [selectedContact, setSelectedContact] = useState('');
  const [contacts, setContacts] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [selectChatType, setSelectedChatType] = useState('');
  const [filterName, setFilterName] = useState('');
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

  const [userName, setUserName] = useState('');

  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: allUsersRefetch,
  } = useQuery(USERS_CONNECTION_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
    },
  });

  const handleUserModalSearchChange = (e: React.FormEvent): void => {
    e.preventDefault();
    /* istanbul ignore next */
    const [firstName, lastName] = userName.split(' ');

    const newFilterData = {
      firstName_contains: firstName || '',
      lastName_contains: lastName || '',
    };

    allUsersRefetch({
      ...newFilterData,
    });
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

  const [createDirectChat] = useMutation(CREATE_DIRECT_CHAT);

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

  const createChat = async (id: string): Promise<void> => {
    await createDirectChat({
      variables: {
        organizationId,
        userIds: [userId, id],
      },
    });
    contactRefetch();
  };

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
        <div className={`${styles.mainContainer}`}>
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
                    data-testid={'newDirectChat'}
                  >
                    New Chat
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={openCreateGroupChatModal}
                    data-testid={'newGroupChat'}
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
                    {contacts.length ? (
                      <Accordion.Item eventKey="0">
                        <Accordion.Header className={styles.chatType}>
                          DIRECT CHATS
                        </Accordion.Header>
                        <Accordion.Body>
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
                              <>
                                <ContactCard {...cardProps} key={contact._id} />
                              </>
                            );
                          })}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      ''
                    )}
                    {groupChats.length ? (
                      <Accordion.Item eventKey="1">
                        <Accordion.Header className={styles.chatType}>
                          GROUP CHATS
                        </Accordion.Header>
                        <Accordion.Body>
                          {groupChats &&
                            groupChats.map((chat: any) => {
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
                                <>
                                  <ContactCard {...cardProps}></ContactCard>
                                </>
                              );
                            })}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      ''
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
      <Modal
        data-testid="addExistingUserModal"
        show={createDirectChatModalisOpen}
        onHide={toggleCreateDirectChatModal}
        contentClassName={styles.modalContent}
      >
        <Modal.Header closeButton data-testid="pluginNotificationHeader">
          <Modal.Title>{'Chat'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {allUsersLoading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <div className={styles.input}>
                <Form onSubmit={handleUserModalSearchChange}>
                  <Form.Control
                    type="name"
                    id="searchUser"
                    data-testid="searchUser"
                    placeholder="searchFullName"
                    autoComplete="off"
                    className={styles.inputFieldModal}
                    value={userName}
                    onChange={(e): void => {
                      const { value } = e.target;
                      setUserName(value);
                    }}
                  />
                  <Button
                    type="submit"
                    data-testid="submitBtn"
                    className={`position-absolute z-10 bottom-10 end-0  d-flex justify-content-center align-items-center `}
                  >
                    <Search />
                  </Button>
                </Form>
              </div>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>#</StyledTableCell>
                      <StyledTableCell align="center">{'user'}</StyledTableCell>
                      <StyledTableCell align="center">{'Chat'}</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsersData &&
                      allUsersData.users.length > 0 &&
                      allUsersData.users.map(
                        (
                          userDetails: InterfaceQueryUserListItem,
                          index: number,
                        ) => (
                          <StyledTableRow
                            data-testid="user"
                            key={userDetails.user._id}
                          >
                            <StyledTableCell component="th" scope="row">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {userDetails.user.firstName +
                                ' ' +
                                userDetails.user.lastName}
                              <br />
                              {userDetails.user.email}
                              {/* </Link> */}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Button
                                onClick={() => {
                                  createChat(userDetails.user._id);
                                }}
                                data-testid="addBtn"
                              >
                                Add
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ),
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Modal.Body>
      </Modal>
      {createGroupChatModalisOpen && (
        <CreateGroupChat
          toggleCreateGroupChatModal={toggleCreateGroupChatModal}
          createGroupChatModalisOpen={createGroupChatModalisOpen}
          groupChatListRefetch={groupChatListRefetch}
        ></CreateGroupChat>
      )}
    </>
  );
}
