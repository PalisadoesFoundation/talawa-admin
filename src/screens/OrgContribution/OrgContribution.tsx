/**
 * OrgContribution Component
 *
 * This component renders the "Organization Contribution" page, which includes:
 * - A sidebar for filtering contributions by organization name and transaction ID.
 * - A section displaying recent contribution statistics.
 * - A main content area displaying a list of contribution cards.
 *
 * Features:
 * - Utilizes the `react-i18next` library for internationalization and localization.
 * - Dynamically sets the document title based on the translated page title.
 * - Includes reusable components such as `ContriStats` and `OrgContriCards`.
 *
 * @component
 * @returns {JSX.Element} The rendered JSX for the OrgContribution page.
 *
 * @remarks
 * - The sidebar includes input fields for filtering contributions and displays recent statistics.
 * - The main content area lists contribution details such as user name, date, amount, transaction ID, and email.
 *
 * @dependencies
 * - `react-bootstrap` for layout and form controls.
 * - `react-i18next` for translation and localization.
 * - `ContriStats` and `OrgContriCards` for displaying contribution-related data.
 *
 * @example
 * // Example usage of OrgContribution component
 * import OrgContribution from './OrgContribution';
 *
 * function App() {
 *   return <OrgContribution />;
 * }
 *
 * @file OrgContribution.tsx
 * @module OrgContribution
 */
import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import ContriStats from 'components/ContriStats/ContriStats';
import OrgContriCards from 'components/OrgContriCards/OrgContriCards';
import styles from 'style/app-fixed.module.css';
import SearchBar from 'shared-components/SearchBar/SearchBar';

function OrgContribution(): JSX.Element {
  // Hook to get translation functions and translation text
  const { t } = useTranslation('translation', { keyPrefix: 'orgContribution' });

  // Set the document title based on the translated title for this page
  document.title = t('title');

  // Local filters (wired for future list filtering)
  const [orgNameFilter, setOrgNameFilter] = useState<string>('');
  const [transactionFilter, setTransactionFilter] = useState<string>('');

  return (
    <>
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              {/* Input for filtering by organization name */}
              <h6 className={styles.searchtitle}>{t('filterByName')}</h6>
              <SearchBar
                placeholder={t('orgname')}
                showSearchButton={false}
                onSearch={(term) => setOrgNameFilter(term)}
                inputTestId="filterOrgName"
              />

              {/* Input for filtering by transaction ID */}
              <h6 className={styles.searchtitle}>{t('filterByTransId')}</h6>
              <SearchBar
                placeholder={t('searchtransaction')}
                showSearchButton={false}
                onSearch={(term) => setTransactionFilter(term)}
                inputTestId="filterTransaction"
              />

              {/* Section displaying recent contribution statistics */}
              <h6 className={styles.searchtitle}>{t('recentStats')}</h6>
              <ContriStats
                key="129"
                id="21"
                recentAmount="90"
                highestAmount="500"
                totalAmount="6000"
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>{t('contribution')}</p>
            </Row>
            {/* Section displaying a list of contribution cards */}
            <OrgContriCards
              key="129"
              id="21"
              userName="John Doe"
              contriDate="20/7/2021"
              contriAmount="21"
              contriTransactionId="21WE98YU"
              userEmail="johndoexyz@gmail.com"
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrgContribution;
