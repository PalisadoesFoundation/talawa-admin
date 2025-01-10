import React, { useEffect, useState } from 'react';
import styles from '../../style/app.module.css';
import { useQuery } from '@apollo/client';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { Button, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';
import { useParams } from 'react-router-dom';
import type { InterfaceQueryOrganizationAdvertisementListItem } from 'utils/interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Search } from '@mui/icons-material';

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
    _id: string;
    name: string;
    type: 'BANNER' | 'MENU' | 'POPUP';
    mediaUrl: string;
    endDate: string;
    startDate: string;
  };

  // GraphQL query to fetch the list of advertisements
  const { data: orgAdvertisementListData, refetch } = useQuery<{
    organizations: InterfaceQueryOrganizationAdvertisementListItem[];
  }>(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after: after,
      first: 6,
    },
  });

  // State to manage the list of advertisements
  const [advertisements, setAdvertisements] = useState<Ad[]>(
    orgAdvertisementListData?.organizations[0].advertisements?.edges.map(
      (edge: { node: Ad }) => edge.node,
    ) || [],
  );

  // Effect hook to update advertisements list when data changes or pagination cursor changes
  useEffect(() => {
    if (orgAdvertisementListData && orgAdvertisementListData.organizations) {
      const ads: Ad[] =
        orgAdvertisementListData.organizations[0].advertisements?.edges.map(
          (edge) => edge.node,
        ) || [];
      setAdvertisements(after ? [...advertisements, ...ads] : ads);
    }
  }, [orgAdvertisementListData, after]);

  /**
   * Fetches more advertisements for infinite scrolling.
   */
  async function loadMoreAdvertisements(): Promise<void> {
    await refetch();

    if (orgAdvertisementListData && orgAdvertisementListData.organizations) {
      setAfter(
        orgAdvertisementListData?.organizations[0]?.advertisements.pageInfo
          .endCursor,
      );
    }
  }

  return (
    <>
      <Row data-testid="advertisements">
        <Col col={8} className={styles.containerAdvertisements}>
          <div className={styles.justifyspAdvertisements}>
            <Col className={styles.colAdvertisements}>
              <div className={styles.inputAdvertisements}>
                <Form.Control
                  type="name"
                  id="searchname"
                  className={styles.inputField}
                  placeholder={'Search..'}
                  autoComplete="off"
                  required
                  // onChange={(e): void => setSearchText("search")}
                />
                <Button className={styles.searchButton}>
                  <Search />
                </Button>
              </div>
              <AdvertisementRegister setAfter={setAfter} />
            </Col>

            <Tabs
              defaultActiveKey="archievedAds"
              id="uncontrolled-tab-example"
              className="mt-4"
            >
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
                    orgAdvertisementListData?.organizations[0].advertisements
                      .pageInfo.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    advertisements.filter(
                      (ad: Ad) => new Date(ad.endDate) > new Date(),
                    ).length !== 0 && (
                      <div className={'w-100 text-center my-4'}>
                        <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {advertisements.filter(
                    (ad: Ad) => new Date(ad.endDate) > new Date(),
                  ).length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    advertisements
                      .filter((ad: Ad) => new Date(ad.endDate) > new Date())
                      .map(
                        (
                          ad: {
                            _id: string;
                            name: string | undefined;
                            type: string | undefined;
                            mediaUrl: string;
                            endDate: string;
                            startDate: string;
                          },
                          i: React.Key | null | undefined,
                        ): JSX.Element => (
                          <AdvertisementEntry
                            id={ad._id}
                            key={i}
                            name={ad.name}
                            type={ad.type}
                            organizationId={currentOrgId}
                            startDate={new Date(ad.startDate)}
                            endDate={new Date(ad.endDate)}
                            mediaUrl={ad.mediaUrl}
                            data-testid="Ad"
                            setAfter={setAfter}
                          />
                        ),
                      )
                  )}
                </InfiniteScroll>
              </Tab>
              <Tab eventKey="archievedAds" title={t('archievedAds')}>
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
                    orgAdvertisementListData?.organizations[0].advertisements
                      .pageInfo.hasNextPage ?? false
                  }
                  className={styles.listBoxAdvertisements}
                  data-testid="organizations-list"
                  endMessage={
                    advertisements.filter(
                      (ad: Ad) => new Date(ad.endDate) < new Date(),
                    ).length !== 0 && (
                      <div className={'w-100 text-center my-4'}>
                        <h5 className="m-0 ">{t('endOfResults')}</h5>
                      </div>
                    )
                  }
                >
                  {advertisements.filter(
                    (ad: Ad) => new Date(ad.endDate) < new Date(),
                  ).length === 0 ? (
                    <h4>{t('pMessage')}</h4>
                  ) : (
                    advertisements
                      .filter((ad: Ad) => new Date(ad.endDate) < new Date())
                      .map(
                        (
                          ad: {
                            _id: string;
                            name: string | undefined;
                            type: string | undefined;
                            mediaUrl: string;
                            endDate: string;
                            startDate: string;
                          },
                          i: React.Key | null | undefined,
                        ): JSX.Element => (
                          <AdvertisementEntry
                            id={ad._id}
                            key={i}
                            name={ad.name}
                            type={ad.type}
                            organizationId={currentOrgId}
                            startDate={new Date(ad.startDate)}
                            endDate={new Date(ad.endDate)}
                            mediaUrl={ad.mediaUrl}
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
