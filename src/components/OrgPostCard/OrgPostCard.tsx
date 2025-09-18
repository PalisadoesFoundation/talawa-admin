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
import { useMutation, useQuery } from '@apollo/client';
import { Close, MoreVert, PushPin } from '@mui/icons-material';
import React, { useState, useRef } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AboutImg from 'assets/images/defaultImg.png';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import DeletePostModal from './DeleteModal/DeletePostModal';
import {
  DELETE_POST_MUTATION,
  TOGGLE_PINNED_POST,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';

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
  caption: string;
  createdAt: Date;
  updatedAt?: Date | null;
  pinnedAt?: Date | null;
  creatorId: string | null;
  attachments: InterfacePostAttachment[];
}

interface InterfaceOrgPostCardProps {
  post: InterfacePost;
}

interface InterfacePostFormState {
  caption: string;
  attachments: { url: string; mimeType: string }[];
}

export default function OrgPostCard({
  post,
}: InterfaceOrgPostCardProps): JSX.Element {
  const [postFormState, setPostFormState] = useState<InterfacePostFormState>({
    caption: post.caption,
    attachments: [],
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { t } = useTranslation('translation', { keyPrefix: 'orgPostCard' });
  const { t: tCommon } = useTranslation('common');

  // Get media attachments
  const imageAttachment = post.attachments.find((a) =>
    a.mimeType.startsWith('image/'),
  );
  const videoAttachment = post.attachments.find((a) =>
    a.mimeType.startsWith('video/'),
  );

  const isPinned = !!post.pinnedAt;

  const [updatePostMutation] = useMutation(UPDATE_POST_MUTATION);
  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION);
  const [togglePinMutation] = useMutation(TOGGLE_PINNED_POST);

  const togglePostPin = async (): Promise<void> => {
    try {
      const response = await togglePinMutation({
        variables: {
          input: {
            id: post.id,
            isPinned: !isPinned, // Toggle the pinned status
          },
        },
      });

      if (response.data?.updatePost) {
        setModalVisible(false);
        setMenuVisible(false);
        toast.success(isPinned ? 'Post unpinned' : 'Post pinned');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Failed to toggle pin');
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const handleCardClick = (): void => setModalVisible(true);
  const handleMoreOptionsClick = (): void => setMenuVisible(true);
  const toggleShowEditModal = (): void => setShowEditModal((prev) => !prev);
  const toggleShowDeleteModal = (): void => setShowDeleteModal((prev) => !prev);

  const handleVideoPlay = (): void => {
    setPlaying(true);
    videoRef.current?.play();
  };
  const handleCloseModal = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setModalVisible(false);
  };

  const { data: userData, loading: userLoading } = useQuery(GET_USER_BY_ID, {
    variables: { input: { id: post.creatorId || '' } },
    skip: !post.creatorId,
  });

  const handleVideoPause = (): void => {
    setPlaying(false);
    videoRef.current?.pause();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPostFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setPostFormState((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          { url: base64 as string, mimeType: file.type },
        ],
      }));
    }
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setPostFormState((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          { url: base64 as string, mimeType: file.type },
        ],
      }));
    }
  };

  const clearImage = (url: string): void => {
    setPostFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.url !== url),
    }));
  };

  const clearVideo = (url: string): void => {
    setPostFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.url !== url),
    }));
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

  async function getFileHashFromBase64(base64String: string): Promise<string> {
    const base64 = base64String.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const getMimeTypeEnum = (url: string): string => {
    // Check for base64 data URI
    if (url.startsWith('data:')) {
      const mimeMatch = url.match(/data:([^;]+)/);
      if (!mimeMatch) {
        return 'IMAGE_JPEG'; // fallback for malformed data URI
      }

      const mime = mimeMatch[1];

      if (mime === 'image/jpeg') {
        return 'IMAGE_JPEG';
      } else if (mime === 'image/png') {
        return 'IMAGE_PNG';
      } else if (mime === 'image/webp') {
        return 'IMAGE_WEBP';
      } else if (mime === 'image/avif') {
        return 'IMAGE_AVIF';
      } else if (mime === 'video/mp4') {
        return 'VIDEO_MP4';
      } else if (mime === 'video/webm') {
        return 'VIDEO_WEBM';
      } else {
        return 'IMAGE_JPEG'; // fallback for unknown mime types
      }
    }

    // Fallback for file URLs (e.g., https://.../file.png)
    // Remove query parameters and fragments before extracting extension
    const cleanUrl = url.split('?')[0].split('#')[0];
    const ext = cleanUrl.split('.').pop()?.toLowerCase();

    if (ext === 'jpg' || ext === 'jpeg') {
      return 'IMAGE_JPEG';
    } else if (ext === 'png') {
      return 'IMAGE_PNG';
    } else if (ext === 'webp') {
      return 'IMAGE_WEBP';
    } else if (ext === 'avif') {
      return 'IMAGE_AVIF';
    } else if (ext === 'mp4') {
      return 'VIDEO_MP4';
    } else if (ext === 'webm') {
      return 'VIDEO_WEBM';
    } else {
      return 'IMAGE_JPEG'; // fallback for unknown extensions
    }
  };

  const updatePost = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    let attachment = null;
    if (postFormState.attachments.length > 0) {
      const fileName =
        postFormState.attachments[0].url.split('/').pop() || 'defaultFileName';
      const mimeType = postFormState.attachments[0].mimeType;
      const objectName = 'uploads/' + fileName;
      const fileHash = await getFileHashFromBase64(
        postFormState.attachments[0].url,
      );

      attachment = {
        fileHash,
        mimetype: getMimeTypeEnum(mimeType),
        name: fileName,
        objectName,
      };
    }

    try {
      const { data } = await updatePostMutation({
        variables: {
          input: {
            id: post.id,
            caption: postFormState.caption.trim(),
            attachments: attachment ? [attachment] : [],
          },
        },
      });

      if (data?.updatePost?.id) {
        toast.success(t('postUpdated'));
        setShowEditModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <>
      <div
        className="col-xl-4 col-lg-4 col-md-6"
        data-testid="post-item"
        onClick={handleCardClick}
      >
        <div className={styles.cardsOrgPostCard}>
          <Card className={styles.cardOrgPostCard}>
            {videoAttachment ? (
              <video
                ref={videoRef}
                data-testid="video"
                muted
                className={styles.postimageOrgPostCard}
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
                className={styles.postimageOrgPostCard}
                variant="top"
                src={imageAttachment.name}
                alt="Post image"
              />
            ) : (
              <Card.Img
                variant="top"
                src={AboutImg}
                alt="Default image"
                className={styles.nopostimage}
              />
            )}

            <Card.Body>
              {isPinned && (
                <PushPin color="success" fontSize="large" className="fs-5" />
              )}
              <Card.Title className={styles.titleOrgPostCard}>
                {post.caption}
              </Card.Title>
              <Card.Text className={styles.textOrgPostCard}>
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        {modalVisible && (
          <div className={styles.modalOrgPostCard} data-testid="post-modal">
            <div className={styles.modalContentOrgPostCard}>
              <div className={styles.modalImage}>
                {videoAttachment ? (
                  <video controls autoPlay loop muted>
                    <source
                      src={videoAttachment.name}
                      type={videoAttachment.mimeType}
                    />
                  </video>
                ) : (
                  <img
                    src={imageAttachment?.name || AboutImg}
                    alt="Post content"
                  />
                )}
              </div>

              <div className={styles.modalInfo}>
                <div className={styles.infodiv}>
                  <p>{post.caption}</p>
                  <br />
                  <p>
                    Dated:{' '}
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <br />
                  <Card.Text className={styles.creatorInfo}>
                    {'Author '}:{'  '}
                    {post.creatorId ? (
                      userLoading ? (
                        <span className="text-muted">
                          {tCommon(' loading ')}
                        </span>
                      ) : (
                        userData?.user?.name || 'Unknown'
                      )
                    ) : (
                      'Unknown'
                    )}
                  </Card.Text>
                  {post.updatedAt && (
                    <p>
                      Last updated: {new Date(post.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <button
                className={styles.moreOptionsButton}
                onClick={handleMoreOptionsClick}
                data-testid="more-options-button"
                aria-label="Post options menu"
              >
                <MoreVert />
              </button>
              <button
                className={styles.closeButtonOrgPostCard}
                onClick={handleCloseModal}
                data-testid="close-modal-button"
              >
                <Close />
              </button>
            </div>
          </div>
        )}

        {menuVisible && (
          <div className={styles.menuModal} data-testid="post-menu">
            <div className={styles.menuContent}>
              <ul className={styles.menuOptions}>
                <li onClick={toggleShowEditModal}>{tCommon('edit')}</li>
                <li onClick={toggleShowDeleteModal} data-testid="delete-option">
                  {t('deletePost')}
                </li>
                <li onClick={togglePostPin} data-testid="pin-post-button">
                  {isPinned ? 'Unpin post' : 'Pin post'}
                </li>
                <li
                  onClick={(): void => setMenuVisible(false)}
                  data-testid="close-menu-option"
                >
                  {tCommon('close')}
                </li>
              </ul>
            </div>
          </div>
        )}

        <Modal
          show={showEditModal}
          onHide={toggleShowEditModal}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title>{t('editPost')}</Modal.Title>
          </Modal.Header>

          <Form
            onSubmit={updatePost}
            role="form"
            data-testid="update-post-form"
          >
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Caption</Form.Label>
                <Form.Control
                  type="text"
                  name="caption"
                  value={postFormState.caption}
                  onChange={handleInputChange}
                  required
                  className={styles.inputField}
                  placeholder={t('enterCaption')}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('image')}</Form.Label>
                <Form.Control
                  type="file"
                  data-testid="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.inputField}
                />
                {postFormState.attachments
                  .filter((a) => a.mimeType.startsWith('image/'))
                  .map((attachment, index) => (
                    <div key={index} className={styles.previewOrgPostCard}>
                      <img src={attachment.url} alt="Preview" />
                      <button
                        type="button"
                        className={styles.closeButtonP}
                        onClick={() => clearImage(attachment.url)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Video</Form.Label>
                <Form.Control
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className={styles.inputField}
                  data-testid="video-upload"
                />

                {postFormState.attachments
                  .filter((a) => a.mimeType.startsWith('video/'))
                  .map((attachment, index) => (
                    <div key={index} className={styles.previewOrgPostCard}>
                      <video controls data-testid="video-preview">
                        <source
                          src={attachment.url}
                          type={attachment.mimeType}
                        />
                        {t('videoNotSupported')}
                      </video>
                      <button
                        type="button"
                        className={styles.closeButtonP}
                        onClick={() => clearVideo(attachment.url)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={toggleShowEditModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                data-testid="update-post-submit"
              >
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <DeletePostModal
          show={showDeleteModal}
          onHide={toggleShowDeleteModal}
          onDelete={deletePost}
        />
      </div>
    </>
  );
}
