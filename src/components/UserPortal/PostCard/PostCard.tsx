import React from 'react';
import { Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './PostCard.module.css';
import { useMutation } from '@apollo/client';
import {
  CREATE_COMMENT_POST,
  LIKE_POST,
  UNLIKE_POST,
} from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useTranslation } from 'react-i18next';
import SendIcon from '@mui/icons-material/Send';
import { errorHandler } from 'utils/errorHandler';
import CommentCard from '../CommentCard/CommentCard';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfacePostCard } from 'utils/interfaces';

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

export default function postCard(props: InterfacePostCard): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'postCard',
  });

  const { getItem } = useLocalStorage();

  const userId = getItem('userId');
  const likedByUser = props.likedBy.some((likedBy) => likedBy.id === userId);
  const [comments, setComments] = React.useState(props.comments);
  const [numComments, setNumComments] = React.useState(props.commentCount);

  const [likes, setLikes] = React.useState(props.likeCount);
  const [isLikedByUser, setIsLikedByUser] = React.useState(likedByUser);
  const [showComments, setShowComments] = React.useState(false);
  const [commentInput, setCommentInput] = React.useState('');

  const postCreator = `${props.creator.firstName} ${props.creator.lastName}`;

  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST);
  const [unLikePost, { loading: unlikeLoading }] = useMutation(UNLIKE_POST);
  const [create, { loading: commentLoading }] =
    useMutation(CREATE_COMMENT_POST);

  const toggleCommentsModal = (): void => setShowComments(!showComments);

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

  const handleCommentInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const comment = event.target.value;
    setCommentInput(comment);
  };

  const handleDislikeComment = (commentId: string): void => {
    const updatedComments = comments.map((comment) => {
      let updatedComment = { ...comment };
      if (
        comment.id === commentId &&
        comment.likedBy.some((user) => user.id === userId)
      ) {
        updatedComment = {
          ...comment,
          likedBy: comment.likedBy.filter((user) => user.id !== userId),
          likeCount: comment.likeCount - 1,
        };
      }
      return updatedComment;
    });
    setComments(updatedComments);
  };
  const handleLikeComment = (commentId: string): void => {
    const updatedComments = comments.map((comment) => {
      let updatedComment = { ...comment };
      if (
        comment.id === commentId &&
        !comment.likedBy.some((user) => user.id === userId)
      ) {
        updatedComment = {
          ...comment,
          likedBy: [...comment.likedBy, { id: userId }],
          likeCount: comment.likeCount + 1,
        };
      }
      return updatedComment;
    });
    setComments(updatedComments);
  };

  const createComment = async (): Promise<void> => {
    try {
      const { data: createEventData } = await create({
        variables: {
          postId: props.id,
          comment: commentInput,
        },
      });

      /* istanbul ignore next */
      if (createEventData) {
        setCommentInput('');
        setNumComments((numComments) => numComments + 1);

        const newComment: any = {
          id: createEventData.createComment._id,
          creator: {
            id: createEventData.createComment.creator.id,
            firstName: createEventData.createComment.creator.firstName,
            lastName: createEventData.createComment.creator.lastName,
            email: createEventData.createComment.creator.email,
          },
          likeCount: createEventData.createComment.likeCount,
          likedBy: createEventData.createComment.likedBy,
          text: createEventData.createComment.text,
          handleLikeComment: handleLikeComment,
          handleDislikeComment: handleDislikeComment,
        };

        setComments([...comments, newComment]);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <div data-testid="postCardContainer">
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
            <Button
              className={`${styles.cardActionBtn}`}
              onClick={toggleCommentsModal}
              data-testid="showCommentsBtn"
            >
              <CommentIcon fontSize="small" />
            </Button>
            {numComments}
            {` ${t('comments')}`}
          </div>
        </Card.Footer>
      </Card>
      <Modal show={showComments} onHide={toggleCommentsModal}>
        <Modal.Body>
          <div className={`${styles.creatorNameModal}`}>
            <AccountCircleIcon />
            <b>{postCreator}</b>
          </div>
          {props.image && (
            <img src={props.image} className={styles.imageContainer} />
          )}
          <div className={styles.textModal}>{props.text}</div>
          <div className={`${styles.modalActions}`}>
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
          </div>
          <h4>Comments</h4>
          {numComments ? (
            comments.map((comment: any, index: any) => {
              const cardProps: InterfaceCommentCardProps = {
                id: comment.id,
                creator: {
                  id: comment.creator.id,
                  firstName: comment.creator.firstName,
                  lastName: comment.creator.lastName,
                  email: comment.creator.email,
                },
                likeCount: comment.likeCount,
                likedBy: comment.likedBy,
                text: comment.text,
                handleLikeComment: handleLikeComment,
                handleDislikeComment: handleDislikeComment,
              };

              return <CommentCard key={index} {...cardProps} />;
            })
          ) : (
            <>No comments to show.</>
          )}
          <hr />
          <InputGroup className={styles.maxWidth}>
            <Form.Control
              placeholder={'Enter comment'}
              type="text"
              className={`${styles.borderNone} ${styles.backgroundWhite}`}
              value={commentInput}
              onChange={handleCommentInput}
              data-testid="commentInput"
            />
            <InputGroup.Text
              className={`${styles.colorPrimary} ${styles.borderNone}`}
              onClick={createComment}
              data-testid="createCommentBtn"
            >
              {commentLoading ? (
                <HourglassBottomIcon fontSize="small" />
              ) : (
                <SendIcon />
              )}
            </InputGroup.Text>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
}
