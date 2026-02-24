import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaLink } from 'react-icons/fa';
import { ViewModal } from 'shared-components/CRUDModalTemplate/ViewModal';
import styles from './AgendaItemsPreviewModal.module.css';
import type { InterfaceAgendaItemsPreviewModalProps } from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaItemsPreviewModal
 * Read-only preview modal for agenda item details rendered in `ViewModal`.
 *
 * @param isOpen - Controls modal visibility
 * @param hidePreviewModal - Callback to close the preview modal
 * @param formState - Agenda item data to display
 * @param t - i18n translation function
 *
 * @returns JSX.Element
 */
// translation-check-keyPrefix: agendaSection
const AgendaItemsPreviewModal: React.FC<
  InterfaceAgendaItemsPreviewModalProps
> = ({ isOpen, hidePreviewModal, formState }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const renderAttachments = (): JSX.Element[] =>
    (formState.attachment ?? []).map((att, index) => (
      <div key={index} className={styles.previewFile}>
        {att.mimeType.startsWith('video') ? (
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
        ) : (
          <a href={att.previewUrl} target="_blank" rel="noopener noreferrer">
            <img src={att.previewUrl} alt={t('attachmentPreviewAlt')} />
          </a>
        )}
      </div>
    ));

  const renderUrls = (): JSX.Element[] =>
    (formState.url ?? []).map((url, index) => (
      <li key={index} className={styles.urlListItem}>
        <FaLink className={styles.urlIcon} />
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url.length > 50 ? `${url.slice(0, 50)}...` : url}
        </a>
      </li>
    ));

  return (
    <ViewModal
      open={isOpen}
      onClose={hidePreviewModal}
      title={t('agendaItemDetails')}
      data-testid="previewAgendaItemModal"
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
          <p>{t('notes')}</p>
          <span className={styles.view}>{formState.notes}</span>
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
      </div>
    </ViewModal>
  );
};

export default AgendaItemsPreviewModal;
