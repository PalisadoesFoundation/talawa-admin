import type { User } from 'types/shared-components/User/type';
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
  body?: string;
  attachmentURL?: string;
  attachments?: [{ mimeType: string }];
  hasUserVoted?: {
    hasVoted: boolean;
    voteType: 'up_vote' | 'down_vote' | null;
  } | null;
  upVotesCount?: number;
  downVotesCount?: number;
  commentsCount?: number;
}

export interface InterfacePinnedPostsLayoutProps {
  pinnedPosts: InterfacePostEdge[];
  onStoryClick: (post: InterfacePost) => void;
  onPostUpdate?: () => void;
}

export interface InterfacePinnedPostCardProps {
  pinnedPost: InterfacePostEdge;
  onStoryClick: (post: InterfacePost) => void;
  onPostUpdate?: () => void;
}

export interface ICreatePostModalProps {
  show: boolean;
  id?: string;
  title?: string;
  body?: string;
  onHide: () => void;
  refetch: () => Promise<unknown>;
  orgId: string | undefined;
  type: 'create' | 'edit';
}
