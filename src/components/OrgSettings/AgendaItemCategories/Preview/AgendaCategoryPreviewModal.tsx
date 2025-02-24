import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

import styles from 'style/app.module.css';

/**
 * InterfaceFormStateType is an object containing the form state
 */
interface InterfaceFormStateType {
  name: string;
  description: string;
  createdBy: string;
}

/**
 * InterfaceAgendaCategoryPreviewModalProps is an object containing the props for AgendaCategoryPreviewModal component
 */
interface InterfaceAgendaCategoryPreviewModalProps {
  agendaCategoryPreviewModalIsOpen: boolean;
  hidePreviewModal: () => void;
  showUpdateModal: () => void;
  toggleDeleteModal: () => void;
  formState: InterfaceFormStateType;

  t: (key: string) => string;
}

/**
 * AgendaCategoryPreviewModal component is used to preview the agenda category details like name, description, createdBy
 * @param  agendaCategoryPreviewModalIsOpen - boolean value to check if the modal is open or not
 * @param  hidePreviewModal - function to hide the modal
 * @param  showUpdateModal - function to show the update modal
 * @param  toggleDeleteModal - function to toggle the delete modal
 * @param  formState - object containing the form state
 * @param  t - i18n function to translate the text
 * @returns  returns the AgendaCategoryPreviewModal component
 */
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
