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
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { BaseModal } from 'shared-components/BaseModal';
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
        onSubmitCapture={(e: FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
          if (newTagName.trim()) {
            handleEditUserTag(e);
          }
        }}
      >
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
