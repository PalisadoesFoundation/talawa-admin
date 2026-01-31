import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Autocomplete } from '@mui/material';
import { FaLink, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';

import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import Button from 'shared-components/Button/Button';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';

import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';

import { UPDATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  AGENDA_ITEM_ALLOWED_MIME_TYPES,
  AGENDA_ITEM_MIME_TYPE,
} from 'Constant/fileUpload';

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

  const [updateAgendaItem, { loading }] = useMutation(
    UPDATE_AGENDA_ITEM_MUTATION,
  );

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

  useEffect(() => {
    setItemFormState((prev) => ({
      ...prev,
      url: prev.url.filter((url) => url.trim()),
    }));
  }, [setItemFormState]);

  const isValidUrl = (url: string): boolean =>
    /^(ftp|http|https):\/\/[^ "]+$/.test(url);

  const handleAddUrl = (): void => {
    const trimmedUrl = newUrl.trim();

    if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
      NotificationToast.error(t('invalidUrl'));
      return;
    }

    setItemFormState({
      ...itemFormState,
      url: [...itemFormState.url.filter((u) => u.trim()), trimmedUrl],
    });

    setNewUrl('');
  };

  const handleRemoveUrl = (url: string): void => {
    setItemFormState({
      ...itemFormState,
      url: itemFormState.url.filter((u) => u !== url),
    });
  };

  const handleRemoveAttachment = (objectName: string): void => {
    setItemFormState({
      ...itemFormState,
      attachments: itemFormState.attachments.filter(
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

    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    try {
      const uploaded: InterfaceAttachment[] = [];

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

        uploaded.push({
          name: file.name,
          mimeType: file.type,
          objectName,
          fileHash,
          previewUrl,
        });
      }

      if (uploaded.length) {
        setItemFormState((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...uploaded],
        }));
      }
    } catch {
      NotificationToast.error(t('fileUploadFailed'));
    } finally {
      e.target.value = '';
    }
  };

  const updateAgendaItemHandler = async (): Promise<void> => {
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
            url: itemFormState.url.map((u) => ({ url: u })),
            attachments: itemFormState.attachments.map((att) => ({
              name: att.name,
              fileHash: att.fileHash,
              mimeType: AGENDA_ITEM_MIME_TYPE[att.mimeType] ?? att.mimeType,
              objectName: att.objectName,
            })),
          },
        },
      });

      NotificationToast.success(t('agendaItemUpdated'));
      refetchAgendaFolder();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  return (
    <CRUDModalTemplate
      open={isOpen}
      onClose={onClose}
      title={t('updateAgendaItem')}
      onPrimary={updateAgendaItemHandler}
      primaryText={t('update')}
      loading={loading}
      className={styles.AgendaItemModal}
      data-testid="updateAgendaItemModal"
    >
      {/* Folder */}
      <FormFieldGroup name="folder" label={t('folder')}>
        <Autocomplete
          options={agendaFolderData ?? []}
          getOptionLabel={(f) => f.name}
          value={
            agendaFolderData?.find((f) => f.id === itemFormState.folder) ?? null
          }
          onChange={(_, folder) =>
            setItemFormState({
              ...itemFormState,
              folder: folder?.id ?? '',
            })
          }
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
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
          options={agendaItemCategories ?? []}
          getOptionLabel={(c: InterfaceAgendaItemCategoryInfo) => c.name}
          value={
            agendaItemCategories?.find(
              (c) => c.id === itemFormState.category,
            ) ?? null
          }
          onChange={(_, category) =>
            setItemFormState({
              ...itemFormState,
              category: category?.id ?? '',
            })
          }
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
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
            value={itemFormState.name}
            onChange={(v) => setItemFormState({ ...itemFormState, name: v })}
          />
        </Col>
        <Col>
          <FormTextField
            name="duration"
            label={t('duration')}
            value={itemFormState.duration}
            required
            onChange={(v) =>
              setItemFormState({ ...itemFormState, duration: v })
            }
          />
        </Col>
      </Row>

      <FormTextField
        name="description"
        label={t('description')}
        value={itemFormState.description}
        onChange={(v) => setItemFormState({ ...itemFormState, description: v })}
      />

      {/* URLs */}
      <FormFieldGroup name="url" label={t('url')}>
        <div className="d-flex">
          <input
            className="form-control"
            data-testid="urlInput"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <Button type="button" onClick={handleAddUrl} data-testid="linkBtn">
            {t('link')}
          </Button>
        </div>

        <ul className={styles.urlList}>
          {itemFormState.url.map((url) => (
            <li key={url} className={styles.urlListItem}>
              <FaLink />
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url.length > 50 ? `${url.slice(0, 50)}...` : url}
              </a>
              <Button
                variant="danger"
                size="sm"
                data-testid="deleteUrl"
                onClick={() => handleRemoveUrl(url)}
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
          multiple
          accept="image/*,video/*"
          data-testid="attachment"
          className="form-control"
          onChange={handleFileChange}
        />
      </FormFieldGroup>

      {itemFormState.attachments.length > 0 && (
        <div className={styles.previewFile} data-testid="mediaPreview">
          {itemFormState.attachments.map((attachment) => (
            <div
              key={attachment.objectName}
              className={styles.attachmentPreview}
            >
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
    </CRUDModalTemplate>
  );
};

export default AgendaItemsUpdateModal;
