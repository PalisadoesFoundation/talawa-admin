import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

import { DELETE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

import type { InterfaceAgendaItemsDeleteModalProps } from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaItemsDeleteModal
 *
 * Confirmation modal for deleting an agenda item.
 * Uses the shared `DeleteModal` for standardized delete behavior.
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param agendaItemId - ID of the agenda item to delete
 * @param refetchAgendaFolder - Refetches agenda folder data after deletion
 * @param t - i18n translation function
 *
 * @returns JSX.Element
 */
// translation-check-keyPrefix: agendaSection
const AgendaItemsDeleteModal: React.FC<
  InterfaceAgendaItemsDeleteModalProps
> = ({ isOpen, onClose, agendaItemId, refetchAgendaFolder }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const [deleteAgendaItem] = useMutation(DELETE_AGENDA_ITEM_MUTATION);

  /**
   * Deletes the selected agenda item and refreshes agenda data on success.
   * Shows user feedback for both success and error states.
   */
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
    } catch (err) {
      if (err instanceof Error) {
        NotificationToast.error(err.message);
      }
    }
  };

  return (
    <DeleteModal
      open={isOpen}
      title={t('deleteAgendaItem')}
      onClose={onClose}
      onDelete={deleteAgendaItemHandler}
      data-testid="deleteAgendaItemModal"
    >
      <p>{t('deleteAgendaItemMsg')}</p>
    </DeleteModal>
  );
};

export default AgendaItemsDeleteModal;
