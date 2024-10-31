import { Paper, TableBody } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import styles from './GroupChatDetails.module.css';
import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_USER_TO_GROUP_CHAT,
  UPDATE_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import { USERS_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import { Search, Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Avatar from 'components/Avatar/Avatar';
import { FiEdit } from 'react-icons/fi';
import { FaCheck, FaX } from 'react-icons/fa6';
import convertToBase64 from 'utils/convertToBase64';
import useLocalStorage from 'utils/useLocalstorage';

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
  media: string;
};

type Chat = {
  _id: string;
  isGroup: boolean;
  name?: string;
  image?: string;
  messages: DirectMessage[];
  admins: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  users: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  unseenMessagesByUsers: string;
  description: string;
};

interface InterfaceGoroupChatDetailsProps {
  toggleGroupChatDetailsModal: () => void;
  groupChatDetailsModalisOpen: boolean;
  chat: Chat;
  chatRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chat: Chat }>>;
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

/**
 * Component for displaying and managing group chat details.
 *
 * @param props - The component props.
 * @param toggleGroupChatDetailsModal - Function to toggle the group chat details modal.
 * @param groupChatDetailsModalisOpen - Boolean indicating if the group chat details modal is open.
 * @param chat - The chat object containing details about the group chat.
 * @param chatRefetch - Function to refetch the chat data.
 * @returns The rendered component.
 */
export default function groupChatDetails({
  toggleGroupChatDetailsModal,
  groupChatDetailsModalisOpen,
  chat,
  chatRefetch,
}: InterfaceGoroupChatDetailsProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });

  const [userName, setUserName] = useState('');
  const { getItem } = useLocalStorage();

  const userId = getItem('userId');

  const [editChatTitle, setEditChatTitle] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>(chat?.name || '');

  const [addUser] = useMutation(ADD_USER_TO_GROUP_CHAT);

  const [addUserModalisOpen, setAddUserModalisOpen] = useState(false);

  function openAddUserModal(): void {
    setAddUserModalisOpen(true);
  }

  const toggleAddUserModal = (): void =>
    setAddUserModalisOpen(!addUserModalisOpen);

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

  const addUserToGroupChat = async (userId: string): Promise<void> => {
    await addUser({
      variables: {
        userId,
        chatId: chat._id,
      },
    });
  };

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

  const [selectedImage, setSelectedImage] = useState('');

  const [updateChat] = useMutation(UPDATE_CHAT);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (): void => {
    fileInputRef?.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setSelectedImage(base64);
      await updateChat();
      await chatRefetch();
      setSelectedImage('');
    }
  };

  return (
    <>
      <Modal
        data-testid="groupChatDetailsModal"
        show={groupChatDetailsModalisOpen}
        onHide={toggleGroupChatDetailsModal}
        contentClassName={styles.modalContent}
      >
        <Modal.Header closeButton data-testid="groupChatDetails">
          <Modal.Title>{t('groupInfo')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }} // Hide the input
            onChange={handleImageChange}
            data-testid="fileInput"
          />
          <div className={styles.groupInfo}>
            {chat?.image ? (
              <img className={styles.chatImage} src={chat?.image} alt="" />
            ) : (
              <Avatar avatarStyle={styles.groupImage} name={chat.name || ''} />
            )}
            <button
              data-testid="editImageBtn"
              onClick={handleImageClick}
              className={styles.editImgBtn}
            >
              <FiEdit />
            </button>

            {editChatTitle ? (
              <div className={styles.editChatNameContainer}>
                <input
                  type="text"
                  value={chatName}
                  data-testid="chatNameInput"
                  onChange={(e) => {
                    setChatName(e.target.value);
                  }}
                />
                <FaCheck
                  data-testid="updateTitleBtn"
                  className={styles.checkIcon}
                  onClick={async () => {
                    await updateChat({
                      variables: {
                        input: {
                          _id: chat._id,
                          image: selectedImage ? selectedImage : '',
                          name: chatName,
                        },
                      },
                    });
                    setEditChatTitle(false);
                    await chatRefetch();
                  }}
                />
                <FaX
                  data-testid="cancelEditBtn"
                  className={styles.cancelIcon}
                  onClick={() => {
                    setEditChatTitle(false);
                    setChatName(chat.name || '');
                  }}
                />
              </div>
            ) : (
              <div className={styles.editChatNameContainer}>
                <h3>{chat?.name}</h3>
                <FiEdit
                  data-testid="editTitleBtn"
                  onClick={() => {
                    setEditChatTitle(true);
                  }}
                />
              </div>
            )}

            <p>
              {chat?.users.length} {t('members')}
            </p>
            <p>{chat?.description}</p>
          </div>

          <div>
            <h5>
              {chat.users.length} {t('members')}
            </h5>
            <ListGroup className={styles.memberList} variant="flush">
              {chat.admins.map((admin) => admin._id).includes(userId) && (
                <ListGroup.Item
                  data-testid="addMembers"
                  className={styles.listItem}
                  onClick={() => {
                    openAddUserModal();
                  }}
                >
                  <Add /> {t('addMembers')}
                </ListGroup.Item>
              )}
              {chat.users.map(
                (user: {
                  _id: string;
                  firstName: string;
                  lastName: string;
                }) => (
                  <ListGroup.Item
                    className={styles.groupMembersList}
                    key={user._id}
                  >
                    <div className={styles.chatUserDetails}>
                      <Avatar
                        avatarStyle={styles.membersImage}
                        name={user.firstName + ' ' + user.lastName}
                      />
                      {user.firstName} {user.lastName}
                    </div>

                    <div>
                      {chat.admins
                        .map((admin) => admin._id)
                        .includes(user._id) && (
                        <p key={`admin-${user._id}`}>Admin</p>
                      )}
                    </div>
                  </ListGroup.Item>
                ),
              )}
            </ListGroup>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        data-testid="addExistingUserModal"
        show={addUserModalisOpen}
        onHide={toggleAddUserModal}
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
                    data-testid="searchBtn"
                    className={`position-absolute z-10 bottom-10 end-0  d-flex justify-content-center align-items-center `}
                  >
                    <Search />
                  </Button>
                </Form>
              </div>

              <TableContainer className={styles.userData} component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>#</StyledTableCell>
                      <StyledTableCell align="center">{'user'}</StyledTableCell>
                      <StyledTableCell align="center">{'Chat'}</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody data-testid="userList">
                    {console.log(allUsersData)}
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
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Button
                                onClick={async () => {
                                  await addUserToGroupChat(
                                    userDetails.user._id,
                                  );
                                  toggleAddUserModal();
                                  chatRefetch({ id: chat._id });
                                }}
                                data-testid="addUserBtn"
                              >
                                {t('add')}
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
