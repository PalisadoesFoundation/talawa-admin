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
 * @param props.commentCount - Total number of comments on the post.
 * @param props.fetchPosts - Function to refresh the list of posts.
 *
 * @returns A JSX.Element representing the post card.
 */
import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  IconButton,
  Button,
  Modal,
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
  UPDATE_POST_MUTATION,
} from '../../GraphQl/Mutations/mutations';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';
import { GET_POST_COMMENTS } from '../../GraphQl/Queries/Queries';
import { errorHandler } from '../../utils/errorHandler';
import CommentCard from '../../components/UserPortal/CommentCard/CommentCard';
import styles from '../../style/app-fixed.module.css';
import { PluginInjector } from '../../plugin';
import useLocalStorage from '../../utils/useLocalstorage';

export default function PostCard({ ...props }: InterfacePostCard): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'postCard' });
  const { t: tCommon } = useTranslation('common');
  const isLikedByUser = props.hasUserVoted?.voteType === 'up_vote';

  const [commentInput, setCommentInput] = React.useState('');
  const [showEditPost, setShowEditPost] = React.useState(false);
  const [postContent, setPostContent] = React.useState(props.text);
  const [showComments, setShowComments] = React.useState(false);
  const [comments, setComments] = React.useState<InterfaceComment[]>([]);
  const [endCursor, setEndCursor] = React.useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = React.useState(false);
  const [dropdownAnchor, setDropdownAnchor] =
    React.useState<null | HTMLElement>(null);

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
    if (!commentsData?.post?.comments) {
      return;
    }

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
    setLoadingMoreComments(true);
    try {
      await fetchMoreComments({
        variables: {
          postId: props.id,
          userId: userId as string,
          first: 10,
          after: endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.post?.comments) return prev;

          const newEdges = fetchMoreResult.post.comments.edges;
          const newPageInfo = fetchMoreResult.post.comments.pageInfo;

          // Update local state
          setComments((prevComments) => [
            ...prevComments,
            ...newEdges.map((edge: InterfaceCommentEdge) => edge.node),
          ]);
          setEndCursor(newPageInfo.endCursor);
          setHasNextPage(newPageInfo.hasNextPage);

          return {
            ...prev,
            post: {
              ...prev.post,
              comments: {
                ...prev.post.comments,
                edges: [...prev.post.comments.edges, ...newEdges],
                pageInfo: newPageInfo,
              },
            },
          };
        },
      });
    } catch (error) {
      errorHandler(t, error);
    } finally {
      setLoadingMoreComments(false);
    }
  };

  const [likePost, { loading: likeLoading }] = useMutation(UPDATE_POST_VOTE);
  const [createComment, { loading: commentLoading }] =
    useMutation(CREATE_COMMENT_POST);
  const [editPost] = useMutation(UPDATE_POST_MUTATION);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const [togglePinPost] = useMutation(TOGGLE_PINNED_POST);
  let isPinned = false;

  // Check if the post is pinned
  if (props.pinnedAt !== null) {
    isPinned = true;
  }

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
    try {
      await createComment({
        variables: { input: { postId: props.id, body: commentInput } },
      });
      setCommentInput('');
      // Refresh the post data and comments
      props.fetchPosts();

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

  const handleDropdownClose = (): void => {
    setDropdownAnchor(null);
  };

  const toggleEditPost = (): void => {
    setShowEditPost(!showEditPost);
    handleDropdownClose();
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
      props.fetchPosts();
      toast.success(
        isPinned ? t('postUnpinnedSuccess') : t('postPinnedSuccess'),
      );
      handleDropdownClose();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  // Update the handleEditPost function to use isPinned instead of pinnedAt
  const handleEditPost = async (): Promise<void> => {
    try {
      const input: {
        id: string;
        caption: string;
        isPinned?: boolean;
      } = {
        id: props.id,
        caption: postContent,
      };

      // Only include isPinned if it's changed
      if (isPinned !== !!props.pinnedAt) {
        input.isPinned = isPinned;
      }

      await editPost({
        variables: {
          input,
        },
      });
      props.fetchPosts();
      toggleEditPost();
      toast.success(t('postUpdatedSuccess'));
    } catch (error) {
      errorHandler(t, error);
    }
  };

  const handleDeletePost = async (): Promise<void> => {
    try {
      await deletePost({ variables: { input: { id: props.id } } });
      props.fetchPosts();
      toast.success(t('postDeletedSuccess'));
      handleDropdownClose();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  return (
    <Box
      className={postCardStyles.postContainer}
      sx={{ backgroundColor: 'background.paper' }}
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
            aria-label={t('moreOptions')}
            data-testid="more-options-button"
          >
            <MoreHoriz />
          </IconButton>
          <Menu
            anchorEl={dropdownAnchor}
            open={Boolean(dropdownAnchor)}
            onClose={handleDropdownClose}
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
            {(isPostCreator || isAdmin) && (
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
                  primary={isPinned ? t('unpinPost') : t('pinPost')}
                />
              </MenuItem>
            )}

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
                  primaryTypographyProps={{ color: 'error' }}
                />
              </MenuItem>
            )}
          </Menu>
        </>
      </Box>

      {/* Post Media */}
      <Box className={postCardStyles.postMedia}>
        {props.image ||
          (UserDefault && (
            <img src={props.image || UserDefault} alt={props.title} />
          ))}
        {props.video && (
          <video controls style={{ width: '100%' }}>
            <source src={props.video} type="video/mp4" />
            <track
              kind="captions"
              srcLang="en"
              src=""
              label={t('englishCaptions')}
              default={false}
            />
          </video>
        )}
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
              <Favorite color="error" fontSize="small" />
            ) : (
              <Favorite fontSize="small" />
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
            sx={{ marginLeft: 'auto' }}
          />
        )}
      </Box>

      {/* Post Content */}
      <Box className={postCardStyles.postContent}>
        <Typography variant="subtitle2" fontWeight="bold">
          {props.upVoteCount} {t('likes')}
        </Typography>
        <Typography variant="body2" className={postCardStyles.caption}>
          <Typography component="span" fontWeight="bold">
            {props.creator.name}
          </Typography>{' '}
          {props.title}
        </Typography>

        {/* Plugin Extension Point G3 - Inject plugins below caption */}
        <PluginInjector
          injectorType="G4"
          data={{
            caption: props.title,
            postId: props.id,
            text: props.text,
            creator: props.creator,
            upVoteCount: props.upVoteCount,
            downVoteCount: props.downVoteCount,
            comments: comments,
            commentCount: props.commentCount,
            postedAt: props.postedAt,
            pinnedAt: props.pinnedAt,
            image: props.image,
            video: props.video,
            hasUserVoted: props.hasUserVoted,
          }}
        />
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
      <Modal
        open={showEditPost}
        onClose={toggleEditPost}
        data-testid="edit-post-button"
      >
        <Box
          className={postCardStyles.editModalContent}
          sx={{ backgroundColor: 'background.paper' }}
        >
          <Typography variant="h6">{t('editPost')}</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Input
              multiline
              rows={4}
              value={postContent}
              onChange={handlePostInput}
              fullWidth
              data-cy="editCaptionInput"
            />
          </FormControl>

          <Box className={postCardStyles.modalActions}>
            <Button variant="outlined" onClick={toggleEditPost}>
              {tCommon('cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={handleEditPost}
              data-testid="save-post-button"
              startIcon={<EditOutlined />}
            >
              {tCommon('save')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
