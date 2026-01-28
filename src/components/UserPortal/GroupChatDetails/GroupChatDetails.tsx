/**
 * Component for displaying and managing group chat details.
 *
 * module - GroupChatDetails
 *
 * Description:
 * This component provides a modal interface for viewing and editing group chat details,
 * including the chat name, image, description, and members. It also allows adding new users
 * to the group chat and updating chat information.
 *
 * @param props - The props for the component.
 * @param groupChatDetailsModalisOpen - Determines if the group chat details modal is open.
 * @param toggleGroupChatDetailsModal - Function to toggle the visibility of the modal.
 * @param chat - The chat object containing details like name, image, description, and users.
 * @param chatRefetch - Function to refetch chat data after updates.
 *
 * @returns The rendered GroupChatDetails component.
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
 * Dependencies:
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
import { Button } from 'shared-components/Button';
import { ListGroup, Dropdown } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './GroupChatDetails.module.css';
import { useMutation, useQuery } from '@apollo/client';
import {
  UPDATE_CHAT,
  CREATE_CHAT_MEMBERSHIP,
  UPDATE_CHAT_MEMBERSHIP,
  DELETE_CHAT,
  DELETE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import { FiEdit } from 'react-icons/fi';
import { FaCheck, FaX, FaTrash } from 'react-icons/fa6';
import { BsThreeDotsVertical } from 'react-icons/bs';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfaceGroupChatDetailsProps } from 'types/UserPortal/Chat/interface';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

export default function GroupChatDetails({
  toggleGroupChatDetailsModal,
  groupChatDetailsModalisOpen,
  chat,
  chatRefetch,
}: InterfaceGroupChatDetailsProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userChat' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  //storage

  const { getItem } = useLocalStorage();
  // Support both 'userId' (for regular users) and 'id' (for admins)
  const userId = getItem('userId') || getItem('id');

  useEffect(() => {
    if (!userId) {
      NotificationToast.error(t('userNotFound'));
    }
  }, [userId, t]);

  if (!userId) {
    return (
      <BaseModal
        show={groupChatDetailsModalisOpen}
        onHide={toggleGroupChatDetailsModal}
        title={t('Error')}
        dataTestId="groupChatDetailsModal"
        className={styles.modalContent}
      >
        {t('userNotFound')}
      </BaseModal>
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
  const [updateChatMembership] = useMutation(UPDATE_CHAT_MEMBERSHIP);
  const [deleteChat] = useMutation(DELETE_CHAT);
  const [deleteChatMembership] = useMutation(DELETE_CHAT_MEMBERSHIP);

  const currentUserRole = chat.members.edges.find(
    (edge) => edge.node.user.id === userId,
  )?.node.role;

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await updateChatMembership({
        variables: {
          input: {
            memberId,
            chatId: chat.id,
            role: newRole,
          },
        },
      });
      await chatRefetch();
      NotificationToast.success(t('roleUpdatedSuccessfully'));
    } catch (error) {
      NotificationToast.error(t('failedToUpdateRole'));
      console.error(error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await deleteChatMembership({
        variables: {
          input: {
            memberId,
            chatId: chat.id,
          },
        },
      });
      await chatRefetch();
      NotificationToast.success(t('memberRemovedSuccessfully'));
    } catch (error) {
      NotificationToast.error(t('failedToRemoveMember'));
      console.error(error);
    }
  };

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

  const handleUserModalSearchChange = (value: string): void => {
    const trimmedName = value.trim();
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
      try {
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
        NotificationToast.success(t('chatImageUpdatedSuccessfully'));
        setSelectedImage('');
      } catch (error) {
        NotificationToast.error(t('failedToUpdateChatImage'));
        console.error(error);
        setSelectedImage('');
      }
    } else {
      setSelectedImage('');
    }
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <BaseModal
        show={groupChatDetailsModalisOpen}
        onHide={toggleGroupChatDetailsModal}
        dataTestId="groupChatDetailsModal"
        className={styles.modalContent}
        headerContent={
          <div className="d-flex justify-content-between w-100">
            <div className="modal-title h4">{t('groupInfo')}</div>
            {currentUserRole === 'administrator' && (
              <Button
                variant="outline-danger"
                size="sm"
                aria-label={t('deleteChat')}
                onClick={async () => {
                  if (
                    window.confirm('Are you sure you want to delete this chat?')
                  ) {
                    try {
                      await deleteChat({
                        variables: { input: { id: chat.id } },
                      });
                      NotificationToast.success(t('chatDeletedSuccessfully'));
                      toggleGroupChatDetailsModal();
                      // Maybe navigate away or refetch chats
                    } catch (error) {
                      NotificationToast.error(t('failedToDeleteChat'));
                      console.error(error);
                    }
                  }
                }}
              >
                <FaTrash />
              </Button>
            )}
          </div>
        }
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className={styles.hiddenInput}
          onChange={handleImageChange}
          data-testid="fileInput"
        />
        <div className={styles.groupInfo}>
          <ProfileAvatarDisplay
            className={styles.groupImage}
            fallbackName={chat.name || ''}
            imageUrl={chat?.avatarURL}
            size="custom"
            customSize={150}
          />
          <button
            type="button"
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
                onClick={async () => {
                  try {
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
                    NotificationToast.success(t('chatNameUpdatedSuccessfully'));
                  } catch (error) {
                    NotificationToast.error(t('failedToUpdateChatName'));
                    console.error(error);
                  }
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
              const isCurrentUser = user.id === userId;
              const canManage =
                currentUserRole === 'administrator' && !isCurrentUser;
              const canRemove = canManage && role === 'regular';
              return (
                <ListGroup.Item
                  className={styles.groupMembersList}
                  key={user.id}
                >
                  <div
                    className={`${styles.chatUserDetails} d-flex align-items-center w-100`}
                  >
                    <div className="d-flex align-items-center grow">
                      <ProfileAvatarDisplay
                        className={styles.membersImage}
                        fallbackName={user.name}
                        imageUrl={user.avatarURL}
                        size="small"
                      />
                      <span className="ms-2">{user.name}</span>
                      <span
                        className={`badge bg-success text-dark ms-2 ${styles.roleBadge}`}
                      >
                        {role}
                      </span>
                    </div>
                    {canManage && (
                      <Dropdown className="ms-auto">
                        <Dropdown.Toggle
                          variant="link"
                          id={`dropdown-${user.id}`}
                          className={`btn-sm ${styles.dropdownToggle}`}
                        >
                          <BsThreeDotsVertical />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item
                            onClick={() =>
                              handleRoleChange(
                                user.id,
                                role === 'administrator'
                                  ? 'regular'
                                  : 'administrator',
                              )
                            }
                          >
                            {role === 'administrator'
                              ? t('demoteToRegular')
                              : t('promoteToAdmin')}
                          </Dropdown.Item>
                          {canRemove && (
                            <Dropdown.Item
                              className={styles.removeItem}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    t('confirmRemoveMember', {
                                      name: user.name,
                                    }),
                                  )
                                ) {
                                  handleRemoveMember(user.id);
                                }
                              }}
                            >
                              {t('remove')}
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </BaseModal>
      <BaseModal
        show={addUserModalisOpen}
        onHide={toggleAddUserModal}
        title={t('chat')}
        dataTestId="addExistingUserModal"
        className={styles.modalContent}
      >
        <LoadingState isLoading={allUsersLoading} variant="spinner">
          <div className={styles.input}>
            <SearchBar
              placeholder={t('searchFullName')}
              value={userName}
              onChange={(value) => {
                setUserName(value);
                handleUserModalSearchChange(value);
              }}
              onSearch={(value) => {
                handleUserModalSearchChange(value);
              }}
              onClear={() => {
                // Reset local input; refetch with empty filter explicitly for clarity
                setUserName('');
                handleUserModalSearchChange('');
              }}
              inputTestId="searchUser"
              buttonTestId="searchBtn"
              clearButtonAriaLabel={tCommon('clear')}
            />
          </div>

          <TableContainer className={styles.userData} component={Paper}>
            <Table aria-label={t('customizedTable')}>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tableHeader}>#</TableCell>
                  <TableCell align="center" className={styles.tableHeader}>
                    {t('user')}
                  </TableCell>
                  <TableCell align="center" className={styles.tableHeader}>
                    {t('chatAction')}
                  </TableCell>
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
                        <TableRow key={userDetails.id} data-testid="user">
                          <TableCell
                            component="th"
                            scope="row"
                            className={styles.tableBody}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={styles.tableBody}
                          >
                            {userDetails.name}
                            <br />
                            {userDetails.role ||
                              tCommon('member', { defaultValue: 'Member' })}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={styles.tableBody}
                          >
                            <Button
                              onClick={async () => {
                                try {
                                  await addUserToGroupChat(userDetails.id);
                                  toggleAddUserModal();
                                  chatRefetch({ input: { id: chat.id } });
                                  NotificationToast.success(
                                    t('userAddedSuccessfully'),
                                  );
                                } catch (error) {
                                  NotificationToast.error(t('failedToAddUser'));
                                  console.error(error);
                                }
                              }}
                              data-testid="addUserBtn"
                            >
                              {t('add')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
              </TableBody>
            </Table>
          </TableContainer>
        </LoadingState>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
}
