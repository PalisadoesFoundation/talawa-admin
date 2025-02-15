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
