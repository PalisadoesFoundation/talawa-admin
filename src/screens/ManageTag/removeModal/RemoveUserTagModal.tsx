/**
 * A React functional component that renders a modal for confirming the removal of a user tag.
 * This modal is designed to be used in the "Manage Tag" section of the application.
 *
 * @component
 * @param {InterfaceRemoveUserTagModalProps} props - The props for the component.
 * @param {boolean} props.removeUserTagModalIsOpen - Determines whether the modal is visible.
 * @param {() => void} props.toggleRemoveUserTagModal - Function to toggle the visibility of the modal.
 * @param {() => Promise<void>} props.handleRemoveUserTag - Async function to handle the removal of a user tag.
 * @param {TFunction<'translation', 'manageTag'>} props.t - Translation function for the "manageTag" namespace.
 * @param {TFunction<'common', undefined>} props.tCommon - Translation function for common terms.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for styling and functionality.
 * - The `t` and `tCommon` props are used for internationalization (i18n) support.
 * - The modal includes two buttons:
 *   - A "No" button to close the modal without performing any action.
 *   - A "Yes" button to confirm the removal of the user tag.
 *
 * @example
 * ```tsx
 * <RemoveUserTagModal
 *   removeUserTagModalIsOpen={true}
 *   toggleRemoveUserTagModal={handleToggle}
 *   handleRemoveUserTag={handleRemove}
 *   t={tFunction}
 *   tCommon={tCommonFunction}
 * />
 * ```
 */
import type { TFunction } from 'i18next';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';

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
