import { useMutation, useQuery } from '@apollo/client';
import { Close, MoreVert, PlayArrow } from '@mui/icons-material';
import React, { useState, useRef } from 'react';
import { Button, Card, Dropdown, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AboutImg from 'assets/images/defaultImg.png';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import { TOGGLE_PINNED_POST } from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import type { IPostDetailModalProps } from 'types/Post/interface';

export default function PostDetailModal({
  show,
  onHide,
  post,
  onEdit,
  onDelete,
}: IPostDetailModalProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgPostCard' });
  const { t: tCommon } = useTranslation('common');

  // Video playback control state
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [togglePinMutation] = useMutation(TOGGLE_PINNED_POST);
  const isPinned = !!post.pinnedAt;

  const imageAttachment = post.attachments.find((a) =>
    a.mimeType.startsWith('image/'),
  );
  const videoAttachment = post.attachments.find((a) =>
    a.mimeType.startsWith('video/'),
  );
  const captionAttachment = post.attachments.find(
    (a) => a.mimeType === 'text/vtt',
  );

  /**
   * Handle video play/pause toggle
   * Triggered when user clicks play button or video area
   */
  const handleVideoPlayPause = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {
          // If playback fails (e.g., browser policy restrictions), keep paused state
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  /**
   * Callback when video playback ends
   */
  const handleVideoEnded = (): void => {
    setIsPlaying(false);
  };

  const { data: userData, loading: userLoading } = useQuery(GET_USER_BY_ID, {
    variables: { input: { id: post.creatorId || '' } },
    skip: !post.creatorId,
  });

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
        onHide();
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

  return (
    <Modal
      show={show}
      onHide={onHide}
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
              <Dropdown.Item onClick={onEdit} data-cy="edit-option">
                {tCommon('edit')}
              </Dropdown.Item>
              <Dropdown.Item onClick={onDelete} data-testid="delete-option">
                {t('deletePost')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={togglePostPin}
                data-testid="pin-post-button"
              >
                {isPinned ? t('unpinPost') : t('pinPost')}
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
              onHide();
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
              <div
                style={{ position: 'relative' }}
                aria-label="Video player with controls"
              >
                <video
                  ref={videoRef}
                  controls
                  loop
                  muted
                  className="w-100"
                  style={{ borderRadius: '8px' }}
                  data-testid="post-video"
                  aria-label="Post video content"
                  onEnded={handleVideoEnded}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                >
                  <source
                    src={videoAttachment.name}
                    type={videoAttachment.mimeType}
                  />
                  {/* Caption track - uses corresponding .vtt file from attachment if available, otherwise provides empty track as fallback */}
                  {captionAttachment && (
                    <track
                      kind="captions"
                      src={captionAttachment.name}
                      srcLang="en"
                      label="English captions"
                      default
                    />
                  )}
                  Your browser does not support the video tag.
                </video>
                {/* Play/pause overlay button - provides visual hint and accessibility controls */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={handleVideoPlayPause}
                    data-testid="video-play-button"
                    aria-label="Play video"
                    aria-live="polite"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                    }}
                  >
                    <PlayArrow
                      style={{ color: 'white', fontSize: '32px' }}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
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
                    <span className="text-muted">{tCommon('loading')}</span>
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
  );
}
