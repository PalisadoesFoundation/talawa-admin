import React from 'react';
import { Modal } from 'react-bootstrap';
import styles from 'components/ActionItems/ActionItemsWrapper.module.css';
import { ActionItemsModalBody } from './ActionItemsModalBody';
import { useTranslation } from 'react-i18next';

/**
 * Interface defining the props for the ActionItemsModal component.
 */
export interface InterfaceModalProp {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
}

/**
 * ActionItemsModal component displays a modal containing action items for a specific event within an organization.
 * It includes a header with a title and a body that renders the ActionItemsModalBody component.
 *
 * @param props - The props for the ActionItemsModal component.
 * @param show - Indicates whether the modal is visible.
 * @param eventId - Event ID related to the action items.
 * @param orgId - Organization ID related to the action items.
 * @param handleClose - Function to handle closing the modal.
 *
 *
 * @example
 * ```tsx
 * <ActionItemsModal
 *   show={true}
 *   eventId="event123"
 *   orgId="org456"
 *   handleClose={() => setShowModal(false)}
 * />
 * ```
 * This example renders the `ActionItemsModal` component with the modal shown, using specific event and organization IDs, and a function to handle closing the modal.
 */
export const ActionItemsModal = (props: InterfaceModalProp): JSX.Element => {
  const { show, eventId, orgId, handleClose } = props;
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        dialogClassName={styles.actionItemsModal}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" data-testid="modal-title">
            {t('eventActionItems')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActionItemsModalBody organizationId={orgId} eventId={eventId} />
        </Modal.Body>
      </Modal>
    </>
  );
};
