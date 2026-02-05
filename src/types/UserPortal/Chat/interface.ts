import type { ApolloQueryResult } from '@apollo/client';

export type Chat = {
  id: string;
  name: string;
  description?: string;
  avatarMimeType?: string;
  avatarURL?: string;
  isGroup?: boolean;
  createdAt: string;
  updatedAt?: string | null;
  unreadMessagesCount?: number;
  hasUnread?: boolean;
  firstUnreadMessageId?: string;
  lastMessage?: {
    id: string;
    body: string;
    createdAt: string;
    updatedAt?: string | null;
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
  members?: {
    edges: Array<{
      cursor?: string;
      node: {
        user: {
          id: string;
          name: string;
          avatarMimeType?: string;
          avatarURL?: string;
        };
        role: string;
      };
    }>;
  };
  messages?: {
    edges: Array<{
      __typename?: string;
      node: {
        __typename?: string;
        id: string;
        body: string;
        createdAt: string;
        updatedAt: string | null;
        creator: {
          __typename?: string;
          id: string;
          name: string;
          avatarMimeType?: string | null;
          avatarURL?: string | null;
        };
        parentMessage?: {
          __typename?: string;
          id: string;
          body: string;
          createdAt: string;
          creator: {
            __typename?: string;
            id: string;
            name: string;
          };
        } | null;
      };
    }>;
  };
};

export interface InterfaceGroupChatDetailsProps {
  toggleGroupChatDetailsModal: () => void;
  groupChatDetailsModalisOpen: boolean;
  chat: Chat;
  chatRefetch: (
    variables?:
      | Partial<{
          input: { id: string };
          first?: number;
          after?: string | null;
          lastMessages?: number;
          beforeMessages?: string | null;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chat: Chat }>>;
}

/**
 * Props for ContactCard component.
 */
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

/**
 * Organization member with their role.
 */
export interface InterfaceOrganizationMember {
  id: string;
  name: string;
  avatarURL?: string;
  role: string;
}

/**
 * Props for the CreateDirectChat modal.
 */
export interface InterfaceCreateDirectChatProps {
  toggleCreateDirectChatModal: () => void;
  createDirectChatModalisOpen: boolean;
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
  chats: Chat[];
}
