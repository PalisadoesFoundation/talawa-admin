/**
 * AgendaItemsPreviewModal Component
 *
 * This component renders a modal to preview the details of an agenda item.
 * It displays various properties of the agenda item, such as category, title,
 * description, duration, creator, URLs, and attachments. It also provides
 * options to update or delete the agenda item.
 *
 * @component
 * @param {InterfaceAgendaItemsPreviewModalProps} props - The props for the component.
 * @param {boolean} props.agendaItemPreviewModalIsOpen - Determines if the modal is open.
 * @param {() => void} props.hidePreviewModal - Function to close the modal.
 * @param {() => void} props.showUpdateModal - Function to open the update modal.
 * @param {() => void} props.toggleDeleteModal - Function to toggle the delete modal.
 * @param {object} props.formState - The state containing agenda item details.
 * @param {string[]} props.formState.agendaItemCategoryNames - List of category names.
 * @param {string} props.formState.title - Title of the agenda item.
 * @param {string} props.formState.description - Description of the agenda item.
 * @param {string} props.formState.duration - Duration of the agenda item.
 * @param {object} props.formState.createdBy - Creator details of the agenda item.
 * @param {string} props.formState.createdBy.firstName - First name of the creator.
 * @param {string} props.formState.createdBy.lastName - Last name of the creator.
 * @param {string[]} props.formState.urls - List of URLs associated with the agenda item.
 * @param {string[]} props.formState.attachments - List of attachment URLs.
 * @param {(key: string) => string} props.t - Translation function for localization.
 *
 * @returns {JSX.Element} A modal displaying the agenda item details.
 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Modal, Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { FaLink } from 'react-icons/fa';
import type { InterfaceAgendaItemsPreviewModalProps } from 'types/Agenda/interface';
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
  /**
   * Renders the attachments preview.
   *
   * @returns JSX elements for each attachment, displaying videos and images.
   */
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

  /**
   * Renders the URLs list.
   *
   * @returns JSX elements for each URL, displaying clickable links.
   */
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
        <p className={styles.titlemodalAgendaItems}>{t('agendaItemDetails')}</p>
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
