import { useMutation } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import {
  DELETE_TAG_FOLDER,
  UPDATE_TAG_FOLDER,
} from 'GraphQl/Mutations/TagMutations';
import type { InterfaceManageFolderModalProps } from 'types/AdminPortal/Tags/interface';

/**
 * Modal component for editing and deleting a tag folder.
 *
 * @param props - Component props typed by {@link InterfaceManageFolderModalProps}.
 * @remarks
 * `props.open` controls visibility, `props.folder` is the selected folder,
 * `props.onClose` closes the modal, `props.onRefetch` refreshes folder/tag data,
 * and the `*TestId` props provide stable selectors.
 * @returns JSX element rendering save/delete controls for a folder.
 */
const EditFolderModal: React.FC<InterfaceManageFolderModalProps> = ({
  open,
  folder,
  onClose,
  onRefetch,
  modalTestId,
  inputTestId,
  deleteModalTestId,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');

  const [folderName, setFolderName] = useState('');
  const [folderNameTouched, setFolderNameTouched] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (open && folder) {
      setFolderName(folder.name);
      setFolderNameTouched(false);
    }

    if (!open) {
      setFolderName('');
      setFolderNameTouched(false);
      setIsDeleteOpen(false);
    }
  }, [open, folder]);

  const folderNameError =
    folderNameTouched && !folderName.trim()
      ? (tCommon('required') as string)
      : undefined;

  const [updateTagFolder, { loading: updateTagFolderLoading }] =
    useMutation(UPDATE_TAG_FOLDER);
  const [deleteTagFolder, { loading: deleteTagFolderLoading }] =
    useMutation(DELETE_TAG_FOLDER);

  const loading = updateTagFolderLoading || deleteTagFolderLoading;

  const handleUpdateFolder = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!folder) return;

    const trimmedName = folderName.trim();
    if (!trimmedName) {
      NotificationToast.error(tCommon('required') as string);
      return;
    }

    if (trimmedName === folder.name) {
      onClose();
      return;
    }

    try {
      await updateTagFolder({
        variables: {
          id: folder.id,
          name: trimmedName,
        },
      });

      NotificationToast.success(t('tagUpdateSuccess') as string);
      await onRefetch();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const handleDeleteFolder = async (): Promise<void> => {
    if (!folder) return;

    try {
      await deleteTagFolder({
        variables: {
          id: folder.id,
        },
      });

      NotificationToast.success(t('tagDeleteSuccess') as string);
      await onRefetch();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const submitDisabled = useMemo(
    () => Boolean(folderNameError),
    [folderNameError],
  );

  const handleDeleteConfirm = async (): Promise<void> => {
    await handleDeleteFolder();
    setIsDeleteOpen(false);
  };

  return (
    <>
      <EditModal
        open={open}
        title={t('tagDetails') as string}
        onClose={onClose}
        onSubmit={handleUpdateFolder}
        loading={loading}
        submitDisabled={submitDisabled}
        data-testid={modalTestId}
        id="crud-edit-folder-form"
        customFooter={
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Button
              type="button"
              variant="danger"
              disabled={loading}
              onClick={() => setIsDeleteOpen(true)}
            >
              <i
                className="fa fa-trash"
                style={{ marginRight: 'var(--space-3)' }}
              />
              {tCommon('delete') as string}
            </Button>
            <Button
              type="submit"
              form="crud-edit-folder-form"
              variant="primary"
              disabled={loading || submitDisabled}
            >
              <i
                className="fa fa-edit"
                style={{ marginRight: 'var(--space-3)' }}
              />
              {tCommon('save') as string}
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <FormTextField
            name="managedFolderName"
            label={t('tagName') as string}
            placeholder={t('tagNamePlaceholder') as string}
            value={folderName}
            onChange={(value) => {
              setFolderName(value);
              if (!folderNameTouched) setFolderNameTouched(true);
            }}
            onBlur={() => setFolderNameTouched(true)}
            touched={folderNameTouched}
            error={folderNameError}
            required
            data-testid={inputTestId}
            autoComplete="off"
          />
        </div>
      </EditModal>

      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={t('deleteTagFolderTitle') as string}
        onDelete={handleDeleteConfirm}
        loading={loading}
        entityName={folder?.name}
        data-testid={deleteModalTestId}
      >
        <p>{t('deleteTagFolderConfirm') as string}</p>
      </DeleteModal>
    </>
  );
};

export default EditFolderModal;
