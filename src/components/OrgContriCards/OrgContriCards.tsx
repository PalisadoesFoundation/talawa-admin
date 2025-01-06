import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';

import styles from '../../style/app.module.css';

/**
 * Props for the OrgContriCards component
 */
interface InterfaceOrgContriCardsProps {
  key: string;
  id: string;
  userName: string;
  contriDate: string;
  contriAmount: string;
  contriTransactionId: string;
  userEmail: string;
}

/**
 * Component to display organization contribution cards
 *
 * This component shows the contribution details of a user in a card format. It includes
 * the user's name, email, contribution date, transaction ID, and the contribution amount.
 *
 * @param props - The properties passed to the component
 * @returns JSX.Element representing a contribution card
 */
function orgContriCards(props: InterfaceOrgContriCardsProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgContriCards',
  });

  return (
    <>
      <Row>
        <Col className={styles.cards}>
          <h2>{props.userName}</h2>
          <p>{props.userEmail}</p>
          <p>
            {t('date')}:<span>{props.contriDate}</span>
          </p>
          <p>
            {t('transactionId')}: <span>{props.contriTransactionId} </span>
          </p>
          <h3>
            {t('amount')}: $ <span>{props.contriAmount}</span>
          </h3>
        </Col>
      </Row>
    </>
  );
}
export default orgContriCards;
