import React from 'react';
import styles from './MemberRequestCard.module.css';
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

  const AddMember = async () => {
    try {
      const { data } = await acceptMutation({
        variables: {
          id: props.id,
        },
      });
      console.log(data);
      window.alert('it is accepted');
      window.location.reload();
    } catch (error) {
      window.alert(error);
    }
  };

  const RejectMember = async () => {
    const sure = window.confirm('Are you sure you want to Reject Request ?');
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

  return (
    <>
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
                onClick={RejectMember}
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
