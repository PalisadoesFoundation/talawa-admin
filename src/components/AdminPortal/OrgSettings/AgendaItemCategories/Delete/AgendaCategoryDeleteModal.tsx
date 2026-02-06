/**
 * AgendaCategoryDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an agenda category.
 * It provides options to either confirm or cancel the deletion action.
 */
// translation-check-keyPrefix: organizationAgendaCategory
import React from 'react';
import styles from 'style/app-fixed.module.css';
import { DeleteModal } from 'shared-components/CRUDModalTemplate';

interface InterfaceAgendaCategoryDeleteModalProps {
  agendaCategoryDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaCategoryHandler: () => Promise<void>;
  loading?: boolean;
  t: (key: string) => string;
}

const AgendaCategoryDeleteModal: React.FC<
  InterfaceAgendaCategoryDeleteModalProps
> = ({
  agendaCategoryDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaCategoryHandler,
  loading = false,
  t,
}) => {
  return (
    <DeleteModal
      open={agendaCategoryDeleteModalIsOpen}
      onClose={toggleDeleteModal}
      onDelete={deleteAgendaCategoryHandler}
      loading={loading}
      title={t('deleteAgendaCategory')}
      className={styles.campaignModal}
      data-testid="agenda-category-delete-modal"
    >
      <p>{t('deleteAgendaCategoryMsg')}</p>
    </DeleteModal>
  );
};

export default AgendaCategoryDeleteModal;
