/**
// translation-check-keyPrefix: agendaItems
 * AgendaItemsUpdateModal Component
 *
 * This component renders a modal for updating agenda items. It provides
 * functionality to edit agenda item details such as title, duration,
 * description, categories, URLs, and attachments. The modal also includes
 * validation for URLs and file size limits for attachments.
 *
 * @param props - The props for the component (see InterfaceAgendaItemsUpdateModalProps)
 *
 * @remarks
 * - The component uses `react-bootstrap` for form elements.
 * - `@mui/material` is used for the Autocomplete component.
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
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Autocomplete, TextField } from '@mui/material';
import { FaLink, FaTrash } from 'react-icons/fa';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useMinioUpload } from 'utils/MinioUpload';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from '../../../style/app-fixed.module.css';
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
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { uploadFileToMinio } = useMinioUpload();

  /**
   * Validates that a URL is a safe blob URL created by URL.createObjectURL.
   * This ensures only browser-generated blob URLs are used in src attributes.
   *
   * @param url - URL string to validate.
   * @returns True if the URL is a valid blob URL, false otherwise.
   */
  const isSafeBlobUrl = (url: string): boolean => {
    return url.startsWith('blob:');
  };

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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
            // Add mimeType and name to the metadata before storing
            const metadata = {
              ...result,
              mimeType: file.type,
              name: file.name,
            };
            // Store the file metadata as JSON string for the mutation
            uploadedFiles.push(JSON.stringify(metadata));
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
   * @param index - Index of the attachment to remove.
   */
  const handleRemoveAttachment = (index: number): void => {
    // Revoke the object URL to prevent memory leaks
    const urlToRevoke = previewUrls[index];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }

    // Remove from previewUrls
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // Remove from formState.attachments
    setFormState((prevState) => ({
      ...prevState,
      attachments: prevState.attachments.filter((_, i) => i !== index),
    }));
  };

  return (
    <BaseModal
      className={styles.AgendaItemModal}
      show={agendaItemUpdateModalIsOpen}
      onHide={hideUpdateModal}
      headerContent={
        <p className={styles.titlemodalAgendaItems}>{t('updateAgendaItem')}</p>
      }
    >
      <Form onSubmit={updateAgendaItemHandler}>
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
                data-testid="deleteUrl"
                className={styles.deleteButtonAgendaItems}
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
            {previewUrls.map((previewUrl, index) => {
              // Parse the corresponding attachment metadata to get mime type
              const attachmentMeta = formState.attachments[index];
              let isVideo = false;
              try {
                const meta = JSON.parse(attachmentMeta);
                isVideo = meta.mimeType?.startsWith('video/');
              } catch {
                // If parsing fails, default to image
              }
              return (
                <div key={index} className={styles.attachmentPreview}>
                  {isSafeBlobUrl(previewUrl) && (
                    <>
                      {isVideo ? (
                        <video
                          muted
                          autoPlay={true}
                          loop={true}
                          playsInline
                          crossOrigin="anonymous"
                        >
                          <source src={previewUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={previewUrl} alt={t('attachmentPreview')} />
                      )}
                    </>
                  )}
                  <button
                    type="button"
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
      </Form>
    </BaseModal>
  );
};

export default AgendaItemsUpdateModal;
