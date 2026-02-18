/**
 * Pinned Post Card Component
 *
 * This component renders a pinned post card with interactive features including viewing,
 * deleting and toggling pin status. It displays post content, creator information,
 * and provides admin/creator-specific actions through a dropdown menu.
 *
 * @param pinnedPost - The pinned post data containing id, caption, creator, etc.
 * @param onStoryClick - Callback function triggered when the post story is clicked.
 * @param onPostUpdate - Optional callback function triggered after any post updates.
 *
 * @returns A JSX element representing the pinned posts carousel layout.
 *
 * @remarks
 * - Only administrators can pin/unpin posts
 * - Post creators and administrators can edit/delete posts
 * - The component handles post updates, deletions, and pin status changes
 * - Toast notifications are shown for success/error states
 * - Uses Apollo Client mutations for backend operations
 *
 * @example
 * ```tsx
 * <PinnedPostCard
 *   pinnedPost={postData}
 *   onStoryClick={handleStoryClick}
 *   onPostUpdate={handlePostUpdate}
 * />
 * ```
 */

import React from 'react';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Box,
  IconButton,
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  PushPin,
  MoreVert,
  Visibility,
  DeleteOutline,
  PushPinOutlined,
} from '@mui/icons-material';
import { InterfacePinnedPostCardProps } from 'types/Post/interface';
import { DELETE_POST_MUTATION } from '../../GraphQl/Mutations/mutations';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';
import { errorHandler } from '../../utils/errorHandler';
import { formatDate } from '../../utils/dateFormatter';
import useLocalStorage from '../../utils/useLocalstorage';
import styles from './pinnedPostCard.module.css';
import defaultImg from '../../assets/images/defaultImg.png';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { Button } from '../Button';

const PinnedPostCard: React.FC<InterfacePinnedPostCardProps> = ({
  pinnedPost,
  onStoryClick,
  onPostUpdate,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'postCard' });
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();
  const [dropdownAnchor, setDropdownAnchor] =
    React.useState<null | HTMLElement>(null);

  const userId = getItem('userId') ?? getItem('id');
  const isAdmin = getItem('role') === 'administrator';
  const isPostCreator = pinnedPost.node?.creator?.id === userId;
  const canManage = Boolean(isAdmin || isPostCreator);
  const isPinned =
    Boolean(pinnedPost.node?.pinned) || pinnedPost.node?.pinnedAt != null;

  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const [togglePinPost] = useMutation(TOGGLE_PINNED_POST);
  const mimeType = pinnedPost.node?.attachments?.[0]?.mimeType;
  // Dropdown menu handlers
  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setDropdownAnchor(event.currentTarget);
  };

  const handleDropdownClose = (): void => {
    setDropdownAnchor(null);
  };

  // Toggle pin/unpin functionality
  const handleTogglePin = async (): Promise<void> => {
    try {
      await togglePinPost({
        variables: {
          input: {
            id: pinnedPost.node.id,
            isPinned: !isPinned,
          },
        },
      });
      if (onPostUpdate) {
        onPostUpdate();
      }
      NotificationToast.success(
        isPinned ? t('postUnpinnedSuccess') : t('postPinnedSuccess'),
      );
      handleDropdownClose();
      window.location.reload();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  const handleDeletePost = async (): Promise<void> => {
    try {
      await deletePost({ variables: { input: { id: pinnedPost.node.id } } });
      if (onPostUpdate) {
        onPostUpdate();
      }
      NotificationToast.success(t('postDeletedSuccess'));
      handleDropdownClose();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  return (
    <Container className={styles.postCardContainer}>
      <Card className={styles.card}>
        {/* Header with user info and actions */}
        <Box
          className={styles.cardHeader}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={pinnedPost.node?.creator?.avatarURL || undefined}
              sx={{ width: 28, height: 28 }}
            >
              {pinnedPost.node?.creator?.name?.[0]}
            </Avatar>
            <Typography className={styles.creatorName}>
              {pinnedPost.node?.creator?.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" aria-label={t('pinnedPost')}>
              <PushPin className={styles.pushPin} />
            </IconButton>
            {canManage && (
              <>
                <IconButton
                  size="small"
                  aria-label={t('moreOptions')}
                  onClick={handleDropdownOpen}
                  data-testid="more-options-button"
                  aria-haspopup="menu"
                  aria-expanded={Boolean(dropdownAnchor)}
                >
                  <MoreVert className={styles.moreOptionsButton} />
                </IconButton>
                <Menu
                  anchorEl={dropdownAnchor}
                  open={Boolean(dropdownAnchor)}
                  onClose={handleDropdownClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      minWidth: '150px',
                      '& .MuiMenuItem-root': { px: 2, py: 1 },
                    },
                  }}
                >
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
            )}
          </Box>
        </Box>

        {/* Post Media */}
        {pinnedPost.node.attachmentURL ? (
          <Box className={styles.postMedia}>
            {mimeType?.split('/')[0] == 'image' && (
              <img
                src={pinnedPost.node.attachmentURL}
                alt={t('postImage')}
                crossOrigin="anonymous"
                className={styles.postMedia}
              />
            )}

            {mimeType?.split('/')[0] == 'video' && (
              <video
                controls
                crossOrigin="anonymous"
                data-testid="post-video"
                className={styles.postMedia}
              >
                <source src={pinnedPost.node.attachmentURL} />
                <track kind="captions" />
              </video>
            )}
          </Box>
        ) : (
          <CardMedia
            component="img"
            height="175"
            image={pinnedPost.node?.attachmentURL ?? defaultImg}
            crossOrigin="anonymous"
            alt={t('postImage')}
            sx={{ objectFit: 'cover' }}
            draggable={false}
          />
        )}

        {/* Post Content */}
        <CardContent className={styles.cardContent}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '18px',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {pinnedPost.node.caption}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 1,
              fontSize: '12px',
            }}
          >
            {t('postedOn', { date: formatDate(pinnedPost.node.createdAt) })}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              icon={<Visibility />}
              iconPosition="start"
              onClick={() => onStoryClick(pinnedPost.node)}
              data-testid="view-post-btn"
              className={styles.viewPostButton}
            >
              {t('view')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PinnedPostCard;
