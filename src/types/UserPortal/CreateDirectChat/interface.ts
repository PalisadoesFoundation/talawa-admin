import { ApolloQueryResult } from '@apollo/client';
import { GroupChat } from 'types/Chat/type';

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
