import type { ApolloQueryResult } from '@apollo/client';

/**
 * Props for the CreateGroupChat modal.
 */
export interface InterfaceCreateGroupChatProps {
  toggleCreateGroupChatModal: () => void;
  createGroupChatModalisOpen: boolean;
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
}
