/**
 * AgendaItemsDeleteModal Component
 *
 * This component renders a modal dialog for confirming the deletion of an agenda item.
 * It provides a user-friendly interface to either confirm or cancel the deletion action.
 *
 * @param props - The props for the component:-
 * - agendaItemDeleteModalIsOpen - Determines whether the modal is open or closed.
 * - toggleDeleteModal - Function to toggle the visibility of the modal.
 * - deleteAgendaItemHandler - Function to handle the deletion of the agenda item.
 * - t - Translation function for agenda-specific text.
 * - tCommon - Translation function for common text (e.g., "yes", "no").
 *
 * @returns A modal dialog with options to confirm or cancel the deletion of an agenda item.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for styling and functionality.
 * - The `t` and `tCommon` props are used for internationalization (i18n).
 * - The modal is styled using a CSS module (`app-fixed.module.css`).
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
import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BaseModal } from 'shared-components/BaseModal';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import styles from 'style/app-fixed.module.css';
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
  const { t: tErrors } = useTranslation('errors');

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <BaseModal
        size="sm"
        className={styles.agendaItemModal}
        show={agendaItemDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
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
        headerClassName="bg-primary"
        title={t('deleteAgendaItem')}
      >
        <p>{t('deleteAgendaItemMsg')}</p>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
};

export default AgendaItemsDeleteModal;
