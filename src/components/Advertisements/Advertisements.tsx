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
import { convertDateUTCtoLocal } from 'utils/dateUtils/convertDateUTCtoLocal';
export default function advertisements(): JSX.Element {
  const { data: advertisementsData, loading: loadingAdvertisements } =
    useQuery(ADVERTISEMENTS_GET);
  /* eslint-disable */
  const { orgId: currentOrgId } = useParams();
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  document.title = t('title');

  type Ad = {
    _id: string;
    name: string;
    type: 'BANNER' | 'MENU' | 'POPUP';
    organization: {
      _id: string | undefined;
    };
    mediaUrl: string;
    endDate: string; // Assuming it's a string in the format 'yyyy-MM-dd'
    startDate: string; // Assuming it's a string in the format 'yyyy-MM-dd'
  };

  if (loadingAdvertisements) {
    return (
      <>
        <div data-testid="AdEntryStore" className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Row>
        <Col col={8}>
          <div className={styles.justifysp}>
            <AdvertisementRegister />
            <Tabs
              defaultActiveKey="archievedAds"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="activeAds" title={t('activeAds')}>
                {advertisementsData?.advertisementsConnection?.edges
                  .map((edge: { node: Ad }) => edge.node)
                  .filter((ad: Ad) => ad.organization._id === currentOrgId)
                  .filter((ad: Ad) => new Date(ad.endDate) > new Date())
                  .length === 0 ? (
                  <h4>{t('pMessage')}</h4>
                ) : (
                  advertisementsData?.advertisementsConnection?.edges
                    .map((edge: { node: Ad }) => edge.node)
                    .filter((ad: Ad) => ad.organization._id === currentOrgId)
                    .filter((ad: Ad) => new Date(ad.endDate) > new Date())
                    .map(
                      (
                        ad: {
                          _id: string;
                          name: string | undefined;
                          type: string | undefined;
                          organization: {
                            _id: string;
                          };
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
                          organizationId={ad.organization._id}
                          startDate={convertDateUTCtoLocal(
                            new Date(ad.startDate),
                          )}
                          endDate={convertDateUTCtoLocal(new Date(ad.endDate))}
                          mediaUrl={ad.mediaUrl}
                        />
                      ),
                    )
                )}
              </Tab>
              <Tab eventKey="archievedAds" title={t('archievedAds')}>
                {advertisementsData?.advertisementsConnection?.edges
                  .map((edge: { node: Ad }) => edge.node)
                  .filter((ad: Ad) => ad.organization._id === currentOrgId)
                  .filter((ad: Ad) => new Date(ad.endDate) < new Date())
                  .length === 0 ? (
                  <h4>{t('pMessage')}</h4>
                ) : (
                  advertisementsData?.advertisementsConnection?.edges
                    .map((edge: { node: Ad }) => edge.node)
                    .filter((ad: Ad) => ad.organization._id === currentOrgId)
                    .filter((ad: Ad) => new Date(ad.endDate) < new Date())
                    .map(
                      (
                        ad: {
                          _id: string;
                          name: string | undefined;
                          type: string | undefined;
                          organization: {
                            _id: string;
                          };
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
                          organizationId={ad.organization._id}
                          startDate={convertDateUTCtoLocal(
                            new Date(ad.startDate),
                          )}
                          endDate={convertDateUTCtoLocal(new Date(ad.endDate))}
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
    </>
  );
}

advertisements.defaultProps = {};

advertisements.propTypes = {};
