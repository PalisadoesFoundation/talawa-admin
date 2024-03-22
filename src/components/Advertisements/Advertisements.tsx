import React from 'react';
// import PropTypes from 'react';
import styles from './Advertisements.module.css';
import { useQuery } from '@apollo/client';
import { ADVERTISEMENTS_GET } from 'GraphQl/Queries/Queries';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';
import { useParams } from 'react-router-dom';
export default function advertisements(): JSX.Element {
  const { data: advertisementsData, loading: loadingAdvertisements } =
    useQuery(ADVERTISEMENTS_GET);

  const { orgId: currentOrgId } = useParams();
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  document.title = t('title');

  if (loadingAdvertisements) {
    return (
      <>
        <div data-testid="AdEntryStore" className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
<<<<<<< HEAD
      <Row>
        <Col col={8}>
          <div className={styles.justifysp}>
            <p className={styles.logintitle}>{t('pHeading')}</p>
            <AdvertisementRegister />
            <Tabs
              defaultActiveKey="archievedAds"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="activeAds" title={t('activeAds')}>
                {advertisementsData?.advertisementsConnection
                  .filter((ad: any) => ad.organization._id == currentOrgId)
                  .filter((ad: any) => new Date(ad.endDate) > new Date())
                  .length == 0 ? (
                  <h4>{t('pMessage')} </h4>
                ) : (
                  advertisementsData?.advertisementsConnection
                    .filter((ad: any) => ad.organization._id == currentOrgId)
                    .filter((ad: any) => new Date(ad.endDate) > new Date())
                    .map(
                      (
                        ad: {
                          _id: string;
                          name: string | undefined;
                          type: string | undefined;
                          organization: any;
                          mediaUrl: string;
                          endDate: Date;
                          startDate: Date;
                        },
                        i: React.Key | null | undefined,
                      ): JSX.Element => (
                        <AdvertisementEntry
                          id={ad._id}
                          key={i}
                          name={ad.name}
                          type={ad.type}
                          organizationId={ad.organization._id}
                          startDate={new Date(ad.startDate)}
                          endDate={new Date(ad.endDate)}
                          mediaUrl={ad.mediaUrl}
                        />
                      ),
                    )
                )}
              </Tab>
              <Tab eventKey="archievedAds" title={t('archievedAds')}>
                {advertisementsData?.advertisementsConnection
                  .filter((ad: any) => ad.organization._id == currentOrgId)
                  .filter((ad: any) => new Date(ad.endDate) < new Date())
                  .length == 0 ? (
                  <h4>{t('pMessage')} </h4>
                ) : (
                  advertisementsData?.advertisementsConnection
                    .filter((ad: any) => ad.organization._id == currentOrgId)
                    .filter((ad: any) => new Date(ad.endDate) < new Date())
                    .map(
                      (
                        ad: {
                          _id: string;
                          name: string | undefined;
                          type: string | undefined;
                          organization: any;
                          mediaUrl: string;
                          endDate: Date;
                          startDate: Date;
                        },
                        i: React.Key | null | undefined,
                      ): JSX.Element => (
                        <AdvertisementEntry
                          id={ad._id}
                          key={i}
                          name={ad.name}
                          type={ad.type}
                          organizationId={ad.organization._id}
                          startDate={new Date(ad.startDate)}
                          endDate={new Date(ad.endDate)}
                          mediaUrl={ad.mediaUrl}
                        />
                      ),
                    )
                )}
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
=======
      <OrganizationScreen
        data-testid="AdEntryStore"
        screenName="Advertisement"
        title={t('title')}
      >
        <Row>
          <Col col={8}>
            <div className={styles.justifysp}>
              <p className={styles.logintitle}>{t('pHeading')}</p>

              <AdvertisementRegister />
              <Tabs
                defaultActiveKey="archievedAds"
                id="uncontrolled-tab-example"
                className="mb-3"
                onSelect={updateSelectedTab}
              >
                <Tab eventKey="avaactiveAdsilable" title={t('activeAds')}>
                  {data2?.advertisementsConnection
                    .filter((ad: any) => ad.organization._id == currentOrgId)
                    .filter((ad: any) => new Date(ad.endDate) > new Date())
                    .length == 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    data2?.advertisementsConnection
                      .filter((ad: any) => ad.organization._id == currentOrgId)
                      .filter((ad: any) => new Date(ad.endDate) > new Date())
                      .map(
                        (
                          ad: {
                            _id: string;
                            name: string | undefined;
                            type: string | undefined;
                            organization: { _id: string };
                            mediaUrl: string;
                            endDate: Date;
                            startDate: Date;
                          },
                          i: React.Key | null | undefined
                        ): JSX.Element => (
                          <AdvertisementEntry
                            id={ad._id}
                            key={i}
                            name={ad.name}
                            type={ad.type}
                            orgId={ad.organization._id}
                            startDate={new Date(ad.startDate)}
                            endDate={new Date(ad.endDate)}
                            link={ad.mediaUrl}
                            // getInstalledPlugins={getInstalledPlugins}
                          />
                        )
                      )
                  )}
                </Tab>
                <Tab eventKey="archievedAds" title={t('archievedAds')}>
                  {data2?.advertisementsConnection
                    .filter((ad: any) => ad.organization._id == currentOrgId)
                    .filter((ad: any) => new Date(ad.endDate) < new Date())
                    .length == 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    data2?.advertisementsConnection
                      .filter((ad: any) => ad.organization._id == currentOrgId)
                      .filter((ad: any) => new Date(ad.endDate) < new Date())
                      .map(
                        (
                          ad: {
                            _id: string;
                            name: string | undefined;
                            type: string | undefined;
                            organization: { _id: string };
                            mediaUrl: string;
                            endDate: Date;
                            startDate: Date;
                          },
                          i: React.Key | null | undefined
                        ): JSX.Element => (
                          <AdvertisementEntry
                            id={ad._id}
                            key={i}
                            name={ad.name}
                            type={ad.type}
                            orgId={ad.organization._id}
                            startDate={new Date(ad.startDate)}
                            endDate={new Date(ad.endDate)}
                            // getInstalledPlugins={getInstalledPlugins}
                          />
                        )
                      )
                  )}
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </OrganizationScreen>
>>>>>>> develop-userTypeFix
    </>
  );
}

advertisements.defaultProps = {};

advertisements.propTypes = {};
