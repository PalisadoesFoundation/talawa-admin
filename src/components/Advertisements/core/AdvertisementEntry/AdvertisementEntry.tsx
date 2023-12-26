import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvertisementEntry.module.css';
import { Button, Card, Col, Row, Spinner, Modal } from 'react-bootstrap';
import { DELETE_ADVERTISEMENT_BY_ID } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ADVERTISEMENTS_GET } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
interface InterfaceAddOnEntryProps {
  id: string;
  name: string;
  link: string;
  type: string;
  orgId: string;
  startDate: Date;
  endDate: Date;
}
function advertisementEntry({
  id,
  name,
  type,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orgId,
  link,
  endDate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDate,
}: InterfaceAddOnEntryProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteAdById] = useMutation(DELETE_ADVERTISEMENT_BY_ID, {
    refetchQueries: [ADVERTISEMENTS_GET],
  });

  const toggleShowDeleteModal = (): void => setShowDeleteModal((prev) => !prev);
  const onDelete = async (): Promise<void> => {
    setButtonLoading(true);
    try {
      await deleteAdById({
        variables: {
          id: id.toString(),
        },
      });
      toast.error('Advertisement Deleted');
      setButtonLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setButtonLoading(false);
    }
  };
  return (
    <>
      <Row data-testid="AdEntry" xs={1} md={2} className="g-4">
        {Array.from({ length: 1 }).map((_, idx) => (
          <Col key={idx}>
            <Card>
              {link.includes('data:video') ? (
                <video
                  muted
                  className={styles.adimage}
                  autoPlay={true}
                  loop={true}
                  playsInline
                >
                  <source src={link} type="video/mp4" />
                </video>
              ) : (
                <Card.Img className={styles.adimage} variant="top" src={link} />
              )}
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>Ends on {endDate?.toDateString()}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted author">
                  {type}
                </Card.Subtitle>
                <Card.Text>{link}</Card.Text>
                <Button
                  className={styles.entryaction}
                  variant="danger"
                  disabled={buttonLoading}
                  data-testid="AddOnEntry_btn_install"
                  onClick={toggleShowDeleteModal}
                >
                  {buttonLoading ? (
                    <Spinner animation="grow" />
                  ) : (
                    <i className={'fa fa-trash'}></i>
                  )}
                  {t('delete')}
                </Button>
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
                      {t('no')}
                    </Button>
                    <Button
                      type="button"
                      className="btn btn-success"
                      onClick={(): void => {
                        onDelete();
                      }}
                      data-testid="delete_yes"
                    >
                      {t('yes')}
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

advertisementEntry.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  orgId: PropTypes.string,
  link: PropTypes.string,
  endDate: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date),
};

advertisementEntry.defaultProps = {
  name: '',
  type: '',
  orgId: '',
  link: '',
  endDate: new Date(),
  startDate: new Date(),
};
export default advertisementEntry;
