import type { VoteState } from 'utils/interfaces';
import type { Comment } from '../Comment/type';
import type { User } from '../shared-components/User/type';
import type { Organization } from 'types/AdminPortal/Organization/type';

export type Post = {
  _id?: string; // Optional
  commentCount?: number; // Optional
  comments?: Comment[]; // Optional
  createdAt: Date;
  creator?: User; // Optional
  imageUrl?: string; // Optional
  likeCount?: number; // Optional
  organization: Organization;
  pinned?: boolean; // Optional
  text: string;
  title?: string; // Optional
  updatedAt: Date;
  videoUrl?: string; // Optional
};

export type PostInput = {
  _id?: string; // Optional
  imageUrl?: string; // Optional
  organizationId: string;
  pinned?: boolean; // Optional
  text: string;
  title?: string; // Optional
  videoUrl?: string; // Optional
};

export const PostOrderByInputEnum = {
  COMMENT_COUNT_ASC: 'commentCount_ASC',
  COMMENT_COUNT_DESC: 'commentCount_DESC',
  CREATED_AT_ASC: 'createdAt_ASC',
  CREATED_AT_DESC: 'createdAt_DESC',
  ID_ASC: 'id_ASC',
  ID_DESC: 'id_DESC',
  IMAGE_URL_ASC: 'imageUrl_ASC',
  IMAGE_URL_DESC: 'imageUrl_DESC',
  LIKE_COUNT_ASC: 'likeCount_ASC',
  LIKE_COUNT_DESC: 'likeCount_DESC',
  TEXT_ASC: 'text_ASC',
  TEXT_DESC: 'text_DESC',
  TITLE_ASC: 'title_ASC',
  TITLE_DESC: 'title_DESC',
  VIDEO_URL_ASC: 'videoUrl_ASC',
  VIDEO_URL_DESC: 'videoUrl_DESC',
} as const;

export type PostOrderByInput =
  (typeof PostOrderByInputEnum)[keyof typeof PostOrderByInputEnum];

export type PostUpdateInput = {
  imageUrl?: string; //Optional
  text?: string; //Optional
  title?: string; //Optional
  videoUrl?: string; //Optional
};

export type PostWhereInput = {
  //All optional and non-nullable
  id?: string;
  id_contains?: string;
  id_in?: string[];
  id_not?: string;
  id_not_in?: string[];
  id_starts_with?: string;
  text?: string;
  text_contains?: string;
  text_in?: string[];
  text_not?: string;
  text_not_in?: string[];
  text_starts_with?: string;
  title?: string;
  title_contains?: string;
  title_in?: string[];
  title_not?: string;
  title_not_in?: string[];
  title_starts_with?: string;
};

export type PostComments = {
  id: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  likeCount: number;
  text: string;
}[];

export type PostLikes = {
  name: string;
  id: string;
}[];

export type PostNode = {
  id: string;
  caption: string | null;
  createdAt: string;
  commentCount: number;
  creator: {
    id: string;
    name: string;
    emailAddress: string;
    avatarURL?: string | null;
  };
  hasUserVoted: VoteState;
  upVotesCount: number;
  downVotesCount: number;
  pinnedAt: string | null;
  downVoters: {
    edges: {
      node: {
        id: string;
        creator: {
          id: string;
          name: string;
        };
      };
    }[];
  };
  attachments: {
    mimeType: string;
    name: string;
    fileHash: string;
    objectName: string;
  }[];

  commentsCount: number;

  comments?: {
    edges: {
      node: {
        id: string;
        body: string;
        creator: {
          id: string;
          name: string;
          emailAddress: string;
          avatarURL?: string | null;
        };
        hasUserVoted: VoteState;
        downVotesCount: number;
        upVotesCount: number;
        text: string;
      };
    }[];
  };
};

export interface ICreatePostData {
  createPost: {
    id: string;
    caption: string;
    pinnedAt?: string;
    attachments?: {
      fileHash: string;
      mimeType: string;
      name: string;
      objectName: string;
    }[];
  };
}

export interface ICreatePostInput {
  caption: string;
  body?: string;
  organizationId: string;
  isPinned: boolean;
  attachments?: File[];
}

export interface IFileMetadataInput {
  fileHash: string;
  mimetype: string;
  name: string;
  objectName: string;
}
