import { ApolloQueryResult } from '@apollo/client';
import { GroupChat } from 'types/Chat/type';

/**
 * Represents an organization member for direct chat creation
 */
export interface InterfaceOrganizationMember {
  /** The ID of the organization member */
  id: string;
  /** The name of the organization member */
  name: string;
  /** The URL of the organization member's avatar */
  avatarURL?: string;
  /** The role of the organization member */
  role: string;
}

/**
 * Props for the CreateDirectChat component
 */
export interface InterfaceCreateDirectChatProps {
  /** Function to toggle the create direct chat modal */
  toggleCreateDirectChatModal: () => void;
  /** Whether the create direct chat modal is open */
  createDirectChatModalisOpen: boolean;
  /** Function to refetch the chats list */
  chatsListRefetch: (
    variables?: Partial<{ id: string }> | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
  /** List of existing chats */
  chats: GroupChat[];
}
