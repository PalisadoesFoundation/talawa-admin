/**
 * Advertisements component for displaying and managing advertisements
 * within an organization. It includes features such as infinite scrolling,
 * search functionality, and tab-based navigation for active and archived ads.
 *
 * @component
 * @returns {JSX.Element} The Advertisements component.
 *
 * @remarks
 * - Utilizes Apollo Client's `useQuery` to fetch advertisement data.
 * - Implements infinite scrolling using the `react-infinite-scroll-component`.
 * - Supports localization using `react-i18next`.
 * - Displays active and archived advertisements in separate tabs.
 *
 * @dependencies
 * - `@apollo/client` for GraphQL queries.
 * - `react-bootstrap` for UI components like Tabs and Rows.
 * - `react-infinite-scroll-component` for infinite scrolling.
 * - `react-i18next` for translations.
 * - `react-router-dom` for accessing route parameters.
 *
 * @example
 * ```tsx
 * <Advertisements />
 * ```
 *
 * @fileoverview
 * This file defines the Advertisements component, which is responsible for
 * fetching, displaying, and managing advertisements for a specific organization.
 *
 * @todo
 * - Add error handling for GraphQL queries.
 * - Enhance search functionality to filter advertisements dynamically.
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
import type { InterfaceQueryOrganizationAdvertisementListItem } from 'utils/interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchBar from 'subComponents/SearchBar';
import type { Advertisement } from 'types/Advertisement/type';

export default function Advertisements(): JSX.Element {
  const { orgId: currentOrgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title');

  const [after, setAfter] = useState<string | null | undefined>(null);

  const [advertisements, setAdvertisements] = useState<
    Partial<Advertisement>[]
  >([]);

  const { data: orgAdvertisementListData, refetch } = useQuery<{
    organizations: InterfaceQueryOrganizationAdvertisementListItem[];
  }>(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: { id: currentOrgId, after, first: 6 },
  });

  useEffect(() => {
    if (orgAdvertisementListData?.organizations?.[0]?.advertisements) {
      const ads =
        orgAdvertisementListData.organizations[0].advertisements.edges.map(
          (edge) => ({
            ...edge.node,
            mediaUrl: edge.node.mediaUrl
              ? new URL(edge.node.mediaUrl.toString())
              : undefined,
            startDate: edge.node.startDate
              ? new Date(edge.node.startDate)
              : undefined,
            endDate: edge.node.endDate
              ? new Date(edge.node.endDate)
              : undefined,
          }),
        );

      setAdvertisements(after ? [...advertisements, ...ads] : ads);
    }
  }, [orgAdvertisementListData, after]);

  /**
   * Fetches more advertisements for infinite scrolling.
   */
  async function loadMoreAdvertisements(): Promise<void> {
    await refetch();

    const newAfter =
      orgAdvertisementListData?.organizations?.[0]?.advertisements?.pageInfo
        ?.endCursor ?? null;
    setAfter(newAfter);
  }

  return (
    <>
      <Row data-testid="advertisements">
        <Col col={8} className={styles.containerAdvertisements}>
          <div className={styles.justifyspAdvertisements}>
            <Col className={styles.colAdvertisements}>
              <SearchBar
                placeholder={'Search..'}
                onSearch={(value) => console.log(value)}
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
                  loader={[...Array(6)].map((_, index) => (
                    <div key={index} className={styles.itemCard}>
                      <div className={styles.loadingWrapper}>
                        <div className={styles.innerContainer}>
                          <div
                            className={`${styles.orgImgContainer} shimmer`}
                          />
                          <div className={styles.content}>
                            <h5 className="shimmer" title="Name"></h5>
                          </div>
                        </div>
                        <div className={`shimmer ${styles.button}`} />
                      </div>
                    </div>
                  ))}
                  hasMore={
                    orgAdvertisementListData?.organizations?.[0]?.advertisements
                      ?.pageInfo?.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    advertisements.some(
                      (ad) => ad.endDate && ad.endDate > new Date(),
                    ) && (
                      <div className={'w-100 text-center my-4'}>
                        <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {advertisements.filter(
                    (ad) => ad.endDate && ad.endDate > new Date(),
                  ).length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    advertisements
                      .filter((ad) => ad.endDate && ad.endDate > new Date())
                      .map((ad, i) => (
                        <AdvertisementEntry
                          key={i}
                          id={ad._id ?? ''}
                          name={ad.name ?? ''}
                          type={ad.type ?? 'BANNER'}
                          organizationId={ad.orgId ?? currentOrgId}
                          startDate={ad.startDate ?? new Date()}
                          endDate={ad.endDate ?? new Date()}
                          mediaUrl={ad.mediaUrl ? ad.mediaUrl.toString() : ''}
                          setAfter={setAfter}
                        />
                      ))
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
                  hasMore={
                    orgAdvertisementListData?.organizations?.[0]?.advertisements
                      ?.pageInfo?.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  loader={[...Array(6)].map((_, index) => (
                    <div key={index} className={styles.itemCard}>
                      <div className={styles.loadingWrapper}>
                        <div className={styles.innerContainer}>
                          <div
                            className={`${styles.orgImgContainer} shimmer`}
                          />
                          <div className={styles.content}>
                            <h5 className="shimmer" title="Name"></h5>
                          </div>
                        </div>
                        <div className={`shimmer ${styles.button}`} />
                      </div>
                    </div>
                  ))}
                  endMessage={
                    advertisements.some(
                      (ad) => ad.endDate && ad.endDate < new Date(),
                    ) && (
                      <div className="w-100 text-center my-4">
                        <h5 className="m-0">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {advertisements.filter(
                    (ad) => ad.endDate && ad.endDate < new Date(),
                  ).length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    advertisements
                      .filter((ad) => ad.endDate && ad.endDate < new Date())
                      .map((ad, i) => (
                        <AdvertisementEntry
                          key={i}
                          id={ad._id ?? ''}
                          name={ad.name ?? ''}
                          type={ad.type ?? 'BANNER'}
                          organizationId={ad.orgId ?? currentOrgId}
                          startDate={ad.startDate ?? new Date()}
                          endDate={ad.endDate ?? new Date()}
                          mediaUrl={ad.mediaUrl ? ad.mediaUrl.toString() : ''}
                          setAfter={setAfter}
                        />
                      ))
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
