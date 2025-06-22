import type { Comment } from '../Comment/type';
import type { User } from '../User/type';
import type { Organization } from 'types/Organization/type';

export type Post = {
  _id?: string; // Optional
  commentCount?: number; // Optional
  comments?: Comment[]; // Optional
  createdAt: Date;
  creator?: User; // Optional
  imageUrl?: string; // Optional
  likeCount?: number; // Optional
  likedBy?: User[]; // Optional
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

export const PostOrderByInput = {
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

// eslint-disable-next-line no-redeclare
export type PostOrderByInput =
  (typeof PostOrderByInput)[keyof typeof PostOrderByInput];

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
  likedBy: {
    id: string;
  }[];
  text: string;
}[];

export type PostLikes = {
  firstName: string;
  lastName: string;
  id: string;
}[];

export type PostNode = {
  commentCount: number;
  createdAt: string;
  creator: {
    email: string;
    firstName: string;
    lastName: string;
    _id: string;
  };
  imageUrl: string | null;
  likeCount: number;
  likedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
  pinned: boolean;
  text: string;
  title: string;
  videoUrl: string | null;
  _id: string;

  comments: PostComments;
  likes: PostLikes;
};
