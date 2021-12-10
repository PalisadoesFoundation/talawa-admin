import React from 'react';
import styles from './OrgPeopleListCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@apollo/client';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';

interface OrgPeopleListCardProps {
  key: string;
  id: string;
  memberName: string;
  memberLocation: string;
  joinDate: string;
  memberImage: string;
}

function OrgPeopleListCard(props: OrgPeopleListCardProps): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];
  const [remove] = useMutation(REMOVE_MEMBER_MUTATION);

  const RemoveMember = async () => {
    const sure = window.confirm('Are you sure you want to Remove Member ?');
    if (sure) {
      try {
        const { data } = await remove({
          variables: {
            userid: props.id,
            orgid: currentUrl,
          },
        });
        console.log(data);
        window.alert('The Member is removed');
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
              <p className={styles.memberfontcreated}>saumya47999@gmail.com</p>
            </div>
            <div className={styles.singledetails_data_right}>
              <p className={styles.memberfont}>
                Joined: <span>{props.joinDate}</span>
              </p>
              <button
                className={styles.memberfontcreatedbtn}
                onClick={RemoveMember}
              >
                Remove
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
export default OrgPeopleListCard;
