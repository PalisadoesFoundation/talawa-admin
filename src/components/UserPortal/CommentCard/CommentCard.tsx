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
  const creatorName = `${props.creator.firstName} ${props.creator.lastName}`;

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const likedByUser = props.likedBy.some((likedBy) => likedBy.id === userId);

  const [likes, setLikes] = React.useState(props.likeCount);
  const [isLikedByUser, setIsLikedByUser] = React.useState(likedByUser);
  const [likeComment, { loading: likeLoading }] = useMutation(LIKE_COMMENT);
  const [unlikeComment, { loading: unlikeLoading }] =
    useMutation(UNLIKE_COMMENT);

  const handleToggleLike = async (): Promise<void> => {
    if (isLikedByUser) {
      try {
        const { data } = await unlikeComment({
          variables: {
            commentId: props.id,
          },
        });
        /* istanbul ignore next */
        if (data) {
          setLikes((likes) => likes - 1);
          setIsLikedByUser(false);
          props.handleDislikeComment(props.id);
        }
      } catch (error: any) {
        /* istanbul ignore next */
        toast.error(error);
      }
    } else {
      try {
        const { data } = await likeComment({
          variables: {
            commentId: props.id,
          },
        });
        /* istanbul ignore next */
        if (data) {
          setLikes((likes) => likes + 1);
          setIsLikedByUser(true);
          props.handleLikeComment(props.id);
        }
      } catch (error: any) {
        /* istanbul ignore next */
        toast.error(error);
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.personDetails}>
        <b>{creatorName}</b>
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
