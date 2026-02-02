import type { VoteType } from 'utils/interfaces';

/**
 * Props for CommentCard component.
 */
export interface InterfaceCommentCardProps {
  /**
   * The unique identifier of the comment.
   */
  id: string;

  /**
   * The creator of the comment, including their ID, name, and optional avatar URL.
   */
  creator: {
    id: string;
    name: string;
    avatarURL?: string | null;
  };

  /**
   * Object indicating if current user has voted and the vote type.
   */
  hasUserVoted?: { voteType: VoteType } | null;

  /**
   * The number of upvotes (likes) on the comment.
   */
  upVoteCount: number;

  /**
   * The text content of the comment.
   */
  text: string;

  /**
   * Optional callback to refresh comments after modifications.
   */
  refetchComments?: () => void;
}
