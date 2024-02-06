import React, { useState } from 'react';

import styles from './Advertisements.module.css';
import { useQuery } from '@apollo/client';
import { ADVERTISEMENTS_GET, PLUGIN_GET } from 'GraphQl/Queries/Queries'; // PLUGIN_LIST
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../state/reducers';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import PluginHelper from 'components/AddOn/support/services/Plugin.helper';
import { store } from 'state/store';
import { useTranslation } from 'react-i18next';

import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';

export default function advertisements(): JSX.Element {
  const { data: data2 } = useQuery(ADVERTISEMENTS_GET);
  const currentOrgId = window.location.href.split('/id=')[1] + '';
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  document.title = t('title');

  const [isStore, setIsStore] = useState(true);
  // const [, setShowEnabled] = useState(true);

  const [, setDataList] = useState([]);

  // const appRoutes = useSelector((state: RootState) => state.appRoutes);

  // const plugins = useSelector((state: RootState) => state.plugins);

  const { data, loading } = useQuery(PLUGIN_GET);
  /* istanbul ignore next */

  const getStorePlugins = async (): Promise<void> => {
    let plugins = await new PluginHelper().fetchStore();
    const installIds = (await new PluginHelper().fetchInstalled()).map(
      (plugin: any) => plugin.id
    );
    plugins = plugins.map((plugin: any) => {
      plugin.installed = installIds.includes(plugin.id);
      return plugin;
    });
    store.dispatch({ type: 'UPDATE_STORE', payload: plugins });
  };

  /* istanbul ignore next */
  const getInstalledPlugins: () => any = () => {
    setDataList(data);
  };
  // const getAdvertisements: () => any = ()=> {
  //   return
  // }

  /* istanbul ignore next */
  // const updateLinks = async (links: any[]): Promise<void> => {
  //   store.dispatch({ type: 'UPDATE_P_TARGETS', payload: links });
  // };
  // /* istanbul ignore next */
  // const pluginModified = (): void => {
  //   return getInstalledPlugins();
  //   // .then((installedPlugins) => {
  //   //   getStorePlugins();
  //   //   return installedPlugins;
  //   // });
  // };

  const updateSelectedTab = (tab: any): void => {
    setIsStore(tab === 'activeAds');
    isStore ? getStorePlugins() : getInstalledPlugins();
  };

  // const filterChange = (ev: any): void => {
  //   setShowEnabled(ev.target.value === 'enabled');
  // };

  /* istanbul ignore next */
  if (loading) {
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
        screenName="Advertisement Store"
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
                  {data2?.getAdvertisements
                    .filter((ad: any) => ad.orgId == currentOrgId)
                    .filter((ad: any) => new Date(ad.endDate) > new Date())
                    .length == 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    data2?.getAdvertisements
                      .filter((ad: any) => ad.orgId == currentOrgId)
                      .filter((ad: any) => new Date(ad.endDate) > new Date())
                      .map(
                        (
                          ad: {
                            _id: string;
                            name: string | undefined;
                            type: string | undefined;
                            orgId: string;
                            link: string;
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
                            orgId={ad.orgId}
                            startDate={new Date(ad.startDate)}
                            endDate={new Date(ad.endDate)}
                            // getInstalledPlugins={getInstalledPlugins}
                          />
                        )
                      )
                  )}
                </Tab>
                <Tab eventKey="archievedAds" title={t('archievedAds')}>
                  {data2?.getAdvertisements
                    .filter((ad: any) => ad.orgId == currentOrgId)
                    .filter((ad: any) => new Date(ad.endDate) < new Date())
                    .length == 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    data2?.getAdvertisements
                      .filter((ad: any) => ad.orgId == currentOrgId)
                      .filter((ad: any) => new Date(ad.endDate) < new Date())
                      .map(
                        (
                          ad: {
                            _id: string;
                            name: string | undefined;
                            type: string | undefined;
                            orgId: string;
                            link: string;
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
                            orgId={ad.orgId}
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
    </>
  );
}

advertisements.defaultProps = {};

advertisements.propTypes = {};
