/**
 * AgendaItemsDeleteModal Component
 *
 * This component renders a modal dialog for confirming the deletion of an agenda item.
 * It provides a user-friendly interface to either confirm or cancel the deletion action.
 */
import React from 'react';
import { Button } from 'react-bootstrap';
import BaseModal from 'components/BaseModal/BaseModal';
import styles from 'style/app-fixed.module.css';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/Agenda/interface';

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
      useDefaultHeaderStyle={false}
      footer={
        <>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteModal}
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
