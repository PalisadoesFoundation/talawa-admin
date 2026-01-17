/**
 * AdvertisementEntry component displays an advertisement entry card with options to view, edit, or delete the advertisement.
 * It supports media content (images or videos) and provides functionality for managing advertisements.
 *
 * @component
 * @param {InterfaceAddOnEntryProps} props - The properties for the AdvertisementEntry component.
 * @param {string} props.id - The unique identifier for the advertisement.
 * @param {string} [props.name=''] - The name of the advertisement.
 * @param {string} [props.type=''] - The type/category of the advertisement.
 * @param {string} [props.mediaUrl=''] - The URL of the advertisement's media (image or video).
 * @param {Date} [props.endDate=new Date()] - The end date of the advertisement.
 * @param {string} [props.organizationId=''] - The ID of the organization associated with the advertisement.
 * @param {Date} [props.startDate=new Date()] - The start date of the advertisement.
 * @param {(after: string | null) => void} [props.setAfter] - Callback to update the pagination cursor after an action.
 *
 * @returns {JSX.Element} A JSX element representing the advertisement entry card.
 *
 * @remarks
 * - Includes a dropdown menu for editing or deleting the advertisement.
 * - Displays a confirmation modal before deleting an advertisement.
 * - Uses Apollo Client's `useMutation` hook for deleting advertisements and refetching the advertisement list.
 * - Supports translations using the `react-i18next` library.
 *
 * @example
 * ```tsx
 * <AdvertisementEntry
 *   id="123"
 *   name="Sample Ad"
 *   type="Banner"
 *   mediaUrl="https://example.com/image.jpg"
 *   endDate={new Date('2023-12-31')}
 *   organizationId="org123"
 *   startDate={new Date('2023-01-01')}
 *   setAfter={(after) => console.log(after)}
 * />
 * ```
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from 'style/app-fixed.module.css';
import Button from 'react-bootstrap/Button';
import { Card, Col, Row, Spinner, Modal, Carousel } from 'react-bootstrap';
import { DELETE_ADVERTISEMENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import AdvertisementRegister from '../AdvertisementRegister/AdvertisementRegister';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify';
import { Advertisement } from 'types/Advertisement/type';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/AdvertisementQueries';

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

  // State for loading button
  const [buttonLoading, setButtonLoading] = useState(false);

  // State for dropdown menu visibility
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // State for delete confirmation modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mutation hook for deleting an advertisement
  const [deleteAd] = useMutation(DELETE_ADVERTISEMENT_MUTATION, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          id: advertisement.organization.id,
          after: null,
          first: 6,
          where: {
            isCompleted: true,
          },
        },
      },
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          id: advertisement.organization.id,
          after: null,
          first: 6,
          where: {
            isCompleted: false,
          },
        },
      },
    ],
  });

  /**
   * Toggles the visibility of the delete confirmation modal.
   */
  const toggleShowDeleteModal = (): void => setShowDeleteModal((prev) => !prev);

  /**
   * Handles advertisement deletion.
   * Displays a success or error message based on the result.
   */
  const onDelete = async (): Promise<void> => {
    setButtonLoading(true);
    try {
      await deleteAd({
        variables: {
          id: advertisement.id,
        },
      });
      toast.success(t('advertisementDeleted') as string);
      setButtonLoading(false);
      setAfterCompleted?.(null);
      setAfterActive?.(null);
      setDropdown(false); // Close dropdown after deletion
      toggleShowDeleteModal(); // Close the modal after deletion
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setButtonLoading(false);
    }
  };

  return (
    <>
      <Row data-testid="AdEntry" xs={1} md={2} className="g-4">
        {Array.from({ length: 1 }).map((_, idx) => (
          <Col key={idx}>
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
                        setDropdown(false); // Close dropdown after clicking
                      }}
                      data-testid="deletebtn"
                      data-cy="deletebtn"
                    >
                      {tCommon('delete')}
                    </li>
                  </ul>
                )}
              </div>
              {advertisement.attachments?.[0]?.mimeType?.includes('video') ? (
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
                    src={advertisement.attachments[0].url}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <div className={styles.mediaContainer}>
                  {advertisement.attachments &&
                  advertisement.attachments.length > 0 ? (
                    advertisement.attachments.length > 1 ? (
                      <Carousel className={styles.carouselContainer}>
                        {advertisement.attachments.map((attachment, index) => (
                          <Carousel.Item key={index}>
                            <div className={styles.imageWrapper}>
                              <img
                                className={`d-block w-100 ${styles.cardImage}`}
                                src={attachment.url}
                                alt={`Advertisement image #${index + 1} for ${advertisement.name ?? 'ad'}`}
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
                          src={advertisement.attachments[0].url}
                          alt="Advertisement media"
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
                      No media available
                    </div>
                  )}
                </div>
              )}
              <Card.Body>
                <Card.Title className="t-bold" data-testid="Ad_name">
                  {advertisement.name}
                </Card.Title>
                <Card.Text
                  data-testid="Ad_desc"
                  style={{
                    color:
                      advertisement.description &&
                      advertisement.description.length > 0
                        ? 'inherit'
                        : 'gray',
                  }}
                >
                  {advertisement.description &&
                  advertisement.description.length > 0
                    ? advertisement.description
                    : t('noDescription')}
                </Card.Text>
                <Card.Text data-testid="Ad_end_date">
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
                    {buttonLoading ? (
                      <Spinner animation="grow" />
                    ) : (
                      <i className={'fa fa-eye'}></i>
                    )}
                    {t('view')}
                  </Button>
                </div>
                <Modal show={showDeleteModal} onHide={toggleShowDeleteModal}>
                  <Modal.Header>
                    <h5 data-testid="delete_title">
                      {t('deleteAdvertisement')}
                    </h5>
                    <Button variant="danger" onClick={toggleShowDeleteModal}>
                      <i className="fa fa-times"></i>
                    </Button>
                  </Modal.Header>
                  <Modal.Body data-testid="delete_body">
                    {t('deleteAdvertisementMsg')}
                  </Modal.Body>
                  <Modal.Footer>
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
                      onClick={(): void => {
                        onDelete();
                      }}
                      data-testid="delete_yes"
                    >
                      {tCommon('yes')}
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <br />
    </>
  );
}

AdvertisementEntry.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  organizationId: PropTypes.string,
  mediaUrl: PropTypes.string,
  endDate: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date),
};

export default AdvertisementEntry;
