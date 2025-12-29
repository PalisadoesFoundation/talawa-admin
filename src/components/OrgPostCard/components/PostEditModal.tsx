import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import { UPDATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import type {
  IPostEditModalProps,
  InterfacePostFormState,
} from 'types/Post/interface';

export default function PostEditModal({
  show,
  onHide,
  post,
  onSuccess,
}: IPostEditModalProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgPostCard' });
  const [updatePostMutation] = useMutation(UPDATE_POST_MUTATION);

  const [postFormState, setPostFormState] = useState<InterfacePostFormState>({
    caption: post.caption ?? '',
    attachments: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPostFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (
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

  const clearAttachment = (url: string): void => {
    setPostFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.url !== url),
    }));
  };

  /**
   * Validate and sanitize data URL to prevent XSS attacks
   * Only allows valid base64 encoded data URLs
   * @param url - URL string to validate
   * @param expectedMimeType - Expected MIME type prefix (e.g., 'image/' or 'video/')
   * @returns Original URL if valid, otherwise empty string
   */
  const sanitizeDataUrl = (url: string, expectedMimeType: string): string => {
    // Validate data URL format
    const dataUrlPattern = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9.+-]+);base64,/;
    const match = url.match(dataUrlPattern);

    if (!match) {
      return '';
    }

    // Validate MIME type matches expected
    const mimeType = match[1];
    if (!mimeType.startsWith(expectedMimeType)) {
      return '';
    }

    return url;
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

  const getMimeTypeEnum = (mimeType: string): string => {
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'IMAGE_JPEG',
      'image/jpg': 'IMAGE_JPEG',
      'image/png': 'IMAGE_PNG',
      'image/webp': 'IMAGE_WEBP',
      'image/avif': 'IMAGE_AVIF',
      'video/mp4': 'VIDEO_MP4',
      'video/webm': 'VIDEO_WEBM',
    };
    return mimeMap[mimeType.toLowerCase()] || 'IMAGE_JPEG';
  };

  const updatePost = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    let attachment = null;
    if (postFormState.attachments.length > 0) {
      const mimeType = postFormState.attachments[0].mimeType;
      const extension = mimeType.split('/')[1] || 'bin';
      const fileName = `post-attachment-${Date.now()}.${extension}`;
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
        // Call onSuccess callback to notify parent component to refresh data
        onSuccess?.();
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

      <Form onSubmit={updatePost} data-testid="update-post-form">
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
              onChange={handleFileUpload}
              className={styles.inputField}
              data-cy="image-upload-input"
            />
            {postFormState.attachments
              .filter((a) => a.mimeType.startsWith('image/'))
              .map((attachment, index) => (
                <div key={index} className={styles.previewOrgPostCard}>
                  <img
                    src={sanitizeDataUrl(attachment.url, 'image/')}
                    alt="Preview"
                  />
                  <button
                    type="button"
                    className={styles.closeButtonP}
                    onClick={() => clearAttachment(attachment.url)}
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
              onChange={handleFileUpload}
              className={styles.inputField}
              data-testid="video-upload"
            />

            {postFormState.attachments
              .filter((a) => a.mimeType.startsWith('video/'))
              .map((attachment, index) => (
                <div key={index} className={styles.previewOrgPostCard}>
                  {/*
                    Note: Current upload flow does not support caption file uploads, so video preview does not include <track> element.
                    If captions are supported in the future, add: <track kind="captions" src={captionsUrl} srcLang="en" label="English" default />
                  */}
                  <video
                    controls
                    data-testid="video-preview"
                    aria-label="Video preview - captions not available for uploaded videos"
                  >
                    <source
                      src={sanitizeDataUrl(attachment.url, 'video/')}
                      type={attachment.mimeType}
                    />
                    {t('videoNotSupported')}
                  </video>
                  {/* Accessibility notice for screen reader users */}
                  <span className="visually-hidden">
                    Note: Captions are not available for this video preview.
                  </span>
                  <button
                    type="button"
                    className={styles.closeButtonP}
                    onClick={() => clearAttachment(attachment.url)}
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
