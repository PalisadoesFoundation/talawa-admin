import React from 'react';
import styles from 'style/app-fixed.module.css';
import { ViewModal } from 'shared-components/CRUDModalTemplate';
import Button from 'shared-components/Button';

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
  const customActions = (
    <div className="d-inline-flex">
      <Button
        size="sm"
        data-testid="editAgendaCategoryPreviewModalBtn"
        className={styles.icon}
        onClick={() => {
          showUpdateModal();
          hidePreviewModal();
        }}
        icon={<i className="fas fa-edit"></i>}
      />
      <Button
        size="sm"
        className={`${styles.icon} ms-2`}
        data-testid="deleteAgendaCategoryModalBtn"
        onClick={toggleDeleteModal}
        variant="danger"
        icon={<i className="fas fa-trash"></i>}
      />
    </div>
  );

  return (
    <ViewModal
      className={styles.campaignModal}
      open={agendaCategoryPreviewModalIsOpen}
      onClose={hidePreviewModal}
      title={t('agendaCategoryDetails')}
      data-testid="agendaCategoryPreviewModal"
      customActions={customActions}
    >
      <div className="p-3">
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
    </ViewModal>
  );
};

export default AgendaCategoryPreviewModal;
