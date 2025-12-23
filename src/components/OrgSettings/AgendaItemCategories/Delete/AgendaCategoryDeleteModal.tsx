/**
 * AgendaCategoryDeleteModal Component
 *
 * Renders a confirmation modal for deleting an agenda category.
 *
 * @component
 * @param {InterfaceAgendaCategoryDeleteModalProps} props - Props including visibility, toggle, handler, translations.
 *
 * @example
 * <AgendaCategoryDeleteModal
 *   agendaCategoryDeleteModalIsOpen={true}
 *   toggleDeleteModal={handleToggle}
 *   deleteAgendaCategoryHandler={handleDelete}
 *   t={tFunction}
 *   tCommon={tCommonFunction}
 * />
 */
import React from 'react';
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
  return (
    <BaseModal
      show={agendaCategoryDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      size="sm"
      className={styles.campaignModal}
      backdrop="static"
      keyboard={false}
      headerClassName="bg-primary"
      closeButtonVariant="light"
      aria-labelledby="deleteAgendaCategory"
      headerContent={
        <h5 className="modal-title text-white" id="deleteAgendaCategory">
          {t('deleteAgendaCategory')}
        </h5>
      }
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
            onClick={deleteAgendaCategoryHandler}
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
