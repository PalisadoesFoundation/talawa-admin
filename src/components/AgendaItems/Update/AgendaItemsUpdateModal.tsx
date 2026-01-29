/**
 * AgendaItemsUpdateModal Component
 *
 * This component renders a modal for updating agenda items. It provides
 * functionality to edit agenda item details such as title, duration,
 * description, categories, URLs, and attachments. The modal also includes
 * validation for URLs and file size limits for attachments.
 *
 * @remarks
 * - The component uses `react-bootstrap` for modal and form elements.
 * - `@mui/material` is used for the Autocomplete component.
 * - File attachments are converted to base64 format before being added to the form state.
 * - URLs are validated using a regular expression.
 *
 * @remarks
 * Example usage:
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
import { Button } from 'shared-components/Button';
import {
  Autocomplete,
  type AutocompleteRenderInputParams,
} from '@mui/material';
import { FaLink, FaTrash } from 'react-icons/fa';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import convertToBase64 from 'utils/convertToBase64';
import styles from './AgendaItemsUpdateModal.module.css';
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
import type { InterfaceAgendaItemsUpdateModalProps } from 'types/Agenda/interface';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';
import { BaseModal } from 'shared-components/BaseModal';
// translation-check-keyPrefix: agendaItems
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
  const { t: tErrors } = useTranslation('errors');

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter((att) => att !== ''),
    }));
  }, []);

  /**
   * Validates if a given URL is in a correct format.
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
   */
  const handleRemoveUrl = (url: string): void => {
    setFormState({
      ...formState,
      urls: formState.urls.filter((item) => item !== url),
    });
  };

  /**
   * Handles file input change event.
   * Converts selected files to base64 format and updates the form state.
   * Displays an error toast if the total file size exceeds the limit.
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
   */
  const handleRemoveAttachment = (attachment: string): void => {
    setFormState({
      ...formState,
      attachments: formState.attachments.filter((item) => item !== attachment),
    });
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={hideUpdateModal}
    >
      <BaseModal
        className={styles.AgendaItemModal}
        show={agendaItemUpdateModalIsOpen}
        onHide={hideUpdateModal}
        showCloseButton={false}
        headerContent={
          <>
            <p className={styles.titlemodalAgendaItems}>
              {t('updateAgendaItem')}
            </p>
            <Button
              onClick={hideUpdateModal}
              data-testid="updateAgendaItemModalCloseBtn"
            >
              <i className="fa fa-times" />
            </Button>
          </>
        }
      >
        <form onSubmit={updateAgendaItemHandler}>
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
                option: string | InterfaceAgendaItemCategoryInfo,
              ) => {
                if (typeof option === 'string') return option;
                return option.name;
              }}
              onChange={(_: unknown, newCategories: unknown) => {
                setFormState({
                  ...formState,
                  agendaItemCategoryIds: (
                    newCategories as InterfaceAgendaItemCategoryInfo[]
                  ).map((category) => category._id),
                });
              }}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <div ref={params.InputProps.ref}>
                  <input
                    {...params.inputProps}
                    className="form-control"
                    placeholder={t('category')}
                  />
                </div>
              )}
            />
          </div>

          <Row className="mb-3">
            <Col>
              <div className="mb-3">
                <label className="form-label" htmlFor="title">
                  {t('title')}
                </label>
                <input
                  id="title"
                  type="text"
                  className="form-control"
                  placeholder={t('enterTitle')}
                  value={formState.title}
                  onChange={(e) =>
                    setFormState({ ...formState, title: e.target.value })
                  }
                />
              </div>
            </Col>
            <Col>
              <div className="mb-3">
                <label className="form-label" htmlFor="duration">
                  {t('duration')}
                </label>
                <input
                  id="duration"
                  type="text"
                  className="form-control"
                  placeholder={t('enterDuration')}
                  value={formState.duration}
                  required
                  onChange={(e) =>
                    setFormState({ ...formState, duration: e.target.value })
                  }
                />
              </div>
            </Col>
          </Row>

          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              {t('description')}
            </label>
            <textarea
              id="description"
              className="form-control"
              rows={1}
              placeholder={t('enterDescription')}
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label htmlFor="basic-url" className="form-label">
              {t('url')}
            </label>
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
              <Button
                onClick={handleAddUrl}
                data-testid="linkBtn"
                className="ms-2"
              >
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
                  className={styles.deleteButtonAgendaItems}
                  onClick={() => handleRemoveUrl(url)}
                  data-testid="deleteUrl"
                >
                  <FaTrash />
                </Button>
              </li>
            ))}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="attachment">
              {t('attachments')}
            </label>
            <input
              id="attachment"
              accept="image/*, video/*"
              data-testid="attachment"
              name="attachment"
              type="file"
              multiple={true}
              onChange={handleFileChange}
              className="form-control"
            />
            <div className="form-text">{t('attachmentLimit')}</div>
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
            data-testid="updateAgendaItemBtn"
          >
            {t('update')}
          </Button>
        </form>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
};

export default AgendaItemsUpdateModal;
