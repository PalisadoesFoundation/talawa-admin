import type { InterfacePostCard } from 'utils/interfaces';
export type { InterfacePostCard };

export interface InterfacePostCreator {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface InterfacePostNode {
  id: string;
  caption: string;
  text?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  creator?: InterfacePostCreator;
  pinned?: boolean;
  createdAt: string; // Added from the other interface
}

export interface InterfacePostEdge {
  node: InterfacePost; // Change to InterfacePost instead of InterfacePostNode
  cursor: string;
}
export interface InterfacePageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface InterfacePostConnection {
  edges: InterfacePostEdge[];
  pageInfo: InterfacePageInfo;
}

export interface InterfaceOrganization {
  id: string;
  posts: {
    edges: InterfacePostEdge[];
    pageInfo: InterfacePageInfo;
    totalCount: number; // Move totalCount inside posts
  };
  pinnedPosts: {
    edges: InterfacePostEdge[];
    pageInfo: InterfacePageInfo;
    totalCount: number;
  };
}

export interface InterfaceOrganizationPostListData {
  organization: InterfaceOrganization;
}

// Define the proper interface for the mutation input
export interface InterfaceMutationCreatePostInput {
  caption: string;
  organizationId: string;
  isPinned: boolean;
  attachments?: File[];
}

export interface InterfaceAttachment {
  url: string;
}

export interface InterfaceCreator {
  id: string;
  name: string;
  email: string;
  avatarURL?: string;
}

export interface InterfacePost {
  id: string;
  caption?: string | null;
  createdAt: string;
  pinnedAt?: string | null;
  pinned?: boolean;
  creator?: InterfaceCreator | null;
  attachments?: InterfaceAttachment[];
  imageUrl?: string | null;
  videoUrl?: string | null;
}
