/**
 * Chat Types
 *
 * This file defines TypeScript interfaces for the chat room functionality.
 * It includes type definitions for chat entities, members, messages, and pagination.
 *
 * @remarks
 * - INewChat: Main interface representing a chat entity.
 * - Supports both direct messages and group chats.
 * - Includes pagination information for messages.
 *
 * @example
 * ```ts
 * const chat: INewChat = {
 *   id: 'chat123',
 *   name: 'Group Chat',
 *   isGroup: true,
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-01T00:00:00Z',
 *   members: { edges: [...] },
 *   messages: { edges: [...], pageInfo: {...} }
 * };
 * ```
 */

export interface INewChat {
  id: string;
  name: string;
  description?: string;
  avatarMimeType?: string;
  avatarURL?: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    countryCode?: string;
  };
  creator?: {
    id: string;
    name: string;
    avatarMimeType?: string;
    avatarURL?: string;
  };
  updater?: {
    id: string;
    name: string;
    avatarMimeType?: string;
    avatarURL?: string;
  };
  members: {
    edges: Array<{
      cursor: string;
      node: {
        user: {
          id: string;
          name: string;
          avatarMimeType?: string;
          avatarURL?: string;
        };
        role: string;
      };
    }>;
  };
  messages: {
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        body: string;
        createdAt: string;
        updatedAt: string;
        creator: {
          id: string;
          name: string;
          avatarMimeType?: string;
          avatarURL?: string;
        };
        parentMessage?: {
          id: string;
          body: string;
          createdAt: string;
          creator: {
            id: string;
            name: string;
          };
        };
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
}

export interface InterfaceChatHeaderProps {
  chatImage: string;
  chatTitle: string;
  chatSubtitle: string;
  isGroup?: boolean;
  onGroupClick?: () => void;
}
