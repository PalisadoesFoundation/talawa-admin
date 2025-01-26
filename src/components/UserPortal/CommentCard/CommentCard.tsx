import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './CommentCard.module.css';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useMutation } from '@apollo/client';
import { LIKE_COMMENT, UNLIKE_COMMENT } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import useLocalStorage from 'utils/useLocalstorage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface InterfaceCommentCardProps {
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
  handleLikeComment: (commentId: string) => void;
  handleDislikeComment: (commentId: string) => void;
}

/**
 * Displays a card for a single comment with options to like or dislike the comment.
 *
 * Shows the commenter's name, the comment text, and the number of likes.
 * Allows the user to like or dislike the comment. The button icon changes based on whether the comment is liked by the user.
 *
 * @param  props - The properties passed to the component.
 * @param  id - The unique identifier of the comment.
 * @param  creator - Information about the creator of the comment.
 * @param  id - The unique identifier of the creator.
 * @param  firstName - The first name of the creator.
 * @param  lastName - The last name of the creator.
 * @param  email - The email address of the creator.
 * @param  likeCount - The current number of likes for the comment.
 * @param  likedBy - An array of users who have liked the comment.
 * @param  text - The text content of the comment.
 * @param  handleLikeComment - Function to call when the user likes the comment.
 * @param  handleDislikeComment - Function to call when the user dislikes the comment.
 *
 * @returns The rendered comment card component.
 */
function commentCard(props: InterfaceCommentCardProps): JSX.Element {
  // Full name of the comment creator
  const creatorName = `${props.creator.firstName} ${props.creator.lastName}`;

  // Hook to get user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  // Check if the current user has liked the comment
  const likedByUser = props.likedBy.some((likedBy) => likedBy.id === userId);

  // State to track the number of likes and if the comment is liked by the user
  const [likes, setLikes] = React.useState(props.likeCount);
  const [isLikedByUser, setIsLikedByUser] = React.useState(likedByUser);

  // Mutation hooks for liking and unliking comments
  const [likeComment, { loading: likeLoading }] = useMutation(LIKE_COMMENT);
  const [unlikeComment, { loading: unlikeLoading }] =
    useMutation(UNLIKE_COMMENT);

  /**
   * Toggles the like status of the comment.
   *
   * If the comment is already liked by the user, it will be unliked. Otherwise, it will be liked.
   * Updates the number of likes and the like status accordingly.
   *
   * @returns  A promise that resolves when the like/unlike operation is complete.
   */
  const handleToggleLike = async (): Promise<void> => {
    if (isLikedByUser) {
      try {
        const { data } = await unlikeComment({
          variables: {
            commentId: props.id,
          },
        });
        if (data && data.unlikeComment && data.unlikeComment._id) {
          setLikes((likes) => likes - 1);
          setIsLikedByUser(false);
          props.handleDislikeComment(props.id);
        }
      } catch (error: unknown) {
        toast.error(error as string);
      }
    } else {
      try {
        const { data } = await likeComment({
          variables: {
            commentId: props.id,
          },
        });

        if (data && data.likeComment && data.likeComment._id) {
          setLikes((likes) => likes + 1);
          setIsLikedByUser(true);
          props.handleLikeComment(props.id);
        }
      } catch (error: unknown) {
        toast.error(error as string);
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.personDetails}>
        <div className="d-flex align-items-center gap-2">
          <AccountCircleIcon className="my-2" />
          <b>{creatorName}</b>
        </div>
        <span>{props.text}</span>
        <div className={`${styles.cardActions}`}>
          <Button
            className={`${styles.cardActionBtn}`}
            onClick={handleToggleLike}
            data-testid={'likeCommentBtn'}
            size="sm"
          >
            {likeLoading || unlikeLoading ? (
              <HourglassBottomIcon fontSize="small" />
            ) : isLikedByUser ? (
              <ThumbUpIcon fontSize="small" />
            ) : (
              <ThumbUpOffAltIcon fontSize="small" />
            )}
          </Button>
          {`${likes} Likes`}
        </div>
      </div>
    </div>
  );
}

export default commentCard;
