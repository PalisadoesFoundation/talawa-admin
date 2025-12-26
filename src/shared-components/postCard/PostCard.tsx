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
 */
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  IconButton,
  Button,
  FormControl,
  Input,
  InputAdornment,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Favorite,
  ChatBubbleOutline,
  PushPinOutlined,
  PushPin,
  Share,
  MoreHoriz,
  Send,
  DeleteOutline,
  EditOutlined,
} from '@mui/icons-material';
import UserDefault from '../../assets/images/defaultImg.png';
import type {
  InterfaceComment,
  InterfaceCommentEdge,
  InterfacePostCard,
} from '../../utils/interfaces';
import postCardStyles from './PostCard.module.css';
import {
  CREATE_COMMENT_POST,
  DELETE_POST_MUTATION,
  UPDATE_POST_VOTE,
} from '../../GraphQl/Mutations/mutations';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';
import { GET_POST_COMMENTS } from '../../GraphQl/Queries/Queries';
import { errorHandler } from '../../utils/errorHandler';
import CommentCard from '../../components/UserPortal/CommentCard/CommentCard';
import styles from '../../style/app-fixed.module.css';
import { PluginInjector } from '../../plugin';
import useLocalStorage from '../../utils/useLocalstorage';
import { handleLoadMoreComments as handleLoadMoreCommentsHelper } from './helperFunctions';
import CreatePostModal from 'shared-components/posts/createPostModal/createPostModal';

export default function PostCard({ ...props }: InterfacePostCard): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'postCard' });
  const { t: tCommon } = useTranslation('common');
  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(
    props.hasUserVoted?.voteType === 'up_vote',
  );
  const [likeCount, setLikeCount] = useState<number>(props.upVoteCount);
  const [commentInput, setCommentInput] = React.useState('');
  const [showEditPost, setShowEditPost] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const [comments, setComments] = React.useState<InterfaceComment[]>([]);
  const [endCursor, setEndCursor] = React.useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = React.useState(false);
  const [dropdownAnchor, setDropdownAnchor] =
    React.useState<null | HTMLElement>(null);
  const orgId = window.location.pathname.split('/')[2];

  useEffect(() => {
    setIsLikedByUser(props.hasUserVoted?.voteType === 'up_vote');
    setLikeCount(props.upVoteCount);
  }, [props.hasUserVoted?.voteType, props.upVoteCount]);

  const commentCount = props.commentCount;
  const { getItem } = useLocalStorage();
  const userId = getItem('userId') ?? getItem('id');

  const isPostCreator = props.creator.id === userId;
  const isAdmin = getItem('role') === 'administrator';

  // Query for paginated comments
  const shouldSkipComments = !showComments || !userId;
  const {
    data: commentsData,
    loading: commentsLoading,
    fetchMore: fetchMoreComments,
    refetch: refetchComments,
  } = useQuery(GET_POST_COMMENTS, {
    skip: shouldSkipComments,
    variables: shouldSkipComments
      ? undefined
      : {
          postId: props.id,
          userId: userId as string,
          first: 10,
        },
  });

  React.useEffect(() => {
    if (!commentsData?.post?.comments) return;

    const { edges, pageInfo } = commentsData.post.comments;
    setComments(edges.map((edge: InterfaceCommentEdge) => edge.node));
    setEndCursor(pageInfo.endCursor);
    setHasNextPage(pageInfo.hasNextPage);
  }, [commentsData]);

  const toggleComments = (): void => {
    setShowComments((prev) => !prev);
    // Reset comments when hiding
    if (showComments) {
      setComments([]);
      setEndCursor(null);
      setHasNextPage(false);
    }
  };

  const handleLoadMoreComments = async (): Promise<void> => {
    await handleLoadMoreCommentsHelper({
      fetchMoreComments,
      postId: props.id,
      userId: userId as string,
      endCursor,
      setComments,
      setEndCursor,
      setHasNextPage,
      setLoadingMoreComments,
      t,
    });
  };

  const [likePost, { loading: likeLoading }] = useMutation(UPDATE_POST_VOTE);
  const [createComment, { loading: commentLoading }] =
    useMutation(CREATE_COMMENT_POST);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const [togglePinPost] = useMutation(TOGGLE_PINNED_POST);
  const isPinned = props.pinnedAt != null;

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
      setIsLikedByUser(!isLikedByUser);
      setLikeCount(isLikedByUser ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleCommentInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCommentInput(e.target.value);

  const handleCreateComment = async (): Promise<void> => {
    try {
      await createComment({
        variables: { input: { postId: props.id, body: commentInput } },
      });
      setCommentInput('');

      if (showComments && userId) {
        await refetchComments({
          postId: props.id,
          userId: userId as string,
          first: 10,
        });
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  // Dropdown menu handlers
  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setDropdownAnchor(event.currentTarget);
  };

  const toggleEditPost = (): void => {
    setShowEditPost(!showEditPost);
    setDropdownAnchor(null);
  };

  // Toggle pin/unpin functionality
  const handleTogglePin = async (): Promise<void> => {
    try {
      await togglePinPost({
        variables: {
          input: {
            id: props.id,
            isPinned: !isPinned,
          },
        },
      });
      await props.fetchPosts();
      toast.success(
        isPinned ? t('postUnpinnedSuccess') : t('postPinnedSuccess'),
      );
      setDropdownAnchor(null);
      window.location.reload();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  const handleDeletePost = async (): Promise<void> => {
    try {
      await deletePost({ variables: { input: { id: props.id } } });
      await props.fetchPosts();
      toast.success(t('postDeletedSuccess'));
      setDropdownAnchor(null);
      props.fetchPosts();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  return (
    <Box
      className={`${postCardStyles.postContainer} ${styles.backgroundPaper}`}
    >
      {/* Post Header */}

      <Box className={postCardStyles.postHeader}>
        <Box className={postCardStyles.userInfo}>
          <Avatar
            className={styles.userImageUserPost}
            src={props.creator.avatarURL || UserDefault}
            alt={props.creator.name}
            slotProps={{
              img: {
                crossOrigin: 'anonymous',
                loading: 'lazy',
              },
            }}
          />
          <Typography variant="subtitle2" fontWeight="bold">
            {props.creator.name}
          </Typography>
        </Box>
        <>
          <IconButton
            onClick={handleDropdownOpen}
            size="small"
            aria-label="more options"
            data-testid="post-more-options-button"
          >
            <MoreHoriz />
          </IconButton>
          <Menu
            anchorEl={dropdownAnchor}
            open={Boolean(dropdownAnchor)}
            onClose={() => setDropdownAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                minWidth: '150px',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                },
              },
            }}
          >
            {isPostCreator && (
              <MenuItem
                onClick={toggleEditPost}
                data-testid="edit-post-menu-item"
              >
                <ListItemIcon>
                  <EditOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={t('editPost')}
                  data-testid="edit-post-button"
                />
              </MenuItem>

              {isAdmin && (
                <MenuItem
                  onClick={handleTogglePin}
                  data-testid="pin-post-menu-item"
                >
                  <ListItemIcon>
                    {isPinned ? (
                      <PushPin fontSize="small" />
                    ) : (
                      <PushPinOutlined fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={isPinned ? t('unpinPost') : t('pinPost')}
                  />
                </MenuItem>
              )}

              <MenuItem
                onClick={handleDeletePost}
                data-testid="delete-post-menu-item"
              >
                <ListItemIcon>
                  <DeleteOutline fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={tCommon('delete')}
                  data-testid="delete-post-button"
                />
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Post Media */}
      {props.attachmentURL && (
        <Box className={postCardStyles.postMedia}>
          {props.mimeType?.split('/')[0] == 'image' && (
            <img
              src={props.attachmentURL}
              alt={props.title}
              crossOrigin="anonymous"
            />
          )}

          {props.mimeType?.split('/')[0] == 'video' && (
            <video controls style={{ width: '100%' }} crossOrigin="anonymous">
              <source src={props.attachmentURL} />
            </video>
          )}
        </Box>
      )}

      {/* Post Content */}
      <Box className={postCardStyles.postContent}>
        <Typography className={postCardStyles.caption}>
          {props.title}
        </Typography>
        {postCardStyles.body && (
          <Box className={postCardStyles.bodyContainer}>
            <Typography variant="body2" className={`${postCardStyles.body}`}>
              {props.body}
            </Typography>
          </Box>
        )}

        {/* Plugin Extension Point G3 - Inject plugins below caption */}
        <PluginInjector
          injectorType="G4"
          data={{
            caption: props.title,
            postId: props.id,
            text: props.text,
            creator: props.creator,
            upVoteCount: likeCount,
            downVoteCount: props.downVoteCount,
            comments: comments,
            commentCount: props.commentCount,
            postedAt: props.postedAt,
            pinnedAt: props.pinnedAt,
            attachmentURL: props.attachmentURL,
            mimeType: props.mimeType,
            hasUserVoted: isLikedByUser,
          }}
        />
      </Box>
      {/* Post Actions */}
      <Box className={postCardStyles.postActions}>
        <Box className={postCardStyles.leftActions}>
          <IconButton
            onClick={handleToggleLike}
            size="small"
            data-testid="like-btn"
          >
            {likeLoading ? (
              <CircularProgress size={20} />
            ) : isLikedByUser ? (
              <Favorite color="error" fontSize="small" data-testid="liked" />
            ) : (
              <Favorite fontSize="small" data-testid="unliked" />
            )}
          </IconButton>
          <IconButton onClick={toggleComments} size="small">
            <ChatBubbleOutline fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <Share fontSize="small" />
          </IconButton>
        </Box>
        {isPinned && (
          <PushPinOutlined
            fontSize="small"
            color="primary"
            data-testid="pinned-icon"
            className={styles.marginLeftAuto}
          />
        )}
      </Box>
      <Box className={postCardStyles.likesCount}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          data-testid="like-count"
        >
          {likeCount} {t('likes')}
        </Typography>
      </Box>

      {/* Comments Section */}
      {showComments && (
        <>
          <Divider />
          {commentsLoading && comments.length === 0 ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box className={postCardStyles.commentSection}>
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  creator={comment.creator}
                  text={comment.body}
                  upVoteCount={comment.upVotesCount}
                  hasUserVoted={comment.hasUserVoted}
                  refetchComments={refetchComments}
                />
              ))}

              {/* Load More Comments Button */}
              {hasNextPage ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <Button
                    onClick={handleLoadMoreComments}
                    disabled={loadingMoreComments}
                    size="small"
                    sx={{
                      color: 'primary.main',
                      fontSize: '0.875rem',
                      textTransform: 'none',
                    }}
                  >
                    {loadingMoreComments ? (
                      <>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        {t('loadingComments')}
                      </>
                    ) : (
                      t('loadMoreComments')
                    )}
                  </Button>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" py={2}>
                  <Typography variant="body2" color="text.secondary">
                    {t('noMoreComments')}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </>
      )}

      {/* View/Hide Comments Button */}
      {commentCount > 0 && (
        <Button
          onClick={toggleComments}
          data-testid="comment-card"
          size="small"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem',
            ml: 2,
            mb: 1,
            textTransform: 'none',
          }}
        >
          {showComments
            ? t('hideComments')
            : t('viewComments', { count: commentCount })}
        </Button>
      )}

      {/* Post Time */}
      <Typography
        className={postCardStyles.timeText}
        sx={{ color: 'text.secondary' }}
      >
        {props.postedAt}
      </Typography>

      {/* Add Comment */}
      <div className={postCardStyles.commentFormContainer}>
        <FormControl fullWidth className={postCardStyles.commentForm}>
          <Input
            placeholder={t('addComment')}
            value={commentInput}
            onChange={handleCommentInput}
            fullWidth
            disableUnderline
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleCreateComment}
                  disabled={commentLoading || !commentInput.trim()}
                  data-testid="comment-send"
                  size="small"
                  color="primary"
                >
                  {commentLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Send fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            }
            sx={{
              backgroundColor: 'action.hover',
              borderRadius: 20,
              px: 2,
              py: 0.5,
            }}
          />
        </FormControl>
      </div>

      {/* Edit Post Modal */}
      <div style={{ position: 'absolute' }}>
        <CreatePostModal
          show={showEditPost}
          onHide={toggleEditPost}
          refetch={props.fetchPosts}
          title={props.title}
          body={props.body}
          orgId={orgId}
          id={props.id}
          type="edit"
        />
      </div>
    </Box>
  );
}
