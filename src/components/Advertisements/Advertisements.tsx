import React, { useEffect, useState } from 'react';
import styles from '../../style/app.module.css';
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
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');

  // Set the document title based on the translation
  document.title = t('title');

  // State to manage pagination cursor for infinite scrolling
  const [after, setAfter] = useState<string | null | undefined>(null);

  const [advertisements, setAdvertisements] = useState<
    Partial<Advertisement>[]
  >([]);

  // GraphQL query to fetch the list of advertisements
  const { data: orgAdvertisementListData, refetch } = useQuery<{
    organizations: InterfaceQueryOrganizationAdvertisementListItem[];
  }>(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after,
      first: 6,
    },
  });

  // ✅ Update state when query data changes
  useEffect(() => {
    if (orgAdvertisementListData?.organizations?.[0]?.advertisements) {
      const ads =
        orgAdvertisementListData.organizations[0].advertisements.edges.map(
          (edge) => ({
            ...edge.node,
            mediaUrl: edge.node.mediaUrl
              ? new URL(edge.node.mediaUrl.toString())
              : undefined, // ✅ Ensure correct URL type
            startDate: edge.node.startDate
              ? new Date(edge.node.startDate)
              : undefined, // ✅ Ensure correct Date type
            endDate: edge.node.endDate
              ? new Date(edge.node.endDate)
              : undefined, // ✅ Ensure correct Date type
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
