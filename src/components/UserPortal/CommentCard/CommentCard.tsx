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
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useMutation } from '@apollo/client';
import { LIKE_COMMENT, UNLIKE_COMMENT } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';

interface InterfaceCommentCardProps {
  id: string;
  creator: {
    id: string;
    name: string;
  };
  upVoteCount: number;
  downVoteCount: number;
  upVoters: {
    edges: {
      id: string;
      node: {
        id: string;
      };
    }[];
  };
  text: string;
}

function CommentCard(props: InterfaceCommentCardProps): JSX.Element {
  const creatorName = props.creator.name;
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  const [likes, setLikes] = React.useState(props.upVoteCount);
  const [isLiked, setIsLiked] = React.useState(false);

  const [likeComment, { loading: liking }] = useMutation(LIKE_COMMENT);
  const [unlikeComment, { loading: unliking }] = useMutation(UNLIKE_COMMENT);

  React.useEffect(() => {
    if (!userId) return;

    const liked = props.upVoters?.edges?.some(
      (edge) => edge.node.id === userId,
    );
    if (props.upVoteCount === 0) {
      setIsLiked(false);
      return;
    }
    setIsLiked(Boolean(liked));
  }, [props.upVoters, userId]);

  React.useEffect(() => {
    setLikes(props.upVoteCount);
  }, [props.upVoteCount]);

  const handleToggleLike = async (): Promise<void> => {
    try {
      if (isLiked) {
        // 👎 Unlike
        const { data } = await unlikeComment({
          variables: {
            input: {
              commentId: props.id,
              creatorId: userId,
            },
          },
        });

        if (data?.deleteCommentVote !== null) {
          setLikes((prev) => Math.max(prev - 1, 0));
          setIsLiked(false);
        } else {
          toast.warn('Could not find an existing like to remove.');
        }
      } else {
        // 👍 Like
        const { data } = await likeComment({
          variables: {
            input: {
              commentId: props.id,
              type: 'up_vote',
            },
          },
        });

        if (data?.createCommentVote?.id) {
          setLikes((prev) => prev + 1);
          setIsLiked(true);
        }
      }
    } catch (error: any) {
      const errorCode = error?.graphQLErrors?.[0]?.extensions?.code;
      if (errorCode === 'forbidden_action_on_arguments_associated_resources') {
        toast.error('You have already liked this comment.');
      } else if (errorCode === 'arguments_associated_resources_not_found') {
        toast.error('No associated vote found to remove.');
      } else {
        toast.error(error.message || 'Something went wrong.');
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
        <div className={styles.cardActions}>
          <Button
            className={styles.cardActionBtn}
            onClick={handleToggleLike}
            data-testid="likeCommentBtn"
            size="sm"
            disabled={liking || unliking}
          >
            {liking || unliking ? (
              <HourglassBottomIcon fontSize="small" />
            ) : isLiked ? (
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

export default CommentCard;
