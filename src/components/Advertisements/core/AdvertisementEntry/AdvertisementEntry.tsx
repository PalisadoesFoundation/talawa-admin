import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvertisementEntry.module.css';
import { Button, Card, Col, Row, Spinner, Modal } from 'react-bootstrap';
import { DELETE_ADVERTISEMENT_BY_ID } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import AdvertisementRegister from '../AdvertisementRegister/AdvertisementRegister';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify';

interface InterfaceAddOnEntryProps {
  id: string;
  name?: string;
  mediaUrl?: string;
  type?: string;
  organizationId?: string;
  startDate?: Date;
  endDate?: Date;
  setAfter: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

/**
 * Component for displaying an advertisement entry.
 * Allows viewing, editing, and deleting of the advertisement.
 *
 * @param  props - Component properties
 * @returns  The rendered component
 */
function AdvertisementEntry({
  id,
  name = '',
  type = '',
  mediaUrl = '',
  endDate = new Date(),
  organizationId = '',
  startDate = new Date(),
  setAfter,
}: InterfaceAddOnEntryProps): JSX.Element {
  console.log(id, type);
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');

  // State for loading button
  const [buttonLoading, setButtonLoading] = useState(false);
  // State for dropdown menu visibility
  const [dropdown, setDropdown] = useState(false);
  // State for delete confirmation modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mutation hook for deleting an advertisement
  const [deleteAdById] = useMutation(DELETE_ADVERTISEMENT_BY_ID, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: { first: 6, after: null, id: organizationId },
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
      await deleteAdById({
        variables: {
          id: id.toString(),
        },
      });
      toast.success(t('advertisementDeleted') as string);
      setButtonLoading(false);
      setAfter?.(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setButtonLoading(false);
    }
  };

  /**
   * Toggles the visibility of the dropdown menu.
   */
  const handleOptionsClick = (): void => {
    setDropdown(!dropdown);
  };

  return (
    <>
      <Row data-testid="AdEntry" xs={1} md={2} className="g-4">
        {Array.from({ length: 1 }).map((_, idx) => (
          <Col key={idx}>
            <Card className={styles.card}>
              <div className={styles.dropdownContainer}>
                <button
                  className={styles.dropdownButton}
                  onClick={handleOptionsClick}
                  data-testid="moreiconbtn"
                >
                  <MoreVertIcon />
                </button>
                {dropdown && (
                  <ul className={styles.dropdownmenu}>
                    <li>
                      <AdvertisementRegister
                        formStatus="edit"
                        idEdit={id}
                        nameEdit={name}
                        typeEdit={type}
                        orgIdEdit={organizationId}
                        advertisementMediaEdit={mediaUrl}
                        endDateEdit={endDate}
                        startDateEdit={startDate}
                        setAfter={setAfter}
                      />
                    </li>
                    <li onClick={toggleShowDeleteModal} data-testid="deletebtn">
                      {tCommon('delete')}
                    </li>
                  </ul>
                )}
              </div>
              {mediaUrl?.includes('videos') ? (
                <video
                  muted
                  className={styles.admedia}
                  autoPlay={true}
                  loop={true}
                  playsInline
                  data-testid="media"
                  crossOrigin="anonymous"
                >
                  <source src={mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <Card.Img
                  className={styles.admedia}
                  variant="top"
                  src={mediaUrl}
                  data-testid="media"
                />
              )}
              <Card.Body>
                <Card.Title className="t-bold">{name}</Card.Title>
                <Card.Text data-testid="Ad_end_date">
                  Starts on {startDate?.toDateString()}
                </Card.Text>
                <Card.Text data-testid="Ad_end_date">
                  Ends on {endDate?.toDateString()}
                </Card.Text>

                <Card.Subtitle className="mb-2 text-muted author">
                  {type}
                </Card.Subtitle>
                <div className={styles.buttons}>
                  <Button
                    className={styles.entryaction}
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
                    <Button variant="danger" onClick={toggleShowDeleteModal}>
                      {tCommon('no')}
                    </Button>
                    <Button
                      type="button"
                      className="btn btn-success"
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
