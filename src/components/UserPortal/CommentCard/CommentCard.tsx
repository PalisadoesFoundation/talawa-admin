/**
 * CommentCard Component
 *
 * This component represents a card displaying a comment with the ability to like or unlike it.
 * It shows the comment creator's details, the comment text, and the like count.
 *
 * @component
 * @param props - The properties required by the CommentCard component.
 * @param props.id - The unique identifier of the comment.
 * @param props.creator - The creator of the comment, including their ID, first name, last name, and email.
 * @param props.likeCount - The initial number of likes on the comment.
 * @param props.likedBy - An array of users who have liked the comment.
 * @param props.text - The text content of the comment.
 * @param props.handleLikeComment - Callback function triggered when the comment is liked.
 * @param props.handleDislikeComment - Callback function triggered when the comment is unliked.
 *
 * @returns A JSX element representing the comment card.
 *
 * @remarks
 * - The component uses Apollo Client's `useMutation` hook to handle like and unlike operations.
 * - The `useLocalStorage` hook is used to retrieve the current user's ID from local storage.
 * - The like/unlike button displays a loading spinner while the mutation is in progress.
 *
 * @example
 * ```tsx
 * <CommentCard
 *   id="comment123"
 *   creator={{ id: "user1", firstName: "John", lastName: "Doe", email: "john.doe@example.com" }}
 *   likeCount={10}
 *   likedBy={[{ id: "user2" }]}
 *   text="This is a sample comment."
 *   handleLikeComment={(id) => console.log(`Liked comment with ID: ${id}`)}
 *   handleDislikeComment={(id) => console.log(`Disliked comment with ID: ${id}`)}
 * />
 * ```
 */
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
