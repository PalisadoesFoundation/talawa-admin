/**
 * A React functional component that displays contribution details for an organization.
 *
 * @component
 * @param props - The properties passed to the component.
 * @param props.userName - The name of the user who made the contribution.
 * @param props.userEmail - The email address of the user who made the contribution.
 * @param props.contriDate - The date when the contribution was made.
 * @param props.contriTransactionId - The transaction ID associated with the contribution.
 * @param props.contriAmount - The amount contributed by the user.
 *
 * @returns A JSX element that renders a card with contribution details.
 *
 * @remarks
 * - This component uses the `react-i18next` library for internationalization.
 * - The `styles` object is imported from a CSS module for styling.
 * - The component is designed to be used within the Talawa Admin project.
 *
 * @example
 * ```tsx
 * <OrgContriCards
 *   userName="John Doe"
 *   userEmail="john.doe@example.com"
 *   contriDate="2023-01-01"
 *   contriTransactionId="12345ABC"
 *   contriAmount={100}
 * />
 * ```
 *
 * @module OrgContriCards
 */
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';

import styles from '../../style/app-fixed.module.css';
import type { InterfaceOrgContriCardsProps } from 'types/Contribution/interface';

function orgContriCards(props: InterfaceOrgContriCardsProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgContriCards' });

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
