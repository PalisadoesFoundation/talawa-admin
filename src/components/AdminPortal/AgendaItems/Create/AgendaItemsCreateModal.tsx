/**
// translation-check-keyPrefix: agendaItems
 * AgendaItemsCreateModal Component
 *
 * This component renders a modal for creating agenda items. It includes
 * form fields for entering details such as title, duration, description,
 * categories, URLs, and attachments. The modal also provides functionality
 * for validating URLs, managing attachments, and submitting the form.
 *
 * See InterfaceAgendaItemsCreateModalProps for props documentation.
 *
 * @returns The rendered modal component.
 *
 * @remarks
 * - The component uses `react-bootstrap` for form styling.
 * - Attachments are uploaded via MinIO presigned URLs.
 * - URLs are validated using a regular expression before being added.
 *
 * @example
 * ```tsx
 * <AgendaItemsCreateModal
 *   agendaItemCreateModalIsOpen={true}
 *   hideCreateModal={handleClose}
 *   formState={formState}
 *   setFormState={setFormState}
 *   createAgendaItemHandler={handleSubmit}
 *   t={translate}
 *   agendaItemCategories={categories}
 * />
 * ```
 */
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'shared-components/Button/Button';
import {
  FormTextField,
  FormSelectField,
  FormFieldGroup,
} from 'shared-components/FormFieldGroup/FormFieldGroup';

import { FaLink, FaTrash } from 'react-icons/fa';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import styles from './AgendaItemsCreateModal.module.css';
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
import { useMinioUpload } from 'utils/MinioUpload';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { InterfaceAgendaItemsCreateModalProps } from 'types/AdminPortal/Agenda/interface';

// Constants for attachment validation
const MAX_ATTACHMENTS = 10;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];
// translation-check-keyPrefix: agendaItems
const AgendaItemsCreateModal: React.FC<
  InterfaceAgendaItemsCreateModalProps
> = ({
  agendaItemCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createAgendaItemHandler,
  t,
  agendaItemCategories,
}) => {
  const [newUrl, setNewUrl] = useState('');
  const [previewUrls, setPreviewUrls] = useState<
    { url: string; mimeType: string }[]
  >([]);
  // Ref to track blob URLs for cleanup to avoid stale closure issues
  const previewUrlsRef = useRef<{ url: string; mimeType: string }[]>([]);

  const { uploadFileToMinio } = useMinioUpload();

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter(
        (attachment) => attachment !== '',
      ),
    }));
  }, []);

  useEffect(() => {
    const generatePreviews = async () => {
      const urls = await Promise.all(
        formState.attachments.map(async (attachment) => {
          // Attachments are strings - either URLs or JSON metadata
          try {
            // Try to parse as JSON (for new MinIO uploads)
            const parsed = JSON.parse(attachment);
            // If it's a MinIO object, create a URL from object name
            if (parsed.objectName) {
              return { url: attachment, mimeType: 'image/*' };
            }
          } catch {
            // Not JSON, treat as a URL
          }
          try {
            const response = await fetch(attachment, {
              method: 'HEAD',
              mode: 'cors',
            });
            const mimeType = response.headers.get('content-type') || '';
            return { url: attachment, mimeType };
          } catch {
            const ext = attachment.split('.').pop()?.toLowerCase() || '';
            const mimeType = ext.startsWith('mp') ? `video/${ext}` : 'image/*';
            return { url: attachment, mimeType };
          }
        }),
      );
      setPreviewUrls(urls);
      previewUrlsRef.current = urls;
    };
    generatePreviews();
    return () => {
      // Use ref to access current preview URLs for cleanup
      previewUrlsRef.current.forEach((preview) => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [formState.attachments]);

  const handleAddUrl = (): void => {
    // URL regex requires protocol (ftp, http, https) - matches UpdateModal pattern
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (newUrl.trim() !== '' && urlPattern.test(newUrl.trim())) {
      setFormState({ ...formState, urls: [...formState.urls, newUrl.trim()] });
      setNewUrl('');
    } else {
      NotificationToast.error(t('invalidUrl'));
    }
  };

  const handleRemoveUrl = (url: string): void => {
    setFormState({
      ...formState,
      urls: formState.urls.filter((u) => u !== url),
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = event.target.files;
    /* istanbul ignore else -- @preserve */
    if (files) {
      const fileArray = Array.from(files);

      // Check attachment count limit
      const remainingSlots = MAX_ATTACHMENTS - formState.attachments.length;
      if (fileArray.length > remainingSlots) {
        NotificationToast.error(t('tooManyAttachments'));
        return;
      }

      // Validate file types and sizes
      const validFiles = fileArray.filter((file) => {
        // Check MIME type
        if (!ALLOWED_TYPES.includes(file.type)) {
          NotificationToast.error(`${file.name}: ${t('invalidFileType')}`);
          return false;
        }
        // Check file size
        if (file.size > 10 * 1024 * 1024) {
          NotificationToast.error(`${file.name} ${t('fileSizeExceedsLimit')}`);
          return false;
        }
        return true;
      });

      // Upload files to MinIO and store file metadata
      const uploadedFiles: string[] = [];

      for (const file of validFiles) {
        try {
          const result = await uploadFileToMinio(file, 'agendaItem');
          if (result) {
            // Enrich with mimeType and name from File object
            const metadata = {
              ...result,
              mimeType: file.type || 'application/octet-stream',
              name: file.name,
            };
            uploadedFiles.push(JSON.stringify(metadata));
          }
        } catch {
          NotificationToast.error(`${t('fileUploadError')}: ${file.name}`);
        }
      }

      setFormState((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles],
      }));
    }
  };

  const handleRemoveAttachment = (index: number): void => {
    setFormState((prevState) => ({
      ...prevState,
      attachments: prevState.attachments.filter((_, i) => i !== index),
    }));
  };

  return (
    <BaseModal
      className={styles.AgendaItemsModal}
      show={agendaItemCreateModalIsOpen}
      onHide={hideCreateModal}
      title={t('agendaItemDetails')}
      headerClassName={styles.modalHeader}
      showCloseButton={true}
      closeButtonVariant="danger"
      dataTestId="createAgendaItemModal"
    >
      <form onSubmit={createAgendaItemHandler}>
        <FormSelectField
          name="categorySelect"
          label={t('category')}
          value={formState.agendaItemCategoryIds[0] || ''}
          onChange={(value: string) => {
            setFormState({
              ...formState,
              agendaItemCategoryIds: value ? [value] : [],
            });
          }}
          data-testid="categorySelect"
        >
          <option value="">{t('selectCategory')}</option>
          {(agendaItemCategories || []).map(
            (category: InterfaceAgendaItemCategoryInfo) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ),
          )}
        </FormSelectField>

        <Row className="mb-3">
          <Col>
            <FormTextField
              name="title"
              label={t('title')}
              placeholder={t('enterTitle')}
              value={formState.title}
              onChange={(value: string) =>
                setFormState({ ...formState, title: value })
              }
              required
              data-testid="titleInput"
            />
          </Col>
          <Col>
            <FormTextField
              name="duration"
              label={t('duration')}
              placeholder={t('enterDuration')}
              value={formState.duration}
              onChange={(value: string) =>
                setFormState({ ...formState, duration: value })
              }
              required
              data-testid="durationInput"
            />
          </Col>
        </Row>

        <FormFieldGroup name="description" label={t('description')}>
          <textarea
            className="form-control"
            rows={1}
            placeholder={t('enterDescription')}
            value={formState.description}
            required
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
            data-testid="descriptionInput"
          />
        </FormFieldGroup>

        <FormFieldGroup name="url" label={t('url')}>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder={t('enterUrl')}
              id="basic-url"
              data-testid="urlInput"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <Button onClick={handleAddUrl} data-testid="linkBtn">
              {t('link')}
            </Button>
          </div>

          {formState.urls.map((url, index) => (
            <li key={index} className={styles.urlListItem}>
              <FaLink className={styles.urlIcon} />
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url.length > 50 ? url.substring(0, 50) + '...' : url}
              </a>
              <Button
                variant="danger"
                size="sm"
                className={styles.deleteButtonAgendaItems}
                data-testid="deleteUrl"
                onClick={() => handleRemoveUrl(url)}
              >
                <FaTrash />
              </Button>
            </li>
          ))}
        </FormFieldGroup>

        <FormFieldGroup
          name="attachments"
          label={t('attachments')}
          helpText={t('attachmentLimit')}
        >
          <input
            accept="image/*, video/*"
            data-testid="attachment"
            name="attachment"
            type="file"
            id="attachment"
            multiple={true}
            onChange={handleFileChange}
            className="form-control"
          />
        </FormFieldGroup>

        {previewUrls.length > 0 && (
          <div className={styles.previewFile} data-testid="mediaPreview">
            {previewUrls.map((preview, index) => (
              <div key={index} className={styles.attachmentPreview}>
                {preview.mimeType.startsWith('video/') ? (
                  <video
                    muted
                    autoPlay={true}
                    loop={true}
                    playsInline
                    crossOrigin="anonymous"
                  >
                    <source src={preview.url} type={preview.mimeType} />
                  </video>
                ) : (
                  <img src={preview.url} alt={t('attachmentPreview')} />
                )}
                <button
                  type="button"
                  aria-label={t('deleteAttachment')}
                  className={styles.closeButtonFile}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveAttachment(index);
                  }}
                  data-testid="deleteAttachment"
                >
                  <i className="fa fa-times" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          className={styles.greenregbtnAgendaItems}
          value="createAgendaItem"
          data-testid="createAgendaItemFormBtn"
        >
          {t('createAgendaItem')}
        </Button>
      </form>
    </BaseModal>
  );
};

export default AgendaItemsCreateModal;
