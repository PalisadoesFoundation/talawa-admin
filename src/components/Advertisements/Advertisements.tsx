/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// import PropTypes from 'react';
import styles from './Advertisements.module.css';
import { useQuery } from '@apollo/client';
import { ADVERTISEMENTS_GET } from 'GraphQl/Queries/Queries';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';
export default function advertisements(): JSX.Element {
  const {
    data: advertisementsData,
    loading: loadingAdvertisements,
    error: errorAdvertisement,
  } = useQuery(ADVERTISEMENTS_GET);
  const currentOrgId = window.location.href.split('/id=')[1] + '';
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
              >
                <Tab eventKey="activeAds" title={t('activeAds')}>
                  {advertisementsData?.getAdvertisements
                    .filter((ad: any) => ad.organization._id == currentOrgId)
                    .filter((ad: any) => new Date(ad.endDate) > new Date())
                    .length == 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    advertisementsData?.getAdvertisements
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
                  {advertisementsData?.getAdvertisements
                    .filter((ad: any) => ad.organization._id == currentOrgId)
                    .filter((ad: any) => new Date(ad.endDate) < new Date())
                    .length == 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    advertisementsData?.getAdvertisements
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
      </OrganizationScreen>
    </>
  );
}

advertisements.defaultProps = {};

advertisements.propTypes = {};
