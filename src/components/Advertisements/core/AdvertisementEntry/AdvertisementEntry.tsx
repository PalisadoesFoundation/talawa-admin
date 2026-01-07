/**
 * AdvertisementEntry component displays an advertisement entry card.
 *
 * @param props - The properties for the AdvertisementEntry component.
 * @returns A JSX element representing the advertisement entry card.
 *
 * @remarks
 * - Includes a dropdown menu for editing or deleting the advertisement.
 * - Media rendering is resilient to empty attachment arrays during the MinIO migration.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from 'style/app-fixed.module.css';
import localStyles from './AdvertisementEntry.module.css';
import { Button, Card, Col, Row, Carousel } from 'react-bootstrap';
import { DELETE_ADVERTISEMENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import AdvertisementRegister from '../AdvertisementRegister/AdvertisementRegister';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { Advertisement } from 'types/Advertisement/type';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { BaseModal } from 'shared-components/BaseModal';
import LoadingState from 'shared-components/LoadingState/LoadingState';

function AdvertisementEntry({
  advertisement,
  setAfterActive,
  setAfterCompleted,
}: {
  advertisement: Advertisement;
  setAfterActive: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
  setAfterCompleted: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
}): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const [buttonLoading, setButtonLoading] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteAd] = useMutation(DELETE_ADVERTISEMENT_MUTATION, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          id: advertisement.organization.id,
          after: null,
          first: 6,
          where: { isCompleted: true },
        },
      },
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          id: advertisement.organization.id,
          after: null,
          first: 6,
          where: { isCompleted: false },
        },
      },
    ],
  });

  const toggleShowDeleteModal = (): void => setShowDeleteModal((prev) => !prev);

  const onDelete = async (): Promise<void> => {
    setButtonLoading(true);
    try {
      await deleteAd({
        variables: { id: advertisement.id },
      });
      NotificationToast.success(t('advertisementDeleted') as string);
      setButtonLoading(false);
      setAfterCompleted?.(null);
      setAfterActive?.(null);
      setDropdown(false);
      toggleShowDeleteModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
      setButtonLoading(false);
    }
  };

  const hasAttachments =
    advertisement.attachments && advertisement.attachments.length > 0;

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Row data-testid="AdEntry" xs={1} md={2} className="g-4">
        <Col>
          <Card className={styles.addCard}>
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <button
                className={styles.dropdownButton}
                onClick={() => setDropdown(!dropdown)}
                data-testid="moreiconbtn"
                data-cy="dropdownbtn"
              >
                <MoreVertIcon />
              </button>
              {dropdown && (
                <ul className={styles.dropdownmenu}>
                  <li>
                    <AdvertisementRegister
                      formStatus="edit"
                      idEdit={advertisement.id}
                      nameEdit={advertisement.name}
                      typeEdit={advertisement.type}
                      endAtEdit={advertisement.endAt}
                      descriptionEdit={advertisement.description}
                      startAtEdit={advertisement.startAt}
                      setAfterActive={setAfterActive}
                      setAfterCompleted={setAfterCompleted}
                    />
                  </li>
                  <li
                    onClick={() => {
                      toggleShowDeleteModal();
                      setDropdown(false);
                    }}
                    data-testid="deletebtn"
                    data-cy="deletebtn"
                  >
                    {tCommon('delete')}
                  </li>
                </ul>
              )}
            </div>

            <div className={styles.mediaContainer}>
              {hasAttachments ? (
                advertisement.attachments?.[0]?.mimeType?.includes('video') ? (
                  <video
                    muted
                    className={`${styles.admedia} ${styles.mediaContainer}`}
                    autoPlay={true}
                    loop={true}
                    playsInline
                    data-testid="media"
                    crossOrigin="anonymous"
                  >
                    <source
                      src={advertisement.attachments?.[0]?.url}
                      type="video/mp4"
                    />
                  </video>
                ) : (advertisement.attachments?.length ?? 0) > 1 ? (
                  <Carousel className={styles.carouselContainer}>
                    {advertisement.attachments?.map((attachment, index) => (
                      <Carousel.Item key={index}>
                        <div className={styles.imageWrapper}>
                          <img
                            className={`d-block w-100 ${styles.cardImage}`}
                            src={attachment.url}
                            alt={t('advertisementImageAlt', {
                              index: index + 1,
                              name: advertisement.name ?? 'ad',
                            })}
                            data-testid="media"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <div className={styles.imageWrapper}>
                    <img
                      className={`d-block w-100 ${styles.cardImage}`}
                      src={advertisement.attachments?.[0]?.url}
                      alt={t('advertisementMedia')}
                      data-testid="media"
                      crossOrigin="anonymous"
                    />
                  </div>
                )
              ) : (
                <div
                  className={`${styles.noMediaPlaceholder} ${styles.imageWrapper}`}
                  data-testid="media"
                >
                  {t('noMediaAvailable')}
                </div>
              )}
            </div>

            <Card.Body>
              <Card.Title className="t-bold" data-testid="Ad_name">
                {advertisement.name}
              </Card.Title>
              <Card.Text
                data-testid="Ad_desc"
                className={
                  advertisement.description &&
                  advertisement.description.length > 0
                    ? undefined
                    : localStyles.noDescription
                }
              >
                {advertisement.description || t('noDescription')}
              </Card.Text>
              <Card.Text data-testid="Ad_start_date">
                Starts :{' '}
                {advertisement.startAt
                  ? new Date(advertisement.startAt).toDateString()
                  : 'N/A'}
              </Card.Text>
              <Card.Text data-testid="Ad_end_date">
                Ends :{' '}
                {advertisement.endAt
                  ? new Date(advertisement.endAt).toDateString()
                  : 'N/A'}
              </Card.Text>

              <Card.Subtitle
                className="mb-2 text-muted author"
                data-testid="Ad_type"
              >
                Type:{' '}
                {advertisement.type === 'pop_up'
                  ? 'pop up'
                  : advertisement.type}
              </Card.Subtitle>
              <div className={styles.buttons}>
                <Button
                  className={`${styles.entryaction} ${styles.addButton}`}
                  variant="primary"
                  disabled={buttonLoading}
                  data-testid="AddOnEntry_btn_install"
                >
                  <LoadingState isLoading={buttonLoading} variant="spinner">
                    <i className="fa fa-eye" />
                  </LoadingState>
                  {t('view')}
                </Button>
              </div>

              <BaseModal
                show={showDeleteModal}
                onHide={toggleShowDeleteModal}
                headerContent={
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <h5 data-testid="delete_title" className="mb-0">
                      {t('deleteAdvertisement')}
                    </h5>
                    <Button variant="danger" onClick={toggleShowDeleteModal}>
                      <i className="fa fa-times"></i>
                    </Button>
                  </div>
                }
              >
                <div data-testid="delete_body" className="mb-4">
                  {t('deleteAdvertisementMsg')}
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    className={`btn btn-danger ${styles.removeButton}`}
                    onClick={toggleShowDeleteModal}
                    data-testid="delete_no"
                  >
                    {tCommon('no')}
                  </Button>
                  <Button
                    type="button"
                    className={`btn ${styles.addButton}`}
                    onClick={onDelete}
                    data-testid="delete_yes"
                  >
                    {tCommon('yes')}
                  </Button>
                </div>
              </BaseModal>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
    </ErrorBoundaryWrapper>
  );
}

AdvertisementEntry.propTypes = {
  advertisement: PropTypes.object.isRequired,
  setAfterActive: PropTypes.func,
  setAfterCompleted: PropTypes.func,
};

export default AdvertisementEntry;
