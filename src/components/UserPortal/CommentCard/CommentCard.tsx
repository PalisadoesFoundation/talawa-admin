/**
 * CommentCard Component
 *
 * This component represents a card displaying a comment with the ability to like or dislike it.
 * It shows the comment creator's details, the comment text, and the like/dislike counts.
 *
 * @component
 * @param props - The properties required by the CommentCard component.
 * @param props.id - The unique identifier of the comment.
 * @param props.creator - The creator of the comment, including their ID and name.
 * @param props.upVoteCount - The number of upvotes (likes) on the comment.
 * @param props.downVoteCount - The number of downvotes (dislikes) on the comment.
 * @param props.downVoters - An array of users who have disliked the comment.
 * @param props.text - The text content of the comment.
 * @param props.onVote - Callback function triggered when the comment is voted on.
 * @param props.fetchComments - Function to refresh comments after voting.
 *
 * @returns A JSX element representing the comment card.
 */
import React from 'react';
import {
  IconButton,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Modal,
  Menu,
  MenuItem,
  FormControl,
  Input,
  Button,
} from '@mui/material';
import {
  MoreHoriz,
  ThumbUp,
  ThumbUpOutlined,
  EditOutlined,
  DeleteOutline,
} from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { LIKE_COMMENT, UNLIKE_COMMENT } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { Image } from 'react-bootstrap';
import styles from '../../../style/app-fixed.module.css';
import { VoteType } from 'utils/interfaces';
import defaultAvatar from 'assets/images/defaultImg.png';
import {
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from 'GraphQl/Mutations/CommentMutations';

const CommentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(1),
}));

const CommentContent = styled(Typography)({
  margin: '8px 0',
  whiteSpace: 'pre-line',
});

const VoteCount = styled(Typography)(() => ({
  fontSize: '0.75rem',
  minWidth: 20,
  textAlign: 'center',
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

interface InterfaceCommentCardProps {
  id: string;
  creator: {
    id: string;
    name: string;
    avatarURL?: string | null;
  };
  hasUserVoted?: { voteType: VoteType } | null;
  upVoteCount: number;
  // downVoteCount: number;
  text: string;
  refetchComments?: () => void;
}

function CommentCard(props: InterfaceCommentCardProps): JSX.Element {
  const { id, creator, hasUserVoted, upVoteCount, text } = props;
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  const [likes, setLikes] = React.useState(upVoteCount);
  const [isLiked, setIsLiked] = React.useState(false);
  const [showCommentOptions, setShowCommentOptions] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showEditComment, setShowEditComment] = React.useState(false);
  const [editedCommentText, setEditedCommentText] = React.useState(text);
  const [likeComment, { loading: liking }] = useMutation(LIKE_COMMENT);
  const [unlikeComment, { loading: unliking }] = useMutation(UNLIKE_COMMENT);
  const [deleteComment, { loading: deletingComment }] =
    useMutation(DELETE_COMMENT);
  const [updateComment, { loading: updatingComment }] =
    useMutation(UPDATE_COMMENT);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const toggleEditComment = (): void => {
    setShowEditComment(!showEditComment);
    handleMenuClose();
  };

  const handleEditCommentInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEditedCommentText(e.target.value);
  };

  const handleDeleteComment = async (): Promise<void> => {
    try {
      await deleteComment({
        variables: { input: { id: id } },
      });
      toast.success('Comment deleted successfully');
      props.refetchComments?.();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      handleMenuClose();
    }
  };

  const handleUpdateCOmment = async (body: string): Promise<void> => {
    try {
      await updateComment({
        variables: { input: { id: id, body: body } },
      });
      toast.success('Comment updated successfully');
      props.refetchComments?.();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      handleMenuClose();
    }
  };

  React.useEffect(() => {
    if (!userId) {
      setIsLiked(false);
      return;
    }
    const liked = hasUserVoted?.voteType === 'up_vote';
    setIsLiked(Boolean(liked));
  }, [userId, hasUserVoted?.voteType]);

  React.useEffect(() => {
    setLikes(upVoteCount);
  }, [upVoteCount]);

  const handleToggleLike = async (): Promise<void> => {
    if (!userId) {
      toast.warn('Please sign in to like comments.');
      return;
    }
    try {
      if (isLiked) {
        // Unlike
        const { data } = await unlikeComment({
          variables: {
            input: { commentId: id, creatorId: userId },
          },
        });

        if (data?.deleteCommentVote !== null) {
          setLikes((prev) => Math.max(prev - 1, 0));
          setIsLiked(false);
        } else {
          toast.error('Could not find an existing like to remove.');
        }
      } else {
        // Like
        const { data } = await likeComment({
          variables: {
            input: { commentId: id, type: 'up_vote' },
          },
        });

        if (data?.createCommentVote?.id) {
          setLikes((prev) => prev + 1);
          setIsLiked(true);
        }
      }
    } catch (error) {
      const errorCode = (
        error as Error & {
          graphQLErrors?: Array<{ extensions?: { code?: string } }>;
        }
      )?.graphQLErrors?.[0]?.extensions?.code;
      if (errorCode === 'forbidden_action_on_arguments_associated_resources') {
        toast.error('You have already liked this comment.');
      } else if (errorCode === 'arguments_associated_resources_not_found') {
        toast.error('No associated vote found to remove.');
      } else {
        toast.error((error as Error).message);
      }
    }
  };

  return (
    <CommentContainer>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span className={styles.userImageUserComment}>
          <Image
            crossOrigin="anonymous"
            src={creator.avatarURL || defaultAvatar}
            alt={creator.name}
            loading="lazy"
          />
        </span>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {creator.name}
          </Typography>
          <CommentContent variant="body2">{text}</CommentContent>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              onClick={handleToggleLike}
              color={isLiked ? 'primary' : 'default'}
              data-testid="likeCommentBtn"
            >
              {liking || unliking ? (
                <CircularProgress size={20} />
              ) : isLiked ? (
                <ThumbUp fontSize="small" />
              ) : (
                <ThumbUpOutlined fontSize="small" />
              )}
            </IconButton>
            <VoteCount>{likes}</VoteCount>
          </Stack>
        </Box>
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          aria-label="more options"
          data-testid="more-options-button"
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            data-testid="update-comment-button"
            onClick={toggleEditComment}
          >
            <EditOutlined sx={{ mr: 1 }} fontSize="small" />
            Edit Comment
          </MenuItem>
          <MenuItem
            data-testid="delete-comment-button"
            onClick={handleDeleteComment}
            disabled={deletingComment}
          >
            <DeleteOutline sx={{ mr: 1 }} fontSize="small" />
            {deletingComment ? 'Deleting...' : 'Delete Comment'}
          </MenuItem>
        </Menu>
      </Stack>

      {/* Edit Comment Modal */}
      <Modal
        open={showEditComment}
        onClose={toggleEditComment}
        data-testid="edit-comment-modal"
      >
        <EditModalContent>
          <Typography variant="h6">Edit Comment</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Input
              multiline
              rows={4}
              value={editedCommentText}
              onChange={handleEditCommentInput}
              fullWidth
              data-testid="edit-comment-input"
            />
          </FormControl>

          <ModalActions>
            <Box />
            <RightModalActions>
              <Button variant="outlined" onClick={toggleEditComment}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleUpdateCOmment(editedCommentText);
                  toggleEditComment();
                }}
                data-testid="save-comment-button"
                startIcon={<EditOutlined />}
              >
                Save
              </Button>
            </RightModalActions>
          </ModalActions>
        </EditModalContent>
      </Modal>
    </CommentContainer>
  );
}

export default CommentCard;
