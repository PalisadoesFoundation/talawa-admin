import type { TFunction } from 'i18next';
import type { FormEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
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
/**
 * EditUserTagModal
 *
 * A modal form that allows administrators to edit existing user tags.
 *
 * @param editUserTagModalIsOpen - Boolean to control modal visibility
 * @param hideEditUserTagModal - Function to close the modal
 * @param newTagName - The current value of the tag name being edited
 * @param handleEditUserTag - Function to save the changes
 * @param setNewTagName - Function to update the tag name state
 * @param t - Translation function
 * @param tCommon - Common translation function
 */
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
      title={t('tagDetails')}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={hideEditUserTagModal}
            data-testid="closeEditTagModalBtn"
            className={styles.removeButton}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            type="submit"
            form="edit-user-tag-form"
            data-testid="editTagSubmitBtn"
            className={styles.addButton}
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
