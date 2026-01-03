/**
 * Component for creating a new group chat.
 *
 * This component provides a modal interface for creating a group chat,
 * allowing users to set a title, description, and add members to the group.
 * It also supports uploading a group image and integrates with GraphQL
 * mutations and queries for managing chat data.
 *
 * @component
 * @param {InterfaceCreateGroupChatProps} props - Component props.
 * @param {() => void} props.toggleCreateGroupChatModal - Function to toggle the visibility of the create group chat modal.
 * @param {boolean} props.createGroupChatModalisOpen - Boolean indicating whether the create group chat modal is open.
 * @param {(variables?: Partial<{ id: string }> | undefined) => Promise<ApolloQueryResult<unknown>>} props.chatsListRefetch - Function to refetch the chat list.
 *
 * @returns {JSX.Element} The rendered CreateGroupChat component.
 *
 * @remarks
 * - Uses `useMutation` to create a new chat via the `CREATE_CHAT` GraphQL mutation.
 * - Fetches user data using the `USERS_CONNECTION_LIST` GraphQL query.
 * - Allows users to search for and add members to the group.
 * - Supports image upload functionality with direct GraphQL file upload and local preview.
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
 * @dependencies
 * - React
 * - @apollo/client
 * - @mui/material
 * - react-bootstrap
 * - react-router-dom
 * - utils/useLocalstorage
 * - utils/MinioUpload
 * - components/Loader
 * - components/ProfileAvatarDisplay
 *
 * @fileoverview
 * This file defines the `CreateGroupChat` component, which is used in the
 * user portal for creating group chats within an organization.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Paper, TableBody } from '@mui/material';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from '../../../style/app-fixed.module.css';
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
import Loader from 'components/Loader/Loader';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { FiEdit } from 'react-icons/fi';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { toast } from 'react-toastify';

interface InterfaceCreateGroupChatProps {
  toggleCreateGroupChatModal: () => void;
  createGroupChatModalisOpen: boolean;
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
}

/**
 * Styled table container with custom styles.
 */

// No longer using TableContainer, TableCell, TableRow as they were flagging CSS violations.
// We'll use standard MUI components with CSS classes instead.

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
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { orgId: currentOrg } = useParams();

  function openAddUserModal(): void {
    setAddUserModalisOpen(true);
  }

  const toggleAddUserModal = (): void =>
    setAddUserModalisOpen(!addUserModalisOpen);

  function reset(): void {
    setTitle('');
    setUserIds([]);
    // Clean up object URL when resetting
    if (selectedImage && selectedImage.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setRawImageFile(null);
  }

  useEffect(() => {
    setUserIds(userIds);
  }, [userIds]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  async function handleCreateGroupChat(): Promise<void> {
    try {
      const chatResult = await createChat({
        variables: {
          input: {
            organizationId: currentOrg,
            name: title,
            description: description,
            avatar: rawImageFile,
          },
        },
      });
      const chatId = (chatResult.data as { createChat: { id: string } })
        ?.createChat?.id;

      if (chatId) {
        if (userId) {
          await createChatMembership({
            variables: {
              input: {
                memberId: userId,
                chatId,
                role: 'administrator',
              },
            },
          });
        }

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
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast.error('Failed to create group chat');
    }
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
      // Clean up previous object URL to prevent memory leaks
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }

      // Set immediate local preview
      const localUrl = URL.createObjectURL(file);
      setSelectedImage(localUrl);

      setRawImageFile(file);
    } else {
      // Clean up object URL if file selection is cleared
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage(null);
      setRawImageFile(null);
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
      <Modal
        data-testid="createGroupChatModal"
        show={createGroupChatModalisOpen}
        onHide={() => {
          toggleCreateGroupChatModal();
          reset();
        }}
        contentClassName={styles.modalContent}
      >
        <Modal.Header closeButton data-testid="">
          <Modal.Title>New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className={styles.displayNone}
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
              data-testid="editImageBtn"
              onClick={handleImageClick}
              className={styles.editImgBtn}
            >
              <FiEdit />
            </button>
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="registerForm.Rname">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder={'Group name'}
                autoComplete="off"
                required
                data-testid="groupTitleInput"
                value={title}
                onChange={(e): void => {
                  setTitle(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.Rname">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder={'Group Description'}
                autoComplete="off"
                required
                data-testid="groupDescriptionInput" //corrected spelling
                value={description}
                onChange={(e): void => {
                  setDescription(e.target.value);
                }}
              />
            </Form.Group>
            <Button
              className={`${styles.colorPrimary} ${styles.borderNone}`}
              variant="success"
              onClick={openAddUserModal}
              data-testid="nextBtn"
            >
              Next
            </Button>
          </Form>
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
                <SearchBar
                  placeholder={t('searchFullName')}
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

              <TableContainer
                className={styles.tableContainerRounded}
                component={Paper}
              >
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles.groupChatTableCellHead}>
                        #
                      </TableCell>
                      <TableCell
                        className={styles.groupChatTableCellHead}
                        align="center"
                      >
                        {'user'}
                      </TableCell>
                      <TableCell
                        className={styles.groupChatTableCellHead}
                        align="center"
                      >
                        {'Chat'}
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
                              <TableCell
                                component="th"
                                scope="row"
                                className={styles.groupChatTableCellBody}
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                align="center"
                                className={styles.groupChatTableCellBody}
                              >
                                {userDetails.name}
                                <br />
                                {userDetails.role || 'Member'}
                              </TableCell>
                              <TableCell
                                align="center"
                                className={styles.groupChatTableCellBody}
                              >
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
                                    Remove
                                  </Button>
                                ) : (
                                  <Button
                                    className={`${styles.colorPrimary} ${styles.borderNone}`}
                                    onClick={() => {
                                      setUserIds([...userIds, userDetails.id]);
                                    }}
                                    data-testid="addBtn"
                                  >
                                    {t('add')}
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
          )}
          <Button
            className={`${styles.colorPrimary} ${styles.borderNone}`}
            variant="success"
            onClick={handleCreateGroupChat}
            data-testid="createBtn"
          >
            {t('create')}
          </Button>
        </Modal.Body>
      </Modal>
    </ErrorBoundaryWrapper>
  );
}
