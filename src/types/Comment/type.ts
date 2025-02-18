import type { User } from '../User/type';
import type { Post } from '../Post/type';

export type Comment = {
  id: string;
  createdAt: Date;
  creator: Partial<User>; // Optional
  likeCount?: number; // Optional
  likedBy?: User[]; // Optional
  post: Post;
  text: string;
  updatedAt: Date;
};

export type CommentInput = {
  text: string;
};
