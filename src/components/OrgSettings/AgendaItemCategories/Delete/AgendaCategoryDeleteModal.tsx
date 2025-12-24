/**
 * AgendaCategoryDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an agenda category.
 * It provides options to either confirm or cancel the deletion action.
 *
 * @component
 * @param {InterfaceAgendaCategoryDeleteModalProps} props - The props for the component.
 * @param {boolean} props.agendaCategoryDeleteModalIsOpen - Determines if the modal is open or closed.
 * @param {() => void} props.toggleDeleteModal - Function to toggle the visibility of the modal.
 * @param {() => Promise<void>} props.deleteAgendaCategoryHandler - Async function to handle the deletion of the agenda category.
 * @param {(key: string) => string} props.t - Translation function for component-specific strings.
 * @param {(key: string) => string} props.tCommon - Translation function for common strings.
 *
 * @returns {React.FC} A React functional component that renders the delete confirmation modal.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for styling and functionality.
 * - The `t` and `tCommon` props are used for internationalization (i18n).
 * - The modal is styled using a CSS module imported as `styles`.
 *
 * @example
 * ```tsx
 * <AgendaCategoryDeleteModal
 *   agendaCategoryDeleteModalIsOpen={true}
 *   toggleDeleteModal={handleToggle}
 *   deleteAgendaCategoryHandler={handleDelete}
 *   t={(key) => translations[key]}
 *   tCommon={(key) => commonTranslations[key]}
 * />
 * ```
 */
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { BaseModal } from 'shared-components/BaseModal';

interface InterfaceAgendaCategoryDeleteModalProps {
  agendaCategoryDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaCategoryHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

const AgendaCategoryDeleteModal: React.FC<
  InterfaceAgendaCategoryDeleteModalProps
> = ({
  agendaCategoryDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaCategoryHandler,
  t,
  tCommon,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmDelete = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await deleteAgendaCategoryHandler();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      show={agendaCategoryDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      size="sm"
      className={styles.campaignModal}
      backdrop="static"
      keyboard={false}
      title={t('deleteAgendaCategory')}
      headerClassName="bg-primary text-white"
      closeButtonVariant="light"
      dataTestId="agenda-category-delete-modal"
      footer={
        <>
          <Button
            type="button"
            className="btn btn-danger"
            onClick={toggleDeleteModal}
            data-testid="deleteAgendaCategoryCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={onConfirmDelete}
            disabled={isSubmitting}
            data-testid="deleteAgendaCategoryBtn"
          >
            {tCommon('yes')}
          </Button>
        </>
      }
    >
      <p>{t('deleteAgendaCategoryMsg')}</p>
    </BaseModal>
  );
};

export default AgendaCategoryDeleteModal;
