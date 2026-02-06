import type { FetchResult } from '@apollo/client';
import type { Chat } from 'types/UserPortal/Chat/interface';

export type ChatsListRefetch = (
  variables?: Record<string, unknown>,
) => Promise<unknown>;

export type CreateChatMutation = (
  options?: Record<string, unknown>,
) => Promise<FetchResult<unknown>>;

export type CreateChatMembershipMutation = (
  options?: Record<string, unknown>,
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
