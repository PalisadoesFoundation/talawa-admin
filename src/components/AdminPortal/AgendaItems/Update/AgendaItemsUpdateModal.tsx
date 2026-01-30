/**
// translation-check-keyPrefix: agendaItems
 * AgendaItemsUpdateModal Component
 *
 * This component renders a modal for updating agenda items. It provides
 * functionality to edit agenda item details such as title, duration,
 * description, categories, URLs, and attachments. The modal also includes
 * validation for URLs and file size limits for attachments.
 *
 * See InterfaceAgendaItemsUpdateModalProps for props documentation.
 *
 * @remarks
 * - File attachments are uploaded via MinIO presigned URLs.
 * - URLs are validated using a regular expression.
 *
 * @example
 * ```tsx
 * <AgendaItemsUpdateModal
 *   agendaItemUpdateModalIsOpen={true}
 *   hideUpdateModal={closeModal}
 *   formState={formState}
 *   setFormState={setFormState}
 *   updateAgendaItemHandler={handleUpdate}
 *   t={t}
 *   agendaItemCategories={categories}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'shared-components/Button/Button';
import {
  FormTextField,
  FormSelectField,
  FormFieldGroup,
} from 'shared-components/FormFieldGroup/FormFieldGroup';
import { FaLink, FaTrash } from 'react-icons/fa';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useMinioUpload } from 'utils/MinioUpload';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './AgendaItemsUpdateModal.module.css';
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
import type { InterfaceAgendaItemsUpdateModalProps } from 'types/AdminPortal/Agenda/interface';

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

const AgendaItemsUpdateModal: React.FC<
  InterfaceAgendaItemsUpdateModalProps
> = ({
  agendaItemUpdateModalIsOpen,
  hideUpdateModal,
  formState,
  setFormState,
  updateAgendaItemHandler,
  t,
  agendaItemCategories,
}) => {
  const [newUrl, setNewUrl] = useState('');
  const { uploadFileToMinio } = useMinioUpload();

  // Filter empty URLs and attachments on mount only
  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter((att) => att !== ''),
    }));
  }, []);

  /**
   * Validates if a given URL is in a correct format.
   *
   * @param url - The URL to validate.
   * @returns True if the URL is valid, false otherwise.
   */
  const isValidUrl = (url: string): boolean => {
    // Regular expression for basic URL validation
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  /**
   * Handles adding a new URL to the form state.
   * Displays an error toast if the URL is invalid.
   */
  const handleAddUrl = (): void => {
    if (newUrl.trim() !== '' && isValidUrl(newUrl.trim())) {
      setFormState({
        ...formState,
        urls: [...formState.urls.filter((url) => url.trim() !== ''), newUrl],
      });
      setNewUrl('');
    } else {
      NotificationToast.error(t('invalidUrl'));
    }
  };

  /**
   * Handles removing a URL from the form state.
   *
   * @param url - The URL to remove.
   */
  const handleRemoveUrl = (url: string): void => {
    setFormState({
      ...formState,
      urls: formState.urls.filter((item) => item !== url),
    });
  };

  /**
   * Handles file input change event.
   * Uploads selected files to MinIO and updates the form state.
   * Displays an error toast if the total file size exceeds the limit.
   *
   * @param e - The change event for file input.
   */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);

      // Check attachment count limit
      const remainingSlots = MAX_ATTACHMENTS - formState.attachments.length;
      if (files.length > remainingSlots) {
        NotificationToast.error(t('tooManyAttachments'));
        return;
      }

      // Validate file types
      const invalidTypeFiles = files.filter(
        (file) => !ALLOWED_TYPES.includes(file.type),
      );
      if (invalidTypeFiles.length > 0) {
        invalidTypeFiles.forEach((file) => {
          NotificationToast.error(`${file.name}: ${t('invalidFileType')}`);
        });
        return;
      }

      // Check total file size
      let totalSize = 0;
      files.forEach((file) => {
        totalSize += file.size;
      });
      if (totalSize > 10 * 1024 * 1024) {
        NotificationToast.error(t('fileSizeExceedsLimit'));
        return;
      }

      // Upload files to MinIO and store file metadata
      const uploadedFiles: string[] = [];

      for (const file of files) {
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
          NotificationToast.error(t('fileUploadError'));
        }
      }

      setFormState((prevState) => ({
        ...prevState,
        attachments: [...prevState.attachments, ...uploadedFiles],
      }));
    }
  };

  /**
   * Handles removing an attachment from the form state.
   *
   * @param attachment - The attachment to remove.
   */
  const handleRemoveAttachment = (attachment: string): void => {
    setFormState((prevState) => ({
      ...prevState,
      attachments: prevState.attachments.filter((item) => item !== attachment),
    }));
  };

  return (
    <BaseModal
      className={styles.AgendaItemModal}
      show={agendaItemUpdateModalIsOpen}
      onHide={hideUpdateModal}
      title={t('updateAgendaItem')}
      headerClassName={styles.modalHeader}
      showCloseButton={true}
      dataTestId="updateAgendaItemModal"
    >
      <form onSubmit={updateAgendaItemHandler}>
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
            id="description"
            className="form-control"
            rows={1}
            placeholder={t('enterDescription')}
            value={formState.description}
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
              id="url"
              data-testid="urlInput"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <Button type="button" onClick={handleAddUrl} data-testid="linkBtn">
              {t('link')}
            </Button>
          </div>

          <ul className="list-unstyled">
            {formState.urls.map((url, index) => (
              <li key={index} className={styles.urlListItem}>
                <FaLink className={styles.urlIcon} />
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url.length > 50 ? url.substring(0, 50) + '...' : url}
                </a>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  data-testid="deleteUrl"
                  className={styles.deleteButtonAgendaItems}
                  onClick={() => handleRemoveUrl(url)}
                >
                  <FaTrash />
                </Button>
              </li>
            ))}
          </ul>
        </FormFieldGroup>

        <FormFieldGroup
          name="attachments"
          label={t('attachments')}
          helpText={t('attachmentLimit')}
        >
          <input
            accept="image/*, video/*"
            data-testid="attachment"
            name="attachments"
            type="file"
            id="attachments"
            multiple={true}
            onChange={handleFileChange}
            className="form-control"
          />
        </FormFieldGroup>

        {formState.attachments && (
          <div className={styles.previewFile} data-testid="mediaPreview">
            {formState.attachments.map((attachment, index) => {
              // Try to parse MinIO metadata JSON, fallback to treating as URL
              let previewUrl = attachment;
              let isVideo = false;
              let mimeType = '';
              let fileName = '';

              try {
                const parsed = JSON.parse(attachment);
                if (parsed && parsed.objectName) {
                  // MinIO metadata - use name for extension detection
                  // Accept both mimeType and legacy mimetype for backward compatibility
                  mimeType = parsed.mimeType || parsed.mimetype || '';
                  fileName = parsed.name || 'Attachment';
                  isVideo = mimeType.startsWith('video/');
                  // For MinIO attachments, we can't preview directly without signed URL
                  // Show a placeholder with filename instead
                  previewUrl = '';
                }
              } catch {
                // Not JSON, treat as regular URL
                isVideo =
                  attachment.includes('video') ||
                  attachment.includes('.mp4') ||
                  attachment.includes('.webm');
                previewUrl = attachment;
              }

              return (
                <div key={index} className={styles.attachmentPreview}>
                  {isVideo && previewUrl ? (
                    <video
                      muted
                      autoPlay={true}
                      loop={true}
                      playsInline
                      crossOrigin="anonymous"
                    >
                      <source src={previewUrl} type={mimeType || 'video/mp4'} />
                    </video>
                  ) : previewUrl ? (
                    <img src={previewUrl} alt={t('attachmentPreview')} />
                  ) : (
                    <div className={styles.attachmentPlaceholder}>
                      <i className="fa fa-file" />
                      {fileName && (
                        <span className={styles.fileName}>{fileName}</span>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label={t('deleteAttachment')}
                    className={styles.closeButtonFile}
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveAttachment(attachment);
                    }}
                    data-testid="deleteAttachment"
                  >
                    <i className="fa fa-times" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <Button
          type="submit"
          className={styles.greenregbtnAgendaItems}
          data-testid="updateAgendaItemBtn"
        >
          {t('update')}
        </Button>
      </form>
    </BaseModal>
  );
};

export default AgendaItemsUpdateModal;
