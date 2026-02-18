import type {
  ApolloCache,
  ApolloQueryResult,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client';
import type { Chat } from 'types/UserPortal/Chat/interface';

export type ChatsListRefetch = (
  variables?: Partial<{ id: string }> | undefined,
) => Promise<ApolloQueryResult<unknown>>;

export type CreateChatMutation = (
  options?:
    | MutationFunctionOptions<
        unknown,
        OperationVariables,
        DefaultContext,
        ApolloCache<unknown>
      >
    | undefined,
) => Promise<FetchResult<unknown>>;

export type CreateChatMembershipMutation = (
  options?:
    | MutationFunctionOptions<
        unknown,
        OperationVariables,
        DefaultContext,
        ApolloCache<unknown>
      >
    | undefined,
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
