/**
 * AgendaItemsDeleteModal Component
 *
 * This component renders a modal dialog for confirming the deletion of an agenda item.
 * It provides a user-friendly interface to either confirm or cancel the deletion action.
 * @param agendaItemDeleteModalIsOpen - Determines whether the modal is open or closed.
 * @param toggleDeleteModal - Function to toggle the visibility of the modal.
 * @param deleteAgendaItemHandler - Function to handle the deletion of the agenda item.
 * @param t - Translation function for agenda-specific text.
 * @param tCommon - Translation function for common text (e.g., "yes", "no").
 *
 * @param agendaItemDeleteModalIsOpen - Determines whether the modal is open or closed.
 * @param toggleDeleteModal - Function to toggle the visibility of the modal.
 * @param deleteAgendaItemHandler - Function to handle the deletion of the agenda item.
 * @param t - Translation function for agenda-specific text.
 * @param tCommon - Translation function for common text (e.g., "yes", "no").
 * @returns A modal dialog with options to confirm or cancel the deletion of an agenda item.
 *
 * @remarks
 * - The modal uses BaseModal from shared-components.
 * - The `t` and `tCommon` props are used for internationalization (i18n).
 *
 * @example
 * ```tsx
 * <AgendaItemsDeleteModal
 *   agendaItemDeleteModalIsOpen={true}
 *   toggleDeleteModal={handleToggleModal}
 *   deleteAgendaItemHandler={handleDeleteAgendaItem}
 *   t={(key) => translations[key]}
 *   tCommon={(key) => commonTranslations[key]}
 * />
 * ```
 */
// translation-check-keyPrefix: agendaItems
import React from 'react';
import Button from 'shared-components/Button/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/AdminPortal/Agenda/interface';

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
      showCloseButton={true}
      dataTestId="deleteAgendaItemModal"
    >
      <p>{t('deleteAgendaItemMsg')}</p>
      <div className="d-flex justify-content-end gap-2">
        <Button
          variant="danger"
          onClick={toggleDeleteModal}
          data-testid="deleteAgendaItemCloseBtn"
        >
          {tCommon('no')}
        </Button>
        <Button
          variant="success"
          onClick={deleteAgendaItemHandler}
          data-testid="deleteAgendaItemBtn"
        >
          {tCommon('yes')}
        </Button>
      </div>
    </BaseModal>
  );
};

export default AgendaItemsDeleteModal;
