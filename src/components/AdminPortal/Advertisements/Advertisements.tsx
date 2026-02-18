/**
 * Advertisements component for managing and displaying advertisements
 * within an organization. This component includes features such as
 * infinite scrolling, tabbed views for active and archived advertisements,
 * and a search bar for filtering advertisements.
 *
 * @returns - JSX.Element The rendered Advertisements component.
 *
 * @remarks
 * - Utilizes Apollo Client's `useQuery` for fetching advertisement data.
 * - Supports infinite scrolling for loading more advertisements.
 * - Displays advertisements in two tabs: active and archived.
 * - Includes a search bar and advertisement registration functionality.
 *
 * dependencies
 * - `react`, `react-bootstrap`, `react-router-dom`, `react-i18next`
 * - `@apollo/client` for GraphQL queries.
 * - `InfiniteScroll` for infinite scrolling functionality.
 *
 * @example
 * ```tsx
 * <Advertisements />
 * ```
 *
 * @remarks
 * The component fetches advertisements using the `ORGANIZATION_ADVERTISEMENT_LIST`
 * GraphQL query and organizes them into active and archived categories based on
 * their `endDate`.
 *
 * @see AdvertisementEntry - Renders individual advertisements.
 * @see AdvertisementRegister - Handles advertisement creation.
 */

import React, { useEffect, useState } from 'react';
import styles from 'style/app-fixed.module.css';
import { useQuery } from '@apollo/client';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';
import { useParams } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { Advertisement } from 'types/AdminPortal/Advertisement/type';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { AdvertisementSkeleton } from './skeleton/AdvertisementSkeleton';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import PageHeader from 'shared-components/Navbar/Navbar';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

export default function Advertisements(): JSX.Element {
  const { orgId: currentOrgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tErrors } = useTranslation('errors');

  document.title = t('title');

  const [afterActive, setAfterActive] = useState<string | null | undefined>(
    null,
  );
  const [afterCompleted, setAfterCompleted] = useState<
    string | null | undefined
  >(null);

  const {
    data: orgCompletedAdvertisementListData,
    loading: completedLoading,
    error: completedError,
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after: afterCompleted,
      first: 6,
      where: { isCompleted: true },
    },
    skip: !currentOrgId,
  });

  const {
    data: orgActiveAdvertisementListData,
    loading: activeLoading,
    error: activeError,
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after: afterActive,
      first: 6,
      where: { isCompleted: false },
    },
    skip: !currentOrgId,
  });

  if (completedError || activeError) {
    NotificationToast.error(t('failedToFetchAdvertisements'));
  }

  const [completedAdvertisements, setCompletedAdvertisements] = useState<
    Advertisement[]
  >([]);
  const [activeAdvertisements, setActiveAdvertisements] = useState<
    Advertisement[]
  >([]);

  useEffect(() => {
    if (
      orgCompletedAdvertisementListData?.organization?.advertisements?.edges
    ) {
      const ads: Advertisement[] =
        orgCompletedAdvertisementListData.organization.advertisements.edges.map(
          (edge: { node: Advertisement }) => edge.node,
        );
      if (afterCompleted) {
        setCompletedAdvertisements((prevAds) => {
          const unique = mergedAdvertisements(prevAds, ads);
          return unique;
        });
      } else {
        setCompletedAdvertisements(ads);
      }
    }
  }, [orgCompletedAdvertisementListData, afterCompleted]);

  useEffect(() => {
    if (orgActiveAdvertisementListData?.organization?.advertisements?.edges) {
      const ads: Advertisement[] =
        orgActiveAdvertisementListData.organization.advertisements.edges.map(
          (edge: { node: Advertisement }) => edge.node,
        );
      if (afterActive) {
        setActiveAdvertisements((prevAds) => {
          const unique = mergedAdvertisements(prevAds, ads);
          return unique;
        });
      } else {
        setActiveAdvertisements(ads);
      }
    }
  }, [orgActiveAdvertisementListData, afterActive]);

  /**
   * Fetches more completed advertisements for infinite scrolling.
   */
  async function loadMoreCompletedAdvertisements(): Promise<void> {
    const newAfter =
      orgCompletedAdvertisementListData?.organization?.advertisements?.pageInfo
        ?.endCursor || null;

    if (newAfter) {
      setAfterCompleted(newAfter);
    }
  }

  /**
   * Fetches more active advertisements for infinite scrolling.
   */
  async function loadMoreActiveAdvertisements(): Promise<void> {
    const newAfter =
      orgActiveAdvertisementListData?.organization?.advertisements?.pageInfo
        ?.endCursor || null;

    if (newAfter) {
      setAfterActive(newAfter);
    }
  }

  /**
   * Merges two arrays of advertisements, ensuring uniqueness based on advertisement ID.
   * @param prevAds - Previous advertisements.
   * @param ads - New advertisements to merge.
   * @returns Merged array of unique advertisements.
   */
  function mergedAdvertisements(
    prevAds: Advertisement[],
    ads: Advertisement[],
  ): Advertisement[] {
    const merged = [...prevAds, ...ads];
    const unique = Array.from(
      new Map(merged.map((ad) => [ad.id, ad])).values(),
    );
    return unique;
  }

  const loading = activeLoading || completedLoading; // if any of them is in loading state
  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Row data-testid="advertisements" className={styles.rowAdvertisements}>
        <Col md={8} className={styles.containerAdvertisements}>
          {loading && (
            <LoadingState variant="spinner" isLoading={loading}>
              <div />
            </LoadingState>
          )}
          <Col className={styles.colAdvertisements}>
            <PageHeader
              search={{
                placeholder: t('searchAdvertisements'),
                onSearch: (value) => {
                  const searchValue = value.toLowerCase();
                  const filteredActiveAds = activeAdvertisements.filter(
                    (ad) =>
                      ad.name.toLowerCase().includes(searchValue) ||
                      (ad.description ?? '')
                        .toLowerCase()
                        .includes(searchValue),
                  );
                  const filteredCompletedAds = completedAdvertisements.filter(
                    (ad) =>
                      ad.name.toLowerCase().includes(searchValue) ||
                      (ad.description ?? '')
                        .toLowerCase()
                        .includes(searchValue),
                  );

                  setActiveAdvertisements(filteredActiveAds);
                  setCompletedAdvertisements(filteredCompletedAds);
                },
                inputTestId: 'searchname',
                buttonTestId: 'searchButton',
              }}
              actions={
                <AdvertisementRegister
                  setAfterActive={setAfterActive}
                  setAfterCompleted={setAfterCompleted}
                />
              }
            />
          </Col>
          <Tabs
            key="advertisements-tabs"
            defaultActiveKey="archivedAds"
            id="uncontrolled-tab-example"
            className="mt-4"
          >
            <Tab
              eventKey="activeAds"
              title={t('activeAds')}
              className="pt-4 m-2"
            >
              {activeAdvertisements.length === 0 ? (
                <div className={styles.pMessageAdvertisement}>
                  {t('pMessage')}
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={activeAdvertisements.length}
                  next={loadMoreActiveAdvertisements}
                  loader={<AdvertisementSkeleton />}
                  hasMore={
                    orgActiveAdvertisementListData?.organization?.advertisements
                      ?.pageInfo?.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                >
                  <div className={styles.justifyspAdvertisements}>
                    {activeAdvertisements.map((ad) => {
                      return (
                        <AdvertisementEntry
                          key={ad.id}
                          advertisement={ad}
                          setAfterActive={setAfterActive}
                          setAfterCompleted={setAfterCompleted}
                        />
                      );
                    })}
                  </div>
                </InfiniteScroll>
              )}
            </Tab>

            <Tab
              eventKey="archivedAds"
              title={t('archivedAds')}
              className="pt-4 m-2"
            >
              {completedAdvertisements.length === 0 ? (
                <div className={styles.pMessageAdvertisement}>
                  {t('pMessage')}
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={completedAdvertisements.length}
                  next={loadMoreCompletedAdvertisements}
                  loader={<AdvertisementSkeleton />}
                  hasMore={
                    orgCompletedAdvertisementListData?.organization
                      ?.advertisements?.pageInfo?.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                >
                  <div className={styles.justifyspAdvertisements}>
                    {completedAdvertisements.map((ad) => {
                      return (
                        <AdvertisementEntry
                          key={ad.id}
                          advertisement={ad}
                          setAfterActive={setAfterActive}
                          setAfterCompleted={setAfterCompleted}
                        />
                      );
                    })}
                  </div>
                </InfiniteScroll>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </ErrorBoundaryWrapper>
  );
}
