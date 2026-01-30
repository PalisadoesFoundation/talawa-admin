import React from 'react';
import { BaseModal } from 'shared-components/BaseModal';
import Button from 'shared-components/Button/Button';
import styles from './AgendaItemsDeleteModal.module.css';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/AdminPortal/Agenda/interface';

/**
 * Confirmation modal for deleting an agenda item.
 * @param agendaItemDeleteModalIsOpen - Whether the delete modal is visible.
 * @param toggleDeleteItemModal - Closes the delete modal.
 * @param deleteAgendaItemHandler - Executes the delete operation.
 * @param t - Translation function for agenda section keys.
 * @param tCommon - Translation function for common keys.
 * @returns JSX.Element
 */
// translation-check-keyPrefix: agendaSection
const AgendaItemsDeleteModal: React.FC<
  InterfaceAgendaItemsDeleteModalProps
> = ({
  agendaItemDeleteModalIsOpen,
  toggleDeleteItemModal,
  deleteAgendaItemHandler,
  t,
  tCommon,
}) => {
  return (
    <BaseModal
      size="sm"
      title={t('deleteAgendaItem')}
      className={styles.agendaItemModal}
      show={agendaItemDeleteModalIsOpen}
      onHide={toggleDeleteItemModal}
      backdrop="static"
      keyboard={false}
      dataTestId="deleteAgendaItemModal"
      headerClassName="bg-primary text-white"
      footer={
        <>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteItemModal}
            data-testid="deleteAgendaItemCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteAgendaItemHandler}
            data-testid="deleteAgendaItemBtn"
          >
            {tCommon('yes')}
          </Button>
        </>
      }
    >
      <p>{t('deleteAgendaItemMsg')}</p>
    </BaseModal>
  );
};

export default AgendaItemsDeleteModal;
