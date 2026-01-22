/**
 * useChatRoomState
 *
 * Custom hook to manage ChatRoom component state.
 * Encapsulates all state management logic for the chat room.
 *
 * @returns Object containing all state values and setters
 */

import { useState, useCallback } from 'react';
import type { NewChatType } from 'types/Chat/interface';

export const useChatRoomState = () => {
  const [chatTitle, setChatTitle] = useState<string>('');
  const [chatSubtitle, setChatSubtitle] = useState<string>('');
  const [chatImage, setChatImage] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [chat, setChat] = useState<NewChatType | undefined>(undefined);
  const [replyToDirectMessage, setReplyToDirectMessage] = useState<
    NewChatType['messages']['edges'][0]['node'] | null
  >(null);
  const [editMessage, setEditMessage] = useState<
    NewChatType['messages']['edges'][0]['node'] | null
  >(null);
  const [groupChatDetailsModalisOpen, setGroupChatDetailsModalisOpen] =
    useState<boolean>(false);
  const [loadingMoreMessages, setLoadingMoreMessages] =
    useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentObjectName, setAttachmentObjectName] = useState<
    string | null
  >(null);

  const openGroupChatDetails = useCallback((): void => {
    setGroupChatDetailsModalisOpen(true);
  }, []);

  const toggleGroupChatDetailsModal = useCallback((): void => {
    setGroupChatDetailsModalisOpen((prev) => !prev);
  }, []);

  const clearMessageInput = useCallback((): void => {
    setNewMessage('');
    setReplyToDirectMessage(null);
    setEditMessage(null);
  }, []);

  const clearAttachment = useCallback((): void => {
    setAttachment(null);
    setAttachmentObjectName(null);
  }, []);

  return {
    // State
    chatTitle,
    chatSubtitle,
    chatImage,
    newMessage,
    chat,
    replyToDirectMessage,
    editMessage,
    groupChatDetailsModalisOpen,
    loadingMoreMessages,
    hasMoreMessages,
    attachment,
    attachmentObjectName,
    // Setters
    setChatTitle,
    setChatSubtitle,
    setChatImage,
    setNewMessage,
    setChat,
    setReplyToDirectMessage,
    setEditMessage,
    setGroupChatDetailsModalisOpen,
    setLoadingMoreMessages,
    setHasMoreMessages,
    setAttachment,
    setAttachmentObjectName,
    // Helpers
    openGroupChatDetails,
    toggleGroupChatDetailsModal,
    clearMessageInput,
    clearAttachment,
  };
};
