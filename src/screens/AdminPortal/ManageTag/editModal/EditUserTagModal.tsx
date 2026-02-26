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
 *
 * @returns The rendered edit user tag modal.
 */
// translation-check-keyPrefix: manageTag
import type { FormEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'shared-components/Button/Button';
import { BaseModal } from 'shared-components/BaseModal';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import styles from './EditUserTagModal.module.css';
import { useTranslation } from 'react-i18next';

export interface InterfaceEditUserTagModalProps {
  editUserTagModalIsOpen: boolean;
  hideEditUserTagModal: () => void;
  newTagName: string;
  setNewTagName: (state: React.SetStateAction<string>) => void;
  handleEditUserTag: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

const EditUserTagModal: React.FC<InterfaceEditUserTagModalProps> = ({
  editUserTagModalIsOpen,
  hideEditUserTagModal,
  newTagName,
  handleEditUserTag,
  setNewTagName,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tCommon } = useTranslation('common');

  const formId = 'edit-user-tag-form';
  const [isTouched, setIsTouched] = useState(false);
  const tagNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editUserTagModalIsOpen) {
      setIsTouched(false);
    }
  }, [editUserTagModalIsOpen]);

  const isTagNameInvalid = !newTagName.trim();
  const errorMessage =
    isTouched && isTagNameInvalid ? tCommon('required') : undefined;

  return (
    <BaseModal
      show={editUserTagModalIsOpen}
      onHide={hideEditUserTagModal}
      backdrop="static"
      title={t('tagDetails')}
      headerClassName={styles.modalHeader}
      headerTestId="modalOrganizationHeader"
      footer={
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
        onSubmit={async (e: FormEvent<HTMLFormElement>): Promise<void> => {
          e.preventDefault();
          setIsTouched(true);

          if (isTagNameInvalid) {
            tagNameRef.current?.focus();
            return;
          }

          await handleEditUserTag(e);
        }}
      >
        <FormFieldGroup
          name="tagName"
          label={t('tagName')}
          required
          touched={isTouched}
          error={errorMessage}
        >
          <input
            id="tagName"
            type="text"
            className={`form-control mb-3 ${styles.inputField}`}
            placeholder={t('tagNamePlaceholder')}
            data-testid="tagNameInput"
            autoComplete="off"
            required
            value={newTagName}
            ref={tagNameRef}
            onBlur={() => setIsTouched(true)}
            onChange={(e): void => {
              setNewTagName(e.target.value);
            }}
          />
        </FormFieldGroup>
      </form>
    </BaseModal>
  );
};

export default EditUserTagModal;
