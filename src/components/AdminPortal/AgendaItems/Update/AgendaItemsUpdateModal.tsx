import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Autocomplete } from '@mui/material';
import { FaLink, FaTrash } from 'react-icons/fa';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import { useParams } from 'react-router';
import { BaseModal } from 'shared-components/BaseModal';
import Button from 'shared-components/Button/Button';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';

import styles from 'style/app-fixed.module.css';

import type {
  InterfaceAgendaItemCategoryInfo,
  InterfaceAgendaItemsUpdateModalProps,
  InterfaceAttachment,
} from 'types/AdminPortal/Agenda/interface';
import { AGENDA_ITEM_ALLOWED_MIME_TYPES } from 'Constant/fileUpload';

// translation-check-keyPrefix: agendaSection
/**
 * Renders the modal used to update agenda items.
 *
 * @param agendaItemUpdateModalIsOpen - Whether the modal is open.
 * @param hideUpdateItemModal - Handler to close the modal.
 * @param itemFormState - Current agenda item form state.
 * @param setItemFormState - Setter for agenda item form state.
 * @param updateAgendaItemHandler - Submit handler.
 * @param t - i18n translation function.
 * @param agendaItemCategories - Available agenda item categories.
 * @param agendaFolderData - Available agenda folders.
 * @returns JSX.Element
 */
const AgendaItemsUpdateModal: React.FC<
  InterfaceAgendaItemsUpdateModalProps
> = ({
  agendaItemUpdateModalIsOpen,
  hideUpdateItemModal,
  itemFormState,
  setItemFormState,
  updateAgendaItemHandler,
  t,
  agendaItemCategories,
  agendaFolderData,
}) => {
  const [newUrl, setNewUrl] = useState('');
  const { orgId } = useParams();
  const organizationId = orgId ?? 'organization';
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  useEffect(() => {
    setItemFormState((prevState) => ({
      ...prevState,
      url: prevState.url.filter((url) => url.trim() !== ''),
    }));
  }, [setItemFormState]);

  const isValidUrl = (url: string): boolean => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handleAddUrl = (): void => {
    if (newUrl.trim() !== '' && isValidUrl(newUrl.trim())) {
      setItemFormState({
        ...itemFormState,
        url: [...itemFormState.url.filter((u) => u.trim() !== ''), newUrl],
      });
      setNewUrl('');
    } else {
      NotificationToast.error(t('invalidUrl'));
    }
  };

  const handleRemoveUrl = (url: string): void => {
    setItemFormState({
      ...itemFormState,
      url: itemFormState.url.filter((item) => item !== url),
    });
  };

  const handleRemoveAttachment = (objectName: string): void => {
    setItemFormState({
      ...itemFormState,
      attachments: itemFormState.attachments?.filter(
        (att) => att.objectName !== objectName,
      ),
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const target = e.target;
    if (!target.files || target.files.length === 0) return;

    const files = Array.from(target.files);

    try {
      const uploadedAttachments: InterfaceAttachment[] = [];

      for (const file of files) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          NotificationToast.error(t('fileSizeExceedsLimit'));
          continue;
        }

        if (!AGENDA_ITEM_ALLOWED_MIME_TYPES.includes(file.type)) {
          NotificationToast.error(t('invalidFileType'));
          continue;
        }

        const { objectName, fileHash } = await uploadFileToMinio(
          file,
          organizationId,
        );

        const previewUrl = await getFileFromMinio(objectName, organizationId);

        uploadedAttachments.push({
          name: file.name,
          mimeType: file.type,
          objectName,
          fileHash,
          previewUrl,
        });
      }

      if (uploadedAttachments.length > 0) {
        setItemFormState((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...uploadedAttachments],
        }));
      }
    } catch (error) {
      console.error(error);
      NotificationToast.error(t('fileUploadFailed'));
    } finally {
      // allow re-uploading same file
      target.value = '';
    }
  };

  return (
    <BaseModal
      className={styles.AgendaItemModal}
      show={agendaItemUpdateModalIsOpen}
      onHide={hideUpdateItemModal}
      title={t('updateAgendaItem')}
      dataTestId="updateAgendaItemModal"
    >
      <form onSubmit={updateAgendaItemHandler}>
        {/* Folder */}
        <FormFieldGroup name="folder" label={t('folder')}>
          <Autocomplete
            options={agendaFolderData ?? []}
            getOptionLabel={(folder) => folder.name}
            value={
              agendaFolderData?.find(
                (folder) => folder.id === itemFormState.folder,
              ) ?? null
            }
            onChange={(_, folder): void => {
              setItemFormState({
                ...itemFormState,
                folder: folder?.id ?? '',
              });
            }}
            renderInput={(params) => (
              <div ref={params.InputProps.ref} className="position-relative">
                <input
                  {...params.inputProps}
                  className="form-control"
                  placeholder={t('folderName')}
                />
                {params.InputProps.endAdornment}
              </div>
            )}
          />
        </FormFieldGroup>

        {/* Category */}
        <FormFieldGroup name="category" label={t('category')}>
          <Autocomplete
            options={agendaItemCategories || []}
            getOptionLabel={(
              category: InterfaceAgendaItemCategoryInfo,
            ): string => category.name}
            value={
              agendaItemCategories?.find(
                (category) => category.id === itemFormState.category,
              ) ?? null
            }
            onChange={(_, category): void => {
              setItemFormState({
                ...itemFormState,
                category: category?.id ?? '',
              });
            }}
            renderInput={(params) => (
              <div ref={params.InputProps.ref} className="position-relative">
                <input
                  {...params.inputProps}
                  className="form-control"
                  placeholder={t('categoryName')}
                />
                {params.InputProps.endAdornment}
              </div>
            )}
          />
        </FormFieldGroup>

        <Row className="mb-3">
          <Col>
            <FormTextField
              name="title"
              label={t('title')}
              placeholder={t('enterTitle')}
              value={itemFormState.name}
              onChange={(value) =>
                setItemFormState({
                  ...itemFormState,
                  name: value,
                })
              }
            />
          </Col>
          <Col>
            <FormTextField
              name="duration"
              label={t('duration')}
              placeholder={t('enterDuration')}
              value={itemFormState.duration}
              required
              onChange={(value) =>
                setItemFormState({
                  ...itemFormState,
                  duration: value,
                })
              }
            />
          </Col>
        </Row>

        <FormTextField
          name="description"
          label={t('description')}
          placeholder={t('enterDescription')}
          value={itemFormState.description}
          onChange={(value) =>
            setItemFormState({
              ...itemFormState,
              description: value,
            })
          }
        />

        {/* URLs */}
        <FormFieldGroup name="url" label={t('url')}>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder={t('enterUrl')}
              data-testid="urlInput"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <Button type="button" onClick={handleAddUrl} data-testid="linkBtn">
              {t('link')}
            </Button>
          </div>

          <ul className={styles.urlList}>
            {itemFormState.url.map((url, index) => (
              <li key={index} className={styles.urlListItem}>
                <FaLink className={styles.urlIcon} />
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                </a>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  data-testid="deleteUrl"
                  className={styles.deleteButtonAgendaItems}
                  onClick={() => handleRemoveUrl(url)}
                  aria-label={t('removeUrl')}
                >
                  <FaTrash />
                </Button>
              </li>
            ))}
          </ul>
        </FormFieldGroup>

        {/* Attachments */}
        <FormFieldGroup name="attachments" label={t('attachments')}>
          <input
            type="file"
            accept="image/*, video/*"
            multiple
            data-testid="attachment"
            className="form-control"
            onChange={handleFileChange}
          />
          <small className="text-muted">{t('attachmentLimit')}</small>
        </FormFieldGroup>

        {itemFormState.attachments.length > 0 && (
          <div className={styles.previewFile} data-testid="mediaPreview">
            {itemFormState.attachments?.map((attachment, index) => (
              <div key={index} className={styles.attachmentPreview}>
                {attachment.mimeType.startsWith('video') ? (
                  <video muted autoPlay loop playsInline>
                    <source
                      src={attachment.previewUrl}
                      type={attachment.mimeType}
                    />
                  </video>
                ) : (
                  <img
                    src={attachment.previewUrl}
                    alt={t('attachmentPreviewAlt')}
                  />
                )}

                <button
                  type="button"
                  className={styles.closeButtonFile}
                  aria-label={t('removeAttachment')}
                  onClick={() => handleRemoveAttachment(attachment.objectName)}
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
