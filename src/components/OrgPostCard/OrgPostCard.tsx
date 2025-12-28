/**
 * OrgPostCard Component
 *
 * This component represents a card for displaying organizational posts. It includes
 * functionalities for viewing, editing, deleting, and pinning/unpinning posts. The card
 * supports media attachments such as images and videos, and displays metadata like
 * creation date and author information.
 *
 * @param {InterfaceOrgPostCardProps} props - The props for the component.
 * @param {InterfacePost} props.post - The post data to be displayed in the card.
 *
 * @returns {JSX.Element} A React component that renders the organizational post card.
 *
 * @component
 *
 * @example
 * ```tsx
 * <OrgPostCard post={post} />
 * ```
 *
 * @remarks
 * - The component uses Apollo Client for GraphQL mutations and queries.
 * - It supports localization using the `react-i18next` library.
 * - Media attachments are displayed based on their MIME type (image or video).
 * - Includes modals for editing and deleting posts.
 *
 * @features
 * - View post details in a modal.
 * - Edit post caption and attachments.
 * - Delete a post with confirmation.
 * - Pin or unpin a post.
 * - Display author information fetched via GraphQL query.
 *
 * @dependencies
 * - `@apollo/client` for GraphQL operations.
 * - `react-bootstrap` for UI components.
 * - `react-toastify` for notifications.
 * - `react-i18next` for localization.
 * - `utils/convertToBase64` for file conversion.
 * - `utils/errorHandler` for error handling.
 *
 */
import { useMutation } from '@apollo/client';
import { PushPin } from '@mui/icons-material';
import React, { useState, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AboutImg from 'assets/images/defaultImg.png';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import DeletePostModal from './DeleteModal/DeletePostModal';
import PostEditModal from './components/PostEditModal';
import PostDetailModal from './components/PostDetailModal';
import { PluginInjector } from 'plugin';
import { DELETE_POST_MUTATION } from 'GraphQl/Mutations/mutations';

interface InterfacePostAttachment {
  id: string;
  postId: string;
  name: string;
  mimeType: string;
  createdAt: Date;
  updatedAt?: Date | null;
  creatorId?: string | null;
  updaterId?: string | null;
}

interface InterfacePost {
  id: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  pinnedAt?: Date | null;
  creatorId: string | null;
  attachments: InterfacePostAttachment[];
}

interface InterfaceOrgPostCardProps {
  post: InterfacePost;
}

export default function OrgPostCard({
  post,
}: InterfaceOrgPostCardProps): JSX.Element {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { t } = useTranslation('translation', { keyPrefix: 'orgPostCard' });

  // Get media attachments
  const imageAttachment = post.attachments.find((a) =>
    a.mimeType.startsWith('image/'),
  );
  const videoAttachment = post.attachments.find((a) =>
    a.mimeType.startsWith('video/'),
  );

  const isPinned = !!post.pinnedAt;

  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION);

  const handleCardClick = (): void => setModalVisible(true);
  const toggleShowEditModal = (): void => setShowEditModal((prev) => !prev);
  const toggleShowDeleteModal = (): void => setShowDeleteModal((prev) => !prev);

  const handleVideoPlay = (): void => {
    setPlaying(true);
    videoRef.current?.play();
  };

  const handleVideoPause = (): void => {
    setPlaying(false);
    videoRef.current?.pause();
  };

  const deletePost = async (): Promise<void> => {
    try {
      const { data } = await deletePostMutation({
        variables: { input: { id: post.id } },
      });

      if (data?.deletePost?.id) {
        toast.success(t('postDeleted'));
        toggleShowDeleteModal();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const [expanded, setExpanded] = useState(false);
  const captionRef = useRef<HTMLDivElement>(null);

  const caption = post.caption || '';
  const maxLength = 150;
  const isLong = caption.length > maxLength;

  const displayCaption = expanded ? caption : caption.slice(0, maxLength);

  const toggleExpand = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <>
      <div
        className="col-xl-4 col-lg-4 col-md-6"
        style={{
          width: '100%',
          maxWidth: '600px',
          margin: '20px auto',
        }}
        data-testid="post-item"
        onClick={handleCardClick}
      >
        <div className={cardsOrgPostCard}>
          <Card className={cardOrgPostCard} data-cy="postCardContainer">
            {videoAttachment ? (
              <video
                ref={videoRef}
                data-testid="video"
                muted
                className={postimageOrgPostCard}
                autoPlay={playing}
                loop={true}
                playsInline
                onMouseEnter={handleVideoPlay}
                onMouseLeave={handleVideoPause}
              >
                <source
                  src={videoAttachment.name}
                  type={videoAttachment.mimeType}
                />
              </video>
            ) : imageAttachment ? (
              <Card.Img
                className={postimageOrgPostCard}
                variant="top"
                src={imageAttachment.name}
                alt="Post image"
              />
            ) : (
              <Card.Img
                variant="top"
                src={AboutImg}
                alt="Default image"
                className={nopostimage}
              />
            )}

            <Card.Body className={cardBodyAdminPosts}>
              {isPinned && (
                <PushPin color="success" fontSize="large" className="fs-5" />
              )}
              <Card.Title className={titleOrgPostCard}>
                <div
                  ref={captionRef}
                  className={titleOrgPostCardDiv}
                  aria-expanded={expanded}
                >
                  {displayCaption}
                  {!expanded && isLong && '...'}
                </div>

                {isLong && (
                  <button
                    onClick={toggleExpand}
                    className={styles.expandButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#0056b3';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#007bff';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                    aria-label={
                      expanded ? 'Show less caption' : 'Show more caption'
                    }
                  >
                    {expanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </Card.Title>

              {/* Plugin Extension Point G3 - Inject plugins below caption */}
              <PluginInjector
                injectorType="G3"
                data={{
                  caption: post.caption,
                  postId: post.id,
                  createdAt: post.createdAt,
                  creatorId: post.creatorId,
                  attachments: post.attachments,
                  isPinned: isPinned,
                }}
              />

              <Card.Text className={textOrgPostCard}>
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        {/* Post Details Modal */}
        <PostDetailModal
          show={modalVisible}
          onHide={() => setModalVisible(false)}
          post={post}
          onEdit={toggleShowEditModal}
          onDelete={toggleShowDeleteModal}
        />

        {/* Edit Post Modal */}
        <PostEditModal
          show={showEditModal}
          onHide={toggleShowEditModal}
          post={post}
        />

        {/* Delete Post Modal */}
        <DeletePostModal
          show={showDeleteModal}
          onHide={toggleShowDeleteModal}
          onDelete={deletePost}
        />
      </div>
    </>
  );
}

const {
  cardsOrgPostCard,
  cardOrgPostCard,
  postimageOrgPostCard,
  nopostimage,
  cardBodyAdminPosts,
  titleOrgPostCard,
  titleOrgPostCardDiv,
  textOrgPostCard,
} = styles;
