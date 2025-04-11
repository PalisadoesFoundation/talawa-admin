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
import Loader from 'components/Loader/Loader';
import { AdvertisementSkeleton } from './skeleton/AdvertisementSkeleton';

export default function Advertisements(): JSX.Element {
  const { orgId: currentOrgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title');

  const [after, setAfter] = useState<string | null | undefined>(null);

  // Query to fetch advertisements for the organization with pagination
  const {
    data: orgAdvertisementListData,
    loading,
    refetch,
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: { id: currentOrgId, after, first: 12 },
  });

  // State to manage the list of advertisements
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  // Effect hook to update advertisements list when data changes or pagination cursor changes
  useEffect(() => {
    if (orgAdvertisementListData?.organization?.advertisements?.edges) {
      const ads: Advertisement[] =
        orgAdvertisementListData.organization.advertisements.edges.map(
          (edge: { node: Advertisement }) => edge.node,
        );
      if (after) {
        setAdvertisements((prevAds) => {
          const merged = [...prevAds, ...ads];
          const unique = Array.from(
            new Map(merged.map((ad) => [ad.id, ad])).values(),
          );
          return unique;
        });
      } else {
        setAdvertisements(ads);
      }
    } else {
      setAdvertisements([]); // No advertisements found
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

    try {
      await refetch({
        id: currentOrgId,
        after: newAfter,
        first: 12,
      });
    } catch (error) {
      console.error('Error fetching more advertisements:', error);
    }
  }

  const isAdvertisementActive = (ad: Advertisement): boolean => {
    if (!ad.endAt) {
      return false;
    }
    return new Date(ad.endAt) >= new Date();
  };
  return (
    <>
      <Row data-testid="advertisements" className={styles.rowAdvertisements}>
        <Col md={8} className={styles.containerAdvertisements}>
          {loading && <Loader />}
          {!loading && (
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
                        <AdvertisementSkeleton />
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
                    {advertisements.filter(isAdvertisementActive).length ===
                    0 ? (
                      <h4>{t('pMessage')}</h4>
                    ) : (
                      advertisements
                        .filter(isAdvertisementActive)
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
                        <AdvertisementSkeleton />
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
                    {advertisements.filter((ad) => !isAdvertisementActive(ad))
                      .length === 0 ? (
                      <h4>{t('pMessage')}</h4>
                    ) : (
                      advertisements
                        .filter((ad) => !isAdvertisementActive(ad))
                        .map((ad) => {
                          return (
                            <AdvertisementEntry
                              key={ad.id} // use ad.id as the key for better performance
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
          )}
        </Col>
      </Row>
    </>
  );
}
