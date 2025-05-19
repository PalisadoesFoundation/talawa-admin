import type { ApolloQueryResult } from '@apollo/client';
import { type GroupChat } from 'types/Chat/type';

export interface InterfaceGroupChatDetailsProps {
  toggleGroupChatDetailsModal: () => void;
  groupChatDetailsModalisOpen: boolean;
  chat: GroupChat;
  chatRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chat: GroupChat }>>;
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
