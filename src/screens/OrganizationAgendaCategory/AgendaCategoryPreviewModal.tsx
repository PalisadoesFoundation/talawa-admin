import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

import styles from './OrganizationAgendaCategory.module.css';

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
      className={styles.AgendaCategoryModal}
      show={agendaCategoryPreviewModalIsOpen}
      onHide={hidePreviewModal}
    >
      <Modal.Header>
        <p className={styles.titlemodal}>{t('agendaCategoryDetails')}</p>
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
