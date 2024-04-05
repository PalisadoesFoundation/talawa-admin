<<<<<<< HEAD
import React, { useState } from 'react';
// import PropTypes from 'react';
import styles from './AddOnStore.module.css';
import AddOnEntry from '../AddOnEntry/AddOnEntry';
import Action from '../../support/components/Action/Action';
import { useQuery } from '@apollo/client';
import { PLUGIN_GET } from 'GraphQl/Queries/Queries'; // PLUGIN_LIST
import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import PluginHelper from 'components/AddOn/support/services/Plugin.helper';
import { store } from './../../../../state/store';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
=======
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'react';
import styles from './AddOnStore.module.css';
import AddOnEntry from '../AddOnEntry/AddOnEntry';
import Action from '../../support/components/Action/Action';
import SidePanel from 'components/AddOn/support/components/SidePanel/SidePanel';
import MainContent from 'components/AddOn/support/components/MainContent/MainContent';
import { useQuery } from '@apollo/client';
import {
  ADMIN_LIST,
  MEMBERS_LIST,
  PLUGIN_GET,
  USER_LIST,
} from 'GraphQl/Queries/Queries'; // PLUGIN_LIST
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../state/reducers';
import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import AddOnRegister from '../AddOnRegister/AddOnRegister';
import PluginHelper from 'components/AddOn/support/services/Plugin.helper';
import { store } from './../../../../state/store';
import { useTranslation } from 'react-i18next';
import Loader from 'components/Loader/Loader';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

function addOnStore(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'addOnStore' });
  document.title = t('title');

  const [isStore, setIsStore] = useState(true);
  const [showEnabled, setShowEnabled] = useState(true);
  const [searchText, setSearchText] = useState('');
<<<<<<< HEAD
  const [, setDataList] = useState([]);

  // type plugData = { pluginName: String, plug };
  const { data, loading } = useQuery(PLUGIN_GET);

  const { orgId } = useParams();

  /* istanbul ignore next */
  const getStorePlugins = async (): Promise<void> => {
    let plugins = await new PluginHelper().fetchStore();
    const installIds = (await new PluginHelper().fetchInstalled()).map(
      (plugin: any) => plugin.id,
=======
  const [dataList, setDataList] = useState([]);

  const [render, setRender] = useState(true);
  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const plugins = useSelector((state: RootState) => state.plugins);
  const { installed, addonStore } = plugins;
  // type plugData = { pluginName: String, plug };
  const { data, loading, error } = useQuery(PLUGIN_GET);
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getStorePlugins = async () => {
    let plugins = await new PluginHelper().fetchStore();
    const installIds = (await new PluginHelper().fetchInstalled()).map(
      (plugin: any) => plugin.id
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
    // setRender((current) => !current);
    // const {
    //   data: newData,
    //   loading: newLoading,
    //   error: newError,
    // } = useQuery(PLUGIN_GET);
    // data = newData;
    // loading = newLoading;
    // error = newError;
    // const plugins = await new PluginHelper().fetchInstalled();
    // store.dispatch({ type: 'UPDATE_INSTALLED', payload: plugins });
    // return plugins;
  };

<<<<<<< HEAD
  const updateSelectedTab = (tab: any): void => {
    setIsStore(tab === 'available');
    /* istanbul ignore next */
=======
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

  // useEffect(() => {
  //   pluginModified();
  // }, []);

  const updateSelectedTab = (tab: any): void => {
    setIsStore(tab === 'available');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
  return (
    <>
<<<<<<< HEAD
      <Row>
        <Col col={3}>
          <Action label={t('search')}>
            <Form.Control
              type="name"
              id="searchname"
              className={styles.actioninput}
              placeholder={t('searchName')}
              autoComplete="off"
              required
              onChange={(e): void => setSearchText(e.target.value)}
            />
          </Action>
          {!isStore && (
            <Action label={t('filter')}>
              <Form>
                <div key={`inline-radio`} className="mb-3">
                  <Form.Check
                    inline
                    label={t('enable')}
                    name="radio-group"
                    type="radio"
                    value="enabled"
                    onChange={filterChange}
                    checked={showEnabled}
                    className={styles.actionradio}
                    id={`inline-radio-1`}
                  />
                  <Form.Check
                    inline
                    label={t('disable')}
                    name="radio-group"
                    type="radio"
                    value="disabled"
                    onChange={filterChange}
                    checked={!showEnabled}
                    className={styles.actionradio}
                    id={`inline-radio-2`}
                  />
                </div>
              </Form>
            </Action>
          )}
        </Col>
        <Col col={8}>
          <div className={styles.justifysp}>
            <p className={styles.logintitle}>{t('pHeading')}</p>
            {searchText ? (
              <p className="mb-2 text-muted author">
                Search results for <b>{searchText}</b>
              </p>
            ) : null}

            <Tabs
              defaultActiveKey="available"
              id="uncontrolled-tab-example"
              className="mb-3"
              onSelect={updateSelectedTab}
            >
              <Tab eventKey="available" title={t('available')}>
                {data.getPlugins.filter(
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
                  },
                ).length === 0 ? (
                  <h4> {t('pMessage')}</h4>
                ) : (
                  data.getPlugins
                    .filter(
=======
      <OrganizationScreen screenName="Plugin Store" title={t('title')}>
        <Row>
          <Col col={3}>
            <Action label={t('search')}>
              <Form.Control
                type="name"
                id="searchname"
                className={styles.actioninput}
                placeholder={t('searchName')}
                autoComplete="off"
                required
                onChange={(e): void => setSearchText(e.target.value)}
              />
            </Action>
            {!isStore && (
              <Action label={t('filter')}>
                <Form>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label={t('enable')}
                      name="radio-group"
                      type="radio"
                      value="enabled"
                      onChange={filterChange}
                      checked={showEnabled}
                      className={styles.actionradio}
                      id={`inline-radio-1`}
                    />
                    <Form.Check
                      inline
                      label={t('disable')}
                      name="radio-group"
                      type="radio"
                      value="disabled"
                      onChange={filterChange}
                      checked={!showEnabled}
                      className={styles.actionradio}
                      id={`inline-radio-2`}
                    />
                  </div>
                </Form>
              </Action>
            )}
          </Col>
          <Col col={8}>
            <div className={styles.justifysp}>
              <p className={styles.logintitle}>{t('pHeading')}</p>
              {searchText ? (
                <p className="mb-2 text-muted author">
                  Search results for <b>{searchText}</b>
                </p>
              ) : null}

              <Tabs
                defaultActiveKey="available"
                id="uncontrolled-tab-example"
                className="mb-3"
                onSelect={updateSelectedTab}
              >
                <Tab eventKey="available" title={t('available')}>
                  {console.log(
                    data.getPlugins.filter(
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                      },
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
                        i: React.Key | null | undefined,
                      ): JSX.Element => (
                        <AddOnEntry
                          id={plug._id}
                          key={i}
                          title={plug.pluginName}
                          description={plug.pluginDesc}
                          createdBy={plug.pluginCreatedBy}
                          // isInstalled={plug.pluginInstallStatus}
                          // configurable={plug.pluginInstallStatus}
                          component={'Special  Component'}
                          modified={true}
                          getInstalledPlugins={getInstalledPlugins}
                          uninstalledOrgs={plug.uninstalledOrgs}
                        />
                      ),
                    )
                )}
              </Tab>
              <Tab eventKey="installed" title={t('install')}>
                {data.getPlugins
                  .filter(
                    (plugin: any) => !plugin.uninstalledOrgs.includes(orgId),
                  )
                  .filter(
=======
                      }
                    )
                  )}
                  {data.getPlugins.filter(
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                    },
                  ).length === 0 ? (
                  <h4>{t('pMessage')} </h4>
                ) : (
                  data.getPlugins
                    .filter(
                      (plugin: any) => !plugin.uninstalledOrgs.includes(orgId),
                    )
=======
                    }
                  ).length === 0 ? (
                    <h4> {t('pMessage')}</h4>
                  ) : (
                    data.getPlugins
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
                            // isInstalled={plug.pluginInstallStatus}
                            // configurable={plug.pluginInstallStatus}
                            component={'Special  Component'}
                            modified={(): void => {
                              console.log('Plugin is modified');
                            }}
                            getInstalledPlugins={getInstalledPlugins}
                            uninstalledOrgs={plug.uninstalledOrgs}
                          />
                        )
                      )
                  )}
                </Tab>
                <Tab eventKey="installed" title={t('install')}>
                  {data.getPlugins
                    .filter((plugin: any) => plugin.pluginInstallStatus == true)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                      },
                    )
                    .map(
                      (
                        plug: {
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                          _id: string;
                          pluginName: string | undefined;
                          pluginDesc: string | undefined;
                          pluginCreatedBy: string;
<<<<<<< HEAD
                          uninstalledOrgs: string[];
                          pluginInstallStatus: boolean | undefined;
                          getInstalledPlugins: () => any;
                        },
                        i: React.Key | null | undefined,
                      ): JSX.Element => (
                        <AddOnEntry
                          id={plug._id}
                          key={i}
                          title={plug.pluginName}
                          description={plug.pluginDesc}
                          createdBy={plug.pluginCreatedBy}
                          // isInstalled={plug.pluginInstallStatus}
                          // configurable={plug.pluginInstallStatus}
                          component={'Special  Component'}
                          modified={true}
                          getInstalledPlugins={getInstalledPlugins}
                          uninstalledOrgs={plug.uninstalledOrgs}
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
                            // isInstalled={plug.pluginInstallStatus}
                            // configurable={plug.pluginInstallStatus}
                            component={'Special  Component'}
                            modified={(): void => {
                              console.log('Plugin is modified');
                            }}
                            getInstalledPlugins={getInstalledPlugins}
                            uninstalledOrgs={plug.uninstalledOrgs}
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    </>
  );
}

addOnStore.defaultProps = {};

addOnStore.propTypes = {};

export default addOnStore;
