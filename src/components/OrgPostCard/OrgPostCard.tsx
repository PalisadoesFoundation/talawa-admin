import { useMutation, useQuery } from '@apollo/client';
import { Close, MoreVert, PushPin } from '@mui/icons-material';
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom'; // Import useParams
import AboutImg from 'assets/images/defaultImg.png';
import { errorHandler } from 'utils/errorHandler';
import styles from '../../style/app-fixed.module.css';
import DeletePostModal from './DeleteModal/DeletePostModal';
import {
  DELETE_POST_MUTATION,
  TOGGLE_PINNED_POST,
  UPDATE_POST_MUTATION,
  PRESIGNED_URL, // Changed from GET_PRESIGNED_URL
} from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import { useMinioUpload } from 'utils/MinioUpload';

interface OrgPostCardProps {
  post: InterfacePost;
}

interface InterfacePostFormState {
  caption: string;
  attachments: {
    objectName: string;
    mimeType: string;
    fileHash?: string;
  }[];
}

interface InterfacePostAttachment {
  id: string;
  postId: string;
  name: string; // Original file name (unchanged)
  objectName: string; // Add this for MinIO object name
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

export default function OrgPostCard({ post }: OrgPostCardProps): JSX.Element {
  const { orgId: currentOrg } = useParams<{ orgId: string }>(); // Get organization ID from URL
  const { uploadFileToMinio } = useMinioUpload();

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
  const imageAttachment = post.attachments?.find((a) =>
    a.mimeType.startsWith('image/'),
  );
  const videoAttachment = post.attachments?.find((a) =>
    a.mimeType.startsWith('video/'),
  );

  const isPinned = !!post.pinnedAt;

  const [updatePostMutation] = useMutation(UPDATE_POST_MUTATION);
  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION);
  const [togglePinMutation] = useMutation(TOGGLE_PINNED_POST);
  const [getPresignedUrl] = useMutation(PRESIGNED_URL);

  const [imagePresignedUrl, setImagePresignedUrl] = useState<string | null>(
    null,
  );
  const [videoPresignedUrl, setVideoPresignedUrl] = useState<string | null>(
    null,
  );

  const fetchPresignedUrl = async (
    objectName: string,
  ): Promise<string | null> => {
    if (!objectName) return null;

    try {
      const { data } = await getPresignedUrl({
        variables: {
          input: {
            objectName,
            operation: 'GET',
          },
        },
      });

      // Fix the property name to match the GraphQL schema:
      // Using createPresignedUrl instead of getPresignedUrl
      return data?.createPresignedUrl?.presignedUrl || null;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      toast.error('Failed to load media. Please try again.');
      return null; // Prevents breaking UI
    }
  };

  useEffect(() => {
    const loadPresignedUrls = async (): Promise<void> => {
      try {
        // Get presigned URL for image if it exists
        if (imageAttachment?.objectName) {
          const url = await fetchPresignedUrl(imageAttachment.objectName);
          setImagePresignedUrl(url);
        }

        // Get presigned URL for video if it exists
        if (videoAttachment?.objectName) {
          const url = await fetchPresignedUrl(videoAttachment.objectName);
          setVideoPresignedUrl(url);
        }
      } catch (error) {
        console.error('Failed to load presigned URLs:', error);
      }
    };

    if (modalVisible || playing) {
      loadPresignedUrls();
    }
  }, [imageAttachment, videoAttachment, modalVisible, playing]);

  // Add this state for preview URLs
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  // Add this useEffect to load preview URLs when edit modal opens
  useEffect(() => {
    if (showEditModal && postFormState.attachments.length > 0) {
      const loadPreviewUrls = async (): Promise<void> => {
        try {
          const urlPromises = postFormState.attachments.map(
            (a) => fetchPresignedUrl(a.objectName), // Changed from a.url
          );

          const urls = await Promise.all(urlPromises);
          const urlMap: Record<string, string> = {};

          postFormState.attachments.forEach((a, i) => {
            if (urls[i]) {
              urlMap[a.objectName] = urls[i] as string;
            }
          });

          setPreviewUrls(urlMap);
        } catch (error) {
          console.error('Error loading preview URLs:', error);
        }
      };

      loadPreviewUrls();
    }
  }, [showEditModal, JSON.stringify(postFormState.attachments)]); // Better dependency tracking

  // Add this state for file previews (different from MinIO URLs)
  const [filePreviewUrls, setFilePreviewUrls] = useState<
    Record<string, string>
  >({});

  // Add cleanup for object URLs on unmount
  useEffect(() => {
    return () => {
      // Clean up any created object URLs when component unmounts
      Object.values(filePreviewUrls).forEach(URL.revokeObjectURL);
    };
  }, [filePreviewUrls]);

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
    variables: {
      input: {
        id: post.creatorId || '',
      },
    },
    skip: !post.creatorId,
  });

  const handleVideoPause = (): void => {
    setPlaying(false);
    videoRef.current?.pause();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPostFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Create temporary ID for this upload
        const tempId = `temp-${Date.now()}`;

        // Create browser URL for immediate preview
        const previewUrl = URL.createObjectURL(file);

        // Store preview immediately with temp ID
        setFilePreviewUrls((prev) => ({
          ...prev,
          [tempId]: previewUrl,
        }));

        // Show loading state in UI
        setPostFormState((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              objectName: tempId, // Temporary ID for UI
              mimeType: file.type,
              isUploading: true, // Flag to show upload progress
            },
          ],
        }));

        // Upload in background
        const { objectName, fileHash } = await uploadFileToMinio(
          file,
          currentOrg || 'organizations',
        );

        // Update preview URLs map with final objectName
        setFilePreviewUrls((prev) => {
          const newUrls = { ...prev };
          // Store preview with real objectName
          newUrls[objectName] = prev[tempId];
          // Delete the temp entry
          delete newUrls[tempId];
          return newUrls;
        });

        // Update attachments with real objectName
        setPostFormState((prev) => ({
          ...prev,
          attachments: prev.attachments.map((a) =>
            a.objectName === tempId
              ? {
                  objectName,
                  mimeType: file.type,
                  fileHash,
                  isUploading: false,
                }
              : a,
          ),
        }));
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      try {
        // Create browser URL for preview BEFORE uploading to MinIO
        const previewUrl = URL.createObjectURL(file);

        // Upload to MinIO and get objectName
        const { objectName, fileHash } = await uploadFileToMinio(
          file,
          currentOrg || 'organizations',
        );

        // Store preview URL with objectName as key
        setFilePreviewUrls((prev) => ({
          ...prev,
          [objectName]: previewUrl, // Use objectName as key
        }));

        setPostFormState((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              objectName,
              mimeType: file.type,
              fileHash,
            },
          ],
        }));
      } catch (error) {
        console.error('Video upload error:', error);
        toast.error('Failed to upload video');
      }
    }
  };

  const clearImage = (objectName: string): void => {
    setPostFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.objectName !== objectName),
    }));
  };

  const clearVideo = (objectName: string): void => {
    setPostFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.objectName !== objectName),
    }));
  };

  const deletePost = async (): Promise<void> => {
    try {
      const { data } = await deletePostMutation({
        variables: {
          input: { id: post.id },
        },
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
                  src={videoPresignedUrl || ''}
                  type={videoAttachment?.mimeType || ''}
                />
              </video>
            ) : imageAttachment ? (
              <img
                className={styles.postimageOrgPostCard}
                src={imagePresignedUrl || AboutImg}
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
                      src={videoPresignedUrl || videoAttachment.objectName}
                      type={videoAttachment.mimeType}
                    />
                  </video>
                ) : (
                  <img
                    src={
                      imagePresignedUrl ||
                      imageAttachment?.objectName ||
                      AboutImg
                    }
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
                      <img
                        src={
                          filePreviewUrls[attachment.objectName] ||
                          previewUrls[attachment.objectName] ||
                          ''
                        }
                        alt="Preview"
                      />
                      <button
                        type="button"
                        className={styles.closeButtonP}
                        onClick={() => {
                          if (filePreviewUrls[attachment.objectName]) {
                            URL.revokeObjectURL(
                              filePreviewUrls[attachment.objectName],
                            );
                            setFilePreviewUrls((prev) => {
                              const newUrls = { ...prev };
                              delete newUrls[attachment.objectName];
                              return newUrls;
                            });
                          }
                          clearImage(attachment.objectName);
                        }}
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
                          src={
                            filePreviewUrls[attachment.objectName] ||
                            previewUrls[attachment.objectName] ||
                            ''
                          }
                          type={attachment.mimeType}
                        />
                        {t('videoNotSupported')}
                      </video>
                      <button
                        type="button"
                        className={styles.closeButtonP}
                        onClick={() => {
                          if (filePreviewUrls[attachment.objectName]) {
                            URL.revokeObjectURL(
                              filePreviewUrls[attachment.objectName],
                            );
                            setFilePreviewUrls((prev) => {
                              const newUrls = { ...prev };
                              delete newUrls[attachment.objectName];
                              return newUrls;
                            });
                          }
                          clearVideo(attachment.objectName);
                        }}
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
