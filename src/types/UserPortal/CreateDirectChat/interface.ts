import type { ApolloQueryResult } from '@apollo/client';
import type { GroupChat } from '../Chat/type';

/**
 *  Organization member interface.
 */
export interface InterfaceOrganizationMember {
  id: string;
  name: string;
  avatarURL?: string;
  role: string;
}

/**
 *  Props for CreateDirectChatModal component.
 */
export interface InterfaceCreateDirectChatProps {
  toggleCreateDirectChatModal: () => void;
  createDirectChatModalisOpen: boolean;
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
  chats: GroupChat[];
}
