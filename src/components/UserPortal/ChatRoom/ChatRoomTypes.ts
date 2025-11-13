/**
 * Type definitions for ChatRoom components
 */

import type { ApolloQueryResult } from '@apollo/client';
import type { GroupChat } from 'types/Chat/type';
import type { NewChatType } from 'types/Chat/interface';

export interface IChatRoomProps {
  selectedContact: string;
  chatListRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chatList: GroupChat[] }>>;
}

/**
 * Extended chat type for ChatRoom with additional pagination fields
 * Extends NewChatType with cursor and pageInfo fields required for infinite scroll
 */
export interface INewChat extends Omit<NewChatType, 'messages'> {
  messages: {
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
    edges: Array<{
      cursor: string;
      node: {
        __typename?: string;
        id: string;
        body: string;
        createdAt: string;
        updatedAt: string | null;
        creator: {
          __typename?: string;
          id: string;
          name: string;
          avatarMimeType?: string | null;
          avatarURL?: string | null;
        };
        parentMessage?: {
          __typename?: string;
          id: string;
          body: string;
          createdAt: string;
          creator: {
            __typename?: string;
            id: string;
            name: string;
          };
        } | null;
      };
    }>;
  };
}

export interface IMessageImageProps {
  media: string;
  organizationId?: string;
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
}
