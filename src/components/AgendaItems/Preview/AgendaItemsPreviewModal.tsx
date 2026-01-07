/**
 * AgendaItemsPreviewModal Component
 *
 * This component renders a modal to preview the details of an agenda item.
 * It displays various properties of the agenda item, such as category, title,
 * description, duration, creator, URLs, and attachments. It also provides
 * options to update or delete the agenda item.
 */
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { FaLink } from 'react-icons/fa';
import type { InterfaceAgendaItemsPreviewModalProps } from 'types/Agenda/interface';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';
import { BaseModal } from 'shared-components/BaseModal';
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
  const { t: tErrors } = useTranslation('errors');
  /**
   * Renders the attachments preview.
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
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={hidePreviewModal}
    >
      <BaseModal
        className={styles.agendaItemModal}
        show={agendaItemPreviewModalIsOpen}
        onHide={hidePreviewModal}
        showCloseButton={false}
        headerContent={
          <>
            <p className={styles.titlemodalAgendaItems}>
              {t('agendaItemDetails')}
            </p>
            <Button
              onClick={hidePreviewModal}
              data-testid="previewAgendaItemModalCloseBtn"
            >
              <i className="fa fa-times"></i>
            </Button>
          </>
        }
      >
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
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
};

export default AgendaItemsPreviewModal;
