import type { User } from 'types/User/type';
import type { Comment } from 'types/Comment/type';
export interface InterfacePostCard {
  _id: string;
  creator: Partial<User>;
  postedAt: string;
  image: string | null;
  video: string | null;
  text: string;
  title: string;
  likeCount: number;
  commentCount: number;
  comments: Comment[];
  likedBy: Partial<User>[];
  fetchPosts: () => void;
}

export interface InterfacePostNode {
  createdAt: string;
}

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
}

export interface InterfacePostEdge {
  node: InterfacePostNode;
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
  posts: InterfacePostConnection;
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
}

export interface InterfacePost {
  id: string;
  caption: string;
  createdAt: string;
  pinnedAt?: string | null;
  creator?: InterfaceCreator;
  attachments?: InterfaceAttachment[];
}
