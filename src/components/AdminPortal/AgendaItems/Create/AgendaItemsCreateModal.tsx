import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import { FaLink, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import DropDownButton from 'shared-components/DropDownButton';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import Button from 'shared-components/Button/Button';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';

import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';

import {
  AGENDA_ITEM_ALLOWED_MIME_TYPES,
  AGENDA_ITEM_MIME_TYPE,
} from 'Constant/fileUpload';

import styles from './AgendaItemsCreateModal.module.css';

import type {
  InterfaceAgendaItemsCreateModalProps,
  InterfaceAttachment,
  InterfaceCreateFormStateType,
} from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaItemsCreateModal
 *
 * Create modal for adding a new agenda item.
 * Built on `CreateModal` for consistent create UX and loading handling.
 *
 * @param isOpen - Controls modal visibility
 * @param hide - Callback to close the modal
 * @param eventId - ID of the event
 * @param agendaItemCategories - Available agenda item categories
 * @param agendaFolderData - Available agenda folders
 * @param refetchAgendaFolder - Refetches agenda folder data after creation
 * @param t - i18n translation function
 *
 * @returns JSX.Element
 */
// translation-check-keyPrefix: agendaSection
const AgendaItemsCreateModal: React.FC<
  InterfaceAgendaItemsCreateModalProps
> = ({
  isOpen,
  hide,
  eventId,
  agendaItemCategories,
  agendaFolderData,
  refetchAgendaFolder,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const { orgId } = useParams();
  const organizationId = orgId ?? '';

  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();

  const [createAgendaItem] = useMutation(CREATE_AGENDA_ITEM_MUTATION);

  const [newUrl, setNewUrl] = useState('');

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

  const [agendaItemFormState, setAgendaItemFormState] =
    useState<InterfaceCreateFormStateType>({
      id: '',
      title: '',
      description: '',
      duration: '',
      creator: { name: '' },
      urls: [],
      attachments: [],
      folderId: '',
      categoryId: '',
      notes: '',
    });

  useEffect(() => {
    if (!isOpen) {
      setAgendaItemFormState({
        id: '',
        title: '',
        description: '',
        duration: '',
        creator: { name: '' },
        urls: [],
        attachments: [],
        folderId: '',
        categoryId: '',
        notes: '',
      });
      setNewUrl('');
    }
  }, [isOpen]);

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

  /**
   * Creates a new agenda item within the selected folder.
   * Computes the next sequence value, submits the create mutation,
   * and refreshes agenda data on success.
   */
  const handleCreateAgendaItem = async (): Promise<void> => {
    const selectedFolder = agendaFolderData?.find(
      (f) => f.id === agendaItemFormState.folderId,
    );

    const folderItems = selectedFolder?.items?.edges ?? [];
    const maxSequence = folderItems.reduce(
      (max, edge) => Math.max(max, edge.node.sequence ?? 0),
      0,
    );

    try {
      await createAgendaItem({
        variables: {
          input: {
            name: agendaItemFormState.title,
            description: agendaItemFormState.description,
            eventId,
            sequence: maxSequence + 1,
            duration: agendaItemFormState.duration,
            folderId: agendaItemFormState.folderId,
            categoryId: agendaItemFormState.categoryId,
            notes: agendaItemFormState.notes,
            attachments:
              agendaItemFormState.attachments.length > 0
                ? agendaItemFormState.attachments.map((att) => ({
                    name: att.name,
                    mimeType: AGENDA_ITEM_MIME_TYPE[att.mimeType],
                    fileHash: att.fileHash,
                    objectName: att.objectName,
                  }))
                : undefined,
            type: 'general',
            url:
              agendaItemFormState.urls.length > 0
                ? agendaItemFormState.urls.map((u) => ({ url: u }))
                : undefined,
          },
        },
      });

      setAgendaItemFormState({
        id: '',
        title: '',
        description: '',
        duration: '',
        folderId: '',
        categoryId: '',
        urls: [],
        attachments: [],
        creator: { name: '' },
        notes: '',
      });

      hide();
      refetchAgendaFolder();
      NotificationToast.success(t('agendaItemCreated'));
    } catch (err) {
      if (err instanceof Error) {
        NotificationToast.error(err.message);
      }
    }
  };

  /**
   * Validates and adds a new URL to the agenda item form state.
   * Rejects invalid or unsafe URLs.
   */
  const handleAddUrl = (): void => {
    const trimmed = newUrl.trim();

    if (!trimmed || !isSafeUrl(trimmed)) {
      NotificationToast.error(t('invalidUrl'));
      return;
    }

    setAgendaItemFormState((prev) => ({
      ...prev,
      urls: [...prev.urls.filter(Boolean), trimmed],
    }));

    setNewUrl('');
  };

  /**
   * Removes a URL entry from the agenda item form state.
   */
  const handleRemoveUrl = (url: string): void => {
    setAgendaItemFormState((prev) => ({
      ...prev,
      urls: prev.urls.filter((u) => u !== url),
    }));
  };

  /**
   * Removes a selected attachment from the agenda item form state.
   * Does not delete the file from storage until form submission.
   */
  const handleRemoveAttachment = (objectName: string): void => {
    setAgendaItemFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (att) => att.objectName !== objectName,
      ),
    }));
  };

  /**
   * Uploads selected files to MinIO using presigned URLs,
   * validates size and MIME type, and generates preview URLs.
   */
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
        setAgendaItemFormState((prev) => ({
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

  return (
    <CreateModal
      open={isOpen}
      onClose={hide}
      title={t('agendaItemDetails')}
      onSubmit={handleCreateAgendaItem}
      submitDisabled={!agendaItemFormState.title.trim()}
      data-testid="createAgendaItemModal"
    >
      {/* Folder */}
      <FormFieldGroup name="folder" label={t('folder')}>
        <div className="w-100">
          <DropDownButton
            id="create-agenda-folder-dropdown"
            options={(agendaFolderData ?? []).map((f) => ({
              value: f.id,
              label: f.name,
            }))}
            selectedValue={agendaItemFormState.folderId || undefined}
            onSelect={(val) =>
              setAgendaItemFormState((prev) => ({
                ...prev,
                folderId: val,
              }))
            }
            placeholder={t('folderName')}
            ariaLabel="Folder"
            dataTestIdPrefix="create-folder-dropdown"
            btnStyle="w-100 justify-content-between bg-light border text-dark"
            parentContainerStyle="w-100"
            variant="light"
          />
        </div>
      </FormFieldGroup>

      {/* Category */}
      <FormFieldGroup name="category" label={t('category')}>
        <div className="w-100">
          <DropDownButton
            id="create-agenda-category-dropdown"
            options={(agendaItemCategories ?? []).map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            selectedValue={agendaItemFormState.categoryId || undefined}
            onSelect={(val) =>
              setAgendaItemFormState((prev) => ({
                ...prev,
                categoryId: val,
              }))
            }
            placeholder={t('categoryName')}
            ariaLabel="Category"
            dataTestIdPrefix="create-category-dropdown"
            btnStyle="w-100 justify-content-between bg-light border text-dark"
            parentContainerStyle="w-100"
            variant="light"
          />
        </div>
      </FormFieldGroup>

      <Row className="mb-3">
        <Col>
          <FormTextField
            name="title"
            label={t('title')}
            placeholder={t('enterTitle')}
            value={agendaItemFormState.title}
            required
            onChange={(v) =>
              setAgendaItemFormState((prev) => ({ ...prev, title: v }))
            }
          />
        </Col>
        <Col>
          <FormTextField
            name="duration"
            label={t('duration')}
            placeholder={t('enterDuration')}
            value={agendaItemFormState.duration}
            required
            onChange={(v) =>
              setAgendaItemFormState((prev) => ({ ...prev, duration: v }))
            }
          />
        </Col>
      </Row>

      <FormTextField
        name="description"
        label={t('description')}
        placeholder={t('enterDescription')}
        value={agendaItemFormState.description}
        required
        onChange={(v) =>
          setAgendaItemFormState((prev) => ({ ...prev, description: v }))
        }
      />

      <FormTextField
        name="notes"
        label={t('notes')}
        placeholder={t('enterNotes')}
        value={agendaItemFormState.notes}
        onChange={(v) =>
          setAgendaItemFormState((prev) => ({ ...prev, notes: v }))
        }
      />

      {/* URLs */}
      <FormFieldGroup name="url" label={t('url')}>
        <div className="d-flex gap-2">
          <input
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

        {agendaItemFormState.urls.map((url) => (
          <li key={url} className={styles.urlListItem}>
            <FaLink />
            <a href={encodeURI(url)} target="_blank" rel="noopener noreferrer">
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
      </FormFieldGroup>

      {/* Attachments */}
      <FormFieldGroup name="attachments" label={t('attachments')}>
        <input
          type="file"
          multiple
          className="form-control"
          data-testid="attachment"
          onChange={handleFileChange}
        />
        <small className="text-muted">{t('attachmentLimit')}</small>
      </FormFieldGroup>

      {agendaItemFormState.attachments.map((att) => (
        <div key={att.objectName} className={styles.previewFile}>
          {att.mimeType.startsWith('video') ? (
            <video muted autoPlay loop playsInline>
              <source src={att.previewUrl} type={att.mimeType} />
            </video>
          ) : (
            <img src={att.previewUrl} alt={t('attachmentPreviewAlt')} />
          )}

          <Button
            type="button"
            className={styles.closeButtonFile}
            data-testid="deleteAttachment"
            onClick={() => handleRemoveAttachment(att.objectName)}
          >
            <i className="fa fa-times" />
          </Button>
        </div>
      ))}
    </CreateModal>
  );
};

export default AgendaItemsCreateModal;
