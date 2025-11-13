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
 *
 * @param props - The props for the ChatRoom component.
 * @returns The rendered ChatRoom component
 *
 * @example
 * ```tsx
 * <ChatRoom
 *   selectedContact="12345"
 *   chatListRefetch={refetchChatList}
 * />
 * ```
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import styles from './ChatRoom.module.css';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useTranslation } from 'react-i18next';
import { CHAT_BY_ID, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  EDIT_CHAT_MESSAGE,
  MESSAGE_SENT_TO_CHAT,
  SEND_MESSAGE_TO_CHAT,
  MARK_CHAT_MESSAGES_AS_READ,
  DELETE_CHAT_MESSAGE,
} from 'GraphQl/Mutations/OrganizationMutations';
import useLocalStorage from 'utils/useLocalstorage';
import GroupChatDetails from 'components/GroupChatDetails/GroupChatDetails';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import type { IChatRoomProps, INewChat } from './ChatRoomTypes';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { MessageInput } from './MessageInput';
import { MessageImage } from './MessageImage';

export { MessageImage };

export default function chatRoom(props: IChatRoomProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChatRoom',
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
      setHasMoreMessages(true);
      setLoadingMoreMessages(false);
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

  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const backfillAttemptsRef = useRef<number>(0);
  const shouldAutoScrollRef = useRef<boolean>(false);

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
      await chatRefetch();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const { data: chatData, refetch: chatRefetch } = useQuery(CHAT_BY_ID, {
    variables: {
      input: { id: props.selectedContact },
      first: 10,
      after: null,
      lastMessages: 10,
      beforeMessages: null,
    },
  });

  const loadMoreMessages = async (): Promise<void> => {
    if (loadingMoreMessages || !hasMoreMessages || !chat) return;

    const pageInfo = chat.messages.pageInfo;
    if (!pageInfo.hasPreviousPage) {
      setHasMoreMessages(false);
      return;
    }

    setLoadingMoreMessages(true);
    const currentScrollHeight = messagesContainerRef.current?.scrollHeight || 0;

    try {
      const firstMessageCursor = chat.messages.edges[0]?.cursor;
      if (!firstMessageCursor) {
        setHasMoreMessages(false);
        return;
      }

      const result = await chatRefetch({
        input: { id: props.selectedContact },
        first: 10,
        after: null,
        lastMessages: 10,
        beforeMessages: firstMessageCursor,
      });

      if (result.data?.chat?.messages) {
        const newMessages = result.data.chat.messages.edges;

        if (newMessages.length > 0) {
          const existingMessageIds = new Set(
            chat.messages.edges.map((edge) => edge.node.id),
          );
          const uniqueNewMessages = newMessages.filter(
            (edge: INewChat['messages']['edges'][0]) =>
              !existingMessageIds.has(edge.node.id),
          );

          if (uniqueNewMessages.length > 0) {
            const updatedChat = {
              ...chat,
              messages: {
                ...result.data.chat.messages,
                edges: [...uniqueNewMessages, ...chat.messages.edges],
                pageInfo: result.data.chat.messages.pageInfo,
              },
            };

            setChat(updatedChat);

            setTimeout(() => {
              if (messagesContainerRef.current) {
                const newScrollHeight =
                  messagesContainerRef.current.scrollHeight;
                messagesContainerRef.current.scrollTop =
                  newScrollHeight - currentScrollHeight;
              }
            }, 0);

            setHasMoreMessages(
              result.data.chat.messages.pageInfo.hasPreviousPage,
            );
          } else {
            setHasMoreMessages(false);
          }
        } else {
          setHasMoreMessages(false);
        }
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  const handleScroll = (): void => {
    if (!messagesContainerRef.current) return;

    const el = messagesContainerRef.current;
    const { scrollTop } = el;

    if (scrollTop < 100 && hasMoreMessages && !loadingMoreMessages) {
      loadMoreMessages();
    }
  };

  const { refetch: unreadChatListRefetch } = useQuery(UNREAD_CHATS);

  useEffect(() => {
    if (chatData?.chat?.messages?.edges?.length) {
      const lastMessage =
        chatData.chat.messages.edges[chatData.chat.messages.edges.length - 1];
      markReadIfSupported(props.selectedContact, lastMessage.node.id)
        .catch(() => {})
        .finally(() => {
          props.chatListRefetch();
          unreadChatListRefetch();
        });
    }
  }, [props.selectedContact, chatData]);

  useEffect(() => {
    if (chatData) {
      const chat = chatData.chat;
      const derivedIsGroup =
        (chat?.members?.edges?.length ?? 0) > 2 ? true : false;
      setChat({ ...chat, isGroup: derivedIsGroup });

      setHasMoreMessages(chat.messages?.pageInfo?.hasPreviousPage ?? false);

      if (chat.members?.edges?.length === 2) {
        const otherUser = chat.members.edges.find(
          (edge: INewChat['members']['edges'][0]) =>
            edge.node.user.id !== userId,
        )?.node.user;
        if (otherUser) {
          setChatTitle(`${otherUser.name}`);
          setChatSubtitle('');
          setChatImage(otherUser.avatarURL);
        }
      } else if (chat.members?.edges?.length > 2) {
        setChatTitle(chat.name);
        setChatSubtitle(`${chat.members?.edges?.length || 0} members`);
        setChatImage(chat.avatarURL);
      }
    }
  }, [chatData]);

  const sendMessage = async (): Promise<void> => {
    let messageBody = newMessage;
    if (attachmentObjectName) {
      messageBody = attachmentObjectName;
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
      } else {
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
      shouldAutoScrollRef.current = true;
      await chatRefetch();
      setReplyToDirectMessage(null);
      setEditMessage(null);
      setNewMessage('');
      setAttachment(null);
      setAttachmentObjectName(null);
      await props.chatListRefetch({ id: userId as string });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useSubscription(MESSAGE_SENT_TO_CHAT, {
    variables: {
      input: {
        id: props.selectedContact,
      },
    },
    onData: async (messageSubscriptionData) => {
      if (
        messageSubscriptionData?.data.data.chatMessageCreate &&
        messageSubscriptionData?.data.data.chatMessageCreate.chat?.id ===
          props.selectedContact
      ) {
        const newMessage = messageSubscriptionData.data.data.chatMessageCreate;
        if (newMessage?.creator?.id === userId) {
          shouldAutoScrollRef.current = true;
        }
        await markReadIfSupported(props.selectedContact, newMessage.id).catch(
          () => {},
        );

        setChat((prev: INewChat | undefined) => {
          if (!prev) return prev;
          try {
            const newEdge = {
              cursor: newMessage.id,
              node: {
                id: newMessage.id,
                body: newMessage.body,
                createdAt: newMessage.createdAt,
                updatedAt: newMessage.updatedAt,
                creator: {
                  id: newMessage.creator?.id,
                  name: newMessage.creator?.name,
                  avatarMimeType: newMessage.creator?.avatarMimeType,
                  avatarURL: newMessage.creator?.avatarURL,
                },
                parentMessage: newMessage.parentMessage
                  ? {
                      id: newMessage.parentMessage.id,
                      body: newMessage.parentMessage.body,
                      createdAt: newMessage.parentMessage.createdAt,
                      creator: {
                        id: newMessage.parentMessage.creator.id,
                        name: newMessage.parentMessage.creator.name,
                      },
                    }
                  : undefined,
              },
            } as INewChat['messages']['edges'][0];

            const exists = prev.messages.edges.some(
              (e) => e.node.id === newEdge.node.id,
            );
            if (exists) return prev;

            return {
              ...prev,
              messages: {
                ...prev.messages,
                edges: [...prev.messages.edges, newEdge],
              },
            } as INewChat;
          } catch {
            return prev;
          }
        });
      }
      props.chatListRefetch();
      unreadChatListRefetch();
    },
  });

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - (el.scrollTop + el.clientHeight) < 100;
    if (shouldAutoScrollRef.current || nearBottom) {
      el.scrollTop = el.scrollHeight;
      shouldAutoScrollRef.current = false;
    }
  }, [chat?.messages?.edges?.length]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (loadingMoreMessages) return;
    if (!hasMoreMessages) return;

    const { scrollHeight, clientHeight } = el;
    const notScrollable = scrollHeight <= clientHeight + 24;
    if (notScrollable && backfillAttemptsRef.current < 3) {
      backfillAttemptsRef.current += 1;
      loadMoreMessages();
    }
  }, [chat?.messages?.edges?.length, hasMoreMessages, loadingMoreMessages]);

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

  const handleReply = (
    message: INewChat['messages']['edges'][0]['node'],
  ): void => {
    setReplyToDirectMessage(message);
  };

  const handleEdit = (
    message: INewChat['messages']['edges'][0]['node'],
  ): void => {
    setEditMessage(message);
    setNewMessage(message.body);
  };

  const handleRemoveAttachment = (): void => {
    setAttachment(null);
    setAttachmentObjectName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCloseReply = (): void => {
    setReplyToDirectMessage(null);
  };

  return (
    <div
      className={`d-flex flex-column ${styles.chatAreaContainer}`}
      id="chat-area"
    >
      {!props.selectedContact ? (
        <div
          className={`d-flex flex-column justify-content-center align-items-center w-100 h-75 gap-2 ${styles.grey}`}
        >
          <PermContactCalendarIcon fontSize="medium" className={styles.grey} />
          <h6 data-testid="noChatSelected">{t('selectContact')}</h6>
        </div>
      ) : (
        <>
          <ChatHeader
            chatImage={chatImage}
            chatTitle={chatTitle}
            chatSubtitle={chatSubtitle}
            isGroup={!!chat?.isGroup}
            onOpenGroupDetails={openGroupChatDetails}
          />
          {chat && (
            <ChatMessageList
              chat={chat}
              userId={userId as string}
              messagesContainerRef={messagesContainerRef}
              hasMoreMessages={hasMoreMessages}
              loadingMoreMessages={loadingMoreMessages}
              getFileFromMinio={getFileFromMinio}
              onScroll={handleScroll}
              onLoadMore={loadMoreMessages}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={deleteMessage}
              replyLabel={t('reply')}
              editLabel="Edit"
              deleteLabel="Delete"
              loadOlderMessagesLabel="Load older messages"
              loadingLabel="Loading…"
            />
          )}
          <MessageInput
            newMessage={newMessage}
            attachment={attachment}
            replyToMessage={replyToDirectMessage}
            fileInputRef={fileInputRef}
            onNewMessageChange={handleNewMessageChange}
            onSendMessage={sendMessage}
            onAddAttachment={handleAddAttachment}
            onImageChange={handleImageChange}
            onRemoveAttachment={handleRemoveAttachment}
            onCloseReply={handleCloseReply}
            placeholder={t('sendMessage')}
          />
        </>
      )}
      {groupChatDetailsModalisOpen && chat && (
        <GroupChatDetails
          toggleGroupChatDetailsModal={toggleGroupChatDetailsModal}
          groupChatDetailsModalisOpen={groupChatDetailsModalisOpen}
          chat={chat}
          chatRefetch={chatRefetch}
        ></GroupChatDetails>
      )}
    </div>
  );
}
