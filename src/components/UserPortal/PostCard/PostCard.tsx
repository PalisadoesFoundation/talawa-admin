import React, { useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  Col,
  Button,
  Card,
  Dropdown,
  Form,
  InputGroup,
  Modal,
  ModalFooter,
} from 'react-bootstrap';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ClearIcon from '@mui/icons-material/Clear';

import type { InterfacePostCard } from 'utils/interfaces';
import {
  CREATE_COMMENT_POST,
  DELETE_POST_MUTATION,
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
    image: string;
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
 * PostCard component displays an individual post, including its details, interactions, and comments.
 *
 * The component allows users to:
 * - View the post's details in a modal.
 * - Edit or delete the post.
 * - Like or unlike the post.
 * - Add comments to the post.
 * - Like or dislike individual comments.
 *
 * @param props - The properties passed to the component including post details, comments, and related actions.
 * @returns JSX.Element representing a post card with interactive features.
 */
export default function postCard(props: InterfacePostCard): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'postCard',
  });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();

  // Retrieve user ID from local storage
  const userId = getItem('userId');
  // Check if the post is liked by the current user
  const likedByUser = props.likedBy.some((likedBy) => likedBy.id === userId);

  // State variables
  const [comments, setComments] = useState(props.comments);
  const [numComments, setNumComments] = useState(props.commentCount);

  const [likes, setLikes] = useState(props.likeCount);
  const [isLikedByUser, setIsLikedByUser] = useState(likedByUser);
  const [commentInput, setCommentInput] = useState('');
  const [viewPost, setViewPost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [postContent, setPostContent] = useState<string>(props.text);
  const [editedMedia, setEditedMedia] = useState<File | null>(null);
  const [editedMediaType, setEditedMediaType] = useState<
    'image' | 'video' | null
  >(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Post creator's full name
  const postCreator = `${props.creator.firstName} ${props.creator.lastName}`;

  // GraphQL mutations
  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST);
  const [unLikePost, { loading: unlikeLoading }] = useMutation(UNLIKE_POST);
  const [create, { loading: commentLoading }] =
    useMutation(CREATE_COMMENT_POST);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);

  // Toggle the view post modal
  const toggleViewPost = (): void => setViewPost((prev) => !prev);

  // Toggle the edit post modal
  const toggleEditPost = (): void => setShowEditPost((prev) => !prev);

  // Handle input changes for the post content
  const handlePostInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPostContent(e.target.value);
  };

  // Toggle like or unlike the post
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
      } catch (error: unknown) {
        /* istanbul ignore next */
        toast.error(error as string);
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
      } catch (error: unknown) {
        /* istanbul ignore next */
        toast.error(error as string);
      }
    }
  };

  // Handle changes to the comment input field
  const handleCommentInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const comment = event.target.value;
    setCommentInput(comment);
  };

  // Dislike a comment
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

  // Like a comment
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

  // Create a new comment
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

        const newComment: InterfaceCommentCardProps = {
          id: createEventData.createComment.id,
          creator: {
            id: createEventData.createComment.creator._id,
            firstName: createEventData.createComment.creator.firstName,
            lastName: createEventData.createComment.creator.lastName,
            email: createEventData.createComment.creator.email,
            image: createEventData.createComment.creator.image,
          },
          likeCount: createEventData.createComment.likeCount,
          likedBy: createEventData.createComment.likedBy,
          text: createEventData.createComment.text,
          handleLikeComment: handleLikeComment,
          handleDislikeComment: handleDislikeComment,
        };

        setComments([...comments, newComment]);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  // Edit the post
  const handleEditPost = async () => {
    try {
      const formData = new FormData();
      formData.append('id', props.id);
      formData.append('text', postContent);
      if (editedMedia) {
        formData.append('file', editedMedia);
      }

      const accessToken = getItem('token');

      const response = await fetch(
        `${process.env.REACT_APP_TALAWA_REST_URL}/update-post/${props.id}`,
        {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res?.error || t('postUpdationFailed'));
      }

      toggleEditPost();
      handleClearMedia();
      toast.success(tCommon('updatedSuccessfully', { item: 'Post' }));
      props.fetchPosts();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  // Delete the post
  const handleDeletePost = async (): Promise<void> => {
    try {
      deletePost({
        variables: {
          id: props.id,
        },
      });

      toast.success(t('deletionSuccessfull'));
      props.fetchPosts();
    } catch (error: unknown) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast.error(t('noMediaSelected'));
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreviewUrl(previewUrl);
    setEditedMedia(file);
    setEditedMediaType(isImage ? 'image' : 'video');
  };

  const handleClearMedia = () => {
    setEditedMedia(null);
    setEditedMediaType(null);
    setMediaPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Col key={props.id} className="d-flex col-auto my-2">
      <Card className={`${styles.cardStyles}`}>
        <Card.Header className={`${styles.cardHeader} py-2`}>
          <div className={`${styles.creator}`}>
            {props?.creator?.image ? (
              <img src={props?.creator?.image} alt="creator image" />
            ) : (
              <AccountCircleIcon className="my-2" />
            )}
            <p>{postCreator}</p>
          </div>
          <Dropdown style={{ cursor: 'pointer' }}>
            <Dropdown.Toggle
              className={styles.customToggle}
              data-testid={'dropdown'}
            >
              <MoreVertIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleEditPost} data-testid={'editPost'}>
                <EditOutlinedIcon
                  style={{ color: 'grey', marginRight: '8px' }}
                />
                {tCommon('edit')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={handleDeletePost}
                data-testid={'deletePost'}
              >
                <DeleteOutlineOutlinedIcon
                  style={{ color: 'red', marginRight: '8px' }}
                />
                {tCommon('delete')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        {props.image ? (
          <Card.Img
            className={styles.postImage}
            variant="top"
            src={
              props.image === '' || props.image === null
                ? UserDefault
                : props.image
            }
          />
        ) : props.video ? (
          <div className={styles.videoContainer}>
            <video
              className={styles.postVideo}
              controls
              data-testid="post-video"
            >
              <source src={props.video} type="video/mp4" />
            </video>
          </div>
        ) : (
          ''
        )}
        <Card.Body className="pb-0">
          <Card.Title className={`${styles.cardTitle}`}>
            {props.title}
          </Card.Title>
          <Card.Subtitle style={{ color: '#808080' }}>
            {t('postedOn', { date: props.postedAt })}
          </Card.Subtitle>
          <Card.Text className={`${styles.cardText} mt-4`}>
            {props.text}
          </Card.Text>
        </Card.Body>
        <Card.Footer style={{ border: 'none', background: 'white' }}>
          <div className={`${styles.cardActions}`}>
            <Button
              size="sm"
              variant="success"
              className="px-4"
              data-testid={'viewPostBtn'}
              onClick={toggleViewPost}
            >
              {t('viewPost')}
            </Button>
          </div>
        </Card.Footer>
      </Card>
      <Modal
        show={viewPost}
        onHide={toggleViewPost}
        size="xl"
        centered
        className="overflow-hidden"
      >
        <Modal.Body className="d-flex w-100 p-0" style={{ minHeight: '80vh' }}>
          {props.image ? (
            <div className={`w-50 ${styles.mediaContainer}`}>
              <img
                className={styles.editPostImage}
                src={
                  props.image === '' || props.image === null
                    ? UserDefault
                    : props.image
                }
                alt="postImg"
              />
            </div>
          ) : props.video ? (
            <div className={`w-50 ${styles.mediaContainer}`}>
              <video className={styles.editPostVideo} controls>
                <source src={props.video} type="video/mp4" />
              </video>
            </div>
          ) : (
            ''
          )}
          <div className="w-50 p-2 position-relative">
            <div className="d-flex justify-content-between align-items-center">
              <div className={`${styles.cardHeader} p-0`}>
                <div className={`${styles.creator} my-1`}>
                  {props?.creator?.image ? (
                    <img
                      className={styles.editPostImage}
                      src={props?.creator?.image}
                      alt="postImg"
                    />
                  ) : (
                    <AccountCircleIcon className="my-2" />
                  )}
                  <p>{postCreator}</p>
                </div>
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
                comments.map((comment, index: number) => {
                  const cardProps: InterfaceCommentCardProps = {
                    id: comment.id,
                    creator: {
                      id: comment.creator.id,
                      firstName: comment.creator.firstName,
                      lastName: comment.creator.lastName,
                      email: comment.creator.email,
                      image: comment.creator.image,
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
                <p>{t('noComments')}</p>
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
                  <Button className={`${styles.cardActionBtn}`}>
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
      <Modal show={showEditPost} onHide={toggleEditPost} size="lg" centered>
        <Modal.Header closeButton className="py-2 ">
          <p className="fs-3" data-testid={'editPostModalTitle'}>
            {t('editPost')}
          </p>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            as="textarea"
            rows={3}
            className={styles.postInput}
            data-testid="postInput"
            autoComplete="off"
            required
            onChange={handlePostInput}
            value={postContent}
          />
          <div className="mt-3">
            <div className="d-flex gap-2 mb-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  if (fileInputRef?.current) {
                    return fileInputRef.current.click();
                  }
                }}
              >
                {editedMediaType === 'video' ? (
                  <VideocamIcon className="me-1" />
                ) : (
                  <AddPhotoAlternateIcon className="me-1" />
                )}
                Change Media
              </Button>
              {(mediaPreviewUrl || props.image || props.video) && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleClearMedia}
                >
                  <ClearIcon className="me-1" />
                  Remove Media
                </Button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaChange}
              accept="image/*,video/*"
              className="d-none"
            />

            <div className="media-preview mt-2">
              {mediaPreviewUrl ? (
                editedMediaType === 'image' ? (
                  <img
                    src={mediaPreviewUrl}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px' }}
                  />
                ) : (
                  <video
                    src={mediaPreviewUrl}
                    controls
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px' }}
                  />
                )
              ) : props.image ? (
                <img
                  src={props.image}
                  alt="Current"
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px' }}
                />
              ) : props.video ? (
                <video
                  src={props.video}
                  controls
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px' }}
                />
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <ModalFooter>
          <Button
            size="sm"
            variant="success"
            className="px-4"
            data-testid={'editPostBtn'}
            onClick={handleEditPost}
          >
            {t('editPost')}
          </Button>
        </ModalFooter>
      </Modal>
    </Col>
  );
}
