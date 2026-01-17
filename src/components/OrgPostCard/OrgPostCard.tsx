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
import Button from 'react-bootstrap/Button';
import { Form, Card, Modal, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AboutImg from 'assets/images/defaultImg.png';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import DeletePostModal from './DeleteModal/DeletePostModal';
import { PluginInjector } from 'plugin';
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

interface InterfacePostFormState {
  caption: string;
  attachments: { url: string; mimeType: string }[];
}

export default function OrgPostCard({
  post,
}: InterfaceOrgPostCardProps): JSX.Element {
  const [postFormState, setPostFormState] = useState<InterfacePostFormState>({
    caption: post.caption ?? 'Untitled',
    attachments: [],
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
            isPinned: !isPinned,
          },
        },
      });

      if (response.data?.updatePost) {
        setModalVisible(false);
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
  const toggleShowEditModal = (): void => setShowEditModal((prev) => !prev);
  const toggleShowDeleteModal = (): void => setShowDeleteModal((prev) => !prev);

  const handleVideoPlay = (): void => {
    setPlaying(true);
    videoRef.current?.play();
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
      return 'IMAGE_JPEG';
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
        <div className={styles.cardsOrgPostCard}>
          <Card className={styles.cardOrgPostCard} data-cy="postCardContainer">
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

            <Card.Body className={styles.cardBodyAdminPosts}>
              {isPinned && (
                <PushPin color="success" fontSize="large" className="fs-5" />
              )}
              <Card.Title className={styles.titleOrgPostCard}>
                <div
                  ref={captionRef}
                  className={styles.titleOrgPostCardDiv}
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

              <Card.Text className={styles.textOrgPostCard}>
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        {/* Bootstrap Modal for Post Details */}
        <Modal
          show={modalVisible}
          onHide={() => setModalVisible(false)}
          size="lg"
          centered
          data-testid="post-modal"
        >
          <Modal.Header>
            <Modal.Title>Post Details</Modal.Title>
            <div className="d-flex align-items-center ms-auto">
              <Dropdown className="me-2">
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-more-options"
                  className="p-0 border-0 text-dark"
                  data-testid="more-options-button"
                  aria-label="Post options menu"
                  bsPrefix="btn"
                  as="button"
                  style={{ background: 'none', border: 'none' }}
                >
                  <MoreVert />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" data-testid="post-menu">
                  <Dropdown.Item
                    onClick={toggleShowEditModal}
                    data-cy="edit-option"
                  >
                    {tCommon('edit')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={toggleShowDeleteModal}
                    data-testid="delete-option"
                  >
                    {t('deletePost')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={togglePostPin}
                    data-testid="pin-post-button"
                  >
                    {isPinned ? 'Unpin post' : 'Pin post'}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data-testid="close-menu-option">
                    {tCommon('close')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="link"
                className="p-1 text-dark ms-2"
                aria-label="Close"
                data-testid="close-modal-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalVisible(false);
                }}
                style={{ lineHeight: '1' }}
              >
                <Close fontSize="small" />
              </Button>
            </div>
          </Modal.Header>

          <Modal.Body>
            <div className="row">
              <div className="col-md-6 mb-3 mb-md-0">
                {videoAttachment ? (
                  <video controls autoPlay loop muted className="w-100">
                    <source
                      src={videoAttachment.name}
                      type={videoAttachment.mimeType}
                    />
                  </video>
                ) : (
                  <img
                    src={imageAttachment?.name || AboutImg}
                    alt="Post content"
                    className="w-100"
                    style={{ borderRadius: '8px' }}
                  />
                )}
              </div>

              <div className="col-md-6">
                <div className={styles.infodiv}>
                  <p className="mb-3">{post.caption}</p>
                  <p className="mb-3">
                    <strong>Dated:</strong>{' '}
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <Card.Text className={styles.creatorInfo}>
                    <strong>Author:</strong>{' '}
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
                    <p className="mt-3">
                      <strong>Last updated:</strong>{' '}
                      {new Date(post.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Edit Post Modal */}
        <Modal
          show={showEditModal}
          onHide={toggleShowEditModal}
          backdrop="static"
          centered
          backdropClassName="bg-dark"
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
                  data-cy="editCaptionInput"
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
                  data-cy="image-upload-input"
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
                data-cy="update-post-submit"
              >
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

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
