import React from 'react';
import { Button, Card } from 'react-bootstrap';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './PostCard.module.css';
import { useMutation } from '@apollo/client';
import { LIKE_POST, UNLIKE_POST } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useTranslation } from 'react-i18next';

interface InterfacePostCardProps {
  id: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
  image: string;
  video: string;
  text: string;
  title: string;
  likeCount: number;
  commentCount: number;
  likedBy: {
    firstName: string;
    lastName: string;
    id: string;
  }[];
}

export default function postCard(props: InterfacePostCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'postCard',
  });

  const userId = localStorage.getItem('userId');
  const likedByUser = props.likedBy.some((likedBy) => likedBy.id === userId);

  const [likes, setLikes] = React.useState(props.likeCount);
  const [isLikedByUser, setIsLikedByUser] = React.useState(likedByUser);

  const postCreator = `${props.creator.firstName} ${props.creator.lastName}`;

  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST);
  const [unLikePost, { loading: unlikeLoading }] = useMutation(UNLIKE_POST);

  const handleToggleLike = async (): Promise<void> => {
    if (isLikedByUser) {
      try {
        const { data } = await unLikePost({
          variables: {
            postId: props.id,
          },
        });
        /* istanbul ignore next */
        if (data) {
          setLikes((likes) => likes - 1);
          setIsLikedByUser(false);
        }
      } catch (error: any) {
        /* istanbul ignore next */
        toast.error(error);
      }
    } else {
      try {
        const { data } = await likePost({
          variables: {
            postId: props.id,
          },
        });
        /* istanbul ignore next */
        if (data) {
          setLikes((likes) => likes + 1);
          setIsLikedByUser(true);
        }
      } catch (error: any) {
        /* istanbul ignore next */
        toast.error(error);
      }
    }
  };

  return (
    <Card className="my-3">
      <Card.Header>
        <div className={`${styles.cardHeader}`}>
          <AccountCircleIcon />
          {postCreator}
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.text}</Card.Text>
        {props.image && (
          <img src={props.image} className={styles.imageContainer} />
        )}
      </Card.Body>
      <Card.Footer className="text-muted" style={{ fontSize: `small` }}>
        <div className={`${styles.cardActions}`}>
          <Button
            className={`${styles.cardActionBtn}`}
            onClick={handleToggleLike}
            data-testid={'likePostBtn'}
          >
            {likeLoading || unlikeLoading ? (
              <HourglassBottomIcon fontSize="small" />
            ) : isLikedByUser ? (
              <ThumbUpIcon fontSize="small" />
            ) : (
              <ThumbUpOffAltIcon fontSize="small" />
            )}
          </Button>
          {likes}
          {` ${t('likes')}`}
          <Button className={`${styles.cardActionBtn}`}>
            <CommentIcon fontSize="small" />
          </Button>
          {props.commentCount}
          {` ${t('comments')}`}
        </div>
      </Card.Footer>
    </Card>
  );
}
