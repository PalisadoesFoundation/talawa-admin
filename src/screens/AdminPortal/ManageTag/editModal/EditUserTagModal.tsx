/**
 * EditUserTagModal component.
 *
 * This component renders a modal for editing user tags. It provides a form
 * where users can input a new tag name and submit it for editing. The modal
 * includes validation to ensure the tag name is not empty before submission.
 *
 * @param props - Component props defined by InterfaceEditUserTagModalProps.
 *
 * @remarks
 * - Uses translation functions for the "manageTag" namespace and common labels.
 * - Prevents submitting an empty tag name.
 *
 * @example
 * Example usage:
 * - editUserTagModalIsOpen: true
 * - hideEditUserTagModal: closeModalHandler
 * - newTagName: tagName
 * - setNewTagName: setTagName
 * - handleEditUserTag: submitHandler
 * - t: t
 * - tCommon: tCommon
 *
 * @returns The rendered edit user tag modal.
 */
// translation-check-keyPrefix: manageTag
import type { TFunction } from 'i18next';
import type { FormEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'shared-components/Button';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import styles from './EditUserTagModal.module.css';

export interface InterfaceEditUserTagModalProps {
  editUserTagModalIsOpen: boolean;
  hideEditUserTagModal: () => void;
  newTagName: string;
  setNewTagName: (state: React.SetStateAction<string>) => void;
  handleEditUserTag: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  t: TFunction<'translation', 'manageTag'>;
  tCommon: TFunction<'common', undefined>;
}

const EditUserTagModal: React.FC<InterfaceEditUserTagModalProps> = ({
  editUserTagModalIsOpen,
  hideEditUserTagModal,
  newTagName,
  handleEditUserTag,
  setNewTagName,
  t,
  tCommon,
}) => {
  const formId = 'edit-user-tag-form';
  const [isTouched, setIsTouched] = useState(false);
  const tagNameRef = useRef<HTMLInputElement | null>(null);

  // Reset touched state when modal opens to prevent stale validation errors
  useEffect(() => {
    if (editUserTagModalIsOpen) {
      setIsTouched(false);
    }
  }, [editUserTagModalIsOpen]);

  const isTagNameInvalid = !newTagName.trim();

  return (
    <CRUDModalTemplate
      open={editUserTagModalIsOpen}
      onClose={hideEditUserTagModal}
      title={t('tagDetails')}
      header-testId="modalOrganizationHeader"
      customFooter={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={(): void => hideEditUserTagModal()}
            data-testid="closeEditTagModalBtn"
            className={styles.removeButton}
            aria-label={tCommon('cancel')}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            type="submit"
            form={formId}
            value="invite"
            data-testid="editTagSubmitBtn"
            className={styles.addButton}
            aria-label={tCommon('edit')}
          >
            {tCommon('edit')}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        onSubmitCapture={async (
          e: FormEvent<HTMLFormElement>,
        ): Promise<void> => {
          e.preventDefault();
          setIsTouched(true);

          if (isTagNameInvalid) {
            // Focus the input for screen readers
            tagNameRef.current?.focus();
            return;
          }

          await handleEditUserTag(e);
        }}
      >
        <FormTextField
          name="tagName"
          label={t('tagName')}
          placeholder={t('tagNamePlaceholder')}
          value={newTagName}
          required
          data-testid="tagNameInput"
          className={`mb-3 ${styles.inputField}`}
          error={isTagNameInvalid ? t('invalidTagName') : undefined}
          touched={isTouched}
          inputId="tagName"
          onBlur={() => setIsTouched(true)}
          onChange={(v) => setNewTagName(v)}
        />
      </form>
    </CRUDModalTemplate>
  );
};

export default EditUserTagModal;
