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
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AboutImg from 'assets/images/defaultImg.png';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import { validateFile } from 'utils/fileValidation';
import { useParams } from 'react-router';
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

interface InterfacePreviewAttachment {
  url: string; // presigned URL for preview
  mimeType: string;
  objectName: string; // objectName for submission
}

export default function OrgPostCard({
  post,
}: InterfaceOrgPostCardProps): JSX.Element {
  const [postFormState, setPostFormState] = useState<InterfacePostFormState>({
    caption: post.caption,
    attachments: [],
  });

  const [localPreviews, setLocalPreviews] = useState<
    InterfacePreviewAttachment[]
  >([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { t } = useTranslation('translation', { keyPrefix: 'orgPostCard' });
  const { t: tCommon } = useTranslation('common');

  // Initialize MinIO hooks
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();
  const { orgId } = useParams();

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
  const [imageSrc, setImageSrc] = useState<string>(AboutImg);
  const [videoSrc, setVideoSrc] = useState<string>('');

  // Clean up object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      localPreviews.forEach((preview) => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [localPreviews]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (imageAttachment && orgId) {
        const url = await getPresignedUrlForAttachment(imageAttachment.name);
        if (mounted) setImageSrc(url);
      } else {
        setImageSrc(AboutImg);
      }
      if (videoAttachment && orgId) {
        try {
          const url = await getPresignedUrlForAttachment(videoAttachment.name);
          if (mounted) setVideoSrc(url);
        } catch {
          setVideoSrc('');
        }
      } else {
        setVideoSrc('');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [imageAttachment?.name, videoAttachment?.name, orgId]);

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
      console.error('Mutation Error:', error);
      errorHandler(t, error);
    }
  };

  const handleCardClick = (): void => setModalVisible(true);
  const handleMoreOptionsClick = (): void => setMenuVisible(true);
  const toggleShowEditModal = (): void => {
    setShowEditModal((prev) => !prev);
    // Reset previews when closing edit modal
    if (showEditModal) {
      localPreviews.forEach((preview) => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
      setLocalPreviews([]);
      setPostFormState({
        caption: post.caption,
        attachments: [],
      });
    }
  };
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
      // Validate file before upload
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.errorMessage);
        return;
      }

      try {
        // Create local preview URL
        const previewUrl = URL.createObjectURL(file);

        // Upload to MinIO and get object name
        const { objectName } = await uploadFileToMinio(file, orgId!);

        // Add to local previews for UI
        setLocalPreviews((prev) => [
          ...prev,
          { url: previewUrl, mimeType: file.type, objectName },
        ]);

        // Add to form state for submission (using objectName)
        setPostFormState((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            { url: objectName, mimeType: file.type },
          ],
        }));

        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Image upload failed');
      }
    }
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file before upload
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.errorMessage);
        return;
      }

      try {
        // Create local preview URL
        const previewUrl = URL.createObjectURL(file);

        // Upload to MinIO and get object name
        const { objectName } = await uploadFileToMinio(file, orgId!);

        // Add to local previews for UI
        setLocalPreviews((prev) => [
          ...prev,
          { url: previewUrl, mimeType: file.type, objectName },
        ]);

        // Add to form state for submission (using objectName)
        setPostFormState((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            { url: objectName, mimeType: file.type },
          ],
        }));

        toast.success('Video uploaded successfully');
      } catch (error) {
        console.error('Error uploading video:', error);
        toast.error('Video upload failed');
      }
    }
  };

  const clearAttachment = (objectName: string): void => {
    // Find the preview to clean up
    const previewToRemove = localPreviews.find(
      (preview) => preview.objectName === objectName,
    );
    if (previewToRemove && previewToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove.url);
    }

    // Remove from previews
    setLocalPreviews((prev) =>
      prev.filter((preview) => preview.objectName !== objectName),
    );

    // Remove from form state
    setPostFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.url !== objectName),
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

  const updatePost = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await updatePostMutation({
        variables: {
          input: {
            id: post.id,
            caption: postFormState.caption.trim(),
            attachments: postFormState.attachments,
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

  // Function to get presigned URL for existing attachments (from the post)
  const getPresignedUrlForAttachment = async (
    attachmentName: string,
  ): Promise<string> => {
    try {
      return await getFileFromMinio(attachmentName, orgId!);
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      return AboutImg; // fallback to default image
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
                  src={videoSrc} // This should be a presigned URL from the server
                  type={videoAttachment.mimeType}
                />
              </video>
            ) : imageAttachment ? (
              <Card.Img
                className={styles.postimageOrgPostCard}
                variant="top"
                src={imageSrc} // This should be a presigned URL from the server
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
                      src={videoSrc} // This should be a presigned URL from the server
                      type={videoAttachment.mimeType}
                    />
                  </video>
                ) : (
                  <img
                    src={imageSrc || AboutImg} // This should be a presigned URL from the server
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
                {localPreviews
                  .filter((preview) => preview.mimeType.startsWith('image/'))
                  .map((preview, index) => (
                    <div key={index} className={styles.previewOrgPostCard}>
                      <img src={preview.url} alt="Preview" />
                      <button
                        type="button"
                        className={styles.closeButtonP}
                        onClick={() => clearAttachment(preview.objectName)}
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

                {localPreviews
                  .filter((preview) => preview.mimeType.startsWith('video/'))
                  .map((preview, index) => (
                    <div key={index} className={styles.previewOrgPostCard}>
                      <video controls data-testid="video-preview">
                        <source src={preview.url} type={preview.mimeType} />
                        {t('videoNotSupported')}
                      </video>
                      <button
                        type="button"
                        className={styles.closeButtonP}
                        onClick={() => clearAttachment(preview.objectName)}
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
