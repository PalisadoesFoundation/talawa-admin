import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import DropDownButton from 'shared-components/DropDownButton';
import { FaLink, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';

import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
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
  InterfaceAgendaItemsUpdateModalProps,
  InterfaceAttachment,
} from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaItemsUpdateModal
 *
 * Edit modal for updating an existing agenda item.
 * Uses `EditModal` to handle submission, loading, and keyboard actions.
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param agendaItemId - ID of the agenda item being updated
 * @param itemFormState - Current agenda item form state
 * @param setItemFormState - Setter for agenda item form state
 * @param agendaItemCategories - Available agenda item categories
 * @param agendaFolderData - Available agenda folders
 * @param refetchAgendaFolder - Refetches agenda folder data after update
 * @param t - i18n translation function
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
  agendaItemCategories,
  agendaFolderData,
  refetchAgendaFolder,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const [newUrl, setNewUrl] = useState('');
  const { orgId } = useParams();
  const organizationId = orgId ?? '';

  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();

  const [updateAgendaItem] = useMutation(UPDATE_AGENDA_ITEM_MUTATION);

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

  useEffect(() => {
    setItemFormState((prev) => ({
      ...prev,
      url: prev.url.filter((u) => u.trim()),
    }));
  }, [setItemFormState]);

  /**
   * Validates user-provided URLs.
   * Allows only absolute http(s) URLs and rejects protocol-relative or unsafe schemes.
   */
  const isSafeUrl = (url: string): boolean => {
    try {
      // Explicitly reject protocol-relative URLs (e.g. //example.com)
      if (url.startsWith('//')) {
        return false;
      }

      const parsed = new URL(url);

      // Allow only http(s) protocols
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleAddUrl = (): void => {
    const trimmedUrl = newUrl.trim();

    if (!trimmedUrl || !isSafeUrl(trimmedUrl)) {
      NotificationToast.error(t('invalidUrl'));
      return;
    }

    setItemFormState({
      ...itemFormState,
      url: [...itemFormState.url.filter(Boolean), trimmedUrl],
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

  /**
   * Submits updated agenda item data to the backend.
   * Syncs edited fields, attachments, and URLs,
   * then refreshes agenda data on success.
   */
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
            notes:
              itemFormState.notes?.trim() === ''
                ? null
                : (itemFormState.notes?.trim() ?? undefined),
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
    } catch (err) {
      if (err instanceof Error) {
        NotificationToast.error(err.message);
      }
    }
  };

  return (
    <EditModal
      open={isOpen}
      onClose={onClose}
      title={t('updateAgendaItem')}
      onSubmit={updateAgendaItemHandler}
      submitDisabled={!itemFormState.name.trim()}
      data-testid="updateAgendaItemModal"
    >
      {/* Folder */}
      <FormFieldGroup name="folder" label={t('folder')}>
        <div className="w-100">
          <DropDownButton
            id="agenda-folder-dropdown"
            options={(agendaFolderData ?? []).map((f) => ({
              value: f.id,
              label: f.name,
            }))}
            selectedValue={itemFormState.folder || undefined}
            onSelect={(val) =>
              setItemFormState({
                ...itemFormState,
                folder: val,
              })
            }
            placeholder={t('folderName')}
            ariaLabel="Folder"
            dataTestIdPrefix="folder-dropdown"
            variant="light"
            btnStyle="w-100 justify-content-between bg-light border text-dark"
            parentContainerStyle="w-100"
          />
        </div>
      </FormFieldGroup>

      {/* Category */}
      <FormFieldGroup name="category" label={t('category')}>
        <div className="w-100">
          <DropDownButton
            id="agenda-category-dropdown"
            options={(agendaItemCategories ?? []).map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            selectedValue={itemFormState.category || undefined}
            onSelect={(val) =>
              setItemFormState({
                ...itemFormState,
                category: val,
              })
            }
            placeholder={t('categoryName')}
            ariaLabel="Category"
            dataTestIdPrefix="category-dropdown"
            variant="light"
            btnStyle="w-100 justify-content-between bg-light border text-dark"
            parentContainerStyle="w-100"
          />
        </div>
      </FormFieldGroup>

      <Row className="mb-3">
        <Col>
          <FormTextField
            name="title"
            label={t('title')}
            placeholder={t('enterTitle')}
            value={itemFormState.name}
            onChange={(v) => setItemFormState({ ...itemFormState, name: v })}
          />
        </Col>
        <Col>
          <FormTextField
            name="duration"
            label={t('duration')}
            placeholder={t('enterDuration')}
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
        placeholder={t('enterDescription')}
        value={itemFormState.description}
        onChange={(v) =>
          setItemFormState({
            ...itemFormState,
            description: v,
          })
        }
      />

      <FormTextField
        name="notes"
        label={t('notes')}
        placeholder={t('enterNotes')}
        value={itemFormState.notes}
        onChange={(v) =>
          setItemFormState({
            ...itemFormState,
            notes: v,
          })
        }
      />

      {/* URLs */}
      <FormFieldGroup name="url" label={t('url')}>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder={t('enterUrl')}
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <Button type="button" onClick={handleAddUrl}>
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
          className="form-control"
          onChange={handleFileChange}
        />
      </FormFieldGroup>

      {itemFormState.attachments.length > 0 && (
        <div className={styles.previewFile}>
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

              <Button
                type="button"
                className={styles.closeButtonFile}
                aria-label={t('removeAttachment')}
                onClick={() => handleRemoveAttachment(attachment.objectName)}
              >
                <i className="fa fa-times" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </EditModal>
  );
};

export default AgendaItemsUpdateModal;
