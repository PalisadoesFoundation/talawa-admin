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
  Input,
} from '@mui/material';
import Button from 'shared-components/Button';
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
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import commentCardStyles from './CommentCard.module.css';
import defaultAvatar from 'assets/images/defaultImg.png';
import {
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from 'GraphQl/Mutations/CommentMutations';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import UserPortalCard from '../UserPortalCard/UserPortalCard';
import type { InterfaceCommentCardProps } from 'types/UserPortal/CommentCard/interface';
import { IDENTIFIER_USER_ID } from 'Constant/common';

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

/**
 * CommentCard Component
 *
 * This component represents a card displaying a comment with the ability to like or dislike it.
 * It shows the comment creator's details, the comment text, and the like/dislike counts.
 *
 * @param id - The unique identifier of the comment.
 * @param creator - The creator of the comment, including their ID, name, and optional avatar URL.
 * @param hasUserVoted - Object indicating if current user has voted and the vote type.
 * @param upVoteCount - The number of upvotes (likes) on the comment.
 * @param text - The text content of the comment.
 * @param refetchComments - Optional callback to refresh comments after modifications.
 *
 * @returns JSX element representing the comment card.
 */
function CommentCard({
  id,
  creator,
  hasUserVoted,
  upVoteCount,
  text,
  refetchComments,
}: InterfaceCommentCardProps): JSX.Element {
  const { getItem } = useLocalStorage();
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const userId = getItem(IDENTIFIER_USER_ID);

  const [likes, setLikes] = React.useState(upVoteCount);
  const [isLiked, setIsLiked] = React.useState(false);
  const [showCommentOptions, setShowCommentOptions] = React.useState(false);
  const [showEditComment, setShowEditComment] = React.useState(false);
  const [editedCommentText, setEditedCommentText] = React.useState(text);
  const menuAnchorRef = React.useRef<HTMLButtonElement>(null);
  const [likeComment, { loading: liking }] = useMutation(LIKE_COMMENT);
  const [unlikeComment, { loading: unliking }] = useMutation(UNLIKE_COMMENT);
  const [deleteComment, { loading: deletingComment }] =
    useMutation(DELETE_COMMENT);
  const [updateComment, { loading: updatingComment }] =
    useMutation(UPDATE_COMMENT);

  const handleMenuOpen = (): void => {
    setShowCommentOptions(true);
  };

  const handleMenuClose = (): void => {
    setShowCommentOptions(false);
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
      NotificationToast.success(t('commentCard.commentDeletedSuccessfully'));
      refetchComments?.();
    } catch (error) {
      NotificationToast.error((error as Error).message);
    } finally {
      handleMenuClose();
    }
  };

  const handleUpdateComment = async (body: string): Promise<boolean> => {
    try {
      await updateComment({
        variables: { input: { id: id, body: body } },
      });
      NotificationToast.success(t('commentCard.commentUpdatedSuccessfully'));
      refetchComments?.();
      handleMenuClose();
      return true;
    } catch (error) {
      NotificationToast.error((error as Error).message);
      return false;
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
      NotificationToast.warning(t('commentCard.pleaseSignInToLikeComments'));
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
          NotificationToast.error(t('commentCard.couldNotRemoveExistingLike'));
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
        NotificationToast.error(t('commentCard.alreadyLikedComment'));
      } else if (errorCode === 'arguments_associated_resources_not_found') {
        NotificationToast.error(t('commentCard.noAssociatedVoteFound'));
      } else {
        NotificationToast.error((error as Error).message);
      }
    }
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={refetchComments}
    >
      <CommentContainer>
        <UserPortalCard
          imageSlot={
            <span className={commentCardStyles.userImageUserComment}>
              <ProfileAvatarDisplay
                imageUrl={creator.avatarURL || defaultAvatar}
                fallbackName={creator.name}
                size="small"
                dataTestId="user-avatar"
                enableEnlarge
              />
            </span>
          }
          actionsSlot={
            userId === creator.id ? (
              <>
                <IconButton
                  ref={menuAnchorRef}
                  onClick={handleMenuOpen}
                  size="small"
                  data-testid="more-options-button"
                  aria-label={t('commentCard.moreOptionsAriaLabel')}
                >
                  <MoreHoriz />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorRef.current}
                  open={showCommentOptions}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    data-testid="update-comment-button"
                    onClick={toggleEditComment}
                  >
                    <EditOutlined className={commentCardStyles.iconSmall} />
                    {t('commentCard.editComment')}
                  </MenuItem>
                  <MenuItem
                    data-testid="delete-comment-button"
                    onClick={handleDeleteComment}
                    disabled={deletingComment}
                  >
                    <DeleteOutline className={commentCardStyles.iconSmall} />
                    {deletingComment
                      ? t('commentCard.deleting')
                      : t('commentCard.deleteComment')}
                  </MenuItem>
                </Menu>
              </>
            ) : undefined
          }
          variant="compact"
          ariaLabel={t('commentCard.commentBy', { name: creator.name })}
          dataTestId="comment-card"
        >
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
        </UserPortalCard>

        {/* Edit Comment Modal */}
        <Modal
          open={showEditComment}
          onClose={toggleEditComment}
          data-testid="edit-comment-modal"
        >
          <Box className={commentCardStyles.editModalContent}>
            <Typography variant="h6">{t('commentCard.editComment')}</Typography>
            <Box sx={{ mb: 2 }}>
              <Input
                multiline
                rows={4}
                value={editedCommentText}
                onChange={handleEditCommentInput}
                fullWidth
                data-testid="edit-comment-input"
              />
            </Box>

            <Box className={commentCardStyles.modalActions}>
              <Box />
              <Box className={commentCardStyles.rightModalActions}>
                <Button variant="outlined" onClick={toggleEditComment}>
                  {tCommon('cancel')}
                </Button>
                <Button
                  variant="contained"
                  disabled={updatingComment}
                  onClick={async () => {
                    if (!editedCommentText.trim()) {
                      NotificationToast.error(
                        t('commentCard.emptyCommentError'),
                      );
                      return;
                    }
                    const updated =
                      await handleUpdateComment(editedCommentText);
                    if (updated) {
                      toggleEditComment();
                    }
                  }}
                  data-testid="save-comment-button"
                  icon={<EditOutlined />}
                  iconPosition="start"
                >
                  {updatingComment ? tCommon('saving') : tCommon('save')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </CommentContainer>
    </ErrorBoundaryWrapper>
  );
}

export default CommentCard;
