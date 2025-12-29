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
  fetchPosts: () => void;
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

/**
 * Post attachment details interface
 * Used for attachment data structure in OrgPostCard components
 */
export interface InterfacePostAttachment {
  id: string;
  postId: string;
  name: string;
  mimeType: string;
  createdAt: Date;
  updatedAt?: Date | null;
  creatorId?: string | null;
  updaterId?: string | null;
}

/**
 * Post interface with full attachment information
 * Used in OrgPostCard, PostDetailModal, PostEditModal components
 */
export interface InterfacePostWithAttachments {
  id: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  pinnedAt?: Date | null;
  creatorId: string | null;
  attachments: InterfacePostAttachment[];
}

/**
 * PostDetailModal component props interface
 */
export interface IPostDetailModalProps {
  show: boolean;
  onHide: () => void;
  post: InterfacePostWithAttachments;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * PostEditModal component props interface
 */
export interface IPostEditModalProps {
  show: boolean;
  onHide: () => void;
  post: InterfacePostWithAttachments;
  /**
   * Callback function after post update success
   * Used to notify parent component to refresh data, replacing window.location.reload()
   */
  onSuccess?: () => void;
}

/**
 * OrgPostCard component props interface
 */
export interface InterfaceOrgPostCardProps {
  post: InterfacePostWithAttachments;
}

/**
 * PostEditModal internal form state interface
 */
export interface InterfacePostFormState {
  caption: string;
  attachments: { url: string; mimeType: string }[];
}
