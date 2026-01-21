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
 * @returns The rendered ChatRoom comp                            {message.parentMessage && (
                              <a href={`#${message.parentMessage.id}`}>
                                <div className={styles.replyToMessage}>
                                  <p className={styles.replyToMessageSender}>
                                    {message.parentMessage.creator.name}
                                  </p>
                                  <span>{message.parentMessage.body}</span>
                                </div>
                              </a>
                            )} @example
 * ```tsx
 * <ChatRoom
 *   selectedContact="12345"
 *   chatListRefetch={refetchChatList}
 * />
 * ```
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from 'react-bootstrap';
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
import GroupChatDetails from 'components/GroupChatDetails/GroupChatDetails';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import type { INewChat } from './types';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import EmptyChatState from './EmptyChatState';
import MessageInput from './MessageInput';

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
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
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
    skip: !props.selectedContact,
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
  // const { refetch: chatListRefetch } = useQuery(CHATS_LIST, {
  //   variables: {
  //     id: userId,
  //   },
  // });

  const { refetch: unreadChatListRefetch } = useQuery(UNREAD_CHATS);
  // NOTE(caching): With cache policies, unread chats list can be updated via
  // cache.modify on Query.unreadChats instead of refetching.

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
      shouldAutoScrollRef.current = true;

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
  }, [chatData, userId]);

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
        await chatRefetch();
      } else {
        const tempId = `temp-${Date.now()}`;
        setChat((prev: INewChat | undefined) => {
          if (!prev) return prev;
          const now = new Date().toISOString();
          const newEdge = {
            cursor: tempId,
            node: {
              id: tempId,
              body: messageBody,
              createdAt: now,
              updatedAt: now,
              creator: {
                id: userId,
                name: 'You',
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
            },
          } as INewChat['messages']['edges'][0];
          return {
            ...prev,
            messages: {
              ...prev.messages,
              edges: [...prev.messages.edges, newEdge],
            },
          } as INewChat;
        });

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
    skip: !props.selectedContact,
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

        // Soft-append the new message to local state to avoid pagination issues.
        // TODO(caching): With cache policies, prefer cache.modify on Chat.messages
        //               to append if the message is not present (dedupe by node.id).
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
      // TODO(caching): Replace refetches above with targeted cache updates once
      // cache policies are enabled (e.g., bump lastMessage and unread count).
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
              {hasMoreMessages && (chat?.messages?.edges?.length ?? 0) > 0 && (
                <div className={styles.loadMoreBar}>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={loadMoreMessages}
                    disabled={loadingMoreMessages}
                  >
                    {loadingMoreMessages
                      ? t('loading')
                      : t('loadOlderMessages')}
                  </Button>
                </div>
              )}
              <ChatMessages
                messages={chat?.messages?.edges || []}
                isGroup={chat?.isGroup || false}
                currentUserId={userId as string}
                chatOrganizationId={chat?.organization?.id}
                getFileFromMinio={getFileFromMinio}
                onScroll={handleScroll}
                loadingMoreMessages={loadingMoreMessages}
                onReply={setReplyToDirectMessage}
                onEdit={(message) => {
                  setEditMessage(message);
                  setNewMessage(message.body);
                }}
                onDelete={deleteMessage}
                t={t}
                setMessagesContainerRef={(ref) => {
                  messagesContainerRef.current = ref;
                }}
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
            chatRefetch={chatRefetch}
          />
        )}
      </div>
    </ErrorBoundaryWrapper>
  );
}
