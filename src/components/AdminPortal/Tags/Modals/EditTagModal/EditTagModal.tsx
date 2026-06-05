import { useMutation } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import {
  REMOVE_USER_TAG,
  UPDATE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import type { InterfaceManageTagModalProps } from 'types/AdminPortal/Tags/interface';

/**
 * Modal component for editing and deleting a tag.
 *
 * @param props - Component props typed by {@link InterfaceManageTagModalProps}.
 * @remarks
 * `props.open` controls visibility, `props.tag` is the selected tag,
 * `props.onClose` closes the modal, `props.onRefetch` refreshes tag data,
 * and the `*TestId` props provide stable selectors.
 * @returns JSX element rendering save/delete controls for a tag.
 */
const EditTagModal: React.FC<InterfaceManageTagModalProps> = ({
  open,
  tag,
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

  const [tagName, setTagName] = useState('');
  const [tagNameTouched, setTagNameTouched] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (open && tag) {
      setTagName(tag.name);
      setTagNameTouched(false);
    }

    if (!open) {
      setTagName('');
      setTagNameTouched(false);
      setIsDeleteOpen(false);
    }
  }, [open, tag]);

  const tagNameError =
    tagNameTouched && !tagName.trim()
      ? (tCommon('required') as string)
      : undefined;

  const [updateTag, { loading: updateTagLoading }] =
    useMutation(UPDATE_USER_TAG);
  const [deleteTag, { loading: deleteTagLoading }] =
    useMutation(REMOVE_USER_TAG);

  const loading = updateTagLoading || deleteTagLoading;

  const handleUpdateTag = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!tag) return;

    const trimmedName = tagName.trim();
    if (!trimmedName) {
      NotificationToast.error(tCommon('required') as string);
      return;
    }

    if (trimmedName === tag.name) {
      onClose();
      return;
    }

    try {
      await updateTag({
        variables: {
          tagId: tag.id,
          name: trimmedName,
        },
      });

      NotificationToast.success(t('tagUpdationSuccess') as string);
      await onRefetch();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const handleDeleteTag = async (): Promise<void> => {
    if (!tag) return;

    try {
      await deleteTag({
        variables: {
          id: tag.id,
        },
      });

      NotificationToast.success(t('tagRemovalSuccess') as string);
      await onRefetch();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const submitDisabled = useMemo(() => Boolean(tagNameError), [tagNameError]);

  const handleDeleteConfirm = async (): Promise<void> => {
    await handleDeleteTag();
    setIsDeleteOpen(false);
  };

  return (
    <>
      <EditModal
        open={open}
        title={t('tagDetailsModal') as string}
        onClose={onClose}
        onSubmit={handleUpdateTag}
        loading={loading}
        submitDisabled={submitDisabled}
        data-testid={modalTestId}
        id="crud-edit-tag-form"
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
                style={{ marginRight: '8px' }}
              />
              {tCommon('delete') as string}
            </Button>
            <Button
              type="submit"
              form="crud-edit-tag-form"
              variant="primary"
              disabled={loading || submitDisabled}
            >
              <i
                className="fa fa-edit"
                style={{ marginRight: '8px' }}
              />
              {tCommon('save') as string}
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <FormTextField
            name="managedTagName"
            label={t('tagLabel') as string}
            placeholder={t('tagNamePlaceholderInFolder') as string}
            value={tagName}
            onChange={(value) => {
              setTagName(value);
              if (!tagNameTouched) setTagNameTouched(true);
            }}
            onBlur={() => setTagNameTouched(true)}
            touched={tagNameTouched}
            error={tagNameError}
            required
            data-testid={inputTestId}
            autoComplete="off"
          />
        </div>
      </EditModal>

      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={t('deleteTagTitle') as string}
        onDelete={handleDeleteConfirm}
        loading={loading}
        entityName={tag?.name}
        data-testid={deleteModalTestId}
      >
        <p>{t('deleteTagConfirm') as string}</p>
      </DeleteModal>
    </>
  );
};

export default EditTagModal;
