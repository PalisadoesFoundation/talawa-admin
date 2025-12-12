import React from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Box,
  Button,
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
import { InterfacePost, InterfacePostEdge } from 'types/Post/interface';
import { DELETE_POST_MUTATION } from '../../GraphQl/Mutations/mutations';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';
import { errorHandler } from '../../utils/errorHandler';
import useLocalStorage from '../../utils/useLocalstorage';

interface InterfacePinnedPostCardProps {
  pinnedPost: InterfacePostEdge;
  onStoryClick: (post: InterfacePost) => void;
  onPostUpdate?: () => void;
}

const PinnedPostCard: React.FC<InterfacePinnedPostCardProps> = ({
  pinnedPost,
  onStoryClick,
  onPostUpdate,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'postCard' });
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();
  console.log('pinnedPost.node', pinnedPost.node);
  const [dropdownAnchor, setDropdownAnchor] =
    React.useState<null | HTMLElement>(null);

  const userId = getItem('userId') ?? getItem('id');
  const isAdmin = getItem('role') === 'administrator';
  const isPostCreator = pinnedPost.node?.creator?.id === userId;
  const isPinned =
    pinnedPost.node?.pinned || pinnedPost.node?.pinnedAt !== null;

  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const [togglePinPost] = useMutation(TOGGLE_PINNED_POST);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

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
      toast.success(
        isPinned ? t('postUnpinnedSuccess') : t('postPinnedSuccess'),
      );
      handleDropdownClose();
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
      toast.success(t('postDeletedSuccess'));
      handleDropdownClose();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  return (
    <Container sx={{ width: '340px', height: '390px' }}>
      <Card sx={{ width: '340px', borderRadius: 2, overflow: 'hidden' }}>
        {/* Header with user info and actions */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            pb: 1,
            height: '49px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={pinnedPost.node?.creator?.avatarURL || undefined}
              sx={{ width: 28, height: 28 }}
            >
              {pinnedPost.node?.creator?.name?.[0]}
            </Avatar>
            <Typography variant="h6" sx={{ fontSize: 14 }}>
              {pinnedPost.node?.creator?.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" aria-label="share">
              <PushPin sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              size="small"
              aria-label="more options"
              onClick={handleDropdownOpen}
              data-testid="more-options-button"
            >
              <MoreVert sx={{ fontSize: 20 }} />
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
          </Box>
        </Box>

        {/* Post Image */}

        <CardMedia
          component="img"
          height="175"
          image={
            pinnedPost.node?.imageUrl ?? '/src/assets/images/defaultImg.png'
          }
          alt="Post image"
          sx={{ objectFit: 'cover' }}
          draggable={false}
        />

        {/* Post Content */}
        <CardContent sx={{ height: '166px' }}>
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
            {pinnedPost.node?.caption || 'Untitled Post'}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 1,
              fontSize: '12px',
            }}
          >
            Posted on: {formatDate(pinnedPost.node?.createdAt)}
          </Typography>

          <Typography
            color="text.primary"
            sx={{
              fontSize: '14px',
              height: '40px', // Fixed height for exactly 2 lines
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.4,
            }}
          >
            {pinnedPost.node?.caption || 'No content available'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Visibility />}
              onClick={() => onStoryClick(pinnedPost.node)}
              sx={{
                backgroundColor: '#a8c8ec',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#8bb5e8',
                },
              }}
            >
              View
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PinnedPostCard;
