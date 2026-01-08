/**
 * AgendaCategoryPreviewModal Component
 *
 * This component renders a modal to preview the details of an agenda category.
 * It displays the name, description, and creator of the agenda category, and
 * provides options to edit or delete the category.
 *
 * @param props - The props for the component.
 * @param agendaCategoryPreviewModalIsOpen - Determines if the modal is visible.
 * @param hidePreviewModal - Function to close the modal.
 * @param showUpdateModal - Function to open the update modal.
 * @param toggleDeleteModal - Function to toggle the delete modal.
 * @param formState - The state containing agenda category details.
 * @param name - The name of the agenda category.
 * @param description - The description of the agenda category.
 * @param createdBy - The creator of the agenda category.
 * @param t - Translation function for localization.
 *
 * @returns The rendered AgendaCategoryPreviewModal component.
 *
 * @example
 * ```tsx
 * <AgendaCategoryPreviewModal
 *   agendaCategoryPreviewModalIsOpen={true}
 *   hidePreviewModal={handleHide}
 *   showUpdateModal={handleShowUpdate}
 *   toggleDeleteModal={handleToggleDelete}
 *   formState={{ name: 'Meeting', description: 'Monthly meeting', createdBy: 'Admin' }}
 *   t={(key) => key}
 * />
 * ```
 */
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { BaseModal } from 'shared-components/BaseModal';

// translation-check-keyPrefix: organizationAgendaCategory

interface InterfaceFormStateType {
  name: string;
  description: string;
  createdBy: string;
}

interface InterfaceAgendaCategoryPreviewModalProps {
  agendaCategoryPreviewModalIsOpen: boolean;
  hidePreviewModal: () => void;
  showUpdateModal: () => void;
  toggleDeleteModal: () => void;
  formState: InterfaceFormStateType;

  t: (key: string) => string;
}

const AgendaCategoryPreviewModal: React.FC<
  InterfaceAgendaCategoryPreviewModalProps
> = ({
  agendaCategoryPreviewModalIsOpen,
  hidePreviewModal,
  showUpdateModal,
  toggleDeleteModal,
  formState,
  t,
}) => {
  return (
    <BaseModal
      className={styles.campaignModal}
      show={agendaCategoryPreviewModalIsOpen}
      onHide={hidePreviewModal}
      headerContent={
        <p className={styles.titlemodalOrganizationEvents}>
          {t('agendaCategoryDetails')}
        </p>
      }
      dataTestId="agendaCategoryPreviewModal"
    >
      <Form>
        <div>
          <p className={styles.preview}>
            {t('name')}
            <span className={styles.view}>{formState.name}</span>
          </p>
          <p className={styles.preview}>
            {t('description')}
            <span className={styles.view}>{formState.description}</span>
          </p>
          <p className={styles.preview}>
            {t('createdBy')}
            <span className={styles.view}>{formState.createdBy}</span>
          </p>
        </div>
        <div className={styles.iconContainer}>
          <Button
            size="sm"
            data-testid="editAgendaCategoryPreviewModalBtn"
            className={styles.icon}
            onClick={() => {
              showUpdateModal();
              hidePreviewModal();
            }}
          >
            <i className="fas fa-edit"></i>
          </Button>
          <Button
            size="sm"
            className={`${styles.icon} ms-2`}
            data-testid="deleteAgendaCategoryModalBtn"
            onClick={toggleDeleteModal}
            variant="danger"
          >
            <i className="fas fa-trash"></i>
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export default AgendaCategoryPreviewModal;
