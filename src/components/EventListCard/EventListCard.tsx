import React from 'react';
import styles from './EventListCard.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
  return (
    <>
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
            <button className={styles.orgfontcreatedbtn}>Details</button>
          </div>
        </Col>
      </Row>
      <hr></hr>
    </>
  );
}
export {};
export default EventListCard;
