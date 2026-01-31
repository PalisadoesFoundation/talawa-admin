import React from 'react';
import { BaseModal } from 'shared-components/BaseModal';
import Button from 'shared-components/Button/Button';
import styles from './AgendaItemsDeleteModal.module.css';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/AdminPortal/Agenda/interface';
import { useMutation } from '@apollo/client';
import { DELETE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

/**
 * Confirmation modal for deleting an agenda item.
 *
 * @param isOpen - Whether the delete modal is visible.
 * @param onClose - Closes the modal.
 * @param agendaItemId - ID of the agenda item to delete.
 * @param refetchAgendaFolder - Refetches agenda folders after deletion.
 * @param t - Translation function for agenda section keys.
 * @param tCommon - Translation function for common keys.
 *
 * @returns JSX.Element
 */
// translation-check-keyPrefix: agendaSection
const AgendaItemsDeleteModal: React.FC<
  InterfaceAgendaItemsDeleteModalProps
> = ({ isOpen, onClose, agendaItemId, t, tCommon, refetchAgendaFolder }) => {
  const [deleteAgendaItem] = useMutation(DELETE_AGENDA_ITEM_MUTATION);

  const deleteAgendaItemHandler = async (): Promise<void> => {
    try {
      await deleteAgendaItem({
        variables: {
          input: { id: agendaItemId },
        },
      });

      NotificationToast.success(t('agendaItemDeleted') as string);
      refetchAgendaFolder();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  return (
    <BaseModal
      size="sm"
      title={t('deleteAgendaItem')}
      className={styles.agendaItemModal}
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      dataTestId="deleteAgendaItemModal"
      headerClassName="bg-primary text-white"
      footer={
        <>
          <Button
            type="button"
            className="btn btn-danger"
            onClick={onClose}
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
