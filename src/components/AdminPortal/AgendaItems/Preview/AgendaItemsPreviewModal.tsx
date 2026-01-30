import React from 'react';
import Button from 'shared-components/Button/Button';
import styles from './AgendaItemsPreviewModal.module.css';
import { FaLink } from 'react-icons/fa';
import { BaseModal } from 'shared-components/BaseModal';
import { InterfaceAgendaItemsPreviewModalProps } from 'types/AdminPortal/Agenda/interface';

// translation-check-keyPrefix: agendaSection
/**
 * Modal for previewing agenda item details.
 *
 * @param agendaItemPreviewModalIsOpen - Controls modal visibility.
 * @param hidePreviewModal - Closes the preview modal.
 * @param showUpdateItemModal - Opens the update modal.
 * @param toggleDeleteItemModal - Opens the delete confirmation modal.
 * @param formState - Agenda item details to display.
 * @param t - Translation function for agenda section keys.
 * @returns JSX.Element
 */
const AgendaItemsPreviewModal: React.FC<
  InterfaceAgendaItemsPreviewModalProps
> = ({
  agendaItemPreviewModalIsOpen,
  hidePreviewModal,
  showUpdateItemModal,
  toggleDeleteItemModal,
  formState,
  t,
}) => {
  /**
   * Renders the attachments preview.
   *
   * @returns JSX elements for each attachment, displaying videos and images.
   */
  const renderAttachments = (): JSX.Element[] => {
    return (formState.attachment ?? []).map((att, index) => (
      <div key={index} className={styles.previewFile}>
        {att.mimeType.startsWith('video') ? (
          <a href={att.previewUrl} target="_blank" rel="noopener noreferrer">
            <video
              muted
              autoPlay
              loop
              playsInline
              controls
              crossOrigin="anonymous"
            >
              <source src={att.previewUrl} type={att.mimeType} />
            </video>
          </a>
        ) : (
          <a href={att.previewUrl} target="_blank" rel="noopener noreferrer">
            <img src={att.previewUrl} alt={t('attachmentPreviewAlt')} />
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
    return (formState.url ?? []).map((url, index) => (
      <li key={index} className={styles.urlListItem}>
        <FaLink className={styles.urlIcon} />
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
        </a>
      </li>
    ));
  };

  return (
    <BaseModal
      show={agendaItemPreviewModalIsOpen}
      onHide={hidePreviewModal}
      title={t('agendaItemDetails')}
      className={styles.agendaItemModal}
      dataTestId="previewAgendaItemModal"
    >
      <div>
        <div className={styles.preview}>
          <p>{t('category')}</p>
          <span className={styles.view}>{formState.category?.name ?? '-'}</span>
        </div>

        <div className={styles.preview}>
          <p>{t('title')}</p>
          <span className={styles.view}>{formState.name}</span>
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
          <span className={styles.view}>{formState.creator?.name ?? '-'}</span>
        </div>

        <div className={styles.preview}>
          <p>{t('urls')}</p>
          <ul className={styles.view}>{renderUrls()}</ul>
        </div>

        <div className={styles.preview}>
          <p>{t('attachments')}</p>
          <div className={styles.view}>{renderAttachments()}</div>
        </div>

        <div className={styles.iconContainer}>
          <Button
            size="sm"
            onClick={showUpdateItemModal}
            className={styles.icon}
            data-testid="previewAgendaItemModalUpdateBtn"
            aria-label={t('editItem')}
          >
            <i className="fas fa-edit" />
          </Button>

          <Button
            size="sm"
            onClick={toggleDeleteItemModal}
            className={styles.icon}
            data-testid="previewAgendaItemModalDeleteBtn"
            variant="danger"
            aria-label={t('deleteItem')}
          >
            <i className="fas fa-trash" />
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default AgendaItemsPreviewModal;
