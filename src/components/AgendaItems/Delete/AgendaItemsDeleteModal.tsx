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
 * @returns - A modal dialog with options to confirm or cancel the deletion of an agenda item.
 *
 * @remarks
 * - The modal uses BaseModal from shared-components for styling and functionality.
 * - The `t` and `tCommon` props are used for internationalization (i18n).
 * - The modal is styled using a CSS module (AgendaItemsDeleteModal.module.css).
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
import { BaseModal } from 'shared-components/BaseModal';
import Button from 'shared-components/Button';
import styles from './AgendaItemsDeleteModal.module.css';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/Agenda/interface';

// translation-check-keyPrefix: agendaItems

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
      size="sm"
      className={styles.agendaItemModal}
      title={t('deleteAgendaItem')}
      keyboard={false}
      backdrop="static"
      showCloseButton={true}
      headerClassName="bg-primary text-white"
      footer={
        <>
          <Button
            type="button"
            variant="danger"
            onClick={toggleDeleteModal}
            data-testid="deleteAgendaItemCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            variant="success"
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
