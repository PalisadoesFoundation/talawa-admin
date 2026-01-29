/**
 * AgendaItemsCreateModal Component
 *
 * This component renders a modal for creating agenda items. It includes
 * form fields for entering details such as title, duration, description,
 * categories, URLs, and attachments. The modal also provides functionality
 * for validating URLs, managing attachments, and submitting the form.
 */
import React, { FormEvent, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Autocomplete } from '@mui/material';
import { FaLink, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router';

import { BaseModal } from 'shared-components/BaseModal';
import Button from 'shared-components/Button/Button';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';
import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';

import styles from './AgendaItemsCreateModal.module.css';

import type {
  InterfaceAgendaItemsCreateModalProps,
  InterfaceAttachment,
  InterfaceCreateFormStateType,
} from 'types/AdminPortal/Agenda/interface';
import {
  AGENDA_ITEM_ALLOWED_MIME_TYPES,
  AGENDA_ITEM_MIME_TYPE,
} from 'Constant/fileUpload';
import { useMutation } from '@apollo/client';

// translation-check-keyPrefix: agendaSection
const AgendaItemsCreateModal: React.FC<
  InterfaceAgendaItemsCreateModalProps
> = ({
  agendaItemCreateModalIsOpen,
  hideItemCreateModal,
  eventId,
  t,
  agendaItemCategories,
  agendaFolderData,
  refetchAgendaFolder,
}) => {
  const [newUrl, setNewUrl] = useState('');

  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();
  // Mutation for creating an agenda item
  const [createAgendaItem] = useMutation(CREATE_AGENDA_ITEM_MUTATION);

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const { orgId } = useParams();
  const organizationId = orgId ?? 'organization';

  const isValidUrl = (url: string): boolean => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  // State to manage form values
  const [agendaItemFormState, setAgendaItemFormState] =
    useState<InterfaceCreateFormStateType>({
      id: '',
      title: '',
      description: '',
      duration: '',
      creator: {
        name: '',
      },
      urls: [] as string[],
      attachments: [] as {
        id: string;
        name: string;
        mimeType: string;
        fileHash: string;
        objectName: string;
      }[],
      folderId: '',
      categoryId: '',
    });

  /**
   * Handler for creating a new agenda item.
   *
   * @param  e - The form submit event.
   */
  const createAgendaItemHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const selectedFolder = agendaFolderData?.find(
      (folder) => folder.id === agendaItemFormState.folderId,
    );
    const folderItems = selectedFolder?.items?.edges ?? [];
    const maxSequence = folderItems.reduce(
      (max, edge) => Math.max(max, edge.node.sequence ?? 0),
      0,
    );
    const nextSequence = maxSequence + 1;
    try {
      await createAgendaItem({
        variables: {
          input: {
            name: agendaItemFormState.title,
            description: agendaItemFormState.description,
            eventId: eventId,
            sequence: nextSequence, // Assign sequence based on current length
            duration: agendaItemFormState.duration,
            folderId: agendaItemFormState.folderId,
            categoryId: agendaItemFormState.categoryId,
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
            //key:
            url:
              agendaItemFormState.urls.length > 0
                ? agendaItemFormState.urls.map((u) => ({
                    url: u,
                  }))
                : undefined,
          },
        },
      });

      // Reset form state and hide modal
      setAgendaItemFormState({
        id: '',
        title: '',
        description: '',
        duration: '',
        folderId: '',
        attachments: [] as {
          id: string;
          name: string;
          mimeType: string;
          fileHash: string;
          objectName: string;
        }[],
        urls: [] as string[],
        creator: {
          name: '',
        },
        categoryId: '',
      });
      hideItemCreateModal();
      refetchAgendaFolder();
      NotificationToast.success(t('agendaItemCreated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const handleAddUrl = (): void => {
    if (newUrl.trim() !== '' && isValidUrl(newUrl.trim())) {
      setAgendaItemFormState({
        ...agendaItemFormState,
        urls: [
          ...agendaItemFormState.urls.filter((url) => url.trim() !== ''),
          newUrl,
        ],
      });
      setNewUrl('');
    } else {
      NotificationToast.error(t('invalidUrl'));
    }
  };

  const handleRemoveUrl = (url: string): void => {
    setAgendaItemFormState({
      ...agendaItemFormState,
      urls: agendaItemFormState.urls.filter((item) => item !== url),
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const target = e.target as HTMLInputElement;
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
        setAgendaItemFormState((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...uploadedAttachments],
        }));
      }
    } catch (err) {
      console.error(err);
      NotificationToast.error(t('fileUploadFailed'));
    } finally {
      target.value = '';
    }
  };

  const handleRemoveAttachment = (objectName: string): void => {
    setAgendaItemFormState({
      ...agendaItemFormState,
      attachments: agendaItemFormState.attachments.filter(
        (item) => item.objectName !== objectName,
      ),
    });
  };

  return (
    <BaseModal
      className={styles.AgendaItemsModal}
      show={agendaItemCreateModalIsOpen}
      onHide={hideItemCreateModal}
      title={t('agendaItemDetails')}
      dataTestId="createAgendaItemModal"
    >
      <form onSubmit={createAgendaItemHandler}>
        {/* Folder */}
        <FormFieldGroup name="folder" label={t('folder')}>
          <Autocomplete
            options={agendaFolderData ?? []}
            getOptionLabel={(folder) => folder.name}
            value={
              agendaFolderData?.find(
                (folder) => folder.id === agendaItemFormState.folderId,
              ) ?? null
            }
            onChange={(_, folder): void => {
              setAgendaItemFormState({
                ...agendaItemFormState,
                folderId: folder?.id ?? null,
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
            getOptionLabel={(category) => category.name}
            value={
              agendaItemCategories?.find(
                (category) => category.id === agendaItemFormState.categoryId,
              ) ?? null
            }
            onChange={(_, category): void => {
              setAgendaItemFormState({
                ...agendaItemFormState,
                categoryId: category?.id ?? '',
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
              value={agendaItemFormState.title}
              required
              onChange={(value) =>
                setAgendaItemFormState({
                  ...agendaItemFormState,
                  title: value,
                })
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
              onChange={(value) =>
                setAgendaItemFormState({
                  ...agendaItemFormState,
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
          value={agendaItemFormState.description}
          required
          onChange={(value) =>
            setAgendaItemFormState({
              ...agendaItemFormState,
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
            <Button onClick={handleAddUrl} data-testid="linkBtn">
              {t('link')}
            </Button>
          </div>

          {agendaItemFormState.urls.map((url, index) => (
            <li key={index} className={styles.urlListItem}>
              <FaLink className={styles.urlIcon} />
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url.length > 50 ? `${url.substring(0, 50)}...` : url}
              </a>
              <Button
                variant="danger"
                size="sm"
                className={styles.deleteButtonAgendaItems}
                data-testid="deleteUrl"
                onClick={() => handleRemoveUrl(url)}
                aria-label={t('removeUrl')}
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
            accept="image/*, video/*"
            multiple
            data-testid="attachment"
            className="form-control"
            onChange={handleFileChange}
          />
          <small className="text-muted">{t('attachmentLimit')}</small>
        </FormFieldGroup>

        {agendaItemFormState.attachments
          .filter(
            (att): att is InterfaceAttachment =>
              typeof att === 'object' &&
              !!att.mimeType &&
              !!att.objectName &&
              !!att.previewUrl,
          )
          .map((attachment, index) => (
            <div key={index} className={styles.previewFile}>
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
                aria-label={t('removeAttachment')}
                className={styles.closeButtonFile}
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveAttachment(attachment.objectName);
                }}
                data-testid="deleteAttachment"
              >
                <i className="fa fa-times" />
              </button>
            </div>
          ))}

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
