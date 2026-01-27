import React from 'react';
import { BaseModal } from 'shared-components/BaseModal';
import Button from 'shared-components/Button/Button';
import styles from 'style/app-fixed.module.css';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/Agenda/interface';
const AgendaItemDeleteModal: React.FC<InterfaceAgendaItemsDeleteModalProps> = ({
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

export default AgendaItemDeleteModal;
