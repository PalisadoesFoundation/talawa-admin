/**
 * ChatRoom Component
 *
 * This component represents a chat room interface where users can send and receive messages,
 * view chat details, and manage attachments. It supports both group and direct messaging.
 *
 * @remarks
 * - Uses Apollo Client for GraphQL queries, mutations, and subscriptions.
 * - Supports message editing, replying, and attachments.
 * - Displays group chat details when applicable.
 * - Uses CursorPaginationManager for message pagination.
 *
 * @param props - The props for the ChatRoom component.
 * @returns The rendered ChatRoom component
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import styles from './ChatRoom.module.css';
import { useTranslation } from 'react-i18next';
import { CHAT_BY_ID, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';
import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  EDIT_CHAT_MESSAGE,
  MESSAGE_SENT_TO_CHAT,
  SEND_MESSAGE_TO_CHAT,
  MARK_CHAT_MESSAGES_AS_READ,
  DELETE_CHAT_MESSAGE,
} from 'GraphQl/Mutations/OrganizationMutations';
import useLocalStorage from 'utils/useLocalstorage';
import GroupChatDetails from 'components/UserPortal/GroupChatDetails/GroupChatDetails';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import type { INewChat } from './types';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import ChatHeader from './ChatHeader';
import EmptyChatState from './EmptyChatState';
import MessageInput from './MessageInput';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import type { InterfaceCursorPaginationManagerRef } from 'types/CursorPagination/interface';
import MessageItem from './MessageItem';

interface IChatRoomProps {
  selectedContact: string;
  chatListRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chatList: INewChat[] }>>;
}

export default function chatRoom(props: IChatRoomProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChatRoom',
  });
  const { t: tErrors } = useTranslation('translation', {
    keyPrefix: 'userChatRoom.errorBoundary',
  });
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const { getItem, setItem } = useLocalStorage();
  const userId = getItem('userId') || getItem('id');

  useEffect(() => {
    if (props.selectedContact) {
      setItem('selectedChatId', props.selectedContact);
    }
  }, [props.selectedContact, setItem]);
  const [chatTitle, setChatTitle] = useState('');
  const [chatSubtitle, setChatSubtitle] = useState('');
  const [chatImage, setChatImage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState<INewChat>();
  const [replyToDirectMessage, setReplyToDirectMessage] = useState<
    INewChat['messages']['edges'][0]['node'] | null
  >(null);
  const [editMessage, setEditMessage] = useState<
    INewChat['messages']['edges'][0]['node'] | null
  >(null);
  const [groupChatDetailsModalisOpen, setGroupChatDetailsModalisOpen] =
    useState(false);

  const paginationRef =
    useRef<
      InterfaceCursorPaginationManagerRef<
        INewChat['messages']['edges'][number]['node']
      >
    >(null);

  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentObjectName, setAttachmentObjectName] = useState<
    string | null
  >(null);
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio: unstableGetFile } = useMinioDownload();
  const getFileFromMinioRef = useRef(unstableGetFile);
  useEffect(() => {
    getFileFromMinioRef.current = unstableGetFile;
  }, [unstableGetFile]);
  const getFileFromMinio = useCallback(
    (objectName: string, organizationId: string) =>
      getFileFromMinioRef.current(objectName, organizationId),
    [],
  );

  const openGroupChatDetails = (): void => {
    setGroupChatDetailsModalisOpen(true);
  };

  const toggleGroupChatDetailsModal = (): void =>
    setGroupChatDetailsModalisOpen(!groupChatDetailsModalisOpen);

  /**
   * Handles changes to the new message input field.
   *
   * Updates the state with the current value of the input field whenever it changes.
   *
   * @param e - The event triggered by the input field change.
   */
  const handleNewMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newMessageValue = e.target.value;
    setNewMessage(newMessageValue);
  };

  const [sendMessageToChat] = useMutation(SEND_MESSAGE_TO_CHAT, {
    variables: {
      input: {
        chatId: props.selectedContact,
        parentMessageId: replyToDirectMessage?.id,
        body: newMessage,
      },
    },
    // TODO(caching): When enabling Apollo cache, add optimisticResponse and
    // an update(cache) handler here to append the optimistic message edge to
    // Chat.messages and to refresh unread lists for other chats if needed.
  });

  const [editChatMessage] = useMutation(EDIT_CHAT_MESSAGE, {
    variables: {
      input: {
        id: editMessage?.id,
        body: newMessage,
      },
    },
  });

  const [markChatMessagesAsRead] = useMutation(MARK_CHAT_MESSAGES_AS_READ);

  const [deleteChatMessage] = useMutation(DELETE_CHAT_MESSAGE);
  // TODO(caching): After enabling cache policies, implement update(cache)
  // here to remove the message edge from Chat.messages when deletion succeeds.

  const [supportsMarkRead, setSupportsMarkRead] = useState(true);
  const markReadIfSupported = useCallback(
    async (chatId: string, messageId: string): Promise<void> => {
      if (!supportsMarkRead) return;
      try {
        await markChatMessagesAsRead({
          variables: {
            input: {
              chatId,
              messageId,
            },
          },
        });
      } catch (err) {
        console.debug('markChatMessagesAsRead not supported; skipping.', err);
        setSupportsMarkRead(false);
      }
    },
    [markChatMessagesAsRead, supportsMarkRead],
  );

  const deleteMessage = async (messageId: string): Promise<void> => {
    try {
      await deleteChatMessage({
        variables: {
          input: {
            id: messageId,
          },
        },
      });
      paginationRef.current?.removeItem((item) => item.id === messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Callback to handle full query result from CursorPaginationManager
  const handleQueryResult = useCallback(
    (data: { chat: INewChat }) => {
      if (data?.chat) {
        const chatData = data.chat;
        setChat(() => {
          const derivedIsGroup =
            (chatData?.members?.edges?.length ?? 0) > 2 ? true : false;

          let title = chatData.name || '';
          let subtitle = '';
          let image = chatData.avatarURL || '';

          if (chatData.members?.edges?.length === 2) {
            const otherUser = chatData.members.edges.find(
              (edge) => edge.node.user.id !== userId,
            )?.node.user;
            if (otherUser) {
              title = `${otherUser.name}`;
              subtitle = '';
              image = otherUser.avatarURL || '';
            }
          } else if (derivedIsGroup) {
            title = chatData.name;
            subtitle = `${chatData.members?.edges?.length || 0} ${t('members')}`;
            image = chatData.avatarURL || '';
          }

          setChatTitle(title);
          setChatSubtitle(subtitle);
          setChatImage(image);

          return { ...chatData, isGroup: derivedIsGroup };
        });
      }
    },
    [userId],
  );

  const { refetch: unreadChatListRefetch } = useQuery(UNREAD_CHATS);

  const sendMessage = async (): Promise<void> => {
    let messageBody = newMessage;
    if (attachmentObjectName) {
      messageBody = attachmentObjectName;
    }

    if (!messageBody && !attachmentObjectName) {
      return;
    }

    try {
      if (editMessage) {
        await editChatMessage({
          variables: {
            input: {
              id: editMessage.id,
              body: messageBody,
            },
          },
        });
        paginationRef.current?.updateItem(
          (item) => item.id === editMessage.id,
          (item) => ({ ...item, body: messageBody }),
        );
      } else {
        const tempId = `${Date.now()}`;
        const now = new Date().toISOString();
        const newMessageNode: INewChat['messages']['edges'][number]['node'] = {
          id: tempId,
          body: messageBody,
          createdAt: now,
          updatedAt: now,
          creator: {
            id: userId as string,
            name: t('you'),
            avatarMimeType: undefined,
            avatarURL: undefined,
          },
          parentMessage: replyToDirectMessage
            ? {
                id: replyToDirectMessage.id,
                body: replyToDirectMessage.body,
                createdAt: replyToDirectMessage.createdAt,
                creator: {
                  id: replyToDirectMessage.creator.id,
                  name: replyToDirectMessage.creator.name,
                },
              }
            : undefined,
        };

        paginationRef.current?.addItem(newMessageNode, 'end');

        await sendMessageToChat({
          variables: {
            input: {
              chatId: props.selectedContact,
              parentMessageId: replyToDirectMessage?.id,
              body: messageBody,
            },
          },
        });
      }
      const el = document.querySelector(`.${styles.chatMessages}`);
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
      setReplyToDirectMessage(null);
      setEditMessage(null);
      setNewMessage('');
      setAttachment(null);
      setAttachmentObjectName(null);
      await props.chatListRefetch({ id: userId as string });
    } catch (error) {
      console.error('Error sending message:', error);
      if (!editMessage) {
        paginationRef.current?.removeItem((item) =>
          item.id.startsWith('temp-'),
        );
      }
    }
  };

  useSubscription(MESSAGE_SENT_TO_CHAT, {
    variables: {
      input: {
        id: props.selectedContact,
      },
    },
    skip: !props.selectedContact,
    onData: async (messageSubscriptionData) => {
      if (
        messageSubscriptionData?.data.data.chatMessageCreate &&
        messageSubscriptionData?.data.data.chatMessageCreate.chat?.id ===
          props.selectedContact
      ) {
        const newMessage = messageSubscriptionData.data.data.chatMessageCreate;
        if (newMessage?.creator?.id === userId) {
          const el = document.querySelector(`.${styles.chatMessages}`);
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }
        await markReadIfSupported(props.selectedContact, newMessage.id).catch(
          () => {},
        );

        // Soft-append the new message to local state
        const newItem: INewChat['messages']['edges'][number]['node'] = {
          id: newMessage.id,
          body: newMessage.body,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
          creator: {
            id: newMessage.creator?.id || '',
            name: newMessage.creator?.name || '',
            avatarMimeType: newMessage.creator?.avatarMimeType || undefined,
            avatarURL: newMessage.creator?.avatarURL || undefined,
          },
          parentMessage: newMessage.parentMessage
            ? {
                id: newMessage.parentMessage.id,
                body: newMessage.parentMessage.body,
                createdAt: newMessage.parentMessage.createdAt,
                creator: newMessage.parentMessage.creator
                  ? {
                      id: newMessage.parentMessage.creator.id,
                      name: newMessage.parentMessage.creator.name,
                    }
                  : { id: '', name: '' },
              }
            : undefined,
        };

        const exists = paginationRef.current
          ?.getItems()
          .some((item) => item.id === newItem.id);
        if (!exists) {
          paginationRef.current?.addItem(newItem, 'end');
        }
      }
      props.chatListRefetch();
      unreadChatListRefetch();
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddAttachment = (): void => {
    fileInputRef?.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const organizationId = chat?.organization?.id || 'organization';
      const { objectName } = await uploadFileToMinio(file, organizationId);
      setAttachmentObjectName(objectName);
      const presignedUrl = await getFileFromMinio(objectName, organizationId);
      setAttachment(presignedUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      setAttachment(null);
      setAttachmentObjectName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <ErrorBoundaryWrapper
      fallbackTitle={tErrors('title')}
      fallbackErrorMessage={tErrors('message')}
      resetButtonText={tErrors('resetButton')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
    >
      <div
        className={`d-flex flex-column ${styles.chatAreaContainer}`}
        id="chat-area"
      >
        {!props.selectedContact ? (
          <EmptyChatState message={t('selectContact')} />
        ) : (
          <>
            <ChatHeader
              chatImage={chatImage}
              chatTitle={chatTitle}
              chatSubtitle={chatSubtitle}
              isGroup={chat?.isGroup}
              onGroupClick={openGroupChatDetails}
            />
            <div
              className={`d-flex flex-grow-1 flex-column ${styles.flexContainerMinHeight}`}
            >
              <CursorPaginationManager
                query={CHAT_BY_ID}
                queryVariables={{
                  input: { id: props.selectedContact },
                  first: 15,
                }}
                dataPath="chat.messages"
                itemsPerPage={15}
                paginationType="backward"
                variableKeyMap={{
                  last: 'lastMessages',
                  before: 'beforeMessages',
                }}
                actionRef={paginationRef}
                className={styles.chatMessages}
                infiniteScroll={true}
                onQueryResult={handleQueryResult}
                keyExtractor={(item) => item.id}
                renderItem={(item) => (
                  <MessageItem
                    key={item.id}
                    message={item}
                    isGroup={chat?.isGroup || false}
                    currentUserId={userId as string}
                    chatOrganizationId={chat?.organization?.id}
                    getFileFromMinio={getFileFromMinio}
                    onReply={setReplyToDirectMessage}
                    onEdit={(msg) => {
                      setEditMessage(msg);
                      setNewMessage(msg.body);
                    }}
                    onDelete={deleteMessage}
                    t={t}
                  />
                )}
                emptyStateComponent={
                  <EmptyChatState message={t('noMessages')} />
                }
              />
            </div>
            <MessageInput
              newMessage={newMessage}
              replyToDirectMessage={replyToDirectMessage}
              attachment={attachment}
              onNewMessageChange={handleNewMessageChange}
              onSendMessage={sendMessage}
              onAddAttachment={handleAddAttachment}
              onFileChange={handleImageChange}
              onRemoveAttachment={() => {
                setAttachment(null);
                setAttachmentObjectName(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              onCloseReply={() => setReplyToDirectMessage(null)}
              sendMessagePlaceholder={t('sendMessage')}
              fileInputRef={fileInputRef}
            />
          </>
        )}
        {groupChatDetailsModalisOpen && chat && (
          <GroupChatDetails
            toggleGroupChatDetailsModal={toggleGroupChatDetailsModal}
            groupChatDetailsModalisOpen={groupChatDetailsModalisOpen}
            chat={chat}
            chatRefetch={() =>
              Promise.resolve({
                data: { chat: chat },
                loading: false,
                networkStatus: 7,
                error: undefined,
              } as ApolloQueryResult<{ chat: INewChat }>)
            }
          />
        )}
      </div>
    </ErrorBoundaryWrapper>
  );
}
