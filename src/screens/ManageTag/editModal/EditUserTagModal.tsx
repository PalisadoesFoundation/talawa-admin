/**
 * EditUserTagModal Component
 *
 * This component renders a modal for editing user tags. It provides a form
 * where users can input a new tag name and submit it for editing. The modal
 * includes validation to ensure the tag name is not empty before submission.
 *
 * @component
 * @param {InterfaceEditUserTagModalProps} props - The props for the component.
 * @param {boolean} props.editUserTagModalIsOpen - Determines if the modal is visible.
 * @param {() => void} props.hideEditUserTagModal - Function to close the modal.
 * @param {string} props.newTagName - The current value of the tag name input field.
 * @param {(state: React.SetStateAction<string>) => void} props.setNewTagName - Function to update the tag name state.
 * @param {(e: FormEvent<HTMLFormElement>) => Promise<void>} props.handleEditUserTag - Function to handle the form submission for editing the tag.
 * @param {TFunction<'translation', 'manageTag'>} props.t - Translation function for the "manageTag" namespace.
 * @param {TFunction<'common', undefined>} props.tCommon - Translation function for common terms.
 *
 * @returns {React.FC} A React functional component that renders the edit user tag modal.
 *
 * @example
 * ```tsx
 * <EditUserTagModal
 *   editUserTagModalIsOpen={true}
 *   hideEditUserTagModal={closeModalHandler}
 *   newTagName={tagName}
 *   setNewTagName={setTagName}
 *   handleEditUserTag={submitHandler}
 *   t={t}
 *   tCommon={tCommon}
 * />
 * ```
 */
import type { TFunction } from 'i18next';
import type { FormEvent } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
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

const EditUserTagModal: React.FC<InterfaceEditUserTagModalProps> = ({
  editUserTagModalIsOpen,
  hideEditUserTagModal,
  newTagName,
  handleEditUserTag,
  setNewTagName,
  t,
  tCommon,
}) => {
  return (
    <>
      <Modal
        show={editUserTagModalIsOpen}
        onHide={hideEditUserTagModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        aria-describedby="tag-edit-modal-description"
        centered
      >
        <Modal.Header
          className={styles.modalHeader}
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title className="text-white">{t('tagDetails')}</Modal.Title>
        </Modal.Header>
        <Form
          onSubmitCapture={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            if (newTagName.trim()) {
              handleEditUserTag(e);
            }
          }}
        >
          <Modal.Body>
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
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(): void => hideEditUserTagModal()}
              data-testid="closeEditTagModalBtn"
              className={styles.removeButton}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              value="invite"
              data-testid="editTagSubmitBtn"
              className={styles.addButton}
            >
              {tCommon('edit')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EditUserTagModal;
