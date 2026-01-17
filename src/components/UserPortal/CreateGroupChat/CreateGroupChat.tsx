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
 * - Supports image upload functionality using MinIO.
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
 * - components/Avatar
 *
 * @fileoverview
 * This file defines the `CreateGroupChat` component, which is used in the
 * user portal for creating group chats within an organization.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Paper, TableBody } from '@mui/material';
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
import styles from '../../../style/app-fixed.module.css';
import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import {
  CREATE_CHAT,
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
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Avatar from 'components/Avatar/Avatar';
import { FiEdit } from 'react-icons/fi';
import { useMinioUpload } from 'utils/MinioUpload';

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

const StyledTableContainer = styled(TableContainer)<{
  component?: React.ElementType;
}>(() => ({ borderRadius: 'var(--table-head-radius)' }));

/**
 * Styled table cell with custom styles.
 */

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'var(--table-head-bg)',
    color: 'var(--table-header-color)',
    fontSize: 'var(--font-size-header)',
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 'var(--font-size-table-body)' },
}));

/**
 * Styled table row with custom styles.
 */

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 'var(--table-row-border)' },
}));

const { getItem } = useLocalStorage();

export default function CreateGroupChat({
  toggleCreateGroupChatModal,
  createGroupChatModalisOpen,
  chatsListRefetch,
}: InterfaceCreateGroupChatProps): JSX.Element {
  const userId: string | null = getItem('userId') || getItem('id');
  const { t } = useTranslation('translation', { keyPrefix: 'userChat' });

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
          avatar: null,
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

  const handleUserModalSearchChange = (e: React.FormEvent): void => {
    e.preventDefault();
    const trimmedName = userName.trim();

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
    <>
      <Modal
        data-testid="createGroupChatModal"
        show={createGroupChatModalisOpen}
        onHide={toggleCreateGroupChatModal}
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
            style={{ display: 'none' }}
            onChange={handleImageChange}
            data-testid="fileInput"
          />
          <div className={styles.groupInfo}>
            {selectedImage ? (
              <img className={styles.chatImage} src={selectedImage} alt="" />
            ) : (
              <Avatar avatarStyle={styles.groupImage} name={title} />
            )}
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
                <Form onSubmit={handleUserModalSearchChange}>
                  <Form.Control
                    type="name"
                    id="searchUser"
                    data-testid="searchUser"
                    placeholder="searchFullName"
                    autoComplete="off"
                    className={styles.inputField}
                    value={userName}
                    onChange={(e): void => {
                      const { value } = e.target;
                      setUserName(value);
                    }}
                  />
                  <Button
                    type="submit"
                    data-testid="submitBtn"
                    className={styles.searchButton}
                  >
                    <Search />
                  </Button>
                </Form>
              </div>

              <StyledTableContainer component={Paper}>
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
                              </StyledTableCell>
                            </StyledTableRow>
                          ),
                        )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
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
    </>
  );
}
