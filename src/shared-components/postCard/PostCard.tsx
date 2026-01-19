/**
 * Component representing a post card in the user portal.
 *
 * This component displays a post with its details such as title, content, creator,
 * likes, comments, and associated actions like editing, deleting, liking, and commenting.
 * It also includes modals for viewing the post in detail and editing the post content.
 *
 *   - fetchPosts: Function to refresh the list of posts
 *
 */
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Button,
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
import { PluginInjector } from '../../plugin';
import useLocalStorage from '../../utils/useLocalstorage';
import CreatePostModal from 'shared-components/posts/createPostModal/createPostModal';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import { CursorPaginationManager } from '../../components/CursorPaginationManager/CursorPaginationManager';

export default function PostCard({ ...props }: InterfacePostCard): JSX.Element {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(
    props.hasUserVoted?.voteType === 'up_vote',
  );
  const [likeCount, setLikeCount] = useState<number>(props.upVoteCount);
  const [commentInput, setCommentInput] = React.useState('');
  const [showEditPost, setShowEditPost] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const [comments, setComments] = React.useState<InterfaceComment[]>([]);
  const [refetchTrigger, setRefetchTrigger] = React.useState(0);
  const [dropdownAnchor, setDropdownAnchor] =
    React.useState<null | HTMLElement>(null);
  const orgId = window.location.pathname.split('/')[2];

  React.useEffect(() => {
    setIsLikedByUser(props.hasUserVoted?.voteType === 'up_vote');
    setLikeCount(props.upVoteCount);
  }, [props.hasUserVoted?.voteType, props.upVoteCount]);

  const commentCount = props.commentCount;
  const { getItem } = useLocalStorage();
  const userId = (getItem('userId') ?? getItem('id')) as string | null;

  const isPostCreator = props.creator.id === userId;
  const isAdmin = getItem('role') === 'administrator';

  const toggleComments = (): void => {
    setShowComments((prev) => !prev);
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
      NotificationToast.error(
        error instanceof Error ? error.message : String(error),
      );
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
        setRefetchTrigger((prev) => prev + 1);
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
      NotificationToast.success(
        isPinned
          ? t('postCard.postUnpinnedSuccess')
          : t('postCard.postPinnedSuccess'),
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
      NotificationToast.success(t('postCard.postDeletedSuccess'));
      setDropdownAnchor(null);
    } catch (error) {
      errorHandler(t, error);
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('previewPostID', props.id);

      const finalUrl = url.toString();
      await navigator.clipboard.writeText(finalUrl);
      NotificationToast.success(tCommon('linkCopied'));
    } catch {
      NotificationToast.error(tCommon('copyToClipboardError'));
    } finally {
      // Close the menu
      setDropdownAnchor(null);
    }
  };

  return (
    <Box
      className={`${postCardStyles.postContainer} ${postCardStyles.postContainerBackground}`}
    >
      {/* Post Header */}

      <Box className={postCardStyles.postHeader}>
        <Box className={postCardStyles.userInfo}>
          <ProfileAvatarDisplay
            fallbackName={props.creator.name}
            size="small"
            dataTestId="user-avatar"
            className={postCardStyles.userImageUserPost}
            imageUrl={props.creator.avatarURL || UserDefault}
            enableEnlarge
          />
          <Typography variant="subtitle2" fontWeight="bold">
            {props.creator.name}
          </Typography>
        </Box>
        <>
          <IconButton
            onClick={handleDropdownOpen}
            size="small"
            aria-label={t('postCard.moreOptions')}
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
                  primary={t('postCard.editPost')}
                  data-testid="edit-post-button"
                />
              </MenuItem>
            )}

            {isAdmin && (
              <MenuItem
                onClick={handleTogglePin}
                data-testid="pin-post-menu-item"
              >
                <ListItemIcon>
                  {isPinned ? (
                    <PushPinOutlined fontSize="small" />
                  ) : (
                    <PushPin fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    isPinned ? t('postCard.unpinPost') : t('postCard.pinPost')
                  }
                />
              </MenuItem>
            )}

            <MenuItem
              onClick={copyToClipboard}
              data-testid="share-post-menu-item"
            >
              <ListItemIcon>
                <Share fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={tCommon('share')}
                data-testid="share-post-button"
              />
            </MenuItem>

            {(isAdmin || isPostCreator) && (
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
            )}
          </Menu>
        </>
      </Box>
      {/* Post Media */}
      {props.attachmentURL && (
        <Box className={postCardStyles.postMedia}>
          {props.mimeType?.split('/')[0] == 'image' && (
            <img
              className={postCardStyles.image}
              src={props.attachmentURL}
              alt={props.title}
              crossOrigin="anonymous"
            />
          )}

          {props.mimeType?.split('/')[0] == 'video' && (
            <video
              controls
              className={postCardStyles.video}
              crossOrigin="anonymous"
              data-testid="video-attachment"
            >
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
      </Box>

      {
        PluginInjector({
          injectorType: 'G4',
          data: {
            caption: props.title,
            postId: props.id,

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
          },
        }) as React.ReactNode
      }
      {/* Post Actions */}
      <Box className={postCardStyles.postActions}>
        <Box className={postCardStyles.leftActions}>
          <IconButton
            onClick={handleToggleLike}
            size="small"
            data-testid="like-btn"
            aria-label={
              isLikedByUser ? t('postCard.unlike') : t('postCard.like')
            }
          >
            {likeLoading ? (
              <CircularProgress size={20} />
            ) : isLikedByUser ? (
              <Favorite color="error" fontSize="small" data-testid="liked" />
            ) : (
              <Favorite fontSize="small" data-testid="unliked" />
            )}
          </IconButton>
          <IconButton
            onClick={toggleComments}
            size="small"
            aria-label={
              showComments
                ? t('postCard.hideComments')
                : t('postCard.viewComments')
            }
          >
            <ChatBubbleOutline fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label={t('postCard.share')}
            onClick={copyToClipboard}
            data-testid="share-post-quick-button"
          >
            <Share fontSize="small" />
          </IconButton>
        </Box>
        {isPinned && (
          <PushPinOutlined
            fontSize="small"
            color="primary"
            data-testid="pinned-icon"
            className={postCardStyles.pinnedIcon}
          />
        )}
      </Box>
      <Box className={postCardStyles.likesCount}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          data-testid="like-count"
        >
          {likeCount} {t('postCard.likes')}
        </Typography>
      </Box>

      {/* Comments Section */}
      {showComments && userId && (
        <>
          <Divider />
          <Box className={postCardStyles.commentSection}>
            <CursorPaginationManager
              query={GET_POST_COMMENTS}
              queryVariables={{
                postId: props.id,
                userId: userId as string,
              }}
              dataPath="post.comments"
              itemsPerPage={10}
              renderItem={(comment: InterfaceComment) => (
                <CommentCard
                  id={comment.id}
                  creator={comment.creator}
                  text={comment.body}
                  upVoteCount={comment.upVotesCount}
                  hasUserVoted={comment.hasUserVoted}
                  refetchComments={() => setRefetchTrigger((prev) => prev + 1)}
                />
              )}
              keyExtractor={(comment: InterfaceComment) => comment.id}
              onDataChange={setComments}
              refetchTrigger={refetchTrigger}
              emptyStateComponent={
                <div className={postCardStyles.noCommentsText}>
                  {t('postCard.noComments')}
                </div>
              }
            />
          </Box>
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
            ? t('postCard.hideComments')
            : t('postCard.viewComments', { count: commentCount })}
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
        <Box className={postCardStyles.commentForm}>
          <Input
            placeholder={t('postCard.addComment')}
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
        </Box>
      </div>

      {/* Edit Post Modal */}
      <div className={postCardStyles.editModalWrapper}>
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
