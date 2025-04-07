/**
 * Advertisements component for managing and displaying advertisements
 * within an organization. This component includes features such as
 * infinite scrolling, tabbed views for active and archived advertisements,
 * and a search bar for filtering advertisements.
 *
 * @component
 * @returns {JSX.Element} The rendered Advertisements component.
 *
 * @remarks
 * - Utilizes Apollo Client's `useQuery` for fetching advertisement data.
 * - Supports infinite scrolling for loading more advertisements.
 * - Displays advertisements in two tabs: active and archived.
 * - Includes a search bar and advertisement registration functionality.
 *
 * @dependencies
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
 * @see {@link AdvertisementEntry} for rendering individual advertisements.
 * @see {@link AdvertisementRegister} for registering new advertisements.
 */

import React, { useEffect, useState } from 'react';
import styles from 'style/app-fixed.module.css';
import { useQuery } from '@apollo/client';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchBar from 'subComponents/SearchBar';
import type { Advertisement } from 'types/Advertisement/type';

export default function Advertisements(): JSX.Element {
  const { orgId: currentOrgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title');

  const [after, setAfter] = useState<string | null | undefined>(null);

  // Query to fetch advertisements for the organization with pagination
  const { data: orgAdvertisementListData, refetch } = useQuery(
    ORGANIZATION_ADVERTISEMENT_LIST,
    {
      variables: { id: currentOrgId, after, first: 12 },
    },
  );

  // State to manage the list of advertisements
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  // Effect hook to update advertisements list when data changes or pagination cursor changes
  useEffect(() => {
    if (
      orgAdvertisementListData &&
      orgAdvertisementListData.organization?.advertisements?.edges
    ) {
      const ads: Advertisement[] =
        orgAdvertisementListData.organization.advertisements.edges.map(
          (edge: { node: Advertisement }) => edge.node,
        );
      if (after) {
        setAdvertisements((prevAds) => [...prevAds, ...ads]);
      } else {
        setAdvertisements(ads);
      }
    }
  }, [orgAdvertisementListData, after]);

  /**
   * Fetches more advertisements for infinite scrolling.
   */
  async function loadMoreAdvertisements(): Promise<void> {
    const newAfter =
      orgAdvertisementListData?.organization?.advertisements?.pageInfo
        ?.endCursor || null;
    setAfter(newAfter);

    await refetch({
      id: currentOrgId,
      after: newAfter,
      first: 12,
    });
  }

  return (
    <>
      <Row data-testid="advertisements">
        <Col
          col={8}
          className={styles.containerAdvertisements}
          style={{ marginTop: '2rem' }}
        >
          <div className={styles.justifyspAdvertisements}>
            <Col className={styles.colAdvertisements}>
              <SearchBar
                placeholder={'Search..'}
                onSearch={(value) => console.log(value)} // Replace with actual search handler
                inputTestId="searchname"
                buttonTestId="searchButton"
              />
              <AdvertisementRegister setAfter={setAfter} />
            </Col>

            <Tabs
              defaultActiveKey="archivedAds"
              id="uncontrolled-tab-example"
              className="mt-4"
            >
              <Tab
                eventKey="activeAds"
                title={t('activeAds')}
                className="pt-4 m-2"
              >
                <InfiniteScroll
                  dataLength={advertisements.length}
                  next={loadMoreAdvertisements}
                  loader={
                    <>
                      {/* Skeleton loader while fetching more advertisements */}
                      {[...Array(32)].map((_, index) => (
                        <div key={index} className={styles.itemCard}>
                          <div className={styles.loadingWrapper}>
                            <div className={styles.innerContainer}>
                              <div
                                className={`${styles.orgImgContainer} shimmer`}
                              ></div>
                              <div className={styles.content}>
                                <h5 className="shimmer" title="Name"></h5>
                              </div>
                            </div>
                            <div className={`shimmer ${styles.button}`} />
                          </div>
                        </div>
                      ))}
                    </>
                  }
                  hasMore={
                    orgAdvertisementListData?.organization?.advertisements
                      ?.pageInfo?.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    advertisements.some(
                      (ad: Advertisement) => ad.endAt > new Date(),
                    ) && (
                      <div className={'w-100 text-center my-4'}>
                        <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {advertisements.filter((ad: Advertisement) => {
                    const isActive = new Date(ad.endAt) > new Date();
                    return isActive;
                  }).length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    advertisements
                      .filter(
                        (ad) => ad.endAt && new Date(ad.endAt) >= new Date(),
                      )
                      .map((ad, i) => {
                        return (
                          <AdvertisementEntry
                            key={i}
                            advertisement={ad}
                            setAfter={setAfter}
                          />
                        );
                      })
                  )}
                </InfiniteScroll>
              </Tab>

              <Tab
                eventKey="archivedAds"
                title={t('archivedAds')}
                className="pt-4 m-2"
              >
                <InfiniteScroll
                  dataLength={advertisements.length}
                  next={loadMoreAdvertisements}
                  loader={
                    <>
                      {/* Skeleton loader while fetching more advertisements */}
                      {[...Array(32)].map((_, index) => (
                        <div key={index} className={styles.itemCard}>
                          <div className={styles.loadingWrapper}>
                            <div className={styles.innerContainer}>
                              <div
                                className={`${styles.orgImgContainer} shimmer`}
                              ></div>
                              <div className={styles.content}>
                                <h5 className="shimmer" title="Name"></h5>
                              </div>
                            </div>
                            <div className={`shimmer ${styles.button}`} />
                          </div>
                        </div>
                      ))}
                    </>
                  }
                  hasMore={
                    orgAdvertisementListData?.organizations?.advertisements
                      ?.pageInfo?.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    advertisements.some(
                      (ad: Advertisement) => ad.endAt < new Date(),
                    ) && (
                      <div className={'w-100 text-center my-4'}>
                        <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {advertisements.filter((ad: Advertisement) => {
                    const isActive = new Date(ad.endAt) <= new Date();
                    return isActive;
                  }).length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    advertisements
                      .filter(
                        (ad) => ad.endAt && new Date(ad.endAt) < new Date(),
                      )
                      .map((ad, i) => {
                        return (
                          <AdvertisementEntry
                            key={i}
                            advertisement={ad}
                            setAfter={setAfter}
                          />
                        );
                      })
                  )}
                </InfiniteScroll>
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </>
  );
}
