import React, { useState } from 'react';
// import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import {
  DIRECT_CHATS_LIST,
  USERS_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import { useMutation, useQuery } from '@apollo/client';
import styles from './Chat.module.css';
import { useTranslation } from 'react-i18next';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
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
import type { InterfaceQueryUserListItem } from 'utils/interfaces';

type DirectMessage = {
  _id: string;
  createdAt: Date;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  messageContent: string;
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  updatedAt: Date;
};

type SelectedContact = {
  id: string;
  userId: string;
  messages: DirectMessage[];
};
interface InterfaceContactCardProps {
  id: string;
  firstName: string;
  userId: string;
  lastName: string;
  email: string;
  image: string;
  selectedContact: SelectedContact;
  messages: DirectMessage;
  setSelectedContact: React.Dispatch<React.SetStateAction<SelectedContact>>;
  setSelectedContactName: React.Dispatch<React.SetStateAction<string>>;
}

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

// interface InterfaceChatRoomProps {
//   selectedContact: string;
//   messages: DirectMessage[];
// }

export default function chat(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });
  const { orgId: organizationId } = useParams();

  const [selectedContact, setSelectedContact] = useState<SelectedContact>({
    id: '',
    userId: '',
    messages: [],
  });
  const [selectedContactName, setSelectedContactName] = React.useState('');
  const [contacts, setContacts] = React.useState([]);
  const [filterName, setFilterName] = React.useState('');
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  const [createDirectChatModalisOpen, setCreateDirectChatModalisOpen] =
    useState(false);

  function openCreateDirectChatModal(): void {
    setCreateDirectChatModalisOpen(true);
  }

  const toggleDialogModal = /* istanbul ignore next */ (): void =>
    setCreateDirectChatModalisOpen(!createDirectChatModalisOpen);

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

  return (
    <>
      {/* <OrganizationNavbar {...navbarProps} /> */}
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
          <div className={styles.contactContainer}>
            <div
              className={`d-flex flex-column align-items-center justify-content-center ${styles.addChatContainer}`}
            >
              <h4 className={`d-flex w-100 justify-content-start`}>
                {t('contacts')}
              </h4>
              <button onClick={openCreateDirectChatModal}>
                Create Direct Chat
              </button>
              {/* <InputGroup className={styles.maxWidth}>
                <Form.Control
                  placeholder={t('search')}
                  id="searchChats"
                  type="text"
                  className={`${styles.borderNone} ${styles.backgroundWhite}`}
                  onKeyUp={handleSearchByEnter}
                  data-testid="searchInput"
                />
                <InputGroup.Text
                  className={`${styles.colorPrimary} ${styles.borderNone}`}
                  style={{ cursor: 'pointer' }}
                  onClick={handleSearchByBtnClick}
                  data-testid="searchBtn"
                >
                  <SearchOutlined className={`${styles.colorWhite}`} />
                </InputGroup.Text>
              </InputGroup> */}
            </div>
            <div className={styles.contactListContainer}>
              {contactLoading ? (
                <div className={`d-flex flex-row justify-content-center`}>
                  <HourglassBottomIcon /> <span>Loading...</span>
                </div>
              ) : (
                contacts.map((contact: any, index: number) => {
                  const cardProps: InterfaceContactCardProps = {
                    id: contact._id,
                    firstName: contact.users[0]?.firstName,
                    userId: contact.users[0]?._id,
                    lastName: contact.users[0]?.lastName,
                    email: contact.users[0]?.email,
                    image: contact.users[0]?.image,
                    messages: contact.messages,
                    setSelectedContactName,
                    setSelectedContact,
                    selectedContact,
                  };
                  return <ContactCard {...cardProps} key={index} />;
                })
              )}
            </div>
          </div>
          <div className={styles.chatContainer}>
            <div
              className={`d-flex flex-row justify-content-center align-items-center ${styles.chatHeadingContainer} ${styles.colorPrimary}`}
            >
              {selectedContact ? selectedContactName : t('chat')}
            </div>
            <ChatRoom selectedContact={selectedContact} />
          </div>
        </div>
      </div>
      <Modal
        data-testid="addExistingUserModal"
        show={createDirectChatModalisOpen}
        onHide={toggleDialogModal}
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
                              {/* <Link
                                className={styles.membername}
                                to={{
                                  pathname: `/member/id=${currentUrl}`,
                                }}
                              > */}
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
    </>
  );
}
