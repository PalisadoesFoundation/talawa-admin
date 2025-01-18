import type { TFunction } from 'i18next';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from '../../style/app.module.css';

/**
 * Remove UserTag Modal component for the Manage Tag screen.
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.modalHeader`
 * - `.removeButton`
 * - `.addButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */

export interface InterfaceRemoveUserTagModalProps {
  removeUserTagModalIsOpen: boolean;
  toggleRemoveUserTagModal: () => void;
  handleRemoveUserTag: () => Promise<void>;
  t: TFunction<'translation', 'manageTag'>;
  tCommon: TFunction<'common', undefined>;
}

const RemoveUserTagModal: React.FC<InterfaceRemoveUserTagModalProps> = ({
  removeUserTagModalIsOpen,
  toggleRemoveUserTagModal,
  handleRemoveUserTag,
  t,
  tCommon,
}) => {
  return (
    <>
      <Modal
        size="sm"
        id="removeUserTagModal"
        aria-describedby="removeUserTagMessage"
        show={removeUserTagModalIsOpen}
        onHide={toggleRemoveUserTagModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className="text-white" id="removeUserTag">
            {t('removeUserTag')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="removeUserTagMessage">
          {t('removeUserTagMessage')}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className={`btn btn-danger ${styles.removeButton}`}
            data-dismiss="modal"
            role="button"
            aria-label={tCommon('no')}
            onClick={toggleRemoveUserTagModal}
            data-testid="removeUserTagModalCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className={`btn ${styles.addButton}`}
            role="button"
            aria-label={tCommon('yes')}
            onClick={handleRemoveUserTag}
            data-testid="removeUserTagSubmitBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RemoveUserTagModal;
