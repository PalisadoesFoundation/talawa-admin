import type { ApolloQueryResult, FetchResult } from '@apollo/client';
import type { Chat } from 'types/UserPortal/Chat/interface';

export type ChatsListRefetch = (variables?: any) => Promise<any>;

export type CreateChatMutation = (
  options?: any,
) => Promise<FetchResult<unknown>>;

export type CreateChatMembershipMutation = (
  options?: any,
) => Promise<FetchResult<unknown>>;

/**
 * Props for the CreateDirectChat modal.
 */
export interface InterfaceCreateDirectChatProps {
  toggleCreateDirectChatModal: () => void;
  createDirectChatModalisOpen: boolean;
  chatsListRefetch: ChatsListRefetch;
  chats: Chat[];
}
