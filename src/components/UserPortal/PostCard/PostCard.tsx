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
} from '@mui/material';
import {
  Favorite,
  ChatBubbleOutline,
  PushPinOutlined,
  Share,
  MoreHoriz,
  Send,
  DeleteOutline,
  EditOutlined,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import UserDefault from '../../../assets/images/defaultImg.png';
import type {
  InterfaceComment,
  InterfaceCommentEdge,
  InterfacePostCard,
} from 'utils/interfaces';
import {
  CREATE_COMMENT_POST,
  DELETE_POST_MUTATION,
  UPDATE_POST_VOTE,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { GET_POST_COMMENTS } from 'GraphQl/Queries/Queries';
import { errorHandler } from 'utils/errorHandler';
import CommentCard from '../CommentCard/CommentCard';
import styles from '../../../style/app-fixed.module.css';
import { PluginInjector } from 'plugin';
import useLocalStorage from 'utils/useLocalstorage';

const PostContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  margin: '0 auto 24px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  overflow: 'hidden',
}));

const PostHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 12,
});

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

const PostMedia = styled(Box)({
  width: '100%',
  '& img, & video': {
    width: '100%',
    maxHeight: '600px',
    objectFit: 'cover',
  },
});

const PostActions = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 12px',
});

const LeftActions = styled(Box)({
  display: 'flex',
  gap: 8,
});

const PostContent = styled(Box)({
  padding: '0 16px 8px',
});

const Caption = styled(Typography)({
  margin: '8px 0',
  whiteSpace: 'pre-line',
});

const CommentSection = styled(Box)({
  maxHeight: 300,
  overflowY: 'auto',
  padding: '0 16px',
});

const CommentForm = styled(FormControl)({
  padding: '8px 16px 16px',
  '& .MuiInput-root': {
    fontSize: '0.875rem',
  },
});

const TimeText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  padding: '0 16px 8px',
}));

const EditModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  backgroundColor: 'white',
  borderRadius: 8,
  padding: 24,
  '& h3': {
    marginBottom: 16,
  },
});

const ModalActions = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 16,
});

const RightModalActions = styled(Box)({
  display: 'flex',
  gap: 8,
});

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

  const commentCount = props.commentCount;
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
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
  const toggleEditPost = (): void => setShowEditPost(!showEditPost);

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
      toast.success('Post updated successfully');
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

  return (
    <PostContainer>
      {/* Post Header */}

      <PostHeader>
        <UserInfo>
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
        </UserInfo>
        <IconButton
          onClick={toggleEditPost}
          size="small"
          aria-label="more options"
          data-testid="more-options-button"
        >
          <MoreHoriz />
        </IconButton>
      </PostHeader>

      {/* Post Media */}
      <PostMedia>
        {props.image && <img src={props.image} alt={props.title} />}
        {props.video && (
          <video controls style={{ width: '100%' }}>
            <source src={props.video} type="video/mp4" />
          </video>
        )}
      </PostMedia>

      {/* Post Actions */}
      <PostActions>
        <LeftActions>
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
        </LeftActions>
        {isPinned && (
          <PushPinOutlined
            fontSize="small"
            color="primary"
            data-testid="pinned-icon"
            sx={{ marginLeft: 'auto' }}
          />
        )}
      </PostActions>

      {/* Post Content */}
      <PostContent>
        <Typography variant="subtitle2" fontWeight="bold">
          {props.upVoteCount} {t('likes')}
        </Typography>
        <Caption variant="body2">
          <Typography component="span" fontWeight="bold">
            {props.creator.name}
          </Typography>{' '}
          {props.title}
        </Caption>

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
      </PostContent>

      {/* Comments Section */}
      {showComments && (
        <>
          <Divider />
          {commentsLoading && comments.length === 0 ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <CommentSection>
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
            </CommentSection>
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
      <TimeText>{props.postedAt}</TimeText>

      {/* Add Comment */}
      <CommentForm fullWidth>
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
      </CommentForm>

      {/* Edit Post Modal */}
      <Modal
        open={showEditPost}
        onClose={toggleEditPost}
        data-testid="edit-post-button"
      >
        <EditModalContent>
          <Typography variant="h6">{t('editPost')}</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Input
              multiline
              rows={4}
              value={postContent}
              onChange={handlePostInput}
              fullWidth
            />
          </FormControl>

          <ModalActions>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeletePost}
              startIcon={<DeleteOutline />}
            >
              {tCommon('delete')}
            </Button>
            <RightModalActions>
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
            </RightModalActions>
          </ModalActions>
        </EditModalContent>
      </Modal>
    </PostContainer>
  );
}
