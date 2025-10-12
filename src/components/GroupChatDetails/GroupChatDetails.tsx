/**
 * Component for displaying and managing group chat details.
 *
 * @module GroupChatDetails
 *
 * @description
 * This component provides a modal interface for viewing and editing group chat details,
 * including the chat name, image, description, and members. It also allows adding new users
 * to the group chat and updating chat information.
 *
 * @param {InterfaceGroupChatDetailsProps} props - The props for the component.
 * @param {boolean} props.groupChatDetailsModalisOpen - Determines if the group chat details modal is open.
 * @param {Function} props.toggleGroupChatDetailsModal - Function to toggle the visibility of the modal.
 * @param {Object} props.chat - The chat object containing details like name, image, description, and users.
 * @param {Function} props.chatRefetch - Function to refetch chat data after updates.
 *
 * @returns {JSX.Element} The rendered GroupChatDetails component.
 *
 * @remarks
 * - Uses `@mui/material` for table and modal styling.
 * - Integrates `react-bootstrap` for modal and form elements.
 * - Utilizes GraphQL queries and mutations for fetching and updating chat data.
 * - Includes localization support via `react-i18next`.
 * - Displays a loader while fetching user data.
 *
 * @example
 * ```tsx
 * <GroupChatDetails
 *   groupChatDetailsModalisOpen={true}
 *   toggleGroupChatDetailsModal={handleToggle}
 *   chat={chatData}
 *   chatRefetch={refetchChatData}
 * />
 * ```
 *
 * @dependencies
 * - `@mui/material`
 * - `react-bootstrap`
 * - `@apollo/client`
 * - `react-i18next`
 * - `react-toastify`
 * - `react-icons`
 *
 */
import { Paper, TableBody } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useMutation, useQuery } from '@apollo/client';
import {
  UPDATE_CHAT,
  CREATE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import Loader from 'components/Loader/Loader';
import { Search, Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Avatar from 'components/Avatar/Avatar';
import { FiEdit } from 'react-icons/fi';
import { FaCheck, FaX } from 'react-icons/fa6';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';
import type { InterfaceGroupChatDetailsProps } from 'types/Chat/interface';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ['#31bb6b', '!important'],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 },
}));

export default function groupChatDetails({
  toggleGroupChatDetailsModal,
  groupChatDetailsModalisOpen,
  chat,
  chatRefetch,
}: InterfaceGroupChatDetailsProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userChat' });

  //storage

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  useEffect(() => {
    if (!userId) {
      toast.error(t('userNotFound'));
    }
  }, [userId, t]);

  if (!userId) {
    return (
      <Modal
        data-testid="groupChatDetailsModal"
        show={groupChatDetailsModalisOpen}
        onHide={toggleGroupChatDetailsModal}
        contentClassName={styles.modalContent}
      >
        <Modal.Header closeButton data-testid="groupChatDetails">
          <Modal.Title>{t('Error')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>User not found</Modal.Body>
      </Modal>
    );
  }

  //states

  const [userName, setUserName] = useState('');
  const [editChatTitle, setEditChatTitle] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>(chat?.name || '');
  const [, setSelectedImage] = useState(chat?.avatarURL || '');

  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();

  //mutations

  const [addUser] = useMutation(CREATE_CHAT_MEMBERSHIP);
  const [updateChat] = useMutation(UPDATE_CHAT);

  //modal

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
  } = useQuery(ORGANIZATION_MEMBERS, {
    variables: {
      input: { id: chat.organization?.id },
      first: 20,
      after: null,
      where: {},
    },
  });

  const addUserToGroupChat = async (userId: string): Promise<void> => {
    await addUser({
      variables: {
        input: { memberId: userId, chatId: chat.id, role: 'regular' },
      },
    });
  };

  const handleUserModalSearchChange = (e: React.FormEvent): void => {
    e.preventDefault();
    const trimmedName = userName.trim();

    allUsersRefetch({
      input: { id: chat.organization?.id },
      first: 20,
      after: null,
      where: trimmedName ? { name_contains: trimmedName } : {},
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (): void => {
    fileInputRef?.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file && chat.organization?.id) {
      const { objectName } = await uploadFileToMinio(
        file,
        chat.organization.id,
      );
      const url = await getFileFromMinio(objectName, chat.organization.id);
      setSelectedImage(url);
      await updateChat({
        variables: {
          input: {
            id: chat.id,
            avatar: { uri: objectName },
            name: chatName,
          },
        },
      });
      await chatRefetch({ input: { id: chat.id } });
      setSelectedImage('');
    } else {
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
            {chat?.avatarURL ? (
              <img className={styles.chatImage} src={chat?.avatarURL} alt="" />
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
                          id: chat.id,
                          name: chatName,
                        },
                      },
                    });
                    setEditChatTitle(false);
                    await chatRefetch({ input: { id: chat.id } });
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
              {chat?.members.edges.length} {t('members')}
            </p>
            <p>{chat?.description}</p>
          </div>

          <div>
            <h5>
              {chat.members.edges.length} {t('members')}
            </h5>
            <ListGroup className={styles.memberList} variant="flush">
              <ListGroup.Item
                data-testid="addMembers"
                className={styles.listItem}
                onClick={() => {
                  openAddUserModal();
                }}
              >
                <Add /> {t('addMembers')}
              </ListGroup.Item>
              {chat.members.edges.map((edge) => {
                const user = edge.node.user;
                const role = edge.node.role;
                return (
                  <ListGroup.Item
                    className={styles.groupMembersList}
                    key={user.id}
                  >
                    <div className={styles.chatUserDetails}>
                      <Avatar
                        avatarStyle={styles.membersImage}
                        name={user.name}
                      />
                      {user.name} ({role})
                    </div>
                  </ListGroup.Item>
                );
              })}
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
                    {allUsersData &&
                      allUsersData.organization?.members?.edges?.length > 0 &&
                      allUsersData.organization.members.edges
                        .filter(
                          ({
                            node: userDetails,
                          }: {
                            node: {
                              id: string;
                              name: string;
                              avatarURL?: string;
                              role: string;
                            };
                          }) =>
                            userDetails.id !== userId &&
                            !chat.members.edges.some(
                              (edge) => edge.node.user.id === userDetails.id,
                            ),
                        )
                        .map(
                          (
                            {
                              node: userDetails,
                            }: {
                              node: {
                                id: string;
                                name: string;
                                avatarURL?: string;
                                role: string;
                              };
                            },
                            index: number,
                          ) => (
                            <StyledTableRow
                              data-testid="user"
                              key={userDetails.id}
                            >
                              <StyledTableCell component="th" scope="row">
                                {index + 1}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {userDetails.name}
                                <br />
                                {userDetails.role || 'Member'}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Button
                                  onClick={async () => {
                                    await addUserToGroupChat(userDetails.id);
                                    toggleAddUserModal();
                                    chatRefetch({ input: { id: chat.id } });
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
