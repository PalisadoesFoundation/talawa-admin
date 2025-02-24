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
