import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';

import styles from './OrgContriCards.module.css';

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
export default OrgContriCards;
