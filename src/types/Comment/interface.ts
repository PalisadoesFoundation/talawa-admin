import type { User } from '../User/type';

export interface InterfaceCommentCardProps {
  id: string;
  creator: Partial<User>;
  likeCount: number;
  likedBy: Partial<User>[];
  text: string;
  handleLikeComment: (commentId: string) => void;
  handleDislikeComment: (commentId: string) => void;
}
