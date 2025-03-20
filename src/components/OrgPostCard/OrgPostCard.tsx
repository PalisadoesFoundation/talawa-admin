import { useMutation, useQuery } from '@apollo/client';
import { Close, MoreVert, PushPin } from '@mui/icons-material';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import AboutImg from 'assets/images/defaultImg.png';
import { errorHandler } from 'utils/errorHandler';
import styles from '../../style/app-fixed.module.css';
import DeletePostModal from './DeleteModal/DeletePostModal';
import {
  DELETE_POST_MUTATION,
  TOGGLE_PINNED_POST,
  UPDATE_POST_MUTATION,
  PRESIGNED_URL,
} from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import { useMinioUpload } from 'utils/MinioUpload';
import type { EffectCallback } from 'react';

interface OrgPostCardProps {
  post: InterfacePost;
}

interface InterfacePostFormState {
  caption: string;
  attachments: {
    objectName: string;
    mimeType: string;
    fileHash?: string;
    isUploading?: boolean;
  }[];
}

interface InterfacePostAttachment {
  id: string;
  postId: string;
  name: string;
  objectName: string;
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
  const { orgId: currentOrg } = useParams<{ orgId: string }>();
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

  // Add a URL cache with expiration timestamps
  const [urlCache, setUrlCache] = useState<
    Record<string, { url: string; expiry: number }>
  >({});

  // Add a URL sanitization function to prevent XSS attacks
  const sanitizeUrl = (url: string | null): string => {
    if (!url) return '';

    // Handle data URIs for local file previews
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url; // Safe for internal file previews
    }

    try {
      // Create a URL object to validate
      const parsed = new URL(url);
      // Only allow http/https protocols
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return '';
      }
      return url;
    } catch (e) {
      return '';
    }
  };

  const sanitizeText = (text: string): string => {
    if (!text) return '';

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#x2F;');
  };

  const isMounted = useRef<boolean>(true);

  const cleanupExpiredUrls = useCallback(() => {
    const now = Date.now();
    setUrlCache((prev) => {
      const newCache = { ...prev };
      let hasChanges = false;

      Object.keys(newCache).forEach((key) => {
        if (newCache[key].expiry < now) {
          delete newCache[key];
          hasChanges = true;
        }
      });

      return hasChanges ? newCache : prev;
    });
  }, []);

  useEffect(() => {
    const cleanupInterval = setInterval(cleanupExpiredUrls, 60000);

    return () => {
      clearInterval(cleanupInterval);
      isMounted.current = false;
    };
  }, [cleanupExpiredUrls]);

  const fetchPresignedUrl = async (
    objectName: string,
  ): Promise<string | null> => {
    if (!objectName) return null;

    const cached = urlCache[objectName];
    const now = Date.now();
    if (cached && cached.expiry > now) {
      return cached.url;
    }

    try {
      const { data } = await getPresignedUrl({
        variables: {
          input: {
            objectName,
            operation: 'GET',
          },
        },
      });

      if (!data?.createPresignedUrl?.presignedUrl) {
        console.error('Received invalid presigned URL data', data);
        return null;
      }

      const url = data.createPresignedUrl.presignedUrl;

      if (url && isMounted.current) {
        setUrlCache((prev) => ({
          ...prev,
          [objectName]: {
            url,
            expiry: now + 5 * 60 * 1000,
          },
        }));
      }

      return url;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      if (isMounted.current) {
        toast.error('Failed to load media. Please try again.');
      }
      return null;
    }
  };

  const loadMediaWithCorsHandling = async (
    url: string,
    type: 'image' | 'video',
  ): Promise<void> => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Failed to access media: ${response.status}`);
      }

      if (type === 'image') {
        setImagePresignedUrl(url);
      } else {
        setVideoPresignedUrl(url);
      }
    } catch (error) {
      console.error('CORS or media access error:', error);
      if (error instanceof TypeError && error.message.includes('CORS')) {
        toast.error(
          'Media cannot be loaded due to cross-origin restrictions. Please contact your administrator.',
        );
      } else {
        toast.error('Failed to load media. Please try again.');
      }

      if (type === 'image') {
        setImagePresignedUrl(null);
      } else {
        setVideoPresignedUrl(null);
      }
    }
  };

  const loadPresignedUrls = async (): Promise<void> => {
    try {
      // Get presigned URL for image if it exists
      if (imageAttachment?.objectName) {
        const url = await fetchPresignedUrl(imageAttachment.objectName);
        if (url && isMounted.current) {
          await loadMediaWithCorsHandling(url, 'image');
        }
      }

      // Get presigned URL for video if it exists
      if (videoAttachment?.objectName) {
        const url = await fetchPresignedUrl(videoAttachment.objectName);
        if (url && isMounted.current) {
          await loadMediaWithCorsHandling(url, 'video');
        }
      }
    } catch (error) {
      console.error('Failed to load presigned URLs:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !modalVisible &&
        !playing &&
        (imageAttachment?.objectName || videoAttachment?.objectName)
      ) {
        loadPresignedUrls();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [imageAttachment, videoAttachment]);

  useEffect(() => {
    if (modalVisible || playing) {
      loadPresignedUrls();
    }
  }, [modalVisible, playing]);

  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const useDeepCompareEffect = (effect: EffectCallback, deps: unknown[]) => {
    const ref = useRef<unknown[]>();

    if (deps !== ref.current) {
      ref.current = deps;
    }

    useEffect(effect, [ref.current]);
  };

  // Add this useEffect to load preview URLs when edit modal opens
  useDeepCompareEffect(() => {
    if (showEditModal && postFormState.attachments.length > 0) {
      const loadPreviewUrls = async (): Promise<void> => {
        try {
          const urlPromises = postFormState.attachments.map((a) =>
            fetchPresignedUrl(a.objectName),
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
  }, [showEditModal, postFormState.attachments]);

  // Add this state for file previews (different from MinIO URLs)
  const [filePreviewUrls, setFilePreviewUrls] = useState<
    Record<string, string>
  >({});

  // Add cleanup for object URLs on unmount
  useEffect(() => {
    return () => {
      // Safely clean up object URLs when component unmounts
      if (filePreviewUrls) {
        Object.values(filePreviewUrls).forEach((url) => {
          if (typeof url === 'string') {
            try {
              URL.revokeObjectURL(url);
            } catch (error) {
              // Silently handle errors during cleanup
              console.debug('Error revoking URL:', error);
            }
          }
        });
      }
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

      if (!isMounted.current) return;

      if (response.data?.updatePost) {
        // Batch the state updates
        const nextAction = (): void => {
          toast.success(isPinned ? 'Post unpinned' : 'Post pinned');
          setTimeout(() => {
            if (isMounted.current) {
              window.location.reload();
            }
          }, 2000);
        };

        setModalVisible(false);
        setMenuVisible(false);
        // Defer the toast and reload to next tick to avoid visual flickering
        setTimeout(nextAction, 0);
      } else {
        toast.error('Failed to toggle pin');
      }
    } catch (error: unknown) {
      console.error('Mutation Error:', error);
      if (isMounted.current) {
        errorHandler(t, error);
      }
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

  // Add this constant at the top of your component or in a constants file
  const MAX_FILE_SIZE_MB = 5; // 5MB limit

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      // File type validation
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files allowed');
        return;
      }

      // Add file size validation here
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }

      try {
        // Generate a unique temporary ID for this upload to avoid race conditions
        const tempId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Step 1: Create preview immediately using the unique temporary ID as key
        const previewUrl = URL.createObjectURL(file);
        setFilePreviewUrls((prev) => ({
          ...prev,
          [tempId]: previewUrl,
        }));

        // Step 2: Show preview to user with temporary entry in attachments
        setPostFormState((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              objectName: tempId, // Use tempId instead of file.name
              mimeType: file.type,
              isUploading: true, // Show loading indicator
            },
          ],
        }));

        // Step 3: Upload to MinIO in background
        const { objectName, fileHash } = await uploadFileToMinio(
          file,
          currentOrg || 'organizations',
        );

        // Early return if component unmounted
        if (!isMounted.current) {
          // Clean up the preview URL before returning
          if (filePreviewUrls[tempId]) {
            try {
              URL.revokeObjectURL(filePreviewUrls[tempId]);
            } catch (error) {
              console.debug('Error revoking URL:', error);
            }
          }
          return;
        }

        // Step 4: Update attachments with real objectName while keeping preview visible
        setPostFormState((prev) => ({
          ...prev,
          attachments: prev.attachments.map((a) =>
            a.objectName === tempId
              ? {
                  objectName, // Replace with real objectName
                  mimeType: file.type,
                  fileHash,
                  isUploading: false,
                }
              : a,
          ),
        }));

        // Update preview URLs map with final objectName
        setFilePreviewUrls((prev) => {
          const newUrls = { ...prev };
          // Copy the preview URL to the new objectName key
          newUrls[objectName] = prev[tempId];
          // Delete the temporary entry
          delete newUrls[tempId];
          return newUrls;
        });
      } catch (error) {
        console.error('Image upload error:', error);
        if (isMounted.current) {
          toast.error('Failed to upload image');

          // Clean up on error - remove the attachment and preview
          setPostFormState((prev) => ({
            ...prev,
            attachments: prev.attachments.filter(
              (a) => a.objectName !== file.name,
            ),
          }));

          if (filePreviewUrls[file.name]) {
            try {
              URL.revokeObjectURL(filePreviewUrls[file.name]);
            } catch (error) {
              console.debug('Error revoking URL:', error);
            }
            // Rest of your code...
          }
        }
      }
    }
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      // File type validation
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }

      // Add file size validation here
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }

      // Generate a unique temporary ID for this upload to avoid race conditions
      const tempId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      try {
        // Step 1: Create preview immediately using the unique temporary ID as key
        const previewUrl = URL.createObjectURL(file);
        setFilePreviewUrls((prev) => ({
          ...prev,
          [tempId]: previewUrl,
        }));

        // Step 2: Show preview with temporary entry in attachments
        setPostFormState((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              objectName: tempId, // Use tempId instead of file.name
              mimeType: file.type,
              isUploading: true, // Show loading indicator
            },
          ],
        }));

        // Step 3: Upload to MinIO in background
        const { objectName, fileHash } = await uploadFileToMinio(
          file,
          currentOrg || 'organizations',
        );

        // Early return if component unmounted
        if (!isMounted.current) {
          // Clean up the preview URL before returning
          if (filePreviewUrls[tempId]) {
            try {
              URL.revokeObjectURL(filePreviewUrls[tempId]);
            } catch (error) {
              console.debug('Error revoking URL:', error);
            }
          }
          return;
        }

        // Step 4: Update attachments with real objectName while keeping preview visible
        setPostFormState((prev) => ({
          ...prev,
          attachments: prev.attachments.map((a) =>
            a.objectName === tempId
              ? {
                  objectName, // Replace with real objectName
                  mimeType: file.type,
                  fileHash,
                  isUploading: false,
                }
              : a,
          ),
        }));

        // Update preview URLs map with final objectName
        setFilePreviewUrls((prev) => {
          const newUrls = { ...prev };
          // Copy the preview URL to the new objectName key
          newUrls[objectName] = prev[tempId];
          // Delete the temporary entry
          delete newUrls[tempId];
          return newUrls;
        });
      } catch (error) {
        console.error('Video upload error:', error);
        if (isMounted.current) {
          toast.error('Failed to upload video');

          // Use the specific tempId that was created for this upload
          if (tempId) {
            // Clean up post form state - remove the specific attachment with this tempId
            setPostFormState((prev) => {
              // Only update if there are attachments to remove
              if (prev.attachments.length === 0) return prev;

              return {
                ...prev,
                attachments: prev.attachments.filter(
                  (a) => a.objectName !== tempId,
                ),
              };
            });

            // Revoke object URL to prevent memory leaks
            if (filePreviewUrls[tempId]) {
              if (filePreviewUrls[tempId]) {
                try {
                  URL.revokeObjectURL(filePreviewUrls[tempId]);
                } catch (error) {
                  console.debug('Error revoking URL:', error);
                }

                // Continue with state update after try/catch
                setFilePreviewUrls((prev) => {
                  const newUrls = { ...prev };
                  delete newUrls[tempId];
                  return newUrls;
                });
              }
            }
          }
        }
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

    // Prevent submission if uploads are still in progress
    if (postFormState.attachments.some((a) => a.isUploading)) {
      toast.warn('Please wait for all uploads to complete');
      return;
    }

    try {
      const { data } = await updatePostMutation({
        variables: {
          input: {
            id: post.id,
            caption: postFormState.caption.trim(),
            // Filter out client-side properties that shouldn't be sent to server
            attachments: postFormState.attachments.map(
              ({ objectName, mimeType, fileHash }) => ({
                objectName,
                mimeType,
                fileHash,
              }),
            ),
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

  // Ensure we clean up when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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
                  src={sanitizeUrl(videoPresignedUrl) || ''}
                  type={videoAttachment?.mimeType || ''}
                />
              </video>
            ) : imageAttachment ? (
              <img
                className={styles.postimageOrgPostCard}
                // Remove variant="top" - this is a bootstrap Card.Img prop not for regular img
                src={sanitizeUrl(imagePresignedUrl) || AboutImg}
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
                {sanitizeText(post.caption)}
              </Card.Title>
              <Card.Text className={styles.textOrgPostCard}>
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        {modalVisible && (
          <div data-testid="post-modal">
            <div className={styles.modalContentOrgPostCard}>
              <div className={styles.modalImage}>
                {videoAttachment ? (
                  <video controls autoPlay loop muted>
                    <source
                      src={sanitizeUrl(videoPresignedUrl) || ''}
                      type={videoAttachment.mimeType}
                    />
                  </video>
                ) : (
                  <img
                    // Remove direct use of imageAttachment?.objectName which could be exploited for XSS
                    src={sanitizeUrl(imagePresignedUrl) || AboutImg}
                    alt="Post content"
                  />
                )}
              </div>

              <div className={styles.modalInfo}>
                <div className={styles.infodiv}>
                  <p>{sanitizeText(post.caption)}</p>
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
                        sanitizeText(userData?.user?.name) || 'Unknown'
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
                <li onClick={toggleShowEditModal} data-testid="edit-option">
                  {tCommon('edit')}
                </li>
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
                    <div
                      key={index}
                      className={styles.previewOrgPostCard}
                      data-testid="media-preview-image"
                    >
                      <img
                        src={
                          sanitizeUrl(
                            filePreviewUrls[attachment.objectName] ||
                              previewUrls[attachment.objectName],
                          ) || ''
                        }
                        alt="Preview"
                      />
                      {attachment.isUploading && (
                        <div className="upload-indicator">Uploading...</div>
                      )}
                      <button
                        type="button"
                        className={styles.closeButtonP}
                        onClick={() => {
                          // Add safety check here
                          if (filePreviewUrls[attachment.objectName]) {
                            try {
                              URL.revokeObjectURL(
                                filePreviewUrls[attachment.objectName],
                              );
                            } catch (error) {
                              console.debug('Error revoking URL:', error);
                            }
                            // Rest of your code...
                          }
                          clearImage(attachment.objectName);
                        }}
                        disabled={attachment.isUploading}
                        data-testid="remove-media-button" // Changed from "remove-image-button"
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
                      <video controls data-testid="media-preview-video">
                        <source
                          src={
                            sanitizeUrl(
                              filePreviewUrls[attachment.objectName] ||
                                previewUrls[attachment.objectName] ||
                                '',
                            ) || ''
                          }
                          type={attachment.mimeType}
                        />
                      </video>
                      {/* Move fallback text outside the video tag */}
                      {t('videoNotSupported')}
                      {attachment.isUploading && (
                        <div className="upload-indicator">Uploading...</div>
                      )}
                      <button
                        type="button"
                        className={styles.closeButtonP}
                        onClick={() => {
                          if (filePreviewUrls[attachment.objectName]) {
                            try {
                              URL.revokeObjectURL(
                                filePreviewUrls[attachment.objectName],
                              );
                            } catch (error) {
                              console.debug('Error revoking URL:', error);
                            }

                            // Continue with state update after try/catch
                            setFilePreviewUrls((prev) => {
                              const newUrls = { ...prev };
                              delete newUrls[attachment.objectName];
                              return newUrls;
                            });
                          }
                          clearVideo(attachment.objectName);
                        }}
                        disabled={attachment.isUploading}
                        data-testid="remove-media-button" // Changed from "remove-image-button"
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
                disabled={postFormState.attachments.some((a) => a.isUploading)}
              >
                {postFormState.attachments.some((a) => a.isUploading)
                  ? tCommon('uploading') + '...'
                  : tCommon('save')}
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
