import type { TFunction } from 'i18next';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from '../../style/app.module.css';
/**
 * Unassign UserTag Modal component for the Manage Tag screen.
 */

export interface InterfaceUnassignUserTagModalProps {
  unassignUserTagModalIsOpen: boolean;
  toggleUnassignUserTagModal: () => void;
  handleUnassignUserTag: () => Promise<void>;
  t: TFunction<'translation', 'manageTag' | 'memberDetail'>;
  tCommon: TFunction<'common', undefined>;
}

const UnassignUserTagModal: React.FC<InterfaceUnassignUserTagModalProps> = ({
  unassignUserTagModalIsOpen,
  toggleUnassignUserTagModal,
  handleUnassignUserTag,
  t,
  tCommon,
}) => {
  return (
    <>
      <Modal
        size="sm"
        id="unassignTagModal"
        show={unassignUserTagModalIsOpen}
        onHide={toggleUnassignUserTagModal}
        backdrop="static"
        keyboard={false}
        centered
        aria-labelledby="unassignTagModalTitle"
      >
        <Modal.Header
          closeButton
          className={styles.modalHeader}
          aria-label={t('closeModal')}
        >
          <Modal.Title className="text-white" id={`unassignTag`}>
            {t('unassignUserTag')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('unassignUserTagMessage')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className={`btn btn-danger ${styles.removeButton}`}
            data-dismiss="modal"
            onClick={toggleUnassignUserTagModal}
            data-testid="unassignTagModalCloseBtn"
            aria-label={tCommon('no')}
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className={`btn ${styles.addButton}`}
            onClick={async (e) => {
              const btn = e.currentTarget;
              btn.disabled = true;
              try {
                await handleUnassignUserTag();
              } finally {
                btn.disabled = false;
              }
            }}
            data-testid="unassignTagModalSubmitBtn"
            aria-label={tCommon('yes')}
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UnassignUserTagModal;
