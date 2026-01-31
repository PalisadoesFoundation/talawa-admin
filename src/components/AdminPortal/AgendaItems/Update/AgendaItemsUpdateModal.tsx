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
import { useMutation } from '@apollo/client';
import { UPDATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  AGENDA_ITEM_MIME_TYPE,
  AGENDA_ITEM_ALLOWED_MIME_TYPES,
} from 'Constant/fileUpload';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';

import styles from './AgendaItemsUpdateModal.module.css';

import type {
  InterfaceAgendaItemCategoryInfo,
  InterfaceAgendaItemsUpdateModalProps,
  InterfaceAttachment,
} from 'types/AdminPortal/Agenda/interface';

/**
 * Renders the modal used to update agenda items.
 *
 * @param isOpen - Whether the modal is open.
 * @param onClose - Closes the modal.
 * @param agendaItemId - ID of the agenda item being updated.
 * @param itemFormState - Current agenda item form state.
 * @param setItemFormState - Setter for agenda item form state.
 * @param refetchAgendaFolder - Refetches agenda folders after update.
 * @param t - i18n translation function.
 * @param agendaItemCategories - Available agenda item categories.
 * @param agendaFolderData - Available agenda folders.
 *
 * @returns JSX.Element
 */

// translation-check-keyPrefix: agendaSection
const AgendaItemsUpdateModal: React.FC<
  InterfaceAgendaItemsUpdateModalProps
> = ({
  isOpen,
  onClose,
  agendaItemId,
  itemFormState,
  setItemFormState,
  t,
  agendaItemCategories,
  agendaFolderData,
  refetchAgendaFolder,
}) => {
  const [newUrl, setNewUrl] = useState('');
  const { orgId } = useParams();
  const organizationId = orgId ?? '';
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();
  const [updateAgendaItem] = useMutation(UPDATE_AGENDA_ITEM_MUTATION);
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
    const trimmedUrl = newUrl.trim();
    if (trimmedUrl !== '' && isValidUrl(trimmedUrl)) {
      setItemFormState({
        ...itemFormState,
        url: [...itemFormState.url.filter((u) => u.trim() !== ''), trimmedUrl],
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
    if (!organizationId) {
      NotificationToast.error(t('organizationRequired'));
      return;
    }
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

  const updateAgendaItemHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await updateAgendaItem({
        variables: {
          input: {
            id: agendaItemId,
            name: itemFormState.name?.trim() || undefined,
            description: itemFormState.description?.trim() || undefined,
            duration: itemFormState.duration?.trim() || undefined,
            folderId: itemFormState.folder || undefined,
            categoryId: itemFormState.category || undefined,
            url:
              itemFormState.url.length > 0
                ? itemFormState.url.map((u) => ({ url: u }))
                : [],
            attachments: itemFormState.attachments.map((att) => ({
              name: att.name,
              fileHash: att.fileHash,
              mimeType: AGENDA_ITEM_MIME_TYPE[att.mimeType] ?? att.mimeType,
              objectName: att.objectName,
            })),
          },
        },
      });

      NotificationToast.success(t('agendaItemUpdated') as string);
      refetchAgendaFolder();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  return (
    <BaseModal
      className={styles.AgendaItemModal}
      show={isOpen}
      onHide={onClose}
      title={t('updateAgendaItem')}
      dataTestId="updateAgendaItemModal"
    >
      <form onSubmit={updateAgendaItemHandler}>
        {/* Folder */}
        <FormFieldGroup name="folder" label={t('folder')} inputId="folder">
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
                  id="folder"
                  className="form-control"
                  placeholder={t('folderName')}
                />
                {params.InputProps.endAdornment}
              </div>
            )}
          />
        </FormFieldGroup>

        {/* Category */}
        <FormFieldGroup
          name="category"
          label={t('category')}
          inputId="category"
        >
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
                  id="category"
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
