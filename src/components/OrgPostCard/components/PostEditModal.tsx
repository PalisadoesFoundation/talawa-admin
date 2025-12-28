import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import { UPDATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';

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

interface InterfacePostFormState {
  caption: string;
  attachments: { url: string; mimeType: string }[];
}

interface IPostEditModalProps {
  show: boolean;
  onHide: () => void;
  post: InterfacePost;
}

export default function PostEditModal({
  show,
  onHide,
  post,
}: IPostEditModalProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgPostCard' });
  const [updatePostMutation] = useMutation(UPDATE_POST_MUTATION);

  const [postFormState, setPostFormState] = useState<InterfacePostFormState>({
    caption: post.caption ?? 'Untitled',
    attachments: [],
  });

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
        onHide();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      centered
      backdropClassName="bg-dark"
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>{t('editPost')}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={updatePost} role="form" data-testid="update-post-form">
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
                    <source src={attachment.url} type={attachment.mimeType} />
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
          <Button variant="secondary" onClick={onHide}>
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
  );
}
