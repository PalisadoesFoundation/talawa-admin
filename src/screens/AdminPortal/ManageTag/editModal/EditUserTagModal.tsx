import type { TFunction } from 'i18next';
import type { FormEvent } from 'react';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from 'style/app-fixed.module.css';

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
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newTagName.trim()) {
      handleEditUserTag(e);
    }
  };

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
      <Form id="edit-user-tag-form" onSubmit={handleSubmit}>
        <Form.Label htmlFor="tagName">{t('tagName')}</Form.Label>
        <Form.Control
          type="text"
          id="tagName"
          className={`mb-3 ${styles.inputField}`}
          placeholder={t('tagNamePlaceholder')}
          data-testid="tagNameInput"
          autoComplete="off"
          required
          value={newTagName}
          onChange={(e): void => {
            setNewTagName(e.target.value);
          }}
        />
      </Form>
    </BaseModal>
  );
};

export default EditUserTagModal;
