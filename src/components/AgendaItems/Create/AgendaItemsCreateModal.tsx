/**
// translation-check-keyPrefix: agendaItems
 * AgendaItemsCreateModal Component
 *
 * This component renders a modal for creating agenda items. It includes
 * form fields for entering details such as title, duration, description,
 * categories, URLs, and attachments. The modal also provides functionality
 * for validating URLs, managing attachments, and submitting the form.
 *
 * @param props - The props for the component (see InterfaceAgendaItemsCreateModalProps)
 *
 * @returns The rendered modal component.
 *
 * @remarks
 * - The component uses `react-bootstrap` for form styling.
 * - `@mui/material` is used for the Autocomplete component.
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
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Autocomplete, TextField } from '@mui/material';

import { FaLink, FaTrash } from 'react-icons/fa';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import styles from './AgendaItemsCreateModal.module.css';
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
import { useMinioUpload } from 'utils/MinioUpload';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { InterfaceAgendaItemsCreateModalProps } from 'types/Agenda/interface';
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
  const { uploadFileToMinio } = useMinioUpload();

  useEffect(() => {
    // Ensure URLs and attachments do not have empty or invalid entries
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter((att) => att.trim() !== ''),
    }));
  }, [setFormState]);

  // Cleanup effect to revoke object URLs when component unmounts or previewUrls change
  useEffect(() => {
    return () => {
      previewUrls.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previewUrls]);

  /**
   * Validates if a given URL is in a correct format.
   *
   * @param url - URL string to validate.
   * @returns True if the URL is valid, false otherwise.
   */
  const isValidUrl = (url: string): boolean => {
    // Regular expression for basic URL validation
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  /**
   * Handles adding a new URL to the form state.
   *
   * Checks if the URL is valid before adding it.
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
   * @param url - URL to remove.
   */
  const handleRemoveUrl = (url: string): void => {
    setFormState({
      ...formState,
      urls: formState.urls.filter((item) => item !== url),
    });
  };

  /**
   * Handles file selection and uploads files to MinIO before updating the form state.
   *
   * @param e - File input change event.
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
      const newPreviewUrls: { url: string; mimeType: string }[] = [];

      for (const file of files) {
        try {
          const result = await uploadFileToMinio(file, 'agendaItem');
          if (result) {
            // Store the file metadata as JSON string for the mutation
            uploadedFiles.push(JSON.stringify(result));
            // Create local preview URL with MIME type for proper rendering
            newPreviewUrls.push({
              url: URL.createObjectURL(file),
              mimeType: file.type,
            });
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
   * Handles removing an attachment from the form state and preview URLs.
   *
   * @param index - Index of the attachment to remove.
   */
  const handleRemoveAttachment = (index: number): void => {
    // Revoke the object URL to prevent memory leak
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index].url);
    }
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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
      <Form onSubmit={createAgendaItemHandler}>
        <Form.Group className="d-flex mb-3 w-100">
          <Autocomplete
            multiple
            className={`${styles.noOutline} w-100`}
            limitTags={2}
            data-testid="categorySelect"
            options={agendaItemCategories || []}
            value={
              agendaItemCategories?.filter((category) =>
                formState.agendaItemCategoryIds.includes(category._id),
              ) || []
            }
            filterSelectedOptions={true}
            getOptionLabel={(
              category: InterfaceAgendaItemCategoryInfo,
            ): string => category.name}
            onChange={(_, newCategories): void => {
              setFormState({
                ...formState,
                agendaItemCategoryIds: newCategories.map(
                  (category) => category._id,
                ),
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('category')} />
            )}
          />
        </Form.Group>
        <Row className="mb-3">
          <Col>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>{t('title')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enterTitle')}
                value={formState.title}
                required
                onChange={(e) =>
                  setFormState({ ...formState, title: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="duration">
              <Form.Label>{t('duration')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enterDuration')}
                value={formState.duration}
                required
                onChange={(e) =>
                  setFormState({ ...formState, duration: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>{t('description')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={1}
            placeholder={t('enterDescription')}
            value={formState.description}
            required
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('url')}</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="text"
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
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('attachments')}</Form.Label>
          <Form.Control
            accept="image/*, video/*"
            data-testid="attachment"
            name="attachment"
            type="file"
            id="attachment"
            multiple={true}
            onChange={handleFileChange}
          />
          <Form.Text>{t('attachmentLimit')}</Form.Text>
        </Form.Group>
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
      </Form>
    </BaseModal>
  );
};

export default AgendaItemsCreateModal;
