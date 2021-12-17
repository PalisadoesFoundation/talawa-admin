import React from 'react';
import styles from './EventListCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ModalResponse from 'components/Response/ModalResponse';
import { ToastContainer, toast } from 'react-toastify';
import { DELETE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
interface EventListCardProps {
  key: string;
  id: string;
  eventLocation: string;
  eventName: string;
  totalAdmin: string;
  totalMember: string;
  eventImage: string;
  regDate: string;
  regDays: string;
}
function EventListCard(props: EventListCardProps): JSX.Element {
  const [create] = useMutation(DELETE_EVENT_MUTATION);

  const [modalNotification, setModalNotification] = React.useState(false);
  const [notificationText, setNotificationText] = React.useState('');

  const DeleteEvent = async () => {
    const sure = true;
    if (sure) {
      try {
        const { data } = await create({
          variables: {
            id: props.id,
          },
        });
        console.log(data);
        toast.success('Event deleted successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 5000);
      } catch (error) {
        toast.error('Could not delete the event', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }
  };

  const ConfirmationHandler = () => {
    setModalNotification(true);
    setNotificationText('Are you sure you want to delete this event');
  };

  const ContinueHandler = () => {
    DeleteEvent();
    setModalNotification(false);
    setNotificationText('');
  };

  const CloseHandler = () => {
    setModalNotification(false);
    setNotificationText('');
  };

  return (
    <>
      <ToastContainer />
      <ModalResponse
        show={modalNotification}
        message={notificationText}
        handleClose={CloseHandler}
        handleContinue={ContinueHandler}
      />
      <Row className={styles.orglist}>
        {props.eventImage ? (
          <img src={props.eventImage} className={styles.alignimg} />
        ) : (
          <img
            src="https://via.placeholder.com/200x100"
            className={styles.orgimg}
          />
        )}
        <Col className={styles.singledetails}>
          <div className={styles.singledetails_data_left}>
            <p className={styles.orgname}>
              {props.eventName ? <p>{props.eventName}</p> : <p>Dogs Care</p>}
            </p>
            <p className={styles.orgfont}>
              {props.eventLocation ? (
                <p>{props.eventLocation}</p>
              ) : (
                <p>India</p>
              )}
            </p>
            <p className={styles.orgfont}>
              Admin: <span>{props.totalAdmin}</span>
            </p>
            <p className={styles.orgfont}>
              Member: <span>{props.totalMember}</span>
            </p>
          </div>
          <div className={styles.singledetails_data_right}>
            <p className={styles.orgfont}>
              Days: <span>{props.regDays}</span>
            </p>
            <p className={styles.orgfont}>
              On: <span>{props.regDate}</span>
            </p>
            <button
              className={styles.orgfontcreatedbtn}
              onClick={ConfirmationHandler}
            >
              Delete
            </button>
          </div>
        </Col>
      </Row>
      <hr></hr>
    </>
  );
}
export {};
export default EventListCard;
