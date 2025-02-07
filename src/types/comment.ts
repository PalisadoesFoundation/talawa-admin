import type { User } from './user';
import type { Post } from './post';

export type Comment = {
  _id: string;
  createdAt: Date;
  creator?: User; // Optional
  likeCount?: number; // Optional
  likedBy?: User[]; // Optional
  post: Post;
  text: string;
  updatedAt: Date;
};

export type CommentInput = {
  text: string;
};
