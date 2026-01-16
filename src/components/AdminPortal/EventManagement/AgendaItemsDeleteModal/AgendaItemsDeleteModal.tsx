import React from 'react';
import { Button } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from 'style/app-fixed.module.css';
import { InterfaceAgendaItemsDeleteModalProps } from 'types/components/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface';

/**
 * AgendaItemsDeleteModal
 *
 * A modal component for confirming the deletion of an agenda item.
 *
 * @param agendaItemDeleteModalIsOpen - Boolean to control modal visibility
 * @param toggleDeleteModal - Function to close the modal
 * @param deleteAgendaItemHandler - Function to execute the deletion logic
 * @param t - Translation function
 * @param tCommon - Common translation function
 */
const AgendaItemsDeleteModal: React.FC<
  InterfaceAgendaItemsDeleteModalProps
> = ({
  agendaItemDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaItemHandler,
  t,
  tCommon,
}) => {
  return (
    <BaseModal
      show={agendaItemDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      title={t('deleteAgendaItem')}
      size="sm"
      className={styles.agendaItemModal}
      headerClassName="bg-primary"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={toggleDeleteModal}
            data-testid="deleteAgendaItemCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            variant="danger"
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