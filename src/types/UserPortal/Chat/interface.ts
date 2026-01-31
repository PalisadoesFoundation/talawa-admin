import type {
  ApolloQueryResult,
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client';
import type { TFunction } from 'i18next';

/**
 * Chat type aligned with GraphQL schema.
 * This is the canonical chat type - use this instead of the legacy GroupChat type.
 */
export type NewChatType = {
  id: string;
  name: string;
  description?: string;
  avatarMimeType?: string;
  avatarURL?: string;
  isGroup?: boolean;
  createdAt: string;
  updatedAt: string | null;
  // Optional unread/computed fields (provided by unreadChats or when opting-in)
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
    edges?: Array<{
      cursor: string;
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
  messages: {
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
  chat: NewChatType;
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
  ) => Promise<ApolloQueryResult<{ chat: NewChatType }>>;
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

/**
 * Organization member entry returned from chat membership listings.
 */
export interface InterfaceOrganizationMember {
  id: string;
  name: string;
  avatarURL?: string;
  role: string;
}

/**
 * Props for CreateDirectChat modal.
 */
export interface InterfaceCreateDirectChatProps {
  toggleCreateDirectChatModal: () => void;
  createDirectChatModalisOpen: boolean;
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
  chats: NewChatType[];
}

export interface InterfaceHandleCreateDirectChatParams {
  id: string;
  userName: string;
  chats: NewChatType[];
  t: TFunction<'translation', 'userChat'>;
  tCommon: TFunction<'common', undefined>;
  createChat: (
    options?:
      | MutationFunctionOptions<
          unknown,
          OperationVariables,
          DefaultContext,
          ApolloCache<unknown>
        >
      | undefined,
  ) => Promise<FetchResult<unknown>>;
  createChatMembership: (
    options?:
      | MutationFunctionOptions<
          unknown,
          OperationVariables,
          DefaultContext,
          ApolloCache<unknown>
        >
      | undefined,
  ) => Promise<FetchResult<unknown>>;
  organizationId: string | undefined;
  userId: string | null;
  currentUserName: string;
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
  toggleCreateDirectChatModal: () => void;
}
