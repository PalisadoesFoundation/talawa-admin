import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import styles from './AgendaItemsContainer.module.css';
import { FaLink } from 'react-icons/fa';

interface InterfaceFormStateType {
  agendaItemCategoryIds: string[];
  agendaItemCategoryNames: string[];
  title: string;
  description: string;
  duration: string;
  attachments: string[];
  urls: string[];
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface InterfaceAgendaItemsPreviewModalProps {
  agendaItemPreviewModalIsOpen: boolean;
  hidePreviewModal: () => void;
  showUpdateModal: () => void;
  toggleDeleteModal: () => void;
  formState: InterfaceFormStateType;
  t: (key: string) => string;
}

const AgendaItemsPreviewModal: React.FC<
  InterfaceAgendaItemsPreviewModalProps
> = ({
  agendaItemPreviewModalIsOpen,
  hidePreviewModal,
  showUpdateModal,
  toggleDeleteModal,
  formState,
  t,
}) => {
  const renderAttachments = (): JSX.Element[] => {
    return formState.attachments.map((attachment, index) => (
      <div key={index} className={styles.previewFile}>
        {attachment.includes('video') ? (
          <a href={attachment} target="_blank" rel="noopener noreferrer">
            <video
              muted
              autoPlay={true}
              loop={true}
              playsInline
              crossOrigin="anonymous"
              controls
            >
              <source src={attachment} type="video/mp4" />
            </video>
          </a>
        ) : (
          <a href={attachment} target="_blank" rel="noopener noreferrer">
            <img src={attachment} alt="Attachment preview" />
          </a>
        )}
      </div>
    ));
  };

  const renderUrls = (): JSX.Element[] => {
    return formState.urls.map((url, index) => (
      <li key={index} className={styles.urlListItem}>
        <FaLink className={styles.urlIcon} />
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
        </a>
      </li>
    ));
  };

  return (
    <Modal
      className={styles.agendaItemModal}
      show={agendaItemPreviewModalIsOpen}
      onHide={hidePreviewModal}
    >
      <Modal.Header>
        <p className={styles.titlemodal}>{t('agendaItemDetails')}</p>
        <Button
          onClick={hidePreviewModal}
          data-testid="previewAgendaItemModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div>
            <div className={styles.preview}>
              <p>{t('category')}</p>
              <span className={styles.view}>
                {formState.agendaItemCategoryNames.join(', ')}
              </span>
            </div>
            <div className={styles.preview}>
              <p>{t('title')}</p>
              <span className={styles.view}>{formState.title}</span>
            </div>
            <div className={styles.preview}>
              <p>{t('description')}</p>
              <span className={styles.view}>{formState.description}</span>
            </div>
            <div className={styles.preview}>
              <p>{t('duration')}</p>
              <span className={styles.view}>{formState.duration}</span>
            </div>
            <div className={styles.preview}>
              <p>{t('createdBy')}</p>
              <span className={styles.view}>
                {`${formState.createdBy.firstName} ${formState.createdBy.lastName}`}
              </span>
            </div>
            <div className={styles.preview}>
              <p>{t('urls')}</p>
              <span className={styles.view}>{renderUrls()}</span>
            </div>
            <div className={styles.preview}>
              <p>{t('attachments')}</p>
              <span className={styles.view}>{renderAttachments()}</span>
            </div>
          </div>
          <div className={styles.iconContainer}>
            <Button
              size="sm"
              onClick={showUpdateModal}
              className={styles.icon}
              data-testid="previewAgendaItemModalUpdateBtn"
            >
              <i className="fas fa-edit"></i>
            </Button>
            <Button
              size="sm"
              onClick={toggleDeleteModal}
              className={styles.icon}
              data-testid="previewAgendaItemModalDeleteBtn"
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

export default AgendaItemsPreviewModal;
