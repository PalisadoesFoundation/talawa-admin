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
import type { InterfaceAgendaItemsUpdateModalProps } from 'types/Agenda/interface';

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
  const [_previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { uploadFileToMinio } = useMinioUpload();

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter((att) => att !== ''),
    }));
  }, [setFormState]);

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
      const newPreviewUrls: string[] = [];

      for (const file of files) {
        try {
          const result = await uploadFileToMinio(file, 'agendaItem');
          if (result) {
            // Store the file metadata as JSON string for the mutation
            uploadedFiles.push(JSON.stringify(result));
            // Create local preview URL
            newPreviewUrls.push(URL.createObjectURL(file));
          }
        } catch {
          NotificationToast.error(t('fileUploadError'));
        }
      }

      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
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
                data-testid="deleteUrl"
                className={styles.deleteButtonAgendaItems}
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

        {formState.attachments && (
          <div className={styles.previewFile} data-testid="mediaPreview">
            {formState.attachments.map((attachment, index) => (
              <div key={index} className={styles.attachmentPreview}>
                {attachment.includes('video') ? (
                  <video
                    muted
                    autoPlay={true}
                    loop={true}
                    playsInline
                    crossOrigin="anonymous"
                  >
                    <source src={attachment} type="video/mp4" />
                  </video>
                ) : (
                  <img src={attachment} alt={t('attachmentPreview')} />
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
            ))}
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
