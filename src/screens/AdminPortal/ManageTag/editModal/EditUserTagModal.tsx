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
import { Button, Form } from 'react-bootstrap';
import { BaseModal } from 'shared-components/BaseModal';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
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
      <Form
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
        <FormFieldGroup
          name="tagName"
          label={t('tagName')}
          required
          touched={isTouched}
          error={errorMessage}
        >
          <Form.Control
            id="tagName"
            type="text"
            className={`mb-3 ${styles.inputField}`}
            placeholder={t('tagNamePlaceholder')}
            data-testid="tagNameInput"
            autoComplete="off"
            required
            value={newTagName}
            isInvalid={isTouched && isTagNameInvalid}
            ref={tagNameRef}
            onBlur={() => setIsTouched(true)}
            onChange={(e): void => {
              setNewTagName(e.target.value);
            }}
          />
        </FormFieldGroup>
      </Form>
    </BaseModal>
  );
};

export default EditUserTagModal;
