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
import React, { useRef, useState, useEffect } from 'react';
import { ListGroup, Modal, Dropdown } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useMutation } from '@apollo/client';
import {
  UPDATE_CHAT,
  UPDATE_CHAT_MEMBERSHIP,
  DELETE_CHAT,
  DELETE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Avatar from 'components/Avatar/Avatar';
import { BsThreeDotsVertical } from 'react-icons/bs';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';
import type { InterfaceGroupChatDetailsProps } from 'types/Chat/interface';
import GroupChatDetailsHeader from './GroupChatDetailsHeader';
import GroupChatAddUserModal from './GroupChatAddUserModal';

// No longer using StyledTableCell and StyledTableRow as they were flagging CSS violations.
// We'll use standard MUI components with CSS classes instead.

export default function groupChatDetails({
  toggleGroupChatDetailsModal,
  groupChatDetailsModalisOpen,
  chat,
  chatRefetch,
}: InterfaceGroupChatDetailsProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userChat' });

  //storage

  const { getItem } = useLocalStorage();
  // Support both 'userId' (for regular users) and 'id' (for admins)
  const userId = getItem('userId') || getItem('id');

  useEffect(() => {
    if (!userId) {
      toast.error(t('userNotFound'));
    }
  }, [userId, t]);

  // Cleanup object URLs on unmount
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  // image URL validation moved to GroupChatDetailsUtils

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
        <Modal.Body>{t('userNotFound')}</Modal.Body>
      </Modal>
    );
  }

  //states
  const [editChatTitle, setEditChatTitle] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>(chat?.name || '');

  //mutations
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
      toast.success(t('roleUpdatedSuccess'));
    } catch (error) {
      toast.error(t('failedUpdateRole'));
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
      toast.success(t('memberRemovedSuccess'));
    } catch (error) {
      toast.error(t('failedRemoveMember'));
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (): void => {
    fileInputRef?.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file && chat.organization?.id) {
      // Clean up previous object URL to prevent memory leaks
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }

      // Set immediate local preview
      const localUrl = URL.createObjectURL(file);
      setSelectedImage(localUrl);

      try {
        await updateChat({
          variables: {
            input: {
              id: chat.id,
              avatar: file,
              name: chatName,
            },
          },
        });
        await chatRefetch({ input: { id: chat.id } });
        toast.success(t('chatImageUpdatedSuccess'));
        // Clean up object URL after successful upload
        if (localUrl && localUrl.startsWith('blob:')) {
          URL.revokeObjectURL(localUrl);
        }
        setSelectedImage('');
      } catch (error) {
        toast.error(t('failedUpdateChatImage'));
        console.error(error);
        // Clean up object URL on error
        if (localUrl && localUrl.startsWith('blob:')) {
          URL.revokeObjectURL(localUrl);
        }
        setSelectedImage('');
      }
    } else {
      // Clean up object URL if file selection is cleared
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage('');
    }
  };

  const handleSaveTitle = async (): Promise<void> => {
    try {
      await updateChat({
        variables: { input: { id: chat.id, name: chatName } },
      });
      setEditChatTitle(false);
      await chatRefetch({ input: { id: chat.id } });
      toast.success(t('chatNameUpdatedSuccess'));
    } catch (error) {
      toast.error(t('failedUpdateChatName'));
      console.error(error);
    }
  };

  const handleDeleteChat = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat({ variables: { input: { id: chat.id } } });
        toast.success(t('chatDeletedSuccess'));
        toggleGroupChatDetailsModal();
      } catch (error) {
        toast.error(t('failedDeleteChat'));
        console.error(error);
      }
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
        <GroupChatDetailsHeader
          chat={chat}
          currentUserRole={currentUserRole}
          userId={userId}
          selectedImage={selectedImage}
          editChatTitle={editChatTitle}
          chatName={chatName}
          setChatName={setChatName}
          setEditChatTitle={setEditChatTitle}
          onImageClick={handleImageClick}
          fileInputRef={fileInputRef}
          onImageChange={handleImageChange}
          onSaveTitle={handleSaveTitle}
          onCancelEdit={() => {
            setEditChatTitle(false);
            setChatName(chat.name || '');
          }}
          onDelete={handleDeleteChat}
          t={t}
        />

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
                    <div className="d-flex align-items-center flex-grow-1">
                      <Avatar
                        avatarStyle={styles.membersImage}
                        name={user.name}
                      />
                      <span className="ms-2">{user.name}</span>
                      <span
                        className={`badge bg-success text-dark ms-2 ${styles.fontSize075rem}`}
                      >
                        {role}
                      </span>
                    </div>
                    {canManage && (
                      <Dropdown className="ms-auto">
                        <Dropdown.Toggle
                          variant="link"
                          id={`dropdown-${user.id}`}
                          className={`btn-sm ${styles.cursorPointer}`}
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
                              className={styles.textRed}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    t('confirmRemoveUser', { name: user.name }),
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
      </Modal>

      <GroupChatAddUserModal
        show={addUserModalisOpen}
        toggle={toggleAddUserModal}
        chat={chat}
        chatRefetch={chatRefetch}
        t={t}
      />
    </>
  );
}
