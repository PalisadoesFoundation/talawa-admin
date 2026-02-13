import type {
  ApolloCache,
  DefaultContext,
  OperationVariables,
  ObservableQuery,
  ApolloLink,
} from '@apollo/client';
import type { useMutation } from '@apollo/client/react';
import type { Chat } from 'types/UserPortal/Chat/interface';

export type ChatsListRefetch = (
  variables?: Partial<{ id: string }> | undefined,
) => Promise<unknown>;

export type CreateChatMutation = (
  options?:
    | useMutation.MutationFunctionOptions<
        unknown,
        OperationVariables,
        ApolloCache
      >
    | undefined,
) => Promise<ApolloLink.Result<unknown>>;

export type CreateChatMembershipMutation = (
  options?:
    | useMutation.MutationFunctionOptions<
        unknown,
        OperationVariables,
        ApolloCache
      >
    | undefined,
) => Promise<ApolloLink.Result<unknown>>;

/**
 * Props for the CreateDirectChat modal.
 */
export interface InterfaceCreateDirectChatProps {
  toggleCreateDirectChatModal: () => void;
  createDirectChatModalisOpen: boolean;
  chatsListRefetch: ChatsListRefetch;
  chats: Chat[];
}
