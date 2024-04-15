import React from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Dropdown,
  Form,
  InputGroup,
  Modal,
} from 'react-bootstrap';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

import type { InterfacePostCard } from 'utils/interfaces';
import {
  CREATE_COMMENT_POST,
  LIKE_POST,
  UNLIKE_POST,
} from 'GraphQl/Mutations/mutations';
import CommentCard from '../CommentCard/CommentCard';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './PostCard.module.css';
import UserDefault from '../../../assets/images/defaultImg.png';

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
  const [commentInput, setCommentInput] = React.useState('');
  const [viewPost, setViewPost] = React.useState(false);

  const postCreator = `${props.creator.firstName} ${props.creator.lastName}`;

  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST);
  const [unLikePost, { loading: unlikeLoading }] = useMutation(UNLIKE_POST);
  const [create, { loading: commentLoading }] =
    useMutation(CREATE_COMMENT_POST);

  const toggleViewPost = (): void => setViewPost(!viewPost);

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
    <div key={props.id} className="d-flex justify-content-center">
      <Card className={`${styles.cardStyles}`}>
        <Card.Header className={`${styles.cardHeader}`}>
          <div className={`${styles.creator}`}>
            <AccountCircleIcon className="my-2" />
            <p>{postCreator}</p>
          </div>
          <Dropdown style={{ cursor: 'pointer' }}>
            <Dropdown.Toggle className={styles.customToggle}>
              <MoreVertIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Edit</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Delete</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Pin Post</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Report</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Share</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        <Card.Img variant="top" src={props.image ?? UserDefault} />
        <Card.Body className="pb-0">
          <Card.Title className={`${styles.cardTitle}`}>
            {props.title}
          </Card.Title>
          <Card.Subtitle style={{ color: '#808080' }}>
            Posted On: {props.postedAt}
          </Card.Subtitle>
          <Card.Text className={`${styles.cardText} mt-4`}>
            {props.text}
          </Card.Text>
          {props.image && (
            <img src={props.image} className={styles.imageContainer} />
          )}
        </Card.Body>
        <Card.Footer style={{ border: 'none', background: 'white' }}>
          <div className={`${styles.cardActions}`}>
            <Button
              size="sm"
              variant="success"
              className="px-4"
              onClick={toggleViewPost}
            >
              View Post
            </Button>
          </div>
        </Card.Footer>
      </Card>
      <Modal show={viewPost} onHide={toggleViewPost} size="xl" centered>
        <Modal.Body className="d-flex w-100 p-0" style={{ minHeight: '80vh' }}>
          <div className="w-50 d-flex  align-items-center justify-content-center">
            <img
              src={props.image ?? UserDefault}
              alt="postImg"
              className="w-100"
            />
          </div>
          <div className="w-50 p-2 position-relative">
            <div className="d-flex justify-content-between align-items-center">
              <div className={`${styles.cardHeader} p-0`}>
                <AccountCircleIcon className="my-2" />
                <p>{postCreator}</p>
              </div>
              <div style={{ cursor: 'pointer' }}>
                <MoreVertIcon />
              </div>
            </div>
            <div className="mt-2">
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {props.title}
              </p>
              <p>{props.text}</p>
            </div>
            <h4>Comments</h4>
            <div className={styles.commentContainer}>
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
                <p>No comments to show.</p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <div className={`${styles.modalActions}`}>
                <div className="d-flex align-items-center gap-2">
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
                <div className="d-flex align-items-center gap-2">
                  <Button
                    className={`${styles.cardActionBtn}`}
                    data-testid="showCommentsBtn"
                  >
                    <CommentIcon fontSize="small" />
                  </Button>
                  {numComments}
                  {` ${t('comments')}`}
                </div>
              </div>
              <InputGroup className="mt-2">
                <Form.Control
                  placeholder={'Enter comment'}
                  type="text"
                  className={styles.inputArea}
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
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
