/**
 * AgendaItemsCreateModal Component
 *
 * This component renders a modal for creating agenda items. It includes
 * form fields for entering details such as title, duration, description,
 * categories, URLs, and attachments. The modal also provides functionality
 * for validating URLs, managing attachments, and submitting the form.
 *
 * @param props - The props for the component containing:
 *   - `agendaItemCreateModalIsOpen`: Determines if the modal is open
 *   - `hideCreateModal`: Function to close the modal
 *   - `formState`: The current state of the form
 *   - `setFormState`: Function to update the form state
 *   - `createAgendaItemHandler`: Function to handle form submission
 *   - `t`: Translation function for localization
 *   - `agendaItemCategories`: List of available agenda item categories
 *
 * @returns The rendered modal component
 *
 * @remarks
 * - The component uses `react-bootstrap` for modal and form styling
 * - `@mui/material` is used for the Autocomplete component
 * - Attachments are converted to base64 format before being added to the form state
 * - URLs are validated using a regular expression before being added
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
import { Button } from 'shared-components/Button';
import { Row, Col } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { Autocomplete } from '@mui/material';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

import { FaLink, FaTrash } from 'react-icons/fa';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import styles from './AgendaItemsCreateModal.module.css';
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
import convertToBase64 from 'utils/convertToBase64';
import type { InterfaceAgendaItemsCreateModalProps } from 'types/Agenda/interface';
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

  useEffect(() => {
    // Ensure URLs and attachments do not have empty or invalid entries
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter((att) => att !== ''),
    }));
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
   * Handles file selection and converts files to base64 before updating the form state.
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
      const base64Files = await Promise.all(
        files.map(async (file) => await convertToBase64(file)),
      );
      setFormState({
        ...formState,
        attachments: [...formState.attachments, ...base64Files],
      });
    }
  };

  /**
   * Handles removing an attachment from the form state.
   *
   * @param attachment - Attachment to remove.
   */
  const handleRemoveAttachment = (attachment: string): void => {
    setFormState({
      ...formState,
      attachments: formState.attachments.filter((item) => item !== attachment),
    });
  };

  return (
    <BaseModal
      className={styles.AgendaItemsModal}
      show={agendaItemCreateModalIsOpen}
      onHide={hideCreateModal}
      headerContent={
        <p className={styles.titlemodalAgendaItems}>{t('agendaItemDetails')}</p>
      }
    >
      <form onSubmit={createAgendaItemHandler}>
        <div className="d-flex mb-3 w-100">
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
              <FormFieldGroup name="category" label={t('category')}>
                <div ref={params.InputProps.ref}>
                  <input
                    {...params.inputProps}
                    className="form-control"
                    placeholder={t('category')}
                  />
                </div>
              </FormFieldGroup>
            )}
          />
        </div>
        <Row className="mb-3">
          <Col>
            <FormFieldGroup name="title" label={t('title')}>
              <input
                className="form-control"
                id="title"
                type="text"
                placeholder={t('enterTitle')}
                value={formState.title}
                required
                onChange={(e) =>
                  setFormState({ ...formState, title: e.target.value })
                }
              />
            </FormFieldGroup>
          </Col>
          <Col>
            <FormFieldGroup name="duration" label={t('duration')}>
              <input
                className="form-control"
                id="duration"
                type="text"
                placeholder={t('enterDuration')}
                value={formState.duration}
                required
                onChange={(e) =>
                  setFormState({ ...formState, duration: e.target.value })
                }
              />
            </FormFieldGroup>
          </Col>
        </Row>
        <FormFieldGroup name="description" label={t('description')}>
          <textarea
            className="form-control"
            id="description"
            rows={1}
            placeholder={t('enterDescription')}
            value={formState.description}
            required
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
          />
        </FormFieldGroup>

        <div className="mb-3">
          <label className="form-label">{t('url')}</label>
          <div className="d-flex">
            <input
              className="form-control"
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
        </div>
        <div className="mb-3">
          <label className="form-label">{t('attachments')}</label>
          <input
            className="form-control"
            accept="image/*, video/*"
            data-testid="attachment"
            name="attachment"
            type="file"
            id="attachment"
            multiple={true}
            onChange={handleFileChange}
          />
          <small className="form-text">{t('attachmentLimit')}</small>
        </div>
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
