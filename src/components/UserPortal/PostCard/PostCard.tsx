/**
 * Component representing a post card in the user portal.
 *
 * This component displays a post with its details such as title, content, creator,
 * likes, comments, and associated actions like editing, deleting, liking, and commenting.
 * It also includes modals for viewing the post in detail and editing the post content.
 *
 * @param props - The properties of the post card.
 * @param props.id - Unique identifier for the post.
 * @param props.creator - Object containing the creator's details (id, firstName, lastName, email).
 * @param props.title - Title of the post.
 * @param props.text - Content of the post.
 * @param props.image - URL of the post's image.
 * @param props.postedAt - Date when the post was created.
 * @param props.likeCount - Number of likes on the post.
 * @param props.likedBy - Array of users who liked the post.
 * @param props.comments - Array of comments on the post.
 * @param props.commentCount - Total number of comments on the post.
 * @param props.fetchPosts - Function to refresh the list of posts.
 *
 * @returns A JSX.Element representing the post card.
 *
 * @remarks
 * - Includes GraphQL mutations for liking, unliking, commenting, editing, and deleting posts.
 * - Uses `react-bootstrap` for UI components and `@apollo/client` for GraphQL operations.
 * - Handles state for likes, comments, and modals using React hooks.
 * - Displays error messages and success notifications using `react-toastify`.
 */

import React from 'react';
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

import type { InterfacePostCard } from 'utils/interfaces';
import {
  CREATE_COMMENT_POST,
  DELETE_POST_MUTATION,
  UPDATE_POST_VOTE,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import CommentCard from '../CommentCard/CommentCard';
import { errorHandler } from 'utils/errorHandler';
import styles from '../../../style/app-fixed.module.css';
import UserDefault from '../../../assets/images/defaultImg.png';
import useLocalStorage from 'utils/useLocalstorage';

export default function PostCard(props: InterfacePostCard): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'postCard' });
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();
  const userId: string | null = getItem('userId');
  const isLikedByUser = props.upVoters?.edges.some(
    (edge) => edge.node.id === userId,
  );

  const [commentInput, setCommentInput] = React.useState('');
  const [viewPost, setViewPost] = React.useState(false);
  const [showEditPost, setShowEditPost] = React.useState(false);
  const [postContent, setPostContent] = React.useState(props.text);

  const [likePost, { loading: likeLoading }] = useMutation(UPDATE_POST_VOTE);

  const [createComment, { loading: commentLoading }] =
    useMutation(CREATE_COMMENT_POST);
  const [editPost] = useMutation(UPDATE_POST_MUTATION);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);

  const toggleViewPost = (): void => setViewPost(!viewPost);
  const toggleEditPost = (): void => setShowEditPost(!showEditPost);
  const handlePostInput = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setPostContent(e.target.value);

  const handleToggleLike = async (): Promise<void> => {
    try {
      await likePost({
        variables: {
          input: {
            postId: props.id,
            type: isLikedByUser ? 'down_vote' : 'up_vote',
          },
        },
      });

      props.fetchPosts();
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleCommentInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCommentInput(e.target.value);

  const handleCreateComment = async (): Promise<void> => {
    if (!commentInput.trim()) {
      toast.error(t('emptyCommentError'));
      return;
    }
    try {
      await createComment({
        variables: { input: { postId: props.id, body: commentInput } },
      });
      setCommentInput('');
      props.fetchPosts();
    } catch (error: unknown) {
      toast.error(t('unexpectedError'));
    }
  };

  const handleEditPost = async (): Promise<void> => {
    try {
      await editPost({
        variables: { input: { id: props.id, caption: postContent } },
      });
      props.fetchPosts();
      toggleEditPost();
      toast.success('Successfully edited the Post.');
    } catch (error) {
      errorHandler(t, error);
    }
  };

  const handleDeletePost = async (): Promise<void> => {
    try {
      await deletePost({ variables: { input: { id: props.id } } });
      props.fetchPosts();
      toast.success('Successfully deleted the Post.');
    } catch (error) {
      errorHandler(t, error);
    }
  };

  // console.log(props.upVoters.edges.map)
  // console.log(
  //   props.upVoters.edges
  //     ?.filter(edge => edge?.node?.id)
  //     .map(edge => edge.node.id)
  // );
  const upVoters =
    props.upVoters?.edges.map((edge) => ({
      id: edge.node.id,
      node: { id: edge.node.id },
    })) || [];

  // console.log('upVoters', upVoters);
  // console.log('upVoters', upVoters[0]?.node.id);

  return (
    <Col key={props.id} className="d-flex justify-content-center my-2">
      <Card className={`${styles.cardStyles}`}>
        <Card.Header className={`${styles.cardHeaderPostCard}`}>
          <div className={`${styles.creator}`}>
            <AccountCircleIcon className="my-2" />
            <p>{props.creator.name}</p>
          </div>
          <Dropdown style={{ cursor: 'pointer' }}>
            <Dropdown.Toggle
              className={styles.customToggle}
              data-testid="dropdown"
            >
              <MoreVertIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item data-testid="editPost" onClick={toggleEditPost}>
                <EditOutlinedIcon
                  style={{ color: 'grey', marginRight: '8px' }}
                />
                {tCommon('edit')}
              </Dropdown.Item>
              <Dropdown.Item
                data-testid="deletePost"
                onClick={handleDeletePost}
              >
                <DeleteOutlineOutlinedIcon
                  style={{ color: 'red', marginRight: '8px' }}
                />
                {tCommon('delete')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>

        <Card.Img
          className={styles.postImage}
          variant="top"
          src={props.image || UserDefault}
        />

        <Card.Body className="pb-0">
          <Card.Title className={`${styles.cardTitlePostCard}`}>
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
              className={`px-4 ${styles.addButton}`}
              onClick={toggleViewPost}
              data-testid="viewPostBtn"
            >
              {t('viewPost')}
            </Button>
          </div>
        </Card.Footer>
      </Card>

      <Modal show={viewPost} onHide={toggleViewPost} size="xl" centered>
        <Modal.Body className="d-flex w-100 p-0" style={{ minHeight: '80vh' }}>
          <div className="w-50 d-flex align-items-center justify-content-center">
            <img
              src={props.image || UserDefault}
              alt="postImg"
              className="w-100"
            />
          </div>
          <div className="w-50 p-2 position-relative">
            <div className="d-flex justify-content-between align-items-center">
              <div className={`${styles.cardHeaderPostCard} p-0`}>
                <AccountCircleIcon className="my-2" />
                <p>{props.creator.name}</p>
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
              {props.comments?.length ? (
                props.comments.map((comment, index) => (
                  <CommentCard
                    key={index}
                    id={comment.id}
                    creator={comment.creator}
                    text={comment.body}
                    upVoteCount={comment.upVoteCount}
                    downVoteCount={comment.downVoteCount}
                    upVoters={{
                      edges: upVoters,
                    }}
                  />
                ))
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
                    data-testid="likePostBtn"
                  >
                    {likeLoading ? (
                      <HourglassBottomIcon fontSize="small" />
                    ) : isLikedByUser ? (
                      <ThumbUpIcon fontSize="small" />
                    ) : (
                      <ThumbUpOffAltIcon fontSize="small" />
                    )}
                  </Button>
                  {props.upVoters?.edges.length || 0} {t('likes')}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button className={`${styles.cardActionBtn}`}>
                    <CommentIcon fontSize="small" />
                  </Button>
                  {props.commentCount} {t('comments')}
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
                  onClick={handleCreateComment}
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
        <Modal.Header closeButton className={`py-2`}>
          <p className="fs-3" data-testid="editPostModalTitle">
            {t('editPost')}
          </p>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            as="textarea"
            rows={3}
            className={styles.postInput}
            autoComplete="off"
            required
            onChange={handlePostInput}
            data-testid="postInput"
            value={postContent}
          />
        </Modal.Body>
        <ModalFooter>
          <Button
            size="sm"
            className={`px-4 ${styles.addButton}`}
            onClick={handleEditPost}
            data-testid="editPostBtn"
          >
            {t('editPost')}
          </Button>
        </ModalFooter>
      </Modal>
    </Col>
  );
}
