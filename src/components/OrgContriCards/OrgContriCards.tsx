import React from 'react';
import styles from './OrgContriCards.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
interface OrgContriCardsProps {
  key: string;
  id: string;
  userName: string;
  contriDate: string;
  contriAmount: string;
  contriTransactionId: string;
  userEmail: string;
}
function OrgContriCards(props: OrgContriCardsProps): JSX.Element {
  return (
    <>
      <Row>
        <Col className={styles.cards}>
          <h2>{props.userName}</h2>
          <p>{props.userEmail}</p>
          <p>
            Date:
            <span>{props.contriDate}</span>
          </p>
          <p>Transaction ID: {props.contriTransactionId} </p>
          <h3>Amount: $ {props.contriAmount}</h3>
        </Col>
        <Col className={styles.cards}>
          <h2>Yasharth Dubey</h2>
          <p>johndoexyz@gmail.com</p>
          <p>Date: 27/09/2021</p>
          <p>Transaction ID: BARIC4537Y </p>
          <h3>Amount: $ 67</h3>
        </Col>
      </Row>
    </>
  );
}
export default OrgContriCards;
