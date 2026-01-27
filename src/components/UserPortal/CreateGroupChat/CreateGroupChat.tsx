/**
 * Renders a modal interface for creating a new group chat.
 *
 * This component allows users to create a group chat by setting a title,
 * description, selecting members, and optionally uploading a group image.
 * It integrates with GraphQL mutations and queries to manage chat data.
 *
 * @remarks
 * Key features include:
 * - Creating a chat using the `CREATE_CHAT` GraphQL mutation.
 * - Fetching users via the `USERS_CONNECTION_LIST` GraphQL query.
 * - Searching for and adding members to the group.
 * - Uploading a group image using MinIO.
 * - Displaying loading states using the shared `LoadingState` component.
 *
 * @param props - Component props.
 * @param toggleCreateGroupChatModal - Toggles the visibility of the create group chat modal.
 * @param createGroupChatModalisOpen - Indicates whether the create group chat modal is open.
 * @param chatsListRefetch - Refetch function for updating the chat list after creation.
 *
 * @returns A React element that renders the CreateGroupChat modal.
 *
 * @example
 * ```tsx
 * <CreateGroupChat
 *   toggleCreateGroupChatModal={toggleModal}
 *   createGroupChatModalisOpen={isModalOpen}
 *   chatsListRefetch={refetchChats}
 * />
 * ```
 *
 * @remarks
 * Dependencies used by this component include:
 * - React
 * - \@apollo/client
 * - \@mui/material
 * - react-bootstrap
 * - react-router-dom
 * - utils/useLocalstorage
 * - utils/MinioUpload
 * - shared-components/LoadingState/LoadingState
 * - components/ProfileAvatarDisplay
 */
import React, { useEffect, useRef, useState } from 'react';
import { Paper, TableBody } from '@mui/material';
import Button from 'shared-components/Button';
import styles from './CreateGroupChat.module.css';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import {
  CREATE_CHAT,
  CREATE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { FiEdit } from 'react-icons/fi';
import { useMinioUpload } from 'utils/MinioUpload';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

interface InterfaceCreateGroupChatProps {
  toggleCreateGroupChatModal: () => void;
  createGroupChatModalisOpen: boolean;
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
}

const { getItem } = useLocalStorage();

export default function CreateGroupChat({
  toggleCreateGroupChatModal,
  createGroupChatModalisOpen,
  chatsListRefetch,
}: InterfaceCreateGroupChatProps): JSX.Element {
  const userId: string | null = getItem('userId') || getItem('id');
  const { t } = useTranslation('translation', { keyPrefix: 'userChat' });
  const { t: tErrors } = useTranslation('errors');
  const { t: tCommon } = useTranslation('common');

  const [createChat] = useMutation(CREATE_CHAT);
  const [createChatMembership] = useMutation(CREATE_CHAT_MEMBERSHIP);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userIds, setUserIds] = useState<string[]>([]);

  const [addUserModalisOpen, setAddUserModalisOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { orgId: currentOrg } = useParams();
  const { uploadFileToMinio } = useMinioUpload();

  function openAddUserModal(): void {
    setAddUserModalisOpen(true);
  }

  const toggleAddUserModal = (): void =>
    setAddUserModalisOpen(!addUserModalisOpen);

  function reset(): void {
    setTitle('');
    setUserIds([]);
    setSelectedImage(null);
    setDescription('');
  }

  useEffect(() => {
    setUserIds(userIds);
  }, [userIds]);

  async function handleCreateGroupChat(): Promise<void> {
    // Create the chat
    const chatResult = await createChat({
      variables: {
        input: {
          organizationId: currentOrg,
          name: title,
          description: description,
          avatar: selectedImage,
        },
      },
    });
    const chatId = (chatResult.data as { createChat: { id: string } })
      ?.createChat?.id;

    if (chatId && userId) {
      await createChatMembership({
        variables: {
          input: {
            memberId: userId,
            chatId,
            role: 'administrator',
          },
        },
      });
      for (const memberId of userIds) {
        await createChatMembership({
          variables: {
            input: {
              memberId,
              chatId,
              role: 'regular',
            },
          },
        });
      }
    }

    chatsListRefetch();
    toggleAddUserModal();
    toggleCreateGroupChatModal();
    reset();
  }

  const [userName, setUserName] = useState('');

  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: allUsersRefetch,
  } = useQuery(ORGANIZATION_MEMBERS, {
    variables: {
      input: { id: currentOrg },
      first: 20,
      after: null,
      where: {},
    },
  });

  const handleUserModalSearchChange = (value: string): void => {
    const trimmedName = value.trim();
    allUsersRefetch({
      input: { id: currentOrg },
      first: 20,
      after: null,
      where: trimmedName ? { name_contains: trimmedName } : {},
    });
  };

  const handleImageClick = (): void => {
    fileInputRef?.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file && currentOrg) {
      try {
        const { objectName } = await uploadFileToMinio(file, currentOrg);
        setSelectedImage(objectName);
      } catch (error) {
        console.error('Error uploading image to MinIO:', error);
      }
    }
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={chatsListRefetch}
    >
      <BaseModal
        show={createGroupChatModalisOpen}
        onHide={() => {
          toggleCreateGroupChatModal();
          reset();
        }}
        title={t('newGroup', { defaultValue: 'New Group' })}
        dataTestId="createGroupChatModal"
        className={styles.modalContent}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
          data-testid="fileInput"
        />
        <div className={styles.groupInfo}>
          <ProfileAvatarDisplay
            className={styles.chatImage}
            fallbackName={title}
            imageUrl={selectedImage}
          />
          <button
            type="button"
            data-testid="editImageBtn"
            onClick={handleImageClick}
            className={styles.editImgBtn}
          >
            <FiEdit />
          </button>
        </div>
        <form>
          <div className="mb-3">
            <FormFieldGroup
              name="groupTitleInput"
              label={t('title', { defaultValue: 'Title' })}
              required
            >
              <input
                id="groupTitleInput"
                type="text"
                className="form-control"
                placeholder={t('groupName', { defaultValue: 'Group name' })}
                autoComplete="off"
                required
                data-testid="groupTitleInput"
                value={title}
                onChange={(e): void => {
                  setTitle(e.target.value);
                }}
              />
            </FormFieldGroup>
          </div>
          <div className="mb-3">
            <FormFieldGroup
              name="groupDescriptionInput"
              label={tCommon('description', { defaultValue: 'Description' })}
              required
            >
              <input
                id="groupDescriptionInput"
                type="text"
                className="form-control"
                placeholder={t('groupDescription', {
                  defaultValue: 'Group Description',
                })}
                autoComplete="off"
                required
                data-testid="groupDescriptionInput"
                value={description}
                onChange={(e): void => {
                  setDescription(e.target.value);
                }}
              />
            </FormFieldGroup>
          </div>
          <Button
            className={`${styles.colorPrimary} ${styles.borderNone}`}
            variant="success"
            onClick={openAddUserModal}
            data-testid="nextBtn"
          >
            {t('next', { defaultValue: 'Next' })}
          </Button>
        </form>
      </BaseModal>
      <BaseModal
        show={addUserModalisOpen}
        onHide={toggleAddUserModal}
        title={t('chat', { defaultValue: 'Chat' })}
        dataTestId="addExistingUserModal"
        className={styles.modalContent}
        footer={
          <Button
            className={`${styles.colorPrimary} ${styles.borderNone}`}
            variant="success"
            onClick={handleCreateGroupChat}
            data-testid="createBtn"
          >
            {t('create', { defaultValue: 'Create' })}
          </Button>
        }
      >
        <LoadingState
          isLoading={allUsersLoading}
          variant="inline"
          size="lg"
          data-testid="loading-state"
        >
          <>
            <div className={styles.input}>
              <SearchBar
                placeholder={t('searchFullName', {
                  defaultValue: 'Search full name',
                })}
                value={userName}
                onChange={(value) => setUserName(value)}
                onSearch={(value) => handleUserModalSearchChange(value)}
                onClear={() => {
                  setUserName('');
                  handleUserModalSearchChange('');
                }}
                inputTestId="searchUser"
                buttonTestId="submitBtn"
              />
            </div>

            <TableContainer className={styles.tableContainer} component={Paper}>
              <Table
                aria-label={t('organizationMembersTable', {
                  defaultValue: 'Organization Members Table',
                })}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {tCommon('hash', { defaultValue: '#' })}
                    </TableCell>
                    <TableCell align="center">
                      {t('user', { defaultValue: 'User' })}
                    </TableCell>
                    <TableCell align="center">
                      {t('chat', { defaultValue: 'Chat' })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
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
                        }) => userDetails.id !== userId,
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
                          <TableRow data-testid="user" key={userDetails.id}>
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell align="center">
                              {userDetails.name}
                              <br />
                              {userDetails.role ||
                                tCommon('member', { defaultValue: 'Member' })}
                            </TableCell>
                            <TableCell align="center">
                              {userIds.includes(userDetails.id) ? (
                                <Button
                                  variant="danger"
                                  onClick={() => {
                                    const updatedUserIds = userIds.filter(
                                      (id) => id !== userDetails.id,
                                    );
                                    setUserIds(updatedUserIds);
                                  }}
                                  data-testid="removeBtn"
                                >
                                  {t('remove', { defaultValue: 'Remove' })}
                                </Button>
                              ) : (
                                <Button
                                  className={`${styles.colorPrimary} ${styles.borderNone}`}
                                  onClick={() => {
                                    setUserIds([...userIds, userDetails.id]);
                                  }}
                                  data-testid="addBtn"
                                >
                                  {t('add', { defaultValue: 'Add' })}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        </LoadingState>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
}
