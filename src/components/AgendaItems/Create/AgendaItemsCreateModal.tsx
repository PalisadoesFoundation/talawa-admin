/**
 * AgendaItemsCreateModal Component
 *
 * This component renders a modal for creating agenda items. It includes
 * form fields for entering details such as title, duration, description,
 * categories, URLs, and attachments. The modal also provides functionality
 * for validating URLs, managing attachments, and submitting the form.
 *
 * @component
 * @param {InterfaceAgendaItemsCreateModalProps} props - The props for the component.
 * @param {boolean} props.agendaItemCreateModalIsOpen - Determines if the modal is open.
 * @param {() => void} props.hideCreateModal - Function to close the modal.
 * @param {object} props.formState - The current state of the form.
 * @param {React.Dispatch<React.SetStateAction<object>>} props.setFormState - Function to update the form state.
 * @param {() => void} props.createAgendaItemHandler - Function to handle form submission.
 * @param {(key: string) => string} props.t - Translation function for localization.
 * @param {InterfaceAgendaItemCategoryInfo[]} props.agendaItemCategories - List of available agenda item categories.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @remarks
 * - The component uses `react-bootstrap` for modal and form styling.
 * - `@mui/material` is used for the Autocomplete component.
 * - Attachments are converted to base64 format before being added to the form state.
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
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { Autocomplete, TextField } from '@mui/material';

import { FaLink, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from '../../../style/app-fixed.module.css';
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import { validateFile } from 'utils/fileValidation';
import type { InterfaceAgendaItemsCreateModalProps } from 'types/Agenda/interface';
import { useParams } from 'react-router-dom';

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
  const { orgId: currentOrg } = useParams();
  const [newUrl, setNewUrl] = useState('');
  // MinIO hooks must be called inside component
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();

  // State to keep files for upload and local preview URLs
  const [filesForUpload, setFilesForUpload] = useState<File[]>([]);
  const [localPreviews, setLocalPreviews] = useState<
    { url: string; file: File }[]
  >([]);

  useEffect(() => {
    // Ensure URLs and attachments do not have empty or invalid entries
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter((att) => att !== ''),
    }));
  }, []);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      localPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      toast.error(t('invalidUrl'));
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
   * Handles file selection and creates local previews.
   *
   * @param e - File input change event.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);

      // Validate files and accumulate total size (include already queued files)
      let totalSize = filesForUpload.reduce((sum, f) => sum + f.size, 0);
      const validFiles: File[] = [];
      const newPreviews: { url: string; file: File }[] = [];

      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          toast.error(validation.errorMessage);
          continue;
        }

        totalSize += file.size;
        if (totalSize > 15 * 1024 * 1024) {
          toast.error(t('fileSizeExceedsLimit'));
          return;
        }

        validFiles.push(file);
        // Create local preview URL
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push({ url: previewUrl, file });
      }

      if (validFiles.length > 0) {
        setFilesForUpload((prev) => [...prev, ...validFiles]);
        setLocalPreviews((prev) => [...prev, ...newPreviews]);
      }
    }
  };

  /**
   * Handles removing an attachment from preview and upload queue.
   *
   * @param previewUrl - Preview URL to remove.
   */
  const handleRemoveAttachment = (previewUrl: string): void => {
    // Revoke the object URL
    URL.revokeObjectURL(previewUrl);

    // Remove from previews
    const previewToRemove = localPreviews.find(
      (preview) => preview.url === previewUrl,
    );
    setLocalPreviews((prev) =>
      prev.filter((preview) => preview.url !== previewUrl),
    );

    // Remove from upload queue
    if (previewToRemove) {
      setFilesForUpload((prev) =>
        prev.filter((file) => file !== previewToRemove.file),
      );
    }
  };

  /**
   * Modified form submission handler that uploads files before creating agenda item
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      // Upload all queued files
      if (filesForUpload.length > 0) {
        const results = await Promise.allSettled(
          filesForUpload.map(async (file) => {
            const { objectName } = await uploadFileToMinio(file, currentOrg!);
            const presignedUrl = await getFileFromMinio(
              objectName,
              currentOrg!,
            );
            return { objectName, presignedUrl };
          }),
        );

        const uploaded = results
          .filter(
            (
              r,
            ): r is PromiseFulfilledResult<{
              objectName: string;
              presignedUrl: string;
            }> => r.status === 'fulfilled',
          )
          .map((r) => r.value);

        const failed = results.filter((r) => r.status === 'rejected').length;

        if (uploaded.length) toast.success(t('mediaUploadSuccess') as string);
        if (failed) toast.error(t('mediaUploadPartialFailure') as string);

        // Update form state with uploaded attachments
        setFormState((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            ...uploaded.map((uf) => uf.objectName),
          ],
        }));

        // Clear the upload queue
        setFilesForUpload([]);
      }

      // Create a synthetic event that matches what createAgendaItemHandler expects
      // We need to cast the event to match the expected type
      const syntheticEvent = {
        ...e,
        target: e.target as HTMLFormElement,
      } as unknown as React.ChangeEvent<HTMLFormElement>;

      // Call the original create handler with the properly typed event
      await createAgendaItemHandler(syntheticEvent);
    } catch (error) {
      toast.error(t('mediaUploadError') as string);
      console.error('File upload error:', error);
    }
  };

  return (
    <Modal
      className={styles.AgendaItemsModal}
      show={agendaItemCreateModalIsOpen}
      onHide={hideCreateModal}
    >
      <Modal.Header>
        <p className={styles.titlemodalAgendaItems}>{t('agendaItemDetails')}</p>
        <Button
          variant="danger"
          onClick={hideCreateModal}
          data-testid="createAgendaItemModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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
          {localPreviews.length > 0 && (
            <div className={styles.previewFile} data-testid="mediaPreview">
              {localPreviews.map(({ url, file }, index) => (
                <div key={index} className={styles.attachmentPreview}>
                  {file.type.startsWith('video/') ? (
                    <video
                      muted
                      autoPlay={true}
                      loop={true}
                      playsInline
                      crossOrigin="anonymous"
                    >
                      <source src={url} type={file.type} />
                    </video>
                  ) : (
                    <img src={url} alt="Attachment preview" />
                  )}
                  <button
                    className={styles.closeButtonFile}
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveAttachment(url);
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
      </Modal.Body>
    </Modal>
  );
};

export default AgendaItemsCreateModal;
