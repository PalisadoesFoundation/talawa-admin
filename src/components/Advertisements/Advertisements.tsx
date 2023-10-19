/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'react';
import styles from './Advertisement.module.css';
import { useQuery } from '@apollo/client';
import { ADVERTISEMENTS_GET, PLUGIN_GET } from 'GraphQl/Queries/Queries'; // PLUGIN_LIST
import { useSelector } from 'react-redux';
import type { RootState } from '../../state/reducers';
import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import PluginHelper from 'components/AddOn/support/services/Plugin.helper';
import { store } from 'state/store';
import { useTranslation } from 'react-i18next';
import Loader from 'components/Loader/Loader';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';
import AddOnRegister from 'components/AddOn/core/AddOnRegister/AddOnRegister';
export default function advertisements(): JSX.Element {
  const {
    data: data2,
    loading: loading2,
    error: error2,
  } = useQuery(ADVERTISEMENTS_GET);

  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  document.title = t('title');

  const [isStore, setIsStore] = useState(true);
  const [showEnabled, setShowEnabled] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dataList, setDataList] = useState([]);

  const [render, setRender] = useState(true);
  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const plugins = useSelector((state: RootState) => state.plugins);
  const { installed, addonStore } = plugins;
  const { data, loading, error } = useQuery(PLUGIN_GET);
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getStorePlugins = async () => {
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
  const updateLinks = async (links: any[]): Promise<void> => {
    store.dispatch({ type: 'UPDATE_P_TARGETS', payload: links });
  };
  // /* istanbul ignore next */
  const pluginModified = (): void => {
    return getInstalledPlugins();
    // .then((installedPlugins) => {
    //   getStorePlugins();
    //   return installedPlugins;
    // });
  };

  const updateSelectedTab = (tab: any): void => {
    setIsStore(tab === 'available');
    isStore ? getStorePlugins() : getInstalledPlugins();
  };

  const filterChange = (ev: any): void => {
    setShowEnabled(ev.target.value === 'enabled');
  };

  /* istanbul ignore next */
  if (loading) {
    return (
      <>
        <div data-testid="AddOnEntryStore" className={styles.loader}></div>
      </>
    );
  }
  console.log(data2?.getAdvertisements);
  return (
    <>
      <OrganizationScreen screenName="Advertisement Store" title={t('title')}>
        <Row>
          <Col col={8}>
            <div className={styles.justifysp}>
              <p className={styles.logintitle}>{t('pHeading')}</p>

              <AdvertisementRegister />
              <Tabs
                defaultActiveKey="available"
                id="uncontrolled-tab-example"
                className="mb-3"
                onSelect={updateSelectedTab}
              >
                <Tab eventKey="available" title={t('activeAds')}>
                  {data2?.getAdvertisements
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
                          startDate={ad.startDate}
                          endDate={ad.endDate}
                          // getInstalledPlugins={getInstalledPlugins}
                        />
                      )
                    ).length == 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    data2?.getAdvertisements
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
                            startDate={ad.startDate}
                            endDate={ad.endDate}
                            // getInstalledPlugins={getInstalledPlugins}
                          />
                        )
                      )
                  )}
                </Tab>
                <Tab eventKey="installed" title={t('archievedAds')}>
                  {data2?.getAdvertisements
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
                          startDate={ad.startDate}
                          endDate={ad.endDate}
                          // getInstalledPlugins={getInstalledPlugins}
                        />
                      )
                    ).length == 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    data2?.getAdvertisements
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
                            startDate={ad.startDate}
                            endDate={ad.endDate}
                            // getInstalledPlugins={getInstalledPlugins}
                          />
                        )
                      )
                  )}
                  {/*{data.getPlugins
                    .filter((plugin: any) => plugin.pluginInstallStatus == true)
                    .filter(
                      (val: {
                        _id: string;
                        pluginName: string | undefined;
                        pluginDesc: string | undefined;
                        pluginCreatedBy: string;
                        pluginInstallStatus: boolean | undefined;
                        getInstalledPlugins: () => any;
                      }) => {
                        if (searchText == '') {
                          return val;
                        } else if (
                          val.pluginName
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase())
                        ) {
                          return val;
                        }
                      }
                    ).length === 0 ? (
                    <h4>{t('pMessage')} </h4> // eslint-disable-line
                  ) : (
                    data.getPlugins
                      .filter(
                        (plugin: any) => plugin.pluginInstallStatus == true
                      )
                      .filter(
                        (val: {
                          _id: string;
                          pluginName: string | undefined;
                          pluginDesc: string | undefined;
                          pluginCreatedBy: string;
                          pluginInstallStatus: boolean | undefined;
                          getInstalledPlugins: () => any;
                        }) => {
                          if (searchText == '') {
                            return val;
                          } else if (
                            val.pluginName
                              ?.toLowerCase()
                              .includes(searchText.toLowerCase())
                          ) {
                            return val;
                          }
                        }
                      )
                      .map(
                        (
                          plug: {
                            _id: string;
                            pluginName: string | undefined;
                            pluginDesc: string | undefined;
                            pluginCreatedBy: string;
                            uninstalledOrgs: string[];
                            getInstalledPlugins: () => any;
                          },
                          i: React.Key | null | undefined
                        ): JSX.Element => (
                          <AddOnEntry
                            id={plug._id}
                            key={i}
                            title={plug.pluginName}
                            description={plug.pluginDesc}
                            createdBy={plug.pluginCreatedBy}
                            component={'Special  Component'}
                            modified={(): void => {
                              console.log('Plugin is modified');
                            }}
                            getInstalledPlugins={getInstalledPlugins}
                            uninstalledOrgs={plug.uninstalledOrgs}
                          />
                        )
                      )
                  )}*/}
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
