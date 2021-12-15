import React from 'react';
import styles from './MemberRequestCard.module.css';
import ModalResponse from 'components/Response/ModalResponse';
import { ToastContainer, toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@apollo/client';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';

interface MemberRequestCardProps {
  key: string;
  id: string;
  memberName: string;
  memberLocation: string;
  joinDate: string;
  memberImage: string;
  email: string;
}

function MemberRequestCard(props: MemberRequestCardProps): JSX.Element {
  const [acceptMutation] = useMutation(ACCEPT_ORGANIZATION_REQUEST_MUTATION);
  const [rejectMutation] = useMutation(REJECT_ORGANIZATION_REQUEST_MUTATION);

  const [modalNotification, setModalNotification] = React.useState(false);
  const [notificationText, setNotificationText] = React.useState('');

  const AddMember = async () => {
    try {
      const { data } = await acceptMutation({
        variables: {
          id: props.id,
        },
      });
      console.log(data);
      toast.success('Request accepted.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      window.location.reload();
    } catch (error) {
      window.alert(error);
    }
  };

  const RejectMember = async () => {
    const sure = true;
    if (sure) {
      try {
        const { data } = await rejectMutation({
          variables: {
            userid: props.id,
          },
        });
        console.log(data);
        window.location.reload();
      } catch (error) {
        window.alert(error);
      }
    }
  };

  const ConfirmationHandler = () => {
    setModalNotification(true);
    setNotificationText('Are you sure you want to Reject Member');
  };

  const ContinueHandler = () => {
    RejectMember();
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
      <div className={styles.peoplelistdiv}>
        <Row className={styles.memberlist}>
          {props.memberImage ? (
            <img src={props.memberImage} className={styles.alignimg} />
          ) : (
            <img
              src="https://via.placeholder.com/200x100"
              className={styles.memberimg}
            />
          )}
          <Col className={styles.singledetails}>
            <div className={styles.singledetails_data_left}>
              <p className={styles.membername}>
                {props.memberName ? (
                  <p>{props.memberName}</p>
                ) : (
                  <p>Dogs Care</p>
                )}
              </p>
              <p className={styles.memberfont}>{props.memberLocation}</p>
              <p className={styles.memberfontcreated}>{props.email}</p>
            </div>
            <div className={styles.singledetails_data_right}>
              <p className={styles.memberfont}>
                Joined: <span>{props.joinDate}</span>
              </p>
              <button
                className={styles.memberfontcreatedbtn}
                onClick={AddMember}
              >
                Accept
              </button>
              <button
                className={styles.memberfontcreatedbtn}
                onClick={ConfirmationHandler}
              >
                Reject
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <hr></hr>
    </>
  );
}
export {};
export default MemberRequestCard;
