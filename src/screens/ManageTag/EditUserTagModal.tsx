import type { FormEvent } from 'react';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

/**
 * Edit UserTag Modal component for the Manage Tag screen.
 */

export interface InterfaceEditUserTagModalProps {
  editTagModalIsOpen: boolean;
  hideEditTagModal: () => void;
  newTagName: string;
  setNewTagName: (state: React.SetStateAction<string>) => void;
  handleEditUserTag: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

const EditUserTagModal: React.FC<InterfaceEditUserTagModalProps> = ({
  editTagModalIsOpen,
  hideEditTagModal,
  newTagName,
  handleEditUserTag,
  setNewTagName,
  t,
  tCommon,
}) => {
  return (
    <>
      <Modal
        show={editTagModalIsOpen}
        onHide={hideEditTagModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className="bg-primary"
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title className="text-white">{t('tagDetails')}</Modal.Title>
        </Modal.Header>
        <Form onSubmitCapture={handleEditUserTag}>
          <Modal.Body>
            <Form.Label htmlFor="tagName">{t('tagName')}</Form.Label>
            <Form.Control
              type="text"
              id="tagName"
              className="mb-3"
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
              onClick={(): void => hideEditTagModal()}
              data-testid="closeEditTagModalBtn"
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" value="invite" data-testid="editTagSubmitBtn">
              {tCommon('edit')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EditUserTagModal;
