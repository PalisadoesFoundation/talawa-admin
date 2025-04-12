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

  // Query to fetch completed advertisements for the organization with pagination
  const {
    data: orgCompletedAdvertisementListData,
    loading: completedLoading,
    refetch: completedRefetch,
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after,
      first: 6,
      where: { isCompleted: true },
    },
    skip: !currentOrgId, // Skip the query if currentOrgId is not available
  });

  // Query to fetch active advertisements for the organization with pagination
  const {
    data: orgActiveAdvertisementListData,
    loading: activeLoading,
    refetch: activeRefetch,
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after,
      first: 6,
      where: { isCompleted: false },
    },
    skip: !currentOrgId, // Skip the query if currentOrgId is not available
  });

  // State to manage the list of advertisements
  const [completedAdvertisements, setCompletedAdvertisements] = useState<
    Advertisement[]
  >([]);
  const [activeAdvertisements, setActiveAdvertisements] = useState<
    Advertisement[]
  >([]);

  // Effect hook to update advertisements list when data changes or pagination cursor changes
  useEffect(() => {
    if (
      orgCompletedAdvertisementListData?.organization?.advertisements?.edges
    ) {
      const ads: Advertisement[] =
        orgCompletedAdvertisementListData.organization.advertisements.edges.map(
          (edge: { node: Advertisement }) => edge.node,
        );
      if (after) {
        setCompletedAdvertisements((prevAds) => {
          const unique = mergedAdvertisements(prevAds, ads);
          return unique;
        });
      } else {
        setCompletedAdvertisements(ads);
      }
    } else {
      setCompletedAdvertisements([]); // No advertisements found
    }

    if (orgActiveAdvertisementListData?.organization?.advertisements?.edges) {
      const ads: Advertisement[] =
        orgActiveAdvertisementListData.organization.advertisements.edges.map(
          (edge: { node: Advertisement }) => edge.node,
        );
      if (after) {
        setActiveAdvertisements((prevAds) => {
          const unique = mergedAdvertisements(prevAds, ads);
          return unique;
        });
      } else {
        setActiveAdvertisements(ads);
      }
    } else {
      setActiveAdvertisements([]); // No advertisements found
    }
  }, [
    orgCompletedAdvertisementListData,
    orgActiveAdvertisementListData,
    after,
  ]);

  /**
   * Fetches more advertisements for infinite scrolling.
   */
  async function loadMoreAdvertisements(): Promise<void> {
    const newAfter =
      orgCompletedAdvertisementListData?.organization?.advertisements?.pageInfo
        ?.endCursor || null;
    setAfter(newAfter);

    // Refetch active advertisements
    try {
      await activeRefetch({
        // Refetch active advertisements
        id: currentOrgId,
        after: newAfter,
        first: 6,
        where: {
          isCompleted: false,
        },
      });
    } catch (error) {
      console.error('Error fetching more active advertisements:', error);
    }

    // Refetch completed advertisements
    try {
      await completedRefetch({
        // Refetch completed advertisements
        id: currentOrgId,
        after: newAfter,
        first: 6,
        where: {
          isCompleted: true,
        },
      });
    } catch (error) {
      console.error('Error fetching more completed advertisements:', error);
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
                    dataLength={activeAdvertisements.length}
                    next={loadMoreAdvertisements}
                    loader={
                      <>
                        {/* Skeleton loader while fetching more advertisements */}
                        <AdvertisementSkeleton />
                      </>
                    }
                    hasMore={
                      orgActiveAdvertisementListData?.organization
                        ?.advertisements?.pageInfo?.hasNextPage ?? false
                    }
                    className={styles.listBoxAdvertisements}
                    data-testid="organizations-list"
                    endMessage={
                      activeAdvertisements.length === 0 && (
                        <div className={'w-100 text-center my-4'}>
                          <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                        </div>
                      )
                    }
                  >
                    {activeAdvertisements.length === 0 ? (
                      <h4>{t('pMessage')}</h4>
                    ) : (
                      activeAdvertisements.map((ad, i) => {
                        return (
                          <AdvertisementEntry
                            key={ad.id}
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
                    dataLength={completedAdvertisements.length}
                    next={loadMoreAdvertisements}
                    loader={
                      <>
                        {/* Skeleton loader while fetching more advertisements */}
                        <AdvertisementSkeleton />
                      </>
                    }
                    hasMore={
                      orgCompletedAdvertisementListData?.organization
                        ?.advertisements?.pageInfo?.hasNextPage ?? false
                    }
                    className={styles.listBoxAdvertisements}
                    data-testid="organizations-list"
                    endMessage={
                      completedAdvertisements.length === 0 && (
                        <div className={'w-100 text-center my-4'}>
                          <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                        </div>
                      )
                    }
                  >
                    {completedAdvertisements.length === 0 ? (
                      <h4>{t('pMessage')}</h4>
                    ) : (
                      completedAdvertisements.map((ad) => {
                        return (
                          <AdvertisementEntry
                            key={ad.id}
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
