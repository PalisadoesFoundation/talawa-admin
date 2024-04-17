import React, { useEffect, useState } from 'react';
import styles from './Advertisements.module.css';
import { useQuery } from '@apollo/client';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';
import { useParams } from 'react-router-dom';
import type { InterfaceQueryOrganizationAdvertisementListItem } from 'utils/interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function advertisements(): JSX.Element {
  const { orgId: currentOrgId } = useParams();
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  document.title = t('title');
  const [after, setAfter] = useState<string | null | undefined>(null);

  type Ad = {
    _id: string;
    name: string;
    type: 'BANNER' | 'MENU' | 'POPUP';
    mediaUrl: string;
    endDate: string; // Assuming it's a string in the format 'yyyy-MM-dd'
    startDate: string; // Assuming it's a string in the format 'yyyy-MM-dd'
  };

  const {
    data: orgAdvertisementListData,
    refetch,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationAdvertisementListItem[];
    };
    refetch: any;
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after: after,
      first: 6,
    },
  });
  const [advertisements, setAdvertisements] = useState(
    orgAdvertisementListData?.organizations[0].advertisements?.edges.map(
      (edge: { node: Ad }) => edge.node,
    ) || [],
  );

  useEffect(() => {
    if (orgAdvertisementListData && orgAdvertisementListData.organizations) {
      const ads: Ad[] =
        orgAdvertisementListData.organizations[0].advertisements?.edges.map(
          (edge) => edge.node,
        );
      after
        ? setAdvertisements([...advertisements, ...ads])
        : setAdvertisements(ads);
    }
  }, [orgAdvertisementListData, after]);

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
        <Col col={8}>
          <div className={styles.justifysp}>
            <AdvertisementRegister setAfter={setAfter} />
            <Tabs
              defaultActiveKey="archievedAds"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="activeAds" title={t('activeAds')}>
                <InfiniteScroll
                  dataLength={advertisements?.length ?? 0}
                  next={loadMoreAdvertisements}
                  loader={
                    <>
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
                  className={styles.listBox}
                  data-testid="organizations-list"
                  endMessage={
                    advertisements.filter(
                      (ad: Ad) => new Date(ad.endDate) > new Date(),
                    ).length !== 0 && (
                      <div className={'w-100 text-center my-4'}>
                        <h5 className="m-0 ">{t('endOfResults')}</h5>
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
                  className={styles.listBox}
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

advertisements.defaultProps = {};

advertisements.propTypes = {};
