import type { TFunction } from 'i18next';
import type { FormEvent } from 'react';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from '../../style/app.module.css';

/**
 * Edit UserTag Modal component for the Manage Tag screen.
 */

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
