/**
 * AgendaCategoryPreviewModal Component
 *
 * This component renders a modal to preview the details of an agenda category.
 * It displays the name, description, and creator of the agenda category, and
 * provides options to edit or delete the category.
 *
 * @component
 * @param {InterfaceAgendaCategoryPreviewModalProps} props - The props for the component.
 * @param {boolean} props.agendaCategoryPreviewModalIsOpen - Determines if the modal is visible.
 * @param {() => void} props.hidePreviewModal - Function to close the modal.
 * @param {() => void} props.showUpdateModal - Function to open the update modal.
 * @param {() => void} props.toggleDeleteModal - Function to toggle the delete modal.
 * @param {InterfaceFormStateType} props.formState - The state containing agenda category details.
 * @param {string} props.formState.name - The name of the agenda category.
 * @param {string} props.formState.description - The description of the agenda category.
 * @param {string} props.formState.createdBy - The creator of the agenda category.
 * @param {(key: string) => string} props.t - Translation function for localization.
 *
 * @returns {JSX.Element} The rendered AgendaCategoryPreviewModal component.
 *
 * @example
 * <AgendaCategoryPreviewModal
 *   agendaCategoryPreviewModalIsOpen={true}
 *   hidePreviewModal={handleHide}
 *   showUpdateModal={handleShowUpdate}
 *   toggleDeleteModal={handleToggleDelete}
 *   formState={{ name: 'Meeting', description: 'Monthly meeting', createdBy: 'Admin' }}
 *   t={(key) => key}
 * />
 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Modal, Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';

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
    <Modal
      className={styles.campaignModal}
      show={agendaCategoryPreviewModalIsOpen}
      onHide={hidePreviewModal}
    >
      <Modal.Header>
        <p className={styles.titlemodalOrganizationEvents}>
          {t('agendaCategoryDetails')}
        </p>
        <Button
          onClick={hidePreviewModal}
          data-testid="previewAgendaCategoryModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
    </Modal>
  );
};

export default AgendaCategoryPreviewModal;
