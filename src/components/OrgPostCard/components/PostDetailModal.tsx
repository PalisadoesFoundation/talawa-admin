import { useMutation, useQuery } from '@apollo/client';
import { Close, MoreVert } from '@mui/icons-material';
import React from 'react';
import { Button, Card, Dropdown, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AboutImg from 'assets/images/defaultImg.png';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import { TOGGLE_PINNED_POST } from 'GraphQl/Mutations/mutations';
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

interface IPostDetailModalProps {
  show: boolean;
  onHide: () => void;
  post: InterfacePost;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostDetailModal({
  show,
  onHide,
  post,
  onEdit,
  onDelete,
}: IPostDetailModalProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgPostCard' });
  const { t: tCommon } = useTranslation('common');

  const [togglePinMutation] = useMutation(TOGGLE_PINNED_POST);
  const isPinned = !!post.pinnedAt;

  const imageAttachment = post.attachments.find((a) =>
    a.mimeType.startsWith('image/'),
  );
  const videoAttachment = post.attachments.find((a) =>
    a.mimeType.startsWith('video/'),
  );

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
                    <span className="text-muted">{tCommon(' loading ')}</span>
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
