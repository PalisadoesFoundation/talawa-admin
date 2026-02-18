/**
 * PostViewModal Component
 *
 * A modal component for displaying individual posts in a detailed view. This component
 * renders a post card within a modal dialog, allowing users to view posts in an overlay.
 * used to display pinned posts and shared posts.
 *
 * @example
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 * const [selectedPost, setSelectedPost] = useState<InterfacePost | null>(null);
 *
 * <PostViewModal
 *   show={showModal}
 *   onHide={() => setShowModal(false)}
 *   post={selectedPost}
 *   refetch={refetchPosts}
 * />
 * ```
 *
 * @param show - Controls the visibility of the modal
 * @param onHide - Callback function called when modal should be closed
 * @param post - The post object to display, or null to hide the modal
 * @param refetch - Function to refresh/refetch posts data
 *
 * @returns JSX.Element | null - Returns the modal component or null if no post is provided
 *
 * @remarks
 * - Returns null early if no post is provided
 * - Formats post data to match PostCard component requirements
 * - Handles missing creator data with fallback to translated "unknownUser"
 * - Includes error handling for date formatting failures
 * - Uses BaseModal for consistent modal behavior and styling
 * - Provides a close button with accessibility attributes
 * - Supports internationalization through useTranslation hook
 * - Renders posts using the PostCard component for consistent appearance
 * - Modal is configured with static backdrop and large size
 * - Handles various optional post fields with appropriate fallbacks
 *
 */
import React from 'react';
import { Button } from 'shared-components/Button';
import { Close } from '@mui/icons-material';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import PostCard from 'shared-components/postCard/PostCard';
import { useTranslation } from 'react-i18next';
import styles from './PostViewModal.module.css';
import type { InterfacePostViewModalProps } from 'types/shared-components/PostViewModal/interface';
import { formatPostForCard } from 'shared-components/posts/helperFunctions';

const PostViewModal: React.FC<InterfacePostViewModalProps> = ({
  show,
  onHide,
  post,
  refetch,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'posts' });

  if (!post) return null;

  return (
    <BaseModal
      show={show}
      onHide={onHide}
      dataTestId="post-view-modal"
      size="lg"
      backdrop="static"
      showCloseButton={false}
    >
      <div>
        <Button
          variant="light"
          onClick={onHide}
          data-testid="close-post-view-button"
          aria-label={t('closePostView')}
          className={`position-absolute top-0 end-0 m-2 btn-close-custom ${styles.closeButton}`}
        >
          <Close aria-hidden="true" />
        </Button>
        {/* Render the post */}
        <PostCard {...formatPostForCard(post, t, refetch)} />
      </div>
    </BaseModal>
  );
};

export default PostViewModal;
