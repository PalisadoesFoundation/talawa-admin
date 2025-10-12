import type { ApolloQueryResult } from '@apollo/client';
import { type GroupChat } from 'types/Chat/type';

export type NewChatType = {
  id: string;
  name: string;
  description?: string;
  avatarMimeType?: string;
  avatarURL?: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional unread/computed fields (provided by unreadChats or when opting-in)
  unreadMessagesCount?: number;
  hasUnread?: boolean;
  firstUnreadMessageId?: string;
  lastMessage?: {
    id: string;
    body: string;
    createdAt: string;
    updatedAt?: string;
    creator: {
      id: string;
      name: string;
      avatarMimeType?: string;
      avatarURL?: string;
    };
    parentMessage?: {
      id: string;
      body: string;
      createdAt: string;
      creator: {
        id: string;
        name: string;
      };
    };
  };
  organization?: {
    id: string;
    name: string;
    countryCode?: string;
  };
  creator?: {
    id: string;
    name: string;
    avatarMimeType?: string;
    avatarURL?: string;
  };
  updater?: {
    id: string;
    name: string;
    avatarMimeType?: string;
    avatarURL?: string;
  };
  members: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        avatarMimeType?: string;
        avatarURL?: string;
      };
    }>;
  };
  messages: {
    edges: Array<{
      node: {
        id: string;
        body: string;
        createdAt: string;
        updatedAt: string;
        creator: {
          id: string;
          name: string;
          avatarMimeType?: string;
          avatarURL?: string;
        };
        parentMessage?: {
          id: string;
          body: string;
          createdAt: string;
          creator: {
            id: string;
            name: string;
          };
        };
      };
    }>;
  };
};

export interface InterfaceGroupChatDetailsProps {
  toggleGroupChatDetailsModal: () => void;
  groupChatDetailsModalisOpen: boolean;
  chat: GroupChat | NewChatType;
  chatRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chat: GroupChat }>>;
}

export interface InterfaceContactCardProps {
  id: string;
  title: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  isGroup: boolean;
  unseenMessages: number;
  lastMessage: string;
}
