import type { User } from 'types/User/type';
import type { Comment } from 'types/Comment/type';
export interface InterfacePostCard {
  id: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
  postedAt: string;
  image: string | null;
  video: string | null;
  text: string;
  title: string;
  likeCount: number;
  commentCount: number;
  comments: {
    id: string;
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    likeCount: number;
    likedBy: {
      id: string;
    }[];
    text: string;
  }[];
  likedBy: {
    firstName: string;
    lastName: string;
    id: string;
  }[];
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

export interface InterfacePostAttachment {
  createdAt: string; // Changed from Date to string since GraphQL returns string
  fileName: string;
  url: string; // MinIO URL
  mimeType: string;
  postId: string;
  name: string;
}

export interface InterfacePost {
  _id: string;
  text: string;
  title: string;
  createdAt: string; // Keep as string to match API data
  imageUrl: string | null;
  videoUrl: string | null;
  attachments?: InterfacePostAttachment[];
  creatorId: string | null;
  organization: {
    _id: string;
  };
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  likeCount: number;
  commentCount: number;
  pinned?: boolean;
}
