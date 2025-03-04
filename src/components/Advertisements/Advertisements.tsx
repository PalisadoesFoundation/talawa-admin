import React, { useEffect, useState } from 'react';
import styles from '../../style/app-fixed.module.css';
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

export default function advertisements(): JSX.Element {
  const { orgId: currentOrgId } = useParams();
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');

  // Set the document title based on the translation
  document.title = t('title');

  // State to manage pagination cursor for infinite scrolling
  const [after, setAfter] = useState<string | null | undefined>(null);

  // Type definition for an advertisement object
  type Ad = {
    id: string;
    name: string;
    type: 'banner' | 'menu' | 'popup';
    attachmentUrl: string;
    endAt: string;
    startAt: string;
  };

  //Local state for all ads and pagination
  const [advertisements, setAdvertisements] = useState<Ad[]>([]);
  const [pageInfo, setPageInfo] = useState<{
    hasNextPage: boolean;
    endCursor: string | null;
  } | null>(null);

  // GraphQL query to fetch the list of advertisements
  const { data: orgAdvertisementListData, fetchMore } = useQuery<{
    organization: InterfaceQueryOrganizationAdvertisementListItem;
  }>(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      input: {
        id: currentOrgId,
      },
      after: null,
      before: null,
      first: 6,
    },
    notifyOnNetworkStatusChange: true,
  });

  // Effect hook to update advertisements list when data changes or pagination cursor changes
  useEffect(() => {
    if (orgAdvertisementListData?.organization?.advertisements?.edges) {
      const newAds: Ad[] =
        orgAdvertisementListData.organization.advertisements.edges.map(
          (edge) => ({
            id: edge.node.id,
            name: edge.node.name,
            type: 'banner', // Assuming type isn't in the API response
            startAt: edge.node.startAt,
            endAt: edge.node.endAt,
            attachmentUrl: edge.node.attachments?.at(-1)?.url || '', // Extract first attachment URL safely
          }),
        );

      setAdvertisements(newAds);
      setPageInfo(
        orgAdvertisementListData.organization.advertisements.pageInfo,
      );
    }
  }, [orgAdvertisementListData, after]);

  //  Fetches more advertisements for infinite scrolling.

  async function loadMoreAdvertisements(): Promise<void> {
    if (
      !orgAdvertisementListData?.organization?.advertisements?.pageInfo
        ?.hasNextPage
    ) {
      console.log('No More Ads to fetch');
      return;
    }
    try {
      await fetchMore({
        variables: {
          after: pageInfo?.endCursor,
          first: 6,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          const newEdges = fetchMoreResult.organization.advertisements.edges;
          const newPageInfo =
            fetchMoreResult.organization.advertisements.pageInfo;
          const mergedEdges = [
            ...prevResult.organization.advertisements.edges,
            ...newEdges,
          ].reduce(
            (acc, edge) => {
              if (!acc.some((e) => e.node.id === edge.node.id)) {
                acc.push(edge);
              }
              return acc;
            },
            [] as typeof prevResult.organization.advertisements.edges,
          );
          setAdvertisements(
            mergedEdges.map((edge) => ({
              id: edge.node.id,
              name: edge.node.name,
              type: edge.node.type || 'banner',
              startAt: edge.node.startAt,
              endAt: edge.node.endAt,
              attachmentUrl: edge.node.attachments?.at(-1)?.url || '',
            })),
          );
          setPageInfo(newPageInfo);
          return {
            organization: {
              ...prevResult.organization,
              advertisements: {
                edges: mergedEdges,
                pageInfo: newPageInfo,
              },
            },
          };
        },
      });
    } catch (error) {
      console.error('Error While Loading Advertisements', error);
    }
  }
  //Filtering to seperate active and completed Ads
  const activeAds = advertisements.filter(
    (ad) => new Date(ad.endAt) > new Date(),
  );
  const completedAds = advertisements.filter(
    (ad) => new Date(ad.endAt) < new Date(),
  );

  return (
    <>
      <Row data-testid="advertisements">
        <Col col={8} className={styles.containerAdvertisements}>
          <div className={styles.justifyspAdvertisements}>
            <Col className={styles.colAdvertisements}>
              <SearchBar
                placeholder={'Search..'}
                onSearch={(value) => console.log(value)} // To Replace with actual search handler
                inputTestId="searchname"
                buttonTestId="searchButton"
              />
              <AdvertisementRegister setAfter={setAfter} />
            </Col>

            <Tabs
              defaultActiveKey="activeAds"
              id="uncontrolled-tab-example"
              className="mt-4"
            >
              {/* Below Component Renders Active Campaigns Tab */}
              <Tab
                eventKey="activeAds"
                title={t('activeAds')}
                className="pt-4 m-2"
              >
                <InfiniteScroll
                  dataLength={activeAds?.length ?? 0}
                  next={loadMoreAdvertisements}
                  loader={
                    <>
                      {/* Skeleton loader while fetching more advertisements */}
                      {[...Array(6)].map((_, index) => (
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
                  hasMore={pageInfo?.hasNextPage ?? false}
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    activeAds.length !== 0 && (
                      <div className="w-100 text-center my-4">
                        <h5 className="m-0">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {activeAds.length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    activeAds.map((ad, i) => (
                      <AdvertisementEntry
                        key={ad.id || i}
                        id={ad.id}
                        name={ad.name}
                        type={ad.type}
                        organizationId={currentOrgId}
                        startAt={new Date(ad.startAt)}
                        endAt={new Date(ad.endAt)}
                        attachmentUrl={ad.attachmentUrl}
                        data-testid="Ad"
                        setAfter={() => {}}
                      />
                    ))
                  )}
                </InfiniteScroll>
              </Tab>
              {/* Below Component Renders Completed Campaigns Tab */}
              <Tab
                eventKey="archivedAds"
                title={t('archievedAds')}
                className="pt-4 m-2"
              >
                <InfiniteScroll
                  dataLength={completedAds?.length ?? 0}
                  next={loadMoreAdvertisements}
                  loader={
                    <>
                      {/* Skeleton loader while fetching more advertisements */}
                      {[...Array(6)].map((_, index) => (
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
                  hasMore={pageInfo?.hasNextPage ?? false}
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    activeAds.length !== 0 && (
                      <div className="w-100 text-center my-4">
                        <h5 className="m-0">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {completedAds.length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    completedAds.map((ad, i) => (
                      <AdvertisementEntry
                        key={ad.id || i}
                        id={ad.id}
                        name={ad.name}
                        type={ad.type}
                        organizationId={currentOrgId}
                        startAt={new Date(ad.startAt)}
                        endAt={new Date(ad.endAt)}
                        attachmentUrl={ad.attachmentUrl}
                        data-testid="Ad"
                        setAfter={() => {}}
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
