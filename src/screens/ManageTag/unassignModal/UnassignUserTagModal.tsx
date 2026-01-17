/**
 * A React functional component that renders a modal for unassigning a user tag.
 * This modal provides a confirmation dialog with "Yes" and "No" options.
 *
 * @component
 * @param {InterfaceUnassignUserTagModalProps} props - The props for the component.
 * @param {boolean} props.unassignUserTagModalIsOpen - Determines if the modal is open or closed.
 * @param {() => void} props.toggleUnassignUserTagModal - Function to toggle the modal's visibility.
 * @param {() => Promise<void>} props.handleUnassignUserTag - Async function to handle the unassigning of a user tag.
 * @param {TFunction<'translation', 'manageTag' | 'memberDetail'>} props.t - Translation function for localized strings specific to the modal.
 * @param {TFunction<'common', undefined>} props.tCommon - Translation function for common localized strings.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @remarks
 * - The modal is styled using Bootstrap and custom CSS classes from `app-fixed.module.css`.
 * - The "Yes" button is disabled while the `handleUnassignUserTag` function is executing.
 * - Accessibility attributes such as `aria-label` are used for better screen reader support.
 *
 * @example
 * ```tsx
 * <UnassignUserTagModal
 *   unassignUserTagModalIsOpen={true}
 *   toggleUnassignUserTagModal={() => console.log('Toggle modal')}
 *   handleUnassignUserTag={async () => console.log('Unassign user tag')}
 *   t={(key) => key}
 *   tCommon={(key) => key}
 * />
 * ```
 */
import type { TFunction } from 'i18next';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';

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
