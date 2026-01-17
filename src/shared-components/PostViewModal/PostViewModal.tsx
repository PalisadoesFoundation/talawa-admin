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
import { Button } from 'react-bootstrap';
import { Close } from '@mui/icons-material';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import PostCard from 'shared-components/postCard/PostCard';
import { useTranslation } from 'react-i18next';
import { InterfacePost } from 'types/Post/interface';
import { formatDate } from 'utils/dateFormatter';
import styles from 'style/app-fixed.module.css';

interface InterfacePostViewModalProps {
  show: boolean;
  onHide: () => void;
  post: InterfacePost | null;
  refetch: () => Promise<unknown>;
}

const PostViewModal: React.FC<InterfacePostViewModalProps> = ({
  show,
  onHide,
  post,
  refetch,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'posts' });

  if (!post) return null;

  const formatPostForCard = (post: InterfacePost) => ({
    id: post.id,
    creator: {
      id: post.creator?.id ?? 'unknown',
      name: post.creator?.name ?? t('unknownUser'),
      avatarURL: post.creator?.avatarURL,
    },
    hasUserVoted: post.hasUserVoted ?? { hasVoted: false, voteType: null },
    postedAt: (() => {
      try {
        return formatDate(post.createdAt);
      } catch {
        return '';
      }
    })(),
    pinnedAt: post.pinnedAt ?? null,
    mimeType: post.attachments?.[0]?.mimeType ?? null,
    attachmentURL: post.attachmentURL ?? null,
    title: post.caption ?? '',
    text: post.caption ?? '',
    body: post.body,
    commentCount: post.commentsCount ?? 0,
    upVoteCount: post.upVotesCount ?? 0,
    downVoteCount: post.downVotesCount ?? 0,
    fetchPosts: refetch,
  });

  return (
    <BaseModal
      show={show}
      onHide={onHide}
      dataTestId="pinned-post-modal"
      size="lg"
      backdrop="static"
      className={styles.pinnedPostModal}
      showCloseButton={false}
    >
      <div className={styles.pinnedPostModalBody}>
        <Button
          variant="light"
          onClick={onHide}
          data-testid="close-post-view-button"
          aria-label={t('closePostView')}
          className={`position-absolute top-0 end-0 m-2 btn-close-custom ${styles.closeButton}`}
        >
          <Close className={styles.closeButtonIcon} aria-hidden="true" />
        </Button>
        {/* Render the post */}
        <PostCard {...formatPostForCard(post)} />
      </div>
    </BaseModal>
  );
};

export default PostViewModal;
