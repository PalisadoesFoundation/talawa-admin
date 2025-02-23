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

  // GraphQL query to fetch the list of advertisements
  const { data: orgAdvertisementListData, refetch } = useQuery<{
    organization: InterfaceQueryOrganizationAdvertisementListItem;
  }>(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      input: {
        id: currentOrgId,
      },
      after: null,
      before: null,
      first: 12,
    },
  });

  // State to manage the list of advertisements
  const [advertisements, setAdvertisements] = useState<Ad[]>(
    orgAdvertisementListData?.organization?.advertisements?.edges?.map(
      (edge) => ({
        id: edge.node.id,
        name: edge.node.name,
        type: edge.node.type,
        startAt: edge.node.startAt,
        endAt: edge.node.endAt,
        attachmentUrl: edge.node.attachments?.at(-1)?.url || '',
      }),
    ) || [],
  );
  console.log('1', orgAdvertisementListData);
  // Reset advertisements when `after` is reset
  useEffect(() => {
    if (!after) {
      setAdvertisements([]); // Reset the list when `after` is reset
    }
  }, [after]);

  // Effect hook to update advertisements list when data changes or pagination cursor changes
  useEffect(() => {
    if (orgAdvertisementListData?.organization?.advertisements?.edges) {
      console.log(
        'API Response:',
        orgAdvertisementListData.organization.advertisements.edges,
      );

      const ads: Ad[] =
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

      setAdvertisements((prevAds) => (after ? [...prevAds, ...ads] : ads));
    }
  }, [orgAdvertisementListData, after]);

  /**
   * Fetches more advertisements for infinite scrolling.
   */
  async function loadMoreAdvertisements(): Promise<void> {
    const { data } = await refetch({
      variables: {
        input: {
          id: currentOrgId,
        },
        after: after, // Use the current `after` cursor
        first: 12, // Ensure this matches the initial query
      },
    });

    console.log('Fetched Data:', data); // Debugging

    if (data?.organization?.advertisements?.pageInfo?.endCursor) {
      const newAfter = data.organization.advertisements.pageInfo.endCursor;
      if (newAfter !== after) {
        setAfter(newAfter);
        // Append new ads to the existing list
        const newAds: Ad[] = data.organization.advertisements.edges.map(
          (edge) => ({
            id: edge.node.id,
            name: edge.node.name,
            type: edge.node.type, // or default to "banner" if needed
            startAt: edge.node.startAt,
            endAt: edge.node.endAt,
            attachmentUrl: edge.node.attachments?.at(-1)?.url || '',
          }),
        );
        // Filter out duplicates based on `id`
        const uniqueAds = newAds.filter(
          (newAd) => !advertisements.some((ad) => ad.id === newAd.id),
        );

        setAdvertisements((prevAds) => [...prevAds, ...uniqueAds]);
      }
    } else {
      console.log('No more data to fetch.');
    }
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
                  dataLength={advertisements?.length ?? 0}
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
                  hasMore={
                    orgAdvertisementListData?.organization?.advertisements
                      ?.pageInfo?.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    advertisements.filter(
                      (ad: Ad) => new Date(ad.endAt) > new Date(),
                    ).length !== 0 && (
                      <div className={'w-100 text-center my-4'}>
                        <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {advertisements.filter(
                    (ad: Ad) => new Date(ad.endAt) > new Date(),
                  ).length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    advertisements
                      .filter((ad: Ad) => new Date(ad.endAt) > new Date())
                      .map(
                        (
                          ad: {
                            id: string;
                            name: string | undefined;
                            type: string | undefined;
                            attachmentUrl: string;
                            endAt: string;
                            startAt: string;
                          },
                          i: React.Key | null | undefined,
                        ): JSX.Element => (
                          <AdvertisementEntry
                            id={ad.id}
                            key={i}
                            name={ad.name}
                            type={ad.type}
                            organizationId={currentOrgId}
                            startAt={new Date(ad.startAt)}
                            endAt={new Date(ad.endAt)}
                            attachmentUrl={ad.attachmentUrl}
                            data-testid="Ad"
                            setAfter={setAfter}
                          />
                        ),
                      )
                  )}
                </InfiniteScroll>
              </Tab>
              {/* Below Component Renders Completed Campaigns Tab */}
              <Tab
                eventKey="archivedAds"
                title={t('archivedAds')}
                className="pt-4 m-2"
              >
                <InfiniteScroll
                  dataLength={advertisements?.length ?? 0}
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
                  hasMore={
                    orgAdvertisementListData?.organization?.advertisements
                      ?.pageInfo?.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    advertisements.filter(
                      (ad: Ad) => new Date(ad.endAt) < new Date(),
                    ).length !== 0 && (
                      <div className={'w-100 text-center my-4'}>
                        <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {advertisements.filter(
                    (ad: Ad) => new Date(ad.endAt) < new Date(),
                  ).length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    advertisements
                      .filter((ad: Ad) => new Date(ad.endAt) < new Date())
                      .map(
                        (
                          ad: {
                            id: string;
                            name: string | undefined;
                            type: string | undefined;
                            attachmentUrl: string | undefined;
                            // attachments: {
                            //   url: string;
                            // }[];
                            endAt: string;
                            startAt: string;
                          },
                          i: React.Key | null | undefined,
                        ): JSX.Element => (
                          <AdvertisementEntry
                            id={ad.id}
                            key={i}
                            name={ad.name}
                            type={ad.type}
                            organizationId={currentOrgId}
                            startAt={new Date(ad.startAt)}
                            endAt={new Date(ad.endAt)}
                            attachmentUrl={ad.attachmentUrl}
                            setAfter={setAfter}
                          />
                        ),
                      )
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
