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

/**
 * Displays a card with contributions made to an organization
 * @author Saumya Singh
 * @param {props} OrgCountriCardsProps
 * @returns template 
 */
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
          <p>
            Transaction ID: <span>{props.contriTransactionId} </span>
          </p>
          <h3>
            Amount: $ <span>{props.contriAmount}</span>
          </h3>
        </Col>
      </Row>
    </>
  );
}
export default OrgContriCards;
