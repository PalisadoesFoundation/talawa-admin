import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvertisementEntry.module.css';
import { Button, Card, Col, Row, Spinner, Modal } from 'react-bootstrap';
import { DELETE_ADVERTISEMENT_BY_ID } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ADVERTISEMENTS_GET } from 'GraphQl/Queries/Queries';
import AdvertisementRegister from '../AdvertisementRegister/AdvertisementRegister';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  const [dropdown, setDropdown] = useState(false);
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
  const handleOptionsClick = (): void => {
    setDropdown(!dropdown);
  };
  return (
    <>
      <Row data-testid="AdEntry" xs={1} md={2} className="g-4">
        {Array.from({ length: 1 }).map((_, idx) => (
          <Col key={idx}>
            <Card>
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
                        orgIdEdit={orgId}
                        linkEdit={link}
                        endDateEdit={endDate}
                        startDateEdit={startDate}
                      />
                    </li>
                    <li onClick={toggleShowDeleteModal} data-testid="deletebtn">
                      {t('delete')}
                    </li>
                  </ul>
                )}
              </div>
              <Card.Img
                variant="top"
                src={
                  'https://i.pinimg.com/736x/f0/68/da/f068daf5f23f74ada84537bcb70c7e4b.jpg'
                }
              />
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>Ends on {endDate?.toDateString()}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted author">
                  {type}
                </Card.Subtitle>
                <Card.Text>{link} </Card.Text>
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
